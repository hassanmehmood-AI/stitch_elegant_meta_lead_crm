export default function MeetingsList({ meetings = [] }) {
  const visible = meetings.filter((m) => m.status !== 'done');

  return (
    <div className="bg-white rounded-[24px] border border-blue-100/10 shadow-[0_4px_30px_-10px_rgba(27,46,253,0.05)] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5 border-b border-slate-50">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-blue-600">calendar_month</span>
          <h3 className="font-bold text-[18px] text-on-surface">Upcoming Meetings</h3>
          <span className="px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
            {visible.length}
          </span>
        </div>
        <p className="text-xs text-slate-400">Scheduled by agents · click Join to enter the meeting room</p>
      </div>

      {visible.length === 0 ? (
        <div className="py-16 text-center">
          <span className="material-symbols-outlined text-4xl text-slate-200 block mb-3">event_busy</span>
          <p className="text-slate-500 font-medium">No upcoming meetings</p>
          <p className="text-xs text-slate-300 mt-1">Meetings scheduled by agents will appear here</p>
        </div>
      ) : (
        <>
          {/* Column headers */}
          <div className="grid grid-cols-[1fr_160px_200px_110px] px-8 py-3 bg-slate-50/40 border-b border-slate-50">
            {['Meeting', 'Lead', 'Date & Time', ''].map((h, i) => (
              <div
                key={i}
                className={`text-[10px] font-bold text-slate-400 uppercase tracking-widest ${i === 3 ? 'text-right' : ''}`}
              >
                {h}
              </div>
            ))}
          </div>

          <div className="divide-y divide-slate-50">
            {visible.map((m) => (
              <div
                key={m.id}
                className="grid grid-cols-[1fr_160px_200px_110px] px-8 py-4 items-center hover:bg-blue-50/10 transition-colors"
              >
                {/* Meeting title + icon */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${m.iconBg || 'bg-blue-50 text-blue-600'}`}>
                    <span className="material-symbols-outlined text-base">{m.icon || 'calendar_today'}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-on-surface truncate">{m.title}</p>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold mt-0.5 ${
                      m.status === 'scheduled' ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {m.status === 'scheduled' ? 'Scheduled' : 'In Queue'}
                    </span>
                  </div>
                </div>

                {/* Lead name */}
                <p className="text-sm text-slate-600 font-medium truncate">{m.lead}</p>

                {/* Date & Time */}
                <div className="flex items-center gap-1.5 text-sm text-slate-500">
                  <span className="material-symbols-outlined text-slate-300 text-sm">schedule</span>
                  <span className="truncate">{m.date} · {m.time}</span>
                </div>

                {/* Join button */}
                <div className="flex justify-end">
                  <button
                    onClick={() => window.open('https://meet.google.com/new', '_blank')}
                    className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl transition-all shadow-sm shadow-emerald-100 active:scale-95"
                  >
                    <span className="material-symbols-outlined text-sm">video_call</span>
                    Join
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
