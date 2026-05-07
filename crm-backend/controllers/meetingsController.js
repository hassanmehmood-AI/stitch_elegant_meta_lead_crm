const supabase = require("../supabase");

// Icon mapping mirrors the frontend mock api.js addMeeting logic
const ICON_BY_TYPE = {
  "Discovery Call":   { icon: "video_call",     icon_bg: "bg-blue-50 text-primary" },
  "Follow-up Call":   { icon: "phone_in_talk",  icon_bg: "bg-green-50 text-green-600" },
  "Proposal Review":  { icon: "description",    icon_bg: "bg-orange-50 text-orange-600" },
  "Contract Signing": { icon: "edit_document",  icon_bg: "bg-purple-50 text-purple-600" },
  "Demo":             { icon: "present_to_all", icon_bg: "bg-teal-50 text-teal-600" },
  "Consultation":     { icon: "groups",         icon_bg: "bg-slate-50 text-slate-600" },
};

// GET /api/meetings — all meetings, newest first
exports.getMeetings = async (req, res) => {
  const { data, error } = await supabase
    .from("meetings")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// POST /api/meetings — schedule a new meeting
exports.addMeeting = async (req, res) => {
  // Map camelCase frontend fields → snake_case DB columns
  const { lead, scheduledBy, ...rest } = req.body;
  const icons = ICON_BY_TYPE[rest.title] || {
    icon: "calendar_today",
    icon_bg: "bg-blue-50 text-primary",
  };
  const { data, error } = await supabase
    .from("meetings")
    .insert({
      ...rest,
      lead_name:    lead        || rest.lead_name    || null,
      scheduled_by: scheduledBy || rest.scheduled_by || null,
      ...icons,
      status: "scheduled",
    })
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

// PUT /api/meetings/:id/status — mark scheduled / completed / cancelled
// Also appends userId to completed_by so per-user "Done" tracking works
exports.updateMeetingStatus = async (req, res) => {
  const { status, userId } = req.body;
  if (!status) return res.status(400).json({ error: "status is required" });

  const { data: current, error: fetchErr } = await supabase
    .from("meetings")
    .select("completed_by")
    .eq("id", req.params.id)
    .single();
  if (fetchErr) return res.status(404).json({ error: "Meeting not found" });

  const completedBy = current.completed_by || [];
  if (userId && !completedBy.includes(userId)) completedBy.push(userId);

  const { data, error } = await supabase
    .from("meetings")
    .update({ status, completed_by: completedBy })
    .eq("id", req.params.id)
    .select()
    .single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};
