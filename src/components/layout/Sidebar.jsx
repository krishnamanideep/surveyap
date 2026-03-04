import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  ClipboardCheck,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  User
} from 'lucide-react';

export default function Sidebar({ isOpen, toggleSidebar, isMobile }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const { currentUser, logout } = useAuth();

  useEffect(() => {
    if (isMobile) setIsCollapsed(false);
  }, [isMobile]);

  const navItems = [
    { path: '/', label: 'Overview', icon: LayoutDashboard, roles: ['admin', 'regional_manager', 'field_manager', 'field_officer'] },
    { path: '/verification', label: 'Verifications', icon: ClipboardCheck, roles: ['admin', 'regional_manager', 'field_manager', 'field_officer'] },
    { path: '/survey', label: 'Survey Form', icon: FileText, roles: ['field_officer'] },
    { path: '/audit-logs', label: 'Audit Logs', icon: ShieldAlert, roles: ['admin', 'regional_manager'] },
  ];

  const handleToggleCollapse = () => {
    if (!isMobile) setIsCollapsed(!isCollapsed);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const filteredNavItems = navItems.filter(item => item.roles.includes(currentUser?.role));

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 transition-opacity"
          onClick={toggleSidebar}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen bg-white border-r border-slate-200 flex flex-col transition-all duration-300 z-50 shadow-lg shadow-slate-200/40
          ${isMobile ? (isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64') : (isCollapsed ? 'w-20 translate-x-0' : 'w-64 translate-x-0')}
        `}
      >
        {/* Header */}
        <div className={`h-16 flex items-center shrink-0 border-b border-slate-100 ${isCollapsed && !isMobile ? 'justify-center px-0' : 'justify-between px-4'}`}>
          <div className="flex items-center gap-2 overflow-hidden">
            <div className={`flex items-center shrink-0 ${isCollapsed && !isMobile ? '' : 'gap-2'}`}>
              <img src="/Company Logo.jpeg" alt="Company" className={`${isCollapsed && !isMobile ? 'h-8' : 'h-7'} w-auto max-w-[40px] object-contain rounded mix-blend-multiply`} />
              {(!isCollapsed || isMobile) && (
                <img src="/AP Governement LOGO.png" alt="AP Govt" className="h-7 w-auto max-w-[40px] object-contain mix-blend-multiply" />
              )}
            </div>
            {(!isCollapsed || isMobile) && (
              <span className="text-lg font-bold text-slate-800 tracking-tight truncate">SurveyFlow</span>
            )}
          </div>
          {!isMobile && (
            <button
              onClick={handleToggleCollapse}
              className="w-7 h-7 rounded-md bg-slate-50 flex items-center justify-center text-slate-500 border border-slate-200 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            >
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 py-5 flex flex-col gap-6 custom-scrollbar">
          <nav className="flex flex-col gap-1.5">
            {(!isCollapsed || isMobile) && (
              <div className="px-3 mb-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">Menu</div>
            )}

            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`
                    group relative flex items-center gap-3.5 px-3 py-2.5 rounded-lg font-medium text-sm transition-all duration-200
                    ${isCollapsed && !isMobile ? 'justify-center' : 'justify-start'}
                    ${isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                  `}
                  onClick={() => isMobile && toggleSidebar()}
                  title={isCollapsed && !isMobile ? item.label : ''}
                >
                  <Icon size={20} className={isActive ? 'text-brand-600' : 'text-slate-500 group-hover:text-slate-700 transition-colors'} />
                  {(!isCollapsed || isMobile) && <span>{item.label}</span>}

                  {/* Active Indicator Line */}
                  {isActive && (!isCollapsed || isMobile) && (
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-600 rounded-l-full shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100 shrink-0">
          <nav className="flex flex-col gap-1.5">
            <NavLink
              to="/profile"
              className={`
                group relative flex items-center gap-3.5 px-3 py-2.5 rounded-lg font-medium text-sm transition-all duration-200
                ${isCollapsed && !isMobile ? 'justify-center' : 'justify-start'}
                ${location.pathname === '/profile' ? 'bg-brand-50 text-brand-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
              `}
              onClick={() => isMobile && toggleSidebar()}
              title={isCollapsed && !isMobile ? 'Profile' : ''}
            >
              <User size={20} className={location.pathname === '/profile' ? 'text-brand-600' : 'text-slate-500'} />
              {(!isCollapsed || isMobile) && <span>My Profile</span>}
            </NavLink>

            <button
              onClick={handleLogout}
              className={`
                w-full flex items-center gap-3.5 px-3 py-2.5 rounded-lg font-medium text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors mt-1
                ${isCollapsed && !isMobile ? 'justify-center' : 'justify-start'}
              `}
              title={isCollapsed && !isMobile ? 'Logout' : ''}
            >
              <LogOut size={20} />
              {(!isCollapsed || isMobile) && <span>Logout</span>}
            </button>
          </nav>
        </div>
      </aside>
    </>
  );
}
