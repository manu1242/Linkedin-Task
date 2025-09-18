const mongoose = requires("mongoose");

const ConnectionSchema = new Schema({
  requestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  recipientid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  status: {
    type: String,
    enum: ["PENDING", "ACCEPTED", "DECLINED"],
    default: "PENDING",
  },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("Connection", ConnectionSchema);
