import StatusTag from '../shared/StatusTag';

export default function LeadDetails({ lead }) {
  const { name, initials, status, email, phone, source, company, value, assignedTo, lastInteraction, tags = [] } = lead;

  return (
    <div className="space-y-gutter">
      {/* Lead Score Card */}
      <div className="bg-gradient-to-br from-primary-container to-blue-800 rounded-[16px] p-8 text-white shadow-xl shadow-blue-200">
        <h4 className="text-white/70 text-sm font-bold uppercase tracking-widest mb-4">Lead Health Score</h4>
        <div className="flex items-center justify-between">
          <div className="text-5xl font-black">
            88<span className="text-xl font-medium opacity-50">/100</span>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-white/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">trending_up</span>
          </div>
        </div>
        <p className="mt-4 text-sm text-blue-100 font-medium">
          High conversion probability based on engagement frequency and company size.
        </p>
      </div>

      {/* Lead Summary */}
      <div className="bg-white rounded-[16px] p-8 border border-blue-100/10 shadow-[0_40px_60px_-15px_rgba(27,46,253,0.03)]">
        <h3 className="font-bold text-[18px] text-on-surface mb-6">Lead Summary</h3>
        <div className="space-y-6">
          {[
            { label: 'Company',         value: company,          icon: 'corporate_fare' },
            { label: 'Estimated Value', value: `$${value} /yr`,   icon: 'payments' },
            { label: 'Assigned Agent',  value: assignedTo,       icon: 'person' },
            { label: 'Last Interaction', value: lastInteraction,  icon: 'schedule' },
          ].map((item, i, arr) => (
            <div key={item.label} className={`flex justify-between items-start ${i < arr.length - 1 ? 'border-b border-slate-50 pb-4' : ''}`}>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">{item.label}</span>
                <span className="font-bold text-on-surface">{item.value}</span>
              </div>
              <span className="material-symbols-outlined text-slate-300">{item.icon}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="bg-white rounded-[16px] p-8 border border-blue-100/10 shadow-[0_40px_60px_-15px_rgba(27,46,253,0.03)]">
        <h3 className="font-bold text-[18px] text-on-surface mb-4">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag.label} className={`px-3 py-1.5 rounded-lg ${tag.bg} ${tag.text} text-xs font-bold border ${tag.border}`}>
              {tag.label}
            </span>
          ))}
          <button className="px-3 py-1.5 rounded-lg bg-slate-50 text-slate-500 text-xs font-bold border border-dashed border-slate-200 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">add</span>
            Add Tag
          </button>
        </div>
      </div>
    </div>
  );
}
