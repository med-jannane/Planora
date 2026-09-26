import React from 'react';
import { 
  FileText, 
  Kanban, 
  GanttChartSquare, 
  Users, 
  Lightbulb, 
  BrainCircuit,
  UserCheck,
  Target,
  BarChart2,
  Settings,
  DollarSign
} from 'lucide-react';

export type TabType = 
  | 'specs' 
  | 'kanban' 
  | 'gantt' 
  | 'sprint-planning'
  | 'team' 
  | 'resources'
  | 'reports'
  | 'settings'
  | 'profile' 
  | 'ai-insights';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  hasAnalysis: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, hasAnalysis }) => {
  const menuItems = [
    {
      id: 'specs',
      label: 'Cahier des Charges',
      icon: FileText
    },
    {
      id: 'kanban',
      label: 'Kanban & Sprints',
      icon: Kanban,
      badge: hasAnalysis ? 'Prêt' : undefined
    },
    {
      id: 'gantt',
      label: 'Diagramme de Gantt',
      icon: GanttChartSquare
    },
    {
      id: 'sprint-planning',
      label: 'Planning & Points',
      icon: Target
    },
    {
      id: 'team',
      label: 'Équipe & Membres',
      icon: Users
    },
    {
      id: 'resources',
      label: 'Ressources & Congés',
      icon: DollarSign
    },
    {
      id: 'reports',
      label: 'Rapports & Bilan',
      icon: BarChart2
    },
    {
      id: 'settings',
      label: 'Paramètres Projet',
      icon: Settings
    },
    {
      id: 'profile',
      label: 'Profil & Identité',
      icon: UserCheck
    },
    {
      id: 'ai-insights',
      label: 'Conseils Stratégiques',
      icon: Lightbulb
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-b-2 md:border-b-0 md:border-r-2 border-[#191A23] p-2 md:p-3 md:min-h-[calc(100vh-4.5rem)] flex md:flex-col justify-between shrink-0 font-sans">
      <div className="space-y-1 w-full flex md:block overflow-x-auto md:overflow-x-visible gap-1.5 md:gap-0 pb-1 md:pb-0 scrollbar-none items-center">
        <div className="px-2.5 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#191A23]/60 hidden md:block">
          Navigation Principale
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as TabType)}
              className={`w-full flex items-center justify-center md:justify-between px-3 py-2.5 rounded-xl text-xs font-extrabold transition-all shrink-0 border-2 ${
                isActive
                  ? 'bg-[#B9FF66] text-[#191A23] border-[#191A23] shadow-[2px_2px_0px_#191A23]'
                  : 'bg-white text-[#191A23] hover:bg-[#F3F3F3] border-transparent hover:border-[#191A23]'
              }`}
            >
              <div className="flex items-center justify-center gap-2 text-center w-full md:w-auto">
                <Icon className="w-4 h-4 text-[#191A23] shrink-0" />
                <span className="whitespace-nowrap text-center">{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded font-extrabold border border-[#191A23] hidden md:inline ${
                  isActive ? 'bg-[#191A23] text-white' : 'bg-[#B9FF66] text-[#191A23]'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* AI Assistant Status Card */}
      <div className="hidden md:block p-3.5 rounded-2xl bg-[#F3F3F3] border-2 border-[#191A23] shadow-[3px_3px_0px_#191A23] mt-4 space-y-1">
        <div className="flex items-center gap-2 text-[#191A23] font-extrabold text-xs">
          <BrainCircuit className="w-4 h-4 text-[#191A23] animate-spin" style={{ animationDuration: '6s' }} />
          <span>Assistant Planora IA</span>
        </div>
        <p className="text-[11px] text-[#191A23]/75 font-medium leading-relaxed">
          Extraction intelligente et structuration instantanée du projet.
        </p>
      </div>
    </aside>
  );
};
