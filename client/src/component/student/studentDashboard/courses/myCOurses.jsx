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
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ProgressBar from "@ramonak/react-progress-bar";

const MyCourses = ({ setActiveView }) => {
  const navigate = useNavigate();
  const [myCourses, setMyCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    // Simulate loading from localStorage
    setTimeout(() => {
      const savedCourses = JSON.parse(localStorage.getItem("myCourses")) || [];
      setMyCourses(savedCourses);
      setLoading(false);
    }, 500);
  }, []);

  const filteredCourses =
    activeTab === "all"
      ? myCourses
      : myCourses.filter((course) => course.type === activeTab);

  const getCompletionPercentage = (courseId) => {
    // Simulate progress - in a real app this would come from backend
    return Math.floor(Math.random() * 100);
  };

  const continueLearning = (courseId) => {
    navigate(`/learn/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Header */}
      <header className="bg-white py-6 px-4 sm:px-6 lg:px-8 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            My Learning
          </h1>
          <button
            onClick={() => setActiveView("courses")}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
          >
            Browse Courses
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600 mr-3">
                <FiBookOpen size={20} />
              </div>
              <div>
                <div className="text-gray-500 text-sm">Total Courses</div>
                <div className="text-xl font-bold">{myCourses.length}</div>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-3">
                <FiCheckCircle size={20} />
              </div>
              <div>
                <div className="text-gray-500 text-sm">Completed</div>
                <div className="text-xl font-bold">
                  {
                    myCourses.filter(
                      (c) => getCompletionPercentage(c.id) === 100
                    ).length
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-3">
                <FiClock size={20} />
              </div>
              <div>
                <div className="text-gray-500 text-sm">In Progress</div>
                <div className="text-xl font-bold">
                  {
                    myCourses.filter(
                      (c) =>
                        getCompletionPercentage(c.id) > 0 &&
                        getCompletionPercentage(c.id) < 100
                    ).length
                  }
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-3">
                <FiAward size={20} />
              </div>
              <div>
                <div className="text-gray-500 text-sm">Certificates</div>
                <div className="text-xl font-bold">
                  {
                    myCourses.filter(
                      (c) => getCompletionPercentage(c.id) === 100
                    ).length
                  }
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "all"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All Courses
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "free"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("free")}
          >
            Free Courses
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm ${
              activeTab === "premium"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("premium")}
          >
            Premium Courses
          </button>
        </div>

        {/* Courses List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 animate-pulse"
              >
                <div className="flex">
                  <div className="w-32 h-24 bg-gray-200 rounded-lg mr-4"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="space-y-4">
            {filteredCourses.map((course) => {
              const progress = getCompletionPercentage(course.id);
              return (
                <motion.div
                  key={course.id}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-48 h-32 rounded-lg overflow-hidden mb-4 md:mb-0 md:mr-6">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold">{course.title}</h3>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            course.price === 0
                              ? "bg-green-100 text-green-800"
                              : "bg-purple-100 text-purple-800"
                          }`}
                        >
                          {course.price === 0 ? "FREE" : "PREMIUM"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {course.description}
                      </p>

                      <div className="flex items-center text-xs text-gray-500 mb-3 space-x-4">
                        <span className="flex items-center">
                          <FiBarChart2 className="mr-1" /> {course.level}
                        </span>
                        <span className="flex items-center">
                          <FiBookmark className="mr-1" /> {course.category}
                        </span>
                        <span className="flex items-center">
                          <FiClock className="mr-1" /> {course.duration}
                        </span>
                      </div>

                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Progress</span>
                          <span>{progress}%</span>
                        </div>
                        <ProgressBar
                          completed={progress}
                          bgColor={progress === 100 ? "#10B981" : "#3B82F6"}
                          height="8px"
                          isLabelVisible={false}
                          borderRadius="4px"
                        />
                      </div>

                      <div className="flex justify-between items-center">
                        <div className="flex items-center text-sm">
                          {progress === 100 ? (
                            <>
                              <FiCheckCircle className="text-green-500 mr-1" />
                              <span className="text-green-600">Completed</span>
                            </>
                          ) : progress > 0 ? (
                            <>
                              <FiClock className="text-blue-500 mr-1" />
                              <span className="text-blue-600">In Progress</span>
                            </>
                          ) : (
                            <>
                              <FiCalendar className="text-gray-500 mr-1" />
                              <span className="text-gray-600">Not Started</span>
                            </>
                          )}
                        </div>
                        <button
                          onClick={() => continueLearning(course.id)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium ${
                            progress === 100
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                          } transition-colors`}
                        >
                          {progress === 100
                            ? "View Certificate"
                            : "Continue Learning"}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-200">
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
            <button
              onClick={() => setActiveView("courses")}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Browse Courses
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyCourses;
