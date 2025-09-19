const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    Author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
    },
    images: [String],
    PostType: {
      type: String,
      enum: ["GENERAL", "BUSINESS_UPDATE", "ACHIEVEMENT", "JOB_POSTING"],
      default: "GENERAL",
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        User: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    shares: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("post", PostSchema);
