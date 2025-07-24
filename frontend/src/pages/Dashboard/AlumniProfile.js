import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import {
  User,
  MapPin,
  Edit2,
  Save,
  Plus,
  Trash2,
  Briefcase,
  Calendar,
  GraduationCap
} from 'lucide-react';
import axios from 'axios';

const AlumniProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newSkill, setNewSkill] = useState('');
  const [userName, setUserName] = useState('');
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const navigate = useNavigate();
  const { alumniId } = useParams(); // In case you're using route params for specific alumni

  // Add event listener for sidebar toggle
  useEffect(() => {
    const handleSidebarToggle = (e) => {
      if (e.detail.isCollapsed) {
        setSidebarWidth(72);
      } else {
        setSidebarWidth(240);
      }
    };

    window.addEventListener('sidebarToggle', handleSidebarToggle);
    return () => {
      window.removeEventListener('sidebarToggle', handleSidebarToggle);
    };
  }, []);

  const getAlumniProfile = async (token) => {
    // You'll need to create a new endpoint on your backend like "api/profile/alumni/:id"
    // For now, we'll use the same endpoint as it returns the profile of the logged-in user
    const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/profile/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  };

  const updateProfile = async (token, profileData) => {
    // Create a copy that excludes the name field if it's handled separately
    const { name, ...profileDataToSend } = profileData;
    
    const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/profile/updateprofile`, profileDataToSend, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    return response;
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Check if the logged-in user is an alumni through user role
        // You might need to decode the JWT token to check the role or 
        // get it from your authentication context/state
        const response = await getAlumniProfile(token);
        setProfile(response.data);
        
        // Extract name from the response
        let fullName = '';
        if (response.data.user) {
          fullName = `${response.data.user.firstName || ''} ${response.data.user.lastName || ''}`.trim();
        } 
        
        setUserName(fullName || response.data.name || 'Alumni');
        setEditedProfile(response.data);
      } catch (error) {
        console.error("Error fetching alumni profile:", error);
        setError('Error fetching profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate, alumniId]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // Include the name in what we're sending to update
      const profileToUpdate = {
        ...editedProfile,
        name: userName
      };
      
      const response = await updateProfile(token, profileToUpdate);
      setProfile(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError('Error updating profile.');
      alert('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  // Function to add a new skill
  const addSkill = () => {
    if (newSkill.trim() !== '') {
      setEditedProfile({
        ...editedProfile,
        skills: [...(editedProfile.skills || []), newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  // Function to remove a skill
  const removeSkill = (index) => {
    const updatedSkills = [...editedProfile.skills];
    updatedSkills.splice(index, 1);
    setEditedProfile({
      ...editedProfile,
      skills: updatedSkills
    });
  };

  // Function to add a new experience entry
  const addExperience = () => {
    setEditedProfile({
      ...editedProfile,
      experience: [
        ...(editedProfile.experience || []),
        { 
          title: '',
          company: '',
          location: 'Not specified',
          from: new Date().toISOString().split('T')[0],
          to: '',
          current: false,
          description: ''
        }
      ]
    });
  };

  // Function to update an experience entry
  const updateExperience = (index, field, value) => {
    const updatedExperience = [...editedProfile.experience];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value
    };
    setEditedProfile({
      ...editedProfile,
      experience: updatedExperience
    });
  };

  // Function to toggle current status for experience
  const toggleCurrentExperience = (index) => {
    const updatedExperience = [...editedProfile.experience];
    updatedExperience[index] = {
      ...updatedExperience[index],
      current: !updatedExperience[index].current,
      to: updatedExperience[index].current ? new Date().toISOString().split('T')[0] : ''
    };
    setEditedProfile({
      ...editedProfile,
      experience: updatedExperience
    });
  };

  // Function to remove an experience entry
  const removeExperience = (index) => {
    const updatedExperience = [...editedProfile.experience];
    updatedExperience.splice(index, 1);
    setEditedProfile({
      ...editedProfile,
      experience: updatedExperience
    });
  };

  // EDUCATION FUNCTIONS

  // Function to add a new education entry
  const addEducation = () => {
    setEditedProfile({
      ...editedProfile,
      education: [
        ...(editedProfile.education || []),
        { 
          school: '',
          degree: '',
          fieldofstudy: '',
          from: new Date().toISOString().split('T')[0],
          to: '',
          current: false,
          description: ''
        }
      ]
    });
  };

  // Function to update an education entry
  const updateEducation = (index, field, value) => {
    const updatedEducation = [...editedProfile.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    };
    setEditedProfile({
      ...editedProfile,
      education: updatedEducation
    });
  };

  // Function to toggle current status for education
  const toggleCurrentEducation = (index) => {
    const updatedEducation = [...editedProfile.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      current: !updatedEducation[index].current,
      to: updatedEducation[index].current ? new Date().toISOString().split('T')[0] : ''
    };
    setEditedProfile({
      ...editedProfile,
      education: updatedEducation
    });
  };

  // Function to remove an education entry
  const removeEducation = (index) => {
    const updatedEducation = [...editedProfile.education];
    updatedEducation.splice(index, 1);
    setEditedProfile({
      ...editedProfile,
      education: updatedEducation
    });
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  // Function to display date range
  const getDateRange = (item) => {
    const fromDate = formatDate(item.from);
    const toDate = item.current ? 'Present' : formatDate(item.to);
    return `${fromDate} - ${toDate}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  // Determine the name to display based on available data
  const displayName = userName || 'Alumni';

  return (
    <div className="flex h-screen bg-gray-50">
      
      <motion.div 
        className="flex-1 overflow-auto"
        style={{ marginLeft: `${sidebarWidth}px` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div className="max-w-4xl mx-auto py-8 px-4 md:px-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="relative h-32 bg-gradient-to-r from-purple-500 to-blue-500">
              {isEditing && (
                <button
                  onClick={handleSave}
                  className="absolute top-4 right-4 bg-white text-purple-600 p-2 rounded-full shadow-md hover:bg-purple-50 transition-colors"
                  disabled={loading}
                >
                  <Save className="w-5 h-5" />
                </button>
              )}
            </div>

            <div className="relative px-4 md:px-6 pb-6">
              <div className="flex flex-col items-center -mt-16">
                <motion.div className="w-32 h-32 bg-purple-200 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <User className="w-16 h-16 text-purple-600" />
                </motion.div>

                <motion.div className="mt-4 text-center">
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                    {isEditing ? (
                      <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        className="text-center border-b-2 focus:outline-none focus:border-purple-500"
                      />
                    ) : (
                      displayName
                    )}
                  </h1>
                  <p className="text-gray-600 mt-1">{profile.title || 'Alumni'}</p>
                  <p className="flex items-center justify-center text-gray-500 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedProfile?.location || ''}
                        onChange={(e) =>
                          setEditedProfile({ ...editedProfile, location: e.target.value })
                        }
                        className="text-center border-b-2 focus:outline-none focus:border-purple-500"
                        placeholder="Location"
                      />
                    ) : (
                      profile.location
                    )}
                  </p>
                </motion.div>
              </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-2">About Me</h3>
            {isEditing ? (
              <textarea
                value={editedProfile?.bio || ''}
                onChange={(e) =>
                  setEditedProfile({ ...editedProfile, bio: e.target.value })
                }
                className="w-full p-2 border rounded focus:outline-none focus:border-purple-500"
                rows={4}
                placeholder="Tell us about yourself"
              />
            ) : (
              <p className="text-gray-600">{profile.bio}</p>
            )}
          </div>

          <motion.div className="mt-8">
            <h3 className="text-xl font-semibold mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {editedProfile?.skills?.map((skill, index) => (
                <motion.span
                  key={index}
                  className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm flex items-center"
                >
                  {skill}
                  {isEditing && (
                    <button 
                      className="ml-2 text-purple-400 hover:text-purple-700"
                      onClick={() => removeSkill(index)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </motion.span>
              ))}
            </div>
            
            {isEditing && (
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  placeholder="Add a new skill"
                  className="flex-grow p-2 text-sm border rounded focus:outline-none focus:border-purple-500"
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <button
                  onClick={addSkill}
                  className="bg-purple-500 text-white p-2 rounded hover:bg-purple-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            )}
          </motion.div>

          {/* EXPERIENCE SECTION */}
          <motion.div className="mt-8">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-semibold">Experience</h3>
              {isEditing && (
                <button
                  onClick={addExperience}
                  className="bg-purple-500 text-white p-2 rounded-full hover:bg-purple-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {editedProfile?.experience?.map((exp, index) => (
              <motion.div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg relative">
                {isEditing && (
                  <button
                    onClick={() => removeExperience(index)}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={exp.title || ''}
                      onChange={(e) => updateExperience(index, 'title', e.target.value)}
                      placeholder="Job Title*"
                      className="w-full p-2 border rounded focus:outline-none focus:border-purple-500"
                      required
                    />
                    <input
                      type="text"
                      value={exp.company || ''}
                      onChange={(e) => updateExperience(index, 'company', e.target.value)}
                      placeholder="Company*"
                      className="w-full p-2 border rounded focus:outline-none focus:border-purple-500"
                      required
                    />
                    <input
                      type="text"
                      value={exp.location || ''}
                      onChange={(e) => updateExperience(index, 'location', e.target.value)}
                      placeholder="Location"
                      className="w-full p-2 border rounded focus:outline-none focus:border-purple-500"
                    />
                    
                    <div className="flex flex-col sm:flex-row sm:space-x-2">
                      <div className="flex-1">
                        <label className="block text-sm text-gray-600 mb-1">From Date*</label>
                        <input
                          type="date"
                          value={exp.from ? (typeof exp.from === 'string' ? exp.from.substring(0, 10) : new Date(exp.from).toISOString().substring(0, 10)) : ''}
                          onChange={(e) => updateExperience(index, 'from', e.target.value)}
                          className="w-full p-2 border rounded focus:outline-none focus:border-purple-500"
                          required
                        />
                      </div>
                      
                      <div className="flex-1 mt-2 sm:mt-0">
                        <label className="block text-sm text-gray-600 mb-1">To Date</label>
                        <input
                          type="date"
                          value={exp.to ? (typeof exp.to === 'string' ? exp.to.substring(0, 10) : new Date(exp.to).toISOString().substring(0, 10)) : ''}
                          onChange={(e) => updateExperience(index, 'to', e.target.value)}
                          className="w-full p-2 border rounded focus:outline-none focus:border-purple-500"
                          disabled={exp.current}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`current-job-${index}`}
                        checked={exp.current || false}
                        onChange={() => toggleCurrentExperience(index)}
                        className="mr-2"
                      />
                      <label htmlFor={`current-job-${index}`} className="text-sm text-gray-600">
                        Current Job
                      </label>
                    </div>
                    
                    <textarea
                      value={exp.description || ''}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                      placeholder="Job Description"
                      className="w-full p-2 border rounded focus:outline-none focus:border-purple-500"
                      rows={3}
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex items-start">
                      <Briefcase className="w-5 h-5 mt-1 mr-2 text-purple-500" />
                      <div>
                        <h4 className="font-semibold">{exp.title} at {exp.company}</h4>
                        <p className="text-gray-600">{exp.location}</p>
                        <p className="text-gray-500 text-sm flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {getDateRange(exp)}
                        </p>
                        <p className="text-gray-600 mt-2">{exp.description}</p>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </motion.div>

          {/* EDUCATION SECTION */}
          <motion.div className="mt-8">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-semibold">Education</h3>
              {isEditing && (
                <button
                  onClick={addEducation}
                  className="bg-purple-500 text-white p-2 rounded-full hover:bg-purple-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {editedProfile?.education?.map((edu, index) => (
              <motion.div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg relative">
                {isEditing && (
                  <button
                    onClick={() => removeEducation(index)}
                    className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                
                {isEditing ? (
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={edu.school || ''}
                      onChange={(e) => updateEducation(index, 'school', e.target.value)}
                      placeholder="School/University*"
                      className="w-full p-2 border rounded focus:outline-none focus:border-purple-500"
                      required
                    />
                    <input
                      type="text"
                      value={edu.degree || ''}
                      onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      placeholder="Degree*"
                      className="w-full p-2 border rounded focus:outline-none focus:border-purple-500"
                      required
                    />
                    <input
                      type="text"
                      value={edu.fieldofstudy || ''}
                      onChange={(e) => updateEducation(index, 'fieldofstudy', e.target.value)}
                      placeholder="Field of Study*"
                      className="w-full p-2 border rounded focus:outline-none focus:border-purple-500"
                      required
                    />
                    
                    <div className="flex flex-col sm:flex-row sm:space-x-2">
                      <div className="flex-1">
                        <label className="block text-sm text-gray-600 mb-1">From Date*</label>
                        <input
                          type="date"
                          value={edu.from ? (typeof edu.from === 'string' ? edu.from.substring(0, 10) : new Date(edu.from).toISOString().substring(0, 10)) : ''}
                          onChange={(e) => updateEducation(index, 'from', e.target.value)}
                          className="w-full p-2 border rounded focus:outline-none focus:border-purple-500"
                          required
                        />
                      </div>
                      
                      <div className="flex-1 mt-2 sm:mt-0">
                        <label className="block text-sm text-gray-600 mb-1">To Date</label>
                        <input
                          type="date"
                          value={edu.to ? (typeof edu.to === 'string' ? edu.to.substring(0, 10) : new Date(edu.to).toISOString().substring(0, 10)) : ''}
                          onChange={(e) => updateEducation(index, 'to', e.target.value)}
                          className="w-full p-2 border rounded focus:outline-none focus:border-purple-500"
                          disabled={edu.current}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`current-education-${index}`}
                        checked={edu.current || false}
                        onChange={() => toggleCurrentEducation(index)}
                        className="mr-2"
                      />
                      <label htmlFor={`current-education-${index}`} className="text-sm text-gray-600">
                        Current School
                      </label>
                    </div>
                    
                    <textarea
                      value={edu.description || ''}
                      onChange={(e) => updateEducation(index, 'description', e.target.value)}
                      placeholder="Program Description"
                      className="w-full p-2 border rounded focus:outline-none focus:border-purple-500"
                      rows={3}
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex items-start">
                      <GraduationCap className="w-5 h-5 mt-1 mr-2 text-purple-500" />
                      <div>
                        <h4 className="font-semibold">{edu.degree} in {edu.fieldofstudy}</h4>
                        <p className="text-gray-600">{edu.school}</p>
                        <p className="text-gray-500 text-sm flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {getDateRange(edu)}
                        </p>
                        <p className="text-gray-600 mt-2">{edu.description}</p>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </motion.div>

          <motion.button
            className="fixed bottom-8 right-8 bg-purple-600 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(!isEditing)}
            disabled={loading}
          >
            <Edit2 className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AlumniProfile;