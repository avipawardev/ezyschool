const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: String,
  userEmail: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  password: String,
  role: {
    type: String,
    index: true
  },
  bio: String,
  image: String,
  phoneNumber: String,
  address: String,
  socialLinks: {
    facebook: String,
    twitter: String,
    linkedin: String, // corrected spelling from previous thought if any
    instagram: String,
    github: String,
  },
  interests: [String],
  referralCode: {
    type: String,
    unique: true,
    sparse: true, // Allows null/undefined values to not conflict
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  deletedAt: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("User", UserSchema);
