import { ShieldAlert, Users, LockKeyhole } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (role) => {
        login(role);
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 selection:bg-brand-500 selection:text-white">

            {/* Decorative Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-400/20 rounded-full blur-3xl" />
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-accent-400/20 rounded-full blur-3xl" />

            <div className="card max-w-md w-full relative z-10 !p-8 animate-in zoom-in-95 duration-500">

                <div className="flex flex-col items-center text-center mb-8">
                    <div className="flex items-center justify-center gap-6 mb-6">
                        <img src="/Company Logo.jpeg" alt="Company Logo" className="h-16 w-auto object-contain rounded shadow-sm" />
                        <img src="/AP Governement LOGO.png" alt="AP Government Logo" className="h-16 w-auto object-contain drop-shadow-sm" />
                    </div>
                    <div className="w-16 h-16 bg-gradient-to-br from-brand-500 to-accent-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-brand-500/30 mb-4 ring-8 ring-brand-50">
                        <ShieldAlert size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">SurveyFlow Portal</h1>
                    <p className="text-sm text-slate-500 mt-2">Select your role to access the system.</p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => handleLogin('admin')}
                        className="w-full group relative flex items-center gap-4 p-3 rounded-xl border border-slate-200 bg-white hover:border-brand-500 hover:shadow-md transition-all text-left"
                    >
                        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                            <LockKeyhole size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-800 transition-colors">System Admin</h3>
                            <p className="text-[11px] text-slate-500 mt-0.5">Global stats, approvals, audit logs.</p>
                        </div>
                    </button>

                    <button
                        onClick={() => handleLogin('regional_manager')}
                        className="w-full group relative flex items-center gap-4 p-3 rounded-xl border border-slate-200 bg-white hover:border-violet-500 hover:shadow-md transition-all text-left"
                    >
                        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-violet-50 group-hover:text-violet-600 transition-colors">
                            <Users size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-800 transition-colors">Regional Manager</h3>
                            <p className="text-[11px] text-slate-500 mt-0.5">Review Tier 2 approvals across regions.</p>
                        </div>
                    </button>

                    <button
                        onClick={() => handleLogin('field_manager')}
                        className="w-full group relative flex items-center gap-4 p-3 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 hover:shadow-md transition-all text-left"
                    >
                        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                            <Users size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-800 transition-colors">Field Manager</h3>
                            <p className="text-[11px] text-slate-500 mt-0.5">First-level review of field officer surveys.</p>
                        </div>
                    </button>

                    <button
                        onClick={() => handleLogin('field_officer')}
                        className="w-full group relative flex items-center gap-4 p-3 rounded-xl border border-slate-200 bg-white hover:border-accent-500 hover:shadow-md transition-all text-left"
                    >
                        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500 group-hover:bg-accent-50 group-hover:text-accent-600 transition-colors">
                            <Users size={20} />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-slate-800 transition-colors">Field Officer</h3>
                            <p className="text-[11px] text-slate-500 mt-0.5">Submit surveys natively & offline.</p>
                        </div>
                    </button>
                </div>

                <p className="text-center text-xs text-slate-400 mt-8 font-medium">
                    &copy; {new Date().getFullYear()} SurveyFlow Module MVP
                </p>
            </div>
        </div>
    );
}
