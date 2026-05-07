export default function FilterDropdown({ icon = 'filter_alt', label, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center bg-white border border-blue-100/30 px-3 py-2 rounded-xl shadow-sm cursor-pointer hover:border-blue-200 transition-all"
    >
      <span className="material-symbols-outlined text-blue-600 mr-2 text-xl">{icon}</span>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <span className="material-symbols-outlined text-slate-400 ml-2 text-lg">expand_more</span>
    </div>
  );
}
