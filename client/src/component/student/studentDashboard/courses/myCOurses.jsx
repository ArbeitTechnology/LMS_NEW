/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiAward,
  FiBarChart2,
  FiBookmark,
  FiCalendar,
  FiX,
  FiPlay,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import ProgressBar from "@ramonak/react-progress-bar";
import axios from "axios"; // Import axios

const MyCourses = ({ setActiveView }) => {
  const navigate = useNavigate();
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  // API Configuration
  const API_BASE_URL = "https://your-api-endpoint.com/api"; // Replace with your API base URL
  const getAuthHeaders = () => {
    const token = localStorage.getItem("authToken"); // Assuming you store auth token
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // Fetch user's courses from API
  const fetchUserCourses = async () => {
    try {
      setLoading(true);
      /*
      // API Call Example:
      const response = await axios.get(
        `${API_BASE_URL}/user/courses`,
        getAuthHeaders()
      );
      const coursesWithProgress = response.data.map(course => ({
        ...course,
        progress: course.progress || 0,
        lastAccessed: course.lastAccessed || null
      }));
      setMyCourses(coursesWithProgress);
      */

      // For now, using localStorage as fallback
      const savedCourses = JSON.parse(localStorage.getItem("myCourses")) || [];
      const uniqueCourses = Array.from(
        new Set(savedCourses.map((c) => c.id))
      ).map((id) => {
        const course = savedCourses.find((c) => c.id === id);
        return {
          ...course,
          progress: course.progress || 0,
          lastAccessed: course.lastAccessed || null,
        };
      });
      setMyCourses(uniqueCourses);
    } catch (error) {
      toast.error("Failed to load courses");
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserCourses();
    window.addEventListener("storage", fetchUserCourses);

    return () => {
      window.removeEventListener("storage", fetchUserCourses);
    };
  }, []);

  const filteredCourses =
    activeTab === "all"
      ? myCourses
      : myCourses.filter((course) =>
          activeTab === "free" ? course.price === 0 : course.price > 0
        );

  // API call to remove course
  const removeCourse = async (courseId) => {
    try {
      /*
      // API Call Example:
      await axios.delete(
        `${API_BASE_URL}/user/courses/${courseId}`,
        getAuthHeaders()
      );
      */

      // Fallback to localStorage
      const updatedCourses = myCourses.filter(
        (course) => course.id !== courseId
      );
      setMyCourses(updatedCourses);
      localStorage.setItem("myCourses", JSON.stringify(updatedCourses));
      toast.success("Course removed from your learning");
    } catch (error) {
      toast.error("Failed to remove course");
      console.error("Error removing course:", error);
    }
  };

  // API call to update progress
  const continueLearning = async (courseId) => {
    try {
      const updatedCourses = myCourses.map((course) => {
        if (course.id === courseId) {
          const newProgress =
            course.progress === 0 ? 10 : Math.min(course.progress + 10, 100);
          return {
            ...course,
            progress: newProgress,
            lastAccessed: new Date().toISOString(),
          };
        }
        return course;
      });

      /*
      // API Call Example to update progress:
      await axios.patch(
        `${API_BASE_URL}/user/courses/${courseId}/progress`,
        { 
          progress: updatedCourses.find(c => c.id === courseId).progress,
          lastAccessed: new Date().toISOString()
        },
        getAuthHeaders()
      );
      */

      // Fallback to localStorage
      setMyCourses(updatedCourses);
      localStorage.setItem("myCourses", JSON.stringify(updatedCourses));
      navigate(`/learn/${courseId}`);
    } catch (error) {
      toast.error("Failed to update progress");
      console.error("Error updating course progress:", error);
    }
  };

  return (
    <div className="min-h-screen text-gray-900">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="bg-white py-6 px-4 sm:px-6 lg:px-8 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-black">My Courses</h1>
            <p className="text-sm text-gray-500 mt-1">
              Track your learning progress and achievements
            </p>
          </div>
          <button
            onClick={() => setActiveView("courseList")}
            className="px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg hover:from-gray-800 hover:to-gray-900 transition-all shadow-md flex items-center"
          >
            <FiBookOpen className="mr-2" />
            Browse Courses
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-3">
                <FiBookOpen size={20} />
              </div>
              <div>
                <div className="text-gray-500 text-sm">Total Courses</div>
                <div className="text-2xl font-bold text-gray-800">
                  {myCourses.length}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-3">
                <FiCheckCircle size={20} />
              </div>
              <div>
                <div className="text-gray-500 text-sm">Completed</div>
                <div className="text-2xl font-bold text-gray-800">
                  {myCourses.filter((c) => c.progress === 100).length}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-3">
                <FiClock size={20} />
              </div>
              <div>
                <div className="text-gray-500 text-sm">In Progress</div>
                <div className="text-2xl font-bold text-gray-800">
                  {
                    myCourses.filter((c) => c.progress > 0 && c.progress < 100)
                      .length
                  }
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all"
          >
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-3">
                <FiAward size={20} />
              </div>
              <div>
                <div className="text-gray-500 text-sm">Certificates</div>
                <div className="text-2xl font-bold text-gray-800">
                  {myCourses.filter((c) => c.progress === 100).length}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "all"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All Courses
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "free"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("free")}
          >
            Free Courses
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "premium"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("premium")}
          >
            Paid Courses
          </motion.button>
        </div>

        {/* Courses List - Updated to 2 columns */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              >
                <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"></div>
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCourses.map((course) => (
              <motion.div
                key={course.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <div className="relative">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 text-xs rounded-full font-medium">
                    {course.price === 0 ? "FREE" : `৳ ${course.price}`}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                      {course.title}
                    </h3>
                    <button
                      onClick={() => removeCourse(course.id)}
                      className="text-gray-400 hover:text-red-500 p-1 -mt-1 -mr-1"
                    >
                      <FiX size={18} />
                    </button>
                  </div>

                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {course.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full flex items-center">
                      <FiClock className="mr-1" size={12} />
                      {course.duration}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span className="font-medium">
                        {course.progress === 0
                          ? "Not Started"
                          : `${course.progress}%`}
                      </span>
                    </div>
                    {course.progress > 0 && (
                      <ProgressBar
                        completed={course.progress}
                        bgColor={
                          course.progress === 100 ? "#10B981" : "#3B82F6"
                        }
                        height="6px"
                        isLabelVisible={false}
                        borderRadius="3px"
                        className="shadow-inner"
                      />
                    )}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm">
                      {course.progress === 100 ? (
                        <span className="flex items-center text-green-600">
                          <FiCheckCircle className="mr-1" />
                          Completed
                        </span>
                      ) : course.progress > 0 ? (
                        <span className="flex items-center text-blue-600">
                          <FiClock className="mr-1" />
                          In Progress
                        </span>
                      ) : (
                        <span className="flex items-center text-gray-500">
                          <FiCalendar className="mr-1" />
                          Not Started
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => continueLearning(course.id)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center ${
                        course.progress === 100
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                      } transition-colors`}
                    >
                      {course.progress === 100 ? (
                        <>
                          <FiAward className="mr-1" />
                          Certificate
                        </>
                      ) : (
                        <>
                          <FiPlay className="mr-1" />
                          {course.progress === 0 ? "Start" : "Continue"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200"
          >
            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-6">
              <FiBookOpen className="text-gray-400 text-4xl" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {activeTab === "all"
                ? "You haven't enrolled in any courses yet"
                : activeTab === "free"
                ? "No free courses enrolled"
                : "No premium courses enrolled"}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              {activeTab === "all"
                ? "Browse our courses and start learning today!"
                : activeTab === "free"
                ? "Explore our free courses to start learning without any cost."
                : "Check out our premium courses for advanced learning experiences."}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveView("courseList")}
              className="px-6 py-2 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-lg shadow-md hover:from-gray-800 hover:to-gray-900 transition-all"
            >
              Browse Courses
            </motion.button>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default MyCourses;
