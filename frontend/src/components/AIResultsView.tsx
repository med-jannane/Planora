import React, { useState } from 'react';
import type { ProjectAnalysis, Task, UserStory } from '../types';
import { 
  Sparkles, 
  Clock, 
  Layers, 
  CheckCircle2, 
  UserCheck, 
  BookOpen, 
  Lightbulb, 
  Calendar,
  ChevronRight,
  ChevronLeft,
  Bot,
  X,
  ListTodo,
  Eye
} from 'lucide-react';

interface AIResultsViewProps {
  analysis: ProjectAnalysis;
  onExplainTask: (task: Task) => void;
  onGoToKanban: () => void;
  onGoToGantt: () => void;
}

export const AIResultsView: React.FC<AIResultsViewProps> = ({
  analysis,
  onExplainTask,
  onGoToKanban,
  onGoToGantt,
}) => {
  // Pagination State for User Stories (10 per page)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const STORIES_PER_PAGE = 10;

  // Selected User Story for Sub-tasks Pop-up Modal
  const [selectedStory, setSelectedStory] = useState<UserStory | null>(null);

  const totalPages = Math.ceil(analysis.user_stories.length / STORIES_PER_PAGE) || 1;
  const paginatedStories = analysis.user_stories.slice(
    (currentPage - 1) * STORIES_PER_PAGE,
    currentPage * STORIES_PER_PAGE
  );

  const getRoleColor = (role?: string) => {
    const r = (role || '').toLowerCase();
    if (r.includes('front') || r.includes('react')) return 'bg-[#B9FF66] text-[#191A23]';
    if (r.includes('back') || r.includes('laravel') || r.includes('api')) return 'bg-[#38BDF8] text-[#191A23]';
    if (r.includes('design') || r.includes('ui') || r.includes('ux')) return 'bg-[#FF70A6] text-[#191A23]';
    return 'bg-[#FACC15] text-[#191A23]';
  };

  // Get sub-tasks belonging to a specific User Story
  const getSubTasksForStory = (storyId: string) => {
    return analysis.tasks.filter(t => t.user_story_id === storyId || t.user_story_id === storyId.replace('US-', ''));
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Time */}
        <div className="p-4 rounded-2xl bg-white border-2 border-[#191A23] shadow-[4px_4px_0px_#191A23] flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-[#B9FF66] text-[#191A23] border-2 border-[#191A23] shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-[#191A23]/60 uppercase tracking-wider">Temps Estimé Total</p>
            <p className="text-xl font-extrabold text-[#191A23] leading-none mt-0.5">{analysis.total_estimated_hours}h</p>
            <p className="text-[11px] font-bold text-[#191A23]/80 mt-1">~{analysis.estimated_duration_weeks} semaines</p>
          </div>
        </div>

        {/* Card 2: User Stories */}
        <div className="p-4 rounded-2xl bg-[#191A23] text-white border-2 border-[#191A23] shadow-[4px_4px_0px_#191A23] flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-[#38BDF8] text-[#191A23] border-2 border-[#191A23] shrink-0">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-white/70 uppercase tracking-wider">User Stories</p>
            <p className="text-xl font-extrabold text-white leading-none mt-0.5">{analysis.user_stories.length} Stories</p>
            <p className="text-[11px] font-bold text-[#B9FF66] mt-1">{analysis.total_story_points} Story Points</p>
          </div>
        </div>

        {/* Card 3: Tasks */}
        <div className="p-4 rounded-2xl bg-[#B9FF66] text-[#191A23] border-2 border-[#191A23] shadow-[4px_4px_0px_#191A23] flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-[#191A23] text-[#B9FF66] border-2 border-[#191A23] shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-[#191A23]/70 uppercase tracking-wider">Tâches Générées</p>
            <p className="text-xl font-extrabold text-[#191A23] leading-none mt-0.5">{analysis.tasks.length} Tâches</p>
            <span className="text-[10px] font-extrabold bg-white text-[#191A23] px-2 py-0.5 rounded border border-[#191A23] inline-block mt-1">TOUTES "À FAIRE"</span>
          </div>
        </div>

        {/* Card 4: Sprints */}
        <div className="p-4 rounded-2xl bg-[#F3F3F3] border-2 border-[#191A23] shadow-[4px_4px_0px_#191A23] flex items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-[#C084FC] text-[#191A23] border-2 border-[#191A23] shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-extrabold text-[#191A23]/60 uppercase tracking-wider">Sprints Préparés</p>
            <p className="text-xl font-extrabold text-[#191A23] leading-none mt-0.5">{analysis.sprints.length} Sprints</p>
            <p className="text-[11px] font-bold text-[#191A23]/80 mt-1">Chronogramme prêt</p>
          </div>
        </div>
      </div>

      {/* AI Summary Banner */}
      <div className="p-5 rounded-2xl bg-[#F3F3F3] border-2 border-[#191A23] shadow-[4px_4px_0px_#191A23] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-[#191A23] text-[#B9FF66] border-2 border-[#191A23] shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="bg-[#B9FF66] text-[#191A23] font-extrabold px-2 py-0.5 rounded text-[11px] border border-[#191A23]">
              Résumé de l'Analyse IA
            </span>
            <p className="text-xs font-bold text-[#191A23] leading-relaxed mt-1.5">{analysis.summary}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0">
          <button
            onClick={onGoToKanban}
            className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-[#191A23] hover:bg-[#B9FF66] hover:text-[#191A23] border-2 border-[#191A23] text-[#B9FF66] font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#191A23] active:translate-x-0.5 active:translate-y-0.5"
          >
            Ouvrir le Kanban <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={onGoToGantt}
            className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-white hover:bg-[#191A23] hover:text-white border-2 border-[#191A23] text-[#191A23] font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_#191A23] active:translate-x-0.5 active:translate-y-0.5"
          >
            Voir le Gantt <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Section: User Stories with 10 per page Pagination */}
      <div className="space-y-4">
        {/* User Stories Header & Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-[#F3F3F3] border-2 border-[#191A23] shadow-[4px_4px_0px_#191A23]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#B9FF66] text-[#191A23] border-2 border-[#191A23]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-[#191A23]">
                User Stories ({analysis.user_stories.length} au total)
              </h3>
              <p className="text-[11px] text-[#191A23]/70 font-bold">
                Cliquez sur une User Story pour afficher ses tâches découpées dans un Pop-up.
              </p>
            </div>
          </div>

          {/* Pagination Navigation (10 per page) */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1.5 rounded-xl border-2 border-[#191A23] text-xs font-extrabold flex items-center gap-1 transition-all ${
                currentPage === 1
                  ? 'bg-zinc-200 text-zinc-400 border-zinc-400 cursor-not-allowed'
                  : 'bg-white text-[#191A23] hover:bg-[#B9FF66] shadow-[2px_2px_0px_#191A23]'
              }`}
            >
              <ChevronLeft className="w-4 h-4" /> Précédent
            </button>

            <span className="text-xs font-extrabold px-3 py-1.5 bg-white rounded-xl border-2 border-[#191A23] font-mono">
              Page {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1.5 rounded-xl border-2 border-[#191A23] text-xs font-extrabold flex items-center gap-1 transition-all ${
                currentPage === totalPages
                  ? 'bg-zinc-200 text-zinc-400 border-zinc-400 cursor-not-allowed'
                  : 'bg-white text-[#191A23] hover:bg-[#B9FF66] shadow-[2px_2px_0px_#191A23]'
              }`}
            >
              Suivant <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* User Stories Cards Grid (Paginated 10 per page) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paginatedStories.map((story) => {
            const storyTasks = getSubTasksForStory(story.id);

            return (
              <div
                key={story.id}
                onClick={() => setSelectedStory(story)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  setSelectedStory(story);
                }}
                className="p-4 rounded-2xl bg-white border-2 border-[#191A23] shadow-[4px_4px_0px_#191A23] hover:translate-y-[-2px] transition-all space-y-3 cursor-pointer group hover:border-[#191A23] hover:bg-[#F3F3F3]/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-extrabold px-2 py-0.5 rounded bg-[#191A23] text-[#B9FF66] border border-[#191A23]">
                      {story.id}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#B9FF66] text-[#191A23] border border-[#191A23] font-extrabold">
                      {story.module}
                    </span>
                  </div>

                  <span className={`text-[10px] px-2.5 py-0.5 rounded font-extrabold border border-[#191A23] shrink-0 ${
                    story.priority === 'Haute'
                      ? 'bg-[#FF70A6] text-[#191A23]'
                      : 'bg-[#F3F3F3] text-[#191A23]'
                  }`}>
                    {story.priority}
                  </span>
                </div>

                <h4 className="text-xs font-extrabold text-[#191A23] leading-snug group-hover:text-[#191A23]">
                  {story.title}
                </h4>

                <div className="flex items-center justify-between text-[11px] text-[#191A23]/80 font-bold pt-1">
                  <span>{story.story_points} Points • ⏱️ {story.estimated_hours}h</span>

                  <span className="bg-[#191A23] text-[#B9FF66] px-2 py-1 rounded-lg text-[10px] font-extrabold border border-[#191A23] flex items-center gap-1 group-hover:bg-[#B9FF66] group-hover:text-[#191A23] transition-all">
                    <Eye className="w-3.5 h-3.5" /> Voir les {storyTasks.length || 2} Tâches
                  </span>
                </div>

                {/* Acceptance Criteria snippet */}
                <div className="pt-2 border-t border-[#191A23]/20 space-y-1">
                  <p className="text-[10px] text-[#191A23]/60 uppercase font-extrabold">Critères d'acceptation :</p>
                  <ul className="space-y-1">
                    {story.criteria.slice(0, 2).map((crit, i) => (
                      <li key={i} className="text-[11px] text-[#191A23] font-medium flex items-center gap-1.5 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#191A23] shrink-0"></span>
                        <span className="truncate">{crit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SUB-TASKS POP-UP MODAL WHEN CLICKING ON A USER STORY */}
      {selectedStory && (
        <div className="fixed inset-0 bg-[#191A23]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
          <div className="bg-white border-2 border-[#191A23] rounded-3xl max-w-2xl w-full p-6 space-y-5 shadow-[8px_8px_0px_#191A23] relative max-h-[85vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#191A23]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#191A23] text-[#B9FF66] border-2 border-[#191A23] flex items-center justify-center font-extrabold">
                  <ListTodo className="w-5 h-5 text-[#B9FF66]" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-extrabold px-2 py-0.5 rounded bg-[#191A23] text-[#B9FF66] border border-[#191A23]">
                      {selectedStory.id}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#B9FF66] text-[#191A23] font-extrabold border border-[#191A23]">
                      {selectedStory.module}
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-[#191A23] mt-1 leading-snug">
                    {selectedStory.title}
                  </h3>
                </div>
              </div>

              <button
                onClick={() => setSelectedStory(null)}
                className="p-1.5 rounded-xl text-[#191A23] hover:bg-[#F3F3F3] border-2 border-[#191A23]"
              >
                <X className="w-5 h-5 font-extrabold" />
              </button>
            </div>

            {/* Sub-tasks list */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-extrabold text-[#191A23]">
                <span className="flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-[#191A23]" /> Tâches Découpées pour cette Story :
                </span>
                <span className="text-[11px] font-mono bg-[#F3F3F3] px-2 py-0.5 rounded border border-[#191A23]">
                  {getSubTasksForStory(selectedStory.id).length} Tâches • {selectedStory.estimated_hours}h
                </span>
              </div>

              {getSubTasksForStory(selectedStory.id).length === 0 ? (
                <div className="p-6 rounded-2xl bg-[#F3F3F3] border-2 border-[#191A23] text-center text-xs font-extrabold text-[#191A23]/60">
                  Tâches découpées prêtes et disponibles dans le Backlog.
                </div>
              ) : (
                getSubTasksForStory(selectedStory.id).map((task) => (
                  <div
                    key={task.id}
                    className="p-4 rounded-2xl bg-white border-2 border-[#191A23] shadow-[3px_3px_0px_#191A23] space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-extrabold px-2 py-0.5 rounded bg-[#191A23] text-[#B9FF66] border border-[#191A23]">
                          {task.id}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#B9FF66] text-[#191A23] border border-[#191A23] font-extrabold">
                          {task.sprint}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-[#F3F3F3] text-[#191A23] border border-[#191A23] font-extrabold">
                          À faire
                        </span>
                      </div>
                      <span className="text-[11px] font-mono font-extrabold text-[#191A23] bg-[#F3F3F3] px-2 py-0.5 rounded border border-[#191A23]">
                        ⏱️ {task.estimated_hours}h
                      </span>
                    </div>

                    <h4 className="text-xs font-extrabold text-[#191A23] leading-snug">{task.title}</h4>
                    <p className="text-[11px] text-[#191A23]/80 font-medium leading-relaxed">{task.description}</p>

                    <div className="pt-2 border-t border-[#191A23]/20 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 text-xs">
                        <div className="w-6 h-6 rounded-lg bg-[#191A23] text-[#B9FF66] font-extrabold border border-[#191A23] flex items-center justify-center text-[10px] shrink-0">
                          {task.assignee.charAt(0)}
                        </div>
                        <div>
                          <p className="text-[#191A23] font-extrabold text-[11px]">{task.assignee}</p>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-extrabold border border-[#191A23] ${getRoleColor(task.role)}`}>
                            {task.role}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          onExplainTask(task);
                          setSelectedStory(null);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-[#F3F3F3] hover:bg-[#B9FF66] text-[#191A23] border-2 border-[#191A23] text-[11px] font-extrabold flex items-center gap-1 transition-all shadow-[2px_2px_0px_#191A23]"
                      >
                        <Bot className="w-3.5 h-3.5 text-[#191A23]" /> Guide IA
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t-2 border-[#191A23] flex justify-end">
              <button
                onClick={() => setSelectedStory(null)}
                className="px-5 py-2.5 rounded-xl bg-[#191A23] text-[#B9FF66] hover:bg-[#B9FF66] hover:text-[#191A23] border-2 border-[#191A23] font-extrabold text-xs shadow-[2px_2px_0px_#191A23] transition-all"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Suggestions Box */}
      <div className="p-5 rounded-2xl bg-[#B9FF66] border-2 border-[#191A23] shadow-[4px_4px_0px_#191A23] space-y-3">
        <h4 className="text-sm font-extrabold text-[#191A23] flex items-center gap-2">
          <Lightbulb className="w-4 h-4" /> Suggestions & Recommandations d'Amélioration IA
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {analysis.ai_suggestions.map((sug, i) => (
            <div key={i} className="p-3.5 rounded-xl bg-white border-2 border-[#191A23] text-[11px] text-[#191A23] font-bold leading-relaxed shadow-[2px_2px_0px_#191A23]">
              {sug}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


