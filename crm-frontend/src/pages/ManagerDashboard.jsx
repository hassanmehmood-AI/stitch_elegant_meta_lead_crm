import { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import TopNavbar from '../components/layout/TopNavbar';
import DashboardMeetingCards from '../components/meetings/DashboardMeetingCards';
import StatusTag from '../components/shared/StatusTag';
import { api } from '../services/api';

export default function ManagerDashboard() {
  const initials = localStorage.getItem('crm_initials') || 'AS';
  const name = localStorage.getItem('crm_name') || 'Alex Sterling';
  const USER = { name, role: 'Sales Manager', initials };

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [unassignedLeads, setUnassignedLeads] = useState([]);

  const loadMeetings = () => api.getMeetings().then(setMeetings).catch(() => {});

  const loadUnassigned = () =>
    api.getUnassignedLeads().then(setUnassignedLeads).catch(() => {});

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      api.getMetaLeads(searchQuery)
        .then((data) => { setLeads(data); setLoading(false); })
        .catch((err) => { setError(err.message || 'Failed to fetch meta leads.'); setLoading(false); });
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    loadMeetings();
    loadUnassigned();
  }, []);

  const handleJoin = async (id) => {
    await api.updateMeetingStatus(id, 'done', initials);
    loadMeetings();
  };

  const total = leads.length;
  const unassigned = leads.filter((l) => !l.assignedAgent).length;
  const assigned = leads.filter((l) => l.assignedAgent).length;
  const closedWon = leads.filter((l) => l.status === 'Closed Won').length;

  const STATS = [
    { label: 'Meta Leads', value: total, icon: 'campaign', iconBg: 'bg-blue-50', iconColor: 'text-blue-600', valueColor: 'text-blue-700', border: 'border-blue-100/50' },
    { label: 'Unassigned', value: unassigned, icon: 'person_search', iconBg: 'bg-amber-50', iconColor: 'text-amber-600', valueColor: 'text-amber-700', border: 'border-amber-100/50' },
    { label: 'Assigned', value: assigned, icon: 'person_check', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600', valueColor: 'text-emerald-700', border: 'border-emerald-100/50' },
    { label: 'Closed Won', value: closedWon, icon: 'emoji_events', iconBg: 'bg-purple-50', iconColor: 'text-purple-600', valueColor: 'text-purple-700', border: 'border-purple-100/50' },
  ];

  return (
    <div className="flex min-h-screen">
      <Sidebar user={USER} />
      <main className="flex-1 ml-64 min-h-screen overflow-y-auto text-on-background bg-slate-50/30">
        <TopNavbar
          searchPlaceholder="Search meta leads..."
          role="manager"
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
        />

        <div className="p-8 max-w-[1440px] mx-auto">

          <div className="mb-10">
            <h2 className="font-bold text-[40px] text-on-surface leading-tight">
              Welcome, <span className="text-blue-600">{USER.name}</span>
            </h2>
          </div>

          {/* Stats */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-slate-400 text-sm font-medium">Loading meta leads...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center text-red-500">Error: {error}</div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              {STATS.map((s) => (
                <div key={s.label} className={`bg-white rounded-2xl p-6 border ${s.border} shadow-[0_4px_30px_-10px_rgba(27,46,253,0.06)]`}>
                  <div className={`inline-flex p-2.5 rounded-xl ${s.iconBg} mb-4`}>
                    <span className={`material-symbols-outlined text-xl ${s.iconColor}`}>{s.icon}</span>
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                  <p className={`text-4xl font-black ${s.valueColor}`}>{s.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* New Leads table + Scheduled Meetings */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* New Leads — employee-style table, 2/3 width */}
            <div className="lg:col-span-2 bg-white rounded-[24px] border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col">
              <div className="px-8 py-5 border-b border-slate-50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center">
                  <span className="material-symbols-outlined text-amber-600 text-base">fiber_new</span>
                </div>
                <h3 className="text-xl font-bold text-blue-950">New Leads</h3>
                <span className={`ml-auto px-2.5 py-1 text-xs font-bold rounded-full ${
                  unassignedLeads.length > 0 ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-400'
                }`}>
                  {unassignedLeads.length}
                </span>
              </div>

              <div className="overflow-x-auto overflow-y-auto max-h-[420px]">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 z-10">
                    <tr className="bg-slate-50/80">
                      <th className="px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Lead</th>
                      <th className="px-4 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Whatsapp</th>
                      <th className="px-4 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Platform</th>
                      <th className="px-4 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {unassignedLeads.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="py-16 text-center">
                          <span className="material-symbols-outlined text-4xl text-slate-200 block mb-3">inbox</span>
                          <p className="text-sm text-slate-400">No new unassigned leads</p>
                          <p className="text-xs text-slate-300 mt-1">New leads from Meta will appear here</p>
                        </td>
                      </tr>
                    ) : (
                      unassignedLeads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-slate-50/50 transition-all group">
                          {/* Lead */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0 group-hover:scale-105 transition-transform">
                                {lead.initials || (lead.name ? lead.name.slice(0, 2).toUpperCase() : 'NA')}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate max-w-[130px]">
                                  {lead.name}
                                </p>
                                <p className="text-[10px] text-slate-400 mt-0.5 truncate max-w-[130px]">
                                  {lead.company || lead.city || '—'}
                                </p>
                              </div>
                            </div>
                          </td>
                          {/* WhatsApp */}
                          <td className="px-4 py-4">
                            <p className="text-xs font-semibold text-slate-600">{lead.whatsapp_number || '—'}</p>
                          </td>
                          {/* Platform */}
                          <td className="px-4 py-4">
                            <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                              lead.platform === 'Facebook' ? 'bg-blue-50 text-blue-700' : 'bg-pink-50 text-pink-700'
                            }`}>
                              {lead.platform || lead.source || '—'}
                            </span>
                          </td>
                          {/* Status */}
                          <td className="px-4 py-4">
                            <StatusTag status={lead.status} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Scheduled Meetings — compact, 1/3 width */}
            <div className="lg:col-span-1">
              <DashboardMeetingCards meetings={meetings} onJoin={handleJoin} myId={initials} hideDone compact />
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
