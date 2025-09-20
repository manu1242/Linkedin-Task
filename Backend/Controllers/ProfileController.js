const Profile = require("../Model/Profile");
const User = require("../Model/UserModel");

exports.getProfileByUserId = async (req, res) => {
  const profile = await Profile.findOne({ user: req.params.userId }).populate(
    "user",
    "name email avatar userType businessApproved"
  );
  if (!profile) return res.status(404).json({ message: "Not found" });
  res.json(profile);
};

exports.updateMyProfile = async (req, res) => {
  const updates = req.body;
  const profile = await Profile.findOneAndUpdate(
    { user: req.user._id },
    { $set: updates },
    { new: true, upsert: true }
  );
  res.json(profile);
};

exports.uploadAvatar = async (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file" });
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatar: `/uploads/${req.file.filename}` },
    { new: true }
  );

  res.json({ avatar: user.avatar });
};
