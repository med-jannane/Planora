import React, { useState } from 'react';
import type { TeamMember } from '../types';
import { Users, DollarSign, Calendar, Laptop, Plus, Trash2, CheckCircle2 } from 'lucide-react';

interface ResourceItem {
  id: string;
  name: string;
  category: 'Matériel' | 'Serveur / Cloud' | 'Licence Logiciel';
  cost: number;
  assignedTo: string;
}

interface MemberLeave {
  id: string;
  memberName: string;
  startDate: string;
  endDate: string;
  reason: string;
}

interface ResourceManagementProps {
  teamMembers: TeamMember[];
  isManager?: boolean;
}

export const ResourceManagementView: React.FC<ResourceManagementProps> = ({ teamMembers, isManager = false }) => {
  const [activeSubTab, setActiveSubTab] = useState<'hr' | 'material' | 'leaves'>('hr');

  // Currency selection
  const [currency, setCurrency] = useState<'MAD' | 'EUR' | 'USD' | 'GBP'>(() => {
    return (localStorage.getItem('sprintai_currency') as any) || 'MAD';
  });

  const handleCurrencyChange = (curr: 'MAD' | 'EUR' | 'USD' | 'GBP') => {
    setCurrency(curr);
    localStorage.setItem('sprintai_currency', curr);
  };

  const formatMoney = (amount: number) => {
    if (currency === 'MAD') return `${amount.toLocaleString()} DH`;
    if (currency === 'EUR') return `${amount.toLocaleString()} €`;
    if (currency === 'USD') return `$${amount.toLocaleString()}`;
    return `£${amount.toLocaleString()}`;
  };

  const formatRate = (rate: number) => {
    if (currency === 'MAD') return `${rate} DH/h`;
    if (currency === 'EUR') return `${rate} €/h`;
    if (currency === 'USD') return `$${rate}/h`;
    return `£${rate}/h`;
  };

  // Salaries & Hourly rates
  const [hourlyRates, setHourlyRates] = useState<Record<string, number>>({
    '1': 150,
    '2': 200,
    '3': 120,
  });

  // Material resources state
  const [resources, setResources] = useState<ResourceItem[]>([]);

  // Leaves state
  const [leaves, setLeaves] = useState<MemberLeave[]>([]);

  // New Material Resource form state
  const [newResName, setNewResName] = useState('');
  const [newResCategory, setNewResCategory] = useState<ResourceItem['category']>('Matériel');
  const [newResCost, setNewResCost] = useState(100);
  const [newResAssignee, setNewResAssignee] = useState(teamMembers[0]?.name || 'Équipe Global');

  // New Leave form state
  const [newLeaveMember, setNewLeaveMember] = useState(teamMembers[0]?.name || 'Collaborateur');
  const [newLeaveStart, setNewLeaveStart] = useState('');
  const [newLeaveEnd, setNewLeaveEnd] = useState('');
  const [newLeaveReason, setNewLeaveReason] = useState('Congé payé');

  const [notice, setNotice] = useState<string | null>(null);

  const handleRateChange = (memberId: string, rate: number) => {
    setHourlyRates(prev => ({ ...prev, [memberId]: rate }));
  };

  const handleAddResource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResName.trim()) return;
    const item: ResourceItem = {
      id: Date.now().toString(),
      name: newResName.trim(),
      category: newResCategory,
      cost: newResCost,
      assignedTo: newResAssignee,
    };
    setResources([...resources, item]);
    setNewResName('');
    setNotice(`Ressource matérielle "${item.name}" ajoutée !`);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleRemoveResource = (id: string) => {
    setResources(resources.filter(r => r.id !== id));
  };

  const handleAddLeave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeaveStart || !newLeaveEnd) return;
    const leave: MemberLeave = {
      id: Date.now().toString(),
      memberName: newLeaveMember,
      startDate: newLeaveStart,
      endDate: newLeaveEnd,
      reason: newLeaveReason,
    };
    setLeaves([...leaves, leave]);
    setNewLeaveStart('');
    setNewLeaveEnd('');
    setNotice(`Période d'absence ajoutée pour ${leave.memberName} !`);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleRemoveLeave = (id: string) => {
    setLeaves(leaves.filter(l => l.id !== id));
  };

  const totalMaterialCost = resources.reduce((acc, r) => acc + r.cost, 0);

  return (
    <div className="space-y-6 font-sans">
      {/* Header Banner */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#F3F3F3] border-2 border-[#191A23] shadow-[6px_6px_0px_#191A23] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-2">
          <span className="text-[10px] font-extrabold px-3 py-1 rounded-md bg-[#B9FF66] text-[#191A23] border border-[#191A23] uppercase tracking-wider">
            Gestion des Ressources & RH
          </span>
          <h1 className="text-2xl font-extrabold text-[#191A23] flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-[#191A23]" /> Ressources, Salaires, Matériel & Congés
          </h1>
          <p className="text-xs text-[#191A23]/80 font-bold">
            Pilotez le budget des équipes, les équipements attribués et les périodes de congés/indisponibilités pour le Diagramme de Gantt.
          </p>
        </div>

        {/* Currency Switcher Dropdown */}
        <div className="p-3 rounded-2xl bg-white border-2 border-[#191A23] shadow-[3px_3px_0px_#191A23] space-y-1 shrink-0">
          <label className="block text-[10px] font-extrabold text-[#191A23] uppercase">Monnaie / Devise :</label>
          <select
            value={currency}
            onChange={(e) => handleCurrencyChange(e.target.value as any)}
            className="w-full px-3 py-1.5 rounded-xl bg-[#F3F3F3] border-2 border-[#191A23] text-xs font-extrabold text-[#191A23] focus:outline-none"
          >
            <option value="MAD">🇲🇦 MAD (DH - Dirham Marocain)</option>
            <option value="EUR">🇪🇺 EUR (€ - Euro)</option>
            <option value="USD">🇺🇸 USD ($ - Dollar US)</option>
            <option value="GBP">🇬🇧 GBP (£ - Livre Sterling)</option>
          </select>
        </div>
      </div>

      {notice && (
        <div className="p-4 rounded-2xl bg-[#B9FF66] border-2 border-[#191A23] text-[#191A23] text-xs font-extrabold flex items-center gap-2 shadow-[3px_3px_0px_#191A23]">
          <CheckCircle2 className="w-4 h-4 text-[#191A23]" /> {notice}
        </div>
      )}

      {/* Sub-tab switcher */}
      <div className="flex items-center gap-2 border-b-2 border-[#191A23] pb-3 overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('hr')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all border-2 flex items-center gap-2 ${
            activeSubTab === 'hr'
              ? 'bg-[#191A23] text-[#B9FF66] border-[#191A23] shadow-[3px_3px_0px_#B9FF66]'
              : 'bg-white text-[#191A23] border-[#191A23] hover:bg-[#F3F3F3]'
          }`}
        >
          <DollarSign className="w-4 h-4" /> RH & Taux Horaires
        </button>

        <button
          onClick={() => setActiveSubTab('material')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all border-2 flex items-center gap-2 ${
            activeSubTab === 'material'
              ? 'bg-[#191A23] text-[#B9FF66] border-[#191A23] shadow-[3px_3px_0px_#B9FF66]'
              : 'bg-white text-[#191A23] border-[#191A23] hover:bg-[#F3F3F3]'
          }`}
        >
          <Laptop className="w-4 h-4" /> Ressources Matérielles ({resources.length})
        </button>

        <button
          onClick={() => setActiveSubTab('leaves')}
          className={`px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all border-2 flex items-center gap-2 ${
            activeSubTab === 'leaves'
              ? 'bg-[#191A23] text-[#B9FF66] border-[#191A23] shadow-[3px_3px_0px_#B9FF66]'
              : 'bg-white text-[#191A23] border-[#191A23] hover:bg-[#F3F3F3]'
          }`}
        >
          <Calendar className="w-4 h-4" /> Congés & Planning Gantt ({leaves.length})
        </button>
      </div>

      {/* SUB-TAB 1: HR & HOURLY RATES */}
      {activeSubTab === 'hr' && (
        <div className="p-6 rounded-3xl bg-white border-2 border-[#191A23] shadow-[5px_5px_0px_#191A23] space-y-4">
          <h3 className="text-base font-extrabold text-[#191A23] flex items-center gap-2">
            <Users className="w-5 h-5 text-[#191A23]" /> Taux Horaires & Estimation des Coûts RH ({currency})
          </h3>

          {teamMembers.length === 0 ? (
            <p className="text-xs text-[#191A23]/50 italic font-bold py-6 text-center">
              Aucun membre dans l'équipe pour le moment.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {teamMembers.map((member) => {
                const rate = hourlyRates[member.id] || 150;
                const monthlyCost = rate * 140; // 140 hours approx per month

                return (
                  <div key={member.id} className="p-4 rounded-2xl bg-[#F3F3F3] border-2 border-[#191A23] space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-[#191A23] text-[#B9FF66] flex items-center justify-center font-extrabold text-xs">
                          {member.avatar || member.name.charAt(0)}
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-[#191A23]">{member.name}</h4>
                          <p className="text-[10px] text-[#191A23]/70 font-bold">{member.role}</p>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white text-[#191A23] border border-[#191A23] font-bold">
                        {member.user_code || 'MEMBRE'}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-[#191A23]/20 flex items-center justify-between text-xs font-bold">
                      <label className="text-[#191A23]/70">Taux Horaire :</label>
                      {isManager ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={rate}
                            onChange={(e) => handleRateChange(member.id, Number(e.target.value))}
                            className="w-20 px-2 py-1 rounded-lg bg-white border-2 border-[#191A23] font-mono font-extrabold text-right text-xs"
                          />
                          <span className="font-mono text-xs font-extrabold text-[#191A23]">{currency === 'MAD' ? 'DH/h' : currency === 'EUR' ? '€/h' : currency === 'USD' ? '$/h' : '£/h'}</span>
                        </div>
                      ) : (
                        <span className="font-mono font-extrabold text-[#191A23]">{formatRate(rate)}</span>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-extrabold pt-1">
                      <span className="text-[#191A23]/60">Budget Mensuel estimé :</span>
                      <span className="font-mono bg-[#B9FF66] text-[#191A23] px-2 py-0.5 rounded border border-[#191A23]">
                        {formatMoney(monthlyCost)} / mois
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 2: MATERIAL & INFRASTRUCTURE RESOURCES */}
      {activeSubTab === 'material' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border-2 border-[#191A23] shadow-[5px_5px_0px_#191A23] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b-2 border-[#191A23]">
              <h3 className="text-base font-extrabold text-[#191A23] flex items-center gap-2">
                <Laptop className="w-5 h-5 text-[#191A23]" /> Équipements, Serveurs & Licences
              </h3>
              <span className="text-xs font-mono font-extrabold bg-[#B9FF66] text-[#191A23] px-3 py-1 rounded-xl border border-[#191A23]">
                Total Matériel: {formatMoney(totalMaterialCost)}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {resources.map((res) => (
                <div key={res.id} className="p-4 rounded-2xl bg-[#F3F3F3] border-2 border-[#191A23] space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-white border border-[#191A23]">
                        {res.category}
                      </span>
                      {isManager && (
                        <button onClick={() => handleRemoveResource(res.id)} className="text-[#191A23] hover:text-rose-700">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <h4 className="text-xs font-extrabold text-[#191A23]">{res.name}</h4>
                    <p className="text-[11px] text-[#191A23]/70 font-medium">Attribuer à: {res.assignedTo}</p>
                  </div>

                  <div className="pt-2 border-t border-[#191A23]/20 flex items-center justify-between text-xs font-mono font-extrabold">
                    <span>Coût:</span>
                    <span className="bg-white px-2 py-0.5 rounded border border-[#191A23]">{formatMoney(res.cost)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add Material Resource form (Manager only) */}
          {isManager && (
            <form onSubmit={handleAddResource} className="p-6 rounded-3xl bg-white border-2 border-[#191A23] shadow-[5px_5px_0px_#191A23] space-y-4">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#191A23] flex items-center gap-1.5">
                <Plus className="w-4 h-4 text-[#191A23]" /> Ajouter un Équipement / Serveur
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="text"
                  required
                  placeholder="Nom (ex: Serveur Cloud AWS)"
                  value={newResName}
                  onChange={(e) => setNewResName(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-[#F3F3F3] border-2 border-[#191A23] text-xs font-bold text-[#191A23] focus:outline-none"
                />

                <select
                  value={newResCategory}
                  onChange={(e) => setNewResCategory(e.target.value as any)}
                  className="px-3.5 py-2 rounded-xl bg-[#F3F3F3] border-2 border-[#191A23] text-xs font-bold text-[#191A23] focus:outline-none"
                >
                  <option value="Matériel">Matériel</option>
                  <option value="Serveur / Cloud">Serveur / Cloud</option>
                  <option value="Licence Logiciel">Licence Logiciel</option>
                </select>

                <input
                  type="number"
                  min={0}
                  placeholder="Coût (€)"
                  value={newResCost}
                  onChange={(e) => setNewResCost(Number(e.target.value))}
                  className="px-3.5 py-2 rounded-xl bg-[#F3F3F3] border-2 border-[#191A23] text-xs font-mono font-extrabold text-[#191A23] focus:outline-none"
                />

                <input
                  type="text"
                  placeholder="Attribuer à"
                  value={newResAssignee}
                  onChange={(e) => setNewResAssignee(e.target.value)}
                  className="px-3.5 py-2 rounded-xl bg-[#F3F3F3] border-2 border-[#191A23] text-xs font-bold text-[#191A23] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-[#191A23] text-[#B9FF66] hover:bg-[#B9FF66] hover:text-[#191A23] border-2 border-[#191A23] font-extrabold text-xs shadow-[2px_2px_0px_#191A23] transition-all"
              >
                Ajouter la Ressource
              </button>
            </form>
          )}
        </div>
      )}

      {/* SUB-TAB 3: LEAVES & DISPONIBILITIES FOR GANTT */}
      {activeSubTab === 'leaves' && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border-2 border-[#191A23] shadow-[5px_5px_0px_#191A23] space-y-4">
            <h3 className="text-base font-extrabold text-[#191A23] flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#191A23]" /> Congés, Absences & Intégration Chronogramme Gantt
            </h3>

            <p className="text-xs text-[#191A23]/75 font-bold leading-relaxed">
              Les périodes déclarées ci-dessous sont prises en compte lors du calcul de la disponibilité des membres de l'équipe pour les Sprints.
            </p>

            <div className="space-y-3">
              {leaves.map((leave) => (
                <div key={leave.id} className="p-4 rounded-2xl bg-[#F3F3F3] border-2 border-[#191A23] flex items-center justify-between text-xs">
                  <div className="space-y-0.5">
                    <h4 className="font-extrabold text-[#191A23] flex items-center gap-2">
                      {leave.memberName}
                      <span className="text-[10px] font-mono px-2 py-0.2 rounded bg-white border border-[#191A23] font-bold">
                        {leave.reason}
                      </span>
                    </h4>
                    <p className="text-[11px] text-[#191A23]/70 font-mono font-bold">
                      Du {leave.startDate} au {leave.endDate}
                    </p>
                  </div>

                  {isManager && (
                    <button onClick={() => handleRemoveLeave(leave.id)} className="p-1.5 text-[#191A23] hover:text-rose-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add Leave Form (Manager or Team Member) */}
          <form onSubmit={handleAddLeave} className="p-6 rounded-3xl bg-white border-2 border-[#191A23] shadow-[5px_5px_0px_#191A23] space-y-4">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#191A23] flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-[#191A23]" /> Déclarer une Période d'Absence / Congé
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] font-extrabold text-[#191A23] mb-1">Membre</label>
                <select
                  value={newLeaveMember}
                  onChange={(e) => setNewLeaveMember(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F3F3F3] border-2 border-[#191A23] text-xs font-bold text-[#191A23] focus:outline-none"
                >
                  {teamMembers.map(m => (
                    <option key={m.id} value={m.name}>{m.name}</option>
                  ))}
                  <option value="Collaborateur">Collaborateur</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-[#191A23] mb-1">Motif</label>
                <input
                  type="text"
                  placeholder="Ex: Congé payé, Formation..."
                  value={newLeaveReason}
                  onChange={(e) => setNewLeaveReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F3F3F3] border-2 border-[#191A23] text-xs font-bold text-[#191A23] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-[#191A23] mb-1">Date de Début</label>
                <input
                  type="date"
                  required
                  value={newLeaveStart}
                  onChange={(e) => setNewLeaveStart(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F3F3F3] border-2 border-[#191A23] text-xs font-mono font-bold text-[#191A23] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-extrabold text-[#191A23] mb-1">Date de Fin</label>
                <input
                  type="date"
                  required
                  value={newLeaveEnd}
                  onChange={(e) => setNewLeaveEnd(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F3F3F3] border-2 border-[#191A23] text-xs font-mono font-bold text-[#191A23] focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#191A23] text-[#B9FF66] hover:bg-[#B9FF66] hover:text-[#191A23] border-2 border-[#191A23] font-extrabold text-xs shadow-[2px_2px_0px_#191A23] transition-all"
            >
              Enregistrer la Période d'Absence
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
