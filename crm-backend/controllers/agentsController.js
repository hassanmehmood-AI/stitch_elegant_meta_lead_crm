const supabase = require("../supabase");

// GET /api/agents — return all agents
exports.getAgents = async (req, res) => {
  const { data, error } = await supabase
    .from("agents")
    .select("*")
    .order("name", { ascending: true });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};
