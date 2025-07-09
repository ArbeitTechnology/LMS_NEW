/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
  FiEdit2,
  FiSave,
  FiX,
  FiLock,
  FiEye,
  FiEyeOff,
  FiPhone,
  FiCalendar,
  FiMapPin,
} from "react-icons/fi";
import axios from "axios";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const Settings = () => {
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    address: "",
    profile_photo: null,
  });
  const [editMode, setEditMode] = useState({
    full_name: false,
    email: false,
    phone: false,
    date_of_birth: false,
    address: false,
  });
  const [tempProfile, setTempProfile] = useState({});
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch profile data when the component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found");

        const response = await axios.get(
          "http://localhost:3500/api/auth/student",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProfile({
          full_name: response.data.full_name || "Student User",
          email: response.data.email || "student@example.com",
          phone: response.data.phone || "",
          date_of_birth: response.data.date_of_birth || "",
          address: response.data.address || "",
          profile_photo: response.data.profile_photo || null,
        });
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        toast.error("Failed to load profile data");
      }
    };

    fetchProfile();
  }, []);

  // Handle edit toggle
  const handleEditToggle = (field) => {
    if (editMode[field]) {
      setEditMode({ ...editMode, [field]: false });
    } else {
      setTempProfile({ ...profile });
      setEditMode({ ...editMode, [field]: true });
    }
  };

  // Handle profile field changes
  const handleProfileChange = (e, field) => {
    const value = e.target.value;
    if (field === "email") {
      // Convert email to lowercase if the field is email
      setTempProfile({ ...tempProfile, [field]: value.toLowerCase() });
    } else {
      setTempProfile({ ...tempProfile, [field]: value });
    }
  };

  // Save updated profile fields
  const saveProfile = async (field) => {
    if (!tempProfile[field] || tempProfile[field] === profile[field]) {
      setEditMode({ ...editMode, [field]: false });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "http://localhost:3500/api/auth/update-student-profile",
        { [field]: tempProfile[field] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfile({ ...profile, [field]: tempProfile[field] });
      setEditMode({ ...editMode, [field]: false });
      toast.success(
        `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } updated successfully!`
      );
    } catch (err) {
      console.error("Failed to update profile:", err);
      toast.error(`Failed to update ${field}`);
    }
  };

  // Handle password change
  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  // Toggle password visibility
  const togglePasswordVisibility = (field) => {
    switch (field) {
      case "current":
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case "new":
        setShowNewPassword(!showNewPassword);
        break;
      case "confirm":
        setShowConfirmPassword(!showConfirmPassword);
        break;
      default:
        break;
    }
  };

  // Submit new password
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        "http://localhost:3500/api/auth/change-student-password",
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Password changed successfully!");
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordChange(false);
    } catch (err) {
      console.error("Failed to change password:", err);
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  // Handle profile photo change
  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setProfile({
        ...profile,
        profile_photo: reader.result,
      });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-6"
      >
        {/* Header */}
        <div className="w-full mb-8 pb-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 text-left">
            Account Settings
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your profile and security settings
          </p>
        </div>

        {/* Profile Section */}
        <div className="p-2">
          <div className="flex items-center mb-8 ">
            <div className="relative mx-auto">
              <img
                src={profile.profile_photo || "https://via.placeholder.com/150"}
                alt="Profile"
                className="w-30 h-30 rounded-full object-cover border-2 border-gray-300"
              />
              <button
                onClick={() => document.getElementById("fileInput").click()}
                className="absolute bottom-0 right-0 p-2 bg-gray-700 text-white rounded-full"
              >
                <FiEdit2 size={16} />
              </button>
              <input
                type="file"
                id="fileInput"
                onChange={handleProfilePhotoChange}
                className="hidden"
                accept="image/*"
              />
            </div>
            <div className="ml-6">
              <h2 className="text-xl font-semibold text-gray-800">
                {profile.full_name}
              </h2>
              <p className="text-gray-600">{profile.email}</p>
            </div>
          </div>

          <div className="space-y-6 p-4">
            {/* Full Name Field */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                {editMode.full_name ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => saveProfile("full_name")}
                      className="p-1.5 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                    >
                      <FiSave size={16} />
                    </button>
                    <button
                      onClick={() => handleEditToggle("full_name")}
                      className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditToggle("full_name")}
                    className="p-1.5 rounded-full bg-gray-700 text-gray-100 hover:bg-black transition-colors"
                  >
                    <FiEdit2 size={16} />
                  </button>
                )}
              </div>
              {editMode.full_name ? (
                <input
                  type="text"
                  value={tempProfile.full_name || ""}
                  onChange={(e) => handleProfileChange(e, "full_name")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-500 "
                />
              ) : (
                <p className="text-lg font-medium text-gray-800">
                  {profile.full_name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-500">Email</h3>
                {editMode.email ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => saveProfile("email")}
                      className="p-1.5 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                    >
                      <FiSave size={16} />
                    </button>
                    <button
                      onClick={() => handleEditToggle("email")}
                      className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditToggle("email")}
                    className="p-1.5 rounded-full bg-gray-700 text-gray-100 hover:bg-black transition-colors"
                  >
                    <FiEdit2 size={16} />
                  </button>
                )}
              </div>
              {editMode.email ? (
                <input
                  type="email"
                  value={tempProfile.email || ""}
                  onChange={(e) => handleProfileChange(e, "email")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-500 "
                />
              ) : (
                <p className="text-lg font-medium text-gray-800">
                  {profile.email}
                </p>
              )}
            </div>

            {/* Phone Field */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-500 flex items-center">
                  <FiPhone className="mr-2" size={14} />
                  Phone
                </h3>
                {editMode.phone ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => saveProfile("phone")}
                      className="p-1.5 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                    >
                      <FiSave size={16} />
                    </button>
                    <button
                      onClick={() => handleEditToggle("phone")}
                      className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditToggle("phone")}
                    className="p-1.5 rounded-full bg-gray-700 text-gray-100 hover:bg-black transition-colors"
                  >
                    <FiEdit2 size={16} />
                  </button>
                )}
              </div>
              {editMode.phone ? (
                <input
                  type="tel"
                  value={tempProfile.phone || ""}
                  onChange={(e) => handleProfileChange(e, "phone")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-500 "
                  placeholder="Enter phone number"
                />
              ) : (
                <p className="text-lg font-medium text-gray-800">
                  {profile.phone || "Not provided"}
                </p>
              )}
            </div>

            {/* Date of Birth Field */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-500 flex items-center">
                  <FiCalendar className="mr-2" size={14} />
                  Date of Birth
                </h3>
                {editMode.date_of_birth ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => saveProfile("date_of_birth")}
                      className="p-1.5 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                    >
                      <FiSave size={16} />
                    </button>
                    <button
                      onClick={() => handleEditToggle("date_of_birth")}
                      className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditToggle("date_of_birth")}
                    className="p-1.5 rounded-full bg-gray-700 text-gray-100 hover:bg-black transition-colors"
                  >
                    <FiEdit2 size={16} />
                  </button>
                )}
              </div>
              {editMode.date_of_birth ? (
                <input
                  type="date"
                  value={tempProfile.date_of_birth || ""}
                  onChange={(e) => handleProfileChange(e, "date_of_birth")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-500 "
                />
              ) : (
                <p className="text-lg font-medium text-gray-800">
                  {profile.date_of_birth || "Not provided"}
                </p>
              )}
            </div>

            {/* Address Field */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-medium text-gray-500 flex items-center">
                  <FiMapPin className="mr-2" size={14} />
                  Address
                </h3>
                {editMode.address ? (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => saveProfile("address")}
                      className="p-1.5 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                    >
                      <FiSave size={16} />
                    </button>
                    <button
                      onClick={() => handleEditToggle("address")}
                      className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                    >
                      <FiX size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEditToggle("address")}
                    className="p-1.5 rounded-full bg-gray-700 text-gray-100 hover:bg-black transition-colors"
                  >
                    <FiEdit2 size={16} />
                  </button>
                )}
              </div>
              {editMode.address ? (
                <textarea
                  value={tempProfile.address || ""}
                  onChange={(e) => handleProfileChange(e, "address")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  rows={3}
                  placeholder="Enter your full address"
                />
              ) : (
                <p className="text-lg font-medium text-gray-800">
                  {profile.address || "Not provided"}
                </p>
              )}
            </div>
          </div>

          {/* Password Change Section */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-sm font-medium text-gray-500">Password</h3>
              <button
                onClick={() => setShowPasswordChange(!showPasswordChange)}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <FiLock className="mr-1" size={14} />
                {showPasswordChange ? "Hide" : "Change Password"}
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              {showPasswordChange
                ? "Enter your current and new password"
                : "Last changed 3 months ago"}
            </p>

            <AnimatePresence>
              {showPasswordChange && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <form
                    onSubmit={handlePasswordSubmit}
                    className="space-y-4 mt-4"
                  >
                    {/* Current Password */}
                    <div>
                      <label
                        htmlFor="currentPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          id="currentPassword"
                          name="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-500 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("current")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showCurrentPassword ? (
                            <FiEye size={18} />
                          ) : (
                            <FiEyeOff size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label
                        htmlFor="newPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        New Password
                      </label>
                      <div className="relative">
                        <input
                          id="newPassword"
                          name="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          required
                          minLength="6"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-500  pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("new")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showNewPassword ? (
                            <FiEye size={18} />
                          ) : (
                            <FiEyeOff size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input
                          id="confirmPassword"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-gray-500  pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility("confirm")}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showConfirmPassword ? (
                            <FiEye size={18} />
                          ) : (
                            <FiEyeOff size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-end space-x-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowPasswordChange(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-200 hover:text-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {loading ? "Updating..." : "Update Password"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
