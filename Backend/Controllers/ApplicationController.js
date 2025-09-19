const Application = require('../Model/Application');
const User = require('../Model/UserModel');

// Submit a new business application
const submitApplication = async (req, res) => {
  try {
    const files = (req.files || []).map(f => `/uploads/${f.filename}`);
    const { businessName, businessType } = req.body;

    const app = await Application.create({
      applicant: req.user._id,
      businessName,
      businessType,
      documents: files,
      status: 'SUBMITTED'
    });

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all applications submitted by the current user
const myApplications = async (req, res) => {
  try {
    const apps = await Application.find({ applicant: req.user._id });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Get all pending or submitted applications
const pendingApplications = async (req, res) => {
  try {
    if (req.user.userType !== 'ADMIN') {
      return res.status(403).json({ message: 'admin only' });
    }

    const apps = await Application.find({
      status: { $in: ['SUBMITTED', 'PENDING'] }
    }).populate('applicant', 'name email');

    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Admin: Review and approve/reject application
const reviewApplication = async (req, res) => {
  try {
    if (req.user.userType !== 'ADMIN') {
      return res.status(403).json({ message: 'admin only' });
    }

    const { action, adminNote } = req.body; // 'APPROVE' or 'REJECT'
    const app = await Application.findById(req.params.applicationId).populate('applicant');

    if (!app) return res.status(404).json({ message: 'not found' });

    if (action === 'APPROVE') {
      app.status = 'APPROVED';
      await User.findByIdAndUpdate(app.applicant._id, {
        businessApproved: true,
        userType: app.applicant.userType
      });
    } else {
      app.status = 'REJECTED';
    }

    app.adminNote = adminNote;
    await app.save();

    res.json(app);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Export all controller functions
module.exports = {
  submitApplication,
  myApplications,
  pendingApplications,
  reviewApplication
};
