import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for existing session
        const storedUser = localStorage.getItem('surveyUser');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (role) => {
        let user;
        if (role === 'admin') {
            user = { role: 'admin', name: 'System Admin', id: 'ADM-01' };
        } else if (role === 'regional_manager') {
            user = { role: 'regional_manager', name: 'Regional Manager', id: 'RM-22' };
        } else if (role === 'field_manager') {
            user = { role: 'field_manager', name: 'Field Manager A', id: 'FM-10' };
        } else {
            user = { role: 'field_officer', name: 'Field Officer Tracker', id: 'FO-42' };
        }
        setCurrentUser(user);
        localStorage.setItem('surveyUser', JSON.stringify(user));
        return user;
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('surveyUser');
    };

    const value = {
        currentUser,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
