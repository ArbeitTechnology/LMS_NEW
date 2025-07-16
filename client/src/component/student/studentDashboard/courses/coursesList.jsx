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

  // API Integration Note:
  // In a production environment, replace this useEffect with actual API calls
  // Example API call structure:
  /*
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.yourdomain.com/courses');
        const data = await response.json();
        setCourses(data);
        setFilteredCourses(data);
      } catch (error) {
        toast.error('Failed to load courses');
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    
    const fetchCart = async () => {
      try {
        const response = await fetch('https://api.yourdomain.com/cart', {
          headers: { 'Authorization': `Bearer ${userToken}` }
        });
        const data = await response.json();
        setCart(data);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };
    
    const fetchEnrolledCourses = async () => {
      try {
        const response = await fetch('https://api.yourdomain.com/enrollments', {
          headers: { 'Authorization': `Bearer ${userToken}` }
        });
        const data = await response.json();
        setEnrolledCourses(data.map(course => course.id));
      } catch (error) {
        console.error('Error fetching enrollments:', error);
      }
    };
    
    fetchCourses();
    fetchCart();
    fetchEnrolledCourses();
  }, []);
  */

  // Currently using dummy data - replace with API calls above
  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setCourses(dummyCourses);
      setFilteredCourses(dummyCourses);
      setLoading(false);

      // Load cart from localStorage (replace with API in production)
      const savedCart = JSON.parse(localStorage.getItem("courseCart")) || [];
      setCart(savedCart);

      // Load enrolled courses (simulated - replace with API)
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

  // Add to cart function - would call API in production
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

    // API Integration Note:
    /*
    try {
      const response = await fetch('https://api.yourdomain.com/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ courseId: course.id })
      });
      if (!response.ok) throw new Error('Failed to add to cart');
      const data = await response.json();
      setCart(data.cartItems);
      toast.success("Course added to cart");
    } catch (error) {
      toast.error("Failed to add to cart");
      console.error(error);
    }
    */
  };

  // Remove from cart function - would call API in production
  const removeFromCart = (courseId) => {
    const updatedCart = cart.filter((item) => item.id !== courseId);
    setCart(updatedCart);
    localStorage.setItem("courseCart", JSON.stringify(updatedCart));
    toast.success("Course removed from cart");

    // API Integration Note:
    /*
    try {
      const response = await fetch(`https://api.yourdomain.com/cart/${courseId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      if (!response.ok) throw new Error('Failed to remove from cart');
      const data = await response.json();
      setCart(data.cartItems);
      toast.success("Course removed from cart");
    } catch (error) {
      toast.error("Failed to remove from cart");
      console.error(error);
    }
    */
  };

  // Enroll course function - would call API in production
  const enrollCourse = (courseId) => {
    if (enrolledCourses.includes(courseId)) {
      toast.error("You're already enrolled in this course");
      return;
    }

    const courseToEnroll = courses.find((course) => course.id === courseId);

    // Add progress tracking to the course object
    const courseWithProgress = {
      ...courseToEnroll,
      progress: 0, // Initialize with 0% progress
      lastAccessed: null, // Track when course was last accessed
    };

    // Update enrolled courses state
    setEnrolledCourses([...enrolledCourses, courseId]);

    // Save to myCourses in localStorage (replace with API)
    const myCourses = JSON.parse(localStorage.getItem("myCourses")) || [];
    localStorage.setItem(
      "myCourses",
      JSON.stringify([...myCourses, courseWithProgress])
    );

    toast.success("Successfully enrolled in course!");
    setActiveView("myCourses");

    // API Integration Note:
    /*
    try {
      const response = await fetch('https://api.yourdomain.com/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ courseId })
      });
      if (!response.ok) throw new Error('Failed to enroll');
      const data = await response.json();
      setEnrolledCourses([...enrolledCourses, courseId]);
      toast.success("Successfully enrolled in course!");
      setActiveView("myCourses");
    } catch (error) {
      toast.error("Failed to enroll in course");
      console.error(error);
    }
    */
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

  // Dummy course data - replace with API data
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
    },
  ];

  return (
    <div className="min-h-screen text-gray-900 p-0">
      {/* Header - Responsive for all devices */}
      <header className="bg-white py-4 sm:py-6 px-4 sm:px-6 lg:px-8 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-xl sm:text-2xl font-bold">Courses</h1>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => setActiveView("myCourses")}
              className="relative p-1 sm:p-2 rounded-full hover:bg-gray-100"
              aria-label="My Courses"
            >
              <FiBookOpen className="text-lg sm:text-xl" />
              {enrolledCourses.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {enrolledCourses.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveView("cart")}
              className="relative p-1 sm:p-2 rounded-full hover:bg-gray-100"
              aria-label="Shopping Cart"
            >
              <FiShoppingCart className="text-lg sm:text-xl" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Responsive layout */}
      <main className="max-w-7xl mx-auto py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
        {/* Search and Filter Section - Responsive layout */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
            <div className="relative flex-1 max-w-2xl">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search courses..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:border-gray-500 hover:border-gray-500 text-sm sm:text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center">
                <FiFilter className="text-gray-500 mr-1 sm:mr-2 text-sm sm:text-base" />
                <select
                  value={priceFilter}
                  onChange={(e) => setPriceFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-2 sm:px-3 py-1 sm:py-2 focus:border-gray-500 hover:border-gray-500 text-sm sm:text-base"
                >
                  <option value="all">All Courses</option>
                  <option value="free">Free Courses</option>
                  <option value="paid">Premium Courses</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Course Grid - Responsive columns */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 rounded-lg overflow-hidden animate-pulse"
              >
                <div className="h-40 sm:h-48 bg-gray-200"></div>
                <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                  <div className="h-5 sm:h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
                      className="w-full h-40 sm:h-48 object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 text-xs rounded">
                      {course.price === 0 ? "FREE" : `৳${course.price}`}
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 flex flex-col flex-grow">
                    <h3 className="text-base sm:text-lg font-bold mb-1 line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mb-2">
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
                    <span className="text-xs sm:text-sm text-gray-700 mb-2">
                      By {course.instructor}
                    </span>
                  </div>
                </div>

                <div className="p-3 sm:p-4 pt-0">
                  {isEnrolled(course.id) ? (
                    <button
                      onClick={() => navigate(`/learn/${course.id}`)}
                      className="w-full bg-gray-900 text-white py-1 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-gray-800 transition-all"
                    >
                      Continue Learning
                    </button>
                  ) : course.price === 0 ? (
                    <button
                      onClick={() => enrollCourse(course.id)}
                      className="w-full bg-gray-900 text-white py-1 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-gray-800 transition-all"
                    >
                      Enroll Now
                    </button>
                  ) : isInCart(course.id) ? (
                    <button
                      onClick={() => removeFromCart(course.id)}
                      className="w-full bg-red-100 text-red-700 py-1 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-red-200 flex items-center justify-center"
                    >
                      <FiShoppingCart className="mr-1 sm:mr-2" /> Remove
                    </button>
                  ) : (
                    <button
                      onClick={() => addToCart(course)}
                      className="w-full bg-gray-900 text-white py-1 sm:py-2 rounded-lg text-xs sm:text-sm hover:bg-gray-800 flex items-center justify-center"
                    >
                      <FiShoppingCart className="mr-1 sm:mr-2" /> Add to Cart
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <div className="mx-auto w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
              <FiBookOpen className="text-gray-400 text-2xl sm:text-3xl" />
            </div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1">
              No courses found
            </h3>
            <p className="text-sm sm:text-base text-gray-500">
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
