import React, { useState } from 'react';
import { Bell, PlusCircle, CheckCircle2, LogOut, FolderKanban } from 'lucide-react';
import type { AppNotification, UserProfile, ProjectRecord } from '../types';

interface NavbarProps {
  projectName: string;
  projectCode?: string;
  user?: UserProfile | null;
  notifications: AppNotification[];
  projects?: ProjectRecord[];
  onSelectProject?: (code: string) => void;
  onNewProject: () => void;
  onOpenProfile?: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  projectName, 
  projectCode, 
  user, 
  notifications, 
  projects = [],
  onSelectProject,
  onNewProject, 
  onOpenProfile,
  onLogout
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="min-h-[4.5rem] py-2 bg-white border-b-2 border-[#191A23] sticky top-0 z-50 px-4 md:px-8 flex items-center justify-between font-sans gap-3 backdrop-blur-md bg-white/95">
      {/* Left Branding & Multi-Project Switcher */}
      <div className="flex items-center gap-3 shrink-0">
        <img src="/logo.png" alt="Planora" className="h-11 md:h-13 w-auto object-contain" />
        
        <div className="hidden sm:flex items-center gap-2">
          {projects.length > 0 && onSelectProject ? (
            <div className="relative flex items-center gap-1 bg-[#F3F3F3] p-1.5 rounded-xl border-2 border-[#191A23]">
              <FolderKanban className="w-4 h-4 text-[#191A23] shrink-0 ml-1" />
              <select
                value={projectCode || ''}
                onChange={(e) => onSelectProject(e.target.value)}
                className="bg-transparent text-xs font-extrabold text-[#191A23] focus:outline-none cursor-pointer pr-1"
              >
                {projects.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name} ({p.code})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div>
              {projectCode && (
                <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-[#191A23] text-[#B9FF66] border border-[#191A23] inline-block">
                  Code: {projectCode}
                </span>
              )}
              <p className="text-[11px] font-bold text-[#191A23]/70">
                {projectName || 'Gestion Intelligente de Projet'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* User Identity Code Badge */}
        {user && (
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#F3F3F3] hover:bg-[#B9FF66] border-2 border-[#191A23] text-[#191A23] transition-all shadow-[2px_2px_0px_#191A23]"
          >
            <div className="w-6 h-6 rounded-lg bg-[#191A23] text-[#B9FF66] flex items-center justify-center font-extrabold text-xs">
              {user.avatar || user.name.charAt(0)}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-[10px] font-extrabold leading-none">{user.name}</p>
              <p className="text-[9px] font-mono font-bold text-[#191A23]/70 leading-tight">{user.user_code}</p>
            </div>
          </button>
        )}

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 md:p-2.5 rounded-xl bg-white border-2 border-[#191A23] text-[#191A23] hover:bg-[#B9FF66] transition-colors shadow-[2px_2px_0px_#191A23]"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#191A23] text-[10px] font-extrabold text-[#B9FF66] flex items-center justify-center border border-[#191A23]">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-72 sm:w-96 bg-white border-2 border-[#191A23] rounded-3xl shadow-[6px_6px_0px_#191A23] z-50 p-4 sm:p-5">
              <div className="flex items-center justify-between pb-3 border-b-2 border-[#191A23]">
                <h4 className="text-sm font-extrabold text-[#191A23] flex items-center gap-2">
                  <Bell className="w-4 h-4" /> Notifications
                </h4>
                <span className="text-xs font-bold text-[#191A23]/60">{notifications.length} messages</span>
              </div>
              <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto pr-1">
                {notifications.length === 0 ? (
                  <p className="text-xs text-[#191A23]/50 text-center py-4 font-medium">Aucune notification pour le moment.</p>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif.id} className="p-3 rounded-2xl bg-[#F3F3F3] border-2 border-[#191A23] text-xs space-y-1">
                      <div className="flex items-center justify-between text-[#191A23] font-extrabold">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#191A23]" /> {notif.title}
                        </span>
                        <span className="text-[10px] text-[#191A23]/60 font-semibold">{notif.timestamp}</span>
                      </div>
                      <p className="text-[#191A23]/80 font-medium leading-relaxed">{notif.message}</p>
                      <div className="pt-1 text-[10px] text-[#191A23]/70 flex items-center justify-between font-mono font-bold">
                        <span>Pour: {notif.recipient}</span>
                        <span className="bg-[#B9FF66] text-[#191A23] px-1.5 py-0.5 rounded border border-[#191A23]">Envoyé</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* New Project Button - ONLY for Manager */}
        {user?.isManager && (
          <button
            onClick={onNewProject}
            className="flex items-center gap-1.5 px-3 md:px-4 py-2 rounded-xl bg-[#191A23] text-white hover:bg-[#B9FF66] hover:text-[#191A23] border-2 border-[#191A23] font-extrabold text-xs transition-all shadow-[2px_2px_0px_#191A23] active:translate-y-0.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Nouveau Cahier des Charges</span>
          </button>
        )}

        {/* Direct Logout Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            title="Déconnexion"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-rose-100 text-rose-800 border-2 border-[#191A23] font-extrabold text-xs transition-all shadow-[2px_2px_0px_#191A23]"
          >
            <LogOut className="w-4 h-4 text-rose-800" />
            <span className="hidden md:inline">Déconnexion</span>
          </button>
        )}
      </div>
    </header>
  );
};
