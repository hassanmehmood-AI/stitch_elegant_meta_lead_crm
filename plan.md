# CRM Architecture & Implementation Plan

This document outlines the step-by-step plan to convert the static HTML/Tailwind CRM UI into a fully functional web application.

## Technology Stack

*   **Frontend**: React (initialized via Vite) + Tailwind CSS
*   **Backend**: Node.js (Express)
*   **Database & Auth**: Supabase (PostgreSQL)

## Why This Stack?

1.  **React**: Perfect for managing the complex, dynamic states of a CRM dashboard (e.g., sidebar navigation, table filtering, modals). It allows us to componentize the existing HTML into reusable pieces.
2.  **Node.js**: Provides a robust middle layer for secure operations, complex server-side logic (like sending automated emails or third-party integrations), and acts as a secure bridge between the frontend and the database.
3.  **Supabase**: Provides a scalable PostgreSQL database tailored for relational CRM data, alongside secure, out-of-the-box user authentication.

---

## Migration Plan (Step-by-Step)

### Phase 1: Frontend Initialization
1.  Initialize a new React project using **Vite**.
2.  Install Tailwind CSS and configure it.
3.  Migrate the custom colors and fonts (Manrope) from the `code.html` file into `tailwind.config.js` and global CSS files.

### Phase 2: UI Component Breakdown
1.  Convert the monolithic HTML structure into modular React components:
    *   `Sidebar.jsx`
    *   `TopNavbar.jsx`
    *   `BentoStats.jsx`
    *   `LeadsTable.jsx`
2.  Set up **React Router** to handle navigation between different views (e.g., Dashboard, Leads, Team).

### Phase 3: Backend & Database Setup
1.  Initialize the **Node.js** (Express) backend repository/folder.
2.  Set up the **Supabase** project.
3.  Design and apply the Database schema in Supabase (e.g., Tables for `Users`, `Leads`, `Meetings`).
4.  Configure Supabase Authentication.
5.  Connect the Node.js backend to Supabase using the Supabase Server Client.

### Phase 4: Integration
1.  Create REST API endpoints in the Node.js backend (e.g., `GET /api/leads`, `POST /api/leads`).
2.  Update the React frontend to fetch and display dynamic data from the Node.js backend instead of using hardcoded HTML data.
3.  Implement the functional "Add Lead" modal in React that sends data to the Node.js backend to be saved in Supabase.
4.  Implement functional filtering, sorting, and pagination on the React frontend.
