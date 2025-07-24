
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, Briefcase, BookOpen } from 'lucide-react';

interface OverviewProps {
  showCards: boolean;
}

const Overview: React.FC<OverviewProps> = ({ showCards }) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const cards = [
    {
      icon: <Users className="h-8 w-8 text-blue-600" />,
      title: 'Connect with Alumni',
      description: 'Build meaningful relationships with graduates who share your interests and career goals.',
    },
    {
      icon: <Briefcase className="h-8 w-8 text-blue-600" />,
      title: 'Career Opportunities',
      description: 'Access exclusive job postings and internship opportunities shared by our alumni network.',
    },
    {
      icon: <BookOpen className="h-8 w-8 text-blue-600" />,
      title: 'Mentorship Programs',
      description: 'Get guidance from experienced professionals who can help shape your career path.',
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

  return (
    <div ref={ref} className="max-w-7xl mx-auto">
      <motion.div
        initial="hidden"
        animate={inView ? 'visible' : 'hidden'}
        variants={containerVariants}
        className="text-center mb-16"
      >
        <motion.h2
          variants={itemVariants}
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
        >
          Why Choose ConnectYou?
        </motion.h2>
        <motion.p
          variants={itemVariants}
          className="text-xl text-gray-600 max-w-2xl mx-auto"
        >
          We provide the tools and connections you need to succeed in your career journey.
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate={showCards && inView ? 'visible' : 'hidden'}
        variants={containerVariants}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        {cards.map((card, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className="mb-4">{card.icon}</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{card.title}</h3>
            <p className="text-gray-600">{card.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Overview;