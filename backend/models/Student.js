const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const studentSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      validate: {
        validator: function(v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Invalid email format'
      }
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      validate: {
        validator: function(v) {
          return /\d/.test(v) && /[!@#$%^&*]/.test(v);
        },
        message: 'Password must contain at least one number and one special character'
      },
      select: false,
    },
    full_name: {
      type: String,
      required: [true, 'Full name is required'],
      validate: {
        validator: function(v) {
          return v.trim().split(/\s+/).length >= 2;
        },
        message: 'Must include first and last name'
      }
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      validate: {
        validator: function(v) {
          return /^\+[1-9]\d{1,14}$/.test(v);
        },
        message: 'Include country code (e.g., +880)'
      }
    },
    date_of_birth: {
      type: Date,
      validate: {
        validator: function(v) {
          if (!v) return true;
          return v instanceof Date && !isNaN(v);
        },
        message: 'Invalid date format'
      }
    },
    address: {
      type: String,
    },
    profile_photo: {
      type: String,
    },
    role: {
      type: String,
      enum: ['student'],
      default: 'student',
    },
    last_login: {
      type: Date,
    },
    password_changed_at: {
      type: Date,
    },
    password_reset_token: {
      type: String,
    },
    password_reset_expires: {
      type: Date,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    is_active: {
      type: String,
      enum: ["active", "inactive"],
      default: "inactive"
    },
    resetCode: {
    type: String,
  },
  resetCodeExpires: {
    type: Date,
  },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Password hashing middleware
studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.password_changed_at = Date.now() - 1000; // Ensures token is created after password change
  next();
});

// Method to compare passwords
studentSchema.methods.correctPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if password was changed after token was issued
studentSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.password_changed_at) {
    const changedTimestamp = parseInt(this.password_changed_at.getTime() / 1000, 10);
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Method to create password reset token
studentSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.password_reset_token = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.password_reset_expires = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;