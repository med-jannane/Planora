import React, { useState } from 'react';
import { Key, Copy, CheckCircle2, ShieldCheck, Mail, Sparkles, Layers } from 'lucide-react';
import type { UserProfile } from '../types';

interface ProfileViewProps {
  user: UserProfile;
  projectCode?: string;
  onLogout: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, projectCode, onLogout }) => {
  const [copiedCode, setCopiedCode] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(user.user_code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  return (
    <div className="space-y-6 font-sans max-w-4xl mx-auto">
      {/* Top Banner Card */}
      <div className="p-6 rounded-3xl bg-[#191A23] text-white border-3 border-[#191A23] shadow-[8px_8px_0px_#191A23] space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#B9FF66] text-[#191A23] border-2 border-[#191A23] flex items-center justify-center font-extrabold text-2xl shadow-[3px_3px_0px_#191A23]">
              {user.avatar || user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold text-white">{user.name}</h1>
                {user.isManager && (
                  <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-[#B9FF66] text-[#191A23] border border-[#191A23]">
                    👑 Chef de Projet / Manager
                  </span>
                )}
              </div>
              <p className="text-xs text-white/70 font-mono flex items-center gap-1.5 mt-1">
                <Mail className="w-3.5 h-3.5 text-[#B9FF66]" /> {user.email}
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs border-2 border-white shadow-[2px_2px_0px_#ffffff] transition-all"
          >
            Se Déconnecter
          </button>
        </div>

        {/* PRIMARY KEY IDENTITY CODE DISPLAY BOX */}
        <div className="p-4 rounded-2xl bg-white/10 border-2 border-white/20 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#B9FF66] flex items-center gap-1.5">
              <Key className="w-4 h-4 text-[#B9FF66]" /> Code d'Identité de votre Profil (Clef Primaire)
            </span>
            <span className="text-[10px] text-white/60 font-medium">Transmettez ce code à votre Manager</span>
          </div>

          <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border-2 border-[#191A23]">
            <div className="font-mono text-xl font-extrabold text-[#191A23] tracking-widest">
              {user.user_code}
            </div>
            <button
              onClick={handleCopyCode}
              className="px-4 py-2 rounded-xl bg-[#B9FF66] hover:bg-[#191A23] hover:text-[#B9FF66] text-[#191A23] font-extrabold text-xs flex items-center gap-1.5 border-2 border-[#191A23] transition-all shadow-[2px_2px_0px_#191A23]"
            >
              <Copy className="w-4 h-4" />
              <span>{copiedCode ? 'Copié !' : 'Copier mon Code'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Functionalities & Skills Badges Grid */}
      <div className="p-6 rounded-3xl bg-[#F3F3F3] border-2 border-[#191A23] shadow-[6px_6px_0px_#191A23] space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-[#191A23] flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#191A23]" /> 
            Vos Fonctionnalités & Domaine d'Expertise ({user.functionalities?.length || 0})
          </h3>
          <span className="text-xs font-extrabold px-2.5 py-1 rounded-md bg-[#B9FF66] border border-[#191A23] text-[#191A23]">
            Assignation IA Activée
          </span>
        </div>

        <p className="text-xs text-[#191A23]/75 font-bold leading-relaxed">
          Lors du découpage automatique du Cahier des Charges par l'IA, les tâches seront attribuées spécifiquement à votre profil selon ces fonctionnalités :
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {user.functionalities?.map((func, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-white border-2 border-[#191A23] shadow-[3px_3px_0px_#191A23] flex items-center gap-3 text-xs font-extrabold text-[#191A23]"
            >
              <CheckCircle2 className="w-4 h-4 text-[#191A23] shrink-0" />
              <span>{func}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Project Status Info */}
      <div className="p-6 rounded-3xl bg-white border-2 border-[#191A23] shadow-[6px_6px_0px_#191A23] space-y-3">
        <h3 className="text-base font-extrabold text-[#191A23] flex items-center gap-2">
          <Layers className="w-5 h-5 text-[#191A23]" /> Informations Espace de Travail
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div className="p-4 rounded-2xl bg-[#F3F3F3] border-2 border-[#191A23] space-y-1">
            <span className="text-[10px] uppercase font-extrabold text-[#191A23]/60">Projet Actuel</span>
            <p className="text-sm font-extrabold text-[#191A23] font-mono">{projectCode || 'SPRINT-8942'}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#F3F3F3] border-2 border-[#191A23] space-y-1">
            <span className="text-[10px] uppercase font-extrabold text-[#191A23]/60">Statut du Système</span>
            <p className="text-sm font-extrabold text-[#191A23] flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-[#191A23]" /> Planora IA Opérationnel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
