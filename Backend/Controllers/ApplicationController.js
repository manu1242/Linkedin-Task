const Application = require("../Model/Application");

exports.submitApplication = async (req, res) => {
  try {
    const { businessName, businessType, documents } = req.body;
    const application = await Application.create({
      applicant: req.User._id,
      businessName,
      businessType,
      documents,
    });
    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMyApplicationStatus = async (req, res) => {
  try {
    const application = await Application.findOne({ applicant: req.User._id });
    if (!application) return res.status(404).json({ message: "Application not found" });
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getPendingApplications = async (req, res) => {
  try {
    const applications = await Application.find({ status: "Submitted" }).populate("applicant", "name email");
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.reviewApplication = async (req, res) => {
  try {
    const { status, adminNote } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.applicationId,
      { status, adminNote },
      { new: true }
    );
    if (!application) return res.status(404).json({ message: "Application not found" });
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
