import React, { useState } from 'react';
import type { Task, Sprint } from '../types';
import { 
  Plus, 
  Bot, 
  Search,
  Filter,
  Clock
} from 'lucide-react';

interface KanbanBoardProps {
  tasks: Task[];
  sprints: Sprint[];
  onTaskStatusChange: (taskId: string, newStatus: Task['status']) => void;
  onExplainTask: (task: Task) => void;
  onAddTask: (newTask: Partial<Task>) => void;
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  tasks,
  sprints,
  onTaskStatusChange,
  onExplainTask,
  onAddTask,
}) => {
  const [selectedSprint, setSelectedSprint] = useState<string>('Tout');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState('Sarah Mansouri');
  const [newTaskHours, setNewTaskHours] = useState(8);
  const [newTaskSprint, setNewTaskSprint] = useState('Sprint 1');

  const columns: { id: Task['status']; label: string; badgeBg: string; topBorder: string; iconBg: string }[] = [
    { id: 'A faire', label: 'À faire', badgeBg: 'bg-[#B9FF66] text-[#191A23]', topBorder: 'border-t-[5px] border-t-[#B9FF66]', iconBg: 'bg-[#B9FF66]' },
    { id: 'En cours', label: 'En cours', badgeBg: 'bg-[#38BDF8] text-[#191A23]', topBorder: 'border-t-[5px] border-t-[#38BDF8]', iconBg: 'bg-[#38BDF8]' },
    { id: 'En revision', label: 'En révision', badgeBg: 'bg-[#C084FC] text-[#191A23]', topBorder: 'border-t-[5px] border-t-[#C084FC]', iconBg: 'bg-[#C084FC]' },
    { id: 'Termine', label: 'Terminé', badgeBg: 'bg-[#4ADE80] text-[#191A23]', topBorder: 'border-t-[5px] border-t-[#4ADE80]', iconBg: 'bg-[#4ADE80]' },
  ];

  const getRoleColor = (role?: string) => {
    const r = (role || '').toLowerCase();
    if (r.includes('front') || r.includes('react')) return 'bg-[#B9FF66] text-[#191A23]';
    if (r.includes('back') || r.includes('laravel') || r.includes('api')) return 'bg-[#38BDF8] text-[#191A23]';
    if (r.includes('design') || r.includes('ui') || r.includes('ux')) return 'bg-[#FF70A6] text-[#191A23]';
    return 'bg-[#FACC15] text-[#191A23]';
  };

  const getSprintBadgeColor = (sprintName: string) => {
    if (sprintName.includes('1')) return 'bg-[#B9FF66]/30 text-[#191A23] border-[#191A23]';
    if (sprintName.includes('2')) return 'bg-[#38BDF8]/30 text-[#191A23] border-[#191A23]';
    return 'bg-[#C084FC]/30 text-[#191A23] border-[#191A23]';
  };

  const filteredTasks = tasks.filter((t) => {
    const matchesSprint = selectedSprint === 'Tout' || t.sprint === selectedSprint;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.assignee.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSprint && matchesSearch;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    onAddTask({
      id: `TSK-${Date.now().toString().slice(-4)}`,
      user_story_id: 'US-100',
      title: newTaskTitle.trim(),
      assignee: newTaskAssignee,
      role: 'Développeur',
      estimated_hours: Number(newTaskHours),
      status: 'A faire',
      sprint: newTaskSprint,
      gantt_start_day: 5,
      duration_days: 2,
      description: 'Tâche personnalisée ajoutée manuellement au Backlog.'
    });
    setNewTaskTitle('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Top Header & Filters Toolbar */}
      <div className="p-4 rounded-2xl bg-[#F3F3F3] border-2 border-[#191A23] shadow-[4px_4px_0px_#191A23] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Sprint Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          <span className="text-[11px] font-extrabold text-[#191A23] uppercase tracking-wider flex items-center gap-1.5 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5" /> Sprint:
          </span>
          <button
            onClick={() => setSelectedSprint('Tout')}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold shrink-0 transition-all border-2 border-[#191A23] ${
              selectedSprint === 'Tout'
                ? 'bg-[#191A23] text-[#B9FF66] shadow-[2px_2px_0px_#B9FF66]'
                : 'bg-white text-[#191A23] hover:bg-[#B9FF66]'
            }`}
          >
            Tous ({tasks.length})
          </button>
          {sprints.map((s) => {
            const sprintNum = s.name.split(':')[0] || s.name;
            const count = tasks.filter(t => t.sprint === sprintNum).length;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSprint(sprintNum)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold shrink-0 transition-all border-2 border-[#191A23] ${
                  selectedSprint === sprintNum
                    ? 'bg-[#191A23] text-[#B9FF66] shadow-[2px_2px_0px_#B9FF66]'
                    : 'bg-white text-[#191A23] hover:bg-[#B9FF66]'
                }`}
              >
                {sprintNum} <span className="opacity-75">({count})</span>
              </button>
            );
          })}
        </div>

        {/* Search & Add Button */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-[#191A23] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Rechercher tâche ou membre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border-2 border-[#191A23] text-xs font-bold text-[#191A23] focus:outline-none focus:ring-1 focus:ring-[#191A23]"
            />
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-1.5 rounded-xl bg-[#191A23] hover:bg-[#B9FF66] hover:text-[#191A23] text-[#B9FF66] font-extrabold text-xs flex items-center gap-1.5 border-2 border-[#191A23] transition-all shrink-0 shadow-[2px_2px_0px_#191A23] active:translate-x-0.5 active:translate-y-0.5"
          >
            <Plus className="w-4 h-4" /> Nouvelle Tâche
          </button>
        </div>
      </div>

      {/* Kanban Board Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.id);
          const colHours = colTasks.reduce((acc, t) => acc + t.estimated_hours, 0);

          return (
            <div key={col.id} className={`p-4 rounded-2xl bg-[#F3F3F3] border-2 border-[#191A23] shadow-[4px_4px_0px_#191A23] flex flex-col h-[620px] ${col.topBorder}`}>
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b-2 border-[#191A23]">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full border border-[#191A23] ${col.iconBg}`} />
                  <h4 className="text-xs font-extrabold text-[#191A23] uppercase tracking-wide">{col.label}</h4>
                  <span className={`text-[11px] px-2 py-0.5 rounded-md font-extrabold border border-[#191A23] ${col.badgeBg}`}>
                    {colTasks.length}
                  </span>
                </div>
                <span className="text-[11px] text-[#191A23] font-mono font-extrabold flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-[#191A23]">
                  <Clock className="w-3 h-3 text-[#191A23]" /> {colHours}h
                </span>
              </div>

              {/* Task Cards Container */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {colTasks.length === 0 ? (
                  <div className="h-28 border-2 border-dashed border-[#191A23]/40 rounded-xl flex flex-col items-center justify-center text-[11px] font-extrabold text-[#191A23]/50 space-y-1 bg-white/40">
                    <span>Aucune tâche</span>
                    <span className="text-[10px] font-normal text-[#191A23]/40">Déplacez ou ajoutez une tâche</span>
                  </div>
                ) : (
                  colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3.5 rounded-xl bg-white border-2 border-[#191A23] shadow-[3px_3px_0px_#191A23] hover:translate-y-[-2px] transition-all space-y-2.5 group"
                    >
                      {/* Task ID & Sprint Badge */}
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono text-[#191A23] font-extrabold bg-[#B9FF66] px-1.5 py-0.5 rounded border border-[#191A23]">
                          {task.id}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] border ${getSprintBadgeColor(task.sprint)}`}>
                          {task.sprint}
                        </span>
                      </div>

                      {/* Title */}
                      <h5 className="text-xs font-extrabold text-[#191A23] leading-tight">
                        {task.title}
                      </h5>

                      {/* Description */}
                      <p className="text-[11px] text-[#191A23]/75 font-medium line-clamp-2 leading-relaxed">
                        {task.description}
                      </p>

                      {/* Role & Hours Badges */}
                      <div className="flex items-center justify-between text-[10px]">
                        <span className={`px-2 py-0.5 rounded-md font-extrabold border border-[#191A23] ${getRoleColor(task.role)}`}>
                          {task.role}
                        </span>
                        <span className="font-mono font-extrabold text-[#191A23] bg-[#F3F3F3] px-2 py-0.5 rounded border border-[#191A23]">
                          ⏱️ {task.estimated_hours}h
                        </span>
                      </div>

                      {/* Assignee & Status Changer */}
                      <div className="pt-2 border-t border-[#191A23]/20 flex items-center justify-between gap-1">
                        <div className="flex items-center gap-1.5 truncate">
                          <div className="w-5 h-5 rounded-md bg-[#191A23] text-[#B9FF66] font-extrabold border border-[#191A23] flex items-center justify-center text-[10px] shrink-0">
                            {task.assignee.charAt(0)}
                          </div>
                          <span className="text-[#191A23] font-extrabold text-[11px] truncate">{task.assignee}</span>
                        </div>

                        <select
                          value={task.status}
                          onChange={(e) => onTaskStatusChange(task.id, e.target.value as Task['status'])}
                          className="bg-[#F3F3F3] border-2 border-[#191A23] text-[10px] font-extrabold text-[#191A23] rounded-md px-1.5 py-0.5 focus:outline-none cursor-pointer hover:bg-[#B9FF66] transition-colors"
                        >
                          <option value="A faire">À faire</option>
                          <option value="En cours">En cours</option>
                          <option value="En revision">En révision</option>
                          <option value="Termine">Terminé</option>
                        </select>
                      </div>

                      {/* AI Explainer Action Button */}
                      <button
                        onClick={() => onExplainTask(task)}
                        className="w-full py-1 rounded-lg bg-[#F3F3F3] hover:bg-[#B9FF66] text-[#191A23] border-2 border-[#191A23] text-[11px] font-extrabold flex items-center justify-center gap-1 transition-all shadow-[2px_2px_0px_#191A23] active:translate-x-0.5 active:translate-y-0.5"
                      >
                        <Bot className="w-3.5 h-3.5 text-[#191A23]" /> Guide IA
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-[#191A23]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-[#191A23] rounded-3xl max-w-md w-full p-6 space-y-4 shadow-[8px_8px_0px_#191A23]">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#191A23]">
              <h3 className="text-sm font-extrabold text-[#191A23] flex items-center gap-2">
                <Plus className="w-4 h-4 bg-[#B9FF66] p-0.5 rounded border border-[#191A23]" /> Ajouter une Tâche au Backlog
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#191A23] font-extrabold hover:bg-[#F3F3F3] px-2 py-1 rounded-lg border border-[#191A23]">✕</button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs font-bold">
              <div>
                <label className="block text-[#191A23] mb-1 text-[11px]">Titre de la Tâche</label>
                <input
                  type="text"
                  required
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border-2 border-[#191A23] text-[#191A23] focus:outline-none focus:ring-1 focus:ring-[#191A23]"
                  placeholder="Ex: Implémenter le filtre mobile PWA"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#191A23] mb-1 text-[11px]">Assigné à</label>
                  <input
                    type="text"
                    value={newTaskAssignee}
                    onChange={(e) => setNewTaskAssignee(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white border-2 border-[#191A23] text-[#191A23]"
                  />
                </div>
                <div>
                  <label className="block text-[#191A23] mb-1 text-[11px]">Durée (Heures)</label>
                  <input
                    type="number"
                    value={newTaskHours}
                    onChange={(e) => setNewTaskHours(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white border-2 border-[#191A23] text-[#191A23]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#191A23] mb-1 text-[11px]">Sprint</label>
                <select
                  value={newTaskSprint}
                  onChange={(e) => setNewTaskSprint(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border-2 border-[#191A23] text-[#191A23]"
                >
                  <option value="Sprint 1">Sprint 1</option>
                  <option value="Sprint 2">Sprint 2</option>
                  <option value="Sprint 3">Sprint 3</option>
                </select>
              </div>

              <div className="pt-3 border-t-2 border-[#191A23] flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#F3F3F3] text-[#191A23] border-2 border-[#191A23] font-extrabold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#191A23] hover:bg-[#B9FF66] hover:text-[#191A23] text-[#B9FF66] border-2 border-[#191A23] font-extrabold shadow-[2px_2px_0px_#191A23]"
                >
                  Créer la Tâche
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

