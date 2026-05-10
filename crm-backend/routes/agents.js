const router = require("express").Router();
const c = require("../controllers/agentsController");

router.get("/", c.getAgents);
router.post("/", c.addAgent);

module.exports = router;
