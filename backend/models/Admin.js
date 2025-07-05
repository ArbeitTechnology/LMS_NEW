const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AdminSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    role: {
      type: String,
      enum: ["admin", "subadmin"],
      default: "subadmin"
    },
    status: {
      type: String,
      enum: ["active", "inactive", "suspended"],
      default: "inactive"
    },
    resetCode: String,
    resetCodeExpires: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", AdminSchema);
