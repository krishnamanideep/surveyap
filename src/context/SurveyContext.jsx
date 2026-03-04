import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const SurveyContext = createContext();

export function useData() {
    return useContext(SurveyContext);
}

export function SurveyProvider({ children }) {
    const [auditLogs, setAuditLogs] = useState([
        { id: 1, time: new Date().toISOString(), action: 'System Init', user: 'System', details: 'Mock database initialized.' }
    ]);
    const [offlineQueue, setOfflineQueue] = useState([]);
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    const [surveys, setSurveys] = useState([
        { id: 'SUR-1042', name: 'Ramesh Kumar', role: 'Mason', submitter: 'Field Officer Tracker', date: new Date().toISOString().split('T')[0], status: 'pending', gps: true, location: { lat: 28.6139, lng: 77.2090 }, region: 'North', approvalChain: [] },
        { id: 'SUR-1041', name: 'Suresh Singh', role: 'Carpenter', submitter: 'Field Officer Tracker', date: new Date().toISOString().split('T')[0], status: 'approved', gps: true, location: { lat: 12.9716, lng: 77.5946 }, region: 'South', approvalChain: [] },
        { id: 'SUR-1040', name: 'Anita Devi', role: 'Helper', submitter: 'Field Officer Tracker', date: '2023-11-19', status: 'rejected', gps: false, region: 'East', approvalChain: [] },
        { id: 'SUR-1039', name: 'Vikram Patel', role: 'Electrician', submitter: 'Field Officer Tracker', date: '2023-11-19', status: 'approved', gps: true, location: { lat: 19.0760, lng: 72.8777 }, region: 'West', approvalChain: [] },
        { id: 'SUR-1038', name: 'Priya Sharma', role: 'Plumber', submitter: 'Field Officer Tracker', date: '2023-11-18', status: 'fm_approved', gps: true, location: { lat: 26.9124, lng: 75.7873 }, region: 'North', approvalChain: [] },
        { id: 'SUR-1037', name: 'Mohammad Ali', role: 'Mason', submitter: 'Field Officer Tracker', date: '2023-11-18', status: 'rm_approved', gps: true, location: { lat: 13.0827, lng: 80.2707 }, region: 'South', approvalChain: [] },
        { id: 'SUR-1036', name: 'Kavita Reddy', role: 'Helper', submitter: 'Field Officer Tracker', date: '2023-11-17', status: 'pending', gps: false, region: 'East', approvalChain: [] },
        { id: 'SUR-1035', name: 'Sanjay Gupta', role: 'Plumber', submitter: 'Field Officer Tracker', date: '2023-11-17', status: 'approved', gps: true, location: { lat: 22.3039, lng: 70.8022 }, region: 'West', approvalChain: [] },
    ]);

    const [notifications, setNotifications] = useState([
        { id: 1, title: 'New Survey Submitted', message: 'Ramesh Kumar submitted #SUR-1043', read: false },
        { id: 2, title: 'Verification Pending', message: '5 surveys require attention', read: false },
    ]);

    useEffect(() => {
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const addLog = useCallback((action, user, details) => {
        setAuditLogs(prev => [{
            id: Date.now() + Math.random(),
            time: new Date().toISOString(),
            action,
            user,
            details
        }, ...prev]);
    }, []);

    // Also auto-sync offline queue when online
    useEffect(() => {
        if (isOnline && offlineQueue.length > 0) {
            // Sync all
            const synced = offlineQueue.map(q => ({ ...q, status: 'pending' }));
            setSurveys(prev => [...synced, ...prev]);
            setOfflineQueue([]);
            addLog('Offline Sync', 'System', `Auto-synced ${synced.length} records to server.`);
        }
    }, [isOnline, offlineQueue, addLog]);

    const addSurvey = (survey, currentUser) => {
        const newId = `SUR-${1000 + surveys.length + offlineQueue.length + 50}`;
        const newSurvey = {
            id: newId,
            ...survey,
            date: new Date().toISOString().split('T')[0],
            status: isOnline ? 'pending' : 'queued_offline',
            approvalChain: []
        };

        if (isOnline) {
            setSurveys(prev => [newSurvey, ...prev]);
        } else {
            setOfflineQueue(prev => [newSurvey, ...prev]);
        }

        addLog('Survey Created', currentUser?.name || survey.submitter, `Created survey ${newId}`);

        if (isOnline) {
            const notif = {
                id: Date.now(),
                title: 'New Survey Submitted',
                message: `${survey.name} submitted ${newId}`,
                read: false,
            };
            setNotifications(prev => [notif, ...prev]);
        }

        return newId;
    };

    const updateSurveyStatus = (id, newStatus, reviewer, comments = '') => {
        setSurveys(prev => prev.map(s => {
            if (s.id === id) {
                const updatedChain = [...(s.approvalChain || []), {
                    reviewer: reviewer?.name,
                    role: reviewer?.role,
                    status: newStatus,
                    comments,
                    time: new Date().toISOString()
                }];
                return { ...s, status: newStatus, approvalChain: updatedChain };
            }
            return s;
        }));

        addLog(`Survey ${newStatus.toUpperCase()}`, reviewer?.name || 'Unknown', `Updated status for ${id}. Comments: ${comments || 'None'}`);
    };

    const markAllRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const value = {
        surveys,
        offlineQueue,
        auditLogs,
        notifications,
        isOnline,
        addSurvey,
        updateSurveyStatus,
        markAllRead,
        markAsRead,
        addLog
    };

    return (
        <SurveyContext.Provider value={value}>
            {children}
        </SurveyContext.Provider>
    );
}
