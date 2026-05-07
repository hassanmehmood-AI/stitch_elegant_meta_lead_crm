export default function TopNavbar({ onAddLead, searchPlaceholder = 'Search leads, companies...', role, searchQuery, onSearch }) {
  return (
    <header className="sticky top-0 z-40 flex justify-between items-center w-full px-8 h-16 bg-white/80 backdrop-blur-xl border-b border-blue-100/10 shadow-[0_4px_30px_-10px_rgba(27,46,253,0.05)]">
      <div className="flex items-center flex-1 max-w-md">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100 transition-all outline-none placeholder:text-slate-400"
            placeholder={searchPlaceholder}
            type="text"
            value={searchQuery !== undefined ? searchQuery : ''}
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:text-blue-600 transition-all">
          <span className="material-symbols-outlined">notifications</span>
        </button>
        <button className="p-2 text-slate-500 hover:text-blue-600 transition-all">
          <span className="material-symbols-outlined">help_outline</span>
        </button>
        <div className="h-6 w-px bg-blue-100/30 mx-2" />
        {onAddLead && (
          <button
            onClick={onAddLead}
            className="bg-primary-container text-white px-5 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Add Lead
          </button>
        )}
      </div>
    </header>
  );
}
