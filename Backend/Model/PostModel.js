const mongoose = reqiure("mongoose");

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
      enum: ["REGULAR_Update", "ACHIEVEMENT", "JOB_POSTING"],
      default: "General",
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
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
