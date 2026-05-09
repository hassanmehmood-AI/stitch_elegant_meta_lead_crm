import { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import TopNavbar from '../components/layout/TopNavbar';
import StatusTag from '../components/shared/StatusTag';
import LeadDetails from '../components/leads/LeadDetails';
import AddLeadModal from '../components/leads/AddLeadModal';
import EditLeadModal from '../components/leads/EditLeadModal';
import MeetingScheduler from '../components/meetings/MeetingScheduler';
import { useRole } from '../hooks/useRole';
import { api, AGENTS } from '../services/api';


// USER will be generated dynamically inside the component

const FALLBACK_LEAD = {
  id: 0, initials: 'JD', name: 'Julianne DeMarco',
  status: 'New Lead', email: 'julianne.d@enterprise-solutions.com',
  phone: '+1 (555) 012-9984', source: 'Organic Search',
  company: 'Enterprise Solutions Ltd.', value: '45000',
  assignedTo: 'MO', assignedAgent: null, lastInteraction: 'Today, 10:45 AM',
  tags: [
    { label: 'Enterprise', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100/50' },
    { label: 'High-Priority', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100/50' },
    { label: 'Migration-Needed', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100/50' },
  ],
};

const TIMELINE = [
  {
    dot: 'bg-blue-600', title: 'Introductory Discovery Call', time: 'Today, 10:45 AM',
    body: 'Client expressed interest and confirmed budget availability. Scheduling follow-up next Tuesday.',
    note: '"Strong intent. Primary concern is the timeline for property transfer."',
  },
  {
    dot: 'bg-blue-400', title: 'Initial Contact via Facebook', time: 'Yesterday, 4:20 PM',
    body: 'Client clicked on the property listing ad and submitted inquiry form.',
  },
  {
    dot: 'bg-blue-300', title: 'Lead Created', time: 'Apr 22, 2026, 11:02 AM',
    body: 'Automatic capture from Facebook Lead Ad campaign — "Sell Your Home Fast".',
  },
];

const STATUS_OPTIONS_MANAGER = ['New Lead', 'CREATED', 'Qualified', 'Meeting Scheduled', 'Highly Interested', 'In Discussion', 'Meeting Done', 'Converted', 'Strong Follow-up', 'Not Qualified', 'Not Interested', 'Not Responding', 'Lead Lost', 'Busy call back'];
const STATUS_OPTIONS_EMPLOYEE = ['New Lead', 'CREATED', 'Qualified', 'Meeting Scheduled', 'Highly Interested', 'In Discussion', 'Meeting Done', 'Converted', 'Strong Follow-up', 'Not Qualified', 'Not Interested', 'Not Responding', 'Lead Lost', 'Busy call back'];

const AGENT_MAP = Object.fromEntries(AGENTS.map((a) => [a.initials, a]));

export default function LeadDetailsPage() {
  const { id } = useParams();
  const role = useRole();
  const initials = localStorage.getItem('crm_initials') || 'MO';
  const name     = localStorage.getItem('crm_name')     || 'Momin';
  const displayRole = role === 'ceo' ? 'Chief Executive Officer' : role === 'manager' ? 'Sales Manager' : 'Account Manager';
  const user = { name, role: displayRole, initials, id: initials };

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState(null); // { type: 'success' | 'error', message: string }
  const [showAddLead, setShowAddLead] = useState(false);
  const [showScheduler, setShowScheduler] = useState(false);
  const [showEditLead, setShowEditLead] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [meetingToast, setMeetingToast] = useState(false);
  const [statusUpdateToast, setStatusUpdateToast] = useState(null);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [currentStatus, setCurrentStatus] = useState('New Lead');
  const [assignedAgent, setAssignedAgent] = useState(null);
  const [statusHistory, setStatusHistory] = useState([]);
  const [chatNotes, setChatNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [editingNoteIdx, setEditingNoteIdx] = useState(null);
  const [editNoteText, setEditNoteText] = useState('');

  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showAgentDropdown, setShowAgentDropdown] = useState(false);
  const statusRef = useRef(null);
  const agentRef = useRef(null);

  useEffect(() => {
    const fetchLead = async () => {
      try {
        const data = await api.getLeadById(id);
        const resolved = data || FALLBACK_LEAD;
        setLead(resolved);
        setCurrentStatus(resolved.status);
        setAssignedAgent(resolved.assignedAgent || null);

        let parsedNotes = [];
        if (resolved.manager_notes) {
          try {
            parsedNotes = JSON.parse(resolved.manager_notes);
            if (!Array.isArray(parsedNotes)) parsedNotes = [];
          } catch {
            parsedNotes = [{ name: 'System', initials: 'SYS', time: resolved.created_date || 'Unknown', text: resolved.manager_notes }];
          }
        }
        setChatNotes(parsedNotes);
      } catch (err) {
        setError(err.message || 'Failed to load lead details.');
      } finally {
        setLoading(false);
      }
    };
    fetchLead();
  }, [id]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (statusRef.current && !statusRef.current.contains(e.target)) setShowStatusDropdown(false);
      if (agentRef.current && !agentRef.current.contains(e.target)) setShowAgentDropdown(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleEditSubmit = async (updated) => {
    setIsSaving(true);
    try {
      await api.updateLead(Number(id) || 1, updated);
      setLead((prev) => ({ ...prev, ...updated }));
      if (updated.status) setCurrentStatus(updated.status);
      setSaveToast({ type: 'success', message: 'Lead updated successfully' });
    } catch (err) {
      setSaveToast({ type: 'error', message: err.message || 'Failed to update lead' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveToast(null), 3000);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    const noteObj = {
      name: user.name,
      initials: user.initials,
      time: new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: 'numeric' }),
      text: newNote.trim(),
      statusContext: currentStatus,
    };
    const updatedNotes = [...chatNotes, noteObj];
    const originalNotes = chatNotes;
    setChatNotes(updatedNotes);
    setNewNote('');
    setIsSaving(true);
    try {
      await api.updateLead(Number(id) || 1, { manager_notes: JSON.stringify(updatedNotes) });
    } catch (err) {
      setChatNotes(originalNotes);
      setSaveToast({ type: 'error', message: 'Failed to save note' });
      setTimeout(() => setSaveToast(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveEditNote = async (idx) => {
    if (!editNoteText.trim()) return;
    const updatedNotes = chatNotes.map((n, i) =>
      i === idx ? { ...n, text: editNoteText.trim(), editedAt: new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: 'numeric' }) } : n
    );
    const originalNotes = chatNotes;
    setChatNotes(updatedNotes);
    setEditingNoteIdx(null);
    setEditNoteText('');
    setIsSaving(true);
    try {
      await api.updateLead(Number(id) || 1, { manager_notes: JSON.stringify(updatedNotes) });
    } catch (err) {
      setChatNotes(originalNotes);
      setSaveToast({ type: 'error', message: 'Failed to update note' });
      setTimeout(() => setSaveToast(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAssignAgent = async (agentInitials) => {
    if (isSaving) return;
    setIsSaving(true);
    const originalAgent = assignedAgent;
    setAssignedAgent(agentInitials);
    setShowAgentDropdown(false);
    try {
      await api.assignLeadToAgent(Number(id), agentInitials);
      setSaveToast({ type: 'success', message: `Assigned to ${agentInitials}` });
    } catch (err) {
      setAssignedAgent(originalAgent);
      setSaveToast({ type: 'error', message: 'Failed to assign agent' });
    } finally {
      setIsSaving(false);
      setTimeout(() => setSaveToast(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <Sidebar user={user} />
        <main className="flex-1 ml-64 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
          <p className="text-slate-400 text-sm font-medium">Loading lead...</p>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen">
        <Sidebar user={user} />
        <main className="flex-1 ml-64 flex flex-col items-center justify-center gap-4">
          <span className="material-symbols-outlined text-5xl text-red-400">error_outline</span>
          <p className="text-red-500 font-semibold text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-red-50 text-red-600 rounded-xl font-bold text-sm hover:bg-red-100 transition-colors"
          >
            Retry
          </button>
        </main>
      </div>
    );
  }

  const displayLead = { ...lead, status: currentStatus, assignedAgent };
  const agentInfo = assignedAgent ? AGENT_MAP[assignedAgent] : null;
  const leadTags = lead.tags || [
    { label: lead.source, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100/50' },
    { label: 'Incoming Lead', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-100/50' },
  ];

  const generateTimeline = () => {
    if (!lead) return [];
    const timeline = [];

    const pushNote = (note, idx) => ({
      dot: 'bg-amber-400',
      title: `Note by ${note.name}`,
      time: note.editedAt ? `Edited · ${note.editedAt}` : note.time,
      body: note.text,
      icon: 'sticky_note_2',
      type: 'note',
      deleteKey: idx,
      indented: true,
    });

    // 1. Status changes — newest first; notes for each status appear below it
    statusHistory.forEach((entry, idx) => {
      const isNegative = entry.status === 'Lead Lost' || entry.status.startsWith('Not ') || entry.status === 'Not Responding' || entry.status === 'Busy call back';
      const isConverted = entry.status === 'Converted';

      const relatedNotes = chatNotes
        .map((note, noteIdx) => ({ ...note, originalIdx: noteIdx }))
        .filter((note) => note.statusContext === entry.status);

      timeline.push({
        dot: isConverted ? 'bg-purple-500' : isNegative ? 'bg-red-500' : 'bg-emerald-500',
        title: `Status Updated: ${entry.status}`,
        time: entry.time,
        body: `Lead status was updated to ${entry.status} by ${entry.changedBy}.`,
        icon: 'sync_alt',
        type: 'status',
        deleteKey: idx,
        notes: relatedNotes,
      });
    });

    // 2. Agent assigned — always show (not deletable)
    if (assignedAgent) {
      const agent = AGENT_MAP[assignedAgent];
      timeline.push({
        dot: 'bg-blue-600',
        title: 'Agent Assigned',
        time: lead.assigned_date || lead.created_date || 'Earlier',
        body: `Lead was assigned to ${agent ? agent.name : assignedAgent}.`,
        icon: 'person_check',
        type: 'base',
      });
    }

    // 3. Initial contact — always show (not deletable)
    timeline.push({
      dot: 'bg-blue-400',
      title: `Initial Contact via ${lead.platform || 'Platform'}`,
      time: lead.created_date || 'Unknown',
      body: `Client submitted inquiry form via ${lead.source || 'Ads'}.`,
      icon: 'ads_click',
      type: 'base',
    });

    return timeline;
  };

  const handleDeleteTimelineItem = async (item) => {
    if (item.type === 'status') {
      setStatusHistory((prev) => prev.filter((_, i) => i !== item.deleteKey));
    } else if (item.type === 'note') {
      const updatedNotes = chatNotes.filter((_, i) => i !== item.deleteKey);
      setChatNotes(updatedNotes);
      await api.updateLead(Number(id) || 1, { manager_notes: JSON.stringify(updatedNotes) });
    }
  };

  const dynamicTimeline = generateTimeline();

  return (
    <div className="flex min-h-screen">
      <Sidebar user={user} />
      <main className="flex-1 ml-64 overflow-y-auto">
        <TopNavbar onAddLead={() => setShowAddLead(true)} searchPlaceholder="Search leads, tasks, or agents..." role={role} />

        <div className="p-container-padding max-w-[1440px] mx-auto">

          {/* Lead Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-blue-200">
                {lead.initials}
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="font-h2 text-[32px] text-on-surface">{lead.name}</h2>
                  <StatusTag status={currentStatus} />
                </div>
                <div className="flex items-center gap-4 mt-1 text-slate-500 text-sm">
                  {lead.email && (
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base">mail</span>
                      {lead.email}
                    </span>
                  )}
                  {lead.phone && (
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base">call</span>
                      {lead.phone}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">



              {/* Schedule Meeting — hide for manager, show for employee/ceo */}
              {role !== 'manager' && (
                <button
                  onClick={() => setShowScheduler(true)}
                  className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-blue-100/50 shadow-sm text-sm font-bold text-on-surface-variant hover:border-blue-300 transition-all"
                >
                  <span className="material-symbols-outlined text-base">calendar_add_on</span>
                  Schedule Meeting
                </button>
              )}



              {/* Update Status */}
              {(role === 'manager' || role === 'employee') && (
                <div ref={statusRef} className="relative">
                  <button
                    onClick={() => setShowStatusDropdown((v) => !v)}
                    className="flex items-center gap-2 bg-white px-4 py-2.5 rounded-xl border border-blue-100/50 shadow-sm text-sm font-bold text-on-surface-variant hover:border-blue-300 transition-all"
                  >
                    <span className="material-symbols-outlined text-base text-blue-600">edit_note</span>
                    Update Status
                    <span className="material-symbols-outlined text-slate-400 text-lg">expand_more</span>
                  </button>
                  {showStatusDropdown && (
                    <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-blue-100/30 rounded-xl shadow-lg z-20 py-1 max-h-64 overflow-y-auto">
                      {STATUS_OPTIONS_EMPLOYEE.map((opt) => (
                        <button
                          key={opt}
                           onClick={async () => {
                             if (isSaving) return;
                             const now = new Date().toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: 'numeric' });
                             // Optimistic UI update
                             setCurrentStatus(opt);
                             setStatusHistory((prev) => [{ status: opt, time: now, changedBy: user.name }, ...prev]);
                             setShowStatusDropdown(false);
                             setIsSaving(true);
                             try {
                               await api.updateLead(Number(id) || 1, { status: opt });
                               // Refresh lead from server to confirm persisted state
                               const refreshed = await api.getLeadById(id);
                               if (refreshed) {
                                 setLead(refreshed);
                                 setCurrentStatus(refreshed.status || opt);
                                 setAssignedAgent(refreshed.assignedAgent || null);
                               }
                               setSaveToast({ type: 'success', message: `Status updated to ${opt}` });
                               setTimeout(() => setSaveToast(null), 3000);
                             } catch (err) {
                               console.error('Status update failed:', err);
                               setSaveToast({ type: 'error', message: 'Failed to update status' });
                               setTimeout(() => setSaveToast(null), 3000);
                             } finally {
                               setIsSaving(false);
                             }
                           }}
                          className={`w-full text-left px-4 py-1.5 text-[11px] transition-colors ${currentStatus === opt
                              ? 'text-blue-600 font-bold bg-blue-50'
                              : 'text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}


            </div>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
            {/* Left: Activity + Notes */}
            <div className="lg:col-span-8 space-y-gutter">

              {/* Activity Timeline */}
              <div className="bg-white rounded-[16px] p-8 border border-blue-100/10 shadow-[0_40px_60px_-15px_rgba(27,46,253,0.03)]">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-[20px] text-on-surface flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600">history</span>
                    Activity Timeline
                  </h3>
                  <button className="text-blue-600 text-sm font-bold hover:underline">View All</button>
                </div>
                <div className="relative ml-4">
                  <div className="absolute left-[11px] top-2 bottom-2 w-px bg-blue-100/50" />
                  {dynamicTimeline.map((item, i) => (
                    <div
                      key={i}
                      className={`relative group/tl ${i < dynamicTimeline.length - 1 ? 'pb-6' : ''} pl-10`}
                    >
                      <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-blue-50 border-4 border-white shadow-sm flex items-center justify-center ring-1 ring-blue-100">
                        <span className={`w-2 h-2 rounded-full ${item.dot}`} />
                      </div>
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-on-surface">{item.title}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-400">{item.time}</span>
                            {item.type !== 'base' && (
                              <button
                                onClick={() => handleDeleteTimelineItem(item)}
                                className="opacity-0 group-hover/tl:opacity-100 transition-opacity p-1 rounded hover:bg-red-50 text-slate-300 hover:text-red-500"
                                title="Delete this entry"
                              >
                                <span className="material-symbols-outlined text-[14px]">delete</span>
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-slate-500 mt-1 whitespace-pre-wrap">{item.body}</p>
                        {item.notes && item.notes.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {item.notes.map((note, nIdx) => (
                              <div key={note.originalIdx} className="group/note flex items-start justify-between gap-2">
                                <p className="text-sm text-slate-500 whitespace-pre-wrap">- {note.text}</p>
                                {nIdx === 0 && (
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <span className="text-[10px] text-slate-400">{note.editedAt ? `Edited · ${note.editedAt}` : note.time}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-[16px] p-8 border border-blue-100/10 shadow-[0_40px_60px_-15px_rgba(27,46,253,0.03)]">
                <h3 className="font-bold text-[20px] text-on-surface mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-600">forum</span>
                  Internal Team Notes
                </h3>
                <div className="relative">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleAddNote();
                      }
                    }}
                    className="w-full p-4 pr-14 bg-neutral-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-100 transition-all resize-none outline-none"
                    placeholder="Add a private note for the team..."
                    rows={2}
                  />
                  <div className="absolute bottom-3 right-3">
                    <button
                      onClick={handleAddNote}
                      disabled={!newNote.trim()}
                      className="bg-blue-600 text-white p-2 rounded-xl shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-base">send</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Lead Details */}
            <div className="lg:col-span-4">
              <LeadDetails
                lead={{
                  ...displayLead,
                  assignedTo: agentInfo ? agentInfo.name : 'Unassigned',
                  lastInteraction: lead.lastInteraction || 'Today',
                  tags: leadTags,
                }}
              />
            </div>
        </div>
        
        {/* Submit bar — employee and manager */}
        {(role === 'employee' || role === 'manager') && (
          <div className="mt-10 flex justify-end p-6 bg-white rounded-2xl border border-blue-100/20 shadow-[0_4px_20px_-8px_rgba(27,46,253,0.06)]">
            <button
              onClick={() => setShowEditLead(true)}
              className="flex items-center gap-2 bg-primary-container text-white px-10 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-blue-200"
            >
              <span className="material-symbols-outlined text-base">save</span>
              Submit Changes
            </button>
          </div>
        )}
      </div>
      </main>

      {showAddLead && <AddLeadModal onClose={() => setShowAddLead(false)} onSubmit={() => { }} />}
      {showEditLead && (
        <EditLeadModal
          lead={displayLead}
          onClose={() => setShowEditLead(false)}
          onSubmit={handleEditSubmit}
        />
      )}
      {showScheduler && (
        <MeetingScheduler
          leadName={lead.name}
          scheduledBy="MO"
          onClose={() => setShowScheduler(false)}
          onConfirm={() => {
            setShowScheduler(false);
            setMeetingToast(true);
            setTimeout(() => setMeetingToast(false), 3500);
          }}
        />
      )}

      {/* Contact Lead modal */}
      {showContact && lead && (
        <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-8">
          <div className="bg-white w-full max-w-sm rounded-[24px] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden border border-white/50">
            <div className="flex justify-between items-center px-8 py-5 border-b border-blue-50/50">
              <div>
                <h3 className="font-bold text-[20px] text-on-surface">Contact Lead</h3>
                <p className="text-sm text-slate-400 mt-0.5">Reach out directly</p>
              </div>
              <button
                onClick={() => setShowContact(false)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-50 transition-colors"
              >
                <span className="material-symbols-outlined text-slate-400">close</span>
              </button>
            </div>
            <div className="p-8 space-y-4">
              {/* Lead identity */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                  {lead.initials}
                </div>
                <div>
                  <p className="font-bold text-on-surface">{lead.name}</p>
                  <p className="text-xs text-slate-400">{lead.company}</p>
                </div>
              </div>

              {/* Phone */}
              {lead.phone ? (
                <a
                  href={`tel:${lead.phone}`}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-emerald-100 hover:bg-emerald-50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 group-hover:bg-emerald-100 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-emerald-600">call</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Phone</p>
                    <p className="font-semibold text-on-surface">{lead.phone}</p>
                  </div>
                  <span className="material-symbols-outlined text-emerald-400 text-base">open_in_new</span>
                </a>
              ) : null}

              {/* Email */}
              {lead.email ? (
                <a
                  href={`mailto:${lead.email}`}
                  className="flex items-center gap-4 p-4 rounded-2xl border border-blue-100 hover:bg-blue-50 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-blue-600">mail</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Email</p>
                    <p className="font-semibold text-on-surface">{lead.email}</p>
                  </div>
                  <span className="material-symbols-outlined text-blue-400 text-base">open_in_new</span>
                </a>
              ) : null}

              {!lead.phone && !lead.email && (
                <p className="text-center text-slate-400 py-4 text-sm">No contact info available for this lead.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Meeting scheduled toast */}
      {meetingToast && (
        <div className="fixed bottom-8 right-8 flex items-center gap-3 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl z-50 text-sm font-semibold">
          <span className="material-symbols-outlined text-emerald-400 text-base">check_circle</span>
          Meeting scheduled successfully!
        </div>
      )}

      {/* Saving Overlay */}
      {isSaving && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-2xl shadow-xl z-50 text-sm font-medium">
          <span className="material-symbols-outlined text-blue-400 text-base animate-spin">progress_activity</span>
          Saving changes...
        </div>
      )}

      {/* Save Toast */}
      {saveToast && (
        <div className={`fixed bottom-8 right-8 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl z-50 text-sm font-semibold animate-fade-in ${saveToast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'
          }`}>
          <span className="material-symbols-outlined text-white text-base">
            {saveToast.type === 'success' ? 'check_circle' : 'error'}
          </span>
          {saveToast.message}
        </div>
      )}
    </div>
  );
}
