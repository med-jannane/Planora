import React, { useState } from 'react';
import { 
  FileUp, 
  Sparkles, 
  Users, 
  Plus, 
  Trash2, 
  FileText, 
  CheckCircle2, 
  Cpu,
  AlertTriangle
} from 'lucide-react';
import type { TeamMember } from '../types';

interface UploadProps {
  onAnalyze: (projectName: string, specText: string, team: TeamMember[], file: File | null) => void;
  isLoading: boolean;
}

export const CahierDesChargesUpload: React.FC<UploadProps> = ({ onAnalyze, isLoading }) => {
  const [projectName, setProjectName] = useState('sprint');
  const [specText, setSpecText] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: '1', name: 'Sarah Mansouri', role: 'Développeuse Frontend React / PWA', email: 'sarah@projet.com', avatar: '👩‍💻' },
    { id: '2', name: 'Alexandre Mercier', role: 'Développeur Backend Laravel & API MySQL', email: 'alexandre@projet.com', avatar: '👨‍💻' },
    { id: '3', name: 'Mehdi Benali', role: 'UI/UX Designer & PWA Mobile Specialist', email: 'mehdi@projet.com', avatar: '🎨' },
  ]);

  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('Développeur Fullstack');
  const [newMemberEmail, setNewMemberEmail] = useState('');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile && !specText.trim()) {
      setValidationError("Veuillez importer un fichier PDF/Word OU écrire les spécifications dans la zone de texte avant d'analyser.");
      return;
    }
    setValidationError(null);
    onAnalyze(projectName, specText.trim(), teamMembers, selectedFile);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 font-sans">
      {/* Header Banner */}
      <div className="p-8 rounded-[35px] bg-[#F3F3F3] border-2 border-[#191A23] shadow-[6px_6px_0px_#191A23] relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-block bg-[#B9FF66] text-[#191A23] text-xs font-extrabold px-3.5 py-1 rounded-md border border-[#191A23] mb-3">
            <Sparkles className="w-3.5 h-3.5 inline mr-1" /> Agent IA Génératif de Projet
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#191A23]">
            Soumettre le Cahier des Charges & L'Équipe
          </h1>
          <p className="text-sm text-[#191A23]/80 font-bold mt-2 leading-relaxed">
            Fournissez le document du projet (PDF, DOCX) ou saisissez vos exigences. L'Agent IA va lire le cahier des charges, créer les User Stories, calculer le temps estimé, assigner les tâches et construire votre Diagramme de Gantt.
          </p>
        </div>
      </div>

      {validationError && (
        <div className="p-4 rounded-2xl bg-rose-100 border-2 border-rose-600 text-rose-900 text-xs font-extrabold flex items-center gap-2 shadow-[3px_3px_0px_#e11d48]">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Spec Document & Text */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-7 rounded-[35px] bg-white border-2 border-[#191A23] shadow-[5px_5px_0px_#191A23] space-y-5">
            <h3 className="text-base font-extrabold text-[#191A23] flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#191A23]" /> 1. Informations du Projet
            </h3>
            
            <div>
              <label className="block text-xs font-extrabold text-[#191A23] mb-2">Nom du Projet</label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-[#191A23] text-sm font-extrabold text-[#191A23] focus:outline-none focus:bg-[#F3F3F3]"
                placeholder="Ex: sprint"
              />
            </div>

            {/* Document Upload Zone */}
            <div>
              <label className="block text-xs font-extrabold text-[#191A23] mb-2">
                Option A : Fichier du Cahier des Charges (PDF, DOCX, TXT)
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
                  <div className="text-xs text-[#191A23] font-extrabold bg-[#B9FF66] inline-block px-3.5 py-1 rounded-md border border-[#191A23]">
                    <CheckCircle2 className="w-4 h-4 inline mr-1" /> {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-extrabold text-[#191A23]">
                      Glissez-déposez votre document ou <span className="underline">parcourez</span>
                    </p>
                    <p className="text-[11px] text-[#191A23]/60 font-bold mt-1">PDF, Word DOCX ou Texte jusqu'à 20 Mo</p>
                  </div>
                )}
              </div>
            </div>

            {/* Raw Specs Input */}
            <div>
              <label className="block text-xs font-extrabold text-[#191A23] mb-2">
                Option B : Ou Saisissez la description du Cahier des Charges
              </label>
              <textarea
                rows={6}
                value={specText}
                onChange={(e) => {
                  setSpecText(e.target.value);
                  if (e.target.value.trim()) setValidationError(null);
                }}
                className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-[#191A23] text-xs font-mono font-bold text-[#191A23] focus:outline-none focus:bg-[#F3F3F3] leading-relaxed"
                placeholder="Entrez la description de votre projet, la liste des fonctionnalités, etc..."
              />
            </div>
          </div>
        </div>

        {/* Right Column: Team & Submit */}
        <div className="space-y-6">
          <div className="p-7 rounded-[35px] bg-white border-2 border-[#191A23] shadow-[5px_5px_0px_#191A23] space-y-5">
            <h3 className="text-base font-extrabold text-[#191A23] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#191A23]" /> 2. Membres de l'Équipe & Rôles
            </h3>

            {/* Member List */}
            <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
              {teamMembers.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 rounded-2xl bg-[#F3F3F3] border-2 border-[#191A23] text-xs">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <span className="text-lg">{member.avatar}</span>
                    <div className="truncate">
                      <p className="font-extrabold text-[#191A23] truncate">{member.name}</p>
                      <p className="text-[10px] text-[#191A23]/70 font-bold truncate">{member.role}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(member.id)}
                    className="p-1 text-[#191A23] hover:text-rose-600 font-extrabold"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Member Form */}
            <div className="pt-3 border-t-2 border-[#191A23] space-y-2.5">
              <input
                type="text"
                placeholder="Nom du membre"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border-2 border-[#191A23] text-xs font-bold text-[#191A23] focus:outline-none"
              />
              <select
                value={newMemberRole}
                onChange={(e) => setNewMemberRole(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-white border-2 border-[#191A23] text-xs font-bold text-[#191A23] focus:outline-none"
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
                className="w-full py-2.5 rounded-xl bg-[#F3F3F3] hover:bg-[#B9FF66] text-[#191A23] border-2 border-[#191A23] text-xs font-extrabold flex items-center justify-center gap-1 transition-colors"
              >
                <Plus className="w-4 h-4" /> Ajouter à l'équipe
              </button>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 rounded-2xl font-extrabold text-xs text-white flex items-center justify-center gap-2 shadow-[4px_4px_0px_#191A23] transition-all ${
              isLoading
                ? 'bg-zinc-400 border-2 border-zinc-500 cursor-not-allowed'
                : 'bg-[#191A23] hover:bg-[#B9FF66] hover:text-[#191A23] border-2 border-[#191A23] active:translate-y-0.5'
            }`}
          >
            {isLoading ? (
              <>
                <Cpu className="w-5 h-5 animate-spin text-white" />
                <span>Analyse du Cahier des Charges par l'IA...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Générer User Stories, Gantt & Attributions IA</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
