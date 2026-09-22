import React, { useState } from 'react';
import { Sparkles, Bell, Smartphone, PlusCircle, CheckCircle2 } from 'lucide-react';
import type { AppNotification } from '../types';

interface NavbarProps {
  projectName: string;
  projectCode?: string;
  notifications: AppNotification[];
  onNewProject: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ projectName, projectCode, notifications, onNewProject }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header className="h-16 bg-white border-b-2 border-[#191A23] sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between font-sans">
      {/* Left Branding */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#191A23] text-[#B9FF66] border-2 border-[#191A23] flex items-center justify-center shadow-[2px_2px_0px_#191A23]">
          <Sparkles className="w-4 h-4 text-[#B9FF66]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight text-[#191A23]">
              SprintAI
            </span>
            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#B9FF66] text-[#191A23] border border-[#191A23]">
              Web & Mobile PWA
            </span>
            {projectCode && (
              <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-[#191A23] text-[#B9FF66] border border-[#191A23]">
                Code: {projectCode}
              </span>
            )}
          </div>
          <p className="text-[11px] font-bold text-[#191A23]/70 hidden sm:block">
            {projectName || 'Gestion de Projet & Sprints par Agent IA'}
          </p>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2.5">
        {/* PWA Mobile Badge */}
        <div className="hidden md:flex items-center gap-1.5 text-[11px] font-extrabold px-3 py-1 rounded-xl bg-[#F3F3F3] border-2 border-[#191A23] text-[#191A23]">
          <Smartphone className="w-3.5 h-3.5 text-[#191A23]" />
          <span>App Mobile PWA</span>
        </div>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2.5 rounded-xl bg-white border-2 border-[#191A23] text-[#191A23] hover:bg-[#B9FF66] transition-colors shadow-[2px_2px_0px_#191A23]"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#191A23] text-[10px] font-extrabold text-[#B9FF66] flex items-center justify-center border border-[#191A23]">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border-2 border-[#191A23] rounded-3xl shadow-[6px_6px_0px_#191A23] z-50 p-5">
              <div className="flex items-center justify-between pb-3 border-b-2 border-[#191A23]">
                <h4 className="text-sm font-extrabold text-[#191A23] flex items-center gap-2">
                  <Bell className="w-4 h-4" /> Notifications & Mails Envoyés
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
                        <span className="bg-[#B9FF66] text-[#191A23] px-1.5 py-0.5 rounded border border-[#191A23]">Email Envoyé ✉️</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* New Project Button */}
        <button
          onClick={onNewProject}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#191A23] text-white hover:bg-[#B9FF66] hover:text-[#191A23] border-2 border-[#191A23] font-extrabold text-xs transition-all shadow-[3px_3px_0px_#191A23] active:translate-y-0.5"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Nouveau Cahier des Charges</span>
        </button>
      </div>
    </header>
  );
};
