# Step-by-Step Implementation Guide
## Stitch Elegant Meta — Lead CRM

This file is your complete implementation roadmap. Follow each phase in order.
Do **not** skip ahead — each phase depends on the one before it.

---

## Overview of All Phases

| Phase | Name | What You Build |
|-------|------|----------------|
| 1 | Frontend Init | React + Vite + Tailwind project scaffold |
| 2 | Design System | Colors, fonts, tokens from DESIGN.md |
| 3 | UI Components | All 10 screens converted to React components |
| 4 | Routing | React Router with role-based pages |
| 5 | Backend Init | Node.js + Express server scaffold matching api.js |
| 6 | Database Setup | Supabase schema matching frontend field names |
| 7 | API Endpoints | REST routes that mirror every api.js function |
| 8 | Frontend Integration | Swap mock api.js bodies for real axios calls |
| 9 | Real Auth | Backend login endpoint, JWT stored in localStorage |
| 10 | Final Polish | Search, filter, pagination, deployment |

---

## Phase 1 — Frontend Initialization

**Goal:** Create a working React + Vite + Tailwind project.

### Steps

1. Open a terminal and navigate to your desktop:
   ```
   cd C:\Users\SSSSSS\Desktop
   ```

2. Create the React + Vite project:
   ```
   npm create vite@latest crm-frontend -- --template react
   cd crm-frontend
   npm install
   ```

3. Install Tailwind CSS and its peer dependencies:
   ```
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

4. Install other required packages now so you have them ready:
   ```
   npm install react-router-dom axios @supabase/supabase-js
   ```

5. Open `tailwind.config.js` and replace the `content` line with:
   ```js
   content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
   ```

6. Open `src/index.css` and replace everything with:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

7. Run the dev server to confirm it works:
   ```
   npm run dev
   ```
   You should see the default Vite page at `http://localhost:5173`.

**Checkpoint:** Vite server runs without errors.

---

## Phase 2 — Design System (Colors, Fonts, Tokens)

**Goal:** Bring the Serene CRM design tokens from `serene_crm/DESIGN.md` into Tailwind so every component can use them.

### Steps

1. Add the **Manrope** font to `index.html` inside the `<head>` tag:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com" />
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
   <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap" rel="stylesheet" />
   ```

2. Open `tailwind.config.js` and replace the entire file with:
   ```js
   /** @type {import('tailwindcss').Config} */
   export default {
     content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
     theme: {
       extend: {
         fontFamily: {
           sans: ["Manrope", "sans-serif"],
         },
         colors: {
           surface: "#fbf8ff",
           "surface-dim": "#dad8e8",
           "surface-bright": "#fbf8ff",
           "surface-low": "#f4f2ff",
           "surface-container": "#eeecfc",
           "surface-high": "#e8e6f6",
           "surface-highest": "#e3e1f0",
           "on-surface": "#1a1b25",
           "on-surface-variant": "#444557",
           outline: "#757589",
           "outline-variant": "#c5c5da",
           primary: "#0015cd",
           "primary-container": "#1b2efd",
           "on-primary": "#ffffff",
           "on-primary-container": "#c4c7ff",
           secondary: "#505f76",
           "secondary-container": "#d0e1fb",
           tertiary: "#7f1100",
           "tertiary-container": "#aa1a00",
           error: "#ba1a1a",
           "error-container": "#ffdad6",
         },
         borderRadius: {
           sm: "0.25rem",
           DEFAULT: "0.5rem",
           md: "0.75rem",
           lg: "1rem",
           xl: "1.5rem",
           full: "9999px",
         },
         boxShadow: {
           card: "0 8px 40px -10px rgba(27,46,253,0.04)",
           "card-hover": "0 12px 48px -8px rgba(27,46,253,0.08)",
         },
       },
     },
     plugins: [],
   };
   ```

3. Open `src/index.css` and add body defaults below the Tailwind directives:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;

   body {
     font-family: "Manrope", sans-serif;
     background-color: #fbf8ff;
     color: #1a1b25;
   }
   ```

**Checkpoint:** Restart `npm run dev`. Custom colors should be available in JSX classes.

---

## Phase 3 — UI Component Breakdown

**Goal:** Convert each of the 10 static HTML screens into reusable React components.

### Folder structure to create inside `src/`:

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.jsx
│   │   └── TopNavbar.jsx
│   ├── dashboard/
│   │   └── BentoStats.jsx
│   ├── leads/
│   │   ├── LeadsTable.jsx
│   │   ├── LeadRow.jsx
│   │   ├── AddLeadModal.jsx
│   │   └── LeadDetails.jsx
│   ├── meetings/
│   │   └── MeetingScheduler.jsx
│   ├── team/
│   │   └── TeamPerformance.jsx
│   └── shared/
│       ├── StatusTag.jsx
│       ├── SearchBar.jsx
│       └── FilterDropdown.jsx
├── pages/
│   ├── GlobalDashboard.jsx
│   ├── CeoDashboard.jsx
│   ├── ManagerDashboard.jsx
│   ├── EmployeeDashboard.jsx
│   ├── AllLeads.jsx
│   ├── MyLeads.jsx
│   ├── LeadDetailsPage.jsx
│   ├── LeadAssignment.jsx
│   ├── MeetingSchedulerPage.jsx
│   ├── TeamPerformancePage.jsx
│   └── LoginPage.jsx
├── context/
│   └── AuthContext.jsx
├── hooks/
│   └── useLeads.js
├── services/
│   └── api.js
└── App.jsx
```

### Steps

1. Create the folder structure above manually or run in terminal:
   ```
   mkdir -p src/components/layout src/components/dashboard src/components/leads src/components/meetings src/components/team src/components/shared src/pages src/context src/hooks src/services
   ```

2. **Build `Sidebar.jsx`** — Copy the sidebar `<nav>` HTML from any `code.html` file (e.g., `all_leads_manager/code.html`). Convert all `class=` to `className=` and wrap in a React component. Add click handlers using `useNavigate` from React Router.

3. **Build `TopNavbar.jsx`** — Copy the top bar HTML. Add the user avatar, search bar, and notification bell as props.

4. **Build `BentoStats.jsx`** — Copy the bento grid stat cards from `global_dashboard/code.html`. Accept a `stats` prop (array of `{ label, value, change }` objects).

5. **Build `LeadsTable.jsx`** — Copy the table from `all_leads_manager/code.html`. The table should accept a `leads` prop (array) and render rows. Each row links to the Lead Details page.

6. **Build `StatusTag.jsx`** — A small pill component that takes `status` prop and returns the correct color class. Statuses: `Lead`, `Contacted`, `Qualified`, `Proposal`, `Closed`.

7. **Build each Page component** by combining the layout components (`Sidebar` + `TopNavbar`) with the content components. Start with `GlobalDashboard.jsx` using hardcoded data.

8. Convert all remaining 9 HTML files using the same process — copy HTML, convert `class` → `className`, extract repeated parts as shared components.

**Checkpoint:** All pages render with static/hardcoded data. No real API calls yet.

---

## Phase 4 — Routing SetupPhase 4 — Routing Setup

**Goal:** Wire up React Router so each page has its own URL.

### Steps

1. Open `src/App.jsx` and replace it with:
   ```jsx
   import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
   import GlobalDashboard from "./pages/GlobalDashboard";
   import CeoDashboard from "./pages/CeoDashboard";
   import ManagerDashboard from "./pages/ManagerDashboard";
   import EmployeeDashboard from "./pages/EmployeeDashboard";
   import AllLeads from "./pages/AllLeads";
   import MyLeads from "./pages/MyLeads";
   import LeadDetailsPage from "./pages/LeadDetailsPage";
   import LeadAssignment from "./pages/LeadAssignment";
   import MeetingSchedulerPage from "./pages/MeetingSchedulerPage";
   import TeamPerformancePage from "./pages/TeamPerformancePage";
   import LoginPage from "./pages/LoginPage";

   export default function App() {
     return (
       <BrowserRouter>
         <Routes>
           <Route path="/login" element={<LoginPage />} />
           <Route path="/dashboard/global" element={<GlobalDashboard />} />
           <Route path="/dashboard/ceo" element={<CeoDashboard />} />
           <Route path="/dashboard/manager" element={<ManagerDashboard />} />
           <Route path="/dashboard/employee" element={<EmployeeDashboard />} />
           <Route path="/leads" element={<AllLeads />} />
           <Route path="/leads/my" element={<MyLeads />} />
           <Route path="/leads/:id" element={<LeadDetailsPage />} />
           <Route path="/leads/assign" element={<LeadAssignment />} />
           <Route path="/meetings" element={<MeetingSchedulerPage />} />
           <Route path="/team" element={<TeamPerformancePage />} />
           <Route path="*" element={<Navigate to="/login" />} />
         </Routes>
       </BrowserRouter>
     );
   }
   ```

2. In `Sidebar.jsx`, replace `<a href="...">` links with `<Link to="...">` from `react-router-dom`.

3. Test that clicking each sidebar link navigates to the correct URL without a full page reload.

**Checkpoint:** All 10 routes render their page. Browser back/forward works.

---

## Phase 5 — Backend Initialization

**Goal:** Create a Node.js + Express server with folder structure that mirrors your existing `api.js` function names exactly.

### Folder structure to create inside `crm-backend/`:

```
crm-backend/
├── routes/
│   ├── leads.js
│   ├── meetings.js
│   ├── agents.js
│   └── stats.js
├── controllers/
│   ├── leadsController.js
│   ├── meetingsController.js
│   ├── agentsController.js
│   └── statsController.js
├── supabase.js
├── server.js
└── .env
```

### Steps

1. From your Desktop, create the backend folder:
   ```
   cd C:\Users\SSSSSS\Desktop
   mkdir crm-backend
   cd crm-backend
   npm init -y
   ```

2. Install backend dependencies:
   ```
   npm install express cors dotenv @supabase/supabase-js jsonwebtoken bcryptjs
   npm install -D nodemon
   ```

3. Open `package.json` and add scripts:
   ```json
   "scripts": {
     "dev": "nodemon server.js",
     "start": "node server.js"
   }
   ```

4. Create `server.js` — routes match your frontend `api.js` call paths exactly:
   ```js
   const express = require("express");
   const cors = require("cors");
   require("dotenv").config();

   const app = express();
   app.use(cors({ origin: "http://localhost:5173" }));
   app.use(express.json());

   app.use("/api/auth",     require("./routes/auth"));
   app.use("/api/leads",    require("./routes/leads"));
   app.use("/api/meetings", require("./routes/meetings"));
   app.use("/api/agents",   require("./routes/agents"));
   app.use("/api/stats",    require("./routes/stats"));

   const PORT = process.env.PORT || 4000;
   app.listen(PORT, () => console.log(`Penta CRM backend running on port ${PORT}`));
   ```

5. Create `.env`:
   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_KEY=your_supabase_service_role_key
   JWT_SECRET=your_random_secret_string
   PORT=4000
   ```

6. Create `supabase.js`:
   ```js
   const { createClient } = require("@supabase/supabase-js");
   const supabase = createClient(
     process.env.SUPABASE_URL,
     process.env.SUPABASE_SERVICE_KEY
   );
   module.exports = supabase;
   ```

7. Create empty files for all routes and controllers listed in the folder structure above.

8. Run the server:
   ```
   npm run dev
   ```

**Checkpoint:** `Penta CRM backend running on port 4000` appears in the terminal.

---

## Phase 6 — Database Setup (Supabase)

**Goal:** Create Supabase tables with column names that match your frontend field names so the backend controller mapping stays simple.

### Steps

1. Go to [https://supabase.com](https://supabase.com), sign in, create a **New Project** named `penta-crm`.

2. Go to **Settings → API** and copy:
   - `Project URL` → paste as `SUPABASE_URL` in `.env`
   - `service_role` key → paste as `SUPABASE_SERVICE_KEY` in `.env`

3. Go to **SQL Editor** and run this schema — column names match your frontend fields exactly:

   ```sql
   -- Users table (replaces Supabase Auth — simpler for this project)
   CREATE TABLE users (
     id   SERIAL PRIMARY KEY,
     email    TEXT NOT NULL UNIQUE,
     password TEXT NOT NULL,
     role     TEXT NOT NULL CHECK (role IN ('ceo', 'manager', 'employee')),
     name     TEXT NOT NULL,
     initials TEXT NOT NULL,
     created_at TIMESTAMPTZ DEFAULT NOW()
   );

   -- Agents table (matches your AGENTS array in api.js)
   CREATE TABLE agents (
     id       SERIAL PRIMARY KEY,
     initials TEXT NOT NULL UNIQUE,
     name     TEXT NOT NULL,
     role     TEXT NOT NULL,
     current  INTEGER DEFAULT 0,
     capacity INTEGER DEFAULT 160,
     util_pct INTEGER DEFAULT 0
   );

   -- Leads table (all 25+ columns matching the frontend lead object)
   CREATE TABLE leads (
     id                SERIAL PRIMARY KEY,
     initials          TEXT,
     name              TEXT NOT NULL,
     company           TEXT,
     source            TEXT DEFAULT 'Meta',
     platform          TEXT,
     status            TEXT DEFAULT 'New Lead'
                          CHECK (status IN (
                            'New Lead','CREATED','Qualified','Meeting Scheduled',
                            'Highly Interested','In Discussion','Meeting Done',
                            'Converted','Strong Follow-up','Not Qualified',
                            'Not Interested','Not Responding','Lead Lost','Busy call back'
                          )),
     created_date      TEXT,
     assigned_to       TEXT,
     assigned_agent    TEXT REFERENCES agents(initials),
     email             TEXT,
     phone             TEXT,
     whatsapp_number   TEXT,
     city              TEXT,
     job_title         TEXT,
     value             TEXT DEFAULT '0',
     ad_name           TEXT,
     campaign_name     TEXT,
     form_name         TEXT,
     investment_range  TEXT,
     boc_questions     TEXT,
     manager_notes     TEXT,
     assigned_date     TEXT,
     next_follow_up    TEXT,
     current_response  TEXT,
     inbox_url         TEXT,
     created_at        TIMESTAMPTZ DEFAULT NOW()
   );

   -- Meetings table (fields match your addMeeting() call in api.js)
   CREATE TABLE meetings (
     id             SERIAL PRIMARY KEY,
     lead_id        INTEGER REFERENCES leads(id) ON DELETE CASCADE,
     lead_name      TEXT,
     agent_initials TEXT REFERENCES agents(initials),
     scheduled_by   TEXT,
     participants   TEXT[],
     title          TEXT NOT NULL,
     date           TEXT,
     time           TEXT,
     status         TEXT DEFAULT 'scheduled'
                      CHECK (status IN ('scheduled','completed','cancelled')),
     completed_by   TEXT[],
     icon           TEXT,
     icon_bg        TEXT,
     created_at     TIMESTAMPTZ DEFAULT NOW()
   );

   -- If you already ran the CREATE TABLE above without participants, run this instead:
   -- ALTER TABLE meetings ADD COLUMN participants TEXT[];
   ```

4. Insert the 3 agents from your `AGENTS` array:
   ```sql
   INSERT INTO agents (initials, name, role, current, capacity, util_pct) VALUES
     ('MO', 'Momin',  'Senior Account Manager', 142, 160, 88),
     ('OM', 'Omair',  'Lead Specialist',          98, 150, 65),
     ('FA', 'Faizan', 'Sales Representative',    115, 140, 42);
   ```

5. Insert the 5 test users (passwords are plain text for now — Phase 9 will hash them):
   ```sql
   INSERT INTO users (email, password, role, name, initials) VALUES
     ('ceo@pentacrm.com',      'password', 'ceo',      'Marcus Sterling', 'MS'),
     ('manager@pentacrm.com',  'password', 'manager',  'Alex Sterling',   'AS'),
     ('momin@pentacrm.com',    'password', 'employee', 'Momin',           'MO'),
     ('omair@pentacrm.com',    'password', 'employee', 'Omair',           'OM'),
     ('faizan@pentacrm.com',   'password', 'employee', 'Faizan',          'FA');
   ```

6. Insert the 5 Meta leads (all new columns included):
   ```sql
   INSERT INTO leads
     (initials, name, company, source, platform, status, created_date, email, whatsapp_number, city, job_title, value, ad_name, campaign_name, form_name, investment_range, boc_questions, assigned_to, assigned_agent, manager_notes, assigned_date, next_follow_up, current_response)
   VALUES
     ('HA','Hassan','Meta Lead','Meta','Facebook',  'New Lead',         'May 02, 2026','hassan@example.com','+92 300 1111111','Dubai',    'Consultant',  '500000','Promo A','Awareness',   'Lead Form',   '$50k-$100k','ROI?',            'MO','MO','High intent.',        'May 03, 2026','May 05, 2026','Pending'),
     ('AH','Ahmad', 'Meta Lead','Meta','Instagram','Highly Interested','May 02, 2026','ahmad@example.com', '+92 300 2222222','Riyadh',   'Developer',   '450000','Promo B','Lead Gen',    'Main Form',   '$100k+',    'Visit?',          'OM','OM','Big investor.',        'May 03, 2026','May 04, 2026','Active'),
     ('AI','Ali',   'Meta Lead','Meta','Facebook',  'In Discussion',   'May 02, 2026','ali@example.com',   '+92 300 3333333','Karachi',  'Manager',     '380000','Promo C','BOC Ads',     'Inquiry',     '$20k-$50k', 'Business model?', 'FA','FA','Wants a meeting.',    'May 03, 2026','May 06, 2026','Pending'),
     ('BI','Bilal', 'Meta Lead','Meta','Instagram','Meeting Scheduled','May 02, 2026','bilal@example.com', '+92 300 4444444','Lahore',   'CEO',         '620000','Promo D','Brand Growth','Contact Form','$200k+',    'Partnership?',    'MO','MO','Urgent follow-up.',  'May 03, 2026','May 07, 2026','Pending'),
     ('UM','Umar',  'Meta Lead','Meta','Facebook',  'CREATED',         'May 02, 2026','umar@example.com',  '+92 300 5555555','Islamabad','Entrepreneur','710000','Promo E','Conversion',  'Main Form',   '$10k-$20k', 'How to start?',   'OM','OM','Interested in retail.','May 03, 2026','May 08, 2026','Pending');
   ```

> **Note:** The `assignLeadToAgent` endpoint only updates `assigned_agent` and `assigned_to` — it does **not** change `status`. "Contacted" is not a valid value in the leads CHECK constraint, so no status is forced on assignment.

**Checkpoint:** All tables exist in Supabase Table Editor. 5 leads and 3 agents are visible with all new columns populated.

---

## Phase 7 — API Endpoints

**Goal:** Build every route so it mirrors the function names and return shapes from your existing `api.js` mock.

### Routes map (backend route → frontend api.js function it replaces)

| Method | Route | Replaces |
|--------|-------|---------|
| GET | `/api/leads` | `api.getLeads()` |
| GET | `/api/leads/meta` | `api.getMetaLeads()` |
| GET | `/api/leads/unassigned` | `api.getUnassignedLeads()` |
| GET | `/api/leads/my/:userId` | `api.getMyLeads(userId)` |
| GET | `/api/leads/:id` | `api.getLeadById(id)` |
| POST | `/api/leads` | `api.addLead(lead)` |
| PUT | `/api/leads/:id` | `api.updateLead(id, data)` |
| POST | `/api/leads/:id/assign` | `api.assignLeadToAgent(leadId, agentInitials)` |
| GET | `/api/meetings` | `api.getMeetings()` |
| POST | `/api/meetings` | `api.addMeeting(meeting)` |
| PUT | `/api/meetings/:id/status` | `api.updateMeetingStatus(id, status)` |
| GET | `/api/agents` | `api.getAgents()` |
| GET | `/api/stats/ceo` | `api.getCeoStats()` |
| GET | `/api/stats/manager` | `api.getManagerStats()` |
| GET | `/api/stats/employee/:userId` | `api.getEmployeeStats(userId)` |
| POST | `/api/auth/login` | *(new — replaces localStorage-only login)* |

### File: `routes/leads.js`

```js
const router = require("express").Router();
const c = require("../controllers/leadsController");

router.get("/",              c.getLeads);
router.get("/meta",          c.getMetaLeads);
router.get("/unassigned",    c.getUnassignedLeads);
router.get("/:id",           c.getLeadById);
router.post("/",             c.addLead);
router.put("/:id",           c.updateLead);
router.post("/:id/assign",   c.assignLeadToAgent);

module.exports = router;
```

### File: `controllers/leadsController.js`

```js
const supabase = require("../supabase");

exports.getLeads = async (req, res) => {
  const { data, error } = await supabase.from("leads").select("*").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.getMetaLeads = async (req, res) => {
  const { data, error } = await supabase.from("leads")
    .select("*").in("source", ["Meta", "Facebook", "Instagram"]);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.getUnassignedLeads = async (req, res) => {
  const { data, error } = await supabase.from("leads")
    .select("*").is("assigned_agent", null);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.getLeadById = async (req, res) => {
  const { data, error } = await supabase.from("leads")
    .select("*").eq("id", req.params.id).single();
  if (error) return res.status(404).json({ error: "Lead not found" });
  res.json(data);
};

exports.addLead = async (req, res) => {
  const { data, error } = await supabase.from("leads").insert(req.body).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

exports.updateLead = async (req, res) => {
  const { data, error } = await supabase.from("leads")
    .update(req.body).eq("id", req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};

exports.assignLeadToAgent = async (req, res) => {
  const { agentInitials } = req.body;
  const { data, error } = await supabase.from("leads")
    .update({ assigned_agent: agentInitials, assigned_to: agentInitials, status: "Contacted" })
    .eq("id", req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};
```

### File: `routes/meetings.js`

```js
const router = require("express").Router();
const c = require("../controllers/meetingsController");

router.get("/",             c.getMeetings);
router.post("/",            c.addMeeting);
router.put("/:id/status",   c.updateMeetingStatus);

module.exports = router;
```

### File: `controllers/meetingsController.js`

```js
const supabase = require("../supabase");

const ICON_BY_TYPE = {
  'Discovery Call':  { icon: 'video_call',     icon_bg: 'bg-blue-50 text-primary' },
  'Follow-up Call':  { icon: 'phone_in_talk',  icon_bg: 'bg-green-50 text-green-600' },
  'Proposal Review': { icon: 'description',    icon_bg: 'bg-orange-50 text-orange-600' },
  'Contract Signing':{ icon: 'edit_document',  icon_bg: 'bg-purple-50 text-purple-600' },
  'Demo':            { icon: 'present_to_all', icon_bg: 'bg-teal-50 text-teal-600' },
  'Consultation':    { icon: 'groups',         icon_bg: 'bg-slate-50 text-slate-600' },
};

exports.getMeetings = async (req, res) => {
  const { data, error } = await supabase.from("meetings").select("*").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

exports.addMeeting = async (req, res) => {
  const icons = ICON_BY_TYPE[req.body.title] || { icon: 'calendar_today', icon_bg: 'bg-blue-50 text-primary' };
  const { data, error } = await supabase.from("meetings")
    .insert({ ...req.body, ...icons, status: 'scheduled' }).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.status(201).json(data);
};

exports.updateMeetingStatus = async (req, res) => {
  const { status } = req.body;
  const { data, error } = await supabase.from("meetings")
    .update({ status }).eq("id", req.params.id).select().single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
};
```

### File: `routes/agents.js`

```js
const router = require("express").Router();
const c = require("../controllers/agentsController");
router.get("/", c.getAgents);
module.exports = router;
```

### File: `controllers/agentsController.js`

```js
const supabase = require("../supabase");

exports.getAgents = async (req, res) => {
  const { data, error } = await supabase.from("agents").select("*").limit(3);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};
```

### File: `controllers/statsController.js`

```js
const supabase = require("../supabase");

exports.getCeoStats = async (req, res) => {
  const { data: leads } = await supabase.from("leads").select("status, value, assigned_agent");
  const total = leads.length;
  const closedWon = leads.filter(l => l.status === 'Closed Won');
  const revenue = closedWon.reduce((sum, l) => sum + (Number(l.value) || 0), 0);
  const convRate = total > 0 ? ((closedWon.length / total) * 100).toFixed(1) : '0.0';
  const newLeads = leads.filter(l => l.status === 'New Lead').length;

  const { data: agents } = await supabase.from("agents").select("*");
  const team = agents.map(agent => {
    const agentLeads = leads.filter(l => l.assigned_agent === agent.initials);
    const won = agentLeads.filter(l => l.status === 'Closed Won').length;
    const conv = agentLeads.length > 0 ? ((won / agentLeads.length) * 100).toFixed(1) : '0.0';
    return { ...agent, leads: agentLeads.length, conversion: `${conv}%` };
  });

  res.json({ total, revenue, convRate, newLeads, team });
};

exports.getManagerStats = async (req, res) => {
  const { data: leads } = await supabase.from("leads").select("status, assigned_agent");
  const { data: agents } = await supabase.from("agents").select("*");

  const teamRows = agents.map(agent => ({
    initials: agent.initials,
    name: agent.name,
    leads: leads.filter(l => l.assigned_agent === agent.initials).length,
  }));

  res.json({ teamRows });
};

exports.getEmployeeStats = async (req, res) => {
  const { userId } = req.params;
  const { data: leads } = await supabase.from("leads")
    .select("status, created_date").eq("assigned_to", userId);

  const newLeads    = leads.filter(l => l.status === 'New Lead').length;
  const today       = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const newToday    = leads.filter(l => l.status === 'New Lead' && l.created_date === today).length;
  const inProgress  = leads.filter(l => ['CREATED','Meeting Scheduled','Highly Interested','In Discussion','Strong Follow-up','Busy call back'].includes(l.status)).length;
  const qualified   = leads.filter(l => l.status === 'Qualified').length;

  res.json({
    newEntries:  { total: newLeads, today: newToday },
    inProgress:  { total: inProgress, contactRate: 85 },
    qualified:   { total: qualified, target: 10 },
  });
};
```

Also add the new route to `routes/stats.js`:
```js
const router = require("express").Router();
const c = require("../controllers/statsController");
router.get("/ceo",              c.getCeoStats);
router.get("/manager",          c.getManagerStats);
router.get("/employee/:userId", c.getEmployeeStats);
module.exports = router;
```

### Test with Thunder Client (VS Code extension):
- `GET http://localhost:4000/api/leads` → returns all 5 Meta leads with all 25+ fields
- `GET http://localhost:4000/api/leads/meta` → returns only Meta/Facebook/Instagram leads
- `GET http://localhost:4000/api/leads/my/MO` → returns leads assigned to Momin
- `GET http://localhost:4000/api/agents` → returns Momin, Omair, Faizan
- `GET http://localhost:4000/api/stats/employee/MO` → returns Employee stats for Momin
- `POST http://localhost:4000/api/leads/1/assign` body `{ "agentInitials": "MO" }` → assigns Hassan to Momin

**Checkpoint:** All routes return data shaped exactly like your mock `api.js` returns today.

---

## Phase 8 — Frontend Integration

**Goal:** Swap the mock function bodies in `src/services/api.js` one by one for real axios calls. The function signatures and names stay exactly the same — only the bodies change.

### Steps

1. Add an axios instance at the top of `src/services/api.js`:
   ```js
   import axios from "axios";

   const http = axios.create({ baseURL: "http://localhost:4000/api" });

   // Helper to attach JWT token to every request (set in Phase 9)
   http.interceptors.request.use(cfg => {
     const token = localStorage.getItem("crm_token");
     if (token) cfg.headers.Authorization = `Bearer ${token}`;
     return cfg;
   });
   ```

2. Replace `getLeads` mock body:
   ```js
   getLeads: async () => {
     const { data } = await http.get("/leads");
     return data;
   },
   ```

3. Replace `getMetaLeads` mock body:
   ```js
   getMetaLeads: async () => {
     const { data } = await http.get("/leads/meta");
     return data;
   },
   ```

4. Replace `getLeadById` mock body:
   ```js
   getLeadById: async (id) => {
     const { data } = await http.get(`/leads/${id}`);
     return data;
   },
   ```

5. Replace `addLead` mock body:
   ```js
   addLead: async (lead) => {
     const { data } = await http.post("/leads", lead);
     return data;
   },
   ```

6. Replace `updateLead` mock body:
   ```js
   updateLead: async (id, updates) => {
     const { data } = await http.put(`/leads/${id}`, updates);
     return data;
   },
   ```

7. Replace `assignLeadToAgent` mock body:
   ```js
   assignLeadToAgent: async (leadId, agentInitials) => {
     const { data } = await http.post(`/leads/${leadId}/assign`, { agentInitials });
     return data;
   },
   ```

8. Replace `getMeetings` and `addMeeting` mock bodies:
   ```js
   getMeetings: async () => {
     const { data } = await http.get("/meetings");
     return data;
   },

   addMeeting: async (meeting) => {
     const { data } = await http.post("/meetings", meeting);
     return data;
   },

   updateMeetingStatus: async (id, status) => {
     const { data } = await http.put(`/meetings/${id}/status`, { status });
     return data;
   },
   ```

9. Replace `getAgents` mock body:
   ```js
   getAgents: async () => {
     const { data } = await http.get("/agents");
     return data;
   },
   ```

10. Replace `getCeoStats`, `getManagerStats`, and `getEmployeeStats` mock bodies:
    ```js
    getCeoStats: async () => {
      const { data } = await http.get("/stats/ceo");
      return data;
    },

    getManagerStats: async () => {
      const { data } = await http.get("/stats/manager");
      return data;
    },

    getEmployeeStats: async (userId) => {
      const { data } = await http.get(`/stats/employee/${userId}`);
      return data;
    },
    ```

11. Replace `getMyLeads` mock body:
    ```js
    getMyLeads: async (userId) => {
      const { data } = await http.get(`/leads/my/${userId}`);
      return data;
    },
    ```

12. Replace `assignLeadToUser` mock body:
    ```js
    assignLeadToUser: async (leadId, userId) => {
      const { data } = await http.post(`/leads/${leadId}/assign`, { agentInitials: userId });
      return data;
    },
    ```

**Important:** Swap one function at a time, test in the browser, confirm that page still works before moving to the next function. Do not swap all at once.

**Checkpoint:** All pages load live data from Supabase. Page refresh no longer resets assignments or meetings.

---

## Phase 9 — Real Authentication

**Goal:** Replace the role-picker-only login with a real backend check. Keep the existing `localStorage` + `useRole()` pattern — only add a token verification step.

### Backend steps

1. Add `routes/auth.js`:
   ```js
   const router = require("express").Router();
   const c = require("../controllers/authController");
   router.post("/login", c.login);
   module.exports = router;
   ```

2. Create `controllers/authController.js`:
   ```js
   const supabase = require("../supabase");
   const jwt = require("jsonwebtoken");

   exports.login = async (req, res) => {
     const { email, password } = req.body;
     const { data: users, error } = await supabase
       .from("users").select("*").eq("email", email).eq("password", password).limit(1);
     if (error || !users.length) return res.status(401).json({ error: "Invalid email or password" });

     const user = users[0];
     const token = jwt.sign(
       { id: user.id, role: user.role, name: user.name, initials: user.initials },
       process.env.JWT_SECRET,
       { expiresIn: "7d" }
     );
     res.json({ token, role: user.role, name: user.name, initials: user.initials });
   };
   ```
   > Note: This uses plain-text password comparison matching the INSERT you did in Phase 6. For production, replace with `bcrypt.compare()`.

### Frontend steps

3. Add `api.login` to `src/services/api.js`:
   ```js
   login: async (email, password) => {
     const { data } = await http.post("/auth/login", { email, password });
     return data; // { token, role, name, initials }
   },
   ```

4. Update `handleSubmit` in `LoginPage.jsx` — replace the setTimeout block:
   ```js
   const handleSubmit = async (e) => {
     e.preventDefault();
     setIsSubmitting(true);
     try {
       const result = await api.login(form.email, form.password);
       localStorage.setItem("crm_role",  result.role);
       localStorage.setItem("crm_token", result.token);
       if (result.role === "ceo")      navigate("/dashboard/ceo");
       if (result.role === "manager")  navigate("/dashboard/manager");
       if (result.role === "employee") navigate("/dashboard/employee");
     } catch {
       alert("Invalid email or password");
       setIsSubmitting(false);
     }
   };
   ```

5. `useRole()` in `src/hooks/useRole.js` stays unchanged — it still reads `localStorage.getItem('crm_role')`.

6. `RoleGuard` in `App.jsx` stays unchanged — it still uses `useRole()`.

7. The role picker on `LoginPage.jsx` can stay as a convenience — it pre-fills the email. The real check now happens on the backend.

**Checkpoint:** Login with `ceo@pentacrm.com / password` → lands on CEO dashboard. Wrong password → alert shown. Roles are locked to what the database says, not what the picker shows.

---

## Phase 10 — Final Polish & Deployment

**Goal:** Add search, filter, pagination, and deploy both frontend and backend.

### Steps

1. **Search on AllLeads / ManagerDashboard:**
   - Add a `search` state in the page component.
   - Pass it to `api.getLeads()` or `api.getMetaLeads()` — backend already accepts a `search` query param.
   - Add `if (req.query.search) query = query.ilike("name", \`%${req.query.search}%\`)` in `leadsController.getLeads`.

2. **Status filter on AllLeads:**
   - Add a `status` filter state using your existing `FilterDropdown` component.
   - Valid values: `New Lead`, `CREATED`, `Qualified`, `Meeting Scheduled`, `Highly Interested`, `In Discussion`, `Meeting Done`, `Converted`, `Strong Follow-up`, `Not Qualified`, `Not Interested`, `Not Responding`, `Lead Lost`, `Busy call back`.
   - Pass to backend as `?status=Qualified`.

3. **Pagination on LeadsTable:**
   - Add `page` state (start at 0) and `pageSize = 10`.
   - Pass `?page=0&pageSize=10` to the backend.
   - In `leadsController.getLeads`: add `.range(page * pageSize, (page + 1) * pageSize - 1)`.
   - Add Prev / Next buttons below the table.

4. **Lead status update from LeadDetailsPage:**
   - On status dropdown change, call `api.updateLead(id, { status: newStatus })`.
   - Refresh the lead state after success.

5. **Error and loading states:**
   - Every page that calls an api function already has a `loading` state — make sure it shows a spinner while `loading === true`.
   - Wrap api calls in try/catch and show an error banner if the request fails.

6. **Build frontend for production:** [COMPLETED]
   ```
   cd crm-frontend
   npm run build
   ```
   This creates a `dist/` folder. [SUCCESS]

7. **Deploy frontend (Vercel):** Connect your GitHub repository to [Vercel](https://vercel.com). Select the `crm-frontend` directory as the project root. Vercel will automatically detect the Vite build settings and deploy the `dist/` folder.

8. **Deploy backend (Railway):** Connect your GitHub repository to [Railway](https://railway.app). Point the service to the `crm-backend/` directory. Ensure all environment variables from your `.env` (Supabase URL, Service Role Key, etc.) are added to the Railway dashboard.

9. **Connect Frontend to Backend:** Once the backend is live, update `crm-frontend/src/services/api.js` with your new Railway URL:
   ```js
   const http = axios.create({ baseURL: "https://your-project-name.up.railway.app/api" });
   ```
   Push the change to GitHub to trigger a fresh production build on Vercel.

**Checkpoint:** App is live at a public URL. Login works. Leads persist across page refreshes. Assignments survive a browser close.

---

## Quick Reference — File Count by Phase

| Phase | New Files |
|-------|-----------|
| 1 | `crm-frontend/` Vite scaffold |
| 2 | `tailwind.config.js` modified |
| 3 | ~20 `.jsx` component + page files |
| 4 | `App.jsx` modified |
| 5 | `crm-backend/server.js`, `supabase.js`, `.env`, empty route + controller files |
| 6 | Supabase tables via SQL (no local files) |
| 7 | 4 route files + 4 controller files filled in |
| 8 | `api.js` function bodies replaced (no new files) |
| 9 | `authController.js`, `routes/auth.js`, `LoginPage.jsx` updated |
| 10 | No new files — modifies existing pages + backend controllers |

---

## Tools You Need Installed

- **Node.js** v18+ → [https://nodejs.org](https://nodejs.org)
- **VS Code** (recommended editor)
- **Thunder Client** (VS Code extension) — for testing API endpoints
- **Supabase account** (free tier is sufficient)
- **Git** (optional but recommended for version control)
