import { useState, useRef, useEffect } from 'react';

export default function TopNavbar({ onAddLead, searchPlaceholder = 'Search leads, companies...', role, searchQuery, onSearch }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const notifRef = useRef();
  const helpRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotifications(false);
      if (helpRef.current && !helpRef.current.contains(event.target)) setShowHelp(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        
        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-slate-500 hover:text-blue-600 transition-all relative"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          
          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-blue-100/30 rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Notifications</span>
                <span className="text-[10px] text-blue-600 font-semibold cursor-pointer">Mark all read</span>
              </div>
              <div className="p-6 flex flex-col items-center justify-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center">
                   <span className="material-symbols-outlined text-slate-300 text-2xl">notifications_paused</span>
                </div>
                <p className="text-sm font-semibold text-slate-700">You're all caught up!</p>
                <p className="text-xs text-slate-400">No new notifications right now.</p>
              </div>
            </div>
          )}
        </div>

        {/* Help Dropdown */}
        <div className="relative" ref={helpRef}>
          <button 
            onClick={() => setShowHelp(!showHelp)}
            className="p-2 text-slate-500 hover:text-blue-600 transition-all"
          >
            <span className="material-symbols-outlined">help_outline</span>
          </button>
          
          {showHelp && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-blue-100/30 rounded-xl shadow-lg z-50 py-1">
              <a href="mailto:support@pentacrm.com" className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-sm text-slate-700 font-medium">
                <span className="material-symbols-outlined text-slate-400 text-[20px]">support_agent</span>
                Contact Support
              </a>
              <button className="w-full text-left flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors text-sm text-slate-700 font-medium">
                <span className="material-symbols-outlined text-slate-400 text-[20px]">article</span>
                Documentation
              </button>
            </div>
          )}
        </div>

        <div className="h-6 w-px bg-blue-100/30 mx-2" />
      </div>
    </header>
  );
}
