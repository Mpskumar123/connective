import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import Navbar from '../../components/shared/Navbar';
import { 
  Briefcase, Building2, MapPin, Clock, X, Edit2, Trash2, ArrowUp, 
  BarChart2, Users, Calendar, CheckCircle, Eye, Download, User,
  Mail, Phone, FileText, Star, MessageSquare
} from 'lucide-react';
import { Tooltip } from 'react-tooltip';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { 
      duration: 0.5,
      ease: "easeOut"
    } 
  },
  hover: {
    y: -5,
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
  }
};

const statsVariants = {
  hidden: { opacity: 0 },
  visible: (i) => ({
    opacity: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5
    }
  })
};

const AlumniJobPostings = () => {
  const [showForm, setShowForm] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState({});
  const [selectedJobApplications, setSelectedJobApplications] = useState([]);
  const [showApplicationsModal, setShowApplicationsModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time',
    salary: '',
    posted: '1 day ago',
    logo: '',
    description: ''
  });

  const [editMode, setEditMode] = useState(false);
  const [editJobId, setEditJobId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [loadingApplications, setLoadingApplications] = useState(false);


useEffect(() => {
  const fetchJobs = async () => {
    console.log("Fetching jobs...");
    setIsLoading(true);
    try {
      const jobsUrl = `${process.env.REACT_APP_BACKEND_URL}/api/jobs/`;
      

      const response = await fetch(jobsUrl);
      

      if (response.ok) {
        const data = await response.json();
        
        setJobs(data);

        // Fetch applications for each job
        const applicationsData = {};
        for (const job of data) {
          const appUrl = `${process.env.REACT_APP_BACKEND_URL}/api/application/job/${job._id}`;
          
          try {
            const appResponse = await fetch(appUrl);
            

            if (appResponse.ok) {
              const jobApplicationsResponse = await appResponse.json();
              
              
              // Extract the applications array from the response object
              const jobApplications = jobApplicationsResponse.applications || [];
              
              
              applicationsData[job._id] = jobApplications;
            } else {
              
              applicationsData[job._id] = [];
            }
          } catch (error) {
            
            applicationsData[job._id] = [];
          }
        }
        
        setApplications(applicationsData);
      } else {
        console.error('Failed to fetch jobs. Status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
      
    }
  };

  fetchJobs();
}, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const jobData = {
      ...formData,
      posted: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  
    try {
      const url = editMode
        ? `${process.env.REACT_APP_BACKEND_URL}/api/jobs/${editJobId}`
        : `${process.env.REACT_APP_BACKEND_URL}/api/jobs/`;
  
      const method = editMode ? 'PUT' : 'POST';
  
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      });
  
      if (response.ok) {
        const updatedJob = await response.json();
  
        if (editMode) {
          setJobs(jobs.map((job) => (job._id === editJobId ? updatedJob : job)));
        } else {
          setJobs([updatedJob, ...jobs]);
          // Initialize empty applications array for new job
          setApplications(prev => ({ ...prev, [updatedJob._id]: [] }));
        }
  
        setFormData({
          title: '',
          company: '',
          location: '',
          type: 'Full-time',
          salary: '',
          posted: '1 day ago',
          logo: '',
          description: ''
        });
        setEditMode(false);
        setEditJobId(null);
        setShowForm(false);
      }
    } catch (error) {
      console.error('Error saving job:', error);
    }
  };
  
  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/jobs/${jobId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setJobs(jobs.filter(job => job._id !== jobId));
        // Remove applications for deleted job
        const newApplications = { ...applications };
        delete newApplications[jobId];
        setApplications(newApplications);
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

// Also update the viewApplications function
const viewApplications = async (jobId) => {
  setLoadingApplications(true);
  setSelectedJobId(jobId);
  setShowApplicationsModal(true);
  
  try {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/application/job/${jobId}`);
    if (response.ok) {
      const jobApplicationsResponse = await response.json();
      
      
      // Extract the applications array from the response
      const jobApplications = jobApplicationsResponse.applications || [];
      
      
      setSelectedJobApplications(jobApplications);
      // Update applications state
      setApplications(prev => ({ ...prev, [jobId]: jobApplications }));
    }
  } catch (error) {
    console.error('Error fetching applications:', error);
    setSelectedJobApplications([]);
  } finally {
    setLoadingApplications(false);
  }
};

// Fixed updateApplicationStatus function
const updateApplicationStatus = async (applicationId, newStatus) => {
  try {
    console.log(`Updating application ${applicationId} to status: ${newStatus}`);
    
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/application/${applicationId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });

    console.log('Update response status:', response.status);

    if (response.ok) {
      const responseData = await response.json();
     
      // Handle different possible response structures
      let updatedApplication;
      
      // If the response is the updated application directly
      if (responseData._id) {
        updatedApplication = responseData;
      }
      // If the response has an 'application' or 'data' property
      else if (responseData.application) {
        updatedApplication = responseData.application;
      }
      else if (responseData.data) {
        updatedApplication = responseData.data;
      }
      // If it's just a success message, find and update the existing application
      else {
        // Find the current application and update its status
        const currentApp = selectedJobApplications.find(app => app._id === applicationId);
        if (currentApp) {
          updatedApplication = { ...currentApp, status: newStatus };
        } else {
          console.error('Could not find application to update');
          return;
        }
      }

      

      // Ensure the updated application has all required fields
      if (!updatedApplication._id) {
        console.error('Updated application missing _id field');
        return;
      }

      // Update the selected job applications
      setSelectedJobApplications(prev => 
        prev.map(app => 
          app._id === applicationId ? { ...app, ...updatedApplication } : app
        )
      );
      
      // Update the main applications state
      setApplications(prev => ({
        ...prev,
        [selectedJobId]: prev[selectedJobId] ? prev[selectedJobId].map(app => 
          app._id === applicationId ? { ...app, ...updatedApplication } : app
        ) : []
      }));

      console.log('Application status updated successfully');
    } else {
      const errorText = await response.text();
      console.error('Failed to update application status:', response.status, errorText);
    }
  } catch (error) {
    console.error('Error updating application status:', error);
  }
};

  const downloadResume = async (applicationId, applicantName) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/application/resume/${applicationId}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${applicantName}_Resume.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error downloading resume:', error);
    }
  };

  const calculateApplicationStats = () => {
    const allApplications = Object.values(applications).flat();
    const total = allApplications.length;
    const shortlisted = allApplications.filter(app => app.status === 'shortlisted').length;
    const interviews = allApplications.filter(app => app.status === 'interview').length;
    const hired = allApplications.filter(app => app.status === 'hired').length;
    
    return {
      total,
      shortlisted,
      interviews,
      hired,
      avgPerJob: jobs.length > 0 ? (total / jobs.length).toFixed(1) : 0
    };
  };

  const stats = calculateApplicationStats();

  const toggleJobExpand = (jobId) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'shortlisted': return 'bg-blue-100 text-blue-800';
      case 'interview': return 'bg-purple-100 text-purple-800';
      case 'hired': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSelectedJobTitle = () => {
    const job = jobs.find(j => j._id === selectedJobId);
    return job ? job.title : 'Job Applications';
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="flex-none">
        
      </div>
      <main className="flex-1 p-6 lg:p-8 ml-0 md:ml-64">
        {/* Animated Heading */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            💼 Alumni Job Portal
          </h1>
          <p className="text-gray-600">
            Connect with talented students by posting job opportunities
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
          initial="hidden"
          animate="visible"
        >
          {[
            { icon: <Briefcase className="w-6 h-6" />, value: jobs.length, label: "Active Jobs", color: "bg-blue-100 text-blue-600" },
            { icon: <Users className="w-6 h-6" />, value: stats.total, label: "Total Applications", color: "bg-green-100 text-green-600" },
            { icon: <CheckCircle className="w-6 h-6" />, value: stats.shortlisted, label: "Shortlisted", color: "bg-purple-100 text-purple-600" },
            { icon: <BarChart2 className="w-6 h-6" />, value: stats.avgPerJob, label: "Avg. per Job", color: "bg-amber-100 text-amber-600" }
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              custom={i}
              variants={statsVariants}
              className={`p-4 rounded-xl ${stat.color} shadow-sm`}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center">
                <div className="p-2 rounded-lg bg-white bg-opacity-50 mr-3">
                  {stat.icon}
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Post New Job Button */}
        <motion.div 
          className="flex justify-between items-center mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold text-gray-800">Your Job Listings</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all"
            onClick={() => {
              setShowForm(!showForm);
              setEditMode(false);
              setEditJobId(null);
            }}
          >
            {showForm ? (
              <>
                <X size={18} /> Cancel
              </>
            ) : (
              <>
                <Briefcase size={18} /> Post New Job
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Job Posting Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-200"
            >
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                {editMode ? "Edit Job Posting" : "Create New Job Posting"}
              </h2>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g. Software Engineer"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g. Tech Corp Inc."
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location *
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g. San Francisco, CA or Remote"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Job Type *
                      </label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="Full-time">Full-time</option>
                        <option value="Part-time">Part-time</option>
                        <option value="Contract">Contract</option>
                        <option value="Internship">Internship</option>
                        <option value="Remote">Remote</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Salary Range *
                      </label>
                      <input
                        type="text"
                        name="salary"
                        value={formData.salary}
                        onChange={handleInputChange}
                        placeholder="e.g. $80,000 - $120,000 per year"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Company Logo URL
                      </label>
                      <input
                        type="text"
                        name="logo"
                        value={formData.logo}
                        onChange={handleInputChange}
                        placeholder="https://example.com/logo.png"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe the job responsibilities, requirements, and benefits..."
                    required
                  />
                </div>
                
                <div className="mt-8 flex justify-end space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
                  >
                    {editMode ? "Update Job" : "Post Job"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Job Listings Section */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
            />
          </div>
        ) : (
          <motion.div 
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={{ 
              visible: { 
                transition: { 
                  staggerChildren: 0.15,
                  delayChildren: 0.2
                } 
              } 
            }}
          >
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <motion.div 
                  key={job._id} 
                  variants={cardVariants}
                  whileHover="hover"
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between">
                      <div className="flex items-start space-x-4">
                        {job.logo ? (
                          <img 
                            src={job.logo} 
                            alt={`${job.company} logo`} 
                            className="w-14 h-14 rounded-lg object-contain border border-gray-200"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-blue-600" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-xl text-gray-800">{job.title}</h3>
                          <div className="flex flex-wrap items-center gap-2 text-gray-600 mt-1">
                            <div className="flex items-center">
                              <Building2 className="w-4 h-4 mr-1" />
                              <span>{job.company}</span>
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center">
                              <Briefcase className="w-4 h-4 mr-1" />
                              <span>{job.type}</span>
                            </div>
                            <div className="flex items-center text-green-600 font-medium">
                              <span>{job.salary}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 mt-4 md:mt-0">
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-full"
                          onClick={() => viewApplications(job._id)}
                          data-tooltip-id="view-tooltip"
                          data-tooltip-content="View Applications"
                        >
                          <Eye size={18} />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                          onClick={() => {
                            setFormData(job);
                            setEditMode(true);
                            setEditJobId(job._id);
                            setShowForm(true);
                          }}
                          data-tooltip-id="edit-tooltip"
                          data-tooltip-content="Edit Job"
                        >
                          <Edit2 size={18} />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                          onClick={() => handleDelete(job._id)}
                          data-tooltip-id="delete-tooltip"
                          data-tooltip-content="Delete Job"
                        >
                          <Trash2 size={18} />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 text-gray-600 hover:bg-gray-50 rounded-full"
                          onClick={() => toggleJobExpand(job._id)}
                          data-tooltip-id="expand-tooltip"
                          data-tooltip-content={expandedJobId === job._id ? "Collapse" : "Expand"}
                        >
                          <ArrowUp 
                            size={18} 
                            className={`transition-transform ${expandedJobId === job._id ? 'rotate-180' : ''}`}
                          />
                        </motion.button>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex flex-wrap items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>Posted {job.posted}</span>
                      </div>
                      {applications[job._id] && applications[job._id].length > 0 && (
                        <div className="text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                          {applications[job._id].length} application{applications[job._id].length !== 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <AnimatePresence>
                    {expandedJobId === job._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="px-6 pb-6 pt-0 border-t border-gray-100"
                      >
                        <div className="mt-4">
                          <h4 className="font-semibold text-gray-800 mb-2">Job Description</h4>
                          <p className="text-gray-600 whitespace-pre-line">
                            {job.description || "No description provided."}
                          </p>
                        </div>
                        <div className="mt-6">
                          <h4 className="font-semibold text-gray-800 mb-2">Application Statistics</h4>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <p className="text-sm text-blue-600">Total Applications</p>
                              <p className="text-xl font-bold">{applications[job._id]?.length || 0}</p>
                            </div>
                            <div className="bg-purple-50 p-3 rounded-lg">
                              <p className="text-sm text-purple-600">Shortlisted</p>
                              <p className="text-xl font-bold">
                                {applications[job._id]?.filter(app => app.status === 'shortlisted').length || 0}
                              </p>
                            </div>
                            <div className="bg-green-50 p-3 rounded-lg">
                              <p className="text-sm text-green-600">Interviews</p>
                              <p className="text-xl font-bold">
                                {applications[job._id]?.filter(app => app.status === 'interview').length || 0}
                              </p>
                            </div>
                            <div className="bg-amber-50 p-3 rounded-lg">
                              <p className="text-sm text-amber-600">Hired</p>
                              <p className="text-xl font-bold">
                                {applications[job._id]?.filter(app => app.status === 'hired').length || 0}
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (
              <motion.div
                variants={cardVariants}
                className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 text-center"
              >
                <Briefcase className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">No Job Postings Yet</h3>
                <p className="text-gray-500 mb-6">
                  You haven't posted any jobs yet. Click the button below to create your first job posting.
                </p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
                  onClick={() => setShowForm(true)}
                >
                  Post Your First Job
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Applications Modal */}
<AnimatePresence>
  {showApplicationsModal && (
    <motion.div
      key="applications-modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={() => setShowApplicationsModal(false)}
    >
      <motion.div
        key="applications-modal-content"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent backdrop click
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">
              Applications for {getSelectedJobTitle()}
            </h2>
            <button
              onClick={() => setShowApplicationsModal(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {loadingApplications ? (
            <div className="flex justify-center items-center h-32">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
              />
            </div>
          ) : selectedJobApplications.length > 0 ? (
            <div className="space-y-4">
              {selectedJobApplications.map((application) => (
                <div
                  key={application._id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {application.name}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 mt-1">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-1" />
                            <span>{application.email}</span>
                          </div>
                          {application.phone && (
                            <div className="flex items-center">
                              <Phone className="w-4 h-4 mr-1" />
                              <span>{application.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            <span>
                              Applied{" "}
                              {new Date(application.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mt-4 md:mt-0">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                          application.status
                        )}`}
                      >
                        {application.status.charAt(0).toUpperCase() +
                          application.status.slice(1)}
                      </span>

                      <select
                        value={application.status}
                        onChange={(e) =>
                          updateApplicationStatus(application._id, e.target.value)
                        }
                        className="ml-2 px-3 py-1 border border-gray-300 rounded-md text-sm"
                      >
                        <option value="pending">Pending</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interview">Interview</option>
                        <option value="hired">Hired</option>
                        <option value="rejected">Rejected</option>
                      </select>

                      <button
                        onClick={() =>
                          downloadResume(application._id, application.name)
                        }
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                        title="Download Resume"
                      >
                        <Download size={18} />
                      </button>
                    </div>
                  </div>

                  {application.coverLetter && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Cover Letter
                      </h4>
                      <p className="text-gray-600 text-sm">
                        {application.coverLetter}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                No Applications Yet
              </h3>
              <p className="text-gray-500">
                This job hasn't received any applications yet.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>


        {/* Tooltips - MISSING PART */}
        <Tooltip id="view-tooltip" />
        <Tooltip id="edit-tooltip" />
        <Tooltip id="delete-tooltip" />
        <Tooltip id="expand-tooltip" />
      </main>
    </div>
  );
};

export default AlumniJobPostings;