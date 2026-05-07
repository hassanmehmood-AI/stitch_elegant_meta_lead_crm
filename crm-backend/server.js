const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/auth",     require("./routes/auth"));
app.use("/api/leads",    require("./routes/leads"));
app.use("/api/meetings", require("./routes/meetings"));
app.use("/api/agents",   require("./routes/agents"));
app.use("/api/stats",    require("./routes/stats"));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Penta CRM backend running on port ${PORT}`));
