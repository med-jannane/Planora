import React, { useState } from 'react';
import { Settings, Save, CheckCircle2, Sliders } from 'lucide-react';

interface SettingsViewProps {
  projectCode: string;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ projectCode }) => {
  const [notifyEmails, setNotifyEmails] = useState(true);
  const [autoAssignment, setAutoAssignment] = useState(true);
  const [sprintDurationDays, setSprintDurationDays] = useState(14);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const [country, setCountry] = useState(() => localStorage.getItem('sprintai_country') || 'Maroc');
  const [language, setLanguage] = useState<'fr' | 'en' | 'es'>(() => (localStorage.getItem('sprintai_language') as any) || 'fr');
  const [currency, setCurrency] = useState(() => localStorage.getItem('sprintai_currency') || 'MAD');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('sprintai_country', country);
    localStorage.setItem('sprintai_language', language);
    localStorage.setItem('sprintai_currency', currency);
    setSavedNotice('Paramètres, Pays, Langue et Devise enregistrés avec succès !');
    setTimeout(() => setSavedNotice(null), 4000);
  };

  return (
    <div className="space-y-6 font-sans">
      <div className="p-6 md:p-8 rounded-3xl bg-[#F3F3F3] border-2 border-[#191A23] shadow-[6px_6px_0px_#191A23] space-y-2">
        <span className="text-[10px] font-extrabold px-3 py-1 rounded-md bg-[#B9FF66] text-[#191A23] border border-[#191A23] uppercase tracking-wider">
          Configuration Projet
        </span>
        <h1 className="text-2xl font-extrabold text-[#191A23] flex items-center gap-2">
          <Settings className="w-6 h-6 text-[#191A23]" /> Paramètres du Projet ({projectCode})
        </h1>
        <p className="text-xs text-[#191A23]/80 font-bold">
          Ajustez les préférences d'attribution, la durée par défaut des Sprints et les notifications.
        </p>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-2xl bg-[#B9FF66] border-2 border-[#191A23] text-[#191A23] text-xs font-extrabold flex items-center gap-2 shadow-[3px_3px_0px_#191A23]">
          <CheckCircle2 className="w-4 h-4 text-[#191A23]" /> {savedNotice}
        </div>
      )}

      <form onSubmit={handleSave} className="p-6 rounded-3xl bg-white border-2 border-[#191A23] shadow-[5px_5px_0px_#191A23] space-y-6">
        <div className="space-y-4">
          <h3 className="text-base font-extrabold text-[#191A23] flex items-center gap-2 pb-2 border-b-2 border-[#191A23]">
            <Sliders className="w-5 h-5 text-[#191A23]" /> Règles de Gestion & Sprints
          </h3>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F3F3F3] border-2 border-[#191A23]">
            <div>
              <h4 className="text-xs font-extrabold text-[#191A23]">Attribution Automatique selon les Compétences</h4>
              <p className="text-[11px] text-[#191A23]/70 font-medium">Répartir intelligemment les sous-tâches entre collaborateurs inscrits.</p>
            </div>
            <input
              type="checkbox"
              checked={autoAssignment}
              onChange={(e) => setAutoAssignment(e.target.checked)}
              className="w-5 h-5 accent-[#191A23] rounded border-2 border-[#191A23] cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#F3F3F3] border-2 border-[#191A23]">
            <div>
              <h4 className="text-xs font-extrabold text-[#191A23]">Notifications Automatiques par Email</h4>
              <p className="text-[11px] text-[#191A23]/70 font-medium">Envoyer un mail lors de chaque attribution ou mise à jour de tâche.</p>
            </div>
            <input
              type="checkbox"
              checked={notifyEmails}
              onChange={(e) => setNotifyEmails(e.target.checked)}
              className="w-5 h-5 accent-[#191A23] rounded border-2 border-[#191A23] cursor-pointer"
            />
          </div>

          <div className="p-4 rounded-2xl bg-[#F3F3F3] border-2 border-[#191A23] space-y-2">
            <h4 className="text-xs font-extrabold text-[#191A23]">Durée par défaut des Sprints (en jours)</h4>
            <input
              type="number"
              min={7}
              max={30}
              value={sprintDurationDays}
              onChange={(e) => setSprintDurationDays(Number(e.target.value))}
              className="px-4 py-2 rounded-xl bg-white border-2 border-[#191A23] text-xs font-mono font-extrabold w-32 focus:outline-none"
            />
          </div>

          <div className="p-4 rounded-2xl bg-[#F3F3F3] border-2 border-[#191A23] space-y-3">
            <h4 className="text-xs font-extrabold text-[#191A23]">Localisation & Devise</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-extrabold text-[#191A23] mb-1">Pays</label>
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border-2 border-[#191A23] text-xs font-bold text-[#191A23] focus:outline-none"
                >
                  <option value="Maroc">Maroc (🇲🇦)</option>
                  <option value="France">France (🇫🇷)</option>
                  <option value="Espagne">Espagne (🇪🇸)</option>
                  <option value="États-Unis">États-Unis (🇺🇸)</option>
                  <option value="Royaume-Uni">Royaume-Uni (🇬🇧)</option>
                  <option value="Canada">Canada (🇨🇦)</option>
                  <option value="Belgique">Belgique (🇧🇪)</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-[#191A23] mb-1">Langue de l'Interface</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-white border-2 border-[#191A23] text-xs font-bold text-[#191A23] focus:outline-none"
                >
                  <option value="fr">Français (FR)</option>
                  <option value="en">English (EN)</option>
                  <option value="es">Español (ES)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-extrabold text-[#191A23] mb-1">Monnaie / Devise</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white border-2 border-[#191A23] text-xs font-bold text-[#191A23] focus:outline-none"
                >
                  <option value="MAD">MAD (DH - Dirham Marocain)</option>
                  <option value="EUR">EUR (€ - Euro)</option>
                  <option value="USD">USD ($ - Dollar US)</option>
                  <option value="GBP">GBP (£ - Livre Sterling)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-3 rounded-2xl bg-[#191A23] text-[#B9FF66] hover:bg-[#B9FF66] hover:text-[#191A23] border-2 border-[#191A23] font-extrabold text-xs shadow-[4px_4px_0px_#191A23] transition-all flex items-center gap-2"
        >
          <Save className="w-4 h-4" /> Enregistrer les Paramètres
        </button>
      </form>
    </div>
  );
};
