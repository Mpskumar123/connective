import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Signup from './pages/Signup';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Navbar from './components/shared/Navbar';
import ResetPassword from './pages/PasswordResetForm';
import AboutUs from './components/AboutUs';
import Blog from './components/Blog';

// General Pages
import AIAssistantPage from "./pages/Dashboard/AIAssistantPage";
import ELearningPage from "./pages/Dashboard/ELearningPage";
import JobsPage from "./pages/Dashboard/JobsPage";
import MentorPage from "./pages/Dashboard/MentorPage";
import MessagesPage from "./pages/Dashboard/MessagesPage";
import OpenProjectsPage from "./pages/Dashboard/OpenProjectsPage";
import WorkshopsPage from "./pages/Dashboard/WorkshopsPage";
import ProfilePage from "./pages/Dashboard/ProfilePage";
import EventsPage from "./pages/Dashboard/EventsPage";

// Alumni Dashboard Pages
import AlumniDashboard from './pages/Dashboard/AlumniDashboard';
import AlumniELearningPage from './pages/Dashboard/AlumniELearningPage';
import AlumniMentorship from './pages/Dashboard/AlumniMentorship';
import AlumniJobPostings from './pages/Dashboard/AlumniJobPostings';
import AlumniKnowledge from './pages/Dashboard/AlumniKnowledge';
import AlumniEvents from './pages/Dashboard/AlumniEvents';
import AlumniMessages from './pages/Dashboard/AlumniMessages';
import AlumniProfile from './pages/Dashboard/AlumniProfile';
import AlumniAIAssistant from './pages/Dashboard/AlumniAIAssistant';
import AlumniProjects from './pages/Dashboard/AlumniProjects';

// Create a layout component for student pages
const StudentLayout = () => {
  return (
    <div className="flex">
      <Navbar type="student" />
      <div className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/e-learning" element={<ELearningPage />} />
          <Route path="/mentorship" element={<MentorPage />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/projects" element={<OpenProjectsPage />} />
          <Route path="/ai-assistant" element={<AIAssistantPage />} />
          <Route path="/workshops" element={<WorkshopsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </div>
    </div>
  );
};

// Create a layout component for alumni pages
const AlumniLayout = () => {
  return (
    <div className="flex">
      <Navbar type="alumni" />
      <div className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<AlumniDashboard />} />
          <Route path="/e-learning" element={<AlumniELearningPage />} />
          <Route path="/mentorship" element={<AlumniMentorship />} />
          <Route path="/job-postings" element={<AlumniJobPostings />} />
          <Route path="/knowledge" element={<AlumniKnowledge />} />
          <Route path="/events" element={<AlumniEvents />} />
          <Route path="/messages" element={<AlumniMessages />} />
          <Route path="/ai-assistant" element={<AlumniAIAssistant />} />
          <Route path="/profile" element={<AlumniProfile />} />
          <Route path="/projects" element={<AlumniProjects />} />
        </Routes>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="/blog" element={<Blog />} />

      {/* Student Dashboard with Navbar */}
      <Route path="/dashboard/*" element={<StudentLayout />} />

      {/* Alumni Dashboard with Navbar */}
      <Route path="/alumni/*" element={<AlumniLayout />} />
    </Routes>
  );
};

export default App;