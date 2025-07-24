import React, { useEffect, useState, useRef } from 'react';
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion';
import { ArrowRight, Play, ChevronLeft, ChevronRight, Star, Users, BookOpen, Trophy, Sparkles, Mail, Linkedin, Twitter, Github, Briefcase, Laptop } from 'lucide-react';
import { TypeAnimation } from 'react-type-animation';
import Header from './Header';
import Footer from './Footer';
import Banner from './Banner';
import Overview from './Overview';
import Features from './Features';
import AlumniShowcase from './AlumniShowcase';
import './LandingPage.css';
import FooterPages from './FooterPages';

const AnimatedLandingPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const featuresRef = useRef(null);
  const controls = useAnimation();
  const isInView = useInView(featuresRef, { once: true, amount: 0.1 });
  const textRef = useRef(null);
  const [isHovered, setIsHovered] = useState(null);
  const [showLegalPages, setShowLegalPages] = useState(false);
  const [legalPageType, setLegalPageType] = useState('terms');

  const handleShowTerms = () => {
    setLegalPageType('terms');
    setShowLegalPages(true);
    window.scrollTo(0, 0);
  };

  const handleShowPrivacy = () => {
    setLegalPageType('privacy');
    setShowLegalPages(true);
    window.scrollTo(0, 0);
  };

  const handleCloseLegalPages = () => {
    setShowLegalPages(false);
  };

  // Updated slides with alumni-student connection images
  const slides = [
    {
      title: "Connect with Alumni",
      subtitle: "Bridge the gap between students and professionals through our AI-powered mentorship matching",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      gradient: "from-blue-600 to-purple-700"
    },
    {
      title: "Career Opportunities",
      subtitle: "Get access to exclusive job postings and internships from alumni networks",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      gradient: "from-purple-600 to-pink-700"
    },
    {
      title: "Lifelong Connections",
      subtitle: "Create meaningful relationships that last beyond your university years",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      gradient: "from-pink-600 to-orange-700"
    }
  ];

  // Updated testimonials from the report context
  const testimonials = [
    { 
      name: "Sarah Johnson", 
      role: "Software Engineer at Google", 
      quote: "ConnectYou's mentorship program helped me transition smoothly from campus to corporate life. The guidance I received from alumni was invaluable!" 
    },
    { 
      name: "Michael Chen", 
      role: "Product Manager at Meta", 
      quote: "As an alumnus, I love giving back to my alma mater. The platform makes it so easy to connect with talented students and offer career advice." 
    },
    { 
      name: "Emily Davis", 
      role: "Data Scientist at Netflix", 
      quote: "Through ConnectYou, I found my dream internship that turned into a full-time offer. The alumni network is incredibly supportive." 
    }
  ];

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);

    if (isInView) {
      controls.start("visible");
    }

    return () => {
      clearInterval(slideTimer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isInView]);

  const handleExploreClick = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Animation variants
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut"
      }
    }
  };

  const slideUpVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: "easeOut"
      }
    })
  };

  const cardVariants = {
    offscreen: {
      y: 100,
      opacity: 0
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        bounce: 0.4,
        duration: 0.8
      }
    }
  };

  const bigTextReveal = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: [0.2, 0.65, 0.3, 0.9]
      }
    }
  };

  const scrollTextVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: "easeOut"
      }
    })
  };

  const featureHoverVariants = {
    initial: { width: "0%" },
    hover: { width: "100%" }
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      {showLegalPages ? (
        <div>
          <FooterPages 
            initialPage={legalPageType}
            onBack={handleCloseLegalPages}
          />
        </div>
      ) : (
        <>
          {/* Header */}
          <Header />
          
          {/* Hero Slideshow Section */}
          <section className="relative h-screen flex items-center justify-center overflow-hidden">
            <AnimatePresence mode='wait'>
              <motion.div
                key={currentSlide}
                className="absolute inset-0 transition-all duration-1000 ease-in-out"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].gradient} opacity-90`} />
                <motion.img
                  src={slides[currentSlide].image}
                  alt="Hero"
                  className="w-full h-full object-cover transition-all duration-1000 ease-in-out"
                  style={{ transform: `scale(${1 + scrollY * 0.0005})` }}
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 5, ease: "linear" }}
                />
              </motion.div>
            </AnimatePresence>
            
            {/* Animated particles */}
            <div className="absolute inset-0">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-white/20 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -20, 0],
                    rotate: [0, 180, 360],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 3 + Math.random() * 4,
                    repeat: Infinity,
                    repeatType: "reverse",
                    delay: Math.random() * 2
                  }}
                />
              ))}
            </div>

            <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
              <motion.div 
                key={currentSlide}
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.2,
                      delayChildren: 0.3
                    }
                  }
                }}
              >
                <motion.h1 
                  className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
                  ref={textRef}
                >
                  <motion.span 
                    className="inline-block"
                    variants={bigTextReveal}
                  >
                    {slides[currentSlide].title.split(' ')[0]}
                  </motion.span>
                  <br />
                  <motion.span 
                    className="inline-block bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent"
                    variants={bigTextReveal}
                    transition={{ delay: 0.2 }}
                  >
                    {slides[currentSlide].title.split(' ').slice(1).join(' ')}
                  </motion.span>
                </motion.h1>
                <motion.p 
                  className="text-xl md:text-2xl mb-8 text-gray-200"
                  variants={textVariants}
                >
                  {slides[currentSlide].subtitle}
                </motion.p>
                <motion.div 
                  className="flex flex-col sm:flex-row gap-4 justify-center"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: {
                        staggerChildren: 0.1,
                        delayChildren: 0.6
                      }
                    }
                  }}
                >
                  <motion.button 
                    onClick={handleExploreClick}
                    className="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-xl"
                    variants={textVariants}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Explore Platform
                  </motion.button>
                </motion.div>
              </motion.div>
            </div>

            {/* Slide Navigation */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {slides.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-white scale-125' : 'bg-white/50'
                  }`}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-20 bg-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50" />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={{
                  hidden: {},
                  visible: {
                    transition: {
                      staggerChildren: 0.1
                    }
                  }
                }}
              >
                {[
                  { number: '10K+', label: 'Alumni Connected' },
                  { number: '5K+', label: 'Mentorship Sessions' },
                  { number: '2K+', label: 'Job Opportunities' },
                  { number: '95%', label: 'User Satisfaction' }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    className="text-center group"
                    variants={slideUpVariants}
                    custom={index}
                  >
                    <motion.div 
                      className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300"
                      initial={{ scale: 0.8 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ 
                        delay: index * 0.1,
                        type: "spring",
                        stiffness: 100
                      }}
                    >
                      <TypeAnimation
                        sequence={[0, stat.number]}
                        cursor={false}
                        speed={20}
                      />
                    </motion.div>
                    <motion.div 
                      className="text-gray-600 font-medium"
                      variants={scrollTextVariants}
                      custom={index}
                    >
                      {stat.label}
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>

          {/* Overview Section */}
          <motion.section 
            className="py-20 bg-gray-50"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.8,
                  ease: "easeOut"
                }
              }
            }}
          >
            
                
          </motion.section>

          {/* Features Section */}
          <motion.section 
            ref={featuresRef}
            className="py-20 bg-white"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  duration: 0.8,
                  ease: "easeOut"
                }
              }
            }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div 
                className="text-center mb-16"
                initial="hidden"
                animate={controls}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      staggerChildren: 0.2
                    }
                  }
                }}
              >
                <motion.h2 
                  className="text-4xl md:text-5xl font-bold mb-6"
                  variants={bigTextReveal}
                >
                  Powerful 
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Features</span>
                </motion.h2>
                <motion.p 
                  className="text-xl text-gray-600 max-w-3xl mx-auto"
                  variants={textVariants}
                >
                  Transform your career journey with our comprehensive platform
                </motion.p>
              </motion.div>
              
              {/* Enhanced Features Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                 {
                  title: "Real-Time Collaboration Hub",
                  description: "Empower students and alumni to co-create through live project boards, shared workspaces, and integrated task tracking for mentorship-driven innovation.",
                  icon: <Laptop className="w-8 h-8" />
                },
                
                  {
                    title: "Secure Messaging",
                    description: "End-to-end encrypted communication for private mentorship conversations",
                    icon: <Mail className="w-8 h-8" />
                  },
                  {
                    title: "Job Board",
                    description: "Exclusive access to job and internship opportunities posted by alumni",
                    icon: <Trophy className="w-8 h-8" />
                  },
                  {
                    title: "Event Management",
                    description: "Virtual and in-person events to facilitate networking and knowledge sharing",
                    icon: <Users className="w-8 h-8" />
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md"
                    initial="initial"
                    whileHover="hover"
                    onHoverStart={() => setIsHovered(index)}
                    onHoverEnd={() => setIsHovered(null)}
                    variants={{
                      initial: { y: 0 },
                      hover: { y: -10 }
                    }}
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-600" />
                    <div className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                          {feature.icon}
                        </div>
                      </div>
                      <motion.h3 
                        className="text-xl font-bold mb-2"
                        initial={{ color: "#111827" }}
                        animate={isHovered === index ? { color: "#2563eb" } : { color: "#111827" }}
                        transition={{ duration: 0.3 }}
                      >
                        {feature.title}
                      </motion.h3>
                      <motion.p 
                        className="text-gray-600 mb-4"
                        initial={{ opacity: 1 }}
                        animate={isHovered === index ? { opacity: 0.8 } : { opacity: 1 }}
                      >
                        {feature.description}
                      </motion.p>
                    </div>
                    <motion.div
                      className="absolute bottom-0 left-0 h-1 bg-blue-600"
                      variants={featureHoverVariants}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* Alumni Showcase */}
          <motion.section 
            className="py-20 bg-gradient-to-r from-blue-50 to-purple-50"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: {
                opacity: 1,
                y: 0,
                transition: {
                  duration: 0.8,
                  ease: "easeOut"
                }
              }
            }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <AlumniShowcase />
            </div>
          </motion.section>

          {/* Why Choose ConnectYou Section */}
          <section className="py-20 bg-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 opacity-50" />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div 
                className="text-center mb-16"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">ConnectYou</span>?
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Our innovative platform transforms alumni-student engagement with cutting-edge technology
                </p>
              </motion.div>
              
              <motion.div 
                className="grid md:grid-cols-2 gap-12"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.2
                    }
                  }
                }}
              >
                {/* Left column - Main description */}
                <motion.div
                  variants={fadeInVariants}
                  className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100"
                >
                  <motion.p className="text-gray-700 mb-6 leading-relaxed">
                    ConnectYou is an innovative, digital platform designed to enable and transform alumni-student engagement in universities. We replace fragmented and manual systems with a robust, single destination that utilizes innovative technology, including artificial intelligence, cloud services, and secure authentication.
                  </motion.p>
                  
                  <motion.p className="text-gray-700 mb-6 leading-relaxed">
                    Our platform features an AI-powered mentorship matching engine that connects students and alumni based on educational background, skills, interests, and career aspirations, creating meaningful connections between them.
                  </motion.p>
                  
                  <motion.p className="text-gray-700 leading-relaxed">
                    With a fully end-to-end encrypted messaging system, users can communicate in real-time while maintaining privacy and safety. Our built-in jobs and internships module allows opportunities to be posted directly from alumni and industry professionals, with one-click applications and streamlined applicant review.
                  </motion.p>
                </motion.div>
                
                {/* Right column - Feature cards */}
                <motion.div className="space-y-6">
                  {[
                    {
                      title: "Mentorship Circles",
                      description: "Join or create themed mentorship groups where alumni guide small cohorts of students through discussions, resources, and goal-based learning.",
                      icon: <Users className="w-6 h-6 text-indigo-600" />,
                      delay: 0
                    },
                    
                    {
                      title: "Secure Communication",
                      description: "End-to-end encrypted messaging system for private and safe interactions",
                      icon: <Mail className="w-6 h-6 text-blue-600" />,
                      delay: 0.1
                    },
                    {
                      title: "Streamlined Job Opportunities",
                      description: "One-click applications for positions posted by alumni and professionals",
                      icon: <Briefcase className="w-6 h-6 text-pink-600" />,
                      delay: 0.2
                    },
                    {
                      title: "Scalable & Flexible",
                      description: "Designed to support many concurrent users across multiple institutions",
                      icon: <Users className="w-6 h-6 text-indigo-600" />,
                      delay: 0.3
                    }
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300"
                      variants={fadeInVariants}
                      custom={feature.delay}
                      whileHover={{ y: -5 }}
                    >
                      <div className="flex items-center mb-4">
                        <div className="p-2 rounded-lg bg-gray-50">
                          {feature.icon}
                        </div>
                        <h3 className="ml-4 text-xl font-semibold">{feature.title}</h3>
                      </div>
                      <p className="text-gray-600">{feature.description}</p>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Final CTA Section */}
          <section className="py-20 bg-white relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50" />
            <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
              <motion.h2 
                className="text-4xl md:text-6xl font-bold mb-8"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                Ready to 
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"> Transform</span>
                <br />Your Career?
              </motion.h2>
              <motion.p 
                className="text-xl text-gray-600 mb-12"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Join our growing community of students and alumni building meaningful connections
              </motion.p>
              <motion.div 
                className="flex justify-center"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      delay: 0.4
                    }
                  }
                }}
              >
                <motion.button 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-12 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                  variants={textVariants}
                  whileHover={{ 
                    scale: 1.05,
                    background: "linear-gradient(to right, #4f46e5, #7c3aed, #9333ea)"
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started Now
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </motion.div>
            </div>
          </section>

          {/* Footer */}
          <Footer 
            onTermsClick={handleShowTerms}
            onPrivacyClick={handleShowPrivacy}
          />
        </>
      )}
    </div>
  );
};

export default AnimatedLandingPage;