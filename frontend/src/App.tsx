import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import type { TabType } from './components/Sidebar';
import { CahierDesChargesUpload } from './components/CahierDesChargesUpload';
import { AIResultsView } from './components/AIResultsView';
import { KanbanBoard } from './components/KanbanBoard';
import { GanttChart } from './components/GanttChart';
import { TeamNotifications } from './components/TeamNotifications';
import { AITaskExplainerModal } from './components/AITaskExplainerModal';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';

import type { ProjectAnalysis, Task, TeamMember, AppNotification } from './types';
import { analyzeCahierDesCharges } from './services/api';
import { Lightbulb, Sparkles } from 'lucide-react';

export function App() {
  // Navigation views: 'landing' -> 'workspace'
  const [currentView, setCurrentView] = useState<'landing' | 'workspace'>('landing');
  const [authModalMode, setAuthModalMode] = useState<'login' | 'join_code' | 'signup_manager' | null>(null);

  // Active Project Code
  const [projectCode, setProjectCode] = useState<string>('SPRINT-8942');

  const [activeTab, setActiveTab] = useState<TabType>('specs');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<ProjectAnalysis | null>(null);

  // Active Explainer modal task
  const [selectedExplainerTask, setSelectedExplainerTask] = useState<Task | null>(null);

  const [team, setTeam] = useState<TeamMember[]>([
    { id: '1', name: 'Sarah Mansouri', role: 'Développeuse Frontend React', email: 'sarah@projet.com', avatar: '👩‍💻' },
    { id: '2', name: 'Alexandre Mercier', role: 'Développeur Backend Laravel', email: 'alexandre@projet.com', avatar: '👨‍💻' },
    { id: '3', name: 'Mehdi Benali', role: 'UI/UX Designer', email: 'mehdi@projet.com', avatar: '🎨' },
  ]);

  // App Notifications log
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: '1',
      title: 'Système & API Prêts',
      message: 'Backend Laravel connecté à MySQL (sprintai) & Microservice Python IA configuré.',
      recipient: 'Chef de Projet',
      timestamp: 'A l\'instant',
      type: 'ai',
      read: false
    }
  ]);

  const handleAnalyzeSpec = async (
    projectName: string,
    specText: string,
    teamMembers: TeamMember[],
    file: File | null
  ) => {
    setIsLoading(true);
    setTeam(teamMembers);

    // Save team members to Laravel MySQL API
    try {
      for (const member of teamMembers) {
        await fetch('http://localhost:8080/api/team-members', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: member.name,
            role: member.role,
            email: member.email,
            avatar: member.avatar,
            is_owner: false
          })
        }).catch(err => console.warn('Laravel API error:', err));
      }
    } catch (err) {
      console.warn('Backend Laravel save skipped:', err);
    }

    // Call Python AI Service
    try {
      const res = await analyzeCahierDesCharges(projectName, specText, teamMembers, file);
      setAnalysis(res);
      setIsLoading(false);

      // Add Notification
      const newNotif: AppNotification = {
        id: Date.now().toString(),
        title: 'Projet Généré par l\'Agent IA',
        message: `${res.user_stories.length} User Stories et ${res.tasks.length} tâches attribuées à l'équipe. Mails envoyés !`,
        recipient: 'Chef de Projet',
        timestamp: 'À l\'instant',
        type: 'assignment',
        read: false
      };
      setNotifications(prev => [newNotif, ...prev]);
    } catch (err) {
      console.error(err);
      setIsLoading(false);
    }
  };

  const handleAuthSuccessManager = (_ownerName: string, _ownerRole: string, _ownerEmail: string) => {
    setAuthModalMode(null);
    const newCode = `SPRINT-${Math.floor(1000 + Math.random() * 9000)}`;
    setProjectCode(newCode);
    setCurrentView('workspace');
  };

  const handleAuthSuccessJoin = (newMember: TeamMember, enteredCode: string) => {
    setAuthModalMode(null);
    setProjectCode(enteredCode);
    setTeam(prev => [...prev, newMember]);
    setCurrentView('workspace');

    const newNotif: AppNotification = {
      id: Date.now().toString(),
      title: 'Membre Rejoint avec Code',
      message: `${newMember.name} (${newMember.role}) a rejoint le projet avec le Code ${enteredCode}.`,
      recipient: 'Chef de Projet',
      timestamp: 'À l\'instant',
      type: 'assignment',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleTaskStatusChange = (taskId: string, newStatus: Task['status']) => {
    if (!analysis) return;
    const updatedTasks = analysis.tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t);
    setAnalysis({ ...analysis, tasks: updatedTasks });
  };

  const handleAddTask = (newTask: Partial<Task>) => {
    if (!analysis) return;
    const fullTask = newTask as Task;
    setAnalysis({ ...analysis, tasks: [fullTask, ...analysis.tasks] });

    const newNotif: AppNotification = {
      id: Date.now().toString(),
      title: 'Nouvelle Tâche',
      message: `Tâche "${fullTask.title}" ajoutée et attribuée à ${fullTask.assignee}.`,
      recipient: fullTask.assignee,
      timestamp: 'À l\'instant',
      type: 'assignment',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleSendEmailNotification = (recipient: string, taskTitle: string) => {
    const newNotif: AppNotification = {
      id: Date.now().toString(),
      title: 'Email Envoyé via Laravel Mail',
      message: `Notification envoyée avec succès pour "${taskTitle}".`,
      recipient,
      timestamp: 'À l\'instant',
      type: 'sprint',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleNewProject = () => {
    setAnalysis(null);
    setCurrentView('workspace');
    setActiveTab('specs');
  };

  return (
    <div className="min-h-screen bg-white text-[#191A23] flex flex-col font-sans selection:bg-[#B9FF66] selection:text-[#191A23]">
      {/* LANDING PAGE VIEW */}
      {currentView === 'landing' && (
        <LandingPage
          onStartAsManager={() => setCurrentView('workspace')}
          onJoinWithCode={() => setAuthModalMode('join_code')}
          onLogin={() => setAuthModalMode('login')}
        />
      )}

      {/* MAIN WORKSPACE APP VIEW */}
      {currentView === 'workspace' && (
        <>
          {/* Top Navbar */}
          <Navbar
            projectName={analysis ? analysis.project_name : 'Nouveau Projet'}
            projectCode={projectCode}
            notifications={notifications}
            onNewProject={handleNewProject}
          />

          {/* Body Content */}
          <div className="flex-1 flex flex-col md:flex-row">
            {/* Navigation Sidebar */}
            <Sidebar
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              hasAnalysis={!!analysis}
            />

            {/* Main Workspace Area */}
            <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
              {activeTab === 'specs' && (
                <div className="space-y-6">
                  {!analysis ? (
                    <CahierDesChargesUpload onAnalyze={handleAnalyzeSpec} isLoading={isLoading} />
                  ) : (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between pb-4 border-b-2 border-[#191A23]">
                        <div>
                          <span className="bg-[#B9FF66] text-[#191A23] font-extrabold px-3 py-1 rounded-md text-xs border border-[#191A23]">
                            Analyse Validée
                          </span>
                          <h2 className="text-2xl font-extrabold text-[#191A23] flex items-center gap-2 mt-2">
                            <Sparkles className="w-6 h-6 text-[#191A23]" /> Structuration IA du Projet
                          </h2>
                          <p className="text-xs text-[#191A23]/70 font-bold mt-1">
                            Projet: <strong className="text-[#191A23]">{analysis.project_name}</strong> • Code: <strong className="font-mono text-[#191A23]">{projectCode}</strong>
                          </p>
                        </div>

                        <button
                          onClick={() => setAnalysis(null)}
                          className="px-4 py-2 rounded-xl bg-white border-2 border-[#191A23] text-xs font-extrabold text-[#191A23] hover:bg-[#B9FF66] transition-all shadow-[2px_2px_0px_#191A23]"
                        >
                          Modifier le Projet
                        </button>
                      </div>

                      <AIResultsView
                        analysis={analysis}
                        onExplainTask={(task) => setSelectedExplainerTask(task)}
                        onGoToKanban={() => setActiveTab('kanban')}
                        onGoToGantt={() => setActiveTab('gantt')}
                      />
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'kanban' && (
                <div>
                  {analysis ? (
                    <KanbanBoard
                      tasks={analysis.tasks}
                      sprints={analysis.sprints}
                      onTaskStatusChange={handleTaskStatusChange}
                      onExplainTask={(task) => setSelectedExplainerTask(task)}
                      onAddTask={handleAddTask}
                    />
                  ) : (
                    <div className="py-20 text-center space-y-4 bg-[#F3F3F3] rounded-3xl border-2 border-[#191A23] shadow-[5px_5px_0px_#191A23]">
                      <p className="text-base font-extrabold text-[#191A23]">Veuillez d'abord déposer votre Cahier des Charges.</p>
                      <button
                        onClick={() => setActiveTab('specs')}
                        className="px-6 py-3 rounded-2xl bg-[#191A23] hover:bg-[#B9FF66] hover:text-[#191A23] text-[#B9FF66] font-extrabold text-xs border-2 border-[#191A23] shadow-[3px_3px_0px_#191A23] transition-all"
                      >
                        Déposer le Cahier des Charges
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'gantt' && (
                <div>
                  {analysis ? (
                    <GanttChart
                      tasks={analysis.tasks}
                      sprints={analysis.sprints}
                      onExplainTask={(task) => setSelectedExplainerTask(task)}
                    />
                  ) : (
                    <div className="py-20 text-center space-y-4 bg-[#F3F3F3] rounded-3xl border-2 border-[#191A23] shadow-[5px_5px_0px_#191A23]">
                      <p className="text-base font-extrabold text-[#191A23]">Veuillez d'abord déposer votre Cahier des Charges.</p>
                      <button
                        onClick={() => setActiveTab('specs')}
                        className="px-6 py-3 rounded-2xl bg-[#191A23] hover:bg-[#B9FF66] hover:text-[#191A23] text-[#B9FF66] font-extrabold text-xs border-2 border-[#191A23] shadow-[3px_3px_0px_#191A23] transition-all"
                      >
                        Déposer le Cahier des Charges
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'team' && (
                <TeamNotifications
                  teamMembers={team}
                  tasks={analysis ? analysis.tasks : []}
                  projectCode={projectCode}
                  projectName={analysis ? analysis.project_name : 'sprint'}
                  onSendEmailNotification={handleSendEmailNotification}
                />
              )}

              {activeTab === 'ai-insights' && (
                <div className="space-y-6">
                  <div className="p-6 rounded-3xl bg-[#F3F3F3] border-2 border-[#191A23] shadow-[5px_5px_0px_#191A23] space-y-4">
                    <div className="inline-block bg-[#B9FF66] text-[#191A23] font-extrabold px-3 py-1 rounded-md border border-[#191A23] text-xs">
                      Recommandations Stratégiques
                    </div>
                    <h2 className="text-xl font-extrabold text-[#191A23] flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-[#191A23]" /> Recommandations & Optimisations par l'Agent IA
                    </h2>
                    <p className="text-xs text-[#191A23]/80 font-bold leading-relaxed">
                      L'Agent IA (Google Gemini) analyse continuellement l'évolution du projet, l'équilibre de la charge de travail entre développeurs et la faisabilité des Sprints.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div className="p-4 rounded-2xl bg-white border-2 border-[#191A23] shadow-[3px_3px_0px_#191A23] space-y-1.5">
                        <h4 className="text-xs font-extrabold text-[#191A23]">🚀 Optimisation Web & App Mobile PWA</h4>
                        <p className="text-xs text-[#191A23]/80 font-medium leading-relaxed">
                          Utiliser le Manifest PWA React et le Service Worker pour rendre l'application installable sur smartphone et permettre la consultation hors-ligne du Kanban et du Gantt.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white border-2 border-[#191A23] shadow-[3px_3px_0px_#191A23] space-y-1.5">
                        <h4 className="text-xs font-extrabold text-[#191A23]">✉️ Notifications Mail & Push</h4>
                        <p className="text-xs text-[#191A23]/80 font-bold leading-relaxed">
                          Intégrer les Mailables Laravel pour envoyer un résumé quotidien automatisé des tâches à chaque membre de l'équipe à 8h00 chaque matin.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white border-2 border-[#191A23] shadow-[3px_3px_0px_#191A23] space-y-1.5">
                        <h4 className="text-xs font-extrabold text-[#191A23]">⏱️ Équilibrage de la Charge de Travail</h4>
                        <p className="text-xs text-[#191A23]/80 font-medium leading-relaxed">
                          L'IA détecte si la charge d'heures par Sprint dépasse la capacité d'un développeur et propose un réajustement automatique.
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl bg-white border-2 border-[#191A23] shadow-[3px_3px_0px_#191A23] space-y-1.5">
                        <h4 className="text-xs font-extrabold text-[#191A23]">📊 Exportation Gantt & Rapports Client</h4>
                        <p className="text-xs text-[#191A23]/80 font-bold leading-relaxed">
                          Générer des rapports PDF synthétiques en un clic pour présenter l'avancement du projet aux investisseurs ou clients.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </main>
          </div>
        </>
      )}

      {/* AUTH MODAL */}
      {authModalMode && (
        <AuthModal
          initialMode={authModalMode}
          onClose={() => setAuthModalMode(null)}
          onSuccessManager={handleAuthSuccessManager}
          onSuccessJoin={handleAuthSuccessJoin}
        />
      )}

      {/* AI EXPLAINER MODAL */}
      <AITaskExplainerModal
        task={selectedExplainerTask}
        onClose={() => setSelectedExplainerTask(null)}
      />
    </div>
  );
}

export default App;


