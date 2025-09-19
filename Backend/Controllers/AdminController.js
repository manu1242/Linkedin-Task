const Application = require('../Model/Application');
const User = require('../Model/UserModel');
const Post = require('../Model/PostModel');

// Get all pending applications
const pendingApplications = async (req, res) => {
  if (req.user.userType !== 'ADMIN') {
    return res.status(403).json({ message: 'admin only' });
  }

  const apps = await Application.find({ status: { $in: ['SUBMITTED', 'PENDING'] } })
    .populate('applicant', 'name email');

  res.json(apps);
};

// Get all users (admin only)
const listUsers = async (req, res) => {
  if (req.user.userType !== 'ADMIN') {
    return res.status(403).json({ message: 'admin only' });
  }

  const users = await User.find().select('-password');
  res.json(users);
};

// Suspend or unsuspend a user (admin only)
const suspendUser = async (req, res) => {
  if (req.user.userType !== 'ADMIN') {
    return res.status(403).json({ message: 'admin only' });
  }

  const { action } = req.body; // 'SUSPEND' or 'UNSUSPEND'

  const updated = await User.findByIdAndUpdate(
    req.params.userId,
    { suspended: action === 'SUSPEND' },
    { new: true }
  );

  res.json(updated);
};

// Get app-wide statistics (admin only)
const stats = async (req, res) => {
  if (req.user.userType !== 'ADMIN') {
    return res.status(403).json({ message: 'admin only' });
  }

  const usersCount = await User.countDocuments();
  const postsCount = await Post.countDocuments();
  const appsCount = await Application.countDocuments();

  res.json({ usersCount, postsCount, appsCount });
};


module.exports = {
  pendingApplications,
  listUsers,
  suspendUser,
  stats,
};
