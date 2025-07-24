import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit, FiX, FiCheck, FiUpload, FiPlus } from 'react-icons/fi';

const AlumniELearningPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    duration: '',
    level: 'Beginner',
    price: '',
    tags: '',
    isPublished: false,
    modules: []
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState('');
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [message, setMessage] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(240);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        when: "beforeChildren"
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: {
      y: -5,
      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
      transition: { duration: 0.3 }
    }
  };

  const formVariants = {
    hidden: { x: -50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const listVariants = {
    hidden: { x: 50, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const messageVariants = {
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4 }
    },
    exit: { y: 20, opacity: 0 }
  };

  useEffect(() => {
    fetchCourses();
    
    const checkIfMobile = () => {
      const isMobileView = window.innerWidth < 768;
      setIsMobile(isMobileView);
      setSidebarWidth(isMobileView ? 0 : 240);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    const handleSidebarToggle = (e) => {
      if (e.detail && typeof e.detail.width === 'number') {
        setSidebarWidth(e.detail.width);
      }
    };
    
    window.addEventListener('sidebarToggle', handleSidebarToggle);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
      window.removeEventListener('sidebarToggle', handleSidebarToggle);
    };
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCourses(response.data);
      setIsLoading(false);
    } catch (err) {
      setError('Failed to load courses');
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      duration: '',
      level: 'Beginner',
      price: '',
      tags: '',
      isPublished: false,
      modules: []
    });
    setThumbnail(null);
    setThumbnailPreview('');
    setIsEditing(false);
    setCurrentCourseId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key === 'modules') {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      if (thumbnail) {
        formDataToSend.append('thumbnail', thumbnail);
      }

      let response;
      if (isEditing && currentCourseId) {
        response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/courses/${currentCourseId}`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setMessage('Course updated successfully!');
      } else {
        response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/courses`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        setMessage('Course created successfully!');
      }

      fetchCourses();
      resetForm();
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (course) => {
    setIsEditing(true);
    setCurrentCourseId(course._id);
    setFormData({
      title: course.title,
      description: course.description,
      category: course.category,
      duration: course.duration,
      level: course.level,
      price: course.price,
      tags: course.tags.join(','),
      isPublished: course.isPublished,
      modules: course.modules || []
    });
    
    if (course.thumbnail) {
      setThumbnailPreview(`${process.env.REACT_APP_BACKEND_URL}/${course.thumbnail}`);
    }
  };

  const levelOptions = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  const categoryOptions = ['Programming', 'Design', 'Business', 'Marketing', 'Data Science', 'Other'];

  const mainContentStyle = {
    marginLeft: `${sidebarWidth}px`,
    width: `calc(100% - ${sidebarWidth}px)`,
    transition: 'margin-left 0.3s, width 0.3s'
  };

  return (
    <motion.div 
      className="min-h-screen bg-gray-50" 
      style={mainContentStyle}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="container mx-auto p-4 md:p-6">
        <AnimatePresence>
          {message && (
            <motion.div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4"
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {message}
            </motion.div>
          )}
          
          {error && (
            <motion.div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
              variants={messageVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          className="flex justify-between items-center mb-6"
          variants={itemVariants}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-blue-800">E-Learning Course Management</h1>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            className="lg:col-span-2"
            variants={formVariants}
          >
            <motion.div 
              className="bg-white shadow-md rounded-lg p-4 md:p-6"
              whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold mb-4 text-blue-800">
                {isEditing ? 'Edit Course' : 'Create New Course'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  variants={containerVariants}
                >
                  <motion.div className="mb-4" variants={itemVariants}>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Course Title
                    </label>
                    <motion.input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                      whileFocus={{ boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
                    />
                  </motion.div>
                  
                  <motion.div className="mb-4" variants={itemVariants}>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Category
                    </label>
                    <motion.select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                      whileFocus={{ boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
                    >
                      <option value="">Select Category</option>
                      {categoryOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </motion.select>
                  </motion.div>
                </motion.div>

                <motion.div className="mb-4" variants={itemVariants}>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Description
                  </label>
                  <motion.textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    rows="4"
                    required
                    whileFocus={{ boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
                  ></motion.textarea>
                </motion.div>

                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  variants={containerVariants}
                >
                  <motion.div className="mb-4" variants={itemVariants}>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Duration (hours)
                    </label>
                    <motion.input
                      type="number"
                      name="duration"
                      value={formData.duration}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                      whileFocus={{ boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
                    />
                  </motion.div>
                  
                  <motion.div className="mb-4" variants={itemVariants}>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Level
                    </label>
                    <motion.select
                      name="level"
                      value={formData.level}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      whileFocus={{ boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
                    >
                      {levelOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </motion.select>
                  </motion.div>
                  
                  <motion.div className="mb-4" variants={itemVariants}>
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                      Price ($)
                    </label>
                    <motion.input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      required
                      whileFocus={{ boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
                    />
                  </motion.div>
                </motion.div>

                <motion.div className="mb-4" variants={itemVariants}>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Tags (comma separated)
                  </label>
                  <motion.input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="e.g. javascript, react, web development"
                    whileFocus={{ boxShadow: "0 0 0 2px rgba(59, 130, 246, 0.5)" }}
                  />
                </motion.div>

                <motion.div className="mb-4" variants={itemVariants}>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Course Thumbnail
                  </label>
                  <div className="flex items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailChange}
                      className="hidden"
                      id="thumbnail-upload"
                    />
                    <motion.label
                      htmlFor="thumbnail-upload"
                      className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center gap-2"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FiUpload /> Select Image
                    </motion.label>
                    <span className="ml-3 text-gray-600 text-sm">
                      {thumbnail ? thumbnail.name : 'No file selected'}
                    </span>
                  </div>
                  {thumbnailPreview && (
                    <motion.div 
                      className="mt-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    >
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="h-32 object-cover rounded-md shadow-md"
                      />
                    </motion.div>
                  )}
                </motion.div>

                <motion.div className="mb-4" variants={itemVariants}>
                  <label className="flex items-center">
                    <motion.input
                      type="checkbox"
                      name="isPublished"
                      checked={formData.isPublished}
                      onChange={handleChange}
                      className="mr-2"
                      whileTap={{ scale: 0.9 }}
                    />
                    <span className="text-gray-700 text-sm font-bold">
                      Publish Course
                    </span>
                  </label>
                </motion.div>

                <motion.div 
                  className="flex items-center justify-between"
                  variants={itemVariants}
                >
                  <motion.button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline flex items-center gap-2"
                    disabled={isLoading}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="inline-block"
                        >
                          ⏳
                        </motion.span>
                        Processing...
                      </>
                    ) : isEditing ? (
                      <>
                        <FiCheck /> Update Course
                      </>
                    ) : (
                      <>
                        <FiPlus /> Create Course
                      </>
                    )}
                  </motion.button>
                  
                  {isEditing && (
                    <motion.button
                      type="button"
                      onClick={resetForm}
                      className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-4 flex items-center gap-2"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FiX /> Cancel
                    </motion.button>
                  )}
                </motion.div>
              </form>
            </motion.div>
          </motion.div>
          
          <motion.div variants={listVariants}>
            <motion.div 
              className="bg-white shadow-md rounded-lg p-4 md:p-6"
              whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl font-bold mb-4 text-blue-800">Your Courses</h2>
              
              {isLoading && (
                <motion.div 
                  className="flex justify-center py-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </motion.div>
              )}
              
              {!isLoading && courses.length === 0 && (
                <motion.p 
                  className="text-gray-600 text-center py-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  You haven't created any courses yet.
                </motion.p>
              )}
              
              <motion.div 
                className="space-y-4"
                variants={containerVariants}
              >
                <AnimatePresence>
                  {courses.map((course) => (
                    <motion.div 
                      key={course._id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      exit={{ opacity: 0, scale: 0.9 }}
                      layout
                    >
                      <div className="flex flex-col md:flex-row">
                        {course.thumbnail && (
                          <div className="w-full md:w-1/4 mb-4 md:mb-0">
                            <motion.img
                              src={`${process.env.REACT_APP_BACKEND_URL}/${course.thumbnail}`}
                              alt={course.title}
                              className="w-full h-24 object-cover rounded-md"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/150";
                              }}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.5 }}
                            />
                          </div>
                        )}
                        <div className={course.thumbnail ? "w-full md:w-3/4 md:pl-4" : "w-full"}>
                          <h3 className="font-bold">{course.title}</h3>
                          <p className="text-sm text-gray-600">{course.category}</p>
                          <div className="flex justify-between mt-2">
                            <motion.span 
                              className={`text-xs px-2 py-1 rounded ${course.isPublished ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                              whileHover={{ scale: 1.05 }}
                            >
                              {course.isPublished ? 'Published' : 'Draft'}
                            </motion.span>
                            <motion.button
                              onClick={() => handleEdit(course)}
                              className="text-blue-600 text-sm hover:text-blue-800 flex items-center gap-1"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <FiEdit /> Edit
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AlumniELearningPage;