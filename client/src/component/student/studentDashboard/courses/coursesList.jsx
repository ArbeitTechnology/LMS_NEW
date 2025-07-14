/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiBookOpen,
  FiDollarSign,
  FiYoutube,
  FiShoppingCart,
  FiCheck,
  FiStar,
  FiFilter,
  FiSearch,
  FiClock,
  FiUsers,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const CourseList = ({ setActiveView }) => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // Dummy data - replace with API calls in production
  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setCourses(dummyCourses);
      setFilteredCourses(dummyCourses);
      setLoading(false);

      // Load cart from localStorage
      const savedCart = JSON.parse(localStorage.getItem("courseCart")) || [];
      setCart(savedCart);

      // Load enrolled courses (simulated)
      setEnrolledCourses(["course1", "course3"]);
    }, 800);
  }, []);

  // Filter courses based on search and price filter
  useEffect(() => {
    let results = courses;

    if (searchTerm) {
      results = results.filter(
        (course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priceFilter === "free") {
      results = results.filter((course) => course.price === 0);
    } else if (priceFilter === "paid") {
      results = results.filter((course) => course.price > 0);
    }

    setFilteredCourses(results);
  }, [searchTerm, priceFilter, courses]);

  // Add to cart function
  const addToCart = (course) => {
    if (cart.some((item) => item.id === course.id)) {
      toast.error("Course already in cart");
      return;
    }

    if (course.price === 0) {
      enrollCourse(course.id);
      return;
    }

    const updatedCart = [...cart, course];
    setCart(updatedCart);
    localStorage.setItem("courseCart", JSON.stringify(updatedCart));
    toast.success("Course added to cart");
  };

  // Remove from cart function
  const removeFromCart = (courseId) => {
    const updatedCart = cart.filter((item) => item.id !== courseId);
    setCart(updatedCart);
    localStorage.setItem("courseCart", JSON.stringify(updatedCart));
    toast.success("Course removed from cart");
  };

  // Enroll in free course
  const enrollCourse = (courseId) => {
    if (enrolledCourses.includes(courseId)) {
      toast.error("You're already enrolled in this course");
      return;
    }

    setEnrolledCourses([...enrolledCourses, courseId]);
    toast.success("Successfully enrolled in course!");
    navigate(`/learn/${courseId}`);
  };

  // Check if course is in cart
  const isInCart = (courseId) => {
    return cart.some((item) => item.id === courseId);
  };

  // Check if course is enrolled
  const isEnrolled = (courseId) => {
    return enrolledCourses.includes(courseId);
  };

  // Calculate cart total
  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  // Dummy course data
  const dummyCourses = [
    {
      id: "course1",
      title: "Introduction to Web Development",
      description:
        "Learn the basics of HTML, CSS, and JavaScript to build your first website.",
      thumbnail:
        "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      instructor: "Sarah Johnson",
      rating: 4.7,
      students: 1250,
      duration: "8 hours",
      price: 0,
      type: "free",
      category: "Web Development",
    },
    {
      id: "course2",
      title: "Advanced React Patterns",
      description:
        "Master advanced React concepts like hooks, context, and performance optimization.",
      thumbnail:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      instructor: "Michael Chen",
      rating: 4.9,
      students: 890,
      duration: "12 hours",
      price: 49.99,
      type: "premium",
      category: "Web Development",
    },
    {
      id: "course3",
      title: "Python for Data Science",
      description:
        "Learn Python programming and data analysis with Pandas and NumPy.",
      thumbnail:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      instructor: "David Wilson",
      rating: 4.5,
      students: 2100,
      duration: "10 hours",
      price: 0,
      type: "free",
      category: "Data Science",
    },
    {
      id: "course4",
      title: "Mobile App Development with Flutter",
      description:
        "Build cross-platform mobile apps using Google's Flutter framework.",
      thumbnail:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      instructor: "Emma Davis",
      rating: 4.8,
      students: 750,
      duration: "15 hours",
      price: 59.99,
      type: "premium",
      category: "Mobile Development",
    },
    {
      id: "course5",
      title: "UX/UI Design Fundamentals",
      description:
        "Learn the principles of user experience and interface design.",
      thumbnail:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      instructor: "Lisa Rodriguez",
      rating: 4.6,
      students: 980,
      duration: "6 hours",
      price: 39.99,
      type: "premium",
      category: "Design",
    },
    {
      id: "course6",
      title: "JavaScript: The Complete Guide",
      description: "Master JavaScript from basics to advanced concepts.",
      thumbnail:
        "https://images.unsplash.com/photo-1547658719-da2b51169166?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      instructor: "John Smith",
      rating: 4.7,
      students: 3200,
      duration: "20 hours",
      price: 0,
      type: "free",
      category: "Web Development",
    },
  ];

  return (
    <div className="min-h-screen text-gray-900 p-0">
      {/* Header */}
      <header className=" py-6 px-4 sm:px-6 lg:px-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Courses</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveView("cart")}
              className="relative p-2 rounded-full hover:bg-gray-100"
            >
              <FiShoppingCart className="text-xl" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Search and Filter Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1 max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search courses..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:border-gray-500 hover:border-gray-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <FiFilter className="text-gray-500 mr-2" />
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:border-gray-500 hover:border-gray-500"
                >
                  <option value="all">All Courses</option>
                  <option value="free">Free Courses</option>
                  <option value="paid">Premium Courses</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-lg overflow-hidden animate-pulse"
              >
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <motion.div
                key={course.id}
                className="bg-white rounded-lg shadow border border-gray-200 flex flex-col justify-between hover:shadow-lg transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ y: -5 }}
              >
                <div>
                  <div className="relative">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 text-xs rounded">
                      {course.price === 0 ? "FREE" : `$${course.price}`}
                    </div>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold mb-1 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex text-xs text-gray-500 mb-2 space-x-4">
                      <span className="flex items-center">
                        <FiStar className="mr-1 text-yellow-400" />{" "}
                        {course.rating}
                      </span>
                      <span className="flex items-center">
                        <FiUsers className="mr-1" />{" "}
                        {course.students.toLocaleString()}
                      </span>
                      <span className="flex items-center">
                        <FiClock className="mr-1" /> {course.duration}
                      </span>
                    </div>
                    <span className="text-sm text-gray-700 mb-2">
                      By {course.instructor}
                    </span>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  {isEnrolled(course.id) ? (
                    <button
                      onClick={() => navigate(`/learn/${course.id}`)}
                      className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm hover:bg-gray-800 transition-all"
                    >
                      Continue Learning
                    </button>
                  ) : course.price === 0 ? (
                    <button
                      onClick={() => enrollCourse(course.id)}
                      className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm hover:bg-gray-800 transition-all"
                    >
                      Enroll Now
                    </button>
                  ) : isInCart(course.id) ? (
                    <button
                      onClick={() => removeFromCart(course.id)}
                      className="w-full bg-red-100 text-red-700 py-2 rounded-lg text-sm hover:bg-red-200 flex items-center justify-center"
                    >
                      <FiShoppingCart className="mr-2" /> Remove
                    </button>
                  ) : (
                    <button
                      onClick={() => addToCart(course)}
                      className="w-full bg-gray-900 text-white py-2 rounded-lg text-sm hover:bg-gray-800 flex items-center justify-center"
                    >
                      <FiShoppingCart className="mr-2" /> Add to Cart
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiBookOpen className="text-gray-400 text-3xl" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No courses found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filter to find what you're looking
              for.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CourseList;
