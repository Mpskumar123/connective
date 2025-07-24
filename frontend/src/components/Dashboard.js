import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Calendar, 
  Briefcase, 
  Users, 
  Bell, 
  Search,
  ChevronRight,
  Star,
  Clock,
  MapPin,
  Building,
  Play,
  TrendingUp,
  BarChart,
  Award,
  LayoutDashboard,
  MessageSquare
} from 'lucide-react';
import Navbar from './shared/Navbar';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Typewriter from 'typewriter-effect';

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [events, setEvents] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [userName, setUserName] = useState('');
  const [stats] = useState({
    coursesCompleted: 5,
    eventsAttended: 3,
    jobsApplied: 8,
    mentorSessions: 2
  });

  const [chatbotOpen, setChatbotOpen] = useState(false);
  const containerRef = useRef(null);

  // Scroll animations with intersection observer
  const [headerRef, headerInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [statsRef, statsInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [learningRef, learningInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [eventsJobsRef, eventsJobsInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const [mentorsRef, mentorsInView] = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        };

        const [coursesRes, eventsRes, jobsRes, mentorsRes, notificationsRes] = await Promise.all([
          fetch(`${process.env.REACT_APP_BACKEND_URL}/api/courses`),
          fetch(`${process.env.REACT_APP_BACKEND_URL}/api/events`),
          fetch(`${process.env.REACT_APP_BACKEND_URL}/api/jobs`),
          fetch(`${process.env.REACT_APP_BACKEND_URL}/api/mentor`, { headers }),
          fetch(`${process.env.REACT_APP_BACKEND_URL}/api/notifications`)
        ]);

        const coursesData = await coursesRes.json();
        const eventsData = await eventsRes.json();
        const jobsData = await jobsRes.json();
        
        let mentorsData = [];
        if (mentorsRes.ok) {
          mentorsData = await mentorsRes.json();
        } else {
          console.error('Error fetching mentors:', mentorsRes.status);
        }
        
        let notificationsData = [];
        if (notificationsRes.ok) {
          notificationsData = await notificationsRes.json();
        }

        setCourses(coursesData.slice(0, 6));
        setEvents(eventsData.slice(0, 3));
        setJobs(jobsData.slice(0, 5));
        setMentors(mentorsData.slice(0, 3));
        setNotifications(notificationsData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setUserName(storedName);
    }
  }, []);

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isUpcoming = (dateString) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    return eventDate >= today;
  };

  const toggleChatbot = () => {
    setChatbotOpen(!chatbotOpen);
  };

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const slideInLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const slideInRight = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const scaleUp = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" }
    }
  };

  const floatAnimation = {
    float: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <div className="flex-none">
          
        </div>
        <div className="flex-1 ml-64">
          <div className="p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="animate-pulse"
            >
              <div className="h-8 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded w-1/4 mb-4 animate-shimmer"></div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {[1, 2, 3, 4].map(i => (
                  <div 
                    key={i} 
                    className="h-32 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg animate-shimmer" 
                    style={{animationDelay: `${i * 0.1}s`}}
                  ></div>
                ))}
              </div>
              {[1, 2, 3].map(i => (
                <div 
                  key={i} 
                  className="h-64 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 rounded-lg mb-6 animate-shimmer" 
                  style={{animationDelay: `${i * 0.2}s`}}
                ></div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50" ref={containerRef}>
      <div className="flex-none">
        
      </div>
      
      <div className="flex-1 ml-64">
        {/* Header with welcome and search */}
        <motion.div 
          ref={headerRef}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-800 text-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-1">
                  <Typewriter
                    options={{
                      strings: [`Welcome back, ${userName || 'Student'}!`],
                      autoStart: true,
                      loop: false,
                      delay: 50,
                      cursor: '',
                    }}
                  />
                </h1>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5 }}
                  className="text-purple-100"
                >
                  Your learning journey continues today
                </motion.p>
              </div>
              
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="relative max-w-md w-full"
              >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search courses, events, jobs..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent text-white placeholder-white/60 transition-all duration-300 hover:scale-[1.02]"
                />
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Stats cards */}
          <motion.div 
            ref={statsRef}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            {[
              { icon: BookOpen, label: 'Courses Completed', value: '0', color: 'purple', bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
              { icon: Calendar, label: 'Events Attended', value: '0', color: 'blue', bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
              { icon: Briefcase, label: 'Jobs Applied', value: '0', color: 'green', bgColor: 'bg-green-100', iconColor: 'text-green-600' },
              { icon: Users, label: 'Mentor Sessions', value: '0', color: 'amber', bgColor: 'bg-amber-100', iconColor: 'text-amber-600' }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-lg shadow p-6 flex items-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <motion.div 
                  whileHover={{ scale: 1.1 }}
                  className={`rounded-full ${stat.bgColor} p-3 mr-4`}
                >
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                </motion.div>
                <div>
                  <h3 className="text-gray-500 text-sm">{stat.label}</h3>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="text-2xl font-bold"
                  >
                    {stat.value}
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Learning Progress */}
          <motion.div 
            ref={learningRef}
            initial="hidden"
            animate={learningInView ? "visible" : "hidden"}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
          >
            {/* Current Courses */}
            <motion.div 
              variants={slideInLeft}
              className="lg:col-span-2 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Your Courses</h2>
                <motion.button 
                  whileHover={{ x: 5 }}
                  onClick={() => navigate('/dashboard/e-learning')}
                  className="text-purple-600 hover:text-purple-800 text-sm flex items-center group"
                >
                  View all courses
                  <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                </motion.button>
              </div>
              <div className="p-6">
                {courses.length > 0 ? (
                  <div className="space-y-4">
                    {courses.slice(0, 3).map((course, index) => (
                      <motion.div 
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-all duration-300 cursor-pointer"
                      >
                        <motion.div 
                          variants={floatAnimation}
                          animate="float"
                          className="w-16 h-16 flex-shrink-0"
                          style={{animationDelay: `${index * 0.5}s`}}
                        >
                          <img 
                            src={`${process.env.REACT_APP_BACKEND_URL}/${course.thumbnail}`}
                            alt={course.title} 
                            className="w-full h-full object-cover rounded-md transition-transform duration-300 hover:scale-110"
                          />
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-purple-100 text-purple-800">{course.category}</span>
                            <div className="flex items-center text-sm text-gray-500">
                              <Clock className="w-3 h-3 mr-1" />
                              {course.duration}
                            </div>
                          </div>
                          <h3 className="mt-1 text-base font-medium text-gray-900 truncate">{course.title}</h3>
                        </div>
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          className="flex-shrink-0 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition-all duration-300"
                        >
                          <Play className="w-4 h-4" />
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-10"
                  >
                    <motion.div
                      variants={floatAnimation}
                      animate="float"
                    >
                      <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    </motion.div>
                    <p className="text-gray-500">You haven't enrolled in any courses yet</p>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate('/dashboard/e-learning')}
                      className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300"
                    >
                      Browse Courses
                    </motion.button>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Learning Stats */}
            <motion.div 
              variants={slideInRight}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Learning Activity</h2>
              </div>
              <div className="p-6">
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Weekly Progress</h3>
                  <div className="flex items-center gap-1 h-20">
                    {[40, 25, 60, 35, 80, 55, 30].map((height, index) => (
                      <motion.div 
                        key={index}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ 
                          duration: 0.8,
                          delay: index * 0.1,
                          type: "spring",
                          damping: 10
                        }}
                        className="flex-1 flex items-end h-full"
                      >
                        <div 
                          className="w-full bg-purple-600 rounded-t-sm hover:bg-purple-700 transition-all duration-300"
                        ></div>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>Mon</span>
                    <span>Wed</span>
                    <span>Fri</span>
                    <span>Sun</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { icon: TrendingUp, value: '0 hrs', label: 'This week', color: 'purple' },
                    { icon: BarChart, value: '+0% growth', label: 'vs last week', color: 'green' },
                    { icon: Award, value: '0 certificates', label: 'Earned this month', color: 'amber' }
                  ].map((item, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.5 }}
                      className="flex items-center"
                    >
                      <div className={`rounded-full p-2 bg-${item.color}-100 mr-3`}>
                        <item.icon className={`h-5 w-5 text-${item.color}-600`} />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{item.value}</div>
                        <div className="text-xs text-gray-500">{item.label}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Upcoming Events and Jobs */}
          <motion.div 
            ref={eventsJobsRef}
            initial="hidden"
            animate={eventsJobsInView ? "visible" : "hidden"}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
          >
            {/* Upcoming Events */}
            <motion.div 
              variants={slideInLeft}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Upcoming Events</h2>
                <motion.button 
                  whileHover={{ x: 5 }}
                  onClick={() => navigate('/dashboard/events')}
                  className="text-purple-600 hover:text-purple-800 text-sm flex items-center group"
                >
                  View all
                  <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                </motion.button>
              </div>
              <div className="p-4">
                {events.length > 0 ? (
                  <div className="space-y-4">
                    {events.filter(event => isUpcoming(event.date)).slice(0, 3).map((event, index) => (
                      <motion.div 
                        key={event._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="flex items-start p-2 hover:bg-gray-50 rounded-lg transition-all duration-300"
                      >
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className="bg-purple-50 p-3 rounded-lg text-center mr-4 w-16"
                        >
                          <div className="text-lg font-bold text-purple-600">
                            {new Date(event.date).getDate()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(event.date).toLocaleString('default', { month: 'short' })}
                          </div>
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{event.title}</h3>
                          <div className="flex items-center mt-1 text-sm text-gray-500">
                            <Clock className="w-3 h-3 mr-1" />
                            {event.time}
                          </div>
                          <div className="flex items-center mt-1 text-sm text-gray-500">
                            <MapPin className="w-3 h-3 mr-1" />
                            {event.location}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      variants={floatAnimation}
                      animate="float"
                    >
                      <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    </motion.div>
                    <p className="text-gray-500">No upcoming events</p>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Recent Jobs */}
            <motion.div 
              variants={slideInRight}
              className="lg:col-span-2 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Recent Job Postings</h2>
                <motion.button 
                  whileHover={{ x: 5 }}
                  onClick={() => navigate('/dashboard/jobs')}
                  className="text-purple-600 hover:text-purple-800 text-sm flex items-center group"
                >
                  View all jobs
                  <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                </motion.button>
              </div>
              <div className="p-4">
                {jobs.length > 0 ? (
                  <div className="space-y-3">
                    {jobs.slice(0, 5).map((job, index) => (
                      <motion.div 
                        key={job.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="flex items-center p-3 hover:bg-gray-50 rounded-lg transition-all duration-300 cursor-pointer"
                      >
                        <motion.div 
                          whileHover={{ scale: 1.1 }}
                          className="w-12 h-12 flex-shrink-0 mr-4"
                        >
                          <div className="bg-gray-50 p-2 rounded-lg flex items-center justify-center h-full">
                            <img src={job.logo} alt={job.company} className="w-full h-full object-contain" />
                          </div>
                        </motion.div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{job.title}</h3>
                          <div className="flex flex-wrap gap-y-1 gap-x-3 mt-1">
                            <div className="flex items-center text-sm text-gray-500">
                              <Building className="w-3 h-3 mr-1" />
                              {job.company}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <MapPin className="w-3 h-3 mr-1" />
                              {job.location}
                            </div>
                          </div>
                        </div>
                        <div className="flex-shrink-0 flex items-center">
                          <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-800 rounded-full">{job.type}</span>
                          <span className="text-xs text-gray-500 ml-3">{job.posted}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      variants={floatAnimation}
                      animate="float"
                    >
                      <Briefcase className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    </motion.div>
                    <p className="text-gray-500">No job postings available</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>

          {/* Recommended Mentors and Notifications */}
          <motion.div 
            ref={mentorsRef}
            initial="hidden"
            animate={mentorsInView ? "visible" : "hidden"}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Mentors */}
            <motion.div 
              variants={slideInLeft}
              className="lg:col-span-2 bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold">Recommended Mentors</h2>
                <motion.button 
                  whileHover={{ x: 5 }}
                  onClick={() => navigate('/dashboard/mentorship')}
                  className="text-purple-600 hover:text-purple-800 text-sm flex items-center group"
                >
                  View all mentors
                  <ChevronRight className="w-4 h-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" />
                </motion.button>
              </div>
              <div className="p-4">
                {mentors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mentors.slice(0, 3).map((mentor, index) => (
                      <motion.div 
                        key={mentor._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        <div className="relative">
                          <img
                            src={`${process.env.REACT_APP_BACKEND_URL}/${mentor.image}`}
                            alt={mentor.name}
                            className="w-full h-32 object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold">{mentor.name}</h3>
                          <p className="text-sm text-gray-600">{mentor.role} at {mentor.company}</p>
                          <div className="flex items-center mt-2 text-sm">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            <span>{mentor.rating}</span>
                            <span className="mx-2">•</span>
                            <span>{mentor.sessions} sessions</span>
                          </div>
                          <div className="mt-3">
                            <motion.button 
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="w-full bg-purple-600 text-white text-sm px-3 py-1.5 rounded-md hover:bg-purple-700 transition-colors"
                            >
                              Connect
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      variants={floatAnimation}
                      animate="float"
                    >
                      <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    </motion.div>
                    <p className="text-gray-500">No mentors available</p>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div 
              variants={slideInRight}
              className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Notifications</h2>
              </div>
              <div className="p-4">
                {notifications.length > 0 ? (
                  <div className="space-y-4">
                    {notifications.slice(0, 3).map((notification, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start p-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                          <Bell className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm">{notification.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-8"
                  >
                    <motion.div
                      variants={floatAnimation}
                      animate="float"
                    >
                      <Bell className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    </motion.div>
                    <p className="text-gray-500">No notifications</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Fixed Floating Dashboard & Chatbot Icons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-4">
        {/* Dashboard Icon */}
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard/ai-assistant')} 
          className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-colors"
          title="Dashboard"
        >
          <LayoutDashboard className="w-6 h-6" />
        </motion.button>
        
        {/* Chatbot Icon */}
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleChatbot} 
          className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-full shadow-lg transition-colors"
          title="Chat with Assistant"
        >
          <MessageSquare className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Chatbot Dialog */}
      <AnimatePresence>
        {chatbotOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-200"
          >
            <div className="bg-indigo-600 text-white px-4 py-3 flex justify-between items-center">
              <h3 className="font-medium">Learning Assistant</h3>
              <button onClick={toggleChatbot} className="text-white hover:text-gray-200">
                ✕
              </button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-indigo-100 rounded-lg p-3 mb-3 max-w-[80%]"
              >
                <p className="text-sm">Hi there! How can I help with your learning journey today?</p>
              </motion.div>
            </div>
            <div className="border-t border-gray-200 p-3">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Type your message..." 
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-indigo-600 text-white px-3 py-2 rounded-md hover:bg-indigo-700"
                >
                  Send
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;