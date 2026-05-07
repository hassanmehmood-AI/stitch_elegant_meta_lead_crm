import LeadRow from './LeadRow';

export default function LeadsTable({ leads, onUpdate, page = 0, pageSize = 10, onPageChange }) {
  return (
    <div className="glass-card rounded-[16px] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-blue-50/30">
              <th className="px-6 py-4 text-xs font-label-caps text-slate-500 uppercase tracking-wider">Lead Name</th>
              <th className="px-6 py-4 text-xs font-label-caps text-slate-500 uppercase tracking-wider">Source</th>
              <th className="px-6 py-4 text-xs font-label-caps text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-label-caps text-slate-500 uppercase tracking-wider">Created Date</th>
              <th className="px-6 py-4 text-xs font-label-caps text-slate-500 uppercase tracking-wider">Assigned To</th>
              <th className="px-6 py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-100/10">
            {leads.map((lead) => (
              <LeadRow key={lead.id} lead={lead} onUpdate={onUpdate} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 bg-slate-50/50 flex items-center justify-between">
        <p className="text-xs text-slate-500 font-medium">
          Showing <span className="text-slate-800">{leads.length}</span> leads on this page
        </p>
        <div className="flex gap-2">
          <button 
            disabled={page === 0}
            onClick={() => onPageChange && onPageChange(page - 1)}
            className="px-3 py-1.5 flex items-center justify-center rounded-lg border border-blue-100 text-sm font-bold text-slate-600 hover:bg-white hover:text-blue-600 disabled:opacity-50 transition-all">
            Prev
          </button>
          <button 
            disabled={leads.length < pageSize}
            onClick={() => onPageChange && onPageChange(page + 1)}
            className="px-3 py-1.5 flex items-center justify-center rounded-lg border border-blue-100 text-sm font-bold text-slate-600 hover:bg-white hover:text-blue-600 disabled:opacity-50 transition-all">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
