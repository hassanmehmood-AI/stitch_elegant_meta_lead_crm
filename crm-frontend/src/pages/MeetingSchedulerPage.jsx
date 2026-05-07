import { useState, useEffect } from 'react';
import Sidebar from '../components/layout/Sidebar';
import TopNavbar from '../components/layout/TopNavbar';
import MeetingScheduler from '../components/meetings/MeetingScheduler';
import AddLeadModal from '../components/leads/AddLeadModal';
import { useRole } from '../hooks/useRole';
import { api } from '../services/api';

// USER will be generated dynamically inside the component



const SECTION_META = {
  scheduled: { label: 'Scheduled Meetings', icon: 'calendar_month',  badge: 'bg-blue-50 text-blue-600'       },
  in_queue:  { label: 'Meetings in Queue',  icon: 'hourglass_empty', badge: 'bg-orange-50 text-orange-600'   },
  done:      { label: 'Meetings Done',      icon: 'check_circle',    badge: 'bg-emerald-50 text-emerald-600' },
};

function JoinModal({ meeting, onClose, onDone }) {
  return (
    <div className="fixed inset-0 z-[70] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-md">
      <div className="bg-white w-full max-w-sm rounded-[24px] shadow-2xl border border-white/50 p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-3xl text-green-600">video_call</span>
        </div>
        <h3 className="font-bold text-xl text-on-surface mb-1">{meeting.title}</h3>
        <p className="text-slate-500 text-sm mb-1">{meeting.lead}</p>
        <p className="text-slate-400 text-xs mb-6">{meeting.date} • {meeting.time}</p>
        <div className="bg-slate-50 rounded-xl p-3 mb-6 text-left">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Meeting Link</p>
          <p className="text-sm text-blue-600 font-medium break-all">meet.stitch-crm.io/join/{meeting.id}</p>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all">
            Cancel
          </button>
          <button
            onClick={onDone}
            className="flex-[2] py-3 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition-all flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined text-sm">video_call</span>
            Join Now
          </button>
        </div>
      </div>
    </div>
  );
}

function MeetingRow({ meeting, showJoin, isCompleted, onEdit, onJoin }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl border border-blue-100/20 hover:bg-blue-50/20 transition-colors">
      <div className={`p-3 rounded-xl ${meeting.iconBg} flex-shrink-0`}>
        <span className="material-symbols-outlined">{meeting.icon}</span>
      </div>
      <div className="flex-1">
        <p className="font-bold text-on-surface">{meeting.title}</p>
        <p className="text-sm text-slate-500">{meeting.lead}</p>
      </div>
      <div className="text-right mr-2">
        <div className="flex items-center gap-2 text-sm text-slate-500 justify-end">
          <span className="material-symbols-outlined text-[14px] text-slate-400">calendar_today</span>
          <span>{meeting.date}</span>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">{meeting.time}</p>
      </div>
      {showJoin ? (
        isCompleted ? (
          <span className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold">
            <span className="material-symbols-outlined text-sm">check</span>
            Done
          </span>
        ) : (
          <button
            onClick={() => onJoin(meeting)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-bold hover:bg-green-700 transition-all"
          >
            <span className="material-symbols-outlined text-sm">video_call</span>
            Join
          </button>
        )
      ) : (
        <button
          onClick={() => onEdit(meeting.lead)}
          className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
        >
          <span className="material-symbols-outlined">edit</span>
        </button>
      )}
    </div>
  );
}

export default function MeetingSchedulerPage() {
  const role = useRole();
  const isCeo = role === 'ceo';
  const storedInitials = localStorage.getItem('crm_initials') || 'MO';
  const storedName     = localStorage.getItem('crm_name')     || 'Agent';
  const displayRole = role === 'ceo' ? 'Chief Executive Officer' : role === 'manager' ? 'Sales Manager' : 'Account Manager';
  const user = { name: storedName, role: displayRole, initials: storedInitials };
  const myId = storedInitials;

  const [showAddLead,   setShowAddLead]   = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [selectedLead,  setSelectedLead]  = useState(null);
  const [meetings,      setMeetings]      = useState([]);
  const [joiningMeeting, setJoiningMeeting] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const loadMeetings = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getMeetings();
      setMeetings(data);
    } catch (err) {
      setError(err.message || 'Failed to load meetings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMeetings(); }, []);

  const handleMeetingConfirm = () => {
    loadMeetings();
    setShowScheduler(false);
  };

  const handleJoinConfirm = async () => {
    if (!joiningMeeting) return;
    await api.updateMeetingStatus(joiningMeeting.id, 'done', myId);
    setJoiningMeeting(null);
    loadMeetings();
  };

  // CEO and Manager see all team meetings; employee sees all meetings
  const filteredMeetings = meetings;

  const grouped = {
    scheduled: filteredMeetings.filter((m) => !m.completedBy || !m.completedBy.includes(myId)),
    done:      filteredMeetings.filter((m) => m.completedBy && m.completedBy.includes(myId)),
  };

  // Employee/Manager: only their meetings (scheduled by them OR invited to)
  const myMeetings = meetings.filter((m) => 
    m.scheduledBy === myId || (m.participants && m.participants.includes(myId))
  );
  
  const upcoming       = myMeetings.filter((m) => !m.completedBy || !m.completedBy.includes(myId));
  const completedCount = myMeetings.filter((m) =>  m.completedBy &&  m.completedBy.includes(myId)).length;
  const weekCount      = myMeetings.length;

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} />
      <main className="flex-1 ml-64 min-h-screen">
        <TopNavbar onAddLead={() => setShowAddLead(true)} searchPlaceholder="Search meetings or leads..." role={role} />

        <div className="p-container-padding max-w-[1440px] mx-auto">

          {/* CEO / MANAGER VIEW */}
          {(isCeo || role === 'manager') && (
            <>
              <div className="mb-10">
                <h2 className="font-h2 text-[32px] text-on-surface mb-2">Meetings Overview</h2>
                <p className="text-slate-500">Track all scheduled and completed meetings across the team.</p>
              </div>

              {error ? (
                <div className="py-16 flex flex-col items-center gap-3 text-center">
                  <span className="material-symbols-outlined text-4xl text-red-400">error_outline</span>
                  <p className="text-red-500 font-semibold">{error}</p>
                  <button onClick={loadMeetings} className="px-5 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors">Try Again</button>
                </div>
              ) : loading ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                  <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                  <p className="text-slate-400 text-sm font-medium">Loading meetings...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Card 1: Schedule Meeting */}
                  <div className="bg-white rounded-[24px] border border-blue-100/10 shadow-[0_40px_60px_-15px_rgba(27,46,253,0.03)] overflow-hidden flex flex-col h-[600px]">
                    <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                          <span className="material-symbols-outlined">calendar_month</span>
                        </div>
                        <h3 className="text-lg font-bold text-on-surface">Schedule Meeting</h3>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 bg-blue-50 text-blue-600 rounded-full">
                        {grouped.scheduled.length}
                      </span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 space-y-4">
                      {grouped.scheduled.length === 0 ? (
                        <p className="text-sm text-slate-400 py-10 text-center">No meetings scheduled.</p>
                      ) : (
                        grouped.scheduled.map((m) => (
                          <MeetingRow key={m.id} meeting={m} showJoin={true} isCompleted={m.completedBy?.includes(myId)} onJoin={(mtg) => setJoiningMeeting(mtg)} onEdit={(lead) => { setSelectedLead(lead); setShowScheduler(true); }} />
                        ))
                      )}
                    </div>
                  </div>

                  {/* Card 2: Meeting Done */}
                  <div className="bg-white rounded-[24px] border border-blue-100/10 shadow-[0_40px_60px_-15px_rgba(27,46,253,0.03)] overflow-hidden flex flex-col h-[600px]">
                    <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                          <span className="material-symbols-outlined">check_circle</span>
                        </div>
                        <h3 className="text-lg font-bold text-on-surface">Meeting Done</h3>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full">
                        {grouped.done.length}
                      </span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 space-y-4">
                      {grouped.done.length === 0 ? (
                        <p className="text-sm text-slate-400 py-10 text-center">No meetings completed yet.</p>
                      ) : (
                        grouped.done.map((m) => (
                          <MeetingRow key={m.id} meeting={m} showJoin={true} isCompleted={true} onJoin={(mtg) => setJoiningMeeting(mtg)} onEdit={(lead) => { setSelectedLead(lead); setShowScheduler(true); }} />
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* EMPLOYEE VIEW */}
          {role === 'employee' && (
            <>
              <div className="flex items-end justify-between mb-10">
                <div>
                  <h2 className="font-h2 text-[32px] text-on-surface mb-2">Meetings</h2>
                  <p className="text-slate-500">Manage your scheduled calls and follow-ups.</p>
                </div>
                <button
                  onClick={() => { setSelectedLead('New Lead'); setShowScheduler(true); }}
                  className="flex items-center gap-2 bg-primary-container text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-blue-200"
                >
                  <span className="material-symbols-outlined text-sm">add</span>
                  Schedule Meeting
                </button>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-gutter mb-gutter">
                {[
                  { icon: 'calendar_month', label: 'This Week',    value: String(weekCount),      badge: `+${Math.max(0, weekCount - 5)}`,  badgeBg: 'bg-green-50 text-green-600'    },
                  { icon: 'video_call',     label: 'Online Calls', value: String(upcoming.length), badge: upcoming.length ? `${Math.round((upcoming.length / Math.max(weekCount,1)) * 100)}%` : '0%', badgeBg: 'bg-blue-50 text-blue-600'  },
                  { icon: 'phone_in_talk',  label: 'Phone Calls',  value: '0',  badge: '0%',     badgeBg: 'bg-slate-50 text-slate-500'    },
                  { icon: 'check_circle',   label: 'Completed',    value: String(completedCount), badge: 'MTD', badgeBg: 'bg-emerald-50 text-emerald-600' },
                ].map((s) => (
                  <div key={s.label} className="bento-card p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <span className="material-symbols-outlined">{s.icon}</span>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${s.badgeBg}`}>{s.badge}</span>
                    </div>
                    <p className="text-sm font-label-caps text-slate-400 mb-1">{s.label}</p>
                    <p className="text-3xl font-bold text-on-surface">{s.value}</p>
                  </div>
                ))}
              </div>

              {/* Upcoming Meetings */}
              <div className="bento-card p-8">
                <h3 className="text-lg font-bold text-on-surface mb-6">Upcoming Meetings</h3>
                {error ? (
                  <div className="py-8 flex flex-col items-center gap-3 text-center">
                    <span className="material-symbols-outlined text-3xl text-red-400">error_outline</span>
                    <p className="text-red-500 text-sm font-semibold">{error}</p>
                    <button onClick={loadMeetings} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold hover:bg-red-100 transition-colors">Try Again</button>
                  </div>
                ) : loading ? (
                  <div className="py-8 flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
                    <p className="text-slate-400 text-sm font-medium">Loading...</p>
                  </div>
                ) : upcoming.length === 0 ? (
                  <div className="py-8 text-center text-slate-400">
                    <span className="material-symbols-outlined text-3xl block mb-2">calendar_today</span>
                    No upcoming meetings. Schedule one above.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcoming.map((m) => (
                      <MeetingRow
                        key={m.id}
                        meeting={m}
                        showJoin={false}
                        isCompleted={false}
                        onEdit={(lead) => { setSelectedLead(lead); setShowScheduler(true); }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

        </div>
      </main>

      {showAddLead && <AddLeadModal onClose={() => setShowAddLead(false)} onSubmit={() => {}} />}
      {showScheduler && (
        <MeetingScheduler
          leadName={selectedLead}
          scheduledBy={myId}
          onClose={() => setShowScheduler(false)}
          onConfirm={handleMeetingConfirm}
        />
      )}
      {joiningMeeting && (
        <JoinModal
          meeting={joiningMeeting}
          onClose={() => setJoiningMeeting(null)}
          onDone={handleJoinConfirm}
        />
      )}
    </div>
  );
}
