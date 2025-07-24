import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  Search,
  Calendar,
  Bookmark,
  User,
  CheckCircle
} from 'lucide-react';
import Navbar from '../../components/shared/Navbar';

// Native Button Component
const Button = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  onClick, 
  size = 'default',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'bg-purple-600 text-white hover:bg-purple-700',
    secondary: 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-100',
    ghost: 'hover:bg-gray-100 text-gray-600',
    outline: 'border border-gray-200 hover:bg-gray-100'
  };

  const sizes = {
    default: 'h-10 py-2 px-4',
    sm: 'h-9 px-3',
    lg: 'h-11 px-8',
    icon: 'h-10 w-10'
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

// Native Input Component
const Input = ({ className = '', ...props }) => (
  <input
    className={`flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

// Native Select Component
const Select = ({ children, value, onChange, className = '' }) => (
  <select
    value={value}
    onChange={onChange}
    className={`flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
  >
    {children}
  </select>
);

// Native Badge Component
const Badge = ({ children, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-purple-100 text-purple-800',
    outline: 'border border-gray-200 text-gray-800',
    secondary: 'bg-gray-100 text-gray-800'
  };

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-offset-2 ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

// Success Notification Component
const SuccessNotification = ({ message, onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg max-w-sm">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <CheckCircle className="h-5 w-5 text-green-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-green-800">{message}</p>
          </div>
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className="inline-flex rounded-md p-1.5 text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-400"
                onClick={onClose}
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Course Card Component
const CourseCard = ({ course, onEnroll, recommended = false }) => {
  const [showEnrollDialog, setShowEnrollDialog] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(course.isEnrolled || false);

  // Add safe defaults for missing data
  const safeInstructor = course.instructor || { name: 'Unknown Instructor', avatar: null };
  const safeThumbnail = course.thumbnail || 'placeholder.jpg';
  const safeRating = course.rating || 0;
  const safeEnrolledCount = course.enrolledCount || 0;

  const handleEnrollClick = (e) => {
    e.stopPropagation();
    if (isEnrolled) {
      // If already enrolled, just continue to course
      return;
    }
    setShowEnrollDialog(true);
  };

  const handleConfirmEnroll = async () => {
    try {
      await onEnroll(course.id);
      setIsEnrolled(true);
      setShowEnrollDialog(false);
    } catch (error) {
      console.error('Enrollment error:', error);
    }
  };

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-shadow">
      <div className="relative">
        <img 
          src={`https://connectyoubackend.nestsindia.com/${safeThumbnail}`}
          alt={course.title || 'Course thumbnail'} 
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/400x300/f3f4f6/9ca3af?text=Course+Image';
          }}
        />
        {recommended && (
          <Badge className="absolute top-4 left-4 bg-purple-600 text-white">
            Recommended
          </Badge>
        )}
        <Badge className="absolute top-4 right-4 bg-white text-purple-600">
          {course.level || 'All Levels'}
        </Badge>
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline">{course.category || 'General'}</Badge>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            {course.duration || 'Self-paced'}
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-2">{course.title || 'Untitled Course'}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">
          {course.description || 'No description available.'}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            {safeInstructor.avatar ? (
              <img
                src={safeInstructor.avatar}
                alt={safeInstructor.name}
                className="w-6 h-6 rounded-full mr-2"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'inline-flex';
                }}
              />
            ) : null}
            <div 
              className="w-6 h-6 rounded-full mr-2 bg-gray-200 flex items-center justify-center"
              style={{ display: safeInstructor.avatar ? 'none' : 'inline-flex' }}
            >
              <User className="w-3 h-3 text-gray-500" />
            </div>
            <span className="text-sm text-gray-700">
              {safeInstructor.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              <Users className="w-4 h-4 text-gray-400 mr-1" />
              <span className="text-sm text-gray-500">
                {safeEnrolledCount}
              </span>
            </div>
            <div className="flex items-center">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-sm font-medium">
                {safeRating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            className="flex-1"
            onClick={handleEnrollClick}
          >
            <Play className="w-4 h-4 mr-2" />
            {isEnrolled ? 'Continue' : 'Enroll Now'}
          </Button>
          <Button variant="outline" size="icon">
            <Bookmark className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {showEnrollDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Enroll in {course.title}</h2>
            <p className="text-gray-600 mb-6">
              This course will take approximately {course.duration || 'some time'} to complete. 
              You'll have lifetime access to the course content.
            </p>
            <div className="flex justify-end gap-2">
              <Button 
                variant="ghost" 
                onClick={() => setShowEnrollDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleConfirmEnroll}>
                Enroll Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ELearningPage = () => {
  const [courses, setCourses] = useState([]);
  const [recommendedCourses, setRecommendedCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const categories = [
    { id: 'all', label: 'All Courses' },
    { id: 'development', label: 'Development' },
    { id: 'design', label: 'Design' },
    { id: 'business', label: 'Business' }
  ];

  const levels = [
    { id: 'all', label: 'All Levels' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
  
        // Fetching courses
        const coursesResponse = await fetch('https://connectyoubackend.nestsindia.com/api/courses');
        if (!coursesResponse.ok) {
          throw new Error('Failed to fetch courses');
        }
        const coursesData = await coursesResponse.json();
        console.log("Fetched courses data:", coursesData);
        
        // Ensure we have an array and add IDs if missing
        const processedCourses = Array.isArray(coursesData) 
          ? coursesData.map((course, index) => ({
              id: course.id || `course-${index}`,
              ...course
            }))
          : [];
        
        setCourses(processedCourses);
  
        // Fetching course recommendations (using same endpoint for now)
        const recommendationsResponse = await fetch('https://connectyoubackend.nestsindia.com/api/courses');
        if (!recommendationsResponse.ok) {
          throw new Error('Failed to fetch recommendations');
        }
        const recommendationsData = await recommendationsResponse.json();
        console.log("Fetched recommendations:", recommendationsData);
        
        const processedRecommendations = Array.isArray(recommendationsData) 
          ? recommendationsData.slice(0, 3).map((course, index) => ({
              id: course.id || `rec-${index}`,
              ...course
            }))
          : [];
        
        setRecommendedCourses(processedRecommendations);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [selectedCategory, selectedLevel, searchTerm]);
  
  const handleEnroll = async (courseId) => {
    try {
      // Simulate API call
      console.log(`Enrolling in course ${courseId}`);
      
      // In a real app, you would make an actual API call here
      // const response = await fetch(`https://connectyoubackend.nestsindia.com/api/courses/${courseId}/enroll`, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // });
      
      // if (!response.ok) throw new Error('Failed to enroll');
      
      // Update the course in state
      setCourses(prevCourses => 
        prevCourses.map(course => 
          course.id === courseId 
            ? { ...course, isEnrolled: true } 
            : course
        )
      );
      
      setRecommendedCourses(prevRecs => 
        prevRecs.map(course => 
          course.id === courseId 
            ? { ...course, isEnrolled: true } 
            : course
        )
      );
      
      // Show success notification
      const enrolledCourse = courses.find(c => c.id === courseId) || 
                           recommendedCourses.find(c => c.id === courseId);
      setSuccessMessage(`Successfully enrolled in "${enrolledCourse?.title || 'the course'}"!`);
      setShowSuccess(true);
      
      // Hide the notification after 5 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 5000);
      
      return { success: true };
    } catch (error) {
      console.error('Error enrolling in course:', error);
      throw error;
    }
  };

  // Filter courses based on search and filters
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    
    return matchesSearch && matchesCategory && matchesLevel;
  });
  
  return (
    <div className="flex min-h-screen">
      <div className="flex-none">
        
      </div>
      <div className="flex-1 ml-64">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">Expand Your Knowledge</h1>
                <p className="text-purple-100 text-lg">
                  Learn from industry experts and advance your career
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="secondary">
                  <Calendar className="w-5 h-5 mr-2" />
                  Learning Plan
                </Button>
                <Button variant="secondary">
                  <Bookmark className="w-5 h-5 mr-2" />
                  Saved Courses
                </Button>
              </div>
            </div>
          </div>
        </div>
    
        {/* Filters */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search courses..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-4">
                <Select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-[180px]"
                >
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </Select>
                
                <Select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-[180px]"
                >
                  {levels.map(level => (
                    <option key={level.id} value={level.id}>
                      {level.label}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
          </div>
        </div>
    
        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {showSuccess && (
            <SuccessNotification 
              message={successMessage}
              onClose={() => setShowSuccess(false)}
            />
          )}
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <div className="text-red-500 mb-2">Error loading courses</div>
                <div className="text-gray-500 text-sm">{error}</div>
              </div>
            </div>
          ) : (
            <>
              {/* Recommended Courses */}
              {recommendedCourses.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Recommended for You</h2>
                    <Button variant="ghost" className="text-purple-600">
                      View All
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recommendedCourses.map(course => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        onEnroll={handleEnroll}
                        recommended
                      />
                    ))}
                  </div>
                </div>
              )}
    
              {/* All Courses */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">All Courses</h2>
                {filteredCourses.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map(course => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        onEnroll={handleEnroll}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-gray-500 mb-2">No courses found</div>
                    <div className="text-gray-400 text-sm">Try adjusting your search or filters</div>
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ELearningPage;