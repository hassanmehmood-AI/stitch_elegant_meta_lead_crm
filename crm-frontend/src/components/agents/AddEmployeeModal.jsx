import { useState, useEffect } from 'react';
import { api } from '../../services/api';

export default function AddEmployeeModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    initials: '',
  });
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [unassignedLeads, setUnassignedLeads] = useState([]);
  const [leadsLoading, setLeadsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getUnassignedLeads()
      .then(setUnassignedLeads)
      .catch(() => setUnassignedLeads([]))
      .finally(() => setLeadsLoading(false));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await api.addAgent(formData);

      if (selectedLeadId && formData.initials) {
        await api.assignLeadToAgent(Number(selectedLeadId), formData.initials.toUpperCase());
      }

      onSuccess?.(response);
      onClose();
    } catch (err) {
      const serverError = err.response?.data?.error;
      setError(serverError || 'Failed to add employee. Please try again.');
      console.error('Add employee error:', err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  const selectedLead = unassignedLeads.find((l) => String(l.id) === String(selectedLeadId));

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-[28px] shadow-2xl border border-white/50 overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
        <div className="px-8 pt-8 pb-6 border-b border-slate-50 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="text-2xl font-bold text-blue-950">Add New Employee</h3>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Manager Administration</p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-slate-400">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5 overflow-y-auto flex-1">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
              <span className="material-symbols-outlined text-red-500 text-xl">error</span>
              <p className="text-xs font-bold text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none text-on-surface font-medium"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
              <input
                required
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none text-on-surface font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Initials</label>
                <input
                  required
                  type="text"
                  name="initials"
                  maxLength={2}
                  value={formData.initials}
                  onChange={handleChange}
                  placeholder="JD"
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none text-on-surface font-medium uppercase text-center"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
                <input
                  required
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none text-on-surface font-medium"
                />
              </div>
            </div>
          </div>

          {/* Lead Assignment Section */}
          <div className="pt-2">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-blue-400 text-base">assignment_ind</span>
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assign a Lead (Optional)</label>
            </div>

            {leadsLoading ? (
              <div className="flex items-center gap-2 px-4 py-3 bg-slate-50 rounded-xl">
                <div className="w-4 h-4 border-2 border-slate-200 border-t-blue-400 rounded-full animate-spin" />
                <span className="text-xs text-slate-400">Loading leads…</span>
              </div>
            ) : unassignedLeads.length === 0 ? (
              <div className="px-4 py-3 bg-slate-50 rounded-xl text-xs text-slate-400 font-medium">
                No unassigned leads available
              </div>
            ) : (
              <select
                value={selectedLeadId}
                onChange={(e) => setSelectedLeadId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none text-on-surface font-medium appearance-none"
              >
                <option value="">— Skip, assign later —</option>
                {unassignedLeads.map((lead) => (
                  <option key={lead.id} value={lead.id}>
                    {lead.name} · {lead.platform || lead.source || 'Meta'} · {lead.whatsapp_number || lead.phone || ''}
                  </option>
                ))}
              </select>
            )}

            {selectedLead && (
              <div className="mt-2 px-4 py-3 bg-blue-50 rounded-xl flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-200 flex items-center justify-center text-xs font-bold text-blue-700 flex-shrink-0">
                  {selectedLead.initials || selectedLead.name?.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-blue-900 truncate">{selectedLead.name}</p>
                  <p className="text-[10px] text-blue-500 truncate">{selectedLead.platform || selectedLead.source} · {selectedLead.status}</p>
                </div>
                <span className="material-symbols-outlined text-blue-400 text-base ml-auto flex-shrink-0">check_circle</span>
              </div>
            )}
          </div>

          <div className="pt-2 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-[2] py-3.5 rounded-2xl bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-200 disabled:opacity-60"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="material-symbols-outlined text-lg">person_add</span>
                  {selectedLeadId ? 'Create & Assign Lead' : 'Create Account'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
