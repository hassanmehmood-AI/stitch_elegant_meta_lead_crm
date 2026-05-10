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

// POST /api/agents — create a new employee/agent
exports.addAgent = async (req, res) => {
  console.log("Adding new agent:", req.body);
  const { name, email, password, initials } = req.body;
  
  if (!name || !email || !password || !initials) {
    return res.status(400).json({ error: "All fields (name, email, password, initials) are required" });
  }

  try {
    // 1. Insert into users table (for login)
    const { data: userData, error: userErr } = await supabase
      .from("users")
      .insert({
        name,
        email,
        password, 
        initials: initials.toUpperCase(),
        role: "employee"
      })
      .select()
      .single();

    if (userErr) {
      console.error("Supabase Users Error:", userErr);
      return res.status(400).json({ error: `User system error: ${userErr.message}` });
    }

    // 2. Insert into agents table (for team stats)
    const { data: agentData, error: agentErr } = await supabase
      .from("agents")
      .insert({
        name,
        initials: initials.toUpperCase(),
        role: "Account Manager",
        current: 0,
        capacity: 100,
        util_pct: 0
      })
      .select()
      .single();

    if (agentErr) {
      console.error("Supabase Agents Error:", agentErr);
      // We don't rollback the user creation here for simplicity, 
      // but in a production app you would use a transaction.
      return res.status(400).json({ error: `Agent tracking error: ${agentErr.message}` });
    }

    console.log("Successfully added agent:", userData.email);
    res.status(201).json({ user: userData, agent: agentData });
  } catch (err) {
    console.error("Unexpected Error in addAgent:", err);
    res.status(500).json({ error: "An unexpected server error occurred." });
  }
};
