import React, { useState } from "react";
import { SendHorizonal } from "lucide-react";
import Navbar from '../../components/shared/Navbar';

// Integrated Card components
const Card = ({ className, children }) => {
  return <div className={`rounded-md shadow ${className}`}>{children}</div>;
};

const CardContent = ({ className, children }) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};

const AlumniAIAssistantPage = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Determine API endpoint based on environment
  const getApiEndpoint = () => {
    // If running locally, use local server
    return `${process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000'}/api/v1/alumni-ai-assistant`;
    
    // Check if we're on the same domain as the API
    const currentDomain = window.location.origin;
    if (currentDomain.includes("connectyou") || currentDomain.includes("render.com")) {
      return `${currentDomain}/api/v1/alumni-ai-assistant`;
    }
    
    // Default to the production URL
    return "https://connectyoubackend.onrender.com/api/v1/alumni-ai-assistant";
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const trimmedInput = input.trim();

    setMessages((prev) => [...prev, { role: "user", content: trimmedInput }]);
    setInput("");
    setLoading(true);

    try {
      const apiEndpoint = getApiEndpoint();
      
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Origin": window.location.origin
        },
        credentials: "include", // Include cookies if your API uses session authentication
        body: JSON.stringify({
          message: trimmedInput,
          context: messages.slice(-5),
          role: "alumni",
        }),
      });

      if (!response.ok) {
        throw new Error(`Server responded with ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Oops! Something went wrong. Please try again. If this problem persists, ensure the backend API is running and properly configured for CORS.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    sendMessage();
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-none">
        
      </div>
      <main className="flex-1 bg-gradient-to-r from-blue-100 to-emerald-100 ml-64">
        <div className="max-w-4xl mx-auto space-y-6 p-6">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, Alumni!</h3>
            <p className="text-gray-600 text-lg">I'm your AI assistant, here to help you with mentoring, networking, job postings, and more.</p>
          </div>
  
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              "How do I post a mentorship opportunity?",
              "Can I see recent job applicants?",
              "Help me draft a career advice message",
            ].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="bg-white border border-gray-200 hover:bg-gray-100 text-sm px-4 py-2 rounded-full shadow-sm"
              >
                {suggestion}
              </button>
            ))}
          </div>
  
          <div className="bg-white rounded-lg shadow-md p-6 h-[500px] overflow-y-auto">
            {messages.length === 0 && (
              <div className="h-full flex items-center justify-center text-gray-400 text-center">
                <div>
                  <p>Send a message to start a conversation</p>
                  <p className="text-sm mt-1">Your AI assistant is ready to help</p>
                </div>
              </div>
            )}
            
            {messages.map((msg, index) => (
              <Card
                key={index}
                className={`my-2 ${
                  msg.role === "user" ? "ml-auto bg-blue-100" : "mr-auto bg-emerald-100"
                } max-w-[80%]`}
              >
                <CardContent className="p-4 text-gray-800 whitespace-pre-line">
                  {msg.content}
                </CardContent>
              </Card>
            ))}
            
            {loading && (
              <Card className="my-2 mr-auto bg-emerald-100 max-w-[80%]">
                <CardContent className="p-4 text-gray-500 italic">Typing...</CardContent>
              </Card>
            )}
          </div>
  
          <div className="flex items-center gap-3">
            <textarea
              className="flex-1 p-4 rounded-lg border border-gray-300 resize-none shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={2}
              placeholder="Ask anything about mentoring, jobs, or alumni engagement..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className={`text-white rounded-full p-3 shadow-md ${
                loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
              }`}
              aria-label="Send message"
            >
              <SendHorizonal size={20} />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AlumniAIAssistantPage;