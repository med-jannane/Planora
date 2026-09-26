import React, { useState } from 'react';
import { LogIn, UserPlus, Key, CheckSquare, Square, ShieldCheck, ArrowRight } from 'lucide-react';
import type { UserProfile } from '../types';
import { registerUserInList } from '../utils/userRegistry';

interface AuthViewProps {
  onLoginSuccess: (profile: UserProfile) => void;
  initialMode?: 'login' | 'register';
  joinProjectCode?: string | null;
  onBackToLanding?: () => void;
}

const AVAILABLE_FUNCTIONALITIES = [
  { id: 'frontend', label: 'Développeur Frontend React', category: 'Frontend' },
  { id: 'backend', label: 'Développeur Backend & API', category: 'Backend' },
  { id: 'uiux', label: 'UI/UX Design & Ergonomie', category: 'Design' },
  { id: 'database', label: 'Base de Données & Modélisation', category: 'Data' },
  { id: 'qa', label: 'QA & Tests Automatisés', category: 'Testing' },
  { id: 'devops', label: 'DevOps & Cloud Infrastructure', category: 'DevOps' },
  { id: 'mobile', label: 'Mobile App Native', category: 'Mobile' },
  { id: 'ai', label: 'Intelligence Artificielle & Data', category: 'AI' },
  { id: 'management', label: 'Scrum Master & Gestion de Projet', category: 'Management' },
];

export const AuthView: React.FC<AuthViewProps> = ({
  onLoginSuccess,
  initialMode = 'login',
  joinProjectCode,
  onBackToLanding
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('Maroc');
  const [language, setLanguage] = useState<'fr' | 'en' | 'es'>('fr');
  const [selectedFunctionalities, setSelectedFunctionalities] = useState<string[]>([
    'Développeur Frontend React',
    'Développeur Backend & API'
  ]);
  const [isManagerAccount, setIsManagerAccount] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const toggleFunctionality = (label: string) => {
    if (selectedFunctionalities.includes(label)) {
      if (selectedFunctionalities.length === 1) {
        setErrorMessage('Veuillez sélectionner au moins une fonctionnalité.');
        return;
      }
      setErrorMessage('');
      setSelectedFunctionalities(selectedFunctionalities.filter(f => f !== label));
    } else {
      setErrorMessage('');
      setSelectedFunctionalities([...selectedFunctionalities, label]);
    }
  };

  const generateUserIdentityCode = (): string => {
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    return `USR-${randomDigits}-PK`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (mode === 'register') {
      if (!fullName.trim() || !email.trim()) {
        setErrorMessage('Veuillez remplir tous les champs obligatoires.');
        return;
      }
      if (selectedFunctionalities.length === 0) {
        setErrorMessage('Veuillez choisir au moins une fonctionnalité de votre profil.');
        return;
      }

      const userCode = generateUserIdentityCode();
      const profile: UserProfile = {
        id: Date.now().toString(),
        user_code: userCode,
        name: fullName.trim(),
        email: email.trim(),
        functionalities: selectedFunctionalities,
        avatar: fullName.charAt(0).toUpperCase(),
        isManager: isManagerAccount,
        country: country,
        language: language,
      };

      // Store local user & register in user registry
      localStorage.setItem('sprintai_user', JSON.stringify(profile));
      registerUserInList(profile);
      onLoginSuccess(profile);
    } else {
      // Login mode
      if (!email.trim()) {
        setErrorMessage('Veuillez entrer votre adresse email.');
        return;
      }

      // Check existing saved user or create session profile
      const savedUserStr = localStorage.getItem('sprintai_user');
      let profile: UserProfile;

      if (savedUserStr) {
        profile = JSON.parse(savedUserStr);
        if (email.trim() !== profile.email) {
          profile.email = email.trim();
          profile.name = email.split('@')[0];
        }
      } else {
        const userCode = generateUserIdentityCode();
        profile = {
          id: Date.now().toString(),
          user_code: userCode,
          name: email.split('@')[0],
          email: email.trim(),
          functionalities: ['💻 Développeur Frontend React / Web'],
          avatar: email.charAt(0).toUpperCase(),
          isManager: true
        };
      }

      localStorage.setItem('sprintai_user', JSON.stringify(profile));
      registerUserInList(profile);
      onLoginSuccess(profile);
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#191A23] font-sans flex items-center justify-center p-4 selection:bg-[#B9FF66]">
      <div className="max-w-xl w-full bg-white border-3 border-[#191A23] rounded-3xl p-6 sm:p-8 space-y-6 shadow-[10px_10px_0px_#191A23] relative">
        
        {/* Banner header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-[#191A23]">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Planora" className="h-9 w-auto object-contain" />
            <div>
              <p className="text-xs font-bold text-[#191A23]/70">
                Plateforme Intelligente de Gestion de Projet
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onBackToLanding && (
              <button
                type="button"
                onClick={onBackToLanding}
                className="px-3 py-1.5 rounded-xl bg-[#F3F3F3] hover:bg-[#B9FF66] border-2 border-[#191A23] text-xs font-extrabold text-[#191A23] transition-all shadow-[2px_2px_0px_#191A23]"
              >
                ← Accueil
              </button>
            )}

            {joinProjectCode && (
              <div className="px-3 py-1 rounded-xl bg-[#B9FF66] border border-[#191A23] text-[11px] font-mono font-extrabold">
                Invitation: {joinProjectCode}
              </div>
            )}
          </div>
        </div>

        {/* Tab switcher: Connexion vs Inscription */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#F3F3F3] rounded-2xl border-2 border-[#191A23]">
          <button
            type="button"
            onClick={() => { setMode('login'); setErrorMessage(''); }}
            className={`py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 border-2 ${
              mode === 'login'
                ? 'bg-[#191A23] text-[#B9FF66] border-[#191A23] shadow-[2px_2px_0px_#B9FF66]'
                : 'text-[#191A23] border-transparent hover:bg-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Se Connecter</span>
          </button>

          <button
            type="button"
            onClick={() => { setMode('register'); setErrorMessage(''); }}
            className={`py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 border-2 ${
              mode === 'register'
                ? 'bg-[#191A23] text-[#B9FF66] border-[#191A23] shadow-[2px_2px_0px_#B9FF66]'
                : 'text-[#191A23] border-transparent hover:bg-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>S'Inscrire</span>
          </button>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-100 border-2 border-[#191A23] text-rose-900 text-xs font-extrabold shadow-[2px_2px_0px_#191A23]">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Auth form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold">
          
          {mode === 'register' && (
            <div>
              <label className="block text-[#191A23] mb-1 text-xs font-extrabold">Nom et Prénom *</label>
              <input
                type="text"
                required
                placeholder="Ex: Med Jannane"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-[#191A23] text-[#191A23] focus:outline-none focus:bg-[#F3F3F3]"
              />
            </div>
          )}

          <div>
            <label className="block text-[#191A23] mb-1 text-xs font-extrabold">Adresse Email *</label>
            <input
              type="email"
              required
              placeholder="Ex: med@planora.ai"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-[#191A23] text-[#191A23] focus:outline-none focus:bg-[#F3F3F3]"
            />
          </div>

          <div>
            <label className="block text-[#191A23] mb-1 text-xs font-extrabold">Mot de passe *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-[#191A23] text-[#191A23] focus:outline-none focus:bg-[#F3F3F3]"
            />
          </div>

          {mode === 'register' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#191A23] mb-1 text-xs font-extrabold">Pays *</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-[#191A23] text-[#191A23] focus:outline-none focus:bg-[#F3F3F3] text-xs font-bold"
                >
                  <option value="Maroc">Maroc (🇲🇦)</option>
                  <option value="France">France (🇫🇷)</option>
                  <option value="Espagne">Espagne (🇪🇸)</option>
                  <option value="États-Unis">États-Unis (🇺🇸)</option>
                  <option value="Royaume-Uni">Royaume-Uni (🇬🇧)</option>
                  <option value="Canada">Canada (🇨🇦)</option>
                  <option value="Belgique">Belgique (🇧🇪)</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-[#191A23] mb-1 text-xs font-extrabold">Langue préférée *</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border-2 border-[#191A23] text-[#191A23] focus:outline-none focus:bg-[#F3F3F3] text-xs font-bold"
                >
                  <option value="fr">Français (FR)</option>
                  <option value="en">English (EN)</option>
                  <option value="es">Español (ES)</option>
                </select>
              </div>
            </div>
          )}

          {/* MULTI-SELECT FUNCTIONALITIES (INSCRIPTION REQ) */}
          {mode === 'register' && (
            <div className="space-y-2 pt-2 border-t-2 border-[#191A23]/20">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold text-[#191A23] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#191A23]" /> 
                  Choisissez vos Fonctionnalités / Compétences *
                </label>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#B9FF66] border border-[#191A23]">
                  {selectedFunctionalities.length} sélectionnée(s)
                </span>
              </div>
              <p className="text-[11px] text-[#191A23]/70 font-medium">
                Vous pouvez choisir <strong>plus d'une fonctionnalité</strong>. L'Agent IA s'en servira pour vous attribuer les bonnes sous-tâches !
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {AVAILABLE_FUNCTIONALITIES.map((func) => {
                  const isSelected = selectedFunctionalities.includes(func.label);
                  return (
                    <button
                      key={func.id}
                      type="button"
                      onClick={() => toggleFunctionality(func.label)}
                      className={`p-2.5 rounded-xl border-2 text-left transition-all flex items-center justify-between text-[11px] font-extrabold ${
                        isSelected
                          ? 'bg-[#B9FF66] text-[#191A23] border-[#191A23] shadow-[2px_2px_0px_#191A23]'
                          : 'bg-[#F3F3F3] text-[#191A23]/80 border-[#191A23]/40 hover:border-[#191A23]'
                      }`}
                    >
                      <span className="truncate pr-1">{func.label}</span>
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#191A23] shrink-0" />
                      ) : (
                        <Square className="w-4 h-4 text-[#191A23]/40 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Manager Option checkbox */}
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="checkbox"
                  id="manager_check"
                  checked={isManagerAccount}
                  onChange={(e) => setIsManagerAccount(e.target.checked)}
                  className="w-4 h-4 accent-[#191A23] rounded cursor-pointer"
                />
                <label htmlFor="manager_check" className="text-xs font-extrabold text-[#191A23] cursor-pointer">
                  Je suis Chef de Projet / Manager (Permet d'inviter des membres et créer des projets)
                </label>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3.5 rounded-2xl bg-[#191A23] hover:bg-[#B9FF66] hover:text-[#191A23] text-[#B9FF66] border-2 border-[#191A23] font-extrabold text-sm shadow-[4px_4px_0px_#191A23] transition-all flex items-center justify-center gap-2 pt-3"
          >
            <span>{mode === 'register' ? 'Créer mon Profil & Obtenir mon Code Identité' : 'Accéder au Workspace'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Informative Footer */}
        <div className="p-4 rounded-2xl bg-[#F3F3F3] border-2 border-[#191A23] text-xs text-[#191A23] font-bold shadow-[2px_2px_0px_#191A23]">
          <p className="flex items-center gap-2 leading-relaxed">
            <Key className="w-4 h-4 text-[#191A23] shrink-0" />
            <span>
              <strong>Code Identité Unique :</strong> Un code (ex: <code className="bg-white px-2 py-0.5 rounded border border-[#191A23] font-mono text-xs">USR-9482-PK</code>) sera généré automatiquement à l'inscription.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
