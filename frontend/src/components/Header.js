import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Menu, X, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();
  const navigate = useNavigate();

  const headerBackground = useTransform(
    scrollY,
    [0, 50],
    ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.95)"]
  );

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false); // Close mobile menu after navigation
  };

  return (
    <motion.header
      style={{ backgroundColor: headerBackground }}
      className={`header ${isScrolled ? "scrolled" : ""}`}
    >
      <nav className="header-nav">
        <div className="header-container">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="header-logo"
          >
            <GraduationCap className="logo-icon" />
            <span className="logo-text">ConnectYou</span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="desktop-menu">
            <ul className="nav-links">
              {/* <li><a href="#features" className="nav-link">Features</a></li> */}
            </ul>
            <div className="auth-buttons">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation("/signup")}
                className="signup-btn"
              >
                Sign Up
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNavigation("/login")}
                className="login-btn"
              >
                Sign In
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="mobile-menu-button">
            <button
              onClick={toggleMenu}
              className="menu-toggle"
              aria-label={isOpen ? "Close menu" : "Open menu"}
            >
              {isOpen ? <X className="menu-icon" /> : <Menu className="menu-icon" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <motion.div
          initial={false}
          animate={{ height: isOpen ? "auto" : 0 }}
          className="mobile-menu"
        >
          <ul className="mobile-nav-links">
            <li><a href="#features" className="mobile-nav-link" onClick={() => setIsOpen(false)}>Features</a></li>
          </ul>
          <div className="mobile-auth-buttons">
            <button
              onClick={() => handleNavigation("/signup")}
              className="mobile-signup-btn"
            >
              Sign Up
            </button>
            <button
              onClick={() => handleNavigation("/login")}
              className="mobile-login-btn"
            >
              Sign In
            </button>
          </div>
        </motion.div>
      </nav>
    </motion.header>
  );
};

export default Header;