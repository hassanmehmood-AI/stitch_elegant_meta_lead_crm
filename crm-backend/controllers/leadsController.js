const supabase = require("../supabase");

// GET /api/leads — all leads, newest first
exports.getLeads = async (req, res) => {
  let query = supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (req.query.search) {
    query = query.ilike("name", `%${req.query.search}%`);
  }

  if (req.query.status) {
    query = query.eq("status", req.query.status);
  }

  if (req.query.page !== undefined && req.query.pageSize !== undefined) {
    const page = parseInt(req.query.page, 10);
    const pageSize = parseInt(req.query.pageSize, 10);
    query = query.range(page * pageSize, (page + 1) * pageSize - 1);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// GET /api/leads/meta — only Meta / Facebook / Instagram leads
exports.getMetaLeads = async (req, res) => {
  let query = supabase
    .from("leads")
    .select("*")
    .in("source", ["Meta", "Facebook", "Instagram"])
    .order("created_at", { ascending: false });

  if (req.query.search) {
    query = query.ilike("name", `%${req.query.search}%`);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// GET /api/leads/unassigned — leads with no agent yet
exports.getUnassignedLeads = async (req, res) => {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .is("assigned_agent", null)
    .order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// GET /api/leads/my/:userId — leads assigned to a specific agent
exports.getMyLeads = async (req, res) => {
  const { userId } = req.params;
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("assigned_to", userId)
    .order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// GET /api/leads/:id — single lead by id
exports.getLeadById = async (req, res) => {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", req.params.id)
    .single();
  if (error) return res.status(404).json({ error: "Lead not found" });
  res.json(data);
};

// POST /api/leads — create a new lead
exports.addLead = async (req, res) => {
  const { data, error } = await supabase
    .from("leads")
    .insert(req.body)
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

// PUT /api/leads/:id — update any field(s) on a lead
exports.updateLead = async (req, res) => {
  const { data, error } = await supabase
    .from("leads")
    .update(req.body)
    .eq("id", req.params.id)
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

// POST /api/leads/:id/assign — assign a lead to an agent
// Note: does NOT force a status change because the DB CHECK constraint
// does not include "Contacted". Status stays as-is after assignment.
exports.assignLeadToAgent = async (req, res) => {
  const { agentInitials } = req.body;
  if (agentInitials === undefined) return res.status(400).json({ error: "agentInitials is required" });

  const { data, error } = await supabase
    .from("leads")
    .update({
      assigned_agent: agentInitials,
      assigned_to: agentInitials,
    })
    .eq("id", req.params.id)
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};
