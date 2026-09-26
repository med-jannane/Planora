import React, { useState } from 'react';
import type { Task, Sprint } from '../types';
import { Target, UserCheck } from 'lucide-react';

interface SprintPlanningProps {
  tasks: Task[];
  sprints: Sprint[];
}

export const SprintPlanningView: React.FC<SprintPlanningProps> = ({ tasks, sprints }) => {
  const [selectedSprintId, setSelectedSprintId] = useState<string>(sprints[0]?.id || 'sprint-1');

  const activeSprint = sprints.find(s => s.id === selectedSprintId) || sprints[0];
  const sprintTasks = tasks.filter(t => t.sprint === activeSprint?.name);

  const totalHours = sprintTasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#191A23] text-white border-3 border-[#191A23] shadow-[6px_6px_0px_#191A23] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-mono px-2.5 py-1 rounded-md bg-[#B9FF66] text-[#191A23] font-extrabold border border-[#191A23] uppercase tracking-wider">
            Planning des Sprints
          </span>
          <h1 className="text-2xl font-extrabold mt-2 text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-[#B9FF66]" /> Capacité & Répartition des Tâches
          </h1>
          <p className="text-xs text-white/75 font-bold mt-1">
            Gestion fine des itérations, charge globale des développeurs et jalons de livraison.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/20 text-center">
            <span className="text-[10px] uppercase font-bold text-white/70 block">Total Heures</span>
            <span className="text-lg font-mono font-extrabold text-[#B9FF66]">{totalHours}h</span>
          </div>
          <div className="px-4 py-2 rounded-2xl bg-white/10 border border-white/20 text-center">
            <span className="text-[10px] uppercase font-bold text-white/70 block">Tâches Incluses</span>
            <span className="text-lg font-mono font-extrabold text-[#38BDF8]">{sprintTasks.length}</span>
          </div>
        </div>
      </div>

      {/* Sprint Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {sprints.map((sprint) => (
          <button
            key={sprint.id}
            onClick={() => setSelectedSprintId(sprint.id)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all border-2 shrink-0 ${
              selectedSprintId === sprint.id
                ? 'bg-[#B9FF66] text-[#191A23] border-[#191A23] shadow-[3px_3px_0px_#191A23]'
                : 'bg-white text-[#191A23] border-[#191A23] hover:bg-[#F3F3F3]'
            }`}
          >
            {sprint.name} ({sprint.duration})
          </button>
        ))}
      </div>

      {/* Sprint Summary Grid */}
      {activeSprint && (
        <div className="p-6 rounded-3xl bg-white border-2 border-[#191A23] shadow-[5px_5px_0px_#191A23] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b-2 border-[#191A23]">
            <div>
              <h3 className="text-lg font-extrabold text-[#191A23]">{activeSprint.name} — Objectif du Sprint</h3>
              <p className="text-xs text-[#191A23]/70 font-bold mt-0.5">{activeSprint.focus}</p>
            </div>
            <span className="text-xs font-mono font-extrabold px-3 py-1 rounded-xl bg-[#F3F3F3] border border-[#191A23]">
              Durée: {activeSprint.duration}
            </span>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#191A23]/70">
              Tâches incluses dans cette itération ({sprintTasks.length})
            </h4>

            {sprintTasks.length === 0 ? (
              <p className="text-xs text-[#191A23]/50 italic font-bold py-4 text-center">
                Aucune tâche assignée à ce sprint.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sprintTasks.map((task) => (
                  <div key={task.id} className="p-4 rounded-2xl bg-[#F3F3F3] border-2 border-[#191A23] space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-mono font-extrabold px-2 py-0.5 rounded bg-white text-[#191A23] border border-[#191A23]">
                          {task.id}
                        </span>
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-[#38BDF8] text-[#191A23] border border-[#191A23]">
                          {task.status}
                        </span>
                      </div>
                      <h5 className="text-xs font-extrabold text-[#191A23] leading-snug">{task.title}</h5>
                    </div>

                    <div className="pt-2 border-t border-[#191A23]/20 flex items-center justify-between text-[11px] font-bold">
                      <span className="text-[#191A23]/70 flex items-center gap-1">
                        <UserCheck className="w-3.5 h-3.5 text-[#191A23]" /> {task.assignee}
                      </span>
                      <span className="font-mono text-[#191A23] font-extrabold">{task.estimated_hours}h</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
