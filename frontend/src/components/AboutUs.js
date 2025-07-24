import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, GraduationCap, Users, Target, Award, Lightbulb, Heart, Mail, Home, Globe, BookOpen, Phone, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutUs = () => {
  const navigate = useNavigate();

  // Configure your landing page URL here
  const LANDING_PAGE_URL = '/';

  const gradientStyle = {
    background: 'linear-gradient(135deg, #5643e4 0%, #8837e9 100%)',
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const slideInVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.7, ease: "easeOut" }
    }
  };

  const scaleInVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const teamStaggerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const Header = ({ title, icon }) => (
    <motion.div 
      className="text-center mb-12"
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
    >
      <div className="flex justify-center mb-6">
        <div className="bg-white p-4 rounded-full shadow-lg">
          {icon}
        </div>
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
      <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full"></div>
    </motion.div>
  );

  const Section = ({ title, children, icon }) => (
    <motion.div 
      className="mb-16"
      variants={fadeInVariants}
    >
      <motion.div className="flex items-center justify-center mb-8" variants={slideInVariants}>
        {icon && <div className="mr-3 text-purple-600">{icon}</div>}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center">{title}</h2>
      </motion.div>
      <motion.div className="text-gray-600 leading-relaxed space-y-6" variants={fadeInVariants}>
        {children}
      </motion.div>
    </motion.div>
  );

  const TeamMember = ({ name, role, location, university, year, image, email }) => (
    <motion.div 
      className="group relative"
      variants={scaleInVariants}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.3 }
      }}
    >
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden transform transition-all duration-500 hover:shadow-2xl">
        {/* Animated Background */}
        <div className="relative p-8 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 overflow-hidden">
          {/* Floating Elements */}
          <div className="absolute top-4 right-4 opacity-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <GraduationCap className="h-8 w-8 text-purple-600" />
            </motion.div>
          </div>
          
          {/* Profile Image Container */}
          <div className="flex justify-center mb-6">
            <motion.div 
              className="relative"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Animated Ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-gradient-to-r from-purple-400 to-blue-400"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                style={{
                  background: 'conic-gradient(from 0deg, #a855f7, #3b82f6, #a855f7)',
                  padding: '4px',
                  borderRadius: '50%'
                }}
              >
                <div className="w-full h-full bg-white rounded-full"></div>
              </motion.div>
              
              {/* Profile Image */}
              <div className="relative z-10">
                <img 
                  src={image || 'https://via.placeholder.com/120'} 
                  alt={name}
                  className="h-28 w-28 sm:h-32 sm:w-32 lg:h-36 lg:w-36 rounded-full border-4 border-white object-cover shadow-2xl relative z-10" 
                />
                
                {/* Status Badge */}
                <motion.div 
                  className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full p-3 shadow-lg z-20"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      "0 4px 20px rgba(16, 185, 129, 0.3)",
                      "0 8px 30px rgba(16, 185, 129, 0.5)",
                      "0 4px 20px rgba(16, 185, 129, 0.3)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <GraduationCap className="h-4 w-4 text-white" />
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Member Info */}
          <motion.div 
            className="text-center space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 group-hover:text-purple-600 transition-colors duration-300">
              {name}
            </h3>
            <motion.div 
              className="space-y-2"
              variants={staggerVariants}
            >
              <motion.p className="text-purple-600 font-semibold text-lg" variants={fadeInVariants}>
                {role}
              </motion.p>
              <motion.div className="text-sm text-gray-600 space-y-1" variants={fadeInVariants}>
                <p className="font-medium">{university} {year}</p>
                <p className="flex items-center justify-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {location}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Contact Button */}
          <motion.div 
            className="flex justify-center mt-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.a
              href={`mailto:${email}`}
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2 font-medium"
              whileHover={{ 
                boxShadow: "0 10px 30px rgba(139, 69, 19, 0.3)" 
              }}
            >
              <Mail className="h-4 w-4" />
              <span>Contact</span>
            </motion.a>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );

  const BackToHomeButton = () => (
    <motion.button
      onClick={() => navigate(LANDING_PAGE_URL)}
      className="flex items-center bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl mb-6 border border-white/30"
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      variants={scaleInVariants}
    >
      <Home className="mr-2 h-5 w-5" />
      <span className="font-semibold">Back to Home</span>
    </motion.button>
  );

  const teamMembers = [
    {
      name: "Sai Kiran Gavvala",
      role: "CSE Student",
      university: "LPU",
      year: "2025",
      location: "Andhra Pradesh",
      image: "https://i.ibb.co/Jj8z8TYB/image.jpg",
      email: "kirangavvala078@gmail.com"
    },
    {
      name: "Sudarshan Reddy",
      role: "CSE Student", 
      university: "LPU",
      year: "2025",
      location: "Andhra Pradesh",
      image: "https://i.ibb.co/xKnhXK3f/image.jpg",
      email: "jsudrashanreddy2003@gmail.com"
    },
    {
      name: "Sai Kumar Reddy",
      role: "CSE Student",
      university: "LPU", 
      year: "2025",
      location: "Andhra Pradesh",
      image: "https://i.ibb.co/tdd8s0t/image.jpg",
      email: "puttasaikumarreddy143@gmail.com"
    },
    {
      name: "Mahendra Boneni",
      role: "CSE Student",
      university: "LPU",
      year: "2025", 
      location: "Andhra Pradesh",
      image: "https://i.ibb.co/k2NYwLBF/image.jpg",
      email: "bonenimahendrayadav@gmail.com"
    },
    {
      name: "Vishnu Vardhan",
      role: "Student",
      university: "LPU",
      year: "2025",
      location: "Andhra Pradesh", 
      image: "https://i.ibb.co/yJ6dm2w/image.jpg",
      email: "avishnuvardhan546@gmail.com"
    }
  ];

  const ContactCard = ({ icon, title, content, link, gradient }) => (
    <motion.div 
      className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500"
      variants={scaleInVariants}
      whileHover={{ 
        y: -10,
        transition: { duration: 0.3 }
      }}
    >
      <div className="p-8 text-center relative overflow-hidden">
        {/* Background Animation */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
          style={{ background: gradient }}
        />
        
        {/* Icon */}
        <motion.div 
          className="mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center shadow-lg relative z-10"
          style={{ background: gradient }}
          whileHover={{ 
            scale: 1.1,
            rotate: 5 
          }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {icon}
          </motion.div>
        </motion.div>

        {/* Content */}
        <motion.div variants={fadeInVariants}>
          <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-purple-600 transition-colors duration-300">
            {title}
          </h3>
          
          {link ? (
            <motion.a 
              href={link}
              className="text-purple-600 hover:text-purple-800 transition-colors duration-300 font-medium break-all hover:underline"
              whileHover={{ scale: 1.05 }}
            >
              {content}
            </motion.a>
          ) : (
            <p className="text-gray-600 font-medium">{content}</p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="text-white py-16 sm:py-20 lg:py-28 relative overflow-hidden" style={gradientStyle}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white/10 rounded-full"
              style={{
                width: Math.random() * 100 + 20,
                height: Math.random() * 100 + 20,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerVariants}
          >
            <motion.div 
              className="flex justify-center mb-8"
              variants={scaleInVariants}
            >
              <motion.div 
                className="bg-white/20 backdrop-blur-sm p-6 rounded-full border border-white/30"
                animate={{ 
                  boxShadow: [
                    "0 0 30px rgba(255,255,255,0.3)",
                    "0 0 60px rgba(255,255,255,0.5)",
                    "0 0 30px rgba(255,255,255,0.3)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <GraduationCap className="h-12 w-12 sm:h-16 sm:w-16 text-white" />
              </motion.div>
            </motion.div>
            
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8"
              variants={fadeInVariants}
            >
              About ConnectYou
            </motion.h1>
            
            <motion.p 
              className="text-lg sm:text-xl lg:text-2xl text-gray-100 max-w-3xl mx-auto mb-12 px-4 leading-relaxed"
              variants={slideInVariants}
            >
              Bridging the gap between students and alumni to create meaningful connections and opportunities
            </motion.p>
            
            <BackToHomeButton />
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={staggerVariants}
          className="bg-white rounded-3xl p-8 sm:p-12 lg:p-16 shadow-2xl relative overflow-hidden"
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a855f7' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <Section title="Our Mission" icon={<Target className="h-6 w-6" />}>
            <motion.p variants={fadeInVariants} className="text-lg">
              At ConnectYou, our mission is to empower students by connecting them with successful alumni who can provide guidance, mentorship, and career opportunities. We believe that the knowledge and experience of alumni are invaluable resources that can help shape the future of current students.
            </motion.p>
            <motion.p variants={fadeInVariants} className="text-lg">
              We strive to create a supportive community where meaningful connections flourish, knowledge is shared freely, and opportunities are accessible to all students regardless of their background or circumstances.
            </motion.p>
          </Section>

          <Section title="Our Story" icon={<BookOpen className="h-6 w-6" />}>
            <motion.p variants={fadeInVariants} className="text-lg">
              ConnectYou was founded in 2024 by a group of recent graduates who recognized the challenges students face when transitioning from academic life to professional careers. Having experienced these challenges firsthand, they envisioned a platform that would bridge the gap between educational institutions and the professional world.
            </motion.p>
            <motion.p variants={fadeInVariants} className="text-lg">
              What started as a small project at Lovely Professional University has now grown into a comprehensive platform serving multiple educational institutions across the country. Our journey has been guided by feedback from both students and alumni, allowing us to continuously improve and expand our services.
            </motion.p>
          </Section>

          <Section title="Our Values" icon={<Heart className="h-6 w-6" />}>
            <motion.div 
              className="grid sm:grid-cols-2 gap-8"
              variants={staggerVariants}
            >
              {[
                { title: "Connection", desc: "We believe in the power of meaningful connections to transform lives and careers.", color: "purple" },
                { title: "Mentorship", desc: "We value the guidance and wisdom that comes from experienced mentors.", color: "blue" },
                { title: "Opportunity", desc: "We are committed to creating equal access to opportunities for all students.", color: "green" },
                { title: "Innovation", desc: "We continuously innovate to better serve our community's evolving needs.", color: "yellow" }
              ].map((value, index) => (
                <motion.div 
                  key={index}
                  className={`bg-${value.color}-50 p-8 rounded-2xl border-l-4 border-${value.color}-500 hover:shadow-lg transition-all duration-300`}
                  variants={scaleInVariants}
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <h3 className="font-bold text-gray-800 mb-3 text-xl">{value.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{value.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </Section>

          <Section title="What We Offer" icon={<Lightbulb className="h-6 w-6" />}>
            <motion.div 
              className="grid sm:grid-cols-2 gap-8"
              variants={staggerVariants}
            >
              {[
                { icon: Users, title: "Mentorship Programs", desc: "Connect with alumni mentors who can provide guidance, advice, and support in your academic and career journey.", color: "purple" },
                { icon: Award, title: "Job Opportunities", desc: "Access exclusive job postings, internships, and career opportunities shared by our alumni network.", color: "blue" },
                { icon: BookOpen, title: "E-Learning Resources", desc: "Enhance your skills with courses, workshops, and learning materials created by experienced professionals.", color: "green" },
                { icon: Users, title: "Networking Events", desc: "Participate in virtual and in-person events designed to help you build your professional network.", color: "yellow" }
              ].map((item, index) => (
                <motion.div 
                  key={index}
                  className="flex items-start space-x-4 p-6 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-300"
                  variants={slideInVariants}
                  whileHover={{ x: 10 }}
                >
                  <motion.div 
                    className={`bg-${item.color}-100 p-3 rounded-full mt-1 flex-shrink-0`}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                  >
                    <item.icon className={`h-6 w-6 text-${item.color}-600`} />
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-gray-800 mb-2 text-lg">{item.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </Section>

          <Section title="Our Team" icon={<Users className="h-6 w-6" />}>
            <motion.p 
              className="text-center mb-12 text-xl text-gray-600"
              variants={fadeInVariants}
            >
              Meet the dedicated students behind ConnectYou
            </motion.p>
            
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8"
              variants={teamStaggerVariants}
            >
              {teamMembers.map((member, index) => (
                <TeamMember 
                  key={index}
                  name={member.name}
                  role={member.role}
                  university={member.university}
                  year={member.year}
                  location={member.location}
                  image={member.image}
                  email={member.email}
                />
              ))}
            </motion.div>
          </Section>

          <Section title="Contact Us" icon={<Mail className="h-6 w-6" />}>
            <div className="bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 p-12 rounded-3xl border border-purple-100 relative overflow-hidden">
              {/* Background Animation */}
              <motion.div
                className="absolute inset-0 opacity-10"
                animate={{
                  background: [
                    "radial-gradient(circle at 20% 80%, #a855f7 0%, transparent 50%)",
                    "radial-gradient(circle at 80% 20%, #3b82f6 0%, transparent 50%)",
                    "radial-gradient(circle at 40% 40%, #a855f7 0%, transparent 50%)",
                  ]
                }}
                transition={{ duration: 10, repeat: Infinity }}
              />

              <motion.div 
                className="text-center mb-12 relative z-10"
                variants={fadeInVariants}
              >
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Get In Touch</h3>
                <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
                  Have questions or want to learn more about ConnectYou? We'd love to hear from you!
                </p>
              </motion.div>
              
              <motion.div 
                className="grid md:grid-cols-3 gap-8 mb-12"
                variants={staggerVariants}
              >
                <ContactCard
                  icon={<Mail className="h-8 w-8 text-white" />}
                  title="Email"
                  content="connectyou83@gmail.com"
                  link="mailto:connectyou83@gmail.com"
                  gradient="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                />
                
                <ContactCard
                  icon={<Phone className="h-8 w-8 text-white" />}
                  title="Phone"
                  content="+91 9392479356"
                  link="tel:+919392479356"
                  gradient="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
                />
                
                <ContactCard
                  icon={<MapPin className="h-8 w-8 text-white" />}
                  title="Address"
                  content="LPU, Punjab"
                  gradient="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
                />
              </motion.div>

              <motion.div 
                className="text-center relative z-10"
                variants={scaleInVariants}
              >
                <motion.button
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 20px 40px rgba(139, 69, 19, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-12 py-5 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-xl font-bold text-lg relative overflow-hidden"
                  onClick={() => window.location.href = "mailto:connectyou83@gmail.com"}
                >
                  <motion.span
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10 flex items-center">
                    <Mail className="mr-3 h-5 w-5" />
                    Get in Touch
                  </span>
                </motion.button>
              </motion.div>
            </div>
          </Section>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;