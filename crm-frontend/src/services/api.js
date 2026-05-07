// Centralized API Service
// Phase 8: Swapping mock bodies for real axios calls one by one.
import axios from "axios";

// Axios instance — all requests go to the backend
const http = axios.create({ baseURL: "https://stitchelegantmetaleadcrm-production.up.railway.app/api" });

// Attach JWT token to every request (ready for Phase 9)
http.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("crm_token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export const AGENTS = [
  { initials: 'MO', name: 'Momin', role: 'Senior Account Manager', current: 142, capacity: 160, utilPct: 88 },
  { initials: 'OM', name: 'Omair', role: 'Lead Specialist', current: 98, capacity: 150, utilPct: 65 },
  { initials: 'FA', name: 'Faizan', role: 'Sales Representative', current: 115, capacity: 140, utilPct: 42 },
];

const ICON_BY_TYPE = {
  'Discovery Call': { icon: 'video_call', iconBg: 'bg-blue-50 text-primary' },
  'Follow-up Call': { icon: 'phone_in_talk', iconBg: 'bg-green-50 text-green-600' },
  'Proposal Review': { icon: 'description', iconBg: 'bg-orange-50 text-orange-600' },
  'Contract Signing': { icon: 'edit_document', iconBg: 'bg-purple-50 text-purple-600' },
  'Demo': { icon: 'present_to_all', iconBg: 'bg-teal-50 text-teal-600' },
  'Consultation': { icon: 'groups', iconBg: 'bg-slate-50 text-slate-600' },
};

const MOCK_DB = {
  meetings: [],
  leads: [
    { 
      id: 19, initials: 'HA', name: 'Hassan', whatsapp_number: '+92 300 1111111', email: 'hassan@example.com', city: 'Dubai', job_title: 'Consultant',
      company: 'Meta Lead', source: 'Meta', platform: 'Facebook', ad_name: 'Promo A', campaign_name: 'Awareness', form_name: 'Lead Form',
      investment_range: '$50k-$100k', boc_questions: 'ROI?', status: 'New Lead', value: '500000', createdDate: 'May 02, 2026', 
      assignedTo: 'MO', assignedAgent: 'MO', manager_notes: 'High intent.', assigned_date: 'May 03, 2026', next_follow_up: 'May 05, 2026', current_response: 'Pending'
    },
    { 
      id: 20, initials: 'AH', name: 'Ahmad', whatsapp_number: '+92 300 2222222', email: 'ahmad@example.com', city: 'Riyadh', job_title: 'Developer',
      company: 'Meta Lead', source: 'Meta', platform: 'Instagram', ad_name: 'Promo B', campaign_name: 'Lead Gen', form_name: 'Main Form',
      investment_range: '$100k+', boc_questions: 'Visit?', status: 'Highly Interested', value: '450000', createdDate: 'May 02, 2026', 
      assignedTo: 'MO', assignedAgent: 'MO', manager_notes: 'Big investor.', assigned_date: 'May 03, 2026', next_follow_up: 'May 04, 2026', current_response: 'Active'
    },
    { 
      id: 21, initials: 'AI', name: 'Ali', whatsapp_number: '+92 300 3333333', email: 'ali@example.com', city: 'Karachi', job_title: 'Manager',
      company: 'Meta Lead', source: 'Meta', platform: 'Facebook', ad_name: 'Promo C', campaign_name: 'BOC Ads', form_name: 'Inquiry',
      investment_range: '$20k-$50k', boc_questions: 'Business model?', status: 'In Discussion', value: '380000', createdDate: 'May 02, 2026', 
      assignedTo: 'MO', assignedAgent: 'MO', manager_notes: 'Wants a meeting.', assigned_date: 'May 03, 2026', next_follow_up: 'May 06, 2026', current_response: 'Pending'
    },
    { 
      id: 22, initials: 'BI', name: 'Bilal', whatsapp_number: '+92 300 4444444', email: 'bilal@example.com', city: 'Lahore', job_title: 'CEO',
      company: 'Meta Lead', source: 'Meta', platform: 'Instagram', ad_name: 'Promo D', campaign_name: 'Brand Growth', form_name: 'Contact Form',
      investment_range: '$200k+', boc_questions: 'Partnership?', status: 'Meeting Scheduled', value: '620000', createdDate: 'May 02, 2026', 
      assignedTo: 'MO', assignedAgent: 'MO', manager_notes: 'Urgent follow-up.', assigned_date: 'May 03, 2026', next_follow_up: 'May 07, 2026', current_response: 'Pending'
    },
    { 
      id: 23, initials: 'UM', name: 'Umar', whatsapp_number: '+92 300 5555555', email: 'umar@example.com', city: 'Islamabad', job_title: 'Entrepreneur',
      company: 'Meta Lead', source: 'Meta', platform: 'Facebook', ad_name: 'Promo E', campaign_name: 'Conversion', form_name: 'Main Form',
      investment_range: '$10k-$20k', boc_questions: 'How to start?', status: 'CREATED', value: '710000', createdDate: 'May 02, 2026', 
      assignedTo: 'MO', assignedAgent: 'MO', manager_notes: 'Interested in retail.', assigned_date: 'May 03, 2026', next_follow_up: 'May 08, 2026', current_response: 'Pending'
    }
  ],
  ceoStats: {
    metrics: [
      { icon: 'payments', iconBg: 'bg-blue-50', iconColor: 'text-blue-600', badge: '+12.4%', badgeBg: 'bg-green-50 text-green-500', label: 'Total Revenue', value: '$4,281,090' },
      { icon: 'trending_up', iconBg: 'bg-purple-50', iconColor: 'text-purple-600', badge: '+8.2%', badgeBg: 'bg-green-50 text-green-500', label: 'Conversion Rate', value: '24.8%' },
      { icon: 'person_add', iconBg: 'bg-orange-50', iconColor: 'text-orange-600', badge: 'Static', badgeBg: 'bg-slate-50 text-slate-400', label: 'New Leads', value: '1,482' },
      { icon: 'speed', iconBg: 'bg-teal-50', iconColor: 'text-teal-600', badge: '-2.1%', badgeBg: 'bg-error-container text-error', label: 'Avg. Close Time', value: '14.2 Days' },
    ],
    funnel: [
      { label: 'Awareness', value: '12,400', w: 'w-full', gradient: 'from-blue-600 to-blue-400', textColor: 'text-white' },
      { label: 'Interest', value: '8,120', w: 'w-[85%]', gradient: 'from-blue-500 to-blue-300', textColor: 'text-white' },
      { label: 'Consideration', value: '3,200', w: 'w-[70%]', gradient: 'from-blue-400 to-blue-200', textColor: 'text-white' },
      { label: 'Closed', value: '942', w: 'w-[55%]', gradient: 'from-blue-300 to-blue-100', textColor: 'text-blue-900' },
    ],
    managers: [
      { name: 'Sarah Jenkins (West Coast)', target: '92%', leads: 78, conversions: 14 },
      { name: 'David Park (East Coast)', target: '74%', leads: 62, conversions: 12 },
      { name: 'Maria Gomez (Central)', target: '88%', leads: 71, conversions: 17 },
    ]
  },
  managerStats: {
    statCards: [
      { icon: 'trending_up', iconBg: 'bg-blue-50', iconColor: 'text-blue-600', badge: '+12.5%', badgeColor: 'text-green-600', label: 'Monthly Revenue', value: '$248.5k' },
      { icon: 'bolt', iconBg: 'bg-purple-50', iconColor: 'text-purple-600', badge: '+4%', badgeColor: 'text-green-600', label: 'Avg Velocity', value: '3.2 days' },
      { icon: 'person_add', iconBg: 'bg-orange-50', iconColor: 'text-orange-600', badge: '-2.1%', badgeColor: 'text-red-500', label: 'Lead Flow', value: '1,204' },
      { icon: 'verified', iconBg: 'bg-green-50', iconColor: 'text-green-600', badge: '+18%', badgeColor: 'text-green-600', label: 'Conversion Rate', value: '24.8%' },
    ],
    teamRows: [
      { initials: 'MO', name: 'Momin',  leads: 142, conversion: '32.4%', status: 'Top Performer', statusBg: 'bg-green-50 text-green-700' },
      { initials: 'OM', name: 'Omair',  leads: 98,  conversion: '21.8%', status: 'Steady Growth', statusBg: 'bg-blue-50 text-blue-700' },
      { initials: 'FA', name: 'Faizan', leads: 115, conversion: '14.2%', status: 'At Risk',       statusBg: 'bg-red-50 text-red-700' },
    ]
  }
};

// Helper to normalize Supabase snake_case columns to frontend camelCase
const formatLead = (l) => {
  if (!l) return l;
  return {
    ...l,
    assignedAgent: l.assigned_agent || l.assignedAgent,
    assignedTo:    l.assigned_to    || l.assignedTo,
    createdDate:   l.created_date   || l.createdDate,
  };
};

const formatMeeting = (m) => {
  if (!m) return m;
  return {
    ...m,
    iconBg:      m.icon_bg      || m.iconBg      || '',
    completedBy: m.completed_by || m.completedBy || [],
    lead:        m.lead_name    || m.lead         || '',
    scheduledBy: m.scheduled_by || m.scheduledBy  || '',
  };
};

export const api = {
  // Add a fake delay to simulate network requests
  delay: (ms) => new Promise(res => setTimeout(res, ms)),

  // ✅ Phase 8 — REAL: GET /api/leads
  getLeads: async (search, status, page = 0, pageSize = 10) => {
    const params = {};
    if (search) params.search = search;
    if (status) params.status = status;
    if (page !== undefined) params.page = page;
    if (pageSize !== undefined) params.pageSize = pageSize;
    const { data } = await http.get("/leads", { params });
    return data.map(formatLead);
  },

  addLead: async (lead) => {
    try {
      const { data } = await http.post("/leads", lead);
      return formatLead(data);
    } catch (err) {
      console.warn("Backend POST /leads failed, falling back to mock.", err);
      await api.delay(400);
      const newLead = { ...lead, id: MOCK_DB.leads.length + 1 };
      MOCK_DB.leads = [newLead, ...MOCK_DB.leads];
      return newLead;
    }
  },

  getCeoStats: async () => {
    try {
      const { data } = await http.get("/stats/ceo");
      const teamWithStatus = data.team.map((agent) => {
        const staticRow = MOCK_DB.managerStats.teamRows.find(r => r.initials === agent.initials);
        return {
          ...agent,
          status: staticRow?.status || 'Active',
          statusBg: staticRow?.statusBg || 'bg-blue-50 text-blue-700',
          progress: agent.util_pct || agent.utilPct || 50
        };
      });

      return {
        ...MOCK_DB.ceoStats,
        team: teamWithStatus,
        metrics: [
          {
            icon: 'payments', iconBg: 'bg-blue-50', iconColor: 'text-blue-600',
            badge: '+12.4%', badgeBg: 'bg-green-50 text-green-500',
            label: 'Total Revenue',
            value: data.revenue > 0 ? `$${data.revenue.toLocaleString()}` : '$0',
          },
          {
            icon: 'trending_up', iconBg: 'bg-purple-50', iconColor: 'text-purple-600',
            badge: 'Live', badgeBg: 'bg-green-50 text-green-500',
            label: 'Conversion Rate',
            value: `${data.convRate}%`,
          },
          {
            icon: 'person_add', iconBg: 'bg-orange-50', iconColor: 'text-orange-600',
            badge: 'Live', badgeBg: 'bg-blue-50 text-blue-500',
            label: 'Total Leads',
            value: data.total.toLocaleString(),
          },
          {
            icon: 'fiber_new', iconBg: 'bg-teal-50', iconColor: 'text-teal-600',
            badge: 'Live', badgeBg: 'bg-teal-50 text-teal-600',
            label: 'New Leads',
            value: data.newLeads.toLocaleString(),
          },
        ],
      };
    } catch (err) {
      console.warn("Backend /stats/ceo failed, falling back to mock data.", err);
      await api.delay(400);
      const leads = MOCK_DB.leads;
      const total = leads.length;
      const closedWon = leads.filter((l) => l.status === 'Closed Won');
      const revenue = closedWon.reduce((sum, l) => sum + (Number(l.value) || 0), 0);
      const convRate = total > 0 ? ((closedWon.length / total) * 100).toFixed(1) : '0.0';
      const newLeads = leads.filter((l) => l.status === 'New Lead').length;

      // Dynamic Team Stats
      const team = AGENTS.map((agent) => {
        const agentLeads = leads.filter(l => l.assignedAgent === agent.initials);
        const won = agentLeads.filter(l => l.status === 'Closed Won').length;
        const conv = agentLeads.length > 0 ? ((won / agentLeads.length) * 100).toFixed(1) : '0.0';

        // Map status from managerStats.teamRows if exists
        const staticRow = MOCK_DB.managerStats.teamRows.find(r => r.initials === agent.initials);

        return {
          ...agent,
          leads: agentLeads.length,
          conversion: `${conv}%`,
          status: staticRow?.status || 'Active',
          statusBg: staticRow?.statusBg || 'bg-blue-50 text-blue-700',
          progress: agent.utilPct // using utilPct as progress
        };
      });

      return {
        ...MOCK_DB.ceoStats,
        team,
        metrics: [
          {
            icon: 'payments', iconBg: 'bg-blue-50', iconColor: 'text-blue-600',
            badge: '+12.4%', badgeBg: 'bg-green-50 text-green-500',
            label: 'Total Revenue',
            value: revenue > 0 ? `$${revenue.toLocaleString()}` : '$0',
          },
          {
            icon: 'trending_up', iconBg: 'bg-purple-50', iconColor: 'text-purple-600',
            badge: 'Live', badgeBg: 'bg-green-50 text-green-500',
            label: 'Conversion Rate',
            value: `${convRate}%`,
          },
          {
            icon: 'person_add', iconBg: 'bg-orange-50', iconColor: 'text-orange-600',
            badge: 'Live', badgeBg: 'bg-blue-50 text-blue-500',
            label: 'Total Leads',
            value: total.toLocaleString(),
          },
          {
            icon: 'fiber_new', iconBg: 'bg-teal-50', iconColor: 'text-teal-600',
            badge: 'Live', badgeBg: 'bg-teal-50 text-teal-600',
            label: 'New Leads',
            value: newLeads.toLocaleString(),
          },
        ],
      };
    }
  },

  getManagerStats: async () => {
    try {
      const { data } = await http.get("/stats/manager");
      const teamRows = data.teamRows.map((agent) => {
        const staticRow = MOCK_DB.managerStats.teamRows.find(r => r.initials === agent.initials);
        return {
          ...agent,
          conversion: staticRow?.conversion || '0.0%',
          status: staticRow?.status || 'Active',
          statusBg: staticRow?.statusBg || 'bg-blue-50 text-blue-700'
        };
      });
      return {
        ...MOCK_DB.managerStats,
        teamRows,
      };
    } catch (err) {
      console.warn("Backend /stats/manager failed, falling back to mock data.", err);
      await api.delay(400);
      return MOCK_DB.managerStats;
    }
  },

  getMyLeads: async (userId) => {
    try {
      const { data } = await http.get(`/leads/my/${userId}`);
      return data.map(formatLead);
    } catch (err) {
      console.warn(`Backend /leads/my/${userId} failed, falling back to mock data.`, err);
      await api.delay(400);
      return MOCK_DB.leads.filter((l) => l.assignedTo === userId);
    }
  },

  updateLead: async (id, data) => {
    try {
      const { data: updated } = await http.put(`/leads/${id}`, data);
      return formatLead(updated);
    } catch (err) {
      console.warn(`Backend PUT /leads/${id} failed, falling back to mock.`, err);
      await api.delay(300);
      MOCK_DB.leads = MOCK_DB.leads.map((l) => (l.id === id ? { ...l, ...data } : l));
      return MOCK_DB.leads.find((l) => l.id === id);
    }
  },

  assignLeadToUser: async (leadId, userId) => {
    try {
      const { data } = await http.post(`/leads/${leadId}/assign`, { agentInitials: userId });
      return formatLead(data);
    } catch (err) {
      console.warn(`Backend POST /leads/${leadId}/assign failed, falling back to mock.`, err);
      await api.delay(300);
      MOCK_DB.leads = MOCK_DB.leads.map((l) => (l.id === leadId ? { ...l, assignedTo: userId } : l));
      return MOCK_DB.leads.find((l) => l.id === leadId);
    }
  },

  getUnassignedLeads: async () => {
    try {
      const { data } = await http.get("/leads/unassigned");
      return data.map(formatLead);
    } catch (err) {
      console.warn("Backend /leads/unassigned failed, falling back to mock data.", err);
      await api.delay(400);
      return MOCK_DB.leads.filter((l) => !l.assignedAgent);
    }
  },

  getMeetings: async () => {
    try {
      const { data } = await http.get("/meetings");
      return data.map(formatMeeting);
    } catch (err) {
      console.warn("Backend GET /meetings failed, falling back to mock.", err);
      await api.delay(300);
      return [...MOCK_DB.meetings];
    }
  },

  addMeeting: async (meeting) => {
    try {
      const { data } = await http.post("/meetings", meeting);
      return formatMeeting(data);
    } catch (err) {
      console.warn("Backend POST /meetings failed, falling back to mock.", err);
      await api.delay(300);
      const icons = ICON_BY_TYPE[meeting.title] || { icon: 'calendar_today', iconBg: 'bg-blue-50 text-primary' };
      const newMeeting = { ...meeting, ...icons, id: Date.now(), status: 'scheduled' };
      MOCK_DB.meetings = [newMeeting, ...MOCK_DB.meetings];
      return newMeeting;
    }
  },

  updateMeetingStatus: async (id, status, userId) => {
    // 'done' is used by the page internally; Supabase CHECK only accepts 'completed'
    const dbStatus = status === 'done' ? 'completed' : status;
    try {
      const { data } = await http.put(`/meetings/${id}/status`, { status: dbStatus, userId });
      return formatMeeting(data);
    } catch (err) {
      console.warn(`Backend PUT /meetings/${id}/status failed, falling back to mock.`, err);
      await api.delay(200);
      MOCK_DB.meetings = MOCK_DB.meetings.map((m) => {
        if (m.id === id) {
          const completedBy = m.completedBy || [];
          if (userId && !completedBy.includes(userId)) completedBy.push(userId);
          return { ...m, status, completedBy };
        }
        return m;
      });
      return MOCK_DB.meetings.find((m) => m.id === id);
    }
  },

  getLeadById: async (id) => {
    try {
      const { data } = await http.get(`/leads/${id}`);
      return formatLead(data);
    } catch (err) {
      await api.delay(200);
      return MOCK_DB.leads.find((l) => l.id === Number(id)) || null;
    }
  },

  assignLeadToAgent: async (leadId, agentInitials) => {
    try {
      const { data } = await http.post(`/leads/${leadId}/assign`, { agentInitials });
      return formatLead(data);
    } catch (err) {
      console.warn(`Backend /leads/${leadId}/assign failed, falling back to mock data.`, err);
      await api.delay(300);
      MOCK_DB.leads = MOCK_DB.leads.map((l) =>
        l.id === Number(leadId) ? { ...l, assignedAgent: agentInitials, assignedTo: agentInitials } : l
      );
      return MOCK_DB.leads.find((l) => l.id === Number(leadId));
    }
  },

  getAssignedLeadsOverview: async (userId) => {
    try {
      const { data } = await http.get(`/leads/my/${userId}`);
      return data.map(formatLead).filter(l => l.assignedAgent);
    } catch (err) {
      console.warn(`Backend /leads/my/${userId} failed, falling back to mock data.`, err);
      await api.delay(400);
      return MOCK_DB.leads.filter((l) => l.assignedTo === userId && l.assignedAgent);
    }
  },

  getEmployeeStats: async (userId) => {
    try {
      const { data } = await http.get(`/stats/employee/${userId}`);
      return data;
    } catch (err) {
      console.warn(`Backend /stats/employee/${userId} failed, falling back to mock data.`, err);
      await api.delay(400);
      const leads = MOCK_DB.leads.filter(l => l.assignedTo === userId);
      
      // Calculate New Entries
      const newLeads = leads.filter(l => l.status === 'New Lead');
      const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      const newToday = newLeads.filter(l => l.createdDate === today).length;

      // Calculate In Progress
      const inProgress = leads.filter(l => ['Contacted', 'Proposal', 'Hot Lead'].includes(l.status));
      const contactRate = 85; // Simulated for now

      // Calculate Qualified
      const qualified = leads.filter(l => l.status === 'Qualified');
      const target = 10; // Static target for now

      return {
        newEntries: {
          total: newLeads.length,
          today: newToday || 4 // Fallback for mock demo
        },
        inProgress: {
          total: inProgress.length,
          contactRate: contactRate
        },
        qualified: {
          total: qualified.length,
          target: target
        }
      };
    }
  },

  // ✅ Phase 8 — REAL: GET /api/leads/meta
  getMetaLeads: async (search) => {
    const params = search ? { search } : {};
    const { data } = await http.get("/leads/meta", { params });
    return data.map(formatLead);
  },

  getAgents: async () => {
    try {
      const { data } = await http.get("/agents");
      return data.map((a) => ({ ...a, utilPct: a.util_pct ?? a.utilPct ?? 0 }));
    } catch (err) {
      console.warn("Backend GET /agents failed, falling back to static AGENTS.", err);
      await api.delay(100);
      return AGENTS.slice(0, 3);
    }
  },

  login: async (email, password) => {
    const { data } = await http.post("/auth/login", { email, password });
    return data; // { token, role, name, initials }
  },
};
