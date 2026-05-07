const supabase = require("../supabase");
const jwt = require("jsonwebtoken");

// POST /api/auth/login — validate credentials and return a JWT
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "email and password are required" });

  // Plain-text password match (Phase 6 inserted plain-text passwords)
  // Phase 9 will upgrade this to bcrypt.compare()
  const { data: users, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("password", password)
    .limit(1);

  if (error) return res.status(500).json({ error: error.message });
  if (!users || users.length === 0)
    return res.status(401).json({ error: "Invalid email or password" });

  const user = users[0];
  const token = jwt.sign(
    { id: user.id, role: user.role, name: user.name, initials: user.initials },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({ token, role: user.role, name: user.name, initials: user.initials });
};
