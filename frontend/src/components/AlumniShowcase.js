import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Linkedin, Twitter, Mail } from 'lucide-react';

const AlumniShowcase = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const alumni = [
    {
      name: "Sai Kiran Gavvala",
      role: "CSE Student",
      university: "LPU",
      year: "2025",
      location: "Andhra Pradesh",
      image: "https://i.ibb.co/Jj8z8TYB/image.jpg",
      email: "kirangavvala078@gmail.com",
      linkedin: "#",
      twitter: "#",
      description: " Skilled in backend development and system integration, with a strong passion for DevOps — secured placement at LTTS.",
    },
    {
      name: "Sudarshan Reddy",
      role: "CSE Student", 
      university: "LPU",
      year: "2025",
      location: "Andhra Pradesh",
      image: "https://i.ibb.co/xKnhXK3f/image.jpg",
      email: "jsudrashanreddy2003@gmail.com",
      linkedin: "https://www.linkedin.com/in/j-sudharshan-reddy",
      twitter: "https://x.com/JSudarshan0?t=BgiQOWbi9FztkSISFMHHrA&s=09",
      description: "Proficient in building interactive frontends and working with DevOps tools, leading to successful placement at Tech Mahindra.",
      
    },
    {
      name: "Sai Kumar Reddy",
      role: "CSE Student",
      university: "LPU", 
      year: "2025",
      location: "Andhra Pradesh",
      image: "https://i.ibb.co/tdd8s0t/image.jpg",
      email: "puttasaikumarreddy143@gmail.com",
      linkedin: "#",
      twitter: "#",
      description: "Skilled in UI/UX and web design with a strong grasp of system architecture. Creativity and technical proficiency led to placement at Accenture.",
      
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.2, 0.65, 0.3, 0.9],
      },
    },
  };

  const slideInFromLeft = {
    hidden: { opacity: 0, x: -100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const slideInFromRight = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const cardHover = {
    scale: 1.03,
    y: -10,
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  };

  const imageHover = {
    scale: 1.1,
    transition: {
      duration: 0.5,
    }
  };

  const pulseAnimation = {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  return (
    <div ref={ref} className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={containerVariants}
        className="text-center mb-20"
      >
        <motion.h2
          variants={slideInFromLeft}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500"
        >
          Our Rising Stars
        </motion.h2>
        <motion.p
          variants={slideInFromRight}
          className="text-xl text-gray-600 max-w-2xl mx-auto"
        >
          Meet the brilliant minds shaping the future of technology
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-12"
      >
        {alumni.map((person, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={cardHover}
            className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:border-blue-100 transition-all duration-300"
          >
            <div className="relative h-80 w-full overflow-hidden group">
              <motion.img
                src={person.image}
                alt={person.name}
                className="w-full h-full object-cover object-center"
                initial={{ scale: 1.1 }}
                animate={inView ? { scale: 1 } : {}}
                whileHover={imageHover}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent"></div>
              <motion.div 
                className="absolute bottom-0 left-0 p-6 w-full"
                initial={{ y: 20 }}
                animate={inView ? { y: 0 } : {}}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <h3 className="text-2xl font-bold text-white">{person.name}</h3>
                <p className="text-blue-200">{person.role}</p>
                <motion.div 
                  className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded-full inline-block"
                  animate={pulseAnimation}
                >
                  {person.placement}
                </motion.div>
              </motion.div>
            </div>
            
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded-full">{person.university}</span>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-xs font-medium rounded-full">Batch {person.year}</span>
                <span className="px-3 py-1 bg-purple-50 text-purple-600 text-xs font-medium rounded-full">{person.location}</span>
              </div>
              
              <p className="text-gray-600 mb-6">{person.description}</p>
              
              <div className="flex space-x-4">
                {person.linkedin && (
                  <motion.a 
                    href={person.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-blue-600 transition-colors"
                    aria-label={`${person.name}'s LinkedIn`}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Linkedin className="h-6 w-6" />
                  </motion.a>
                )}
                {person.twitter && (
                  <motion.a 
                    href={person.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-blue-400 transition-colors"
                    aria-label={`${person.name}'s Twitter`}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Twitter className="h-6 w-6" />
                  </motion.a>
                )}
                {person.email && (
                  <motion.a 
                    href={`mailto:${person.email}`}
                    className="text-gray-500 hover:text-red-500 transition-colors"
                    aria-label={`Email ${person.name}`}
                    whileHover={{ y: -3 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Mail className="h-6 w-6" />
                  </motion.a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default AlumniShowcase;