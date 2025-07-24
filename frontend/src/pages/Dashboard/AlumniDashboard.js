import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from '../../components/shared/Navbar';
import { 
  Users, Briefcase, MessageSquare, Calendar, Award, 
  Building2, MapPin, Clock, Bell, GraduationCap,
  BookOpen, Plus, ExternalLink, ChevronDown, ChevronUp,
  BarChart2, CheckCircle, Star, Mail, FileText, User, Edit2, Trash2
} from "lucide-react";
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
  hover: {
    y: -5,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.3 }
  }
};

const iconVariants = {
  hover: {
    rotate: 360,
    scale: 1.2,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

const statsVariants = {
  hidden: { opacity: 0 },
  visible: (i) => ({
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5
    }
  })
};

const AlumniDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isMobile, setIsMobile] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const [userData, setUserData] = useState(null);
  const [courses, setCourses] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [mentorshipRequests, setMentorshipRequests] = useState([]);
  const [error, setError] = useState(null);
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [expandedJob, setExpandedJob] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(240);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    // Get user data
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const decoded = jwtDecode(token);
        const userId = decoded.userId;

        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setUserData(response.data);
        setUserName(response.data.name || 'Alumni');
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    // Fetch all dashboard data
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('token');
        
        // Fetch courses
        const coursesResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/courses`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCourses(coursesResponse.data);

        // Fetch jobs
        const jobsResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/jobs`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setJobs(jobsResponse.data);

        // Fetch mentorship requests if user is a mentor
        const decoded = jwtDecode(token);
        const userId = decoded.userId;
        
        const mentorshipResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/mentor/requests/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMentorshipRequests(mentorshipResponse.data.requests || []);

      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        setError("Failed to load dashboard data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
    fetchDashboardData();
    
    const handleSidebarToggle = (e) => {
      if (e.detail && typeof e.detail.width === 'number') {
        setSidebarWidth(e.detail.width);
      }
    };
    
    window.addEventListener('sidebarToggle', handleSidebarToggle);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
      window.removeEventListener('sidebarToggle', handleSidebarToggle);
    };
  }, []);

  // Calculate dashboard statistics
  const calculateStats = () => {
    const activeMentees = mentorshipRequests.filter(req => req.status === 'accepted').length;
    
    const pendingRequests = mentorshipRequests.filter(req => req.status === 'pending').length;
    
    const activeJobs = jobs.length;
    const totalApplications = jobs.reduce((sum, job) => sum + (job.applications || 0), 0);
    
    return [
      {
        title: "Mentorships",
        count: activeMentees,
        description: userData?.isMentor ? "Active Mentees" : "Become a Mentor",
        icon: <Users className="w-6 h-6 text-blue-500" />,
        bgColor: "bg-blue-100",
        textColor: "text-blue-600",
        link: userData?.isMentor ? "/mentorship" : "/become-mentor"
      },
      {
        title: "Job Listings",
        count: activeJobs,
        description: "Active Listings",
        icon: <Briefcase className="w-6 h-6 text-green-500" />,
        bgColor: "bg-green-100",
        textColor: "text-green-600",
        link: "/jobs"
      },
      {
        title: "Applications",
        count: totalApplications,
        description: "Total Applicants",
        icon: <FileText className="w-6 h-6 text-purple-500" />,
        bgColor: "bg-purple-100",
        textColor: "text-purple-600",
        link: "/jobs"
      },
      {
        title: "Learning",
        count: courses.length,
        description: "Your Courses",
        icon: <BookOpen className="w-6 h-6 text-orange-500" />,
        bgColor: "bg-orange-100",
        textColor: "text-orange-600",
        link: "/courses"
      }
    ];
  };

  const stats = calculateStats();

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    window.location.href = '/login';
  };

  // Toggle course expansion
  const toggleCourseExpand = (courseId) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  // Toggle job expansion
  const toggleJobExpand = (jobId) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
     
      
      {/* Main Content */}
      <div 
        className="flex-1 overflow-auto" 
        style={{ marginLeft: isMobile ? 0 : sidebarWidth }}
      >
        {/* Header */}
        <div className="bg-white shadow-sm p-4 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-blue-800">ConnectYou Alumni</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-800 font-medium">
                    {userName ? userName.charAt(0) : 'A'}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="hidden md:block text-gray-600 hover:text-gray-800"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          <div className="md:hidden mt-3 flex overflow-x-auto pb-2">
            {[
              { id: "overview", name: "Dashboard" },
              { id: "courses", name: "Courses" },
              { id: "mentorship", name: "Mentorship" },
              { id: "jobs", name: "Jobs" },
            ].map((item) => (
              <button
                key={item.id}
                className={`px-3 py-1 rounded-md text-sm whitespace-nowrap mr-2 ${
                  activeTab === item.id
                    ? "bg-blue-100 text-blue-800"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
                onClick={() => setActiveTab(item.id)}
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
                  <p>{error}</p>
                </div>
              )}
            
              {activeTab === "overview" && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                >
                  {/* Welcome Section */}
                  <motion.div 
                    variants={cardVariants}
                    className="bg-white p-6 rounded-lg shadow-md mb-6"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-1">Welcome back, {userName || 'Alumni'}!</h1>
                        <p className="text-gray-600">
                          {userData?.isMentor ? 
                            "Continue making an impact through mentorship and sharing opportunities." :
                            "Explore ways to give back to the student community."
                          }
                        </p>
                      </div>
                      {!userData?.isMentor && (
                        <button className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                          Become a Mentor
                        </button>
                      )}
                    </div>
                  </motion.div>

                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    {stats.map((stat, index) => (
                      <motion.div
                        key={index}
                        variants={statsVariants}
                        custom={index}
                        whileHover="hover"
                        className={`p-6 rounded-lg shadow-md ${stat.bgColor} transform transition-all duration-300 cursor-pointer`}
                        onClick={() => window.location.href = stat.link}
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h2 className="text-lg font-semibold">{stat.title}</h2>
                          <motion.div
                            variants={iconVariants}
                            whileHover="hover"
                            className="transform-gpu"
                          >
                            {stat.icon}
                          </motion.div>
                        </div>
                        <motion.p
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.3 }}
                          className={`text-3xl font-bold ${stat.textColor}`}
                        >
                          {stat.count}
                        </motion.p>
                        <p className="text-gray-600">{stat.description}</p>
                      </motion.div>
                    ))}
                  </div>

                  {/* Recent Activity Section */}
                  <motion.div
                    variants={cardVariants}
                    className="bg-white p-6 rounded-lg shadow-md mb-6"
                  >
                    <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* My Courses */}
                      <div>
                        <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                          <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                          Your Courses
                        </h3>
                        <div className="space-y-3">
                          {courses.length > 0 ? (
                            courses.slice(0, 2).map((course) => (
                              <motion.div
                                key={course._id}
                                variants={cardVariants}
                                className="border rounded-lg overflow-hidden"
                              >
                                <div 
                                  className="p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                                  onClick={() => toggleCourseExpand(course._id)}
                                >
                                  <div>
                                    <h4 className="font-medium">{course.title}</h4>
                                    <p className="text-sm text-gray-600">{course.category}</p>
                                  </div>
                                  {expandedCourse === course._id ? (
                                    <ChevronUp className="w-5 h-5 text-gray-500" />
                                  ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-500" />
                                  )}
                                </div>
                                <AnimatePresence>
                                  {expandedCourse === course._id && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.3 }}
                                      className="px-3 pb-3"
                                    >
                                      <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                                      <div className="flex justify-between text-sm mb-1">
                                        <span>Progress</span>
                                        <span>{course.progress || 0}%</span>
                                      </div>
                                      <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                          className="bg-green-500 h-2 rounded-full" 
                                          style={{ width: `${course.progress || 0}%` }}
                                        ></div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.div>
                            ))
                          ) : (
                            <div className="text-center py-4 text-gray-500">
                              No courses available
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Job Postings */}
                      <div>
                        <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                          <Briefcase className="w-5 h-5 mr-2 text-green-600" />
                          Your Job Postings
                        </h3>
                        <div className="space-y-3">
                          {jobs.length > 0 ? (
                            jobs.slice(0, 2).map((job) => (
                              <motion.div
                                key={job._id}
                                variants={cardVariants}
                                className="border rounded-lg overflow-hidden"
                              >
                                <div 
                                  className="p-3 flex justify-between items-center cursor-pointer hover:bg-gray-50"
                                  onClick={() => toggleJobExpand(job._id)}
                                >
                                  <div>
                                    <h4 className="font-medium">{job.title}</h4>
                                    <p className="text-sm text-gray-600">{job.company}</p>
                                  </div>
                                  {expandedJob === job._id ? (
                                    <ChevronUp className="w-5 h-5 text-gray-500" />
                                  ) : (
                                    <ChevronDown className="w-5 h-5 text-gray-500" />
                                  )}
                                </div>
                                <AnimatePresence>
                                  {expandedJob === job._id && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.3 }}
                                      className="px-3 pb-3"
                                    >
                                      <p className="text-sm text-gray-600 mb-2">{job.description}</p>
                                      <div className="flex justify-between text-sm">
                                        <span>Applications:</span>
                                        <span className="font-medium">{job.applications || 0}</span>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </motion.div>
                            ))
                          ) : (
                            <div className="text-center py-4 text-gray-500">
                              No job postings yet
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Mentorship Section */}
                  <motion.div
                    variants={cardVariants}
                    className="bg-white p-6 rounded-lg shadow-md mb-6"
                  >
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <Users className="w-5 h-5 mr-2 text-purple-600" />
                      Mentorship Program
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <h3 className="font-medium text-purple-800 mb-2">Active Mentees</h3>
                        <p className="text-2xl font-bold">
                          {mentorshipRequests.filter(req => req.status === 'accepted').length}
                        </p>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="font-medium text-blue-800 mb-2">Pending Requests</h3>
                        <p className="text-2xl font-bold">
                          {mentorshipRequests.filter(req => req.status === 'pending').length}
                        </p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="font-medium text-green-800 mb-2">Your Rating</h3>
                        <div className="flex items-center">
                          <Star className="w-5 h-5 text-yellow-500 mr-1" />
                          <span className="text-2xl font-bold">4.8</span>
                          <span className="text-gray-500 ml-1">/5</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Active Mentees List */}
                    <div className="mt-6">
                      <h3 className="font-medium text-gray-800 mb-3">Active Mentees</h3>
                      <div className="space-y-3">
                        {mentorshipRequests.filter(req => req.status === 'accepted').length > 0 ? (
                          mentorshipRequests
                            .filter(req => req.status === 'accepted')
                            .map((req) => (
                              <motion.div 
                                key={req._id}
                                whileHover={{ scale: 1.02 }}
                                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg border border-gray-100"
                              >
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <User className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium">{req.studentName}</p>
                                  <p className="text-xs text-gray-600">{req.studentEmail}</p>
                                </div>
                                <button className="ml-auto p-1 text-blue-600 hover:bg-blue-50 rounded-full">
                                  <MessageSquare className="w-4 h-4" />
                                </button>
                              </motion.div>
                            ))
                        ) : (
                          <p className="text-gray-500 text-center py-4">No active mentees</p>
                        )}
                      </div>
                    </div>
                    
                    {/* Pending Requests List */}
                    <div className="mt-6">
                      <h3 className="font-medium text-gray-800 mb-3">Pending Requests</h3>
                      <div className="space-y-3">
                        {mentorshipRequests.filter(req => req.status === 'pending').length > 0 ? (
                          mentorshipRequests
                            .filter(req => req.status === 'pending')
                            .map((req) => (
                              <motion.div 
                                key={req._id}
                                whileHover={{ scale: 1.02 }}
                                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg border border-gray-100"
                              >
                                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                                  <User className="w-5 h-5 text-amber-600" />
                                </div>
                                <div>
                                  <p className="font-medium">{req.studentName}</p>
                                  <p className="text-xs text-gray-600">{req.studentEmail}</p>
                                </div>
                                <button 
                                  className="ml-auto px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600"
                                  onClick={() => {
                                    // Handle accept logic here
                                    axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/mentor/accept/${req._id}`)
                                      .then(() => {
                                        // Update the request status locally
                                        setMentorshipRequests(prev => 
                                          prev.map(r => r._id === req._id ? {...r, status: 'accepted'} : r)
                                        );
                                      })
                                      .catch(err => console.error("Error accepting request", err));
                                  }}
                                >
                                  Accept
                                </button>
                              </motion.div>
                            ))
                        ) : (
                          <p className="text-gray-500 text-center py-4">No pending requests</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Courses Section */}
                  <motion.div
                    variants={cardVariants}
                    className="bg-white p-6 rounded-lg shadow-md mb-6"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold flex items-center">
                        <BookOpen className="w-5 h-5 mr-2 text-blue-600" />
                        Your Courses
                      </h2>
                      <button 
                        className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm flex items-center gap-1 hover:bg-blue-700"
                        onClick={() => window.location.href = '/alumni/e-learning'}
                      >
                        <Plus className="w-4 h-4" />
                        Add Course
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {courses.length > 0 ? (
                        courses.slice(0, 3).map((course) => (
                          <motion.div
                            key={course._id}
                            variants={cardVariants}
                            whileHover="hover"
                            className="border rounded-lg overflow-hidden"
                          >
                            <div className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="font-medium">{course.title}</h3>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                  {course.level || 'Beginner'}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                              <div className="flex justify-between text-xs mb-1">
                                <span>Progress</span>
                                <span>{course.progress || 0}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                                <div 
                                  className="bg-green-500 h-2 rounded-full" 
                                  style={{ width: `${course.progress || 0}%` }}
                                ></div>
                              </div>
                              <button className="w-full py-1.5 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                                Manage Course
                              </button>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="col-span-3 text-center py-8 text-gray-500">
                          No courses available. Create your first course!
                        </div>
                      )}
                    </div>
                    
                    {courses.length > 3 && (
                      <div className="mt-4 text-center">
                        <button 
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          onClick={() => window.location.href = '/alumni/e-learning'}
                        >
                          View All Courses
                        </button>
                      </div>
                    )}
                  </motion.div>
                  
                  {/* Jobs Section */}
                  <motion.div
                    variants={cardVariants}
                    className="bg-white p-6 rounded-lg shadow-md"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-semibold flex items-center">
                        <Briefcase className="w-5 h-5 mr-2 text-green-600" />
                        Job Postings
                      </h2>
                      <button 
                        className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm flex items-center gap-1 hover:bg-green-700"
                        onClick={() => window.location.href = '/alumni/job-postings'}
                      >
                        <Plus className="w-4 h-4" />
                        Post Job
                      </button>
                    </div>
                    
                    <div className="space-y-4">
                      {jobs.length > 0 ? (
                        jobs.slice(0, 3).map((job) => (
                          <motion.div
                            key={job._id}
                            variants={cardVariants}
                            whileHover="hover"
                            className="border rounded-lg overflow-hidden p-4"
                          >
                            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                              <div>
                                <h3 className="font-medium">{job.title}</h3>
                                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-600 mt-1">
                                  <div className="flex items-center">
                                    <Building2 className="w-3 h-3 mr-1" />
                                    <span>{job.company}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    <span>{job.location}</span>
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    <span>Posted {job.posted || 'recently'}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                  {job.applications || 0} Applications
                                </span>
                                <button className="p-1 text-gray-600 hover:bg-gray-100 rounded-full">
                                  <Edit2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No job postings yet. Create your first job posting!
                        </div>
                      )}
                    </div>
                    
                    {jobs.length > 3 && (
                      <div className="mt-4 text-center">
                        <button 
                          className="text-green-600 hover:text-green-800 text-sm font-medium"
                          onClick={() => window.location.href = '/alumni/job-postings'}
                        >
                          View All Job Postings
                        </button>
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlumniDashboard;