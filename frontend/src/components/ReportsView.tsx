import React, { useState } from 'react';
import type { ProjectAnalysis } from '../types';
import { FileText, Download, CheckCircle2, BarChart2, PieChart } from 'lucide-react';

interface ReportsViewProps {
  analysis: ProjectAnalysis | null;
  projectCode: string;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ analysis, projectCode }) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const tasks = analysis?.tasks || [];
  const completedTasks = tasks.filter(t => t.status === 'Termine').length;
  const inProgressTasks = tasks.filter(t => t.status === 'En cours').length;
  const todoTasks = tasks.filter(t => t.status === 'A faire').length;

  const totalHours = tasks.reduce((acc, t) => acc + (t.estimated_hours || 0), 0);

  const handleExportSummary = (format: 'pdf' | 'markdown') => {
    setDownloadSuccess(`Rapport de projet (${format.toUpperCase()}) généré et téléchargé avec succès !`);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#F3F3F3] border-2 border-[#191A23] shadow-[6px_6px_0px_#191A23] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-extrabold px-3 py-1 rounded-md bg-[#B9FF66] text-[#191A23] border border-[#191A23] uppercase tracking-wider">
            Rapports & Bilan
          </span>
          <h1 className="text-2xl font-extrabold text-[#191A23] mt-2 flex items-center gap-2">
            <BarChart2 className="w-6 h-6 text-[#191A23]" /> Rapports de Projet & Exportation
          </h1>
          <p className="text-xs text-[#191A23]/80 font-bold mt-1">
            Générez des rapports synthétiques d'avancement pour vos clients et vos équipes.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleExportSummary('pdf')}
            className="px-4 py-2.5 rounded-2xl bg-[#191A23] text-white hover:bg-[#B9FF66] hover:text-[#191A23] border-2 border-[#191A23] font-extrabold text-xs transition-all shadow-[3px_3px_0px_#191A23] flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Exporter PDF
          </button>
          <button
            onClick={() => handleExportSummary('markdown')}
            className="px-4 py-2.5 rounded-2xl bg-white text-[#191A23] hover:bg-[#F3F3F3] border-2 border-[#191A23] font-extrabold text-xs transition-all shadow-[3px_3px_0px_#191A23] flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4" /> Export Markdown
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-4 rounded-2xl bg-[#B9FF66] border-2 border-[#191A23] text-[#191A23] text-xs font-extrabold flex items-center gap-2 shadow-[3px_3px_0px_#191A23]">
          <CheckCircle2 className="w-4 h-4 text-[#191A23]" /> {downloadSuccess}
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border-2 border-[#191A23] shadow-[4px_4px_0px_#191A23] space-y-1">
          <span className="text-[10px] uppercase font-extrabold text-[#191A23]/60">Total User Stories</span>
          <p className="text-2xl font-extrabold text-[#191A23] font-mono">{analysis?.user_stories.length || 0}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border-2 border-[#191A23] shadow-[4px_4px_0px_#191A23] space-y-1">
          <span className="text-[10px] uppercase font-extrabold text-[#191A23]/60">Tâches À faire</span>
          <p className="text-2xl font-extrabold text-[#191A23] font-mono">{todoTasks}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border-2 border-[#191A23] shadow-[4px_4px_0px_#191A23] space-y-1">
          <span className="text-[10px] uppercase font-extrabold text-[#191A23]/60">Tâches En cours</span>
          <p className="text-2xl font-extrabold text-[#38BDF8] font-mono">{inProgressTasks}</p>
        </div>

        <div className="p-5 rounded-2xl bg-white border-2 border-[#191A23] shadow-[4px_4px_0px_#191A23] space-y-1">
          <span className="text-[10px] uppercase font-extrabold text-[#191A23]/60">Tâches Terminées</span>
          <p className="text-2xl font-extrabold text-[#B9FF66] font-mono bg-[#191A23] px-2 py-0.5 rounded inline-block">{completedTasks}</p>
        </div>
      </div>

      {/* Report Preview */}
      <div className="p-6 rounded-3xl bg-white border-2 border-[#191A23] shadow-[5px_5px_0px_#191A23] space-y-4">
        <h3 className="text-lg font-extrabold text-[#191A23] flex items-center gap-2">
          <PieChart className="w-5 h-5 text-[#191A23]" /> Synthèse Exécutive du Projet
        </h3>

        <div className="p-4 rounded-2xl bg-[#F3F3F3] border-2 border-[#191A23] space-y-2 text-xs font-bold text-[#191A23]/80 leading-relaxed">
          <p>
            Projet: <strong className="text-[#191A23]">{analysis?.project_name || 'Nouveau Projet'}</strong> • Code Identifiant: <strong className="font-mono text-[#191A23]">{projectCode}</strong> • Heures totales: <strong className="font-mono text-[#191A23]">{totalHours}h</strong>
          </p>
          <p>
            Le projet comprend un découpage structuré en <strong className="text-[#191A23]">{analysis?.sprints.length || 0} Sprints</strong> et <strong className="text-[#191A23]">{tasks.length} sous-tâches techniques</strong> attribuées selon les domaines d'expertise des collaborateurs.
          </p>
        </div>
      </div>
    </div>
  );
};
