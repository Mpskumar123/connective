import React from 'react';
import { motion } from "framer-motion";
import Navbar from '../../components/shared/Navbar';
import { BookOpen, Share2, ThumbsUp, MessageSquare, Clock } from 'lucide-react';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const articles = [
  {
    id: 1,
    title: "Career Transition Tips for Tech Industry",
    excerpt: "Key insights from my journey transitioning between different tech roles...",
    likes: 45,
    comments: 12,
    timeAgo: "2 days ago"
  },
  {
    id: 2,
    title: "Building Scalable Systems: Lessons Learned",
    excerpt: "Important considerations when designing systems that need to scale...",
    likes: 89,
    comments: 23,
    timeAgo: "1 week ago"
  }
];

const AlumniKnowledge = () => {
  return (
    <div className="flex">
      {/* Sidebar */}
      <Navbar type="alumni" />

      {/* Main Content */}
      <div className="ml-64 p-6 bg-gray-100 min-h-screen w-full">
        {/* Animated Heading */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center mb-6"
        >
          📖 Knowledge Sharing
        </motion.h1>

        {/* Knowledge Sharing Section */}
        <motion.div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your Contributions</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Share Knowledge
          </motion.button>
        </motion.div>

        <motion.div className="grid grid-cols-1 lg:grid-cols-3 gap-6" initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.2 } } }}>
          {/* Knowledge Stats */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div variants={cardVariants} className="bg-white p-6 rounded-lg shadow-md">
              <BookOpen className="w-6 h-6 text-blue-500 mb-2" />
              <p className="text-3xl font-bold text-blue-600">15</p>
              <p className="text-gray-600">Articles Published</p>
            </motion.div>
            <motion.div variants={cardVariants} className="bg-white p-6 rounded-lg shadow-md">
              <ThumbsUp className="w-6 h-6 text-green-500 mb-2" />
              <p className="text-3xl font-bold text-green-600">324</p>
              <p className="text-gray-600">Total Likes</p>
            </motion.div>
            <motion.div variants={cardVariants} className="bg-white p-6 rounded-lg shadow-md">
              <MessageSquare className="w-6 h-6 text-purple-500 mb-2" />
              <p className="text-3xl font-bold text-purple-600">156</p>
              <p className="text-gray-600">Comments Received</p>
            </motion.div>
          </div>

          {/* Quick Share */}
          <motion.div variants={cardVariants} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Quick Share</h2>
            <textarea 
              className="w-full p-3 border rounded-lg mb-4" 
              placeholder="Share your knowledge or experience..."
              rows="4"
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share Now
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Recent Articles */}
        <motion.div className="mt-8" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.5 } }}>
          <h2 className="text-lg font-semibold mb-4">Your Recent Articles</h2>
          <div className="space-y-4">
            {articles.map(article => (
              <motion.div
                key={article.id}
                whileHover={{ scale: 1.02 }}
                className="bg-white p-6 rounded-lg shadow-md transition"
              >
                <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    {article.likes}
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    {article.comments}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {article.timeAgo}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AlumniKnowledge;
