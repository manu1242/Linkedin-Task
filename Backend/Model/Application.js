const mongoose = require("mongoose");
const ApplicationSchema = new Schema({
  applicant: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  businessName: String,
  businessType: String,
  documents: [Stringh],
  status: {
    type: String,
    enum: ["Submitted", "Pending", "Approved", "Rejected"],
    default: "Submitted",
  },
  adminNote: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Application", ApplicationSchema);
