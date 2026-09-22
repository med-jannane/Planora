import React from 'react';
import { 
  Sparkles, 
  Bot, 
  Kanban, 
  Users, 
  ArrowRight, 
  Key, 
  LogIn, 
  UserPlus,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface LandingPageProps {
  onStartAsManager: () => void;
  onJoinWithCode: () => void;
  onLogin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartAsManager,
  onJoinWithCode,
  onLogin,
}) => {
  return (
    <div className="min-h-screen bg-white text-[#191A23] font-sans selection:bg-[#B9FF66] selection:text-[#191A23]">
      {/* Top Header Navbar */}
      <header className="h-20 border-b-2 border-[#191A23] px-4 md:px-8 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#191A23] text-[#B9FF66] border-2 border-[#191A23] flex items-center justify-center shadow-[2px_2px_0px_#191A23]">
            <Sparkles className="w-5 h-5 text-[#B9FF66]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-[#191A23]">SprintAI</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#B9FF66] text-[#191A23] border border-[#191A23]">
                Web & Mobile PWA
              </span>
            </div>
            <p className="text-[11px] font-bold text-[#191A23]/60 hidden sm:block">
              La plateforme Agile propulsée par l'Intelligence Artificielle
            </p>
          </div>
        </div>

        {/* Right CTA Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onJoinWithCode}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F3F3F3] text-[#191A23] border-2 border-[#191A23] font-extrabold text-xs transition-all shadow-[2px_2px_0px_#191A23]"
          >
            <Key className="w-4 h-4 text-[#191A23]" /> Code d'Équipe
          </button>

          <button
            onClick={onLogin}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F3F3F3] hover:bg-[#B9FF66] text-[#191A23] border-2 border-[#191A23] font-extrabold text-xs transition-all shadow-[2px_2px_0px_#191A23]"
          >
            <LogIn className="w-4 h-4" /> Connexion
          </button>

          <button
            onClick={onStartAsManager}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#191A23] text-[#B9FF66] hover:bg-[#B9FF66] hover:text-[#191A23] border-2 border-[#191A23] font-extrabold text-xs transition-all shadow-[3px_3px_0px_#191A23] active:translate-x-0.5 active:translate-y-0.5"
          >
            <UserPlus className="w-4 h-4" /> S'inscrire / Créer Projet
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#B9FF66] border-2 border-[#191A23] text-xs font-extrabold text-[#191A23] shadow-[2px_2px_0px_#191A23]">
            <Zap className="w-4 h-4 text-[#191A23]" /> 100% Automatique & Sur-Mesure
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-[#191A23] leading-tight tracking-tight">
            Transformez vos <span className="bg-[#B9FF66] px-2 py-0.5 rounded-lg border-2 border-[#191A23] shadow-[3px_3px_0px_#191A23]">Cahiers des Charges</span> en Sprints & Kanban avec l'IA.
          </h1>

          <p className="text-sm md:text-base text-[#191A23]/80 font-bold leading-relaxed">
            Déposez votre document PDF ou Word. Notre Agent IA (Google Gemini) analyse votre cahier des charges, extrait les User Stories, calcule les estimations de temps et attribue automatiquement les tâches à votre équipe avec un Code de Projet unique !
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <button
              onClick={onStartAsManager}
              className="px-6 py-3.5 rounded-2xl bg-[#191A23] text-[#B9FF66] hover:bg-[#B9FF66] hover:text-[#191A23] border-2 border-[#191A23] font-extrabold text-sm flex items-center justify-center gap-2 shadow-[4px_4px_0px_#191A23] transition-all active:translate-x-0.5 active:translate-y-0.5"
            >
              Créer mon Projet Manager <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onJoinWithCode}
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-[#F3F3F3] text-[#191A23] border-2 border-[#191A23] font-extrabold text-sm flex items-center justify-center gap-2 shadow-[4px_4px_0px_#191A23] transition-all"
            >
              <Key className="w-5 h-5 text-[#191A23]" /> Rejoindre avec un Code
            </button>
          </div>

          {/* Highlights */}
          <div className="pt-4 flex flex-wrap items-center gap-6 text-xs font-extrabold text-[#191A23]">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#B9FF66] bg-[#191A23] rounded-full" /> Aucune CB requise</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#B9FF66] bg-[#191A23] rounded-full" /> PWA iOS & Android</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#B9FF66] bg-[#191A23] rounded-full" /> Laravel & MySQL API</span>
          </div>
        </div>

        {/* Hero Visual Mockup */}
        <div className="p-6 rounded-3xl bg-[#F3F3F3] border-2 border-[#191A23] shadow-[8px_8px_0px_#191A23] space-y-4 relative">
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#191A23]">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF70A6] border border-[#191A23]" />
              <div className="w-3 h-3 rounded-full bg-[#FACC15] border border-[#191A23]" />
              <div className="w-3 h-3 rounded-full bg-[#4ADE80] border border-[#191A23]" />
            </div>
            <span className="text-[10px] font-mono font-extrabold bg-white px-2 py-0.5 rounded border border-[#191A23]">
              Aperçu SprintAI WorkSpace
            </span>
          </div>

          {/* Mock Feature Card 1 */}
          <div className="p-4 rounded-2xl bg-white border-2 border-[#191A23] shadow-[3px_3px_0px_#191A23] flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-[#B9FF66] border border-[#191A23] text-[#191A23] shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <span className="bg-[#191A23] text-[#B9FF66] font-mono text-[10px] px-1.5 py-0.2 rounded font-extrabold">
                Agent IA Analyse PDF
              </span>
              <h4 className="text-xs font-extrabold text-[#191A23] mt-1">Découpage instantané en User Stories & Tâches</h4>
              <p className="text-[11px] text-[#191A23]/75 font-medium mt-0.5">Toutes les tâches démarrées avec le statut "À faire".</p>
            </div>
          </div>

          {/* Mock Feature Card 2 */}
          <div className="p-4 rounded-2xl bg-[#191A23] text-white border-2 border-[#191A23] shadow-[3px_3px_0px_#191A23] flex items-start justify-between">
            <div className="space-y-1">
              <span className="bg-[#B9FF66] text-[#191A23] text-[10px] px-2 py-0.5 rounded font-extrabold">
                Code d'Équipe Généré
              </span>
              <p className="text-xl font-mono font-extrabold text-[#B9FF66] pt-1">SPRINT-8942</p>
              <p className="text-[11px] text-white/70 font-medium">Transmettez ce code à votre équipe pour qu'ils vous rejoignent.</p>
            </div>
            <div className="p-2 bg-[#38BDF8] text-[#191A23] rounded-xl border border-[#191A23]">
              <Key className="w-5 h-5" />
            </div>
          </div>

          {/* Floating Badge */}
          <div className="absolute -bottom-4 -right-4 bg-[#B9FF66] text-[#191A23] font-extrabold p-3 rounded-2xl border-2 border-[#191A23] shadow-[4px_4px_0px_#191A23] text-xs flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#191A23]" /> Base MySQL & API Laravel Securisées
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="bg-[#F3F3F3] border-t-2 border-b-2 border-[#191A23] py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <span className="bg-[#B9FF66] text-[#191A23] font-extrabold px-3 py-1 rounded-md text-xs border border-[#191A23]">
              Fonctionnalités Clés
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#191A23]">Tout ce dont vous avez besoin pour vos Projets</h2>
            <p className="text-xs md:text-sm text-[#191A23]/80 font-bold">
              Une solution tout-en-un simple, puissante et conçue pour la rapidité d'exécution.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Feature 1 */}
            <div className="p-6 rounded-2xl bg-white border-2 border-[#191A23] shadow-[5px_5px_0px_#191A23] space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#B9FF66] border-2 border-[#191A23] flex items-center justify-center text-[#191A23]">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-[#191A23]">Analyse PDF & Docx Intelligent</h3>
              <p className="text-xs text-[#191A23]/80 font-medium leading-relaxed">
                Importez votre cahier des charges. L'IA lit et extrait automatiquement les modules, les User Stories, les critères d'acceptation et les estimations d'heures.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-2xl bg-white border-2 border-[#191A23] shadow-[5px_5px_0px_#191A23] space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#38BDF8] border-2 border-[#191A23] flex items-center justify-center text-[#191A23]">
                <Kanban className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-[#191A23]">Kanban & Gantt Découpés</h3>
              <p className="text-xs text-[#191A23]/80 font-medium leading-relaxed">
                Visualisez vos Sprints sur un Kanban interactif et un diagramme de Gantt avec barres chronologiques. Toutes les tâches démarrent à l'état "À faire".
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-2xl bg-white border-2 border-[#191A23] shadow-[5px_5px_0px_#191A23] space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#C084FC] border-2 border-[#191A23] flex items-center justify-center text-[#191A23]">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-[#191A23]">Code d'Équipe & Notifications Mails</h3>
              <p className="text-xs text-[#191A23]/80 font-medium leading-relaxed">
                Le Manager reçoit un code unique pour inviter son équipe. Les notifications par email sont envoyées automatiquement à chaque membre pour le suivi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="py-12 px-4 md:px-8 text-center space-y-4 max-w-4xl mx-auto">
        <h3 className="text-2xl font-extrabold text-[#191A23]">Prêt à lancer votre projet avec SprintAI ?</h3>
        <p className="text-xs font-bold text-[#191A23]/70">Créez votre profil Manager ou rejoignez une équipe avec un code d'invitation.</p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartAsManager}
            className="px-6 py-3 rounded-xl bg-[#191A23] text-[#B9FF66] hover:bg-[#B9FF66] hover:text-[#191A23] border-2 border-[#191A23] font-extrabold text-xs shadow-[3px_3px_0px_#191A23] transition-all"
          >
            Commencer Gratuitement
          </button>
        </div>
      </footer>
    </div>
  );
};
