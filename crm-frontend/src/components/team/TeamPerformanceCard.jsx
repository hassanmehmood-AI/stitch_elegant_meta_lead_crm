export default function TeamPerformanceCard({ member }) {
  const { name, role, badge, badgeBg, badgeColor, leads, progress, progressBg, conversionRate } = member;

  return (
    <div className="glass-card p-6 rounded-2xl hover:shadow-[0_20px_40px_-15px_rgba(27,46,253,0.08)] transition-all">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg">
            {name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <h3 className="font-bold text-slate-800">{name}</h3>
            <p className="text-xs text-slate-500">{role}</p>
          </div>
        </div>
        <span className={`${badgeBg} ${badgeColor} px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider`}>
          {badge}
        </span>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-500">Assigned Leads</span>
          <span className="font-bold text-on-surface">{leads}</span>
        </div>
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs font-bold text-slate-600">
            <span>Monthly Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full ${progressBg} rounded-full`} style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="pt-4 border-t border-blue-50 flex justify-between items-center">
          <div>
            <p className="text-[10px] text-slate-400 font-label-caps uppercase">Conversion Rate</p>
            <p className="text-lg font-bold text-blue-600">{conversionRate}%</p>
          </div>
          <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
            <span className="material-symbols-outlined">trending_flat</span>
          </button>
        </div>
      </div>
    </div>
  );
}
