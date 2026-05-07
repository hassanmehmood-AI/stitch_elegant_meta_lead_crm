const router = require("express").Router();
const c = require("../controllers/statsController");

router.get("/ceo",              c.getCeoStats);
router.get("/manager",          c.getManagerStats);
router.get("/employee/:userId", c.getEmployeeStats);

module.exports = router;
