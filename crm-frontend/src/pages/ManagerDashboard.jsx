import { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import TopNavbar from '../components/layout/TopNavbar';
import DashboardMeetingCards from '../components/meetings/DashboardMeetingCards';
import { api } from '../services/api';



// USER will be generated dynamically inside the component

export default function ManagerDashboard() {
  const initials = localStorage.getItem('crm_initials') || 'AS';
  const name = localStorage.getItem('crm_name') || 'Alex Sterling';
  const USER = { name, role: 'Sales Manager', initials };
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const loadMeetings = () => api.getMeetings().then(setMeetings).catch(() => { });

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
  }, []);

  const handleJoin = async (id) => {
    await api.updateMeetingStatus(id, 'done', 'AS');
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

          <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="font-bold text-[40px] text-on-surface leading-tight">
                  Welcome, <span className="text-blue-600">{USER.name}</span>
                </h2>
              </div>
              <p className="text-slate-500">Overview of incoming leads from Meta campaigns.</p>
            </div>
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

          {/* Meetings */}
          <div>
            <h3 className="text-xl font-bold text-on-surface mb-4">Team Meetings</h3>
            <DashboardMeetingCards meetings={meetings} onJoin={handleJoin} myId="AS" />
          </div>

        </div>
      </main>
    </div>
  );
}
