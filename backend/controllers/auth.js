require("dotenv").config();
const Admin = require("../models/Admin");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");

// JWT generator
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Admin dashboard fetch
exports.adminGet = async (req, res) => {
  try {
    const admin = await Admin.findById(req.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.status(200).json({
      username: admin.username,
      email: admin.email,
      role: admin.role,
      notifications: true,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// Admin registration (First admin only)
exports.getAdmin = async (req, res) => {
  try {
    const admin = await Admin.findOne();
    if (admin) {
      return res
        .status(200)
        .json({ success: true, message: "Admin exists", admin });
    }
    return res.status(404).json({ success: false, message: "No admin found" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Register admin
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.send({ success: false, message: "All fields required" });
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
      return res.send({ success: false, message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
      role: "admin",
    });

    await newAdmin.save();
    return res.send({ success: true, message: "Admin registered." });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

// Login (Admin & SubAdmin)
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email }).select("+password");
    if (!admin) return res.send({ success: false, message: "User not found." });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.send({ success: false, message: "Invalid credentials." });

    const token = generateToken(admin._id, admin.role);
    res.json({ success: true, token, admin });
  } catch (error) {
    res.status(401).json({ success: false, error: error.message });
  }
};

// SubAdmin creation (Admin only)
exports.createSubAdmin = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existing = await Admin.findOne({ email });
    if (existing)
      return res.status(400).json({ success: false, message: "Email in use." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const subAdmin = new Admin({
      username,
      email,
      password: hashedPassword,
      role: "subadmin",
    });

    await subAdmin.save();
    res.status(201).json({ success: true, message: "SubAdmin created." });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete SubAdmin (Admin only)
exports.deleteSubAdmin = async (req, res) => {
  try {
    const subAdmin = await Admin.findById(req.params.id);
    if (!subAdmin || subAdmin.role !== "subadmin") {
      return res
        .status(404)
        .json({ success: false, message: "SubAdmin not found." });
    }

    await Admin.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "SubAdmin deleted." });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// List SubAdmins
exports.listSubAdmins = async (req, res) => {
  try {
    const subadmins = await Admin.find({ role: "subadmin" }).select(
      "-password"
    );
    res.json({ success: true, subadmins });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Forgot Password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.send({ success: false, message: "User not found." });

    const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
    admin.resetCode = resetCode;
    admin.resetCodeExpires = Date.now() + 10 * 60 * 1000;
    await admin.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is: ${resetCode}`,
    });

    res.json({ success: true, message: "OTP sent." });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const admin = await Admin.findOne({
      email,
      resetCode: otp,
      resetCodeExpires: { $gt: Date.now() },
    });

    if (!admin)
      return res.send({ success: false, message: "Invalid/expired OTP" });
    res.json({ success: true, message: "OTP verified." });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    const admin = await Admin.findOne({
      email,
      resetCode: otp,
      resetCodeExpires: { $gt: Date.now() },
    });

    if (!admin) return res.send({ success: false, message: "Invalid OTP." });

    admin.password = await bcrypt.hash(newPassword, 10);
    admin.resetCode = undefined;
    admin.resetCodeExpires = undefined;
    await admin.save();

    res.json({ success: true, message: "Password reset successful." });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
