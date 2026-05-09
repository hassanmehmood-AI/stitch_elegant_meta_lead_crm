export default function LeadDetailsDrawer({ lead, isOpen, onClose }) {
  if (!lead) return null;

  const sections = [
    {
      title: 'Contact & Identity',
      icon: 'person',
      fields: [
        { label: 'Lead ID', value: lead.id },
        { label: 'Full Name', value: lead.name },
        { label: 'WhatsApp', value: lead.whatsapp_number, isCopy: true },
        { label: 'Email', value: lead.email, isCopy: true },
        { label: 'City', value: lead.city },
        { label: 'Job Title', value: lead.job_title },
        { label: 'Company Name', value: lead.company },
      ]
    },
    {
      title: 'Campaign Details',
      icon: 'campaign',
      fields: [
        { label: 'Created Time', value: lead.created_date || lead.created_at || lead.createdDate },
        { label: 'Platform', value: lead.platform },
        { label: 'Campaign ID', value: lead.campaign_id },
        { label: 'Campaign Name', value: lead.campaign_name },
        { label: 'Ad Set ID', value: lead.adset_id },
        { label: 'Ad Set Name', value: lead.adset_name },
        { label: 'Ad ID', value: lead.ad_id },
        { label: 'Ad Name', value: lead.ad_name },
        { label: 'Form ID', value: lead.form_id },
        { label: 'Form Name', value: lead.form_name },
        { label: 'Organic', value: lead.is_organic ? 'Yes' : 'No' },
      ]
    },
    {
      title: 'BOC Questions & Investment',
      icon: 'quiz',
      fields: [
        { label: 'Capital Range (Investment)', value: lead.investment_range, isLong: true },
        { label: 'BOC Business Model Questions', value: lead.boc_questions, isLong: true },
      ]
    },
    {
      title: 'Internal & Interaction',
      icon: 'assignment_ind',
      fields: [
        { label: 'Lead Status', value: lead.status },
        { label: 'Agent Name', value: lead.assigned_agent || lead.assignedTo || lead.assignedAgent },
        { label: 'Assigned Date', value: lead.assigned_date },
        { label: 'Current Response', value: lead.current_response },
        { label: 'Follow Up', value: lead.next_follow_up },
        { label: 'Sales Manager Notes', value: lead.manager_notes, isLong: true },
        { label: 'Inbox URL', value: lead.inbox_url, isLink: true },
      ]
    }
  ];

  return (
    <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`absolute right-0 top-0 bottom-0 w-[550px] bg-white shadow-2xl transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-lg">
              {lead.initials}
            </div>
            <div>
              <h3 className="font-bold text-xl text-slate-900">{lead.name}</h3>
              <p className="text-xs text-slate-400">Detailed Lead View</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
            <span className="material-symbols-outlined text-slate-400">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          {sections.map((section) => (
            <div key={section.title}>
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-blue-600 text-lg">{section.icon}</span>
                <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400">{section.title}</h4>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                {section.fields.map((field, fIdx) => (
                  <div key={field.label + fIdx} className={field.isLong ? 'col-span-2' : ''}>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">{field.label}</p>
                    <div className="flex items-center gap-2 group">
                      {field.isLink ? (
                        <a href={field.value} target="_blank" rel="noreferrer" className="text-sm font-semibold text-blue-600 hover:underline break-all">
                          {field.value ? 'Open Inbox Link' : '—'}
                        </a>
                      ) : (
                        <p className={`text-sm font-semibold text-slate-800 ${field.isLong ? 'leading-relaxed' : ''}`}>
                          {field.value || '—'}
                        </p>
                      )}
                      {field.isCopy && field.value && (
                        <button 
                          onClick={() => navigator.clipboard.writeText(field.value)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 rounded text-slate-400"
                        >
                          <span className="material-symbols-outlined text-sm">content_copy</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
