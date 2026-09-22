import React from 'react';
import type { Task, Sprint } from '../types';
import { GanttChartSquare, Calendar, Bot, Clock } from 'lucide-react';

interface GanttChartProps {
  tasks: Task[];
  sprints: Sprint[];
  onExplainTask: (task: Task) => void;
}

export const GanttChart: React.FC<GanttChartProps> = ({ tasks, sprints, onExplainTask }) => {
  const days = Array.from({ length: 21 }, (_, i) => i + 1);

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'Termine':
        return 'bg-[#4ADE80] text-[#191A23] border-2 border-[#191A23]';
      case 'En cours':
        return 'bg-[#38BDF8] text-[#191A23] border-2 border-[#191A23]';
      case 'En revision':
        return 'bg-[#C084FC] text-[#191A23] border-2 border-[#191A23]';
      default:
        return 'bg-[#B9FF66] text-[#191A23] border-2 border-[#191A23]';
    }
  };

  const getSprintHeaderBg = (index: number) => {
    if (index === 0) return 'bg-[#B9FF66] text-[#191A23]';
    if (index === 1) return 'bg-[#38BDF8] text-[#191A23]';
    return 'bg-[#C084FC] text-[#191A23]';
  };

  return (
    <div className="space-y-5 font-sans">
      {/* Top Banner */}
      <div className="p-4 rounded-2xl bg-[#F3F3F3] border-2 border-[#191A23] shadow-[4px_4px_0px_#191A23] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-extrabold text-[#191A23] flex items-center gap-2">
            <GanttChartSquare className="w-5 h-5 text-[#191A23]" /> Planning & Diagramme de Gantt
          </h2>
          <p className="text-[11px] text-[#191A23]/80 font-bold mt-0.5">
            Chronogramme prévisionnel sur 21 jours découpé par Sprints et attribué aux membres de l'équipe.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-extrabold text-[#191A23] bg-white px-3 py-1.5 rounded-xl border-2 border-[#191A23]">
          <span className="w-2.5 h-2.5 rounded-full bg-[#B9FF66] border border-[#191A23]"></span> À faire
          <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] border border-[#191A23] ml-1"></span> En cours
          <span className="w-2.5 h-2.5 rounded-full bg-[#4ADE80] border border-[#191A23] ml-1"></span> Terminé
        </div>
      </div>

      {/* Gantt Interactive Table */}
      <div className="p-5 rounded-2xl bg-white border-2 border-[#191A23] shadow-[4px_4px_0px_#191A23] overflow-x-auto">
        <div className="min-w-[850px]">
          {/* Header Row: Days */}
          <div className="grid grid-cols-12 gap-2 pb-3 mb-3 border-b-2 border-[#191A23] text-xs font-extrabold text-[#191A23]">
            <div className="col-span-4 flex items-center gap-1.5 text-xs">
              <Calendar className="w-4 h-4 text-[#191A23]" /> Tâche & Assignation
            </div>
            <div className="col-span-8 grid grid-cols-21 gap-0.5 text-[9px] text-center font-mono text-[#191A23] font-extrabold">
              {days.map((d) => (
                <div
                  key={d}
                  className={`py-0.5 rounded border border-[#191A23] ${
                    d % 7 === 0 ? 'bg-[#191A23] text-[#B9FF66]' : 'bg-[#F3F3F3]'
                  }`}
                >
                  J{d}
                </div>
              ))}
            </div>
          </div>

          {/* Sprints Grouped Bars */}
          {sprints.map((sprint, idx) => {
            const sprintNum = sprint.name.split(':')[0] || sprint.name;
            const sprintTasks = tasks.filter((t) => t.sprint === sprintNum);

            return (
              <div key={sprint.id} className="mb-5 space-y-2">
                {/* Sprint Header */}
                <div className={`flex items-center justify-between py-1.5 px-3.5 rounded-xl border-2 border-[#191A23] shadow-[2px_2px_0px_#191A23] ${getSprintHeaderBg(idx)}`}>
                  <span className="text-xs font-extrabold flex items-center gap-1.5">
                    ⚡ {sprint.name}
                  </span>
                  <span className="text-[11px] font-mono font-extrabold">
                    {sprint.duration} • {sprint.focus}
                  </span>
                </div>

                {/* Tasks Rows */}
                {sprintTasks.map((task) => {
                  const startCol = Math.max(1, task.gantt_start_day);
                  const duration = Math.max(1, task.duration_days);

                  return (
                    <div
                      key={task.id}
                      className="grid grid-cols-12 gap-2 items-center py-1.5 px-2 rounded-xl hover:bg-[#F3F3F3] transition-colors border-2 border-transparent hover:border-[#191A23]"
                    >
                      {/* Left Meta */}
                      <div className="col-span-4 flex items-center justify-between pr-2">
                        <div className="truncate">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono text-[#191A23] font-extrabold bg-[#B9FF66] px-1.5 py-0.2 rounded border border-[#191A23]">{task.id}</span>
                            <span className="text-xs font-extrabold text-[#191A23] truncate">{task.title}</span>
                          </div>
                          <p className="text-[10px] text-[#191A23]/75 font-bold flex items-center gap-1 mt-0.5">
                            👤 {task.assignee} <span className="text-[#191A23]/40">•</span> <Clock className="w-3 h-3 inline text-[#191A23]" /> {task.estimated_hours}h
                          </p>
                        </div>

                        <button
                          onClick={() => onExplainTask(task)}
                          title="Obtenir des conseils IA pour cette tâche"
                          className="p-1 rounded-lg bg-white hover:bg-[#B9FF66] text-[#191A23] border-2 border-[#191A23] shrink-0 shadow-[2px_2px_0px_#191A23] active:translate-x-0.5 active:translate-y-0.5"
                        >
                          <Bot className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Right Timeline Bar */}
                      <div className="col-span-8 relative h-8 bg-[#F3F3F3] rounded-xl border-2 border-[#191A23] flex items-center px-1">
                        <div
                          style={{
                            gridColumnStart: startCol,
                            gridColumnEnd: `span ${duration}`,
                            left: `${((startCol - 1) / 21) * 100}%`,
                            width: `${(duration / 21) * 100}%`,
                          }}
                          className={`absolute h-6 rounded-lg ${getStatusColor(
                            task.status
                          )} px-2 flex items-center justify-between text-[11px] font-extrabold shadow-[2px_2px_0px_#191A23] transition-all hover:scale-[1.01] cursor-pointer`}
                          onClick={() => onExplainTask(task)}
                        >
                          <span className="truncate text-[10px]">{task.title}</span>
                          <span className="font-mono text-[9px] shrink-0 ml-1 bg-white/40 px-1 rounded border border-[#191A23]/20">{task.duration_days}j</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

