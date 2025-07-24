import React, { useEffect, useState } from 'react';
import { motion } from "framer-motion";
import Navbar from '../../components/shared/Navbar';
import axios from 'axios';
import { FolderOpen, Plus, Clock, X, Star, Users, GitBranch, Filter } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5 } }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const AlumniProjects = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form modal states
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tech: '',
    difficulty: '',
    contributors: '',
    stars: '',
    lastActive: '',
  });

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://connectyoubackend.nestsindia.com/api/projects', {
        headers: { Authorization: `Bearer ${token}` },
        params: { category, search }
      });
      setProjects(response.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'https://connectyoubackend.nestsindia.com/api/projects',
        {
          ...formData,
          tech: formData.tech.split(',').map(t => t.trim()),
          contributors: Number(formData.contributors),
          stars: Number(formData.stars),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        category: '',
        tech: '',
        difficulty: '',
        contributors: '',
        stars: '',
        lastActive: '',
      });
      fetchProjects();
    } catch (err) {
      console.error('Error adding project:', err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [search, category]);

  // Define difficulty badge colors
  const getDifficultyColor = (difficulty) => {
    switch(difficulty?.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      

      <div className="w-full md:ml-64 p-4 md:p-8">
        <motion.div 
          initial={fadeIn.hidden}
          animate={fadeIn.visible}
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
                Alumni Projects
              </span>
            </motion.h1>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-md"
              onClick={() => setShowForm(true)}
            >
              <Plus className="w-4 h-4" /> Add Project
            </motion.button>
          </div>

          {/* Search and Filters */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-grow">
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  className="px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition min-w-36"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="All">All Categories</option>
                  <option value="Web Development">Web Development</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Data Science">Data Science</option>
                </select>
                
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-white border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-center hover:bg-gray-50 transition"
                >
                  <Filter className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
            
            {/* Additional filters that can be toggled */}
            {showFilters && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-white p-4 rounded-lg shadow-md mb-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                    <select className="w-full rounded-md border border-gray-300 py-2 px-3">
                      <option value="">Any Difficulty</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                    <select className="w-full rounded-md border border-gray-300 py-2 px-3">
                      <option value="newest">Newest</option>
                      <option value="oldest">Oldest</option>
                      <option value="stars">Most Stars</option>
                      <option value="contributors">Most Contributors</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tech Stack</label>
                    <select className="w-full rounded-md border border-gray-300 py-2 px-3">
                      <option value="">Any Technology</option>
                      <option value="react">React</option>
                      <option value="python">Python</option>
                      <option value="node">Node.js</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Project Form Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-6 rounded-xl w-full max-w-lg shadow-xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-gray-800">Add New Project</h2>
                  <button 
                    onClick={() => setShowForm(false)} 
                    className="text-gray-500 hover:text-gray-800 transition"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                    <input 
                      name="title" 
                      placeholder="E.g., Alumni Network Platform" 
                      value={formData.title} 
                      onChange={handleFormChange} 
                      className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea 
                      name="description" 
                      placeholder="A brief description of your project..." 
                      value={formData.description} 
                      onChange={handleFormChange} 
                      className="w-full border border-gray-300 p-2 rounded-lg h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      required 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select 
                        name="category" 
                        value={formData.category} 
                        onChange={handleFormChange} 
                        className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="Web Development">Web Development</option>
                        <option value="AI/ML">AI/ML</option>
                        <option value="Data Science">Data Science</option>
                        <option value="Mobile Development">Mobile Development</option>
                        <option value="DevOps">DevOps</option>
                        <option value="Blockchain">Blockchain</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                      <select 
                        name="difficulty" 
                        value={formData.difficulty} 
                        onChange={handleFormChange} 
                        className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="">Select Difficulty</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Technologies (comma separated)</label>
                    <input 
                      name="tech" 
                      placeholder="E.g., React, Node.js, MongoDB" 
                      value={formData.tech} 
                      onChange={handleFormChange} 
                      className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Contributors</label>
                      <input 
                        type="number" 
                        name="contributors" 
                        placeholder="E.g., 3" 
                        value={formData.contributors} 
                        onChange={handleFormChange} 
                        className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Stars</label>
                      <input 
                        type="number" 
                        name="stars" 
                        placeholder="E.g., 42" 
                        value={formData.stars} 
                        onChange={handleFormChange} 
                        className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Last Active Date</label>
                    <input 
                      type="date" 
                      name="lastActive" 
                      value={formData.lastActive} 
                      onChange={handleFormChange} 
                      className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    />
                  </div>
                  
                  <div className="flex justify-end gap-3 mt-6">
                    <button 
                      type="button" 
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition shadow"
                    >
                      Add Project
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}

          {/* Projects Grid */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {projects.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white rounded-xl shadow-md p-8 text-center"
                >
                  <img 
                    src="/api/placeholder/200/200" 
                    alt="No projects found" 
                    className="mx-auto mb-4 opacity-50"
                  />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No projects found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search or filters, or add a new project!</p>
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Your First Project
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial="hidden"
                  animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
                >
                  {projects.map((project) => (
                    <motion.div
                      key={project._id}
                      variants={cardVariants}
                      className="bg-white rounded-xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col"
                    >
                      <div className="h-3 bg-gradient-to-r from-blue-500 to-purple-600"></div>
                      <div className="p-6 flex-grow">
                        <h3 className="text-xl font-bold mb-2 text-gray-800">{project.title}</h3>
                        <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                        
                        {project.tech && project.tech.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.tech.slice(0, 3).map((tech, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                {tech}
                              </span>
                            ))}
                            {project.tech.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                +{project.tech.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                        
                        {project.difficulty && (
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium mb-4 ${getDifficultyColor(project.difficulty)}`}>
                            {project.difficulty}
                          </span>
                        )}
                      </div>
                      
                      <div className="border-t border-gray-100 px-6 py-3 bg-gray-50 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <FolderOpen className="w-4 h-4" /> {project.category || 'General'}
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {project.contributors && (
                            <div className="flex items-center gap-1 text-gray-500 text-sm">
                              <Users className="w-3 h-3" /> {project.contributors}
                            </div>
                          )}
                          
                          {project.stars && (
                            <div className="flex items-center gap-1 text-gray-500 text-sm">
                              <Star className="w-3 h-3 text-yellow-500" /> {project.stars}
                            </div>
                          )}
                          
                          <div className="flex items-center gap-1 text-gray-500 text-sm">
                            <Clock className="w-3 h-3" /> 
                            {new Date(project.lastActive || project.createdAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AlumniProjects;