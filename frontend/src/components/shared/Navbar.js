import React, { useState, useEffect, createContext, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import {
  LineChart, Users, Briefcase, MessageSquare, Calendar,
  BookOpen, HelpCircle, User, LogOut, Award,
  ChevronLeft, ChevronRight, Menu, GraduationCap, Lightbulb
} from 'lucide-react';

// Create context for navbar state
export const NavbarContext = createContext();

export const useNavbar = () => useContext(NavbarContext);

export const NavbarProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <NavbarContext.Provider value={{ isCollapsed, setIsCollapsed, isMobile, mobileOpen, setMobileOpen }}>
      {children}
    </NavbarContext.Provider>
  );
};

const Navbar = ({ type = 'student' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use responsive breakpoints
  const isMobileDevice = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = type === 'student' ? [
    { name: "Dashboard", icon: <LineChart />, path: "/dashboard" },
    { name: "E-Learning", icon: <GraduationCap />, path: "/dashboard/e-learning" },
    { name: "Mentorship", icon: <Users />, path: "/dashboard/mentorship" },
    { name: "Jobs & Internships", icon: <Briefcase />, path: "/dashboard/jobs" },
    { name: "Messages", icon: <MessageSquare />, path: "/dashboard/messages", badge: 2 },
    { name: "Events", icon: <Calendar />, path: "/dashboard/events" },
    { name: "Projects", icon: <BookOpen />, path: "/dashboard/projects" },
    { name: "AI Assistant", icon: <HelpCircle />, path: "/dashboard/ai-assistant" },
    { name: "Workshops", icon: <Users />, path: "/dashboard/workshops" },
    { name: "Profile", icon: <User />, path: "/dashboard/profile" }
  ] : [
    { name: "Dashboard", icon: <LineChart />, path: "/alumni" },
    { name: "E-Learning", icon: <GraduationCap />, path: "/alumni/e-learning" },
    { name: "Mentorship", icon: <Users />, path: "/alumni/mentorship" },
    { name: "Job Postings", icon: <Briefcase />, path: "/alumni/job-postings" },
    { name: "Messages", icon: <MessageSquare />, path: "/alumni/messages", badge: 3 },
    { name: "Events", icon: <Calendar />, path: "/alumni/events" },
    { name: "Projects", icon: <BookOpen />, path: "/alumni/projects" },
    { name: "Profile", icon: <User />, path: "/alumni/profile" }
  ];

  useEffect(() => {
    const checkIfMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      
      // Auto-collapse on smaller screens that aren't mobile
      if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else if (window.innerWidth >= 1024) {
        setIsCollapsed(false);
      }
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const colors = {
    student: {
      primary: 'from-purple-800 to-purple-900',
      accent: 'purple-800',
      hover: 'rgba(126, 34, 206, 0.1)',
      active: '#7e22ce'
    },
    alumni: {
      primary: 'from-blue-800 to-blue-900',
      accent: 'blue-800',
      hover: 'rgba(30, 58, 138, 0.1)',
      active: '#1e40af'
    }
  };

  const currentColors = colors[type];

  // Calculate main content margin based on navbar state
  const getMainContentStyle = () => {
    if (isMobile) {
      return { marginLeft: 0 };
    }
    return { marginLeft: isCollapsed ? '72px' : '240px' };
  };

  return (
    <>
      <AnimatePresence>
        {isMobile && mobileOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>
      
      {isMobile && (
        <motion.button
          className={`fixed top-4 left-4 z-20 bg-${type === 'student' ? 'purple' : 'blue'}-800 text-white p-2 rounded-full shadow-lg`}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <Menu size={24} />
        </motion.button>
      )}

      <AnimatePresence>
        <motion.div
          className={`h-screen bg-white shadow-xl fixed top-0 left-0 flex flex-col overflow-hidden z-30 border-r border-gray-200 transition-all duration-300`}
          initial={isMobile ? { x: "-100%" } : { width: "240px" }}
          animate={
            isMobile 
              ? { x: mobileOpen ? 0 : "-100%" }
              : { width: isCollapsed ? "72px" : "240px" }
          }
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Header */}
          <div className={`flex items-center justify-between px-4 py-5 bg-gradient-to-r ${currentColors.primary}`}>
            <div className="flex items-center">
              {type === 'student' ? (
                <GraduationCap className="text-white h-5 w-5 sm:h-6 sm:w-6 mr-2" />
              ) : (
                <Award className="text-yellow-400 h-5 w-5 sm:h-6 sm:w-6 mr-2" />
              )}
              {(!isCollapsed || (isMobile && mobileOpen)) && (
                <span className="font-bold text-white text-base sm:text-lg truncate">
                  {type === 'student' ? 'Student Portal' : 'Alumni Portal'}
                </span>
              )}
            </div>

            {!isMobile && (
              <motion.button
                className={`p-1 rounded-full bg-${type === 'student' ? 'purple' : 'blue'}-800 text-white hover:opacity-80`}
                onClick={() => setIsCollapsed(!isCollapsed)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              >
                {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </motion.button>
            )}
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto py-3 sm:py-4 px-2 sm:px-3">
            <ul className="space-y-1">
              {menuItems.map((item) => (
                <motion.li key={item.path}>
                  <motion.button
                    onClick={() => {
                      navigate(item.path);
                      if (isMobile) setMobileOpen(false);
                    }}
                    className={`w-full flex items-center rounded-lg p-2 sm:p-3 relative ${
                      isCollapsed && !isMobile ? "justify-center" : "justify-start"
                    }`}
                    whileHover={{
                      backgroundColor: currentColors.hover,
                      scale: 1.02
                    }}
                    animate={{
                      backgroundColor: location.pathname === item.path ? currentColors.active : "transparent",
                      color: location.pathname === item.path ? "#ffffff" : "#4b5563"
                    }}
                    aria-label={item.name}
                  >
                    <span className={`${location.pathname === item.path ? "text-white" : type === 'student' ? "text-purple-800" : "text-blue-800"}`}>
                      {React.cloneElement(item.icon, { size: isCollapsed && !isMobile ? 20 : 18 })}
                    </span>
                    
                    {(!isCollapsed || (isMobile && mobileOpen)) && (
                      <span className="ml-3 font-medium text-xs sm:text-sm truncate">
                        {item.name}
                      </span>
                    )}
                    
                    {item.badge && (!isCollapsed || (isMobile && mobileOpen)) && (
                      <span className={`absolute right-2 bg-${type === 'student' ? 'purple' : 'blue'}-800 text-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center text-[10px] sm:text-xs font-bold`}>
                        {item.badge}
                      </span>
                    )}
                  </motion.button>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Logout Button */}
          <div className="p-2 sm:p-3 border-t border-gray-200">
            <motion.button 
              className={`w-full bg-white text-${type === 'student' ? 'purple' : 'blue'}-800 border border-${type === 'student' ? 'purple' : 'blue'}-800 p-2 sm:p-3 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                localStorage.clear();
                navigate('/login');
              }}
              aria-label="Sign Out"
            >
              <LogOut size={isCollapsed && !isMobile ? 20 : 16} />
              {(!isCollapsed || (isMobile && mobileOpen)) && <span className="text-xs sm:text-sm">Sign Out</span>}
            </motion.button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Export navbar state for other components */}
      <NavbarContext.Provider value={{ isCollapsed, isMobile, mobileOpen }}>
        {/* This is where page content would go */}
      </NavbarContext.Provider>
    </>
  );
};

export default Navbar;