import React, { useState, useEffect, useRef } from 'react';
import { motion } from "framer-motion";
import { Search, Send, MessageSquare, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import io from 'socket.io-client';
import Navbar from '../../components/shared/Navbar';
import { jwtDecode } from 'jwt-decode';

const SOCKET_URL = process.env.REACT_APP_BACKEND_URL;

let socket;

const MessagesPage = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimer, setTypingTimer] = useState(null);
  const [user, setUser] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const messagesEndRef = useRef(null);

  // Load user data on component mount
  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication token not found. Please login again.");
        setLoading(false);
        return;
      }
      
      let userId;
      try {
        const decodedToken = jwtDecode(token);
        userId = decodedToken.userId;
      } catch (err) {
        setError("Invalid token. Please login again.");
        setLoading(false);
        return;
      }
      
      if (!userId) {
        setError("User ID not found. Please login again.");
        setLoading(false);
        return;
      }
      
      // Set user with the userId from the token
      setUser({ userId });
      setLoading(false);
    } catch (err) {
      console.error("Error parsing user data", err);
      setError("Error loading user data. Please login again.");
      setLoading(false);
    }
  }, []);

  // Initialize socket connection
  useEffect(() => {
    if (!user?.userId) return;
    
    // const SOCKET_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/';
    // console.log('Connecting socket to:', SOCKET_URL);

    socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      setSocketConnected(true);
      
      // Join user's room after connection is established
      console.log('Emitting joinRoom for user:', user.userId);
      socket.emit('joinRoom', { userId: user.userId });
    });

    socket.on('connect_error', (err) => {
      console.error('❌ Socket connection error:', err.message);
      setSocketConnected(false);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
      setSocketConnected(false);
    });

    socket.on('roomJoined', (data) => {
      console.log('✅ Joined room successfully:', data);
    });

    socket.on('error', (error) => {
      console.error('❌ Socket error:', error);
      setError("Connection error: " + error.message);
    });

    socket.on('receiveMessage', (newMessage) => {
      console.log('📩 Received new message:', newMessage);
      
      // Update messages if relevant to current chat
      setMessages(prevMessages => {
        if (selectedChat && selectedChat.chatId === newMessage.chatId) {
          // Mark the message as read immediately
          markMessagesAsRead([newMessage._id]);
          return [...prevMessages, newMessage];
        }
        return prevMessages;
      });
      
      // Update chat list to reflect new message
      fetchChats();
    });

    socket.on('messageSent', (message) => {
      console.log('✅ Message sent confirmation:', message);
      // Could update UI to show message was delivered if needed
    });

    socket.on('messagesRead', (data) => {
      console.log('👁️ Messages read:', data);
      
      // If the current user's messages were read
      if (selectedChat && data.reader === selectedChat.otherUser._id) {
        // Update read status in UI
        setMessages(prevMessages => 
          prevMessages.map(msg => 
            data.messageIds.includes(msg._id) ? { ...msg, read: true } : msg
          )
        );
      }
      
      // Update chat list to reflect read status changes
      fetchChats();
    });

    socket.on('userTyping', (data) => {
      if (selectedChat && selectedChat.otherUser._id === data.sender) {
        setIsTyping(true);
      }
    });

    socket.on('userStopTyping', (data) => {
      if (selectedChat && selectedChat.otherUser._id === data.sender) {
        setIsTyping(false);
      }
    });

    return () => {
      console.log('🔌 Disconnecting socket...');
      if (socket) socket.disconnect();
    };
  }, [user?.userId, selectedChat]);

  // Fetch chats when user is available
  useEffect(() => {
    if (user?.userId) {
      fetchChats();
      fetchUnreadCount();
    }
  }, [user?.userId]);

  const fetchUnreadCount = async () => {
    if (!user?.userId) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await axios.get(`${SOCKET_URL}/api/chat/unread-count/${user.userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('📊 Unread messages count:', response.data.unreadCount);
      // Could use this to update a global notification badge if needed
    } catch (err) {
      console.error('❌ Error fetching unread count:', err);
    }
  };

  const fetchChats = async () => {
    if (!user?.userId) {
      console.error("Cannot fetch chats: User ID is undefined");
      setError("User ID is missing. Please login again.");
      setLoading(false);
      return;
    }

    try {
      console.log('📡 Fetching chats for user:', user.userId);
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication token not found. Please login again.");
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`${SOCKET_URL}/api/chat/chats/${user.userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Raw API response:', response.data);
      // Process chat data to match the UI structure
      const processedChats = response.data.data.map(chat => {
        // Determine who the other user is (sender or receiver)
        const otherUserId = chat.lastMessage.sender.toString() === user.userId.toString() 
          ? chat.lastMessage.receiver 
          : chat.lastMessage.sender;
        
        // Find other user details
        const otherUser = chat.lastMessage.sender.toString() === user.userId.toString() 
          ? chat.receiverDetails 
          : chat.senderDetails;
        
        return {
          _id: chat._id,
          chatId: chat.chatId,
          lastMessage: chat.lastMessage,
          unreadCount: chat.unreadCount,
          otherUser: {
            _id: otherUserId,
            firstName: otherUser?.firstName || 'Unknown',
            lastName: otherUser?.lastName || 'User',
            userType: otherUser?.userType || 'Alumni'
          }
        };
      });
      
      console.log('✅ Processed chats:', processedChats);
      setChats(processedChats || []);
      setLoading(false);
    } catch (err) {
      console.error('❌ Error fetching chats:', err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to load chats. Please try again.");
      setLoading(false);
    }
  };

  const fetchMessages = async (chat, page = 1) => {
    if (!user?.userId || !chat?.otherUser?._id) {
      console.error("Cannot fetch messages: User IDs missing");
      return;
    }

    try {
      console.log('📨 Fetching messages for chat with:', chat.otherUser._id);
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication token not found. Please login again.");
        setLoading(false);
        return;
      }
      
      const response = await axios.get(`${SOCKET_URL}/api/chat/messages`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          sender: user.userId,
          receiver: chat.otherUser._id,
          page: page,
          limit: 50
        }
      });
      
      console.log('✅ Messages received:', response.data);
      
      // Update pagination data
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
      
      // If loading more messages (pagination), append to existing messages
      if (page > 1) {
        setMessages(prev => [...response.data.data, ...prev]);
      } else {
        setMessages(response.data.data || []);
      }
      
      setLoading(false);
      
      // Mark all unread messages as read
      const unreadMessages = response.data.data
        .filter(msg => msg.receiver.toString() === user.userId.toString() && !msg.read)
        .map(msg => msg._id);
        
      if (unreadMessages.length > 0) {
        markMessagesAsRead(unreadMessages);
      }
      
      scrollToBottom();
    } catch (err) {
      console.error('❌ Error fetching messages:', err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to load messages. Please try again.");
      setLoading(false);
    }
  };

  const loadMoreMessages = () => {
    if (currentPage < totalPages && selectedChat) {
      fetchMessages(selectedChat, currentPage + 1);
    }
  };

  const markMessagesAsRead = async (messageIds) => {
    if (!user?.userId || !messageIds.length) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      await axios.put(`${SOCKET_URL}/api/chat/mark-read`, {
        messageIds
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update read status in UI
      setMessages(prevMessages => 
        prevMessages.map(msg => 
          messageIds.includes(msg._id) ? { ...msg, read: true } : msg
        )
      );
      
      // Update chat list to reflect read messages
      fetchChats();
    } catch (err) {
      console.error('❌ Error marking messages as read:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChat || !user?.userId) {
      return;
    }

    try {
      console.log('📤 Sending message to:', selectedChat.otherUser._id);
      setError(null);
      
      const token = localStorage.getItem('token');
      if (!token) {
        setError("Authentication token not found. Please login again.");
        return;
      }
      
      const response = await axios.post(`${SOCKET_URL}/api/chat/send-message`, {
        sender: user.userId,
        receiver: selectedChat.otherUser._id,
        content: message
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Clear the message input
      setMessage('');
      
      // Stop typing indicator
      if (socketConnected) {
        socket.emit('stopTyping', {
          sender: user.userId,
          receiver: selectedChat.otherUser._id
        });
      }
      
      console.log('✅ Message sent request completed');
      
      // Note: We don't need to manually add the message to the UI
      // It will be added via the socket 'messageSent' event
    } catch (err) {
      console.error('❌ Error sending message:', err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to send message. Please try again.");
    }
  };

  const handleTyping = () => {
    if (!selectedChat || !socketConnected || !user?.userId) return;
    if (typingTimer) clearTimeout(typingTimer);

    socket.emit('typing', {
      sender: user.userId,
      receiver: selectedChat.otherUser._id
    });

    const timer = setTimeout(() => {
      socket.emit('stopTyping', {
        sender: user.userId,
        receiver: selectedChat.otherUser._id
      });
    }, 2000);

    setTypingTimer(timer);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (selectedChat) {
      console.log('💬 Chat selected:', selectedChat);
      // Reset pagination when changing chats
      setCurrentPage(1);
      setTotalPages(1);
      fetchMessages(selectedChat, 1);
    }
  }, [selectedChat]);

  const handleChatSelection = (chat) => {
    setSelectedChat(chat);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.otherUser.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.otherUser.lastName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle case where user data isn't loaded yet
  if (!user && loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (!user && error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
          <AlertTriangle size={48} className="mx-auto mb-4 text-red-500" />
          <h2 className="text-xl font-semibold mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.href = '/login'}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Fixed Sidebar Navigation */}
      <div className="flex-none">
        
      </div>

      {/* Main Content Area - Shifted right to accommodate sidebar */}
      <div className="flex-1 ml-64">
        <div className="flex h-full">
          {/* Chat List Sidebar */}
          <div className="w-1/4 bg-white border-r border-gray-200">
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search alumni..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-y-auto h-[calc(100vh-64px)]">
              {loading && chats.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                </div>
              ) : error ? (
                <div className="text-center p-8 text-red-500">
                  <AlertTriangle size={32} className="mx-auto mb-2" />
                  <p>{error}</p>
                  <button 
                    onClick={fetchChats}
                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                  >
                    Try Again
                  </button>
                </div>
              ) : filteredChats.length > 0 ? (
                filteredChats.map((chat) => (
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    key={chat.chatId}
                    className={`p-4 border-b cursor-pointer transition-colors ${
                      selectedChat?.chatId === chat.chatId ? 'bg-green-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handleChatSelection(chat)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                        {chat.otherUser?.firstName?.[0] || '?'}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold">{`${chat.otherUser?.firstName || ''} ${chat.otherUser?.lastName || ''}`}</h3>
                          <span className="text-xs text-gray-500">
                            {chat.lastMessage?.timestamp ? formatTime(chat.lastMessage.timestamp) : ''}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {chat.lastMessage?.sender.toString() === user?.userId.toString() ? 'You: ' : ''}
                          {chat.lastMessage?.content || 'No messages yet'}
                        </p>
                      </div>
                      {chat.unreadCount > 0 && (
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs flex-shrink-0">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center p-8 text-gray-500">
                  <MessageSquare size={32} className="mx-auto mb-2" />
                  <p>{searchTerm ? 'No alumni match your search' : 'No conversations yet'}</p>
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-gray-50">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 bg-white border-b flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {selectedChat.otherUser?.firstName?.[0] || '?'}
                  </div>
                  <div>
                    <h2 className="font-semibold">{`${selectedChat.otherUser?.firstName || ''} ${selectedChat.otherUser?.lastName || ''}`}</h2>
                    <p className="text-sm text-gray-500">{selectedChat.otherUser?.userType || 'Alumni'}</p>
                  </div>
                  {!socketConnected && (
                    <span className="ml-auto text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                      Offline
                    </span>
                  )}
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4">
                  {loading && messages.length === 0 ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
                    </div>
                  ) : error ? (
                    <div className="flex justify-center items-center h-full text-center text-red-500">
                      <div>
                        <AlertTriangle size={40} className="mx-auto mb-2" />
                        <p>{error}</p>
                        <button 
                          onClick={() => fetchMessages(selectedChat)}
                          className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-sm"
                        >
                          Try Again
                        </button>
                      </div>
                    </div>
                  ) : messages.length > 0 ? (
                    <div className="space-y-4">
                      {currentPage < totalPages && (
                        <div className="flex justify-center my-4">
                          <button 
                            onClick={loadMoreMessages}
                            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                          >
                            Load earlier messages
                          </button>
                        </div>
                      )}
                      {messages.map((msg, index) => {
                        // Check if we should show a date separator
                        const showDateHeader = index === 0 || 
                          formatDate(msg.timestamp) !== formatDate(messages[index - 1].timestamp);
                        
                        const isFromCurrentUser = msg.sender.toString() === user?.userId.toString();
                        
                        return (
                          <React.Fragment key={msg._id || index}>
                            {showDateHeader && (
                              <div className="flex justify-center my-4">
                                <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-full text-xs">
                                  {formatDate(msg.timestamp)}
                                </span>
                              </div>
                            )}
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className={`flex ${isFromCurrentUser ? 'justify-end' : 'justify-start'}`}
                            >
                              <div
                                className={`max-w-[70%] p-3 rounded-lg ${
                                  isFromCurrentUser
                                    ? 'bg-green-500 text-white rounded-br-none'
                                    : 'bg-white text-gray-800 rounded-bl-none shadow-sm'
                                }`}
                              >
                                <p>{msg.content}</p>
                                <div className="flex justify-end">
                                  <p className="text-xs mt-1 opacity-70">
                                    {formatTime(msg.timestamp)}
                                    {isFromCurrentUser && (
                                      <span className="ml-1">
                                        {msg.read ? ' ✓✓' : ' ✓'}
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          </React.Fragment>
                        );
                      })}
                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="bg-gray-200 p-3 rounded-lg">
                            <div className="flex space-x-2">
                              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                              <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  ) : (
                    <div className="flex justify-center items-center h-full text-center text-gray-500">
                      <div>
                        <MessageSquare size={40} className="mx-auto mb-2" />
                        <p>No messages yet</p>
                        <p className="text-sm">Start a conversation with {selectedChat.otherUser?.firstName || 'this alumni'}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="p-4 bg-white border-t">
                  <form onSubmit={handleSendMessage} className="flex space-x-4">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => {
                        setMessage(e.target.value);
                        handleTyping();
                      }}
                      placeholder="Type your message..."
                      className="flex-1 p-2 border rounded-lg focus:outline-none focus:border-green-500"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      className={`text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                        message.trim() && !error ? 'bg-green-500 hover:bg-green-600' : 'bg-gray-300 cursor-not-allowed'
                      }`}
                      disabled={!message.trim() || !!error}
                    >
                      <Send size={20} />
                      <span>Send</span>
                    </motion.button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MessageSquare size={48} className="mx-auto mb-4" />
                  <h3 className="text-xl font-semibold">Select a conversation</h3>
                  <p>Choose an alumni from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;