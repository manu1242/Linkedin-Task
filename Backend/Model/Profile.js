const mongoose = require("mongoose");

const profile = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  headline: String,
  bio: String,
  Skills: [String],
  experience: [
    {
      title: String,
      company: String,
      from: Date,
      to: Date,
      current: Boolean,
      description: String,
    },
  ],
  businessInfo: {
    companyName: String,
    CompanyType: String,
    documents: [String],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Profile", profile);
