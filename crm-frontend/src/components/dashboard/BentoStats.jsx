export default function BentoStats({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-gutter">
      {stats.map((s, i) => (
        <div key={i} className="bento-card p-6 flex flex-col justify-between group">
          <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg transition-colors ${s.iconBg} group-hover:${s.iconBgHover}`}>
              <span className={`material-symbols-outlined ${s.iconColor}`}>{s.icon}</span>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${s.badgeBg} ${s.badgeColor}`}>
              {s.badge}
            </span>
          </div>
          <div>
            <p className="text-sm font-label-caps text-slate-400 mb-1">{s.label}</p>
            <p className="text-3xl font-bold text-on-surface">{s.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
