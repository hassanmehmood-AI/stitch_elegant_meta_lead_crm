import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import TopNavbar from '../components/layout/TopNavbar';
import AddLeadModal from '../components/leads/AddLeadModal';
import DashboardMeetingCards from '../components/meetings/DashboardMeetingCards';
import { useRole } from '../hooks/useRole';
import { api } from '../services/api';



// USER will be generated dynamically inside the component

const CARD_NAV = {
  'Total Revenue':   '/leads',
  'Conversion Rate': '/leads',
  'Total Leads':     '/leads',
  'New Leads':       '/leads',
};

export default function CeoDashboard() {
  const navigate = useNavigate();
  const initials = localStorage.getItem('crm_initials') || 'MS';
  const name     = localStorage.getItem('crm_name')     || 'Marcus Sterling';
  const USER = { name, role: 'Chief Executive Officer', initials };
  const role = useRole();
  const [showAddLead, setShowAddLead] = useState(false);
  const [stats,    setStats]    = useState(null);
  const [error,    setError]    = useState(null);
  const [meetings, setMeetings] = useState([]);

  const loadMeetings = () => api.getMeetings().then(setMeetings).catch(() => {});

  useEffect(() => {
    api.getCeoStats()
      .then(setStats)
      .catch(err => setError(err.message || 'Failed to fetch insights.'));
    loadMeetings();
  }, []);

  const handleJoin = async (id) => {
    await api.updateMeetingStatus(id, 'done', 'MS');
    loadMeetings();
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar user={USER} />
      <main className="flex-1 ml-64 min-h-screen overflow-y-auto bg-slate-50/30">
        <TopNavbar searchPlaceholder="Global analytic search..." role={role} />

        <div className="p-8 max-w-[1440px] mx-auto space-y-8">
          <div>
            <h2 className="font-h2 text-[40px] font-bold text-on-surface leading-tight">
              Welcome, <span className="text-blue-600">{USER.name}</span>
            </h2>
            <p className="text-slate-500 mt-1">Real-time performance metrics and cross-departmental analytics for Q3.</p>
          </div>

          {error ? (
            <div className="py-20 text-center text-red-500">Error loading CEO insights: {error}</div>
          ) : stats ? (
            <>
              {/* Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {stats.metrics.map((m) => (
                  <div
                    key={m.label}
                    onClick={() => navigate(CARD_NAV[m.label] || '/leads')}
                    className="bg-white p-6 rounded-2xl border border-blue-100/10 shadow-[0_4px_30px_-10px_rgba(27,46,253,0.05)] cursor-pointer hover:shadow-[0_20px_40px_-15px_rgba(27,46,253,0.12)] hover:-translate-y-1 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className={`material-symbols-outlined p-2 ${m.iconBg} ${m.iconColor} rounded-lg`}>{m.icon}</span>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${m.badgeBg}`}>{m.badge}</span>
                    </div>
                    <p className="text-slate-500 text-sm font-medium mb-1">{m.label}</p>
                    <h3 className="text-2xl font-bold text-on-surface tracking-tight">{m.value}</h3>
                  </div>
                ))}
              </div>

              {/* Meetings */}
              <div>
                <h3 className="text-xl font-bold text-on-surface mb-4">Team Meetings</h3>
                <DashboardMeetingCards meetings={meetings} onJoin={handleJoin} myId="MS" />
              </div>
            </>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-slate-400 text-sm font-medium">Loading CEO insights...</p>
            </div>
          )}
        </div>
      </main>

      {showAddLead && <AddLeadModal onClose={() => setShowAddLead(false)} onSubmit={() => setShowAddLead(false)} />}
    </div>
  );
}
