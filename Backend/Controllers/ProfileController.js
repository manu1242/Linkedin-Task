const Profile = require("../Model/Profile");
const User = require("../Model/UserModel");

// Get profile by user ID
exports.getProfileByUserId = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.params.userId }).populate(
      "user",
      "Name Email avatar UserType businessApproved"
    );

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json(profile);
  } catch (err) {
    console.error("getProfileByUserId error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get logged-in user's profile
exports.getMyProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.User._id }).populate(
      "user",
      "Name Email avatar UserType businessApproved"
    );

    if (!profile) return res.status(404).json({ message: "Profile not found" });

    res.json(profile);
  } catch (err) {
    console.error("getMyProfile error:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Update logged-in user's profile
exports.updateMyProfile = async (req, res) => {
  try {
    const updates = req.body;

    // Update or create profile
    let profile = await Profile.findOneAndUpdate(
      { user: req.User._id },
      { $set: updates },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Populate user fields before returning
    profile = await profile.populate("user", "Name Email UserType avatar businessApproved");

    res.json(profile);
  } catch (err) {
    console.error("updateMyProfile error:", err.message);
    res.status(500).json({ message: "Server error updating profile" });
  }
};

// Upload avatar
exports.uploadAvatar = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });

  try {
    // Use full URL for avatar path
    const avatarPath = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.User._id,
      { avatar: avatarPath },
      { new: true }
    );

    res.json({ avatar: user.avatar });
  } catch (err) {
    console.error("uploadAvatar error:", err.message);
    res.status(500).json({ message: "Server error uploading avatar" });
  }
};
