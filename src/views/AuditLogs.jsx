import React from 'react';
import { useData } from '../context/SurveyContext';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Clock, User, Activity } from 'lucide-react';

export default function AuditLogs() {
    const { auditLogs } = useData();
    const { currentUser } = useAuth();

    const isHighTier = currentUser?.role === 'admin' || currentUser?.role === 'regional_manager';

    if (!isHighTier) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-[60vh]">
                <ShieldAlert size={48} className="text-slate-300 mb-4" />
                <h2 className="text-xl font-bold text-slate-800">Access Restricted</h2>
                <p className="text-slate-500">You do not have permission to view system audit logs.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-1">
                    System Audit Logs
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                    Chronological record of system actions and data modifications.
                </p>
            </div>

            <div className="card !p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200">
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Timestamp</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Action</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {auditLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                                    <td className="px-6 py-4 text-sm text-slate-600 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} className="text-slate-400" />
                                            {new Date(log.time).toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-slate-800">
                                        <div className="flex items-center gap-2">
                                            <User size={14} className="text-slate-400" />
                                            {log.user}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="badge badge-neutral bg-slate-100 text-slate-700 font-mono text-xs">
                                            {log.action}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-600 max-w-md truncate">
                                        {log.details}
                                    </td>
                                </tr>
                            ))}
                            {auditLogs.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                                        <div className="flex flex-col items-center justify-center gap-2">
                                            <Activity size={32} className="text-slate-300 mb-2" />
                                            <p className="font-medium text-slate-600">No logs generated yet</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
