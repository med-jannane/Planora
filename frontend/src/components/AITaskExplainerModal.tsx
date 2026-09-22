import React, { useState, useEffect } from 'react';
import type { Task } from '../types';
import { fetchTaskExplanation } from '../services/api';
import { Bot, X, Sparkles, Cpu } from 'lucide-react';

interface ModalProps {
  task: Task | null;
  onClose: () => void;
}

export const AITaskExplainerModal: React.FC<ModalProps> = ({ task, onClose }) => {
  const [explanation, setExplanation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (task) {
      setLoading(true);
      fetchTaskExplanation(task.title, task.assignee, task.role, task.description)
        .then((res) => {
          setExplanation(res);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [task]);

  if (!task) return null;

  return (
    <div className="fixed inset-0 bg-[#191A23]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white border-2 border-[#191A23] rounded-[35px] max-w-2xl w-full p-7 space-y-6 shadow-[8px_8px_0px_#191A23] relative max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#191A23] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#191A23] text-[#B9FF66] border-2 border-[#191A23] flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <span className="bg-[#B9FF66] text-[#191A23] font-extrabold px-2.5 py-0.5 rounded text-[10px] border border-[#191A23]">
                Assistant Virtuel IA pour {task.assignee}
              </span>
              <h3 className="text-base font-extrabold text-[#191A23] leading-snug mt-1">{task.title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[#191A23] hover:bg-[#F3F3F3] border-2 border-transparent hover:border-[#191A23] transition-colors"
          >
            <X className="w-5 h-5 font-extrabold" />
          </button>
        </div>

        {/* Loading vs Explanation */}
        {loading ? (
          <div className="py-12 text-center space-y-3">
            <Cpu className="w-8 h-8 text-[#191A23] animate-spin mx-auto" />
            <p className="text-xs font-extrabold text-[#191A23]">
              Génération du guide d'exécution sur-mesure par l'IA...
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-xs text-[#191A23] leading-relaxed whitespace-pre-line font-medium">
            <div className="p-5 rounded-3xl bg-[#F3F3F3] border-2 border-[#191A23] font-bold">
              {explanation}
            </div>

            <div className="p-4 rounded-2xl bg-[#B9FF66] border-2 border-[#191A23] flex items-center justify-between text-xs text-[#191A23] font-extrabold shadow-[3px_3px_0px_#191A23]">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#191A23]" /> Des questions supplémentaires sur cette tâche ?
              </span>
              <span className="text-xs font-extrabold">L'IA vous accompagne.</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-3 border-t-2 border-[#191A23] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-2xl bg-[#191A23] hover:bg-[#B9FF66] hover:text-[#191A23] text-white font-extrabold text-xs border-2 border-[#191A23] shadow-[3px_3px_0px_#191A23] transition-all"
          >
            Fermer le Guide IA
          </button>
        </div>
      </div>
    </div>
  );
};
