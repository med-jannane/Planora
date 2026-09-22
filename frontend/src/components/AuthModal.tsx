import React, { useState } from 'react';
import { X, Key, LogIn, UserPlus, Sparkles } from 'lucide-react';
import type { TeamMember } from '../types';

interface AuthModalProps {
  initialMode: 'login' | 'join_code' | 'signup_manager';
  onClose: () => void;
  onSuccessManager: (ownerName: string, ownerRole: string, ownerEmail: string) => void;
  onSuccessJoin: (member: TeamMember, projectCode: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  initialMode,
  onClose,
  onSuccessManager,
  onSuccessJoin,
}) => {
  const [mode, setMode] = useState<'login' | 'join_code' | 'signup_manager'>(initialMode);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Développeur Frontend');
  const [projectCode, setProjectCode] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (mode === 'signup_manager') {
      if (!fullName.trim() || !email.trim()) {
        setErrorMessage('Veuillez remplir tous les champs obligatoires.');
        return;
      }
      onSuccessManager(fullName.trim(), 'Chef de Projet (Manager)', email.trim());
    } else if (mode === 'join_code') {
      if (!fullName.trim() || !email.trim() || !projectCode.trim()) {
        setErrorMessage('Veuillez saisir votre nom, email et le Code d\'Équipe.');
        return;
      }
      const newMember: TeamMember = {
        id: Date.now().toString(),
        name: fullName.trim(),
        role: role,
        email: email.trim(),
        avatar: fullName.charAt(0).toUpperCase(),
      };
      onSuccessJoin(newMember, projectCode.trim().toUpperCase());
    } else {
      // Login mode
      if (!email.trim()) {
        setErrorMessage('Veuillez entrer votre adresse email.');
        return;
      }
      // Logged in as Manager
      onSuccessManager(fullName.trim() || email.split('@')[0], 'Chef de Projet', email.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-[#191A23]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white border-2 border-[#191A23] rounded-3xl max-w-md w-full p-6 space-y-5 shadow-[8px_8px_0px_#191A23] relative">
        {/* Header & Tabs */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#191A23]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#191A23] text-[#B9FF66] border border-[#191A23] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-[#191A23]">
              {mode === 'login' && 'Connexion à SprintAI'}
              {mode === 'join_code' && 'Rejoindre une Équipe avec Code'}
              {mode === 'signup_manager' && 'Créer un Compte Manager'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[#191A23] hover:bg-[#F3F3F3] border border-[#191A23]"
          >
            <X className="w-4 h-4 font-extrabold" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-3 gap-1 p-1 bg-[#F3F3F3] rounded-xl border-2 border-[#191A23]">
          <button
            type="button"
            onClick={() => setMode('signup_manager')}
            className={`py-1.5 rounded-lg text-[10px] font-extrabold transition-all border ${
              mode === 'signup_manager'
                ? 'bg-[#191A23] text-[#B9FF66] border-[#191A23] shadow-[1px_1px_0px_#B9FF66]'
                : 'text-[#191A23] border-transparent hover:bg-white'
            }`}
          >
            Créer Manager
          </button>
          <button
            type="button"
            onClick={() => setMode('join_code')}
            className={`py-1.5 rounded-lg text-[10px] font-extrabold transition-all border ${
              mode === 'join_code'
                ? 'bg-[#191A23] text-[#B9FF66] border-[#191A23] shadow-[1px_1px_0px_#B9FF66]'
                : 'text-[#191A23] border-transparent hover:bg-white'
            }`}
          >
            Code Équipe
          </button>
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-1.5 rounded-lg text-[10px] font-extrabold transition-all border ${
              mode === 'login'
                ? 'bg-[#191A23] text-[#B9FF66] border-[#191A23] shadow-[1px_1px_0px_#B9FF66]'
                : 'text-[#191A23] border-transparent hover:bg-white'
            }`}
          >
            Connexion
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-100 border-2 border-[#191A23] text-rose-800 text-xs font-bold">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-bold">
          {mode === 'join_code' && (
            <div>
              <label className="block text-[#191A23] mb-1 text-[11px] flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-[#191A23]" /> Code d'Équipe du Manager *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: SPRINT-8942"
                value={projectCode}
                onChange={(e) => setProjectCode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border-2 border-[#191A23] font-mono text-sm font-extrabold text-[#191A23] focus:outline-none uppercase"
              />
              <p className="text-[10px] text-[#191A23]/60 font-medium mt-1">
                Entrez le code à 6 caractères transmis par votre Chef de Projet.
              </p>
            </div>
          )}

          {mode !== 'login' && (
            <div>
              <label className="block text-[#191A23] mb-1 text-[11px]">Nom complet *</label>
              <input
                type="text"
                required
                placeholder="Ex: Sarah Mansouri"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border-2 border-[#191A23] text-[#191A23] focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-[#191A23] mb-1 text-[11px]">Adresse Email *</label>
            <input
              type="email"
              required
              placeholder="Ex: sarah@entreprise.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border-2 border-[#191A23] text-[#191A23] focus:outline-none"
            />
          </div>

          {mode === 'join_code' && (
            <div>
              <label className="block text-[#191A23] mb-1 text-[11px]">Votre Rôle dans le projet</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border-2 border-[#191A23] text-[#191A23] focus:outline-none"
              >
                <option value="Développeur Frontend React">Développeur Frontend React</option>
                <option value="Développeur Backend Laravel">Développeur Backend Laravel</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="QA & Tester Mobile">QA & Tester Mobile</option>
                <option value="Scrum Master / Agile">Scrum Master / Agile</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-[#191A23] mb-1 text-[11px]">Mot de passe</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-white border-2 border-[#191A23] text-[#191A23] focus:outline-none"
            />
          </div>

          <div className="pt-2 border-t-2 border-[#191A23] flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#F3F3F3] text-[#191A23] border-2 border-[#191A23] font-extrabold"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-[#191A23] hover:bg-[#B9FF66] hover:text-[#191A23] text-[#B9FF66] border-2 border-[#191A23] font-extrabold shadow-[2px_2px_0px_#191A23] transition-all flex items-center gap-1.5"
            >
              {mode === 'signup_manager' && <UserPlus className="w-4 h-4" />}
              {mode === 'join_code' && <Key className="w-4 h-4" />}
              {mode === 'login' && <LogIn className="w-4 h-4" />}
              <span>
                {mode === 'signup_manager' && 'Créer Projet'}
                {mode === 'join_code' && 'Rejoindre Projet'}
                {mode === 'login' && 'Se Connecter'}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
