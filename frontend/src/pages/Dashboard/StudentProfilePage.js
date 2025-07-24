import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/shared/Navbar';
import { User, Github as GitHub, Linkedin, Twitter, MapPin, Edit2, Save } from 'lucide-react';
import { getProfile, updateProfile } from "../../utils/api"; // API utility to handle backend calls

const StudentProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const response = await getProfile(token); // Fetch profile data from backend
        setProfile(response.data);
        setEditedProfile(response.data);
      } catch (error) {
        setError("Error fetching profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSave = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await updateProfile(token, editedProfile); // Save updated profile to backend
      setProfile(response.data);
      setIsEditing(false);
    } catch (error) {
      setError("Error updating profile.");
      alert("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
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

  return (
    <div className="flex h-screen bg-gray-50">
      <Navbar type="student" />
      <motion.div 
        className="flex-1 overflow-auto"
        style={{ marginLeft: `${sidebarWidth}px` }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div className="max-w-4xl mx-auto py-8 px-4 md:px-8">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="relative h-32 bg-gradient-to-r from-purple-500 to-blue-500">
              {isEditing && (
                <button onClick={handleSave} className="absolute top-4 right-4 bg-white text-purple-600 p-2 rounded-full shadow-md hover:bg-purple-50 transition-colors" disabled={loading}>
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
                        value={editedProfile.name}
                        onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                        className="text-center border-b-2 focus:outline-none focus:border-purple-500"
                      />
                    ) : (
                      profile.name
                    )}
                  </h1>
                  <p className="text-gray-600 mt-1">{profile.role}</p>
                  <p className="flex items-center justify-center text-gray-500 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {profile.location}
                  </p>
                  <p className="text-gray-500 mt-1">{profile.college}</p> {/* Displaying college */}
                </motion.div>
              </div>

              {/* Bio */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-2">About Me</h3>
                {isEditing ? (
                  <textarea
                    value={editedProfile.bio}
                    onChange={(e) => setEditedProfile({ ...editedProfile, bio: e.target.value })}
                    className="w-full p-2 border rounded focus:outline-none focus:border-purple-500"
                    rows="4"
                  />
                ) : (
                  <p className="text-gray-600">{profile.bio}</p>
                )}
              </div>

              {/* Skills */}
              <motion.div className="mt-8">
                <h3 className="text-xl font-semibold mb-3">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {editedProfile.skills?.map((skill, index) => (
                    <motion.span
                      key={skill}
                      className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>

              {/* Experience */}
              <motion.div className="mt-8">
                <h3 className="text-xl font-semibold mb-3">Experience</h3>
                {editedProfile.experience?.map((exp, index) => (
                  <motion.div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold">{exp.company}</h4>
                    <p className="text-gray-600">{exp.role}</p>
                    <p className="text-gray-500 text-sm">{exp.duration}</p>
                    <p className="text-gray-600 mt-2">{exp.description}</p>
                  </motion.div>
                ))}
              </motion.div>

              {/* Edit Button */}
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

export default StudentProfilePage;
