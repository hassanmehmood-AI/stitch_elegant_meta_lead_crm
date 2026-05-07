const router = require("express").Router();
const c = require("../controllers/agentsController");

router.get("/", c.getAgents);

module.exports = router;
