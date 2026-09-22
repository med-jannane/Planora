import React, { useState } from 'react';
import type { TeamMember, Task } from '../types';
import { Mail, Send, CheckCircle2, Key, Copy, GitBranch, GitCommit } from 'lucide-react';

interface TeamNotificationsProps {
  teamMembers: TeamMember[];
  tasks: Task[];
  projectCode?: string;
  projectName?: string;
  onSendEmailNotification: (recipient: string, taskTitle: string) => void;
}

export const TeamNotifications: React.FC<TeamNotificationsProps> = ({
  teamMembers,
  tasks,
  projectCode = 'SPRINT-8942',
  projectName = 'sprint',
  onSendEmailNotification,
}) => {
  const [sentNotice, setSentNotice] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [inviteEmail, setInviteEmail] = useState<string>('');
  const [inviteName, setInviteName] = useState<string>('');
  const [isSending, setIsSending] = useState<boolean>(false);

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

  const handleSendInviteEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim()) return;

    setIsSending(true);
    try {
      const response = await fetch('http://localhost:8080/api/send-invitation', {
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
      setSentNotice(`Invitation et Clef Primaire (${projectCode}) envoyées à ${inviteEmail} via Gmail (map45lap@gmail.com) !`);
      setInviteEmail('');
      setInviteName('');
    } catch {
      onSendEmailNotification(inviteEmail.trim(), `Invitation au projet ${projectName} (Code: ${projectCode})`);
      setSentNotice(`Invitation enregistrée pour ${inviteEmail} (Code: ${projectCode}) !`);
    } finally {
      setIsSending(false);
      setTimeout(() => setSentNotice(null), 5000);
    }
  };

  const handleSendSingleEmail = (member: TeamMember) => {
    onSendEmailNotification(member.email, `Récapitulatif Sprints & Tâches - Code ${projectCode}`);
    setSentNotice(`Email de récapitulatif envoyé à ${member.name} (${member.email}) !`);
    setTimeout(() => setSentNotice(null), 4000);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top GitHub-Style Manager Profile & Primary Key Banner */}
      <div className="p-5 rounded-2xl bg-[#191A23] text-white border-2 border-[#191A23] shadow-[5px_5px_0px_#191A23] space-y-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-[#B9FF66] text-[#191A23] border-2 border-[#191A23] flex items-center justify-center font-extrabold text-lg shadow-[2px_2px_0px_#191A23]">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-white">Profil Manager / Chef de Projet</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#B9FF66] text-[#191A23] font-extrabold border border-[#191A23]">
                  GitHub Organization Sync
                </span>
              </div>
              <p className="text-[11px] text-white/75 font-medium mt-0.5">
                Projet: <strong className="text-[#B9FF66]">{projectName}</strong> • Service Mail: <strong className="text-[#38BDF8]">map45lap@gmail.com</strong>
              </p>
            </div>
          </div>

          {/* Primary Key / Project Code Badge */}
          <div className="flex items-center gap-2.5 bg-white/10 p-2.5 rounded-xl border border-white/20 shrink-0">
            <div className="space-y-0.5">
              <p className="text-[9px] font-extrabold text-[#B9FF66] uppercase tracking-wider flex items-center gap-1">
                <Key className="w-3 h-3 text-[#B9FF66]" /> Clef Primaire (Code d'Équipe)
              </p>
              <p className="text-lg font-mono font-extrabold text-white tracking-widest">{projectCode}</p>
            </div>
            <button
              onClick={handleCopyCode}
              className="px-3 py-1.5 rounded-lg bg-[#B9FF66] hover:bg-white text-[#191A23] font-extrabold text-xs flex items-center gap-1 border border-[#191A23] transition-all shadow-[2px_2px_0px_#191A23]"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>{copiedCode ? 'Copié !' : 'Copier'}</span>
            </button>
          </div>
        </div>

        {/* Quick Email Invite Sender Form */}
        <form onSubmit={handleSendInviteEmail} className="flex flex-col md:flex-row items-center gap-3 pt-1">
          <span className="text-xs font-extrabold text-white/90 shrink-0 flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-[#B9FF66]" /> Inviter par Email :
          </span>
          <input
            type="text"
            placeholder="Nom du membre (ex: Alex)"
            value={inviteName}
            onChange={(e) => setInviteName(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white text-[#191A23] text-xs font-bold border-2 border-[#191A23] focus:outline-none w-full md:w-44"
          />
          <input
            type="email"
            required
            placeholder="Email du membre (ex: alex@gmail.com)"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white text-[#191A23] text-xs font-bold border-2 border-[#191A23] focus:outline-none flex-1 w-full"
          />
          <button
            type="submit"
            disabled={isSending}
            className="px-4 py-1.5 rounded-xl bg-[#B9FF66] hover:bg-white text-[#191A23] font-extrabold text-xs flex items-center gap-1.5 border-2 border-[#191A23] transition-all shrink-0 shadow-[2px_2px_0px_#191A23] active:translate-x-0.5 active:translate-y-0.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSending ? 'Envoi Gmail...' : 'Envoyer Clef & Invitation'}</span>
          </button>
        </form>
      </div>

      {sentNotice && (
        <div className="p-3.5 rounded-xl bg-[#B9FF66] border-2 border-[#191A23] text-[#191A23] text-xs font-extrabold flex items-center gap-2 shadow-[3px_3px_0px_#191A23]">
          <CheckCircle2 className="w-4 h-4 text-[#191A23]" /> {sentNotice}
        </div>
      )}

      {/* GitHub-Style Organization Members Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-extrabold text-[#191A23] flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-[#191A23]" /> Membres & Activité d'Équipe ({teamMembers.length})
          </h3>
          <span className="text-[11px] font-mono font-extrabold text-[#191A23]/70">
            Rejoints avec la Clef {projectCode}
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


