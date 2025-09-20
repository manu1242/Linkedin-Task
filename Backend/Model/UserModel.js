const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  Password: {
    type: String,
    required: true,
    min: 6,
    max: 20,
  },
  UserType: {
    type: String,
    enum: ["REGULAR_USER", "BUSINESS_OWNER", "IT_COMPANY", "ADMIN"],
    default: "REGULAR_USER",
  },
  Bio: {
    type: String,
  },
  Skills: [String],
  ProfileImage: {
    type: String,
  },
  businessApproved: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports=mongoose.model('User',UserSchema);
