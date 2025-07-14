const express = require("express");
const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const Studnetauth = express.Router();

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Generate JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "10d",
  });
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Verify Your Student Account",
    text: `Your OTP for account verification is: ${otp}\nThis OTP will expire in 10 minutes.`,
    html: `
      <div>
        <h3>Account Verification</h3>
        <p>Your OTP for account verification is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 10 minutes.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Send password reset email
const sendPasswordResetEmail = async (email, resetURL) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Your Password Reset Token (Valid for 10 min)",
    text: `Forgot your password? Submit a PATCH request with your new password to: ${resetURL}\nIf you didn't forget your password, please ignore this email!`,
    html: `
      <div>
        <h3>Password Reset Request</h3>
        <p>Forgot your password? Click the link below to reset it:</p>
        <a href="${resetURL}">${resetURL}</a>
        <p>This link will expire in 10 minutes.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// Student Registration
Studnetauth.post("/register", async (req, res) => {
  try {
    const { email, password, full_name, phone } = req.body;
    console.log(req.body)
    // Check if student already exists
    const existingStudent = await Student.findOne({ email:req.body.email });
    if (existingStudent) {
      return res.status(400).json({
        status: "fail",
        message: "Student already exists with this email",
      });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Create new student (not verified yet)
    const newStudent = await Student.create({
      email,
      password,
      full_name,
      phone,
      otp,
      otpExpires,
      is_active: "inactive",
    });

    // Send OTP email
    await sendOTPEmail(email, otp);

    // Don't send password in response
    newStudent.password = undefined;

    res.status(201).json({
      status: "success",
      message: "OTP sent to your email for verification",
      data: {
        student: newStudent,
      },
    });
  } catch (err) {
    console.log(err)
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
});

// Verify OTP
Studnetauth.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find student with this email and OTP
    const student = await Student.findOne({
      email,
      otp,
      otpExpires: { $gt: Date.now() },
    });

    if (!student) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid OTP or OTP expired",
      });
    }

    // Mark as verified
    student.is_active = "active";
    student.otp = undefined;
    student.otpExpires = undefined;
    await student.save({ validateBeforeSave: false });

    // Generate JWT token
    const token = signToken(student._id);

    res.status(200).json({
      status: "success",
      message: "Account verified successfully",
      token,
      data: {
        student,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
});

// Student Login
Studnetauth.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: "fail",
        message: "Please provide email and password",
      });
    }

    const student = await Student.findOne({ email }).select("+password");

    if (!student || !(await student.correctPassword(password))) {
      return res.status(401).json({
        status: "fail",
        message: "Incorrect email or password",
      });
    }

    if (student.is_active !== "active") {
      return res.status(401).json({
        status: "fail",
        message: "Account not verified. Please verify your email first.",
      });
    }

    const token = signToken(student._id);

    student.last_login = Date.now();
    await student.save({ validateBeforeSave: false });

    student.password = undefined;

    res.status(200).json({
      status: "success",
      token,
      data: {
        student,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
});

// Student Forget Password
Studnetauth.post("/student-forget-password", async (req, res) => {
  const { email } = req.body;

  try {
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "If this email is registered, you'll receive a reset OTP.",
      });
    }

    const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
    student.resetCode = resetCode;
    student.resetCodeExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await student.save();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Student Portal Password Reset OTP",
      text: `Your password reset OTP is: ${resetCode}\nThis code will expire in 10 minutes.`,
      html: `
        <div>
          <h3>Student Portal Password Reset</h3>
          <p>Your password reset OTP is: <strong>${resetCode}</strong></p>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `,
    });

    res.json({
      success: true,
      message: "OTP sent to registered email.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      error: "Could not process request. Please try again.",
    });
  }
});

// Student Verify OTP
Studnetauth.post("/student-verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const student = await Student.findOne({
      email,
      resetCode: otp,
      resetCodeExpires: { $gt: Date.now() },
    });

    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP. Please request a new one.",
      });
    }

    res.json({
      success: true,
      message: "OTP verified successfully.",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      success: false,
      error: "Could not verify OTP. Please try again.",
    });
  }
});

// Student Reset Password
Studnetauth.post("/student-reset-password", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // Find student with valid OTP
    const student = await Student.findOne({
      email,
      resetCode: otp,
      resetCodeExpires: { $gt: Date.now() },
    });

    if (!student) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid or expired OTP. Please start the reset process again.",
      });
    }

    // Validate new password
    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    if (!/\d/.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least one number",
      });
    }

    if (!/[!@#$%^&*]/.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: "Password must contain at least one special character",
      });
    }

    // Hash and save new password
    student.password = await bcrypt.hash(newPassword, 12);
    student.resetCode = undefined;
    student.resetCodeExpires = undefined;
    await student.save();

    // Send confirmation email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your Password Has Been Reset",
      text: "Your student portal password has been successfully reset.",
      html: `
        <div>
          <h3>Password Reset Confirmation</h3>
          <p>Your student portal password has been successfully reset.</p>
        </div>
      `,
    });

    res.json({
      success: true,
      message:
        "Password reset successful. You can now login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({
      success: false,
      error: "Could not reset password. Please try again.",
    });
  }
});

module.exports = Studnetauth;
