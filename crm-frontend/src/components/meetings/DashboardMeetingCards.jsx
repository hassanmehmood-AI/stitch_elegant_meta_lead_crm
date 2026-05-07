import { useState, useEffect } from 'react';
import { api } from '../../services/api';

function MeetingRow({ m, onJoin, leads }) {
  const [showNotes, setShowNotes] = useState(false);
  const leadData = leads.find((l) => l.name === m.lead);
  
  let notes = [];
  if (leadData && leadData.manager_notes) {
    try {
      notes = JSON.parse(leadData.manager_notes);
      if (!Array.isArray(notes)) notes = [];
    } catch {
      notes = [{ initials: 'SYS', name: 'System', time: '', text: leadData.manager_notes }];
    }
  }
  
  const lastNote = notes.length > 0 ? notes[notes.length - 1] : null;

  return (
    <div className="flex flex-col hover:bg-blue-50/10 transition-colors">
      <div className="flex items-center gap-4 px-6 py-4">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${m.iconBg || 'bg-blue-50 text-blue-600'}`}>
          <span className="material-symbols-outlined text-base">{m.icon || 'calendar_today'}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-on-surface truncate">{m.title}</p>
          <p className="text-[11px] text-slate-400 mt-0.5 truncate">
            {m.lead} · {m.date} · {m.time}
          </p>
        </div>
        <button
          onClick={() => {
            window.open('https://meet.google.com/new', '_blank');
            onJoin?.(m.id);
          }}
          className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-xs font-bold rounded-xl transition-all flex-shrink-0 shadow-sm shadow-emerald-100"
        >
          <span className="material-symbols-outlined text-sm">video_call</span>
          Join
        </button>
      </div>

      {lastNote && (
        <div className="px-6 pb-4 ml-[52px]">
          <button 
            onClick={() => setShowNotes(!showNotes)} 
            className="flex items-center gap-1.5 text-[11px] font-bold text-blue-600 mb-2 hover:underline"
          >
            <span className="material-symbols-outlined text-[14px]">forum</span>
            {showNotes ? 'Hide Team Chat' : 'View Team Chat'}
          </button>
          {showNotes && (
             <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100/50">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-700">{lastNote.initials}</div>
                  <span className="text-xs font-bold text-on-surface">{lastNote.name}</span>
                  <span className="text-[10px] text-slate-400">{lastNote.time}</span>
                </div>
                <p className="text-xs text-slate-600 pl-7">{lastNote.text}</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
}

function DoneRow({ m }) {
  return (
    <div className="flex items-center gap-4 px-6 py-4 hover:bg-emerald-50/10 transition-colors">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${m.iconBg || 'bg-blue-50 text-blue-600'}`}>
        <span className="material-symbols-outlined text-base">{m.icon || 'calendar_today'}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm text-on-surface truncate">{m.title}</p>
        <p className="text-[11px] text-slate-400 mt-0.5 truncate">
          {m.lead} · {m.date} · {m.time}
        </p>
      </div>
      <span className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl flex-shrink-0">
        <span className="material-symbols-outlined text-sm">check_circle</span>
        Done
      </span>
    </div>
  );
}

export default function DashboardMeetingCards({ meetings = [], onJoin, myId = '' }) {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    api.getLeads().then(setLeads).catch(() => {});
  }, []);

  const scheduled = meetings.filter((m) => !m.completedBy || !m.completedBy.includes(myId));
  const done      = meetings.filter((m) =>  m.completedBy &&  m.completedBy.includes(myId));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Scheduled Meetings */}
      <div className="bg-white rounded-[24px] border border-blue-100/20 shadow-[0_4px_30px_-10px_rgba(27,46,253,0.05)] overflow-hidden flex flex-col">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-50">
          <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
            <span className="material-symbols-outlined text-blue-600 text-base">calendar_clock</span>
          </div>
          <h3 className="font-bold text-[16px] text-on-surface">Scheduled Meetings</h3>
          <span className={`ml-auto px-2.5 py-1 text-xs font-bold rounded-full ${
            scheduled.length > 0 ? 'bg-blue-50 text-blue-700' : 'bg-slate-50 text-slate-400'
          }`}>
            {scheduled.length}
          </span>
        </div>
        <div className="flex-1 divide-y divide-slate-50/80">
          {scheduled.length === 0 ? (
            <div className="py-14 text-center px-6">
              <span className="material-symbols-outlined text-3xl text-slate-200 block mb-2">event_available</span>
              <p className="text-sm text-slate-400">No scheduled meetings</p>
              <p className="text-xs text-slate-300 mt-1">Agent-scheduled meetings appear here</p>
            </div>
          ) : (
            scheduled.map((m) => <MeetingRow key={m.id} m={m} onJoin={onJoin} leads={leads} />)
          )}
        </div>
      </div>

      {/* Meeting Done */}
      <div className="bg-white rounded-[24px] border border-emerald-100/30 shadow-[0_4px_30px_-10px_rgba(27,46,253,0.05)] overflow-hidden flex flex-col">
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-50">
          <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center">
            <span className="material-symbols-outlined text-emerald-600 text-base">task_alt</span>
          </div>
          <h3 className="font-bold text-[16px] text-on-surface">Meeting Done</h3>
          <span className={`ml-auto px-2.5 py-1 text-xs font-bold rounded-full ${
            done.length > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-400'
          }`}>
            {done.length}
          </span>
        </div>
        <div className="flex-1 divide-y divide-slate-50/80">
          {done.length === 0 ? (
            <div className="py-14 text-center px-6">
              <span className="material-symbols-outlined text-3xl text-slate-200 block mb-2">check_circle</span>
              <p className="text-sm text-slate-400">No completed meetings yet</p>
              <p className="text-xs text-slate-300 mt-1">Meetings move here after joining</p>
            </div>
          ) : (
            done.map((m) => <DoneRow key={m.id} m={m} />)
          )}
        </div>
      </div>

    </div>
  );
}
