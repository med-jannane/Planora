import React, { useState } from 'react';
import type { TeamMember, Task } from '../types';
import { Mail, Send, CheckCircle2, Copy, GitBranch, Link, UserPlus, AlertTriangle, Key, ShieldCheck, GitCommit } from 'lucide-react';

interface TeamNotificationsProps {
  teamMembers: TeamMember[];
  tasks: Task[];
  projectCode?: string;
  projectName?: string;
  isManager?: boolean;
  onSendEmailNotification: (recipient: string, taskTitle: string) => void;
  onAddMemberByCode?: (memberCode: string) => { success: boolean; message: string } | void;
}

export const TeamNotifications: React.FC<TeamNotificationsProps> = ({
  teamMembers,
  tasks,
  projectCode = 'SPRINT-8942',
  projectName = 'sprint',
  isManager = false,
  onSendEmailNotification,
  onAddMemberByCode,
}) => {
  const [noticeMessage, setNoticeMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Form states
  const [inviteEmail, setInviteEmail] = useState<string>('');
  const [inviteName, setInviteName] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

  // Add by member user identity code state
  const [inputMemberCode, setInputMemberCode] = useState<string>('');

  const getRoleColor = (role?: string) => {
    const r = (role || '').toLowerCase();
    if (r.includes('front') || r.includes('react')) return 'bg-[#B9FF66] text-[#191A23]';
    if (r.includes('back') || r.includes('laravel') || r.includes('api')) return 'bg-[#38BDF8] text-[#191A23]';
    if (r.includes('design') || r.includes('ui') || r.includes('ux')) return 'bg-[#FF70A6] text-[#191A23]';
    return 'bg-[#FACC15] text-[#191A23]';
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(projectCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  const handleCopyInvitationLink = () => {
    const inviteUrl = `${window.location.origin}${window.location.pathname}?join=${projectCode}`;
    navigator.clipboard.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const handleAddByCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMemberCode.trim()) return;

    if (onAddMemberByCode) {
      const res = onAddMemberByCode(inputMemberCode.trim());
      if (res) {
        setNoticeMessage({ text: res.message, isError: !res.success });
        if (res.success) {
          setInputMemberCode('');
        }
      }
      setTimeout(() => setNoticeMessage(null), 6000);
    }
  };

  const handleSendInviteEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setIsSending(true);
    const LARAVEL_API_URL = import.meta.env.VITE_LARAVEL_API_URL || (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:8080` : 'http://localhost:8080');
    try {
      const response = await fetch(`${LARAVEL_API_URL}/api/send-invitation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: inviteEmail.trim(),
          name: inviteName.trim() || 'Collaborateur',
          project_code: projectCode,
          project_name: projectName
        })
      });
      await response.json();
      setNoticeMessage({ text: `Invitation et Clef Primaire (${projectCode}) envoyées à ${inviteEmail} via Gmail (map45lap@gmail.com) !`, isError: false });
      setInviteEmail('');
      setInviteName('');
    } catch {
      onSendEmailNotification(inviteEmail.trim(), `Invitation au projet ${projectName} (Code: ${projectCode})`);
      setNoticeMessage({ text: `Invitation enregistrée pour ${inviteEmail} (Code: ${projectCode}) !`, isError: false });
    } finally {
      setIsSending(false);
      setTimeout(() => setNoticeMessage(null), 5000);
    }
  };

  const handleSendSingleEmail = (member: TeamMember) => {
    onSendEmailNotification(member.email, `Récapitulatif Sprints & Tâches - Code ${projectCode}`);
    setNoticeMessage({ text: `Email de récapitulatif envoyé à ${member.name} (${member.email}) !`, isError: false });
    setTimeout(() => setNoticeMessage(null), 4000);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top GitHub-Style Manager Profile & Primary Key Banner */}
      <div className="p-6 rounded-3xl bg-[#191A23] text-white border-3 border-[#191A23] shadow-[8px_8px_0px_#191A23] space-y-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-white/20 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#B9FF66] text-[#191A23] border-2 border-[#191A23] flex items-center justify-center font-extrabold text-xl shadow-[3px_3px_0px_#191A23]">
              <ShieldCheck className="w-6 h-6 text-[#191A23]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-white">Espace Manager & Intégration d'Équipe</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#B9FF66] text-[#191A23] font-extrabold border border-[#191A23]">
                  Code Projet: {projectCode}
                </span>
              </div>
              <p className="text-xs text-white/75 font-medium mt-0.5">
                Projet: <strong className="text-[#B9FF66]">{projectName}</strong> • Service Mail: <strong className="text-[#38BDF8]">Actif</strong>
              </p>
            </div>
          </div>

          {/* Invitation Link & Code Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyInvitationLink}
              className="px-4 py-2 rounded-xl bg-[#38BDF8] hover:bg-white text-[#191A23] font-extrabold text-xs flex items-center gap-1.5 border-2 border-[#191A23] transition-all shadow-[3px_3px_0px_#191A23]"
            >
              <Link className="w-4 h-4" />
              <span>{copiedLink ? 'Lien Copié !' : 'Générer / Copier Lien d\'Invitation'}</span>
            </button>

            <button
              onClick={handleCopyCode}
              className="px-4 py-2 rounded-xl bg-[#B9FF66] hover:bg-white text-[#191A23] font-extrabold text-xs flex items-center gap-1.5 border-2 border-[#191A23] transition-all shadow-[3px_3px_0px_#191A23]"
            >
              <Copy className="w-4 h-4" />
              <span>{copiedCode ? 'Code Copié !' : 'Copier Code Équipe'}</span>
            </button>
          </div>
        </div>

        {/* 2 OPTIONS: ADD BY MEMBER CODE OR SEND EMAIL INVITATION */}
        {isManager && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
            {/* OPTION 1: ADD MEMBER BY IDENTITY CODE */}
            <form onSubmit={handleAddByCode} className="p-4 rounded-2xl bg-white/10 border-2 border-white/20 space-y-2">
              <span className="text-xs font-extrabold text-[#B9FF66] uppercase tracking-wider flex items-center gap-1.5">
                <UserPlus className="w-4 h-4 text-[#B9FF66]" /> 1. Ajouter un membre par son Code Identité
              </span>
              <p className="text-[11px] text-white/70">
                Saisissez ou collez la clé primaire / code d'identité (ex: <code>USR-9482-PK</code>) transmis par le membre :
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="Ex: USR-9482-PK"
                  value={inputMemberCode}
                  onChange={(e) => setInputMemberCode(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white text-[#191A23] text-xs font-mono font-extrabold border-2 border-[#191A23] focus:outline-none flex-1 uppercase"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#B9FF66] hover:bg-white text-[#191A23] font-extrabold text-xs flex items-center gap-1 border-2 border-[#191A23] transition-all shadow-[2px_2px_0px_#191A23]"
                >
                  <span>Intégrer Membre</span>
                </button>
              </div>
            </form>

            {/* OPTION 2: EMAIL INVITE SENDER */}
            <form onSubmit={handleSendInviteEmail} className="p-4 rounded-2xl bg-white/10 border-2 border-white/20 space-y-2">
              <span className="text-xs font-extrabold text-[#38BDF8] uppercase tracking-wider flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-[#38BDF8]" /> 2. Inviter un Membre par Email
              </span>
              <p className="text-[11px] text-white/70">
                Envoie un e-mail automatique contenant le code d'accès au projet :
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  placeholder="Email (ex: alex@gmail.com)"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="px-3 py-2 rounded-xl bg-white text-[#191A23] text-xs font-bold border-2 border-[#191A23] focus:outline-none flex-1"
                />
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-4 py-2 rounded-xl bg-[#38BDF8] hover:bg-white text-[#191A23] font-extrabold text-xs flex items-center justify-center gap-1 border-2 border-[#191A23] transition-all shadow-[2px_2px_0px_#191A23]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSending ? 'Envoi...' : 'Envoyer Mail'}</span>
                </button>
              </div>
            </form>

          </div>
        )}
      </div>

      {noticeMessage && (
        <div className={`p-4 rounded-2xl border-2 border-[#191A23] text-xs font-extrabold flex items-center gap-2 shadow-[4px_4px_0px_#191A23] ${
          noticeMessage.isError
            ? 'bg-rose-100 text-rose-900 border-rose-900'
            : 'bg-[#B9FF66] text-[#191A23]'
        }`}>
          {noticeMessage.isError ? (
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-900" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-[#191A23] shrink-0" />
          )}
          <span>{noticeMessage.text}</span>
        </div>
      )}

      {/* GitHub-Style Organization Members Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-[#191A23] flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[#191A23]" /> Membres de l'Équipe Projet ({teamMembers.length})
          </h3>
          <span className="text-[11px] font-mono font-extrabold text-[#191A23]/70">
            Code d'Accès: {projectCode}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {teamMembers.map((member) => {
            const memberTasks = tasks.filter((t) => t.assignee === member.name);
            const totalHours = memberTasks.reduce((acc, t) => acc + t.estimated_hours, 0);

            return (
              <div key={member.id} className="p-4 rounded-2xl bg-white border-2 border-[#191A23] shadow-[4px_4px_0px_#191A23] space-y-3 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#191A23] text-[#B9FF66] border-2 border-[#191A23] flex items-center justify-center text-base font-extrabold shadow-[2px_2px_0px_#191A23]">
                        {member.avatar || member.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-extrabold text-[#191A23] flex items-center gap-1">
                          {member.name}
                        </h4>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold border border-[#191A23] inline-block ${getRoleColor(member.role)}`}>
                          {member.role}
                        </span>
                      </div>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#B9FF66] text-[#191A23] font-extrabold border border-[#191A23]">
                      {memberTasks.length} Tâches
                    </span>
                  </div>

                  {/* Member identity code */}
                  {member.user_code && (
                    <div className="px-2.5 py-1 rounded-lg bg-[#F3F3F3] border border-[#191A23] text-[10px] font-mono font-extrabold text-[#191A23] flex items-center justify-between">
                      <span>Clé: {member.user_code}</span>
                      <Key className="w-3 h-3 text-[#191A23]" />
                    </div>
                  )}

                  {/* Multi-selected functionalities */}
                  {member.functionalities && member.functionalities.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] text-[#191A23]/60 font-extrabold uppercase flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-[#191A23]" /> Compétences :
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {member.functionalities.map((func, fIdx) => (
                          <span key={fIdx} className="text-[9px] px-1.5 py-0.5 rounded bg-[#F3F3F3] text-[#191A23] border border-[#191A23] font-extrabold">
                            {func}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-[#191A23]/20 space-y-1 text-xs">
                    <div className="flex items-center justify-between text-[#191A23]/70 font-bold">
                      <span>Charge totale :</span>
                      <span className="font-extrabold text-[#191A23] font-mono">{totalHours}h</span>
                    </div>
                    <div className="flex items-center justify-between text-[#191A23]/70 font-bold">
                      <span>Email :</span>
                      <span className="text-[#191A23] font-mono text-[10px] truncate max-w-[140px] font-bold">{member.email}</span>
                    </div>
                  </div>

                  {/* GitHub-style task commits */}
                  <div className="space-y-1.5 pt-1">
                    <p className="text-[10px] text-[#191A23]/60 uppercase font-extrabold flex items-center gap-1">
                      <GitCommit className="w-3 h-3 text-[#191A23]" /> Tâches / Commit Feed :
                    </p>
                    {memberTasks.length === 0 ? (
                      <p className="text-[11px] text-[#191A23]/50 italic font-bold">Aucune tâche assignée</p>
                    ) : (
                      memberTasks.map((t) => (
                        <div key={t.id} className="p-2 rounded-xl bg-[#F3F3F3] border-2 border-[#191A23] text-[11px] font-bold flex items-center justify-between">
                          <span className="text-[#191A23] truncate">{t.title}</span>
                          <span className="text-[#191A23] font-mono text-[10px] font-extrabold bg-[#B9FF66] px-1.5 rounded border border-[#191A23] shrink-0">{t.estimated_hours}h</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleSendSingleEmail(member)}
                  className="w-full py-2 rounded-xl bg-[#F3F3F3] hover:bg-[#B9FF66] text-[#191A23] font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all border-2 border-[#191A23] shadow-[2px_2px_0px_#191A23] active:translate-x-0.5 active:translate-y-0.5 mt-2"
                >
                  <Send className="w-3.5 h-3.5" /> Envoyer Email
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
