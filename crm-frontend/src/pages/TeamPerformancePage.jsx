import { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import TopNavbar from '../components/layout/TopNavbar';
import TeamPerformanceCard from '../components/team/TeamPerformanceCard';
import { api } from '../services/api';



// USER will be generated dynamically inside the component

export default function TeamPerformancePage() {
  const initials = localStorage.getItem('crm_initials') || 'MS';
  const name     = localStorage.getItem('crm_name')     || 'Marcus Sterling';
  const role     = localStorage.getItem('crm_role')     || 'ceo';
  const displayRole = role === 'ceo' ? 'Chief Executive Officer' : role === 'manager' ? 'Sales Manager' : 'Account Manager';
  const USER = { name, role: displayRole, initials };

  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const stats = await api.getCeoStats();
      // Map the team data to the format expected by TeamPerformanceCard
      const mappedAgents = stats.team.map(m => ({
        ...m,
        badge: m.status,
        badgeBg: m.statusBg?.split(' ')[0] || 'bg-blue-50',
        badgeColor: m.statusBg?.split(' ')[1] || 'text-blue-700',
        conversionRate: m.conversion?.replace('%', '') || '0.0',
        progressBg: m.progress > 80 ? 'bg-primary-container' : m.progress > 50 ? 'bg-blue-400' : 'bg-error'
      }));
      setAgents(mappedAgents);
    } catch (err) {
      setError(err.message || 'Failed to load team performance data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar user={USER} />
      <main className="flex-1 ml-64 min-h-screen">
        <TopNavbar searchPlaceholder="Search team members..." role="ceo" />

        <section className="p-8 max-w-[1440px] mx-auto space-y-10">
          <div>
            <h2 className="font-bold text-[40px] text-on-surface leading-tight">Team Members</h2>
            <p className="text-slate-500 mt-2">Monitor real-time performance metrics and progress across your entire team.</p>
          </div>

          {error ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-center">
              <span className="material-symbols-outlined text-4xl text-red-400">error_outline</span>
              <p className="text-red-500 font-semibold">{error}</p>
              <button onClick={fetchData} className="px-5 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors">Try Again</button>
            </div>
          ) : loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
              <p className="text-slate-400 text-sm font-medium">Loading team metrics...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {agents.map((m) => (
                <TeamPerformanceCard key={m.name} member={m} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
