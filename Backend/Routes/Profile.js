const express = require("express");
const router = express.Router();
const upload = require("../Middleware/upload");
const ctrl = require("../Controllers/ProfileController");
const authMiddleware = require("../Middleware/Auth");

// Get logged-in user's profile
router.get("/me", authMiddleware, ctrl.getMyProfile);

// Update logged-in user's profile
router.put("/me", authMiddleware, ctrl.updateMyProfile);

// Upload avatar
router.post(
  "/upload-image",
  authMiddleware,
  upload.single("avatar"),
  ctrl.uploadAvatar
);

// Get profile by user ID
router.get("/:userId", authMiddleware, ctrl.getProfileByUserId);

module.exports = router;
