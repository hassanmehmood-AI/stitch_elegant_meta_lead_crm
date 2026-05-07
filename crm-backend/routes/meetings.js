const router = require("express").Router();
const c = require("../controllers/meetingsController");

router.get("/",           c.getMeetings);
router.post("/",          c.addMeeting);
router.put("/:id/status", c.updateMeetingStatus);

module.exports = router;
