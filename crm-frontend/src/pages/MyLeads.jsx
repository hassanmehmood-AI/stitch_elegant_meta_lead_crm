import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import TopNavbar from '../components/layout/TopNavbar';
import StatusTag from '../components/shared/StatusTag';
import AddLeadModal from '../components/leads/AddLeadModal';
import MeetingScheduler from '../components/meetings/MeetingScheduler';
import { api } from '../services/api';

const FILTER_CONFIG = {
  inprogress: {
    label:    'In Progress',
    statuses: ['CREATED', 'Meeting Scheduled', 'Highly Interested', 'In Discussion', 'Strong Follow-up', 'Busy call back'],
  },
  qualified: {
    label:    'Qualified',
    statuses: ['Qualified'],
  },
  converted: {
    label:    'Converted',
    statuses: ['Converted', 'Meeting Done'],
  },
};

const DATE_FILTERS = [
  { key: 'all',   label: 'All Leads',  days: null },
  { key: 'week',  label: 'Last Week',  days: 7    },
  { key: 'month', label: 'Last Month', days: 30   },
];

function parseLeadDate(lead) {
  const raw = lead.assigned_date || lead.createdDate || lead.created_date;
  if (!raw) return null;
  const d = new Date(raw);
  return isNaN(d.getTime()) ? null : d;
}

function applyDateFilter(leads, key) {
  const cfg = DATE_FILTERS.find((f) => f.key === key);
  if (!cfg || cfg.days === null) return leads;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - cfg.days);
  return leads.filter((l) => {
    const d = parseLeadDate(l);
    return d && d >= cutoff;
  });
}

export default function MyLeads() {
  const initials = localStorage.getItem('crm_initials') || 'MO';
  const name     = localStorage.getItem('crm_name')     || 'Agent';
  const USER = { name, role: 'Account Manager', initials, id: initials };
  const CURRENT_USER_ID = initials;

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const filterKey = searchParams.get('filter') || '';
  const activeFilter = FILTER_CONFIG[filterKey] || null;

  const [showAddLead, setShowAddLead] = useState(false);
  const [schedulerLead, setSchedulerLead] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateFilter, setDateFilter] = useState('all');

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getMyLeads(CURRENT_USER_ID);
      setLeads(data);
    } catch (err) {
      setError(err.message || 'Failed to load your leads.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const statusFiltered = activeFilter
    ? leads.filter((l) => activeFilter.statuses.includes(l.status))
    : leads;
  const visibleLeads = applyDateFilter(statusFiltered, dateFilter);

  return (
    <div className="flex min-h-screen">
      <Sidebar user={USER} />
      <main className="flex-1 ml-64 min-h-screen">
        <TopNavbar searchPlaceholder="Search leads by name, phone or status..." role="employee" />

        <div className="max-w-[1440px] mx-auto p-container-padding">
          <div className="flex items-end justify-between mb-6">
            <div>
              <div className="flex items-center gap-3">
                <h2 className="font-h2 text-[32px] text-on-surface">My Leads</h2>
                {activeFilter && (
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full border border-blue-100">
                    {activeFilter.label}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-slate-500">
                  {activeFilter
                    ? `Showing ${activeFilter.label} leads only.`
                    : 'Incoming leads from Facebook, Meta & Instagram campaigns.'}
                </p>
                {activeFilter && (
                  <button
                    onClick={() => navigate('/leads/my')}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                    Clear filter
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Date filter chips */}
          <div className="flex items-center gap-2 mb-6">
            <span className="material-symbols-outlined text-slate-400 text-base">calendar_month</span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Period:</span>
            {DATE_FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setDateFilter(f.key)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
                  dateFilter === f.key
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-600'
                }`}
              >
                {f.label}
              </button>
            ))}
            {dateFilter !== 'all' && (
              <span className="ml-2 px-2.5 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full border border-blue-100">
                {visibleLeads.length} result{visibleLeads.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {error ? (
            <div className="py-16 flex flex-col items-center gap-3 text-center">
              <span className="material-symbols-outlined text-4xl text-red-400">error_outline</span>
              <p className="text-red-500 font-semibold">{error}</p>
              <button
                onClick={fetchLeads}
                className="px-5 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-slate-400 text-sm font-medium">Loading your leads...</p>
            </div>
          ) : visibleLeads.length === 0 ? (
            <div className="py-20 text-center text-slate-400">
              <span className="material-symbols-outlined text-4xl mb-3 block">inbox</span>
              {activeFilter ? `No ${activeFilter.label} leads found.` : 'No leads assigned to you yet.'}
            </div>
          ) : (
            <div className="bg-white rounded-[24px] border border-primary-container/10 shadow-[0_40px_60px_-15px_rgba(27,43,253,0.03)] overflow-hidden">
              {/* Header */}
              <div className="grid grid-cols-[1fr_160px_60px_180px_110px] px-8 py-5 border-b border-blue-50 bg-slate-50/30">
                {['Name / Property', 'Source', 'Agent', 'Status', 'Actions'].map((h, i) => (
                  <div key={h} className={`text-xs font-bold text-slate-400 uppercase tracking-widest ${i === 4 ? 'text-right' : ''}`}>{h}</div>
                ))}
              </div>

              {/* Rows */}
              {visibleLeads.map((lead) => (
                <div
                  key={lead.id}
                  onClick={() => navigate(`/leads/${lead.id}`)}
                  className="grid grid-cols-[1fr_160px_60px_180px_110px] px-8 py-5 border-b border-blue-50/50 hover:bg-blue-50/10 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center text-blue-700 font-bold text-sm flex-shrink-0">
                      {lead.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 group-hover:text-blue-600 transition-colors">{lead.name}</p>
                      <p className="text-xs text-slate-400 truncate max-w-[200px]">{lead.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      lead.source === 'Facebook'  ? 'bg-blue-50 text-blue-700' :
                      lead.source === 'Meta'      ? 'bg-indigo-50 text-indigo-700' :
                      lead.source === 'Instagram' ? 'bg-pink-50 text-pink-700' :
                      'bg-slate-50 text-slate-600'
                    }`}>
                      {lead.source}
                    </span>
                  </div>
                  <div className="flex items-center">
                    {lead.assignedAgent ? (
                      <div className="w-7 h-7 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs" title={`Assigned to agent ${lead.assignedAgent}`}>
                        {lead.assignedAgent}
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center" title="No agent assigned">
                        <span className="material-symbols-outlined text-slate-400 text-sm">person_off</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center">
                    <StatusTag status={lead.status} />
                  </div>
                  <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => setSchedulerLead(lead)}
                      className="p-1.5 text-slate-300 group-hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                      title="Schedule Meeting"
                    >
                      <span className="material-symbols-outlined text-sm">calendar_add_on</span>
                    </button>
                    <button
                      onClick={() => navigate(`/leads/${lead.id}`)}
                      className="p-1.5 text-slate-300 group-hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all"
                      title="View Details"
                    >
                      <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </button>
                  </div>
                </div>
              ))}

              {/* Footer count */}
              <div className="px-8 py-4 bg-slate-50/50">
                <p className="text-xs text-slate-500 font-medium">
                  Showing <span className="text-slate-800 font-bold">{visibleLeads.length}</span>
                  {activeFilter ? ` ${activeFilter.label}` : ''}
                  {dateFilter !== 'all' ? ` · ${DATE_FILTERS.find(f => f.key === dateFilter)?.label}` : ''} leads
                  {(activeFilter || dateFilter !== 'all') && <span className="text-slate-400"> (out of {leads.length} total)</span>}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {showAddLead && (
        <AddLeadModal
          onClose={() => setShowAddLead(false)}
          onSubmit={async (form) => {
            const newLead = await api.addLead({
              initials: form.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
              name: form.name,
              company: form.company || '—',
              source: form.source,
              status: form.status,
              email: form.email || '',
              phone: form.phone || '',
              value: form.value || '',
              createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
              assignedTo: CURRENT_USER_ID,
              assignedAgent: null,
            });
            setLeads((prev) => [newLead, ...prev]);
            setShowAddLead(false);
          }}
        />
      )}
      {schedulerLead && (
        <MeetingScheduler
          leadName={schedulerLead.name}
          scheduledBy={CURRENT_USER_ID}
          onClose={() => setSchedulerLead(null)}
          onConfirm={() => setSchedulerLead(null)}
        />
      )}
    </div>
  );
}
