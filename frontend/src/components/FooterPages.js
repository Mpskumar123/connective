import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, GraduationCap, Shield, FileText, Users, Mail, Eye, Lock, AlertCircle, CheckCircle, Home } from 'lucide-react';

const FooterPages = () => {
  const [currentPage, setCurrentPage] = useState('home');

  // Configure your landing page URL here
  const LANDING_PAGE_URL = '/'; // Change this to your actual landing page URL

  const gradientStyle = {
    background: 'linear-gradient(135deg, #5643e4 0%, #8837e9 100%)',
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const Header = ({ title, icon }) => (
    <motion.div 
      className="text-center mb-12"
      initial="hidden"
      animate="visible"
      variants={fadeInVariants}
    >
      <div className="flex justify-center mb-6">
        <div className="bg-white p-4 rounded-full shadow-lg">
          {icon}
        </div>
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
      <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto rounded-full"></div>
    </motion.div>
  );

  const Section = ({ title, children, icon }) => (
    <motion.div 
      className="mb-8"
      variants={fadeInVariants}
    >
      <div className="flex items-center mb-4">
        {icon && <div className="mr-3 text-purple-600">{icon}</div>}
        <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="text-gray-600 leading-relaxed space-y-4">
        {children}
      </div>
    </motion.div>
  );

  const BackButton = () => (
    <motion.button
      onClick={() => setCurrentPage('home')}
      className="flex items-center text-purple-600 hover:text-purple-700 mb-6 transition-colors"
      whileHover={{ x: -5 }}
    >
      <ArrowLeft className="mr-2 h-5 w-5" />
      Back to Navigation
    </motion.button>
  );

  const BackToHomeButton = () => (
    <motion.button
      onClick={() => window.location.href = LANDING_PAGE_URL}
      className="flex items-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl mb-6"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Home className="mr-2 h-5 w-5" />
      Back to Home
    </motion.button>
  );

  const HomePage = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="text-white py-20" style={gradientStyle}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
          >
            <div className="flex justify-center mb-6">
              <div className="bg-white p-3 rounded-full">
                <GraduationCap className="h-12 w-12 text-purple-600" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-6">ConnectYou Legal Center</h1>
            <p className="text-xl text-gray-100 max-w-2xl mx-auto mb-8">
              Transparency and trust are the foundation of our student-alumni engagement platform
            </p>
            <BackToHomeButton />
          </motion.div>
        </div>
      </div>

      {/* Navigation Cards */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <motion.div 
          className="grid md:grid-cols-2 gap-8"
          initial="hidden"
          animate="visible"
          variants={staggerVariants}
        >
          <motion.div
            variants={fadeInVariants}
            whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
            className="bg-white rounded-2xl p-8 shadow-lg cursor-pointer border border-gray-100"
            onClick={() => setCurrentPage('terms')}
          >
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 p-3 rounded-full mr-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Terms of Service</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Understand your rights and responsibilities when using ConnectYou's platform for student-alumni networking.
            </p>
            <div className="space-y-3 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                User responsibilities and conduct
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Platform usage guidelines
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Account terms and conditions
              </div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeInVariants}
            whileHover={{ y: -10, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
            className="bg-white rounded-2xl p-8 shadow-lg cursor-pointer border border-gray-100"
            onClick={() => setCurrentPage('privacy')}
          >
            <div className="flex items-center mb-6">
              <div className="bg-purple-100 p-3 rounded-full mr-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Privacy Policy</h2>
            </div>
            <p className="text-gray-600 mb-6">
              Learn how we protect, collect, and use your personal information to enhance your networking experience.
            </p>
            <div className="space-y-3 text-sm text-gray-500">
              <div className="flex items-center">
                <Lock className="h-4 w-4 text-purple-500 mr-2" />
                Data collection and usage
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 text-purple-500 mr-2" />
                Information sharing policies
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-purple-500 mr-2" />
                Security and protection measures
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );

  const TermsOfService = () => (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <BackButton />
          <BackToHomeButton />
        </div>
        <Header 
          title="Terms of Service" 
          icon={<FileText className="h-12 w-12 text-purple-600" />} 
        />
        
        <motion.div 
          className="bg-white rounded-2xl p-8 shadow-lg"
          initial="hidden"
          animate="visible"
          variants={staggerVariants}
        >
          <div className="mb-8 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <p className="text-sm text-blue-800">
              <strong>Last updated:</strong> January 2025 | <strong>Effective:</strong> Upon account creation
            </p>
          </div>

          <Section title="1. Acceptance of Terms" icon={<CheckCircle className="h-6 w-6" />}>
            <p>
              By accessing or using ConnectYou's platform, you agree to be bound by these Terms of Service. 
              ConnectYou is a student-alumni engagement platform designed to facilitate meaningful connections, 
              mentorship opportunities, and career development within academic communities.
            </p>
          </Section>

          <Section title="2. Platform Purpose & Eligibility" icon={<Users className="h-6 w-6" />}>
            <p>
              <strong>Platform Purpose:</strong> ConnectYou connects current students with alumni for mentorship, 
              career guidance, networking, and professional development opportunities.
            </p>
            <p>
              <strong>Eligibility Requirements:</strong>
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Current students: Must be enrolled in an accredited educational institution</li>
              <li>Alumni: Must be graduates of participating educational institutions</li>
              <li>All users must be at least 16 years old</li>
              <li>Users must provide accurate and verifiable information</li>
            </ul>
          </Section>

          <Section title="3. User Accounts & Verification" icon={<Lock className="h-6 w-6" />}>
            <p>
              <strong>Account Creation:</strong> Users must create accounts using institutional email addresses 
              or provide verification of their student/alumni status through approved documentation.
            </p>
            <p>
              <strong>Account Security:</strong> Users are responsible for maintaining the confidentiality of 
              their account credentials and for all activities under their account.
            </p>
          </Section>

          <Section title="4. Acceptable Use Policy" icon={<AlertCircle className="h-6 w-6" />}>
            <p><strong>Permitted Uses:</strong></p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Seeking and providing mentorship and career guidance</li>
              <li>Professional networking within your academic community</li>
              <li>Sharing educational and career-related resources</li>
              <li>Participating in alumni events and activities</li>
            </ul>
            
            <p className="mt-4"><strong>Prohibited Activities:</strong></p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Harassment, discrimination, or inappropriate behavior</li>
              <li>Sharing false or misleading information</li>
              <li>Using the platform for commercial solicitation without permission</li>
              <li>Attempting to circumvent platform security measures</li>
              <li>Sharing content that violates intellectual property rights</li>
            </ul>
          </Section>

          <Section title="5. Privacy & Data Protection" icon={<Shield className="h-6 w-6" />}>
            <p>
              Your privacy is important to us. Our Privacy Policy, which is incorporated by reference into 
              these Terms, describes how we collect, use, and protect your personal information. By using 
              ConnectYou, you consent to our privacy practices as outlined in our Privacy Policy.
            </p>
          </Section>

          <Section title="6. Intellectual Property" icon={<FileText className="h-6 w-6" />}>
            <p>
              ConnectYou respects intellectual property rights. Users retain ownership of content they create 
              and share on the platform, but grant ConnectYou a license to display and distribute such content 
              as necessary for platform operation.
            </p>
          </Section>

          <Section title="7. Limitation of Liability" icon={<AlertCircle className="h-6 w-6" />}>
            <p>
              ConnectYou facilitates connections between students and alumni but is not responsible for the 
              quality, accuracy, or outcomes of these interactions. Users engage with others at their own 
              discretion and assume responsibility for their communications and meetings.
            </p>
          </Section>

          <Section title="8. Contact Information" icon={<Mail className="h-6 w-6" />}>
            <p>
              For questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mt-2">
              <p><strong>Email:</strong> connectyou83@gmail.com</p>
              <p><strong>Phone:</strong> +91 9392479356</p>
              <p><strong>Address:</strong> LPU, Punjab</p>
            </div>
          </Section>
        </motion.div>
      </div>
    </div>
  );

  const PrivacyPolicy = () => (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <BackButton />
          <BackToHomeButton />
        </div>
        <Header 
          title="Privacy Policy" 
          icon={<Shield className="h-12 w-12 text-purple-600" />} 
        />
        
        <motion.div 
          className="bg-white rounded-2xl p-8 shadow-lg"
          initial="hidden"
          animate="visible"
          variants={staggerVariants}
        >
          <div className="mb-8 p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400">
            <p className="text-sm text-purple-800">
              <strong>Last updated:</strong> January 2025 | <strong>Your privacy matters to us</strong>
            </p>
          </div>

          <Section title="1. Information We Collect" icon={<Eye className="h-6 w-6" />}>
            <p><strong>Personal Information:</strong></p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Name, email address, and contact information</li>
              <li>Academic information (institution, graduation year, field of study)</li>
              <li>Professional information (current position, industry, skills)</li>
              <li>Profile photos and biographical information</li>
            </ul>
            
            <p className="mt-4"><strong>Platform Usage Data:</strong></p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Connection requests and interactions</li>
              <li>Messages and communication logs</li>
              <li>Event participation and engagement metrics</li>
              <li>Platform preferences and settings</li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Information" icon={<Users className="h-6 w-6" />}>
            <p><strong>Platform Operations:</strong></p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Facilitating connections between students and alumni</li>
              <li>Matching users based on interests, fields, and goals</li>
              <li>Providing personalized recommendations and suggestions</li>
              <li>Enabling communication through our messaging system</li>
            </ul>
            
            <p className="mt-4"><strong>Service Improvement:</strong></p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Analyzing platform usage to enhance user experience</li>
              <li>Developing new features and functionalities</li>
              <li>Providing customer support and resolving issues</li>
            </ul>
          </Section>

          <Section title="3. Information Sharing" icon={<Shield className="h-6 w-6" />}>
            <p><strong>Within the Platform:</strong></p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Profile information is visible to other verified users</li>
              <li>Connection status and basic interactions may be shown</li>
              <li>Participation in events and groups may be visible to other members</li>
            </ul>
            
            <p className="mt-4"><strong>External Sharing:</strong></p>
            <p className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
              <strong>We do not sell your personal information.</strong> We may share anonymized, 
              aggregated data for research or analytics purposes with educational institutions 
              or research partners.
            </p>
          </Section>

          <Section title="4. Data Security" icon={<Lock className="h-6 w-6" />}>
            <p><strong>Security Measures:</strong></p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Access controls and authentication measures</li>
              <li>Secure data storage with reputable cloud providers</li>
            </ul>
            
            <p className="mt-4">
              While we implement industry-standard security measures, no system is completely secure. 
              Users should also take precautions to protect their personal information.
            </p>
          </Section>

          <Section title="5. Your Privacy Rights" icon={<CheckCircle className="h-6 w-6" />}>
            <p><strong>You have the right to:</strong></p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Correct:</strong> Update or correct inaccurate information</li>
              <li><strong>Delete:</strong> Request deletion of your account and associated data</li>
              <li><strong>Restrict:</strong> Limit how we process your information</li>
              <li><strong>Export:</strong> Receive your data in a portable format</li>
            </ul>
          </Section>

          <Section title="6. Cookies & Tracking" icon={<Eye className="h-6 w-6" />}>
            <p>
              We use cookies and similar technologies to enhance your experience, remember your 
              preferences, and analyze platform usage. You can control cookie settings through 
              your browser, though some features may not function properly if cookies are disabled.
            </p>
          </Section>

          <Section title="7. Data Retention" icon={<FileText className="h-6 w-6" />}>
            <p>
              We retain your personal information for as long as your account is active or as 
              needed to provide services. When you delete your account, we will delete or anonymize 
              your personal information within 30 days, except where retention is required by law.
            </p>
          </Section>

          <Section title="8. Contact Us" icon={<Mail className="h-6 w-6" />}>
            <p>
              For privacy-related questions or to exercise your rights, contact our privacy team:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg mt-2">
              <p><strong>Privacy Officer:</strong> connectyou83@gmail.com</p>
              <p><strong>Phone:</strong> +91 9392479356</p>
              <p><strong>Address:</strong> LPU, Punjab</p>
              <p><strong>Response Time:</strong> We aim to respond within 5 business days</p>
            </div>
          </Section>
        </motion.div>
      </div>
    </div>
  );

  return (
    <div>
      {currentPage === 'home' && <HomePage />}
      {currentPage === 'terms' && <TermsOfService />}
      {currentPage === 'privacy' && <PrivacyPolicy />}
    </div>
  );
};

export default FooterPages;