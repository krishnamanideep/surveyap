import { useState } from 'react';
import { Bell, Search, User as UserIcon, Menu, X, WifiOff } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/SurveyContext';

export default function Navbar({ toggleSidebar, isMobile }) {
    const [showNotifications, setShowNotifications] = useState(false);
    const { currentUser } = useAuth();
    const { notifications, markAsRead, markAllRead, isOnline } = useData();

    // Only show notifications for admin or based on specific role logic, for MVP admin sees all system notifications
    const displayNotifs = currentUser?.role === 'admin' ? notifications : [];
    const unreadCount = displayNotifs.filter(n => !n.read).length;

    return (
        <header className="h-16 glass sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-4 flex-1">
                {isMobile && (
                    <button
                        className="p-1.5 -ml-1.5 text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                        onClick={toggleSidebar}
                    >
                        <Menu size={24} />
                    </button>
                )}

                {/* Search Bar - hidden on very small screens */}
                <div className="relative hidden sm:block max-w-md w-full">
                    <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search surveys, officers..."
                        className="w-full bg-slate-100 border-none rounded-full py-2 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-shadow"
                    />
                </div>
            </div>

            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
                {!isOnline && (
                    <div className="flex items-center gap-2 bg-red-50 text-red-600 px-3 py-1.5 rounded-full border border-red-100 animate-pulse hidden sm:flex">
                        <WifiOff size={14} />
                        <span className="text-xs font-semibold uppercase tracking-wider">Offline Module</span>
                    </div>
                )}

                {/* Notifications Dropdown */}
                <div className="relative">
                    <button
                        className="w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors relative"
                        onClick={() => setShowNotifications(!showNotifications)}
                    >
                        <Bell size={20} />
                        {unreadCount > 0 && (
                            <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                        )}
                    </button>

                    {showNotifications && (
                        <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden transform opacity-100 scale-100 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                            <div className="flex items-center justify-between p-3 border-b border-slate-100 bg-slate-50/50">
                                <h4 className="font-semibold text-sm text-slate-800">Notifications</h4>
                                <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600">
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="max-h-64 overflow-y-auto">
                                {displayNotifs.length > 0 ? (
                                    displayNotifs.map(notif => (
                                        <div
                                            key={notif.id}
                                            className={`p-3 border-b border-slate-50 flex items-start gap-3 cursor-pointer transition-colors hover:bg-slate-50 ${notif.read ? 'opacity-60' : ''}`}
                                            onClick={() => markAsRead(notif.id)}
                                        >
                                            {!notif.read && <div className="w-2 h-2 mt-1.5 rounded-full bg-brand-500 shrink-0" />}
                                            <div className={notif.read ? 'pl-5' : ''}>
                                                <p className="text-sm font-medium text-slate-800">{notif.title}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{notif.message}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-4 text-center text-sm text-slate-500">
                                        No new notifications
                                    </div>
                                )}
                            </div>
                            {unreadCount > 0 && (
                                <div className="p-2 border-t border-slate-100 text-center">
                                    <button
                                        className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                                        onClick={markAllRead}
                                    >
                                        Mark all read
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

                <button className="flex items-center gap-2.5 p-1 pr-3 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-500 to-brand-500 flex items-center justify-center text-white shadow-sm shadow-brand-500/20">
                        <UserIcon size={16} />
                    </div>
                    <div className="hidden md:flex flex-col items-start translate-y-0.5">
                        <span className="text-sm font-semibold text-slate-800 leading-none">{currentUser?.name || 'Loading...'}</span>
                        <span className="text-[10px] font-medium text-slate-500 mt-1 uppercase tracking-wider">{currentUser?.role === 'admin' ? 'Administrator' : 'Field Officer'}</span>
                    </div>
                </button>
            </div>
        </header>
    );
}
