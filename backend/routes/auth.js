const express = require("express");
const router = express.Router();
const {
  register,
  login,
  forgotPassword,
  resetPassword,
  getAdmin,
  verifyOtp,
  adminGet,
  createSubAdmin,
  deleteSubAdmin,
  listSubAdmins,
} = require("../controllers/auth");

const { authenticateToken, authorizeAdmin } = require("../middleware/auth");

router.get("/checkAdmin", getAdmin);
router.get("/admin", authenticateToken, adminGet);

// Admin-only routes
router.post("/subadmin", authenticateToken, authorizeAdmin, createSubAdmin);
router.delete(
  "/subadmin/:id",
  authenticateToken,
  authorizeAdmin,
  deleteSubAdmin
);
router.get("/subadmins", authenticateToken, authorizeAdmin, listSubAdmins);

// Public
router.post("/register", register);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp", verifyOtp);
router.post("/reset-password", resetPassword);

module.exports = router;
