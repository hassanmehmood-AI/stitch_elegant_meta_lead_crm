import StatusTag from '../shared/StatusTag';

export default function LeadDetails({ lead }) {
  const { name, initials, status, email, phone, source, company, value, assignedTo, lastInteraction, tags = [] } = lead;

  const calculateHealthScore = () => {
    const statusWeights = {
      'Meeting Done': 92,
      'In Discussion': 85,
      'Meeting Scheduled': 78,
      'Qualified': 65,
      'CREATED': 45,
      'New Lead': 40,
      'Busy call back': 35,
      'Strong Follow-up': 80,
      'Highly Interested': 88,
      'Not Responding': 15,
      'Not Interested': 10,
      'Not Qualified': 5,
      'Lead Lost': 2,
      'Converted': 100
    };

    let base = statusWeights[status] || 50;
    const valNum = parseInt(value) || 0;
    const valueBonus = Math.min(Math.floor(valNum / 100000), 8);
    return Math.min(base + valueBonus, 100);
  };

  const score = calculateHealthScore();
  
  const getScoreInfo = (s) => {
    if (s >= 90) return { text: 'Excellent conversion probability. Lead is highly engaged and moving fast.', icon: 'rocket_launch' };
    if (s >= 70) return { text: 'High conversion probability based on engagement frequency and status.', icon: 'trending_up' };
    if (s >= 40) return { text: 'Stable interest. Requires consistent follow-up to move to the next stage.', icon: 'analytics' };
    return { text: 'At risk. Engagement is low or lead has expressed significant concerns.', icon: 'warning' };
  };

  const info = getScoreInfo(score);

  return (
    <div className="space-y-gutter">
      {/* Lead Score Card */}
      <div className="bg-gradient-to-br from-primary-container to-blue-800 rounded-[16px] p-8 text-white shadow-xl shadow-blue-200">
        <h4 className="text-white/70 text-sm font-bold uppercase tracking-widest mb-4">Lead Health Score</h4>
        <div className="flex items-center justify-between">
          <div className="text-5xl font-black">
            {score}<span className="text-xl font-medium opacity-50">/100</span>
          </div>
          <div className="w-16 h-16 rounded-full border-4 border-white/20 flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl">{info.icon}</span>
          </div>
        </div>
        <p className="mt-4 text-sm text-blue-100 font-medium">
          {info.text}
        </p>
      </div>

      {/* Lead Details (Interactive UI) */}
      <div className="bg-white rounded-[24px] p-8 border border-blue-100/10 shadow-[0_40px_80px_-15px_rgba(27,46,253,0.04)]">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-bold text-[20px] text-on-surface">Lead Details</h3>
          <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
            Comprehensive View
          </span>
        </div>

        <div className="space-y-8">
          {/* Contact & Personal */}
          <section>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">person</span>
              Contact & Identity
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white transition-all group">
                <p className="text-[10px] font-bold text-slate-400 mb-1">Company</p>
                <p className="font-bold text-on-surface truncate">{company || '—'}</p>
              </div>
              <div className="p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white transition-all group">
                <p className="text-[10px] font-bold text-slate-400 mb-1">Job Title</p>
                <p className="font-bold text-on-surface truncate">{lead.job_title || '—'}</p>
              </div>
              <div className="p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-blue-100 hover:bg-white transition-all group col-span-2">
                <p className="text-[10px] font-bold text-slate-400 mb-1">WhatsApp / Phone</p>
                <div className="flex items-center justify-between">
                  <p className="font-bold text-on-surface">{lead.whatsapp_number || phone || '—'}</p>
                  <button onClick={() => navigator.clipboard.writeText(lead.whatsapp_number || phone)} className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-600">
                    <span className="material-symbols-outlined text-base">content_copy</span>
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Campaign & Acquisition */}
          <section>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">ads_click</span>
              Campaign & Acquisition
            </h4>
            <div className="space-y-3">
              {[
                { label: 'Source', value: `${source} (${lead.platform || 'Direct'})`, icon: 'language' },
                { label: 'Campaign', value: lead.campaign_name, icon: 'campaign' },
                { label: 'Ad Name', value: lead.ad_name, icon: 'label' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 flex-shrink-0">
                    <span className="material-symbols-outlined text-lg">{item.icon}</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">{item.label}</p>
                    <p className="text-sm font-bold text-on-surface leading-none">{item.value || '—'}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Business Requirements */}
          <section>
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">assignment</span>
              Business Requirements
            </h4>
            <div className="p-4 bg-blue-50/30 rounded-2xl border border-blue-100/20">
              <div className="flex justify-between mb-4">
                <div>
                  <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">Investment Range</p>
                  <p className="font-bold text-blue-900">{lead.investment_range || '—'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">Estimated Value</p>
                  <p className="font-bold text-blue-900">${Number(value || 0).toLocaleString()} /yr</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-blue-400 uppercase mb-1">Specific Questions</p>
                <p className="text-sm text-blue-800 leading-relaxed italic">"{lead.boc_questions || 'No specific questions provided.'}"</p>
              </div>
            </div>
          </section>
        </div>
      </div>

    </div>
  );
}
