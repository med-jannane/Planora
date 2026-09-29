import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import type { TabType } from './components/Sidebar';
import { CahierDesChargesUpload } from './components/CahierDesChargesUpload';
import { AIResultsView } from './components/AIResultsView';
import { KanbanBoard } from './components/KanbanBoard';
import { GanttChart } from './components/GanttChart';
import { TeamNotifications } from './components/TeamNotifications';
import { AITaskExplainerModal } from './components/AITaskExplainerModal';
import { AuthView } from './components/AuthView';
import { ProfileView } from './components/ProfileView';
import { LandingPage } from './components/LandingPage';
import { SprintPlanningView } from './components/SprintPlanningView';
import { ReportsView } from './components/ReportsView';
import { SettingsView } from './components/SettingsView';
import { ResourceManagementView } from './components/ResourceManagementView';

import type { ProjectAnalysis, Task, TeamMember, AppNotification, UserProfile, ProjectRecord } from './types';
import { analyzeCahierDesCharges } from './services/api';
import { findUserByCode } from './utils/userRegistry';
import { Lightbulb, Sparkles } from 'lucide-react';

export function App() {
  // Current logged in user profile
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('sprintai_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Navigation mode for unauthenticated visitors: 'landing' | 'auth'
  const [unauthScreen, setUnauthScreen] = useState<'landing' | 'auth'>('landing');
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');

  // URL join code detection
  const [joinProjectCode, setJoinProjectCode] = useState<string | null>(null);

  // Multi-Projects List & Active Code
  const [projects, setProjects] = useState<ProjectRecord[]>(() => {
    const saved = localStorage.getItem('sprintai_projects');
    if (saved) return JSON.parse(saved);
    return [{
      id: 'SPRINT-8942',
      code: 'SPRINT-8942',
      name: 'sprint',
      createdAt: new Date().toLocaleDateString(),
      analysis: null,
      team: []
    }];
  });

  const [projectCode, setProjectCode] = useState<string>(() => {
    return localStorage.getItem('sprintai_current_code') || 'SPRINT-8942';
  });

  const [activeTab, setActiveTab] = useState<TabType>('specs');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Active Project Analysis state with localStorage backup
  const [analysis, setAnalysis] = useState<ProjectAnalysis | null>(() => {
    const currCode = localStorage.getItem('sprintai_current_code') || 'SPRINT-8942';
    const savedProjectsStr = localStorage.getItem('sprintai_projects');
    if (savedProjectsStr) {
      const savedProjects: ProjectRecord[] = JSON.parse(savedProjectsStr);
      const match = savedProjects.find(p => p.code === currCode);
      if (match && match.analysis) return match.analysis;
    }
    const savedAnalysis = localStorage.getItem('sprintai_analysis');
    return savedAnalysis ? JSON.parse(savedAnalysis) : null;
  });

  const [team, setTeam] = useState<TeamMember[]>(() => {
    const currCode = localStorage.getItem('sprintai_current_code') || 'SPRINT-8942';
    const savedProjectsStr = localStorage.getItem('sprintai_projects');
    if (savedProjectsStr) {
      const savedProjects: ProjectRecord[] = JSON.parse(savedProjectsStr);
      const match = savedProjects.find(p => p.code === currCode);
      if (match && match.team) return match.team;
    }
    const savedTeam = localStorage.getItem('sprintai_team');
    return savedTeam ? JSON.parse(savedTeam) : [];
  });

  // Active Explainer modal task
  const [selectedExplainerTask, setSelectedExplainerTask] = useState<Task | null>(null);

  // Sync active analysis and team into localStorage and project record
  useEffect(() => {
    localStorage.setItem('sprintai_current_code', projectCode);
    if (analysis) {
      localStorage.setItem('sprintai_analysis', JSON.stringify(analysis));
    }
    localStorage.setItem('sprintai_team', JSON.stringify(team));

    setProjects(prev => {
      const updated = prev.map(p => {
        if (p.code === projectCode) {
          return { ...p, analysis, team, name: analysis ? analysis.project_name : p.name };
        }
        return p;
      });
      localStorage.setItem('sprintai_projects', JSON.stringify(updated));
      return updated;
    });
  }, [analysis, team, projectCode]);

  // App Notifications log
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: '1',
      title: 'Système & IA Prêts',
      message: 'Planora est prêt avec le découpage intelligent et la gestion des profils.',
      recipient: 'Chef de Projet',
      timestamp: 'A l\'instant',
      type: 'ai',
      read: false
    }
  ]);

  // Check URL parameters for ?join=SPRINT-XXXX
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const codeFromUrl = params.get('join');
    if (codeFromUrl) {
      const formattedCode = codeFromUrl.toUpperCase();
      setJoinProjectCode(formattedCode);
      setProjectCode(formattedCode);

      setProjects(prev => {
        const match = prev.find(p => p.code === formattedCode);
        if (!match) {
          const newPrj: ProjectRecord = {
            id: formattedCode,
            code: formattedCode,
            name: `Projet ${formattedCode}`,
            createdAt: new Date().toLocaleDateString(),
            analysis: null,
            team: currentUser ? [{
              id: currentUser.id,
              user_code: currentUser.user_code,
              name: currentUser.name,
              role: currentUser.functionalities[0] || 'Développeur',
              email: currentUser.email,
              avatar: currentUser.avatar
            }] : []
          };
          const updated = [newPrj, ...prev];
          localStorage.setItem('sprintai_projects', JSON.stringify(updated));
          return updated;
        } else {
          if (currentUser) {
            const alreadyIn = match.team?.some(m => m.email === currentUser.email || m.user_code === currentUser.user_code);
            if (!alreadyIn) {
              const updatedTeam = [{
                id: currentUser.id,
                user_code: currentUser.user_code,
                name: currentUser.name,
                role: currentUser.functionalities[0] || 'Développeur',
                email: currentUser.email,
                avatar: currentUser.avatar
              }, ...(match.team || [])];
              return prev.map(p => p.code === formattedCode ? { ...p, team: updatedTeam } : p);
            }
          }
        }
        return prev;
      });
    }
  }, [currentUser]);

  const handleLoginSuccess = (profile: UserProfile) => {
    setCurrentUser(profile);
    
    // Add current user to team list if not present
    const exists = team.some(m => m.email === profile.email || m.user_code === profile.user_code);
    if (!exists) {
      const newMember: TeamMember = {
        id: profile.id,
        user_code: profile.user_code,
        name: profile.name,
        role: profile.functionalities[0] || 'Développeur',
        functionalities: profile.functionalities,
        email: profile.email,
        avatar: profile.avatar || profile.name.charAt(0).toUpperCase()
      };
      setTeam(prev => [newMember, ...prev]);
    }

    if (joinProjectCode) {
      setProjectCode(joinProjectCode);
      setProjects(prev => {
        const match = prev.find(p => p.code === joinProjectCode);
        if (!match) {
          const newPrj: ProjectRecord = {
            id: joinProjectCode,
            code: joinProjectCode,
            name: `Projet ${joinProjectCode}`,
            createdAt: new Date().toLocaleDateString(),
            analysis: null,
            team: [{
              id: profile.id,
              user_code: profile.user_code,
              name: profile.name,
              role: profile.functionalities[0] || 'Développeur',
              functionalities: profile.functionalities,
              email: profile.email,
              avatar: profile.avatar || profile.name.charAt(0).toUpperCase()
            }]
          };
          const updated = [newPrj, ...prev];
          localStorage.setItem('sprintai_projects', JSON.stringify(updated));
          return updated;
        }
        return prev;
      });

      const newNotif: AppNotification = {
        id: Date.now().toString(),
        title: 'Intégré via Lien d\'Invitation',
        message: `Vous avez rejoint le projet ${joinProjectCode} avec le profil ${profile.name} (${profile.user_code}).`,
        recipient: profile.name,
        timestamp: 'À l\'instant',
        type: 'assignment',
        read: false
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sprintai_user');
    setCurrentUser(null);
  };

  const handleAddMemberByCode = (memberCode: string): { success: boolean; message: string } => {
    const formattedCode = memberCode.trim().toUpperCase();
    if (!formattedCode) {
      return { success: false, message: "Veuillez entrer un code d'identité (ex: USR-8942-PK)." };
    }

    const foundUser = findUserByCode(formattedCode);
    if (!foundUser) {
      return {
        success: false,
        message: `❌ Code d'identité invalide ("${formattedCode}") : Aucun utilisateur n'a été trouvé avec ce code.`
      };
    }

    const alreadyInTeam = team.some(
      m => (m.user_code && m.user_code.toUpperCase() === formattedCode) || m.email.toLowerCase() === foundUser.email.toLowerCase()
    );

    if (alreadyInTeam) {
      return {
        success: false,
        message: `⚠️ Le membre ${foundUser.name} (${foundUser.user_code || formattedCode}) fait déjà partie de l'équipe.`
      };
    }

    setTeam(prev => [foundUser, ...prev]);

    // Sync to backend Laravel API if reachable
    const LARAVEL_API_URL = import.meta.env.VITE_LARAVEL_API_URL || (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:8080` : 'http://localhost:8080');
    fetch(`${LARAVEL_API_URL}/api/team-members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: foundUser.name,
        role: foundUser.role,
        email: foundUser.email,
        avatar: foundUser.avatar,
        is_owner: false
      })
    }).catch(err => console.warn('Laravel DB save skipped:', err));

    const newNotif: AppNotification = {
      id: Date.now().toString(),
      title: 'Membre Intégré par Code',
      message: `Membre ${foundUser.name} (${foundUser.user_code || formattedCode} - ${foundUser.role}) ajouté à l'équipe du projet ${projectCode}.`,
      recipient: 'Manager',
      timestamp: 'À l\'instant',
      type: 'assignment',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    return {
      success: true,
      message: `✅ Membre ${foundUser.name} (${foundUser.role}) intégré avec succès !`
    };
  };

  const handleAnalyzeSpec = async (
    projectName: string,
    specText: string,
    teamMembers: TeamMember[],
    file: File | null
  ) => {
    setIsLoading(true);
    setTeam(teamMembers);

    // Save team members to Laravel MySQL API
    const LARAVEL_API_URL = import.meta.env.VITE_LARAVEL_API_URL || (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:8080` : 'http://localhost:8080');
    try {
      for (const member of teamMembers) {
        await fetch(`${LARAVEL_API_URL}/api/team-members`, {
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
        title: 'Projet Généré par l\'IA',
        message: `${res.user_stories.length} User Stories et ${res.tasks.length} tâches attribuées selon les compétences.`,
        recipient: currentUser?.name || 'Chef de Projet',
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
      title: 'Notification Email Envoyée',
      message: `Notification envoyée avec succès pour "${taskTitle}".`,
      recipient,
      timestamp: 'À l\'instant',
      type: 'sprint',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const handleSelectProject = (code: string) => {
    const found = projects.find(p => p.code === code);
    if (found) {
      setProjectCode(found.code);
      setAnalysis(found.analysis);
      setTeam(found.team || []);
      setActiveTab('specs');
    }
  };

  const handleNewProject = () => {
    const newCode = `PRJ-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRecord: ProjectRecord = {
      id: newCode,
      code: newCode,
      name: 'Nouveau Projet',
      createdAt: new Date().toLocaleDateString(),
      analysis: null,
      team: currentUser ? [{
        id: currentUser.id,
        user_code: currentUser.user_code,
        name: currentUser.name,
        role: currentUser.functionalities[0] || 'Manager',
        email: currentUser.email,
        avatar: currentUser.avatar
      }] : []
    };

    setProjects(prev => [newRecord, ...prev]);
    setProjectCode(newCode);
    setAnalysis(null);
    setTeam(newRecord.team);
    setActiveTab('specs');
  };

  // If user is not logged in, show LandingPage by default or AuthView
  if (!currentUser) {
    if (unauthScreen === 'auth' || joinProjectCode) {
      return (
        <AuthView
          onLoginSuccess={handleLoginSuccess}
          initialMode={joinProjectCode ? 'register' : authInitialMode}
          joinProjectCode={joinProjectCode}
          onBackToLanding={() => setUnauthScreen('landing')}
        />
      );
    }

    return (
      <LandingPage
        onStartAsManager={() => {
          setAuthInitialMode('register');
          setUnauthScreen('auth');
        }}
        onLogin={() => {
          setAuthInitialMode('login');
          setUnauthScreen('auth');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#191A23] flex flex-col font-sans selection:bg-[#B9FF66] selection:text-[#191A23]">
      {/* Top Navbar */}
      <Navbar
        projectName={analysis ? analysis.project_name : 'Nouveau Projet'}
        projectCode={projectCode}
        user={currentUser}
        notifications={notifications}
        projects={projects}
        onSelectProject={handleSelectProject}
        onNewProject={handleNewProject}
        onOpenProfile={() => setActiveTab('profile')}
        onLogout={handleLogout}
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
                currentUser?.isManager ? (
                  <CahierDesChargesUpload onAnalyze={handleAnalyzeSpec} isLoading={isLoading} />
                ) : (
                  <div className="p-8 rounded-3xl bg-[#F3F3F3] border-2 border-[#191A23] shadow-[5px_5px_0px_#191A23] text-center space-y-4 max-w-2xl mx-auto my-12">
                    <div className="w-14 h-14 rounded-2xl bg-[#B9FF66] border-2 border-[#191A23] flex items-center justify-center mx-auto text-[#191A23] font-extrabold text-2xl shadow-[3px_3px_0px_#191A23]">
                      👥
                    </div>
                    <h3 className="text-xl font-extrabold text-[#191A23]">Espace Collaborateur — {currentUser?.name}</h3>
                    <p className="text-xs text-[#191A23]/80 font-bold leading-relaxed">
                      Vous êtes connecté en tant que membre de l'équipe pour le projet <strong className="font-mono text-[#191A23]">{projectCode}</strong>.
                      Seul le Manager (Chef de projet) est habilité à soumettre ou modifier le Cahier des Charges.
                    </p>
                  </div>
                )
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-4 border-b-2 border-[#191A23]">
                    <div>
                      <span className="bg-[#B9FF66] text-[#191A23] font-extrabold px-3 py-1 rounded-md text-xs border border-[#191A23]">
                        Analyse Validée
                      </span>
                      <h2 className="text-2xl font-extrabold text-[#191A23] flex items-center gap-2 mt-2">
                        <Sparkles className="w-6 h-6 text-[#191A23]" /> Structuration du Projet
                      </h2>
                      <p className="text-xs text-[#191A23]/70 font-bold mt-1">
                        Projet: <strong className="text-[#191A23]">{analysis.project_name}</strong> • Code: <strong className="font-mono text-[#191A23]">{projectCode}</strong>
                      </p>
                    </div>

                    {currentUser?.isManager && (
                      <button
                        onClick={() => setAnalysis(null)}
                        className="px-4 py-2 rounded-xl bg-white border-2 border-[#191A23] text-xs font-extrabold text-[#191A23] hover:bg-[#B9FF66] transition-all shadow-[2px_2px_0px_#191A23]"
                      >
                        Modifier le Projet
                      </button>
                    )}
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
                  <p className="text-base font-extrabold text-[#191A23]">
                    {currentUser?.isManager
                      ? "Veuillez d'abord déposer votre Cahier des Charges."
                      : "Le Chef de Projet n'a pas encore soumis le Cahier des Charges."}
                  </p>
                  {currentUser?.isManager && (
                    <button
                      onClick={() => setActiveTab('specs')}
                      className="px-6 py-3 rounded-2xl bg-[#191A23] hover:bg-[#B9FF66] hover:text-[#191A23] text-[#B9FF66] font-extrabold text-xs border-2 border-[#191A23] shadow-[3px_3px_0px_#191A23] transition-all"
                    >
                      Déposer le Cahier des Charges
                    </button>
                  )}
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
                  <p className="text-base font-extrabold text-[#191A23]">
                    {currentUser?.isManager
                      ? "Veuillez d'abord déposer votre Cahier des Charges."
                      : "Le Chef de Projet n'a pas encore soumis le Cahier des Charges."}
                  </p>
                  {currentUser?.isManager && (
                    <button
                      onClick={() => setActiveTab('specs')}
                      className="px-6 py-3 rounded-2xl bg-[#191A23] hover:bg-[#B9FF66] hover:text-[#191A23] text-[#B9FF66] font-extrabold text-xs border-2 border-[#191A23] shadow-[3px_3px_0px_#191A23] transition-all"
                    >
                      Déposer le Cahier des Charges
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'sprint-planning' && (
            <SprintPlanningView
              tasks={analysis ? analysis.tasks : []}
              sprints={analysis ? analysis.sprints : []}
            />
          )}

          {activeTab === 'team' && (
            <TeamNotifications
              teamMembers={team}
              tasks={analysis ? analysis.tasks : []}
              projectCode={projectCode}
              projectName={analysis ? analysis.project_name : 'sprint'}
              isManager={currentUser?.isManager}
              onSendEmailNotification={handleSendEmailNotification}
              onAddMemberByCode={handleAddMemberByCode}
            />
          )}

          {activeTab === 'resources' && (
            <ResourceManagementView
              teamMembers={team}
              isManager={currentUser?.isManager}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              analysis={analysis}
              projectCode={projectCode}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView
              projectCode={projectCode}
            />
          )}

          {activeTab === 'profile' && currentUser && (
            <ProfileView
              user={currentUser}
              projectCode={projectCode}
              onLogout={handleLogout}
            />
          )}

          {activeTab === 'ai-insights' && (
            <div className="space-y-6">
              <div className="p-6 rounded-3xl bg-[#F3F3F3] border-2 border-[#191A23] shadow-[5px_5px_0px_#191A23] space-y-4">
                <div className="inline-block bg-[#B9FF66] text-[#191A23] font-extrabold px-3 py-1 rounded-md border border-[#191A23] text-xs">
                  Recommandations Stratégiques
                </div>
                <h2 className="text-xl font-extrabold text-[#191A23] flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-[#191A23]" /> Recommandations & Optimisations par l'IA
                </h2>
                <p className="text-xs text-[#191A23]/80 font-bold leading-relaxed">
                  L'Intelligence Artificielle Planora analyse continuellement l'évolution du projet, l'équilibre de la charge de travail entre développeurs et la faisabilité des Sprints.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  <div className="p-4 rounded-2xl bg-white border-2 border-[#191A23] shadow-[3px_3px_0px_#191A23] space-y-1.5">
                    <h4 className="text-xs font-extrabold text-[#191A23]">🚀 Accessibilité & Ergonomie</h4>
                    <p className="text-xs text-[#191A23]/80 font-medium leading-relaxed">
                      L'interface réactive permet une consultation fluide et instantanée des tableaux Kanban et des chronogrammes Gantt sur tous les écrans.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border-2 border-[#191A23] shadow-[3px_3px_0px_#191A23] space-y-1.5">
                    <h4 className="text-xs font-extrabold text-[#191A23]">✉️ Notifications & Rapports Quotidiens</h4>
                    <p className="text-xs text-[#191A23]/80 font-bold leading-relaxed">
                      Envoyer un résumé quotidien automatisé des tâches à chaque membre de l'équipe pour un suivi optimal des Sprints.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-white border-2 border-[#191A23] shadow-[3px_3px_0px_#191A23] space-y-1.5">
                    <h4 className="text-xs font-extrabold text-[#191A23]">⏱️ Équilibrage de la Charge de Travail par Multi-Compétences</h4>
                    <p className="text-xs text-[#191A23]/80 font-medium leading-relaxed">
                      L'IA répartit désormais les sous-tâches en croisant les fonctionnalités choisies à l'inscription par chaque développeur.
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

      {/* AI EXPLAINER MODAL */}
      <AITaskExplainerModal
        task={selectedExplainerTask}
        onClose={() => setSelectedExplainerTask(null)}
      />
    </div>
  );
}

export default App;
