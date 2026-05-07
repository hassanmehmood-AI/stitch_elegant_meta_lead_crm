import { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import TopNavbar from '../components/layout/TopNavbar';
import TeamPerformanceCard from '../components/team/TeamPerformanceCard';
import { api } from '../services/api';



// USER will be generated dynamically inside the component

const TEAMS = [
  {
    id: 'web-nova',
    name: 'Web Nova Team',
    description: 'Digital lead acquisition and web channel management',
    icon: 'language',
    gradientFrom: 'from-blue-600',
    gradientTo: 'to-blue-400',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    borderAccent: 'border-blue-200',
    stats: [
      { label: 'Total Leads',      value: '642',   trendIcon: 'trending_up', trendColor: 'text-green-500', trendLabel: '+14%' },
      { label: 'Avg. Conversion',  value: '26.8%', trendIcon: 'trending_up', trendColor: 'text-green-500', trendLabel: '+3%'  },
      { label: 'Active Targets',   value: '22',    trendIcon: 'add',         trendColor: 'text-green-500', trendLabel: '+4'   },
      { label: 'Meetings Held',    value: '84',    trendIcon: null,          trendColor: 'text-slate-400', trendLabel: 'this week' },
    ],
    members: [
      { name: 'David Miller',  role: 'Senior Account Manager', badge: 'Top Performer', badgeBg: 'bg-green-100/50', badgeColor: 'text-green-700',  leads: 142, progress: 88, progressBg: 'bg-primary-container', conversionRate: '32.4' },
      { name: 'Sarah Chen',    role: 'Lead Specialist',        badge: 'Steady Growth', badgeBg: 'bg-blue-100/50',  badgeColor: 'text-blue-700',   leads: 98,  progress: 65, progressBg: 'bg-blue-400',          conversionRate: '21.8' },
      { name: 'James Wilson',  role: 'Sales Representative',   badge: 'At Risk',       badgeBg: 'bg-red-50',       badgeColor: 'text-red-700',    leads: 115, progress: 42, progressBg: 'bg-error',              conversionRate: '14.2' },
    ],
  },
  {
    id: 'penta-bd',
    name: 'Penta BD Team',
    description: 'Business development and strategic partnership acquisition',
    icon: 'business_center',
    gradientFrom: 'from-violet-600',
    gradientTo: 'to-violet-400',
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-600',
    borderAccent: 'border-violet-200',
    stats: [
      { label: 'Total Leads',      value: '394',   trendIcon: 'trending_up', trendColor: 'text-green-500', trendLabel: '+9%'  },
      { label: 'Avg. Conversion',  value: '22.4%', trendIcon: 'remove',      trendColor: 'text-blue-500',  trendLabel: '0%'   },
      { label: 'Active Targets',   value: '20',    trendIcon: 'add',         trendColor: 'text-green-500', trendLabel: '+2'   },
      { label: 'Meetings Held',    value: '72',    trendIcon: null,          trendColor: 'text-slate-400', trendLabel: 'this week' },
    ],
    members: [
      { name: 'Zeeshan', role: 'Regional Lead Manager', badge: 'High Velocity', badgeBg: 'bg-green-100/50',  badgeColor: 'text-green-700',  leads: 178, progress: 94, progressBg: 'bg-primary-container', conversionRate: '29.1' },
      { name: 'Ali',     role: 'Sales Consultant',      badge: 'Consistent',    badgeBg: 'bg-blue-100/50',   badgeColor: 'text-blue-700',   leads: 84,  progress: 78, progressBg: 'bg-blue-400',          conversionRate: '25.5' },
      { name: 'Amar',    role: 'New Associate',         badge: 'Onboarding',    badgeBg: 'bg-slate-100',     badgeColor: 'text-slate-600',  leads: 32,  progress: 25, progressBg: 'bg-slate-300',          conversionRate: '18.0' },
    ],
  },
];

export default function TeamPerformancePage() {
  const initials = localStorage.getItem('crm_initials') || 'MS';
  const name     = localStorage.getItem('crm_name')     || 'Marcus Sterling';
  const role     = localStorage.getItem('crm_role')     || 'ceo';
  const displayRole = role === 'ceo' ? 'Chief Executive Officer' : role === 'manager' ? 'Sales Manager' : 'Account Manager';
  const USER = { name, role: displayRole, initials };

  const [selectedTeam, setSelectedTeam] = useState(null);
  const [ceoStats, setCeoStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getCeoStats();
      setCeoStats(data);
    } catch (err) {
      setError(err.message || 'Failed to load team performance data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const dynamicTeams = ceoStats ? [
    {
      ...TEAMS[0],
      members: ceoStats.team.map(m => ({
        ...m,
        badge: m.status,
        badgeBg: m.statusBg.split(' ')[0],
        badgeColor: m.statusBg.split(' ')[1],
        conversionRate: m.conversion.replace('%', ''),
        progressBg: m.progress > 80 ? 'bg-primary-container' : m.progress > 50 ? 'bg-blue-400' : 'bg-error'
      }))
    },
    TEAMS[1] // Keep Penta BD as is or update if needed
  ] : TEAMS;

  const team = selectedTeam ? dynamicTeams.find((t) => t.id === selectedTeam) : null;

  return (
    <div className="flex min-h-screen">
      <Sidebar user={USER} />
      <main className="flex-1 ml-64 min-h-screen">
        <TopNavbar searchPlaceholder="Search teams..." role="ceo" />

        <section className="p-8 max-w-[1440px] mx-auto space-y-8">

          {/* Team cards view */}
          {!team && (
            <>
              <div>
                <h2 className="font-bold text-[40px] text-on-surface leading-tight">Teams</h2>
                <p className="text-slate-500 mt-2">Select a team to view performance metrics and members.</p>
              </div>

              {error ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3 text-center max-w-3xl">
                  <span className="material-symbols-outlined text-4xl text-red-400">error_outline</span>
                  <p className="text-red-500 font-semibold">{error}</p>
                  <button onClick={fetchStats} className="px-5 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors">Try Again</button>
                </div>
              ) : loading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3 text-center max-w-3xl">
                  <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                  <p className="text-slate-400 text-sm font-medium">Loading team metrics...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
                  {dynamicTeams.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTeam(t.id)}
                      className={`text-left bg-white border ${t.borderAccent} rounded-2xl p-8 shadow-[0_4px_30px_-10px_rgba(27,46,253,0.06)] hover:shadow-[0_20px_40px_-15px_rgba(27,46,253,0.12)] hover:-translate-y-1 transition-all group`}
                    >
                      <div className={`w-14 h-14 rounded-2xl ${t.iconBg} flex items-center justify-center mb-6`}>
                        <span className={`material-symbols-outlined text-2xl ${t.iconColor}`}>{t.icon}</span>
                      </div>
                      <h3 className="text-xl font-bold text-on-surface mb-2">{t.name}</h3>
                      <p className="text-sm text-slate-500 mb-6 leading-relaxed">{t.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex -space-x-2">
                          {t.members.map((m) => (
                            <div
                              key={m.name}
                              className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-white flex items-center justify-center text-blue-700 font-bold text-xs"
                              title={m.name}
                            >
                              {m.name.split(' ').map((n) => n[0]).join('')}
                            </div>
                          ))}
                          <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-slate-500 text-xs font-bold">
                            {t.members.length}
                          </div>
                        </div>
                        <span className={`flex items-center gap-1 text-sm font-semibold ${t.iconColor} group-hover:gap-2 transition-all`}>
                          View Team
                          <span className="material-symbols-outlined text-base">arrow_forward</span>
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Team detail view */}
          {team && (
            <>
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedTeam(null)}
                    className="p-2 rounded-xl bg-white border border-blue-100/30 text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                  >
                    <span className="material-symbols-outlined">arrow_back</span>
                  </button>
                  <div>
                    <h2 className="font-bold text-[36px] text-on-surface leading-tight">{team.name}</h2>
                    <p className="text-slate-500 mt-1">{team.description}</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {team.stats.map((s) => (
                  <div key={s.label} className="bg-white p-6 rounded-2xl shadow-[0_4px_30px_-10px_rgba(27,46,253,0.05)] border border-blue-100/10">
                    <p className="text-slate-400 font-label-caps uppercase text-xs mb-1">{s.label}</p>
                    <div className="flex items-end gap-2">
                      <span className="text-[30px] font-bold text-on-surface leading-tight">{s.value}</span>
                      <span className={`text-sm font-bold flex items-center mb-2 ${s.trendColor}`}>
                        {s.trendIcon && <span className="material-symbols-outlined text-sm">{s.trendIcon}</span>}
                        {s.trendLabel}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Members */}
              <div>
                <h3 className="font-bold text-lg text-on-surface mb-4">Team Members</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {team.members.map((m) => (
                    <TeamPerformanceCard key={m.name} member={m} />
                  ))}
                </div>
              </div>
            </>
          )}

        </section>
      </main>
    </div>
  );
}
