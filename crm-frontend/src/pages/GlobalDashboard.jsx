import { useState } from 'react';
import Sidebar from '../components/layout/Sidebar';
import TopNavbar from '../components/layout/TopNavbar';
import AddLeadModal from '../components/leads/AddLeadModal';

const USER = { name: 'Alex River', role: 'Admin', initials: 'AR' };

const STATS = [
  { icon: 'trending_up',         iconBg: 'bg-blue-50',   iconColor: 'text-blue-600',  badge: '+12%', badgeBg: 'bg-green-50',  badgeColor: 'text-green-500',  label: 'Total Leads',    value: '2,482' },
  { icon: 'local_fire_department', iconBg: 'bg-orange-50', iconColor: 'text-orange-500', badge: 'Hot',  badgeBg: 'bg-orange-50', badgeColor: 'text-orange-500', label: 'Hot Leads',      value: '148' },
  { icon: 'auto_awesome',        iconBg: 'bg-blue-50',   iconColor: 'text-blue-500',  badge: 'Active', badgeBg: 'bg-blue-50', badgeColor: 'text-blue-500',  label: 'New Inquiries',  value: '32' },
  { icon: 'ac_unit',             iconBg: 'bg-slate-50',  iconColor: 'text-slate-500', badge: 'Cold', badgeBg: 'bg-slate-50',  badgeColor: 'text-slate-400', label: 'Cold Storage',   value: '2,302' },
];

const CHART_BARS = [30, 45, 60, 55, 80, 100, 75, 60, 50, 35, 25];
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov'];

const ACTIVITY = [
  { dot: 'bg-blue-50',   icon: 'person',       iconColor: 'text-blue-600',   text: <><span className="font-bold">Sarah Chen</span> assigned a new lead</>,    time: '2 minutes ago', detail: 'Project Orion - TechCorp' },
  { dot: 'bg-green-50',  icon: 'check_circle',  iconColor: 'text-green-600',   text: <><span className="font-bold">Lead Status</span> updated to <span className="text-green-600 font-bold">Closed</span></>, time: '45 minutes ago' },
  { dot: 'bg-orange-50', icon: 'event',         iconColor: 'text-orange-500',  text: <><span className="font-bold">Meeting scheduled</span> with Global Logistics</>, time: '2 hours ago' },
  { dot: 'bg-slate-100', icon: 'mail',          iconColor: 'text-slate-500',   text: <><span className="font-bold">Automated Email</span> sent to 24 prospects</>, time: '5 hours ago' },
];

const STATUS_BARS = [
  { color: 'bg-blue-500',  label: 'Qualification', pct: 42 },
  { color: 'bg-orange-500', label: 'Negotiation',  pct: 28 },
  { color: 'bg-green-500', label: 'Closed Won',    pct: 15 },
];

const TOP_LEADS = [
  { initials: 'TC', bg: 'bg-blue-100',  textColor: 'text-blue-600',  company: 'TechCorp Solutions', rep: 'Marcus Wright', badge: 'Hot Lead',     badgeBg: 'bg-orange-100 text-orange-700', value: '$42,500' },
  { initials: 'NS', bg: 'bg-slate-100', textColor: 'text-slate-600', company: 'Nexus Systems',      rep: 'Emma Julian',   badge: 'Qualification', badgeBg: 'bg-blue-100 text-blue-700',    value: '$18,200' },
  { initials: 'EL', bg: 'bg-green-100', textColor: 'text-green-600', company: 'EcoLogix Inc.',      rep: 'David Smith',   badge: 'Proposal',      badgeBg: 'bg-green-100 text-green-700',  value: '$95,000' },
];

const BLUE_SHADES = ['bg-blue-100','bg-blue-200','bg-blue-300','bg-blue-400','bg-blue-500','bg-primary-container','bg-blue-500','bg-blue-400','bg-blue-300','bg-blue-200','bg-blue-100'];

export default function GlobalDashboard() {
  const [showAddLead, setShowAddLead] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar user={USER} />
      <main className="flex-1 ml-64 min-h-screen">
        <TopNavbar onAddLead={() => setShowAddLead(true)} searchPlaceholder="Search leads, team members..." />

        <div className="p-container-padding max-w-[1440px] mx-auto">
          <div className="mb-10">
            <h2 className="font-h2 text-[32px] text-on-surface mb-2">Global Overview</h2>
            <p className="text-slate-500">Welcome back, Alex. Here's what's happening today.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-gutter">
            {STATS.map((s) => (
              <div key={s.label} className="bento-card p-6 flex flex-col justify-between group">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-2 ${s.iconBg} ${s.iconColor} rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors`}>
                    <span className="material-symbols-outlined">{s.icon}</span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${s.badgeBg} ${s.badgeColor}`}>{s.badge}</span>
                </div>
                <div>
                  <p className="text-sm font-label-caps text-slate-400 mb-1">{s.label}</p>
                  <p className="text-3xl font-bold text-on-surface">{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chart + Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            <div className="lg:col-span-2 bento-card p-8">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-lg font-bold text-on-surface">Lead Generation Trends</h3>
                  <p className="text-sm text-slate-400">Monthly performance analytics</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-1.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-lg">Weekly</button>
                  <button className="px-4 py-1.5 text-slate-400 text-xs font-bold rounded-lg hover:bg-slate-50">Monthly</button>
                </div>
              </div>
              <div className="relative h-64 w-full flex items-end justify-between px-2">
                {CHART_BARS.map((h, i) => (
                  <div key={i} className={`w-[8%] ${BLUE_SHADES[i]} rounded-t-lg`} style={{ height: `${h}%` }} />
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
              </div>
              <div className="flex justify-between mt-4 px-2">
                {MONTHS.map((m) => (
                  <span key={m} className="text-[10px] font-bold text-slate-400 uppercase">{m}</span>
                ))}
              </div>
            </div>

            <div className="bento-card p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-lg font-bold text-on-surface">Recent Activity</h3>
                <button className="text-blue-600 text-xs font-bold hover:underline">View All</button>
              </div>
              <div className="relative space-y-8">
                <div className="absolute left-[15px] top-2 bottom-2 w-[2px] bg-surface-container opacity-50" />
                {ACTIVITY.map((a, i) => (
                  <div key={i} className="relative flex items-start gap-4">
                    <div className={`relative z-10 w-8 h-8 rounded-full ${a.dot} border-4 border-white flex items-center justify-center`}>
                      <span className={`material-symbols-outlined text-[14px] ${a.iconColor}`}>{a.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-on-surface">{a.text}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{a.time}</p>
                      {a.detail && (
                        <div className="mt-2 bg-slate-50/50 p-3 rounded-lg border border-slate-100/50">
                          <p className="text-xs font-bold text-blue-700">{a.detail}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Status + Top Leads */}
          <div className="mt-gutter grid grid-cols-1 lg:grid-cols-4 gap-gutter">
            <div className="bento-card p-8 flex flex-col justify-between">
              <h3 className="text-lg font-bold text-on-surface mb-6">Status Breakdown</h3>
              <div className="space-y-4">
                {STATUS_BARS.map((s) => (
                  <div key={s.label}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${s.color}`} />
                        <span className="text-sm font-medium text-slate-600">{s.label}</span>
                      </div>
                      <span className="text-sm font-bold">{s.pct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
                      <div className={`h-full ${s.color}`} style={{ width: `${s.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 pt-6 border-t border-slate-50">
                <p className="text-xs text-slate-400 leading-relaxed italic">Lead conversion rate is up 4% from last quarter.</p>
              </div>
            </div>

            <div className="lg:col-span-3 bento-card p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-on-surface">Top Performing Leads</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-50">
                      {['Company','Representative','Status','Value'].map((h, i) => (
                        <th key={h} className={`pb-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider ${i === 3 ? 'text-right' : ''}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {TOP_LEADS.map((l) => (
                      <tr key={l.company} className="hover:bg-slate-50/50 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg ${l.bg} flex items-center justify-center ${l.textColor} font-bold text-xs`}>{l.initials}</div>
                            <p className="text-sm font-bold text-on-surface">{l.company}</p>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-slate-600">{l.rep}</td>
                        <td className="py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${l.badgeBg}`}>{l.badge}</span>
                        </td>
                        <td className="py-4 text-sm font-bold text-right">{l.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {showAddLead && <AddLeadModal onClose={() => setShowAddLead(false)} onSubmit={() => setShowAddLead(false)} />}
    </div>
  );
}
