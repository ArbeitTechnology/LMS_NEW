/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiEye,
  FiEyeOff,
  FiUser,
  FiMail,
  FiLock,
  FiPhone,
  FiCalendar,
  FiMapPin,
} from "react-icons/fi";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const StudentAuth = () => {
  // Auth mode state
  const [authMode, setAuthMode] = useState("register"); // 'register' or 'login'
  const navigate = useNavigate();

  // Registration form state
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
    date_of_birth: "",
    address: "",
  });

  const [files, setFiles] = useState({
    profile_photo: null,
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    full_name: "",
    phone: "",
  });

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [loginErrors, setLoginErrors] = useState({
    email: "",
    password: "",
  });

  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);

  // ========== REGISTRATION FUNCTIONS ==========
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "email":
        if (!value) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Invalid email format";
        break;
      case "password":
        if (!value) error = "Password is required";
        else if (value.length < 8) error = "Must be at least 8 characters";
        else if (!/\d/.test(value)) error = "Must contain a number";
        else if (!/[!@#$%^&*]/.test(value))
          error = "Must contain a special character";
        break;
      case "full_name":
        if (!value) error = "Full name is required";
        else if (value.trim().split(/\s+/).length < 2)
          error = "Must include first and last name";
        break;
      case "phone":
        if (!value) error = "Phone is required";
        else if (!/^\+[1-9]\d{1,14}$/.test(value))
          error = "Include country code (e.g., +880)";
        break;
      case "date_of_birth":
        if (value && !/^\d{2}\/\d{2}\/\d{4}$/.test(value))
          error = "Use DD/MM/YYYY format";
        break;
      default:
        break;
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
    return !error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) validateField(name, value);
  };

  const handleFileChange = (e) => {
    const { name } = e.target;
    const file = e.target.files[0];
    setFiles((prev) => ({ ...prev, [name]: file }));
  };

  const validateForm = () => {
    let isValid = true;
    isValid = validateField("email", form.email) && isValid;
    isValid = validateField("password", form.password) && isValid;
    isValid = validateField("full_name", form.full_name) && isValid;
    isValid = validateField("phone", form.phone) && isValid;
    return isValid;
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Registration successful", {
        style: {
          background: "#fff",
          color: "#000",
          border: "1px solid #e5e7eb",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        },
      });

      // Reset form and switch to login
      setForm({
        email: "",
        password: "",
        full_name: "",
        phone: "",
        date_of_birth: "",
        address: "",
      });
      setFiles({
        profile_photo: null,
      });
      setAuthMode("login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed", {
        style: {
          background: "#fff",
          color: "#000",
          border: "1px solid #e5e7eb",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========== LOGIN FUNCTIONS ==========
  const validateLoginField = (name, value) => {
    let error = "";

    switch (name) {
      case "email":
        if (!value) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          error = "Invalid email format";
        break;
      case "password":
        if (!value) error = "Password is required";
        break;
      default:
        break;
    }

    setLoginErrors((prev) => ({ ...prev, [name]: error }));
    return !error;
  };

  const handleLoginChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    setLoginForm((prev) => ({ ...prev, [name]: val }));
    if (loginErrors[name]) validateLoginField(name, val);
  };

  const validateLoginForm = () => {
    let isValid = true;
    isValid = validateLoginField("email", loginForm.email) && isValid;
    isValid = validateLoginField("password", loginForm.password) && isValid;
    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateLoginForm()) return;

    setIsLoginSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Login successful", {
        style: {
          background: "#fff",
          color: "#000",
          border: "1px solid #e5e7eb",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        },
      });

      // Navigate to dashboard
      navigate("/student/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed", {
        style: {
          background: "#fff",
          color: "#000",
          border: "1px solid #e5e7eb",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
        },
      });
    } finally {
      setIsLoginSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 flex items-center justify-center p-4"
    >
      <div className="w-full max-w-5xl mx-auto">
        {/* Auth Mode Buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setAuthMode("register")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors duration-300 ${
              authMode === "register"
                ? "bg-black text-white shadow-md"
                : "bg-white text-gray-600 hover:text-gray-800 border border-gray-300"
            }`}
          >
            Register
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setAuthMode("login")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors duration-300 ${
              authMode === "login"
                ? "bg-black text-white shadow-md"
                : "bg-white text-gray-600 hover:text-gray-800 border border-gray-300"
            }`}
          >
            Sign In
          </motion.button>
        </div>

        {/* Registration Form */}
        {authMode === "register" && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-8 border border-gray-200"
          >
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Student Registration
              </h2>
              <p className="text-gray-600">
                Please fill in all mandatory fields to complete your
                registration
              </p>
            </div>

            <form onSubmit={handleRegister}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FiMail className="mr-2 text-gray-500" /> Email *
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      onBlur={() => validateField("email", form.email)}
                      placeholder="student@example.com"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-black focus:border-gray-500`}
                    />
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-500"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FiLock className="mr-2 text-gray-500" /> Password *
                    </label>
                    <div className="relative">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        value={form.password}
                        onChange={handleChange}
                        onBlur={() => validateField("password", form.password)}
                        placeholder="At least 8 characters with 1 number & special char"
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.password ? "border-red-500" : "border-gray-300"
                        } focus:ring-2 focus:ring-black focus:border-gray-500 pr-10`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <FiEye /> : <FiEyeOff />}
                      </button>
                    </div>
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-500"
                      >
                        {errors.password}
                      </motion.p>
                    )}
                  </div>

                  {/* Full Name */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FiUser className="mr-2 text-gray-500" /> Full Name *
                    </label>
                    <input
                      name="full_name"
                      value={form.full_name}
                      onChange={handleChange}
                      onBlur={() => validateField("full_name", form.full_name)}
                      placeholder="First and Last name"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.full_name ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-black focus:border-gray-500`}
                    />
                    {errors.full_name && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-500"
                      >
                        {errors.full_name}
                      </motion.p>
                    )}
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Phone */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FiPhone className="mr-2 text-gray-500" /> Phone *
                    </label>
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      onBlur={() => validateField("phone", form.phone)}
                      placeholder="+8801912345678"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      } focus:ring-2 focus:ring-black focus:border-gray-500`}
                    />
                    {errors.phone && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-500"
                      >
                        {errors.phone}
                      </motion.p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FiCalendar className="mr-2 text-gray-500" /> Date of
                      Birth
                    </label>
                    <input
                      name="date_of_birth"
                      value={form.date_of_birth}
                      onChange={handleChange}
                      onBlur={() =>
                        validateField("date_of_birth", form.date_of_birth)
                      }
                      placeholder="DD/MM/YYYY"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.date_of_birth
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:ring-2 focus:ring-black focus:border-gray-500`}
                    />
                    {errors.date_of_birth && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-sm text-red-500"
                      >
                        {errors.date_of_birth}
                      </motion.p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="space-y-2">
                    <label className="flex items-center text-sm font-medium text-gray-700">
                      <FiMapPin className="mr-2 text-gray-500" /> Address
                    </label>
                    <textarea
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Your current address"
                      rows="2"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 "
                    />
                  </div>
                </div>
              </div>

              {/* Profile Photo Upload */}
              <div className="mt-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Profile Photo (JPG/PNG, max 2MB)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 min-h-[60px] text-center hover:bg-gray-50">
                    {files.profile_photo ? (
                      <div className="flex items-center justify-between">
                        <p className="text-gray-900 text-sm truncate max-w-[180px]">
                          {files.profile_photo.name}
                        </p>
                        <button
                          type="button"
                          onClick={() =>
                            setFiles((prev) => ({
                              ...prev,
                              profile_photo: null,
                            }))
                          }
                          className="text-gray-400 hover:text-red-500 ml-2 transition-colors duration-200"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <label className="block cursor-pointer">
                        <p className="text-gray-500 text-sm mb-1">
                          Click to upload photo
                        </p>
                        <p className="text-xs text-gray-400">JPG or PNG</p>
                        <input
                          type="file"
                          name="profile_photo"
                          onChange={handleFileChange}
                          className="hidden"
                          accept=".jpg,.jpeg,.png"
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-sm text-gray-500 mb-4">* Mandatory fields</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                    isSubmitting ? "bg-gray-600" : "bg-black hover:bg-gray-800"
                  } transition-all shadow-md flex items-center justify-center`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Registering...
                    </>
                  ) : (
                    "Register"
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Login Form */}
        {authMode === "login" && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 max-w-md mx-auto"
          >
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Student Sign In
              </h2>
              <p className="text-gray-600">
                Enter your credentials to access your dashboard
              </p>
            </div>

            <form onSubmit={handleLogin}>
              <div className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <FiMail className="mr-2 text-gray-500" /> Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    onBlur={() => validateLoginField("email", loginForm.email)}
                    placeholder="student@example.com"
                    className={`w-full px-4 py-3 rounded-lg border ${
                      loginErrors.email ? "border-red-500" : "border-gray-300"
                    } focus:ring-2 focus:ring-black focus:border-gray-500`}
                  />
                  {loginErrors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500"
                    >
                      {loginErrors.email}
                    </motion.p>
                  )}
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <FiLock className="mr-2 text-gray-500" /> Password *
                  </label>
                  <div className="relative">
                    <input
                      name="password"
                      type={showLoginPassword ? "text" : "password"}
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      onBlur={() =>
                        validateLoginField("password", loginForm.password)
                      }
                      placeholder="Enter your password"
                      className={`w-full px-4 py-3 rounded-lg border ${
                        loginErrors.password
                          ? "border-red-500"
                          : "border-gray-300"
                      } focus:ring-2 focus:ring-black focus:border-gray-500 pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword(!showLoginPassword)}
                      className="absolute right-3 top-3.5 text-gray-500 hover:text-gray-700"
                    >
                      {showLoginPassword ? <FiEye /> : <FiEyeOff />}
                    </button>
                  </div>
                  {loginErrors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm text-red-500"
                    >
                      {loginErrors.password}
                    </motion.p>
                  )}
                </div>

                {/* Remember & Forgot */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex items-center justify-between pt-2"
                >
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <div className="relative">
                      <input
                        id="remember"
                        name="remember"
                        type="checkbox"
                        checked={loginForm.remember}
                        onChange={handleLoginChange}
                        className="sr-only"
                      />
                      <div className="block">
                        <div
                          className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                            loginForm.remember ? "bg-black" : "bg-gray-300"
                          }`}
                        ></div>
                        <motion.div
                          className={`absolute top-0.5 left-0 w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${
                            loginForm.remember
                              ? "translate-x-1.5"
                              : "translate-x-0"
                          }`}
                          initial={false}
                          animate={{
                            x: loginForm.remember ? 20 : 3,
                            backgroundColor: loginForm.remember
                              ? "#ffffff"
                              : "#ffffff",
                          }}
                          style={{
                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                          }}
                        ></motion.div>
                      </div>
                    </div>
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>

                  <Link
                    to="/student/forgotPassword"
                    className="text-sm text-gray-600 hover:text-blue-500 transition-colors duration-200"
                  >
                    Forgot password?
                  </Link>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoginSubmitting}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
                    isLoginSubmitting
                      ? "bg-gray-600"
                      : "bg-black hover:bg-gray-800"
                  } transition-all shadow-md flex items-center justify-center`}
                >
                  {isLoginSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </motion.button>

                {/* Register Link */}
                <div className="text-center text-sm text-gray-600">
                  Don't have an account?{" "}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    type="button"
                    onClick={() => setAuthMode("register")}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Register here
                  </motion.button>
                </div>
              </div>
            </form>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default StudentAuth;
