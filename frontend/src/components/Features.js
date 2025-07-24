import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MessageSquare, Calendar, Award, Target } from 'lucide-react';

interface FeaturesProps {
  showCards: boolean;
}

const Features: React.FC<FeaturesProps> = ({ showCards }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: 'Real-time Chat',
      description: 'Connect instantly with alumni through our secure messaging platform.',
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: 'Event Scheduling',
      description: 'Easily schedule mentoring sessions and networking events.',
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: 'Skill Development',
      description: 'Access resources and workshops to enhance your professional skills.',
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: 'Goal Tracking',
      description: 'Set and track your career goals with guidance from mentors.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  // Purple gradient background with the specified colors
  const gradientStyle = {
    background: `linear-gradient(135deg, #5643e4 0%, #8837e9 100%)`,
  };

  return (
    <div ref={ref} className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
          Powerful <span style={{ color: '#5643e4' }}>Features</span>
        </h2>
        <p className="max-w-2xl mx-auto text-xl text-gray-500">
          Everything you need to connect, learn, and grow your professional network
        </p>
      </div>
      
      {showCards && (
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.05, transition: { duration: 0.3 } }}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-2 h-full" style={gradientStyle}></div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 w-14 h-14 rounded-full flex items-center justify-center" style={gradientStyle}>
                  <div className="text-white">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default Features;