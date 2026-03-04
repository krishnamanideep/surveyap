import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/SurveyContext';
import { User as UserIcon, Mail, Shield, CheckCircle, Clock } from 'lucide-react';

export default function UserProfile() {
    const { currentUser } = useAuth();
    const { surveys } = useData();

    const userSurveys = surveys.filter(s => s.submitter === currentUser?.name);
    const approvedCount = userSurveys.filter(s => s.status.includes('approved')).length;
    const pendingCount = userSurveys.filter(s => s.status === 'pending').length;

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight mb-1">
                    My Profile
                </h1>
                <p className="text-sm text-slate-500 font-medium">
                    Manage your account details and view activity stats.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Profile Card */}
                <div className="card col-span-1 flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-brand-100 text-brand-600 rounded-full flex items-center justify-center mb-4 ring-8 ring-brand-50">
                        <UserIcon size={48} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-800">{currentUser?.name}</h2>
                    <p className="text-brand-600 font-semibold text-sm uppercase tracking-wider mt-1 mb-4">{currentUser?.role.replace('_', ' ')}</p>

                    <div className="w-full space-y-3 text-left border-t border-slate-100 pt-4 mt-2">
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <Mail size={16} className="text-slate-400" />
                            <span>{currentUser?.id.toLowerCase()}@surveyflow.local</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-600">
                            <Shield size={16} className="text-slate-400" />
                            <span>System ID: {currentUser?.id}</span>
                        </div>
                    </div>
                </div>

                {/* Stats & Activity */}
                <div className="card col-span-1 md:col-span-2 flex flex-col">
                    <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Personal Metrics</h3>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <CheckCircle size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Approved Surveys</p>
                                <p className="text-2xl font-bold text-slate-800">{approvedCount}</p>
                            </div>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                                <Clock size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pending Review</p>
                                <p className="text-2xl font-bold text-slate-800">{pendingCount}</p>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-4">Recent Activity</h3>
                    <div className="flex-1 overflow-y-auto pr-2">
                        {userSurveys.slice(0, 5).map(s => (
                            <div key={s.id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0 text-sm">
                                <div>
                                    <p className="font-semibold text-slate-800">Submitted {s.id}</p>
                                    <p className="text-xs text-slate-500">{s.date}</p>
                                </div>
                                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded badge ${s.status === 'approved' ? 'badge-success' : s.status === 'rejected' ? 'badge-error' : 'badge-warning'}`}>
                                    {s.status.replace('_', ' ')}
                                </span>
                            </div>
                        ))}
                        {userSurveys.length === 0 && (
                            <p className="text-sm text-slate-500 italic">No activity recorded yet.</p>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
