import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import Navbar from '../../components/shared/Navbar';
import { Calendar, MapPin, Clock, Plus, Users, Calendar as CalendarIcon, X, Edit, Trash2, ExternalLink, ChevronRight } from 'lucide-react';
import axios from 'axios';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    } 
  }
};

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  }),
  hover: {
    y: -5,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.3 }
  }
};

const statCardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.6,
      ease: "easeOut"
    }
  }),
  hover: {
    y: -5,
    transition: { duration: 0.3 }
  }
};

const AlumniEvents = () => {
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');
  
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    description: '',
    meetingLink: ''
  });

  const [stats, setStats] = useState({
    upcoming: 0,
    past: 0,
    total: 0
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/events`);
      setEvents(response.data);
      
      const now = new Date();
      const upcoming = response.data.filter(event => new Date(event.date) >= now).length;
      const past = response.data.length - upcoming;
      
      setStats({
        upcoming,
        past,
        total: response.data.length
      });
    } catch (err) {
      setError('Failed to fetch events. Please try again later.');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (isEditing) {
        await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/events/${editingId}`, formData);
      } else {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/events`, formData);
      }
      
      setFormData({
        title: '',
        date: '',
        time: '',
        location: '',
        description: '',
        meetingLink: ''
      });
      setShowForm(false);
      setIsEditing(false);
      setEditingId(null);
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save event');
      console.error('Error submitting form:', err);
    }
  };

  const handleEditClick = (event) => {
    setFormData({
      title: event.title,
      date: event.date,
      time: event.time,
      location: event.location,
      description: event.description,
      meetingLink: event.meetingLink || ''
    });
    setEditingId(event._id);
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDeleteClick = async (id) => {
    if (deleteConfirm === id) {
      try {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/events/${id}`);
        setDeleteConfirm(null);
        fetchEvents();
      } catch (err) {
        setError('Failed to delete event');
        console.error('Error deleting event:', err);
      }
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredEvents = events.filter(event => {
    const now = new Date();
    const eventDate = new Date(event.date);
    return activeTab === 'upcoming' ? eventDate >= now : eventDate < now;
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      

      <div className="w-full md:ml-64 p-4 md:p-8">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="max-w-7xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-0"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                Alumni Events
              </span>
            </motion.h1>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition flex items-center gap-2 shadow-md"
              onClick={() => {
                setIsEditing(false);
                setEditingId(null);
                setFormData({
                  title: '',
                  date: '',
                  time: '',
                  location: '',
                  description: '',
                  meetingLink: ''
                });
                setShowForm(!showForm);
              }}
            >
              {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {showForm ? "Cancel" : "Add Event"}
            </motion.button>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700 rounded-lg shadow-sm"
              >
                <p>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Event Stats */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            initial="hidden"
            animate="visible"
            variants={{ 
              visible: { 
                transition: { 
                  staggerChildren: 0.1 
                } 
              } 
            }}
          >
            {[
              {
                icon: <Calendar className="w-6 h-6 text-blue-600" />,
                value: stats.upcoming,
                label: "Upcoming Events",
                bg: "bg-blue-100",
                delay: 0
              },
              {
                icon: <CalendarIcon className="w-6 h-6 text-green-600" />,
                value: stats.past,
                label: "Past Events",
                bg: "bg-green-100",
                delay: 1
              },
              {
                icon: <Users className="w-6 h-6 text-purple-600" />,
                value: stats.total,
                label: "Total Events",
                bg: "bg-purple-100",
                delay: 2
              }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                variants={statCardVariants}
                custom={stat.delay}
                whileHover="hover"
                className="bg-white p-6 rounded-xl shadow-sm flex items-center border border-gray-100"
              >
                <div className={`rounded-full ${stat.bg} p-3 mr-4`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Event Form */}
          <AnimatePresence>
            {showForm && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-100"
              >
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                  {isEditing ? "Edit Event" : "Create New Event"}
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Event Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="Enter event title"
                        required
                      />
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="Event location"
                        required
                      />
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        required
                      />
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Time
                      </label>
                      <input
                        type="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        required
                      />
                    </motion.div>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="Describe your event"
                      required
                    ></textarea>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Meeting Link (Optional)
                    </label>
                    <input
                      type="url"
                      name="meetingLink"
                      value={formData.meetingLink}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      placeholder="https://meet.google.com/... or other meeting URL"
                    />
                  </motion.div>
                  
                  <motion.div
                    className="flex justify-end gap-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7 }}
                  >
                    <motion.button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setIsEditing(false);
                      }}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      type="submit"
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-md transition"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isEditing ? "Update Event" : "Create Event"}
                    </motion.button>
                  </motion.div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Events List */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {activeTab === 'upcoming' ? 'Upcoming Events' : 'Past Events'}
              </h2>
              
              <div className="flex border border-gray-200 rounded-lg p-1 bg-gray-50">
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'upcoming' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => setActiveTab('past')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition ${activeTab === 'past' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  Past
                </button>
              </div>
            </div>
            
            {/* Loading state */}
            {loading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center items-center h-60"
              >
                <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
              </motion.div>
            )}
            
            {/* No events state */}
            {!loading && filteredEvents.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-xl p-8 text-center border border-gray-100 shadow-sm"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  No {activeTab} events found
                </h3>
                <p className="text-gray-600 mb-6">
                  {activeTab === 'upcoming' 
                    ? "Check back later or create a new event!" 
                    : "No past events to display"}
                </p>
                {activeTab === 'upcoming' && (
                  <motion.button
                    onClick={() => setShowForm(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition inline-flex items-center gap-2"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus className="w-5 h-5" /> Create Event
                  </motion.button>
                )}
              </motion.div>
            )}
            
            {/* Events grid */}
            {!loading && filteredEvents.length > 0 && (
              <motion.div 
                className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                initial="hidden"
                animate="visible"
                variants={{ 
                  visible: { 
                    transition: { 
                      staggerChildren: 0.1 
                    } 
                  } 
                }}
              >
                <AnimatePresence>
                  {filteredEvents.map((event, i) => {
                    const isConfirmingDelete = deleteConfirm === event._id;
                    const eventDate = new Date(event.date);
                    const isPast = eventDate < new Date();
                    
                    return (
                      <motion.div
                        key={event._id}
                        variants={cardVariants}
                        custom={i % 2}
                        whileHover="hover"
                        className={`bg-white rounded-xl shadow-sm overflow-hidden border-l-4 ${
                          isPast ? 'border-gray-400' : 'border-blue-500'
                        }`}
                        layout
                      >
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-semibold text-gray-800">{event.title}</h3>
                            {isPast ? (
                              <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
                                Past
                              </span>
                            ) : (
                              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-1 rounded-full">
                                Upcoming
                              </span>
                            )}
                          </div>
                          
                          <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                          
                          <div className="space-y-3 mb-5">
                            <div className="flex items-center gap-3 text-gray-600">
                              <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                                <Calendar className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="text-sm">{formatDate(event.date)}</span>
                            </div>
                            
                            <div className="flex items-center gap-3 text-gray-600">
                              <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                                <Clock className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="text-sm">{event.time}</span>
                            </div>
                            
                            <div className="flex items-center gap-3 text-gray-600">
                              <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-blue-600" />
                              </div>
                              <span className="text-sm">{event.location}</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 mt-6">
                            <motion.button 
                              onClick={() => handleEditClick(event)}
                              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Edit className="w-4 h-4" /> Edit
                            </motion.button>
                            
                            <motion.button 
                              onClick={() => handleDeleteClick(event._id)}
                              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition ${
                                isConfirmingDelete 
                                  ? 'bg-red-600 text-white hover:bg-red-700'
                                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Trash2 className="w-4 h-4" /> 
                              {isConfirmingDelete ? 'Confirm' : 'Delete'}
                            </motion.button>
                            
                            <motion.button 
                              onClick={() => event.meetingLink ? window.open(event.meetingLink, '_blank') : null}
                              className={`px-3 py-2 rounded-lg transition flex items-center justify-center ${
                                event.meetingLink 
                                  ? 'bg-blue-100 hover:bg-blue-200 text-blue-800' 
                                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              }`}
                              disabled={!event.meetingLink}
                              title={event.meetingLink ? "Open meeting link" : "No meeting link available"}
                              whileHover={{ scale: event.meetingLink ? 1.02 : 1 }}
                              whileTap={{ scale: event.meetingLink ? 0.98 : 1 }}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AlumniEvents;