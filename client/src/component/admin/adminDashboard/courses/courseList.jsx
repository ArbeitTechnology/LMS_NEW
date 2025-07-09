/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiUser, FiSearch, FiFilter } from "react-icons/fi";
import { motion } from "framer-motion";

// Demo data - replace with API calls in production
const demoCourses = [
  {
    id: 1,
    title: "Introduction to React",
    description: "Learn the fundamentals of React.js",
    thumbnail: "https://via.placeholder.com/150",
    price: 49.99,
    type: "premium",
    teacher: { id: 1, name: "John Doe" },
    students: 125,
    createdAt: "2023-05-15",
  },
  {
    id: 2,
    title: "Advanced JavaScript",
    description: "Master advanced JavaScript concepts",
    thumbnail: "https://via.placeholder.com/150",
    price: 0,
    type: "free",
    teacher: { id: 2, name: "Jane Smith" },
    students: 89,
    createdAt: "2023-06-20",
  },
  {
    id: 3,
    title: "UI/UX Design Principles",
    description: "Learn modern UI/UX design techniques",
    thumbnail: "https://via.placeholder.com/150",
    price: 79.99,
    type: "premium",
    teacher: { id: 3, name: "Alex Johnson" },
    students: 64,
    createdAt: "2023-07-10",
  },
];

const demoTeachers = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Alex Johnson" },
  { id: 4, name: "Sarah Williams" },
  { id: 5, name: "Michael Brown" },
];

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [editingCourse, setEditingCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load demo data - replace with API calls
  useEffect(() => {
    // Simulate API loading
    const timer = setTimeout(() => {
      setCourses(demoCourses);
      setTeachers(demoTeachers);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Filter courses based on search and filter
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || course.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Handle assigning teacher to course
  const assignTeacher = (courseId, teacherId) => {
    // In a real app, you would make an API call here
    // Example: await axios.patch(`/api/courses/${courseId}`, { teacherId });

    setCourses(
      courses.map((course) => {
        if (course.id === courseId) {
          const teacher = teachers.find((t) => t.id === teacherId);
          return { ...course, teacher };
        }
        return course;
      })
    );
  };

  // Handle deleting a course
  const deleteCourse = (courseId) => {
    // In a real app, you would make an API call here
    // Example: await axios.delete(`/api/courses/${courseId}`);

    setCourses(courses.filter((course) => course.id !== courseId));
  };

  // Handle starting course edit
  const startEdit = (course) => {
    setEditingCourse(course);
  };

  // Handle saving edited course
  const saveEdit = () => {
    // In a real app, you would make an API call here
    // Example: await axios.put(`/api/courses/${editingCourse.id}`, editingCourse);

    setCourses(
      courses.map((course) =>
        course.id === editingCourse.id ? editingCourse : course
      )
    );
    setEditingCourse(null);
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-15 w-15 border-b-4 border-l-gray-900 border-solid"></div>
          <p className="mt-2 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  p-2">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Course Management
          </h1>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search courses..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <FiFilter className="text-gray-600" />
            <select
              className="border border-gray-300 rounded-lg px-3 py-2  focus:border-gray-500"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All Courses</option>
              <option value="free">Free Courses</option>
              <option value="premium">Premium Courses</option>
            </select>
          </div>
        </div>

        {/* Course List */}
        <div className="space-y-6">
          {filteredCourses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                No courses found matching your criteria
              </p>
            </div>
          ) : (
            filteredCourses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Course Thumbnail */}
                    <div className="w-full md:w-48 h-32 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Course Details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">
                            {course.title}
                          </h2>
                          <p className="text-gray-600 mt-1">
                            {course.description}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => startEdit(course)}
                            className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            onClick={() => deleteCourse(course.id)}
                            className="text-gray-600 hover:text-red-500 p-2 rounded-full hover:bg-gray-100"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-4 items-center">
                        <div className="flex items-center">
                          <FiUser className="text-gray-500 mr-2" />
                          <select
                            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:border-gray-500"
                            value={course.teacher?.id || ""}
                            onChange={(e) =>
                              assignTeacher(course.id, parseInt(e.target.value))
                            }
                          >
                            <option value="">Select Teacher</option>
                            {teachers.map((teacher) => (
                              <option key={teacher.id} value={teacher.id}>
                                {teacher.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="text-sm text-gray-500">
                          {course.type === "premium" ? (
                            <span className="font-medium text-green-600">
                              ${course.price}
                            </span>
                          ) : (
                            <span className="font-medium text-blue-600">
                              Free
                            </span>
                          )}
                        </div>

                        <div className="text-sm text-gray-500">
                          {course.students} students
                        </div>

                        <div className="text-sm text-gray-500">
                          Created:{" "}
                          {new Date(course.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Edit Modal */}
        {editingCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl p-6 w-full max-w-2xl"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Edit Course
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    value={editingCourse.title}
                    onChange={(e) =>
                      setEditingCourse({
                        ...editingCourse,
                        title: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    rows="3"
                    value={editingCourse.description}
                    onChange={(e) =>
                      setEditingCourse({
                        ...editingCourse,
                        description: e.target.value,
                      })
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    value={editingCourse.price}
                    onChange={(e) =>
                      setEditingCourse({
                        ...editingCourse,
                        price: parseFloat(e.target.value),
                      })
                    }
                    disabled={editingCourse.type === "free"}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => setEditingCourse(null)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEdit}
                    className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseList;
