import React, { useState, useEffect } from 'react';
import { MapPin, DollarSign, Clock, Building, Search, Bookmark, ExternalLink, CheckCircle } from 'lucide-react';
import Navbar from '../../components/shared/Navbar';
import JobApplicationModal from './JobApplicationModal';

const JobsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  
  // Modal state
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  const jobTypes = ['All', 'Full-time', 'Part-time', 'Internship', 'Contract'];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/jobs`);
        const data = await response.json();
        setJobs(data);
        
        // Load saved jobs from localStorage (or you could fetch from backend)
        const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
        setSavedJobs(new Set(saved));
        
        const applied = JSON.parse(localStorage.getItem('appliedJobs') || '[]');
        setAppliedJobs(new Set(applied));
      } catch (error) {
        console.error('Error fetching job data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job =>
    (selectedType === 'All' || job.type === selectedType) &&
    (job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setShowApplicationModal(true);
  };

  const handleApplicationSubmit = (result) => {
    console.log('Application submitted:', result);
    setApplicationSuccess(true);
    
    // Add to applied jobs
    const newAppliedJobs = new Set([...appliedJobs, selectedJob._id]);
    setAppliedJobs(newAppliedJobs);
    localStorage.setItem('appliedJobs', JSON.stringify([...newAppliedJobs]));
    
    // Show success message
    setTimeout(() => {
      setApplicationSuccess(false);
    }, 3000);
  };

  const handleSaveJob = (jobId) => {
    const newSavedJobs = new Set(savedJobs);
    if (savedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
    } else {
      newSavedJobs.add(jobId);
    }
    setSavedJobs(newSavedJobs);
    localStorage.setItem('savedJobs', JSON.stringify([...newSavedJobs]));
  };

  // Enhanced loading state
  if (loading) {
    return (
      <div className="flex min-h-screen">
        <div className="flex-none">
          
        </div>
        <div className="flex-1 ml-64">
          <div className="w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-2/4 mb-8"></div>
                <div className="h-12 bg-white rounded w-full mb-4"></div>
                <div className="flex gap-2 mb-8">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="h-10 bg-gray-200 rounded-full w-24"></div>
                  ))}
                </div>
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 bg-white rounded-lg mb-4"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <div className="flex-none">
        
      </div>
      <div className="flex-1 ml-64 md:ml-64 sm:ml-64">
        <div className="w-full bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50">
          <div className="p-4 sm:p-6 max-w-7xl mx-auto">
            {/* Success Message */}
            {applicationSuccess && (
              <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                <span>Application submitted successfully! We'll be in touch soon.</span>
              </div>
            )}

            {/* Header */}
            <div className="mb-6 sm:mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Jobs & Internships</h1>
              <p className="text-gray-600">Find your next career opportunity</p>
            </div>

            {/* Search and Filters */}
            <div className="mb-6 sm:mb-8 space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search jobs by title or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent shadow-sm"
                />
              </div>

              <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-2 no-scrollbar">
                {jobTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 sm:px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                      selectedType === type
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Job Results Count */}
            <div className="mb-4">
              <p className="text-gray-600 text-sm">
                Showing {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
                {selectedType !== 'All' && ` in ${selectedType}`}
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>

            {/* Jobs List */}
            {filteredJobs.length > 0 ? (
              <div className="space-y-4">
                {filteredJobs.map(job => (
                  <div key={job._id} className="bg-white rounded-lg shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="flex-shrink-0 mx-auto sm:mx-0">
                        <div className="bg-gray-50 p-2 rounded-lg flex items-center justify-center">
                          {job.logo ? (
                            <img src={job.logo} alt={job.company} className="w-12 h-12 rounded-lg object-contain" />
                          ) : (
                            <Building className="w-12 h-12 text-gray-400" />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                          <h3 className="text-xl font-semibold text-center sm:text-left">{job.title}</h3>
                          <span className="text-sm text-gray-500 text-center sm:text-left mt-1 sm:mt-0">{job.posted}</span>
                        </div>
                        
                        <div className="flex flex-wrap gap-y-2 gap-x-4 text-gray-600 text-sm mb-4 justify-center sm:justify-start">
                          <div className="flex items-center">
                            <Building className="w-4 h-4 mr-1" />
                            <span>{job.company}</span>
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            <span>{job.salary}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{job.type}</span>
                          </div>
                        </div>

                        {/* Job Description Preview */}
                        {job.description && (
                          <div className="mb-4">
                            <p className="text-gray-600 text-sm line-clamp-2">
                              {job.description.length > 150 
                                ? `${job.description.substring(0, 150)}...` 
                                : job.description
                              }
                            </p>
                          </div>
                        )}

                        <div className="flex gap-2 justify-center sm:justify-start">
                          {appliedJobs.has(job._id) ? (
                            <button 
                              disabled
                              className="flex items-center bg-green-100 text-green-700 py-2 px-4 rounded-lg cursor-not-allowed"
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              <span>Applied</span>
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleApplyClick(job)}
                              className="flex items-center bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              <span>Apply Now</span>
                            </button>
                          )}
                          
                          <button 
                            onClick={() => handleSaveJob(job._id)}
                            className={`flex items-center py-2 px-4 rounded-lg transition-colors ${
                              savedJobs.has(job._id)
                                ? 'bg-purple-100 text-purple-700 border border-purple-200'
                                : 'border border-purple-600 text-purple-600 hover:bg-purple-50'
                            }`}
                          >
                            <Bookmark className={`w-4 h-4 mr-2 ${savedJobs.has(job._id) ? 'fill-current' : ''}`} />
                            <span>{savedJobs.has(job._id) ? 'Saved' : 'Save Job'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="flex justify-center mb-4">
                  <Search className="w-12 h-12 text-gray-300" />
                </div>
                <h3 className="text-xl font-medium mb-2">No jobs found</h3>
                <p className="text-gray-600">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Job Application Modal */}
      <JobApplicationModal
        job={selectedJob}
        isOpen={showApplicationModal}
        onClose={() => {
          setShowApplicationModal(false);
          setSelectedJob(null);
        }}
        onSubmit={handleApplicationSubmit}
      />
    </div>
  );
};

export default JobsPage;