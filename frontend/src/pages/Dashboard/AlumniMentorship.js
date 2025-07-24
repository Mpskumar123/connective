import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import Navbar from '../../components/shared/Navbar';
import { Users, MessageSquare, Calendar } from 'lucide-react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const AlumniMentorship = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const decoded = jwtDecode(token);
    const mentorId = decoded.userId;

    console.log("🔍 Mentor ID from token:", mentorId); // <-- Debugging line

    axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/mentor/requests/${mentorId}`)
      .then(res => {
        console.log("✅ Fetched mentorship requests:", res.data.requests); // Optional: Log the response
        setRequests(res.data.requests);
      })
      .catch(err => console.error("❌ Failed to fetch mentorship requests", err));
  }, []);

  const handleAccept = (requestId) => {
    axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/mentor/accept/${requestId}`)
      .then(() => {
        alert("✅ Request accepted!");
        setRequests(prev => prev.filter(r => r._id !== requestId));
      })
      .catch(err => console.error("❌ Error accepting request", err));
  };


  return (
    <div className="flex">
      {/* Sidebar */}
      

      {/* Main Content */}
      <div className="ml-64 p-6 bg-gray-100 min-h-screen w-full">
        {/* Animated Heading */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center mb-6"
        >
          🎓 Mentorship Program
        </motion.h1>

        {/* Mentorship Dashboard */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
        >
          {/* Active Mentees */}
<motion.div variants={cardVariants} className="bg-white p-6 rounded-lg shadow-md">
  <h2 className="text-lg font-semibold mb-4">Active Mentees</h2>
  <div className="space-y-4">
    {requests.filter(req => req.status === 'accepted').length === 0 ? (
      <p className="text-gray-600">No active mentees yet.</p>
    ) : (
      requests
        .filter(req => req.status === 'accepted')
        .map((req) => (
          <motion.div key={req._id} whileHover={{ scale: 1.02 }} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="font-medium">{req.studentName}</p>
              <p className="text-sm text-gray-600">{req.studentEmail}</p>
            </div>
            <button className="ml-auto text-blue-600 hover:text-blue-700">
              <MessageSquare className="w-5 h-5" />
            </button>
          </motion.div>
        ))
    )}
  </div>
</motion.div>


          {/* Upcoming Sessions */}
          <motion.div variants={cardVariants} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Upcoming Sessions</h2>
            <div className="space-y-4">
              {[1, 2].map((session) => (
                <motion.div key={session} whileHover={{ scale: 1.02 }} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Career Guidance Session</p>
                    <p className="text-sm text-gray-600">Tomorrow at 3:00 PM</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Mentorship Stats */}
          <motion.div variants={cardVariants} className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold mb-4">Your Impact</h2>
            <div className="space-y-6">
              <motion.div whileHover={{ scale: 1.02 }}>
                <p className="text-3xl font-bold text-blue-600">24</p>
                <p className="text-gray-600">Total Sessions Conducted</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }}>
                <p className="text-3xl font-bold text-green-600">15</p>
                <p className="text-gray-600">Students Mentored</p>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }}>
                <p className="text-3xl font-bold text-purple-600">4.8/5</p>
                <p className="text-gray-600">Average Rating</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Pending Requests */}
<motion.div variants={cardVariants} className="bg-white p-6 rounded-lg shadow-md">
  <h2 className="text-lg font-semibold mb-4">Pending Requests</h2>
  {requests.filter(req => req.status === 'pending').length === 0 ? (
    <p className="text-gray-600">No pending requests.</p>
  ) : (
    <div className="space-y-4">
      {requests
        .filter(req => req.status === 'pending')
        .map((req) => (
          <motion.div
            key={req._id}
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition"
          >
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="font-medium">{req.studentName}</p>
              <p className="text-sm text-gray-600">{req.studentEmail}</p>
            </div>
            <button
              className="ml-auto bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
              onClick={() => handleAccept(req._id)}
            >
              Accept
            </button>
          </motion.div>
        ))}
    </div>
  )}
</motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AlumniMentorship;
