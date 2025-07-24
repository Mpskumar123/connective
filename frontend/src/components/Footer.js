import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Mail, Phone, MapPin, ExternalLink, Twitter, Linkedin, Facebook } from "lucide-react";

const Footer = ({ onTermsClick, onPrivacyClick }) => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  // Custom gradient style
  const gradientStyle = {
    background: 'linear-gradient(135deg, #5643e4 0%, #8837e9 100%)',
  };

  const footerSections = [
    {
      title: "Company",
      links: ["About Us", "Blog"],
      handlers: [
        () => navigate("/about"),
        () => navigate("/blog")
      ]
    },
    {
      title: "Resources",
      links: ["Privacy Policy", "Terms of Service"],
      handlers: [null, onPrivacyClick, onTermsClick] // ADD HANDLERS
    },
    {
      title: "Contact",
      items: [
        { icon: <Mail className="h-5 w-5" />, text: "connectyou83@gmail.com" },
        { icon: <Phone className="h-5 w-5" />, text: "+91 9392479356" },
        { icon: <MapPin className="h-5 w-5" />, text: "LPU, Punjab" },
      ],
    },
  ];

  return (
    <footer className="text-white py-16" style={gradientStyle}>
      <motion.div 
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Section */}
          <motion.div variants={itemVariants} className="md:col-span-1">
            <div className="flex items-center mb-6">
              <div className="bg-white p-2 rounded-lg shadow-lg">
                <GraduationCap className="h-8 w-8" style={{ color: '#5643e4' }} />
              </div>
              <span className="ml-3 text-2xl font-bold">ConnectYou</span>
            </div>
            <p className="text-gray-100 mb-6">
              Connecting students with alumni for better career opportunities and mentorship.
            </p>
            <div className="flex space-x-4 mt-6">
              <motion.a 
                href="https://x.com/ConnectYou81937" 
                whileHover={{ y: -3 }}
                className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-all"
              >
                <Twitter className="h-5 w-5" />
              </motion.a>
              <motion.a 
                href="https://www.facebook.com/share/19AR6K9oTq/" 
                whileHover={{ y: -3 }}
                className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-all"
              >
                <Facebook className="h-5 w-5" />
              </motion.a>
              <motion.a 
                href="https://www.linkedin.com/in/connect-you-865a3b365/" 
                whileHover={{ y: -3 }}
                className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-all"
              >
                <Linkedin className="h-5 w-5" />
              </motion.a>
              <motion.a 
                href="#" 
                whileHover={{ y: -3 }}
                className="bg-white bg-opacity-20 p-2 rounded-full hover:bg-opacity-30 transition-all"
              >
                <ExternalLink className="h-5 w-5" />
              </motion.a>
            </div>
          </motion.div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <motion.div key={index} variants={itemVariants} className="md:col-span-1">
              <h3 className="text-lg font-semibold mb-6 relative">
                {section.title}
                <span className="absolute -bottom-2 left-0 w-12 h-1 bg-white rounded-full"></span>
              </h3>
              <ul className="space-y-4">
                {"links" in section
                  ? section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <motion.a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (section.handlers && section.handlers[linkIndex]) {
                              section.handlers[linkIndex]();
                            }
                          }}
                          whileHover={{ x: 5 }}
                          className="text-gray-200 hover:text-white transition-colors flex items-center cursor-pointer"
                        >
                          <span className="mr-2 text-sm">→</span>
                          {link}
                        </motion.a>
                      </li>
                    ))
                  : section.items?.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center space-x-3 text-gray-200 hover:text-white transition-colors">
                        <div className="bg-white bg-opacity-20 p-2 rounded-full">
                          {item.icon}
                        </div>
                        <span>{item.text}</span>
                      </li>
                    ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <motion.div 
          variants={itemVariants}
          className="mt-16 pt-8 border-t border-white border-opacity-20"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-200 text-sm">
              © {currentYear} ConnectYou. All rights reserved.
            </p>
            <div className="mt-6 md:mt-0">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/signup")}
                className="bg-white text-gray-900 px-8 py-3 rounded-full font-medium hover:bg-opacity-90 transition-all"
              >
                Join Now
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
};

export default Footer;