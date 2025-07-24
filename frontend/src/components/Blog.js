import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BookOpen, Calendar, User, Tag, Search, ChevronRight, Home, MessageSquare, ThumbsUp, Share2, Eye, Clock, TrendingUp, Users, Zap, Globe, Briefcase, GraduationCap, Heart, Wifi, CheckCircle } from 'lucide-react';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentBlogPost, setCurrentBlogPost] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Configure your landing page URL here
  const LANDING_PAGE_URL = '/';

  const gradientStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
  };

  const cardGradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  ];

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

  const slideInVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  const BackToHomeButton = () => (
    <motion.button
      onClick={() => window.location.href = LANDING_PAGE_URL}
      className="flex items-center bg-white/20 backdrop-blur-md text-white px-6 py-3 rounded-full hover:bg-white/30 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20 group"
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
    >
      <Home className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
      Back to Home
    </motion.button>
  );

  const BackButton = () => (
    <motion.button
      onClick={() => setCurrentBlogPost(null)}
      className="flex items-center text-purple-600 hover:text-purple-700 mb-6 transition-colors group"
      whileHover={{ x: -5 }}
    >
      <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
      Back to Blog List
    </motion.button>
  );

  const sharePost = (post) => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href).then(() => {
        alert('Link copied to clipboard!');
      }).catch(() => {
        // Fallback to creating a temporary input element
        const tempInput = document.createElement('input');
        tempInput.value = window.location.href;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        alert('Link copied to clipboard!');
      });
    }
  };

  // Enhanced blog posts data with ConnectYou intro and all categories
  const blogPosts = [
    {
      id: 0,
      title: "Welcome to ConnectYou: Bridging Students and Alumni for Success",
      excerpt: "Discover how ConnectYou is revolutionizing the way students connect with alumni, creating meaningful mentorship relationships that drive career success.",
      content: `
        <p>Welcome to ConnectYou, where the future meets experience, and where students discover their potential through meaningful connections with accomplished alumni. We're not just another networking platform – we're a catalyst for transformative relationships that shape careers and lives.</p>
        
        <h2>Our Mission</h2>
        <p>At ConnectYou, we believe that every student deserves access to guidance, mentorship, and opportunities. Our platform serves as a bridge between ambitious students and successful alumni who are eager to give back to their academic community.</p>
        
        <h2>Why ConnectYou Matters</h2>
        <p>In today's competitive landscape, having the right connections can make all the difference. Our platform eliminates the barriers that traditionally prevent students from accessing valuable alumni networks. Whether you're seeking career advice, industry insights, or internship opportunities, ConnectYou makes these connections possible.</p>
        
        <h2>Features That Make a Difference</h2>
        <p>Our intelligent matching system pairs students with alumni based on career interests, academic background, and professional goals. From one-on-one mentoring sessions to group workshops and networking events, we provide multiple touchpoints for meaningful engagement.</p>
        
        <h2>Success Stories</h2>
        <p>Since our launch, thousands of students have connected with alumni mentors, leading to internships, job placements, and long-lasting professional relationships. Our community continues to grow, creating a virtuous cycle of support and success.</p>
        
        <h2>Join Our Community</h2>
        <p>Whether you're a student seeking guidance or an alumnus ready to mentor, ConnectYou welcomes you to be part of a community that believes in the power of connection. Together, we're building the future, one relationship at a time.</p>
        
        <h2>What's Next?</h2>
        <p>Stay tuned to our blog for insights on career development, networking strategies, industry trends, and inspiring stories from our community. We're here to support your journey every step of the way.</p>
      `,
      author: "ConnectYou Team",
      authorRole: "Platform Creators",
      date: "March 30, 2024",
      category: "ConnectYou",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
      tags: ["connectyou", "platform", "networking", "mentorship"],
      featured: true
    },
    {
      id: 1,
      title: "How Mentorship Can Transform Your Career Path",
      excerpt: "Discover the powerful impact that having the right mentor can have on your professional journey and personal growth.",
      content: `
        <p>Mentorship is one of the most valuable relationships you can develop in your professional life. A good mentor doesn't just offer advice; they provide perspective, challenge your thinking, and help you navigate complex career decisions.</p>
        
        <h2>The Value of Experience</h2>
        <p>When you connect with someone who has already walked the path you're on, you gain access to insights that can't be found in textbooks or courses. Alumni mentors bring real-world experience that helps students avoid common pitfalls and make informed decisions.</p>
        
        <h2>Building Your Network</h2>
        <p>Beyond direct guidance, mentors often introduce mentees to their professional networks, opening doors that might otherwise remain closed. These connections can lead to internships, job opportunities, and collaborative projects.</p>
        
        <h2>Finding the Right Mentor</h2>
        <p>The most effective mentorship relationships are built on mutual respect, shared interests, and compatible communication styles. ConnectYou's platform is designed to match students with alumni mentors based on career goals, academic background, and personal interests.</p>
        
        <h2>Being a Good Mentee</h2>
        <p>Successful mentorship is a two-way street. As a mentee, it's important to come prepared to meetings, be receptive to feedback, follow through on suggestions, and express gratitude for your mentor's time and insights.</p>
        
        <h2>Conclusion</h2>
        <p>Whether you're just starting your academic journey or preparing to enter the workforce, connecting with a mentor can provide invaluable guidance and support. At ConnectYou, we're committed to facilitating these transformative relationships between students and alumni.</p>
      `,
      author: "Dr. Sarah Johnson",
      authorRole: "Career Development Specialist",
      date: "March 15, 2024",
      category: "Career Development",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216",
      tags: ["mentorship", "career growth", "networking"]
    },
    {
      id: 2,
      title: "Leveraging Alumni Networks in Your Job Search",
      excerpt: "Learn how to effectively tap into your school's alumni network to find job opportunities and gain a competitive edge.",
      content: `
        <p>When it comes to finding job opportunities, who you know can be just as important as what you know. Your institution's alumni network represents a valuable resource that many students underutilize in their job search.</p>
        
        <h2>Why Alumni Connections Matter</h2>
        <p>Alumni who work in your field of interest can provide insider information about job openings, company culture, and industry trends. They often have a vested interest in helping students from their alma mater succeed.</p>
        
        <h2>Making Meaningful Connections</h2>
        <p>Rather than reaching out only when you need something, focus on building genuine relationships. Show interest in alumni experiences, ask thoughtful questions, and look for ways to provide value in return.</p>
        
        <h2>Leveraging Digital Platforms</h2>
        <p>ConnectYou makes it easier than ever to identify and connect with relevant alumni. Our platform allows you to search for graduates based on industry, company, location, and more.</p>
        
        <h2>Success Stories</h2>
        <p>Many students have secured internships and full-time positions through alumni connections. These opportunities often aren't advertised publicly, giving networked candidates a significant advantage.</p>
        
        <h2>Conclusion</h2>
        <p>Your alumni network is a powerful asset in your professional journey. By thoughtfully engaging with graduates who've gone before you, you can gain valuable insights, expand your opportunities, and build relationships that may benefit you throughout your career.</p>
      `,
      author: "Michael Chen",
      authorRole: "Recruitment Specialist",
      date: "February 28, 2024",
      category: "Job Search",
      readTime: "4 min read",
      image: "https://images.unsplash.com/photo-1573164713988-8665fc963095",
      tags: ["job search", "networking", "alumni"]
    },
    {
      id: 3,
      title: "The Art of Professional Networking: Quality Over Quantity",
      excerpt: "Master the fundamentals of building meaningful professional relationships that will serve you throughout your career.",
      content: `
        <p>Professional networking is often misunderstood as collecting business cards or adding connections on LinkedIn. True networking is about building authentic relationships that provide mutual value over time.</p>
        
        <h2>Starting with Authenticity</h2>
        <p>The best networking relationships begin with genuine interest in others. Focus on learning about people's experiences, challenges, and goals rather than immediately asking for favors or opportunities.</p>
        
        <h2>Giving Before Receiving</h2>
        <p>Successful networkers understand the importance of contributing value to their connections. This might involve sharing relevant articles, making introductions, or offering your own expertise and insights.</p>
        
        <h2>Following Up Effectively</h2>
        <p>The real networking happens after the initial meeting. Send personalized follow-up messages, remember details from your conversations, and maintain regular but not overwhelming contact.</p>
        
        <h2>Digital Networking Best Practices</h2>
        <p>Platforms like ConnectYou enable more targeted and meaningful connections. Use these tools to find alumni and professionals who share your interests and career aspirations.</p>
        
        <h2>Long-term Relationship Building</h2>
        <p>Think of networking as relationship building rather than transaction seeking. The most valuable professional relationships develop over months and years, not in single conversations.</p>
      `,
      author: "Lisa Rodriguez",
      authorRole: "Professional Development Coach",
      date: "March 10, 2024",
      category: "Networking",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1556761175-b413da4baf72",
      tags: ["networking", "professional relationships", "career building"]
    },
    {
      id: 4,
      title: "The Future of Education: Blending Traditional Learning with Digital Innovation",
      excerpt: "Explore how educational institutions are evolving to incorporate technology while maintaining the value of traditional learning methods.",
      content: `
        <p>Education is undergoing a profound transformation as institutions seek to balance the timeless value of traditional learning with the opportunities presented by digital innovation.</p>
        
        <h2>The Digital Classroom</h2>
        <p>From virtual reality simulations to AI-powered tutoring systems, technology is creating new possibilities for immersive, personalized learning experiences. These tools can adapt to individual learning styles and provide immediate feedback.</p>
        
        <h2>Preserving Human Connection</h2>
        <p>Despite technological advances, the human elements of education remain irreplaceable. Mentorship, discussion, debate, and collaborative problem-solving develop critical thinking and communication skills that technology alone cannot foster.</p>
        
        <h2>Hybrid Models</h2>
        <p>The most effective educational approaches combine digital tools with in-person interaction. This hybrid model offers flexibility while maintaining the community aspect of learning that many students value.</p>
        
        <h2>The Role of Alumni</h2>
        <p>Alumni play a crucial role in this evolving landscape by bringing real-world perspective to academic discussions. Their experiences help bridge the gap between theoretical knowledge and practical application.</p>
        
        <h2>Conclusion</h2>
        <p>The future of education isn't about choosing between traditional and digital approaches—it's about thoughtfully integrating both to create richer, more effective learning experiences. ConnectYou supports this integration by facilitating meaningful connections between students and alumni across digital and physical spaces.</p>
      `,
      author: "Prof. James Wilson",
      authorRole: "Education Technology Researcher",
      date: "January 10, 2024",
      category: "Education",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1509062522246-3755977927d7",
      tags: ["education technology", "digital learning", "future of education"]
    },
    {
      id: 5,
      title: "AI and Machine Learning: Reshaping Tomorrow's Workforce",
      excerpt: "Understanding how artificial intelligence and machine learning are creating new opportunities and transforming existing careers.",
      content: `
        <p>Artificial Intelligence and Machine Learning are no longer futuristic concepts—they're reshaping industries and creating new career paths today. Understanding these technologies is crucial for students entering the modern workforce.</p>
        
        <h2>The AI Revolution</h2>
        <p>From healthcare diagnostics to financial analysis, AI is augmenting human capabilities across industries. Rather than replacing workers, AI is creating new roles and enhancing existing ones.</p>
        
        <h2>Emerging Career Opportunities</h2>
        <p>New roles like AI Ethics Specialists, Machine Learning Engineers, and Data Scientists are in high demand. These positions require a blend of technical skills and domain expertise.</p>
        
        <h2>Skills for the AI Era</h2>
        <p>Success in an AI-driven world requires both technical competence and uniquely human skills like creativity, emotional intelligence, and critical thinking. The key is learning to collaborate with AI systems effectively.</p>
        
        <h2>Preparing for Change</h2>
        <p>Students should focus on developing adaptable skill sets and maintaining a learning mindset. The technologies of tomorrow will build upon the foundational knowledge being taught today.</p>
        
        <h2>ConnectYou's Role</h2>
        <p>Through our platform, students can connect with alumni working in AI and emerging tech fields, gaining insights into these rapidly evolving industries and career paths.</p>
      `,
      author: "Dr. Amanda Tech",
      authorRole: "AI Research Scientist",
      date: "March 5, 2024",
      category: "Technology",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
      tags: ["artificial intelligence", "machine learning", "future careers", "technology"]
    },
    {
      id: 6,
      title: "Building Resilience: Lessons from Alumni Who Overcame Challenges",
      excerpt: "Inspiring stories from alumni who faced significant obstacles during their academic and early career journeys.",
      content: `
        <p>The path to success is rarely straight or smooth. Some of the most accomplished alumni faced significant challenges during their academic and early career journeys. Their stories offer valuable lessons in resilience and perseverance.</p>
        
        <h2>Embracing Failure as Feedback</h2>
        <p>Many successful graduates share that their greatest learning came from setbacks. Rather than being discouraged by failure, they used it as information to refine their approach and make better decisions moving forward.</p>
        
        <h2>Developing Adaptability</h2>
        <p>In today's rapidly changing world, the ability to adapt is perhaps the most valuable skill. Alumni who have thrived often credit their willingness to pivot, learn new skills, and embrace unexpected opportunities.</p>
        
        <h2>Building Support Networks</h2>
        <p>No one succeeds entirely on their own. Resilient individuals actively cultivate relationships with mentors, peers, and supporters who provide guidance, encouragement, and practical help during difficult times.</p>
        
        <h2>Maintaining Perspective</h2>
        <p>Challenges that seem overwhelming in the moment often appear less significant in retrospect. Successful alumni emphasize the importance of maintaining a long-term perspective and focusing on growth rather than temporary setbacks.</p>
        
        <h2>Conclusion</h2>
        <p>The stories of alumni who overcame obstacles demonstrate that resilience isn't about avoiding challenges—it's about developing the mindset and skills to navigate them effectively. Through ConnectYou, current students can learn from these experiences and develop their own resilience strategies.</p>
      `,
      author: "Dr. Maya Patel",
      authorRole: "Psychologist & Resilience Coach",
      date: "December 5, 2023",
      category: "Personal Development",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1507237998874-b4d52d1dd655",
      tags: ["resilience", "overcoming challenges", "personal growth"]
    },
    {
      id: 7,
      title: "Remote Work Revolution: Adapting to the New Normal",
      excerpt: "How the shift to remote work is changing career prospects and what skills are essential for distributed team success.",
      content: `
        <p>The remote work revolution has fundamentally changed how we think about careers, workplace culture, and professional development. Understanding this shift is crucial for students entering today's job market.</p>
        
        <h2>The Remote Advantage</h2>
        <p>Remote work offers unprecedented flexibility and access to global opportunities. Students can now consider positions with companies worldwide, breaking down geographical barriers to career advancement.</p>
        
        <h2>Essential Remote Skills</h2>
        <p>Success in remote environments requires strong communication skills, self-discipline, and digital literacy. The ability to collaborate effectively using digital tools has become a core competency.</p>
        
        <h2>Building Virtual Relationships</h2>
        <p>Networking and mentorship have evolved in the remote era. Platforms like ConnectYou become even more valuable for building professional relationships when in-person meetings are limited.</p>
        
        <h2>Challenges and Solutions</h2>
        <p>Remote work presents unique challenges including isolation, work-life balance, and communication gaps. Successful remote workers develop strategies to address these issues proactively.</p>
        
        <h2>The Future of Work</h2>
        <p>Hybrid models combining remote and in-person work are becoming the new standard. Students should prepare for careers that offer flexibility while maintaining human connection and collaboration.</p>
      `,
      author: "Carlos Martinez",
      authorRole: "Remote Work Consultant",
      date: "February 20, 2024",
      category: "Career Development",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1553877522-43269d4ea984",
      tags: ["remote work", "career adaptation", "digital skills", "future of work"]
    },
    {
      id: 8,
      title: "Emotional Intelligence: The Hidden Key to Career Success",
      excerpt: "Why emotional intelligence is becoming increasingly important in the workplace and how to develop these crucial skills.",
      content: `
        <p>While technical skills get you hired, emotional intelligence often determines how far you advance in your career. In an increasingly automated world, uniquely human skills like emotional intelligence are becoming more valuable than ever.</p>
        
        <h2>Understanding Emotional Intelligence</h2>
        <p>Emotional intelligence encompasses self-awareness, self-regulation, empathy, and social skills. These abilities enable effective communication, leadership, and collaboration in professional settings.</p>
        
        <h2>Why It Matters Now</h2>
        <p>As automation handles more routine tasks, the human elements of work—creativity, empathy, and relationship building—become key differentiators in the job market.</p>
        
        <h2>Developing EQ Skills</h2>
        <p>Emotional intelligence can be developed through practice, reflection, and feedback. Seeking diverse experiences and perspectives helps build empathy and social awareness.</p>
        
        <h2>EQ in Leadership</h2>
        <p>The most effective leaders demonstrate high emotional intelligence, understanding how to motivate teams, navigate conflicts, and create positive work environments.</p>
        
        <h2>Practical Applications</h2>
        <p>From job interviews to client presentations, emotional intelligence enhances every professional interaction. Students who develop these skills gain a significant competitive advantage.</p>
      `,
      author: "Dr. Jennifer Park",
      authorRole: "Organizational Psychologist",
      date: "March 1, 2024",
      category: "Personal Development",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
      tags: ["emotional intelligence", "soft skills", "leadership", "career success"]
    },
    {
      id: 9,
      title: "The Gig Economy: Navigating Freelance and Contract Work",
      excerpt: "Understanding the opportunities and challenges of gig work and how to build a successful freelance career.",
      content: `
        <p>The gig economy has transformed the employment landscape, offering new opportunities for flexible work arrangements. Understanding how to navigate this space is essential for modern career planning.</p>
        
        <h2>Understanding the Gig Economy</h2>
        <p>From freelance writing to consulting, the gig economy encompasses various forms of independent work. This model offers flexibility but requires different skills than traditional employment.</p>
        
        <h2>Building Your Personal Brand</h2>
        <p>Success in the gig economy often depends on personal branding and reputation. Freelancers must market themselves effectively and build strong client relationships.</p>
        
        <h2>Financial Management</h2>
        <p>Gig workers face unique financial challenges including irregular income and self-employment taxes. Developing strong financial planning skills is crucial for long-term success.</p>
        
        <h2>Networking for Freelancers</h2>
        <p>Building a network of clients, peers, and mentors is essential for sustainable freelance success. Alumni connections through platforms like ConnectYou can provide valuable opportunities and guidance.</p>
        
        <h2>The Hybrid Approach</h2>
        <p>Many professionals combine traditional employment with gig work, creating diversified income streams and exploring entrepreneurial opportunities.</p>
      `,
      author: "Alex Thompson",
      authorRole: "Freelance Career Coach",
      date: "February 15, 2024",
      category: "Job Search",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d",
      tags: ["gig economy", "freelancing", "independent work", "career flexibility"]
    },
    {
      id: 10,
      title: "Sustainable Careers: Aligning Purpose with Profession",
      excerpt: "How to build a career that aligns with your values while making a positive impact on society and the environment.",
      content: `
        <p>More students and professionals are seeking careers that align with their values and contribute to positive social and environmental impact. This shift is reshaping entire industries and creating new opportunities.</p>
        
        <h2>The Purpose-Driven Career Movement</h2>
        <p>Younger generations increasingly prioritize meaning and impact in their work choices. Companies are responding by emphasizing their social and environmental missions.</p>
        
        <h2>Green Jobs and Sustainability</h2>
        <p>The transition to sustainable practices is creating new career paths in renewable energy, sustainable design, environmental consulting, and corporate sustainability.</p>
        
        <h2>Social Impact Careers</h2>
        <p>From nonprofit work to social entrepreneurship, careers focused on solving social problems offer fulfillment and growing opportunities for impact-minded professionals.</p>
        
        <h2>Corporate Social Responsibility</h2>
        <p>Traditional corporations are increasingly hiring for roles focused on sustainability, diversity and inclusion, and community engagement, creating purpose-driven opportunities within established companies.</p>
        
        <h2>Making the Transition</h2>
        <p>Transitioning to purpose-driven work often requires strategic planning, skill development, and networking. Alumni who have made similar transitions can provide valuable guidance through platforms like ConnectYou.</p>
      `,
      author: "Dr. Robert Green",
      authorRole: "Sustainability Career Advisor",
      date: "January 25, 2024",
      category: "Career Development",
      readTime: "7 min read",
      image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09",
      tags: ["sustainable careers", "purpose-driven work", "social impact", "environmental careers"]
    },
    {
      id: 11,
      title: "Cross-Cultural Communication in Global Careers",
      excerpt: "Essential skills for working effectively in diverse, international environments and building global professional networks.",
      content: `
        <p>In our interconnected world, the ability to work effectively across cultures has become a critical career skill. Whether working for multinational companies or pursuing international opportunities, cultural competence is essential.</p>
        
        <h2>The Global Workplace</h2>
        <p>Modern careers often involve collaborating with colleagues, clients, and partners from diverse cultural backgrounds. Understanding cultural differences in communication styles, work practices, and business etiquette is crucial.</p>
        
        <h2>Developing Cultural Intelligence</h2>
        <p>Cultural intelligence involves awareness of your own cultural biases, curiosity about other cultures, and the ability to adapt your communication and behavior appropriately in different cultural contexts.</p>
        
        <h2>Language Skills and Beyond</h2>
        <p>While language skills are valuable, effective cross-cultural communication involves understanding nonverbal cues, cultural values, and different approaches to decision-making and conflict resolution.</p>
        
        <h2>Building Global Networks</h2>
        <p>International alumni networks provide opportunities to learn about different markets, cultural practices, and career opportunities worldwide. These connections can be invaluable for global career development.</p>
        
        <h2>Preparing for International Careers</h2>
        <p>Students interested in global careers should seek international experiences, study abroad opportunities, and connections with alumni working in different countries and cultures.</p>
      `,
      author: "Maria Santos",
      authorRole: "International Business Consultant",
      date: "February 10, 2024",
      category: "Networking",
      readTime: "6 min read",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
      tags: ["cross-cultural communication", "global careers", "cultural intelligence", "international networking"]
    },
    {
      id: 12,
      title: "Digital Literacy in the Modern Workplace",
      excerpt: "Understanding the digital skills that are becoming essential across all industries and career paths.",
      content: `
        <p>Digital literacy has evolved beyond basic computer skills to encompass a broad range of competencies essential for success in virtually every field. Understanding these skills and staying current with technological trends is crucial for career advancement.</p>
        
        <h2>Beyond Basic Computer Skills</h2>
        <p>Modern digital literacy includes data analysis, digital communication, cybersecurity awareness, and the ability to quickly learn and adapt to new technologies and platforms.</p>
        
        <h2>Industry-Specific Applications</h2>
        <p>Different fields require specific digital competencies. Healthcare professionals need to understand electronic health records, while marketers must master digital analytics and social media platforms.</p>
        
        <h2>Staying Current</h2>
        <p>Technology evolves rapidly, making continuous learning essential. Successful professionals dedicate time to staying informed about technological developments in their fields.</p>
        
        <h2>Digital Communication</h2>
        <p>From video conferencing to collaborative platforms, digital communication skills are essential for remote work and global collaboration. Understanding digital etiquette and best practices is increasingly important.</p>
        
        <h2>Preparing for the Future</h2>
        <p>Students should focus on developing foundational digital skills while remaining adaptable to new technologies. Alumni mentors can provide insights into the digital tools and trends most relevant to specific career paths.</p>
      `,
      author: "David Kim",
      authorRole: "Digital Transformation Specialist",
      date: "January 30, 2024",
      category: "Technology",
      readTime: "5 min read",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f",
      tags: ["digital literacy", "technology skills", "digital workplace", "continuous learning"]
    }
  ];

  const categories = ['All', 'ConnectYou', 'Career Development', 'Job Search', 'Education', 'Personal Development', 'Networking', 'Technology'];

  // Filter blog posts based on search term and category
  const filteredBlogPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const BlogPostCard = ({ post, index }) => (
    <motion.div 
      className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer group relative"
      variants={fadeInVariants}
      whileHover={{ 
        y: -10, 
        boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
        transition: { duration: 0.3 }
      }}
      onClick={() => setCurrentBlogPost(post)}
    >
      {post.featured && (
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center">
            <TrendingUp className="h-3 w-3 mr-1" />
            Featured
          </div>
        </div>
      )}
      
      <div className="h-56 overflow-hidden relative">
        <div 
          className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity duration-300"
          style={{ background: cardGradients[index % cardGradients.length] }}
        />
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-6">
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>{post.readTime}</span>
            </div>
          </div>
          <div className="flex items-center bg-purple-100 px-2 py-1 rounded-full">
            <Tag className="h-3 w-3 mr-1 text-purple-600" />
            <span className="text-purple-700 text-xs font-medium">{post.category}</span>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2 group-hover:text-purple-600 transition-colors duration-300">
          {post.title}
        </h3>
        
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>
        
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-full mr-3">
              <User className="h-4 w-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-800">{post.author}</span>
              <p className="text-xs text-gray-500">{post.authorRole}</p>
            </div>
          </div>
          
          <motion.div 
            className="flex items-center text-purple-600 font-medium text-sm group-hover:translate-x-2 transition-transform duration-300"
            whileHover={{ scale: 1.05 }}
          >
            Read More
            <ChevronRight className="h-4 w-4 ml-1" />
          </motion.div>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {post.tags.slice(0, 3).map((tag, tagIndex) => (
            <span 
              key={tagIndex} 
              className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs hover:bg-purple-100 hover:text-purple-700 transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const BlogPostDetail = ({ post }) => (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <BackButton />
          <BackToHomeButton />
        </div>
        
        <motion.article 
          className="bg-white rounded-3xl p-6 md:p-10 shadow-xl"
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
        >
          {/* Article Header */}
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>{post.readTime}</span>
              </div>
              <div className="flex items-center bg-purple-100 px-3 py-1 rounded-full">
                <Tag className="h-4 w-4 mr-1 text-purple-600" />
                <span className="text-purple-700 font-medium">{post.category}</span>
              </div>
              {post.featured && (
                <div className="flex items-center bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span className="font-medium">Featured</span>
                </div>
              )}
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex items-center mb-8">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-full mr-4">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-lg">{post.author}</p>
                <p className="text-gray-600">{post.authorRole}</p>
              </div>
            </div>
          </header>
          
          {/* Featured Image */}
          <div className="mb-10 rounded-2xl overflow-hidden shadow-lg">
            <img 
              src={post.image} 
              alt={post.title}
              className="w-full h-64 md:h-96 object-cover" 
              loading="lazy"
            />
          </div>
          
          {/* Article Content */}
          <div 
            className="prose prose-lg max-w-none text-gray-700 mb-10 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
            style={{
              fontSize: '1.125rem',
              lineHeight: '1.8'
            }}
          />
          
          {/* Article Footer */}
          <footer className="border-t border-gray-200 pt-8">
            <div className="flex flex-wrap gap-3 mb-8">
              {post.tags.map((tag, index) => (
                <motion.span 
                  key={index} 
                  className="bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium hover:from-purple-200 hover:to-blue-200 transition-all cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  #{tag}
                </motion.span>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div className="flex space-x-6">
                <motion.button 
                  className="flex items-center text-gray-600 hover:text-purple-600 transition-colors group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ThumbsUp className="h-5 w-5 mr-2 group-hover:fill-current" />
                  <span className="font-medium">Like</span>
                </motion.button>
                <motion.button 
                  className="flex items-center text-gray-600 hover:text-purple-600 transition-colors group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <MessageSquare className="h-5 w-5 mr-2 group-hover:fill-current" />
                  <span className="font-medium">Comment</span>
                </motion.button>
              </div>
              
              <motion.button 
                className="flex items-center bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl group"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => sharePost(post)}
              >
                <Share2 className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
                <span className="font-medium">Share Article</span>
              </motion.button>
            </div>
          </footer>
        </motion.article>
        
        {/* Related Articles Suggestion */}
        <motion.div 
          className="mt-12 bg-white rounded-2xl p-8 shadow-lg"
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <BookOpen className="h-6 w-6 mr-3 text-purple-600" />
            Continue Reading
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {blogPosts
              .filter(p => p.id !== post.id && p.category === post.category)
              .slice(0, 2)
              .map((relatedPost, index) => (
                <motion.div
                  key={relatedPost.id}
                  className="flex items-center space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-purple-50 transition-colors cursor-pointer group"
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setCurrentBlogPost(relatedPost)}
                >
                  <img 
                    src={relatedPost.image} 
                    alt={relatedPost.title}
                    className="w-16 h-16 rounded-lg object-cover" 
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h4>
                    <p className="text-sm text-gray-500 mt-1">{relatedPost.readTime}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                </motion.div>
              ))}
          </div>
        </motion.div>
      </div>
    </div>
  );

  const BlogList = () => (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Hero Section */}
      <div className="text-white py-24 relative overflow-hidden" style={gradientStyle}>
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeInVariants}
          >
            <motion.div 
              className="flex justify-center mb-8"
              whileHover={{ scale: 1.1, rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white/20 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/20">
                <BookOpen className="h-16 w-16 text-white" />
              </div>
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
              ConnectYou Blog
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-100 max-w-3xl mx-auto mb-8 leading-relaxed">
              Insights, stories, and resources for students and alumni to thrive in their careers
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <div className="flex items-center text-white/90">
                <Users className="h-5 w-5 mr-2" />
                <span>10,000+ Readers</span>
              </div>
              <div className="flex items-center text-white/90">
                <Zap className="h-5 w-5 mr-2" />
                <span>Weekly Updates</span>
              </div>
              <div className="flex items-center text-white/90">
                <Globe className="h-5 w-5 mr-2" />
                <span>Global Community</span>
              </div>
            </div>
            
            <BackToHomeButton />
          </motion.div>
        </div>
      </div>

      {/* Enhanced Search and Filter Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <motion.div 
          className="bg-white rounded-3xl shadow-xl p-8 mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeInVariants}
        >
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0 lg:space-x-8">
            {/* Search Bar */}
            <div className="relative w-full lg:w-1/2">
              <motion.div
                className={`relative transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}
              >
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search articles, topics, or authors..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:outline-none focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-lg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </motion.div>
            </div>
            
            {/* Category Filters */}
            <div className="flex flex-wrap gap-3 w-full lg:w-auto justify-center lg:justify-end">
              {categories.map((category, index) => (
                <motion.button
                  key={index}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category 
                      ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Search Results Summary */}
          <AnimatePresence>
            {(searchTerm || selectedCategory !== 'All') && (
              <motion.div 
                className="mt-6 pt-6 border-t border-gray-200"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">
                    Found <span className="font-bold text-purple-600">{filteredBlogPosts.length}</span> 
                    {filteredBlogPosts.length === 1 ? ' article' : ' articles'}
                    {searchTerm && ` matching "${searchTerm}"`}
                    {selectedCategory !== 'All' && ` in ${selectedCategory}`}
                  </p>
                  
                  {(searchTerm || selectedCategory !== 'All') && (
                    <motion.button
                      className="text-purple-600 hover:text-purple-700 font-medium flex items-center text-sm"
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('All');
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Clear Filters
                    </motion.button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Blog Posts Grid */}
        <AnimatePresence>
          {filteredBlogPosts.length > 0 ? (
            <motion.div 
              className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
              initial="hidden"
              animate="visible"
              variants={staggerVariants}
            >
              {filteredBlogPosts.map((post, index) => (
                <BlogPostCard key={post.id} post={post} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div 
              className="text-center py-20"
              initial="hidden"
              animate="visible"
              variants={fadeInVariants}
            >
              <div className="bg-white p-12 rounded-3xl shadow-xl inline-block max-w-md">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <BookOpen className="h-16 w-16 text-purple-600 mx-auto mb-6" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">No articles found</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  We couldn't find any articles matching your search criteria. 
                  Try adjusting your filters or search terms.
                </p>
                <motion.button
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full font-medium flex items-center justify-center mx-auto hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                  }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Reset Filters
                  <ChevronRight className="h-4 w-4 ml-2" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Newsletter Signup Section */}
      <motion.div 
        className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-20 mt-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeInVariants}
      >
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Stay Updated</h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Get the latest career insights, networking tips, and success stories delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/20"
            />
            <motion.button
              className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Subscribe
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );

  return (
    <div className="font-sans">
      <AnimatePresence mode="wait">
        {currentBlogPost ? (
          <motion.div
            key="blog-detail"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <BlogPostDetail post={currentBlogPost} />
          </motion.div>
        ) : (
          <motion.div
            key="blog-list"
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.5 }}
          >
            <BlogList />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Blog;