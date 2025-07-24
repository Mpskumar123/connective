import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Clock, Loader2, Sparkles, MessageSquare } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import { useNavbar } from "../../components/shared/Navbar";

const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000',
  ENDPOINTS: {
    AI: '/api/ai/chat',
    HEALTH: '/health'
  }
};

const AIAssistantPage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  
  // Get navbar state from context
  const navbarState = useNavbar() || { isCollapsed: false, isMobile: false };
  const { isCollapsed, isMobile } = navbarState;
  
  // Responsive breakpoints
  const isMobileDevice = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const isDesktop = useMediaQuery({ minWidth: 1024 });

  // Clear chat on page load
  useEffect(() => {
    setMessages([]);
    localStorage.removeItem("chatMessages");
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const trimmedInput = input.trim();
    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: trimmedInput,
      timestamp: new Date().toLocaleTimeString(),
    };

    setShowWelcome(false);
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AI}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          message: trimmedInput,
          context: messages.slice(-5)
        })
      });

      const data = await response.json();

      setMessages(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: data.message || "I apologize, but I couldn't process your request at the moment.",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const clearChat = () => {
    if (window.confirm("Are you sure you want to clear the chat history?")) {
      setMessages([]);
      setShowWelcome(true);
      localStorage.removeItem("chatMessages");
    }
  };

  // Calculate main content margin based on navbar state
  const getContentStyle = () => {
    if (isMobile) {
      return {}; // No margin needed for mobile as navbar is hidden or shown as overlay
    }
    return { 
      marginLeft: isCollapsed ? '72px' : '240px',
      width: `calc(100% - ${isCollapsed ? '72px' : '240px'})`
    };
  };

  return (
    <div 
      className="min-h-screen bg-[#fafafa] transition-all duration-300"
      style={getContentStyle()}
    >
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200 p-3 md:p-4 sticky top-0 z-10 animate-fade-in">
          <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-2 md:p-2.5 rounded-xl shadow-lg transition-transform hover:scale-105">
                <Bot className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <h2 className="text-base md:text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-purple-900">
                  ConnectAI 
                </h2>
              </div>
            </div>
            <button
              onClick={clearChat}
              className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100 active:bg-gray-200"
            >
              Clear Chat
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4">
          {showWelcome && (
            <div className="flex flex-col items-center justify-center h-full space-y-4 md:space-y-6 animate-fade-in">
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-3 md:p-4 rounded-full shadow-xl">
                <MessageSquare className="w-8 h-8 md:w-12 md:h-12 text-white" />
              </div>
              <div className="text-center space-y-2 max-w-md px-4">
                <h3 className="text-xl md:text-2xl font-semibold text-gray-800">Welcome to AI Assistant</h3>
                <p className="text-sm md:text-base text-gray-600">I'm here to help you with any questions or tasks you might have. Feel free to start a conversation!</p>
              </div>
              <div className="flex flex-wrap justify-center gap-2 px-4">
                {["How can you help me?", "What can you do?", "Tell me a joke"].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => {
                      setInput(suggestion);
                      inputRef.current?.focus();
                    }}
                    className="px-3 py-1.5 md:px-4 md:py-2 bg-white border border-purple-200 rounded-full text-xs md:text-sm text-purple-700 hover:bg-purple-50 hover:border-purple-300 transition-all shadow-sm hover:shadow animate-fade-in"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              } animate-fade-in`}
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              <div
                className={`max-w-[85%] md:max-w-[80%] p-3 md:p-4 rounded-2xl shadow-md transition-all hover:shadow-lg ${
                  msg.role === "user"
                    ? "bg-gradient-to-br from-purple-600 to-purple-700 text-white"
                    : "bg-white border border-purple-100"
                }`}
              >
                <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                  {msg.role === "user" ? (
                    <User className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  ) : (
                    <Bot className="w-3.5 h-3.5 md:w-4 md:h-4" />
                  )}
                  <span className="text-xs md:text-sm font-medium flex items-center gap-1">
                    {msg.role === "user" ? "You" : "Assistant"}
                    {msg.role === "assistant" && (
                      <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3 text-purple-500" />
                    )}
                  </span>
                </div>
                <p className="text-xs md:text-sm whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </p>
                <div className="flex justify-end items-center gap-1 mt-1.5 md:mt-2">
                  <Clock className="w-2.5 h-2.5 md:w-3 md:h-3 opacity-60" />
                  <span className="text-[10px] md:text-xs opacity-60">{msg.timestamp}</span>
                </div>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-white border border-purple-100 p-3 md:p-4 rounded-2xl shadow-md">
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-600 rounded-full animate-bounce"></div>
                  </div>
                  <span className="text-xs md:text-sm text-gray-600">Assistant is typing...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white/80 backdrop-blur-xl border-t border-gray-200 p-3 md:p-4 sticky bottom-0">
          <div className="w-full max-w-7xl mx-auto">
            <div className="relative flex items-center gap-2 md:gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1 px-3 py-2.5 md:px-4 md:py-3 rounded-xl border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all text-sm md:text-base text-gray-800 placeholder:text-gray-400 shadow-sm"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className={`p-2.5 md:p-3 rounded-xl transition-all shadow-md ${
                  isLoading || !input.trim()
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 active:from-purple-800 active:to-purple-900 hover:shadow-lg"
                }`}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin text-white" />
                ) : (
                  <Send className="w-4 h-4 md:w-5 md:h-5 text-white" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage;