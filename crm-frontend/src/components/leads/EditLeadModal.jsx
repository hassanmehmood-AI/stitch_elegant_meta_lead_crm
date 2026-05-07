import { useState } from 'react';

const STATUSES = ['New Lead', 'CREATED', 'Qualified', 'Meeting Scheduled', 'Highly Interested', 'In Discussion', 'Meeting Done', 'Converted', 'Strong Follow-up', 'Not Qualified', 'Not Interested', 'Not Responding', 'Lead Lost', 'Busy call back'];
const SOURCES  = ['Website', 'Referral', 'LinkedIn', 'Marketing', 'Email', 'Direct'];

export default function EditLeadModal({ lead, onClose, onSubmit }) {
  const [form, setForm] = useState({
    name:    lead?.name    || '',
    email:   lead?.email   || '',
    phone:   lead?.phone   || '',
    company: lead?.company || '',
    status:  lead?.status  || 'Lead',
    source:  lead?.source  || 'Website',
    value:   lead?.value   || '',
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.(form);
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-md">
      <div className="bg-white w-full max-w-lg rounded-[24px] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden border border-white/50">
        <div className="flex justify-between items-center px-lg py-md border-b border-blue-50/50">
          <div>
            <h3 className="font-h2 text-[22px] text-on-surface">Edit Lead</h3>
            <p className="text-sm text-slate-500">Update the details for this lead.</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-slate-400">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-lg space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Full Name *</label>
              <input required value={form.name} onChange={set('name')} className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none" placeholder="James Sullivan" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Company</label>
              <input value={form.company} onChange={set('company')} className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none" placeholder="Acme Corp" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Email</label>
              <input type="email" value={form.email} onChange={set('email')} className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none" placeholder="james@acme.com" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Phone</label>
              <input value={form.phone} onChange={set('phone')} className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none" placeholder="+1 (555) 000-0000" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Status</label>
              <select value={form.status} onChange={set('status')} className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none">
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Source</label>
              <select value={form.source} onChange={set('source')} className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none">
                {SOURCES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Value ($)</label>
              <input type="number" value={form.value} onChange={set('value')} className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none" placeholder="5000" />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 rounded-xl border border-blue-100 text-slate-600 font-bold text-sm hover:bg-white transition-all">
              Cancel
            </button>
            <button type="submit" className="flex-[2] px-6 py-3 rounded-xl bg-primary-container text-white font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-lg">save</span>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
