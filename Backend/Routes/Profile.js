const express = require("express");
const router = express.Router();
const upload = require("../Middleware/upload");
const ctrl = require("../Controllers/ProfileController");
const authMiddleware = require("../Middleware/Auth"); 
router.get("/:userId", authMiddleware, ctrl.getProfileByUserId);
router.put("/me", authMiddleware, ctrl.updateMyProfile);
router.post(
  "/upload-image",
  authMiddleware,
  upload.single("avatar"),
  ctrl.uploadAvatar
);

module.exports = router;
