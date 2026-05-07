const router = require("express").Router();
const c = require("../controllers/leadsController");

// IMPORTANT: specific routes must come BEFORE the /:id wildcard
router.get("/",              c.getLeads);
router.get("/meta",          c.getMetaLeads);
router.get("/unassigned",    c.getUnassignedLeads);
router.get("/my/:userId",    c.getMyLeads);       // ← must be before /:id
router.get("/:id",           c.getLeadById);
router.post("/",             c.addLead);
router.put("/:id",           c.updateLead);
router.post("/:id/assign",   c.assignLeadToAgent);

module.exports = router;
