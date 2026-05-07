const supabase = require("../supabase");

// GET /api/stats/ceo — high-level numbers for CEO dashboard
exports.getCeoStats = async (req, res) => {
  const { data: leads, error: leadsErr } = await supabase
    .from("leads")
    .select("status, value, assigned_agent");
  if (leadsErr) return res.status(500).json({ error: leadsErr.message });

  const total     = leads.length;
  const closedWon = leads.filter((l) => l.status === "Converted"); // "Converted" is the closest status in schema
  const revenue   = closedWon.reduce((sum, l) => sum + (Number(l.value) || 0), 0);
  const convRate  = total > 0 ? ((closedWon.length / total) * 100).toFixed(1) : "0.0";
  const newLeads  = leads.filter((l) => l.status === "New Lead").length;

  const { data: agents, error: agentsErr } = await supabase.from("agents").select("*");
  if (agentsErr) return res.status(500).json({ error: agentsErr.message });

  const team = agents.map((agent) => {
    const agentLeads = leads.filter((l) => l.assigned_agent === agent.initials);
    const won        = agentLeads.filter((l) => l.status === "Converted").length;
    const conv       = agentLeads.length > 0
      ? ((won / agentLeads.length) * 100).toFixed(1)
      : "0.0";
    return { ...agent, leads: agentLeads.length, conversion: `${conv}%` };
  });

  res.json({ total, revenue, convRate, newLeads, team });
};

// GET /api/stats/manager — team workload overview for Manager dashboard
exports.getManagerStats = async (req, res) => {
  const { data: leads, error: leadsErr } = await supabase
    .from("leads")
    .select("status, assigned_agent");
  if (leadsErr) return res.status(500).json({ error: leadsErr.message });

  const { data: agents, error: agentsErr } = await supabase.from("agents").select("*");
  if (agentsErr) return res.status(500).json({ error: agentsErr.message });

  const teamRows = agents.map((agent) => ({
    initials:   agent.initials,
    name:       agent.name,
    role:       agent.role,
    current:    agent.current,
    capacity:   agent.capacity,
    util_pct:   agent.util_pct,
    leads:      leads.filter((l) => l.assigned_agent === agent.initials).length,
  }));

  const total      = leads.length;
  const newLeads   = leads.filter((l) => l.status === "New Lead").length;
  const inProgress = leads.filter((l) =>
    ["CREATED", "Meeting Scheduled", "Highly Interested", "In Discussion", "Strong Follow-up", "Busy call back"].includes(l.status)
  ).length;

  res.json({ teamRows, total, newLeads, inProgress });
};

// GET /api/stats/employee/:userId — personal stats for an employee
exports.getEmployeeStats = async (req, res) => {
  const { userId } = req.params;
  const { data: leads, error } = await supabase
    .from("leads")
    .select("status, created_date")
    .eq("assigned_to", userId);
  if (error) return res.status(500).json({ error: error.message });

  const newLeads   = leads.filter((l) => l.status === "New Lead").length;
  const today      = new Date().toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
  const newToday   = leads.filter(
    (l) => l.status === "New Lead" && l.created_date === today
  ).length;
  const inProgress = leads.filter((l) =>
    ["CREATED", "Meeting Scheduled", "Highly Interested", "In Discussion", "Strong Follow-up", "Busy call back"].includes(l.status)
  ).length;
  const qualified  = leads.filter((l) => l.status === "Qualified").length;

  res.json({
    newEntries: { total: newLeads, today: newToday },
    inProgress: { total: inProgress, contactRate: 85 },
    qualified:  { total: qualified, target: 10 },
  });
};
