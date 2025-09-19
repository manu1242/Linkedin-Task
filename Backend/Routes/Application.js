const express = require("express");
const router = express.Router();
const { submitApplication, getMyApplicationStatus, getPendingApplications, reviewApplication } = require("../controllers/applicationController");
const { authMiddleware, adminMiddleware } = require("../Middleware/Auth");

router.post("/submit", authMiddleware, submitApplication);
router.get("/my-status", authMiddleware, getMyApplicationStatus);
router.get("/pending", authMiddleware, adminMiddleware, getPendingApplications);
router.put("/:applicationId/review", authMiddleware, adminMiddleware, reviewApplication);

module.exports = router;
