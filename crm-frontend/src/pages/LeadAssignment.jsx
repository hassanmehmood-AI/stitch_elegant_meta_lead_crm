import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import TopNavbar from '../components/layout/TopNavbar';
import StatusTag from '../components/shared/StatusTag';
import AddLeadModal from '../components/leads/AddLeadModal';
import { useRole } from '../hooks/useRole';
import { api, AGENTS } from '../services/api';

const USER_BY_ROLE = {
  ceo:      { name: 'Marcus Sterling', role: 'Chief Executive Officer', initials: 'MS' },
  manager:  { name: 'Alex Sterling',   role: 'Sales Manager',           initials: 'AS' },
  employee: { name: 'Momin',           role: 'Senior Agent',            initials: 'MO' },
};


const AGENT_MAP = Object.fromEntries(AGENTS.map((a) => [a.initials, a]));

/* ─── Employee: assigned leads tracking view ─── */
function EmployeeAssignView() {
  const navigate = useNavigate();
  const [leads,   setLeads]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const loadLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAssignedLeadsOverview('AR');
      setLeads(data);
    } catch (err) {
      setError(err.message || 'Failed to load assigned leads.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadLeads(); }, []);

  // Group by assigned agent
  const grouped = AGENTS.reduce((acc, agent) => {
    const agentLeads = leads.filter((l) => l.assignedAgent === agent.initials);
    if (agentLeads.length > 0) acc[agent.initials] = { agent, leads: agentLeads };
    return acc;
  }, {});

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="font-bold text-[40px] text-on-background tracking-tight mb-2">Assigned Leads</h1>
          <p className="text-slate-500">Leads you have assigned to agents — track their progress here.</p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-primary-container/10">
          <span className="text-xs font-bold text-slate-600 px-3">
            {leads.length} lead{leads.length !== 1 ? 's' : ''} assigned
          </span>
          <button
            onClick={loadLeads}
            className="px-4 py-2 text-blue-600 rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-blue-50/50 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">refresh</span>
            Refresh
          </button>
        </div>
      </div>

      {error ? (
        <div className="py-16 flex flex-col items-center gap-3 text-center">
          <span className="material-symbols-outlined text-4xl text-red-400">error_outline</span>
          <p className="text-red-500 font-semibold">{error}</p>
          <button onClick={loadLeads} className="px-5 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors">Try Again</button>
        </div>
      ) : loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Loading assigned leads...</p>
        </div>
      ) : leads.length === 0 ? (
        <div className="py-20 text-center text-slate-400">
          <span className="material-symbols-outlined text-5xl block mb-3">assignment_ind</span>
          <p className="font-semibold text-slate-600 mb-1">No leads assigned yet</p>
          <p className="text-sm">Open a lead and use "Assign Agent" to assign it to an agent.</p>
          <button
            onClick={() => navigate('/leads/my')}
            className="mt-6 px-6 py-2.5 bg-primary-container text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all"
          >
            Go to My Leads
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.values(grouped).map(({ agent, leads: agentLeads }) => (
            <div key={agent.initials} className="bg-white rounded-[20px] border border-blue-100/10 shadow-[0_4px_30px_-10px_rgba(27,46,253,0.05)] overflow-hidden">
              {/* Agent Header */}
              <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-4 bg-slate-50/40">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                  {agent.initials}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-on-surface">{agent.name}</p>
                  <p className="text-xs text-slate-400">{agent.role}</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-700">
                  {agentLeads.length} lead{agentLeads.length !== 1 ? 's' : ''}
                </span>
                {/* Capacity bar */}
                <div className="hidden md:flex items-center gap-2">
                  <span className="text-xs text-slate-400">{agent.current}/{agent.capacity}</span>
                  <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${agent.utilPct >= 90 ? 'bg-red-400' : agent.utilPct >= 75 ? 'bg-amber-400' : 'bg-green-400'}`}
                      style={{ width: `${agent.utilPct}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Lead Rows */}
              <div className="divide-y divide-slate-50">
                {agentLeads.map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => navigate(`/leads/${lead.id}`)}
                    className="flex items-center gap-4 px-6 py-4 hover:bg-blue-50/10 transition-colors cursor-pointer group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-700 font-bold text-xs flex-shrink-0">
                      {lead.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{lead.name}</p>
                      <p className="text-xs text-slate-400 truncate">{lead.company}</p>
                    </div>
                    <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
                      <span className="material-symbols-outlined text-[14px]">campaign</span>
                      {lead.source}
                    </div>
                    <StatusTag status={lead.status} />
                    {lead.value && (
                      <span className="text-sm font-bold text-slate-700 ml-2">
                        ${Number(lead.value).toLocaleString()}
                      </span>
                    )}
                    <span className="material-symbols-outlined text-slate-300 group-hover:text-blue-400 transition-colors">
                      chevron_right
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Manager: full bulk-assign view ─── */
function ManagerAssignView() {
  const [showAddLead, setShowAddLead] = useState(false);
  const [leads,    setLeads]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [selected, setSelected] = useState([]);
  const [assignedAgent, setAssignedAgent] = useState(null);
  const [assigning, setAssigning] = useState(false);
  const [doneCount, setDoneCount] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.getUnassignedLeads()
      .then((data) => { setLeads(data); setLoading(false); })
      .catch((err) => { setError(err.message || 'Failed to load unassigned leads.'); setLoading(false); });
  }, []);

  const toggleSelect = (id) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const handleBulkAssign = async () => {
    if (!assignedAgent || selected.length === 0) return;
    setAssigning(true);
    await Promise.all(selected.map((id) => api.assignLeadToAgent(id, assignedAgent)));
    setDoneCount((n) => n + selected.length);
    setLeads((prev) => prev.filter((l) => !selected.includes(l.id)));
    setSelected([]);
    setAssigning(false);
  };

  return (
    <>
      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-bold text-[40px] text-on-background tracking-tight mb-2">Lead Assignment</h1>
            <p className="text-slate-500">Distribute unassigned leads to your team efficiently.</p>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 rounded-2xl shadow-sm border border-primary-container/10">
            {selected.length > 0 && (
              <span className="text-xs font-bold text-blue-700 px-3">{selected.length} selected</span>
            )}
            <button
              onClick={handleBulkAssign}
              disabled={!assignedAgent || selected.length === 0 || assigning}
              className="px-4 py-2 bg-blue-50/50 text-blue-700 rounded-lg text-sm font-bold flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-100/50 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">checklist</span>
              {assigning ? 'Assigning...' : 'Bulk Assign'}
            </button>
            <button className="px-4 py-2 text-slate-500 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-50 transition-colors">
              <span className="material-symbols-outlined text-sm">filter_alt</span>
              Filter
            </button>
          </div>
        </div>

        {doneCount > 0 && (
          <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-2xl flex items-center gap-3">
            <span className="material-symbols-outlined text-green-600">check_circle</span>
            <p className="text-sm text-green-700 font-medium">{doneCount} lead(s) successfully assigned.</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Unassigned Leads */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-[20px] border border-blue-100/10 shadow-[0_4px_30px_-10px_rgba(27,46,253,0.05)] overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between">
                <h3 className="font-bold text-on-surface">Unassigned Leads <span className="text-blue-600">({leads.length})</span></h3>
                <button className="text-xs font-bold text-slate-400 hover:text-blue-600 transition-colors">Sort by Priority</button>
              </div>
              {error ? (
                <div className="py-10 flex flex-col items-center gap-3 text-center">
                  <span className="material-symbols-outlined text-3xl text-red-400">error_outline</span>
                  <p className="text-red-500 text-sm font-semibold">{error}</p>
                  <button
                    onClick={() => {
                      setError(null);
                      setLoading(true);
                      api.getUnassignedLeads()
                        .then((data) => { setLeads(data); setLoading(false); })
                        .catch((err) => { setError(err.message || 'Failed to load leads.'); setLoading(false); });
                    }}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              ) : loading ? (
                <div className="py-16 flex flex-col items-center justify-center gap-3">
                  <div className="w-9 h-9 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                  <p className="text-slate-400 text-sm font-medium">Loading...</p>
                </div>
              ) : leads.length === 0 ? (
                <div className="py-16 text-center text-slate-400">
                  <span className="material-symbols-outlined text-4xl block mb-2">inbox</span>
                  All leads are assigned.
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {leads.map((lead) => (
                    <div
                      key={lead.id}
                      className={`flex items-center gap-4 px-6 py-4 hover:bg-blue-50/20 transition-colors cursor-pointer ${selected.includes(lead.id) ? 'bg-blue-50/30' : ''}`}
                      onClick={() => toggleSelect(lead.id)}
                    >
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${selected.includes(lead.id) ? 'bg-blue-600 border-blue-600' : 'border-slate-300'}`}>
                        {selected.includes(lead.id) && <span className="material-symbols-outlined text-white text-xs">check</span>}
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                        {lead.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800">{lead.name}</p>
                        <p className="text-xs text-slate-400">{lead.company} · {lead.source}</p>
                      </div>
                      <StatusTag status={lead.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Agent Selection */}
          <div>
            <div className="bg-white rounded-[20px] border border-blue-100/10 shadow-[0_4px_30px_-10px_rgba(27,46,253,0.05)] overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-50">
                <h3 className="font-bold text-on-surface">Assign to Agent</h3>
                <p className="text-xs text-slate-400 mt-0.5">Select an agent to assign the selected leads</p>
              </div>
              <div className="divide-y divide-slate-50">
                {AGENTS.map((agent) => (
                  <div
                    key={agent.name}
                    onClick={() => setAssignedAgent(agent.initials)}
                    className={`p-4 hover:bg-blue-50/20 transition-colors cursor-pointer ${assignedAgent === agent.initials ? 'bg-blue-50/30 border-l-4 border-blue-600' : ''}`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                        {agent.initials}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface">{agent.name}</p>
                        <p className="text-xs text-slate-400">{agent.role}</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-slate-500">
                        <span>Utilization</span>
                        <span className="font-bold">{agent.current}/{agent.capacity}</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${agent.utilPct >= 90 ? 'bg-red-400' : agent.utilPct >= 75 ? 'bg-amber-400' : 'bg-primary-container'}`}
                          style={{ width: `${agent.utilPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 border-t border-slate-50">
                <button
                  onClick={handleBulkAssign}
                  disabled={!assignedAgent || selected.length === 0 || assigning}
                  className="w-full py-3 bg-primary-container text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {assigning ? 'Assigning...' : `Assign ${selected.length > 0 ? `${selected.length} Lead${selected.length > 1 ? 's' : ''}` : 'Selected Leads'}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showAddLead && <AddLeadModal onClose={() => setShowAddLead(false)} onSubmit={() => {}} />}
    </>
  );
}

/* ─── Page wrapper ─── */
export default function LeadAssignment() {
  const role = useRole();
  const user = USER_BY_ROLE[role] || USER_BY_ROLE.manager;
  const [showAddLead, setShowAddLead] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} />
      <main className="flex-1 ml-64 min-h-screen">
        <TopNavbar
          onAddLead={() => setShowAddLead(true)}
          searchPlaceholder={role === 'employee' ? 'Search assigned leads...' : 'Search unassigned leads...'}
          role={role}
        />
        {role === 'employee' ? <EmployeeAssignView /> : <ManagerAssignView />}
      </main>
      {showAddLead && <AddLeadModal onClose={() => setShowAddLead(false)} onSubmit={() => {}} />}
    </div>
  );
}
