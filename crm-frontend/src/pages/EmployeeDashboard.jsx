import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import TopNavbar from '../components/layout/TopNavbar';
import StatusTag from '../components/shared/StatusTag';
import LeadDetailsDrawer from '../components/shared/LeadDetailsDrawer';
import { api, AGENTS } from '../services/api';


function StatCard({ label, value, subValue, subLabel, subColor = "text-emerald-500" }) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex flex-col gap-1">
      <p className="text-[11px] font-bold text-blue-900 uppercase tracking-wider opacity-80">{label}</p>
      <div className="flex items-baseline gap-2 mt-1">
        <h3 className="text-4xl font-bold text-blue-950 tracking-tight">{value}</h3>
        {subValue && (
          <p className={`text-xs font-bold ${subColor}`}>
            {subValue} <span className="opacity-60 font-medium">{subLabel}</span>
          </p>
        )}
      </div>
    </div>
  );
}



function EmployeeLeadsList({ leads, onLeadClick, onViewDetail }) {
  const navigate = useNavigate();

  return (
    <div className="mt-12 bg-white rounded-[32px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden">
      <div className="px-8 py-6 border-b border-slate-50 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-blue-950">New Entry Leads</h3>
        </div>
        <button
          onClick={() => navigate('/leads/my')}
          className="text-[11px] font-bold text-blue-600 uppercase tracking-widest hover:text-blue-700 transition-colors flex items-center gap-1"
        >
          My All Leads
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lead</th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Whatsapp</th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Platform</th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Next Follow-up</th>
              <th className="px-4 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
              <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {leads.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-20 text-center">
                  <span className="material-symbols-outlined text-4xl text-slate-200 block mb-3">person_search</span>
                  <p className="text-sm text-slate-400">No new entry leads</p>
                  <p className="text-xs text-slate-300 mt-1">All leads have been actioned — check My All Leads</p>
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-slate-50/50 transition-all group"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0 group-hover:scale-105 transition-transform">
                        {lead.initials}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate max-w-[150px]">
                          {lead.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[150px]">{lead.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <p className="text-xs font-semibold text-slate-600">{lead.whatsapp_number}</p>
                  </td>
                  <td className="px-4 py-5">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${lead.platform === 'Facebook' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'
                      }`}>
                      {lead.platform}
                    </span>
                  </td>
                  <td className="px-4 py-5">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <span className="material-symbols-outlined text-sm">event</span>
                      <p className="text-xs font-semibold">{lead.next_follow_up}</p>
                    </div>
                  </td>
                  <td className="px-4 py-5">
                    <StatusTag status={lead.status} />
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); onViewDetail(lead); }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all"
                        title="Quick View Details"
                      >
                        <span className="material-symbols-outlined text-xl">visibility</span>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onLeadClick(lead); }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all"
                        title="Open Full Details"
                      >
                        <span className="material-symbols-outlined text-xl">open_in_new</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const initials = localStorage.getItem('crm_initials') || 'MO';
  const name = localStorage.getItem('crm_name') || 'Agent';
  const USER = { name, role: 'Account Manager', initials, id: initials };

  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [leadsData, statsData] = await Promise.all([
          api.getMyLeads(USER.id),
          api.getEmployeeStats(USER.id)
        ]);
        setLeads(leadsData);
        setStats(statsData);
      } catch (err) {
        setError(err.message || 'Failed to fetch employee workspace.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <Sidebar user={USER} />
      <main className="flex-1 ml-64 min-h-screen">
        <TopNavbar searchPlaceholder="Search my leads..." role="employee" />

        <div className="p-10 max-w-[1400px] mx-auto">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-slate-400 text-sm font-medium">Loading your workspace...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center text-red-500">Error: {error}</div>
          ) : (
            <>
              {/* Welcome Header */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-blue-950 tracking-tight">
                  Welcome, <span className="text-blue-600">{USER.name}</span>
                </h2>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                  label="New Entries"
                  value={stats?.newEntries.total || 0}
                  subValue={`+${stats?.newEntries.today}`}
                  subLabel="today"
                />
                <StatCard
                  label="In Progress"
                  value={stats?.inProgress.total || 0}
                  subValue={`${stats?.inProgress.contactRate}%`}
                  subLabel="contact rate"
                  subColor="text-slate-400"
                />
                <StatCard
                  label="Qualified"
                  value={String(stats?.qualified.total).padStart(2, '0') || '00'}
                  subValue="Target:"
                  subLabel={stats?.qualified.target}
                  subColor="text-slate-400"
                />
              </div>

              {/* Leads List — only new entry leads (New Lead / CREATED) shown here */}
              <EmployeeLeadsList
                leads={leads.filter((l) => ['CREATED', 'New Lead'].includes(l.status))}
                onLeadClick={(lead) => navigate(`/leads/${lead.id}`)}
                onViewDetail={(lead) => setSelectedLead(lead)}
              />
            </>
          )}
        </div>
      </main>

      {/* Side Panel */}
      <LeadDetailsDrawer
        lead={selectedLead}
        isOpen={!!selectedLead}
        onClose={() => setSelectedLead(null)}
      />
    </div>
  );
}
