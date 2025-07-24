
import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowDown } from "lucide-react";
import "./Banner.css";

/**
 * Enhanced Banner component with advanced glassmorphism UI/UX
 * @param {Object} props - Component props
 * @param {Function} props.onExploreClick - Function to handle explore button click
 * @returns {JSX.Element} Banner component
 */
const Banner = ({ onExploreClick }) => {
  const navigate = useNavigate();
  const bannerRef = useRef(null);
  
  // Create floating particles for enhanced visual effect
  useEffect(() => {
    if (!bannerRef.current) return;
    
    const banner = bannerRef.current;
    const particles = [];
    const particleCount = 5;
    
    // Remove any existing particles first
    const existingParticles = banner.querySelectorAll('.floating-particle');
    existingParticles.forEach(particle => particle.remove());
    
    // Create new particles
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('floating-particle');
      
      // Random size between 30px and 80px
      const size = Math.floor(Math.random() * 50) + 30;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random position
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      
      // Random opacity for varied glass effect
      particle.style.opacity = (Math.random() * 0.5 + 0.3).toString();
      
      // Add to banner
      banner.appendChild(particle);
      particles.push(particle);
      
      // Simple CSS animation for floating effect
      particle.style.animation = `float${i} ${Math.random() * 10 + 15}s ease-in-out infinite`;
      
      // Create unique keyframe animation for this particle
      const keyframes = `
        @keyframes float${i} {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(${Math.random() * 80 - 40}px, ${Math.random() * 80 - 40}px) rotate(${Math.random() * 20}deg);
          }
          66% {
            transform: translate(${Math.random() * 80 - 40}px, ${Math.random() * 80 - 40}px) rotate(${Math.random() * 20}deg);
          }
        }
      `;
      
      const styleElement = document.createElement('style');
      styleElement.innerHTML = keyframes;
      document.head.appendChild(styleElement);
    }
    
    // Cleanup on unmount
    return () => {
      particles.forEach(particle => particle.remove());
      document.querySelectorAll('style').forEach(style => {
        if (style.innerHTML.includes('keyframes float')) {
          style.remove();
        }
      });
    };
  }, []);

  return (
    <div className="banner-section" ref={bannerRef}>
      {/* Subtle overlay instead of solid background */}
      <div className="banner-overlay"></div>
      
      {/* Main content */}
      <div className="content-wrapper">
        {/* Text content with animations and glassmorphism */}
        <motion.div
          className="banner-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="banner-heading">
            Connect with Alumni,
            <br />
            <span className="highlight-text">Shape Your Future</span>
          </h1>
          
          <p className="banner-description">
            Join our community of students and alumni to unlock opportunities,
            gain insights, and build lasting connections.
          </p>
          
          {/* Call-to-action buttons */}
          <div className="banner-buttons">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/signup")}
              className="btn-primary"
            >
              Get Started
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onExploreClick}
              className="btn-secondary"
            >
              Learn More
            </motion.button>
          </div>
        </motion.div>
        
        {/* Enhanced glassmorphism decorative elements */}
        <div className="glass-decorations">
          <motion.div 
            className="glass-circle"
            animate={{ 
              y: [0, -15, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="glass-square"
            animate={{ 
              y: [0, 15, 0],
              rotate: [15, 25, 15]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
          <motion.div 
            className="glass-rectangle"
            animate={{ 
              y: [0, 10, 0],
              rotate: [-10, -15, -10]
            }}
            transition={{ 
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="explore-section">
        <motion.button
          onClick={onExploreClick}
          animate={{ y: [0, 10, 0] }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="explore-button"
        >
          <span>Explore More</span>
          <ArrowDown className="arrow-icon" />
        </motion.button>
      </div>
    </div>
  );
};

export default Banner;