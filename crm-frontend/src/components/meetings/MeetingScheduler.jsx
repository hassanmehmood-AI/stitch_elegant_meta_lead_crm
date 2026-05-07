import { useState, useEffect } from 'react';
import { api } from '../../services/api';

const TIME_SLOTS = ['09:00 AM', '10:30 AM', '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM'];
const MEETING_TYPES = ['Discovery Call', 'Follow-up Call', 'Proposal Review', 'Contract Signing', 'Demo', 'Consultation'];

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS   = ['S','M','T','W','T','F','S'];

function buildCalendar(year, month) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev  = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ day: daysInPrev - i, curr: false });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, curr: true });
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) cells.push({ day: d, curr: false });
  return cells;
}

function formatDate(year, month, day) {
  return `${MONTHS[month].slice(0, 3)} ${day}, ${year}`;
}

export default function MeetingScheduler({ leadName = 'Lead', scheduledBy = 'AR', onClose, onConfirm }) {
  const today = new Date();
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [selectedTime, setSelectedTime] = useState('10:30 AM');
  const [meetingTitle, setMeetingTitle] = useState('Discovery Call');
  const [participants, setParticipants] = useState(['MS', 'AS']); // CEO + Manager always included by default
  const [saving, setSaving] = useState(false);
  const [upcoming, setUpcoming] = useState([]);

  useEffect(() => {
    api.getMeetings().then((all) =>
      setUpcoming(all.filter((m) => 
        m.status !== 'done' && (m.scheduledBy === scheduledBy || (m.participants && m.participants.includes(scheduledBy)))
      ).slice(0, 3))
    );
  }, [scheduledBy]);

  const toggleParticipant = (initials) => {
    setParticipants(prev => 
      prev.includes(initials) ? prev.filter(p => p !== initials) : [...prev, initials]
    );
  };

  const handleConfirm = async () => {
    setSaving(true);
    const meeting = {
      title: meetingTitle,
      lead: leadName,
      date: formatDate(viewYear, viewMonth, selectedDay),
      time: selectedTime,
      scheduledBy,
      participants,
    };
    await api.addMeeting(meeting);
    setSaving(false);
    onConfirm?.(meeting);
    onClose?.();
  };

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear((y) => y - 1); setViewMonth(11); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear((y) => y + 1); setViewMonth(0); }
    else setViewMonth((m) => m + 1);
  };

  const cells = buildCalendar(viewYear, viewMonth);
  const todayKey = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;
  const selKey   = `${viewYear}-${viewMonth}-${selectedDay}`;

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-md">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[24px] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden flex flex-col border border-white/50">
        <div className="flex justify-between items-center px-lg py-md border-b border-blue-50/50">
          <div>
            <h3 className="font-h2 text-[24px] text-on-surface">Schedule Meeting</h3>
            <p className="text-sm text-slate-500">
              Setting up a call with <span className="font-semibold text-blue-600">{leadName}</span>
            </p>
          </div>
          <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-slate-400">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar grid grid-cols-1 md:grid-cols-2">
          <div className="p-lg border-r border-blue-50/50 space-y-md">

            {/* Meeting Type */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Meeting Type</label>
              <select
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                className="w-full p-3 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-blue-100 outline-none text-on-surface font-medium"
              >
                {MEETING_TYPES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>

            {/* Calendar */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Select Date</label>
              <div className="bg-slate-50 rounded-2xl p-4">
                <div className="flex items-center justify-between mb-4 px-2">
                  <span className="font-bold text-on-surface">{MONTHS[viewMonth]} {viewYear}</span>
                  <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-1 hover:text-blue-600 transition-colors">
                      <span className="material-symbols-outlined text-sm">chevron_left</span>
                    </button>
                    <button onClick={nextMonth} className="p-1 hover:text-blue-600 transition-colors">
                      <span className="material-symbols-outlined text-sm">chevron_right</span>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center mb-2">
                  {DAYS.map((d, i) => (
                    <span key={i} className="text-[10px] font-bold text-slate-300">{d}</span>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {cells.map((cell, i) => {
                    const key = `${viewYear}-${viewMonth}-${cell.day}`;
                    const isSelected = cell.curr && key === selKey;
                    const isToday    = cell.curr && key === todayKey;
                    return (
                      <button
                        key={i}
                        disabled={!cell.curr}
                        onClick={() => cell.curr && setSelectedDay(cell.day)}
                        className={`py-2 text-sm rounded-lg transition-all
                          ${!cell.curr ? 'text-slate-200 cursor-default' : ''}
                          ${cell.curr && isSelected ? 'bg-primary text-white shadow-lg font-bold' : ''}
                          ${cell.curr && isToday && !isSelected ? 'border border-primary text-primary font-bold' : ''}
                          ${cell.curr && !isSelected && !isToday ? 'text-on-surface hover:bg-white hover:shadow-sm' : ''}
                        `}
                      >
                        {cell.day}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Time Slots */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Select Time Slot</label>
              <div className="grid grid-cols-3 gap-3">
                {TIME_SLOTS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setSelectedTime(t)}
                    className={`py-2 px-3 text-sm rounded-xl transition-all ${
                      selectedTime === t
                        ? 'bg-blue-50/50 border-2 border-primary-container text-primary font-bold shadow-sm'
                        : 'border border-blue-50 text-slate-600 hover:border-primary-container hover:text-primary'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Participants */}
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Add Participants</label>
              <div className="space-y-2">
                {[
                  { initials: 'MS', name: 'Marcus Sterling', role: 'CEO' },
                  { initials: 'AS', name: 'Alex Sterling',   role: 'Manager' },
                ].map((p) => (
                  <label 
                    key={p.initials} 
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer ${
                      participants.includes(p.initials) 
                        ? 'bg-emerald-50/50 border-emerald-200 shadow-sm' 
                        : 'border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                      participants.includes(p.initials) ? 'bg-emerald-600 border-emerald-600' : 'border-slate-300'
                    }`}>
                      {participants.includes(p.initials) && <span className="material-symbols-outlined text-white text-[12px] font-bold">check</span>}
                    </div>
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                      {p.initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{p.name}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider">{p.role}</p>
                    </div>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={participants.includes(p.initials)}
                      onChange={() => toggleParticipant(p.initials)}
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="p-lg bg-slate-50/30 flex flex-col">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Upcoming Meetings</label>
            <div className="space-y-4">
              {upcoming.length === 0 ? (
                <p className="text-sm text-slate-400">No upcoming meetings.</p>
              ) : upcoming.map((m) => (
                <div key={m.id} className="bg-white p-4 rounded-2xl border border-blue-100/20 flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${m.iconBg}`}>
                    <span className="material-symbols-outlined">{m.icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold">{m.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{m.lead}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="material-symbols-outlined text-[14px] text-slate-400">calendar_today</span>
                      <span className="text-xs text-slate-500">{m.date}</span>
                      <span className="text-xs text-slate-500">• {m.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-lg border-t border-blue-50/50 flex gap-4">
              <button onClick={onClose} className="flex-1 px-6 py-3 rounded-xl border border-blue-100 text-slate-600 font-bold text-sm hover:bg-white transition-all">
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={saving}
                className="flex-[2] px-6 py-3 rounded-xl bg-primary-container text-white font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-lg">calendar_add_on</span>
                {saving ? 'Saving...' : 'Confirm Schedule'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
