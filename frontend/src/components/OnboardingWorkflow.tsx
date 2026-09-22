import React, { useState } from 'react';
import { 
  User, 
  Users, 
  FileText, 
  Key, 
  ArrowRight, 
  Sparkles,
  Plus,
  Trash2,
  FileUp,
  Cpu,
  AlertTriangle
} from 'lucide-react';
import type { TeamMember } from '../types';

interface OnboardingProps {
  onComplete: (
    owner: TeamMember, 
    team: TeamMember[], 
    projectName: string, 
    specText: string, 
    file: File | null, 
    geminiKey: string
  ) => void;
  isLoading: boolean;
}

export const OnboardingWorkflow: React.FC<OnboardingProps> = ({ onComplete, isLoading }) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Owner profile
  const [ownerName, setOwnerName] = useState('Karim Alami');
  const [ownerRole, setOwnerRole] = useState('Product Manager & Tech Lead');
  const [ownerEmail, setOwnerEmail] = useState('karim@projet.com');
  const [ownerAvatar, setOwnerAvatar] = useState('👑');

  // Step 2: Team members
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: '1', name: 'Sarah Mansouri', role: 'Développeuse Frontend React / PWA', email: 'sarah@projet.com', avatar: '👩‍💻' },
    { id: '2', name: 'Alexandre Mercier', role: 'Développeur Backend Laravel & API MySQL', email: 'alexandre@projet.com', avatar: '👨‍💻' },
    { id: '3', name: 'Mehdi Benali', role: 'UI/UX Designer', email: 'mehdi@projet.com', avatar: '🎨' },
  ]);

  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Développeur Fullstack');
  const [newMemberEmail, setNewMemberEmail] = useState('');

  // Step 3: Project & AI Key (No pre-filled text!)
  const [projectName, setProjectName] = useState('sprint');
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [specText, setSpecText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Error validation state
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSaveOwner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerName.trim()) return;
    setCurrentStep(2);
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: newMemberName.trim(),
      role: newMemberRole,
      email: newMemberEmail.trim() || `${newMemberName.toLowerCase().replace(/\s+/g, '')}@projet.com`,
      avatar: '👤'
    };
    setTeamMembers([...teamMembers, newMember]);
    setNewMemberName('');
    setNewMemberEmail('');
  };

  const handleRemoveMember = (id: string) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setValidationError(null);
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // STRICT CHECK: At least one input must be provided!
    if (!selectedFile && !specText.trim()) {
      setValidationError("Veuillez importer un fichier PDF/Word OU écrire les spécifications dans la zone de texte avant de lancer l'analyse.");
      return;
    }

    setValidationError(null);
    const ownerMember: TeamMember = {
      id: 'owner-1',
      name: ownerName,
      role: ownerRole,
      email: ownerEmail,
      avatar: ownerAvatar
    };
    const fullTeam = [ownerMember, ...teamMembers];
    onComplete(ownerMember, fullTeam, projectName, specText.trim(), selectedFile, geminiApiKey);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4 font-sans">
      {/* Stepper Header Banner */}
      <div className="p-8 rounded-[35px] bg-[#F3F3F3] border-2 border-[#191A23] shadow-[6px_6px_0px_#191A23] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-block bg-[#B9FF66] text-[#191A23] font-extrabold px-3.5 py-1 rounded-md border border-[#191A23] text-xs mb-2">
              Configuration du Projet
            </div>
            <h1 className="text-3xl font-extrabold text-[#191A23]">
              Bienvenue sur SprintAI 🚀
            </h1>
          </div>
          <span className="text-sm font-extrabold text-[#191A23] bg-white px-4 py-1.5 rounded-xl border-2 border-[#191A23]">
            Étape {currentStep} sur 3
          </span>
        </div>

        {/* Step Indicator Bar */}
        <div className="grid grid-cols-3 gap-4">
          <div className={`p-4 rounded-2xl border-2 border-[#191A23] transition-all ${
            currentStep === 1 
              ? 'bg-[#191A23] text-white shadow-[3px_3px_0px_#B9FF66]' 
              : currentStep > 1 
              ? 'bg-[#B9FF66] text-[#191A23] font-extrabold' 
              : 'bg-white text-[#191A23]'
          }`}>
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4" />
              <span className="text-xs font-extrabold truncate">1. Votre Profil</span>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border-2 border-[#191A23] transition-all ${
            currentStep === 2 
              ? 'bg-[#191A23] text-white shadow-[3px_3px_0px_#B9FF66]' 
              : currentStep > 2 
              ? 'bg-[#B9FF66] text-[#191A23] font-extrabold' 
              : 'bg-white text-[#191A23]'
          }`}>
            <div className="flex items-center gap-2.5">
              <Users className="w-4 h-4" />
              <span className="text-xs font-extrabold truncate">2. Votre Équipe</span>
            </div>
          </div>

          <div className={`p-4 rounded-2xl border-2 border-[#191A23] transition-all ${
            currentStep === 3 
              ? 'bg-[#191A23] text-white shadow-[3px_3px_0px_#B9FF66]' 
              : 'bg-white text-[#191A23]'
          }`}>
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4" />
              <span className="text-xs font-extrabold truncate">3. Cahier des Charges</span>
            </div>
          </div>
        </div>
      </div>

      {/* STEP 1: OWNER PROFILE */}
      {currentStep === 1 && (
        <form onSubmit={handleSaveOwner} className="p-8 rounded-[35px] bg-white border-2 border-[#191A23] shadow-[6px_6px_0px_#191A23] space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b-2 border-[#191A23]">
            <div className="w-10 h-10 rounded-2xl bg-[#191A23] text-[#B9FF66] border-2 border-[#191A23] flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="bg-[#B9FF66] text-[#191A23] font-extrabold px-2.5 py-0.5 rounded text-[11px] border border-[#191A23]">
                Profil Administrateur
              </span>
              <h3 className="text-lg font-extrabold text-[#191A23] mt-1">Créez Votre Profil (Responsable / Lead)</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-extrabold text-[#191A23] mb-2">Votre Nom & Prénom</label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-[#191A23] text-sm font-extrabold text-[#191A23] focus:outline-none focus:bg-[#F3F3F3]"
                placeholder="Ex: Karim Alami"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#191A23] mb-2">Votre Rôle / Postation</label>
              <input
                type="text"
                required
                value={ownerRole}
                onChange={(e) => setOwnerRole(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-[#191A23] text-sm font-extrabold text-[#191A23] focus:outline-none focus:bg-[#F3F3F3]"
                placeholder="Ex: Product Manager & Architecte"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#191A23] mb-2">Votre Adresse Email</label>
              <input
                type="email"
                required
                value={ownerEmail}
                onChange={(e) => setOwnerEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-[#191A23] text-sm font-extrabold text-[#191A23] focus:outline-none focus:bg-[#F3F3F3]"
                placeholder="karim@projet.com"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#191A23] mb-2">Avatar / Émoji</label>
              <select
                value={ownerAvatar}
                onChange={(e) => setOwnerAvatar(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-[#191A23] text-sm font-extrabold text-[#191A23] focus:outline-none focus:bg-[#F3F3F3]"
              >
                <option value="👑">👑 Manager / Lead</option>
                <option value="👨‍💻">👨‍💻 Développeur Lead</option>
                <option value="👩‍💻">👩‍💻 Développeuse Tech</option>
                <option value="🚀">🚀 Entrepreneur</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t-2 border-[#191A23] flex justify-end">
            <button
              type="submit"
              className="px-8 py-3.5 rounded-2xl bg-[#191A23] text-white hover:bg-[#B9FF66] hover:text-[#191A23] border-2 border-[#191A23] font-extrabold text-xs flex items-center gap-2 shadow-[4px_4px_0px_#191A23] transition-all"
            >
              <span>Enregistrer Mon Profil et Continuer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: TEAM MEMBERS */}
      {currentStep === 2 && (
        <div className="p-8 rounded-[35px] bg-white border-2 border-[#191A23] shadow-[6px_6px_0px_#191A23] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b-2 border-[#191A23]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#191A23] text-[#B9FF66] border-2 border-[#191A23] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="bg-[#B9FF66] text-[#191A23] font-extrabold px-2.5 py-0.5 rounded text-[11px] border border-[#191A23]">
                  Rôles & Compétences
                </span>
                <h3 className="text-lg font-extrabold text-[#191A23] mt-1">Créez l'Équipe du Projet</h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="text-xs font-extrabold text-[#191A23] underline"
            >
              ← Retour au Profil
            </button>
          </div>

          {/* Added Members Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Owner Badge Card */}
            <div className="p-4 rounded-2xl bg-[#B9FF66] border-2 border-[#191A23] shadow-[3px_3px_0px_#191A23] text-xs flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl">{ownerAvatar}</span>
                <div>
                  <p className="font-extrabold text-[#191A23]">{ownerName} <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#191A23] text-white font-extrabold">Chef de Projet</span></p>
                  <p className="text-[10px] text-[#191A23] font-bold">{ownerRole}</p>
                </div>
              </div>
            </div>

            {teamMembers.map((member) => (
              <div key={member.id} className="p-4 rounded-2xl bg-[#F3F3F3] border-2 border-[#191A23] shadow-[3px_3px_0px_#191A23] text-xs flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <span className="text-xl">{member.avatar}</span>
                  <div className="truncate">
                    <p className="font-extrabold text-[#191A23] truncate">{member.name}</p>
                    <p className="text-[10px] text-[#191A23]/70 font-bold truncate">{member.role}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveMember(member.id)}
                  className="p-1.5 text-[#191A23] hover:text-rose-600 font-extrabold"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add New Member Form */}
          <div className="p-5 rounded-2xl bg-[#F3F3F3] border-2 border-[#191A23] space-y-3">
            <h4 className="text-xs font-extrabold text-[#191A23] flex items-center gap-2">
              <Plus className="w-4 h-4" /> Ajouter un Nouveau Membre à l'Équipe
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Nom complet"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#191A23] text-xs font-bold text-[#191A23] focus:outline-none"
              />
              <select
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value)}
                className="px-3.5 py-2.5 rounded-xl bg-white border-2 border-[#191A23] text-xs font-bold text-[#191A23] focus:outline-none"
              >
                <option value="Développeur Frontend React / PWA">Frontend React / PWA</option>
                <option value="Développeur Backend Laravel / MySQL">Backend Laravel / MySQL</option>
                <option value="UI/UX Designer">UI/UX Designer</option>
                <option value="Développeur Mobile Native / Expo">Mobile React Native / Expo</option>
                <option value="DevOps & Cloud">DevOps & Cloud</option>
                <option value="QA / Tester">QA / Tester</option>
              </select>
              <button
                type="button"
                onClick={handleAddMember}
                className="py-2.5 rounded-xl bg-[#191A23] hover:bg-[#B9FF66] hover:text-[#191A23] border-2 border-[#191A23] text-white text-xs font-extrabold flex items-center justify-center gap-1 transition-all"
              >
                <Plus className="w-4 h-4" /> Ajouter
              </button>
            </div>
          </div>

          <div className="pt-4 border-t-2 border-[#191A23] flex justify-end">
            <button
              type="button"
              onClick={() => setCurrentStep(3)}
              className="px-8 py-3.5 rounded-2xl bg-[#191A23] text-white hover:bg-[#B9FF66] hover:text-[#191A23] border-2 border-[#191A23] font-extrabold text-xs flex items-center gap-2 shadow-[4px_4px_0px_#191A23] transition-all"
            >
              <span>Valider l'Équipe et Passer au Cahier des Charges</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: PROJECT SPECS & GEMINI KEY */}
      {currentStep === 3 && (
        <form onSubmit={handleFinalSubmit} className="p-8 rounded-[35px] bg-white border-2 border-[#191A23] shadow-[6px_6px_0px_#191A23] space-y-6">
          <div className="flex items-center justify-between pb-4 border-b-2 border-[#191A23]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#191A23] text-[#B9FF66] border-2 border-[#191A23] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="bg-[#B9FF66] text-[#191A23] font-extrabold px-2.5 py-0.5 rounded text-[11px] border border-[#191A23]">
                  Agent IA Google Gemini
                </span>
                <h3 className="text-lg font-extrabold text-[#191A23] mt-1">Cahier des Charges & Clé API</h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentStep(2)}
              className="text-xs font-extrabold text-[#191A23] underline"
            >
              ← Modifier l'Équipe
            </button>
          </div>

          {/* Validation Error Alert */}
          {validationError && (
            <div className="p-4 rounded-2xl bg-rose-100 border-2 border-rose-600 text-rose-900 text-xs font-extrabold flex items-center gap-2 shadow-[3px_3px_0px_#e11d48]">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-extrabold text-[#191A23] mb-2">Nom du Projet</label>
              <input
                type="text"
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-[#191A23] text-sm font-extrabold text-[#191A23] focus:outline-none focus:bg-[#F3F3F3]"
                placeholder="Ex: sprint"
              />
            </div>

            {/* Gemini API Key Field */}
            <div className="p-5 rounded-2xl bg-[#B9FF66] border-2 border-[#191A23] space-y-2 shadow-[3px_3px_0px_#191A23]">
              <label className="block text-xs font-extrabold text-[#191A23] flex items-center gap-2">
                <Key className="w-4 h-4" /> Clé API Google Gemini (Configurée & Intégrée)
              </label>
              <input
                type="password"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white border-2 border-[#191A23] text-xs font-mono font-extrabold text-[#191A23] focus:outline-none"
                placeholder="Entrez votre clé API Google Gemini..."
              />
              <p className="text-[11px] text-[#191A23] font-bold">
                Clé active pour le projet GCP <code className="bg-white px-1.5 py-0.5 rounded border border-[#191A23]">projects/1073993084080</code>.
              </p>
            </div>

            {/* Upload Zone */}
            <div>
              <label className="block text-xs font-extrabold text-[#191A23] mb-2">
                Option A : Fichier du Cahier des Charges (PDF, DOCX)
              </label>
              <div className="relative border-2 border-dashed border-[#191A23] rounded-2xl p-6 text-center hover:bg-[#F3F3F3] transition-colors bg-white shadow-[2px_2px_0px_#191A23]">
                <input
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <FileUp className="w-8 h-8 text-[#191A23] mx-auto mb-2" />
                {selectedFile ? (
                  <p className="text-xs text-[#191A23] font-extrabold bg-[#B9FF66] inline-block px-3 py-1 rounded-md border border-[#191A23]">
                    {selectedFile.name}
                  </p>
                ) : (
                  <p className="text-xs font-extrabold text-[#191A23]">Glissez votre fichier PDF/Word ici ou cliquez pour parcourir</p>
                )}
              </div>
            </div>

            {/* Spec Text */}
            <div>
              <label className="block text-xs font-extrabold text-[#191A23] mb-2">
                Option B : Ou Saisissez directement le Texte du Cahier des Charges
              </label>
              <textarea
                rows={5}
                value={specText}
                onChange={(e) => {
                  setSpecText(e.target.value);
                  if (e.target.value.trim()) setValidationError(null);
                }}
                placeholder="Décrivez les fonctionnalités de votre projet, les modules souhaités, etc..."
                className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-[#191A23] text-xs font-mono font-bold text-[#191A23] focus:outline-none focus:bg-[#F3F3F3]"
              />
            </div>
          </div>

          <div className="pt-4 border-t-2 border-[#191A23] flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-10 py-4 rounded-2xl font-extrabold text-xs text-white flex items-center justify-center gap-2 transition-all shadow-[4px_4px_0px_#191A23] ${
                isLoading
                  ? 'bg-zinc-400 border-2 border-zinc-500 cursor-not-allowed'
                  : 'bg-[#191A23] hover:bg-[#B9FF66] hover:text-[#191A23] border-2 border-[#191A23] active:translate-y-0.5'
              }`}
            >
              {isLoading ? (
                <>
                  <Cpu className="w-5 h-5 animate-spin text-white" />
                  <span>Traitement du Cahier des Charges par l'IA...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>Lancer l'Analyse IA & Commencer le Projet !</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
