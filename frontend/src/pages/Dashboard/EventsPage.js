import React, { useEffect, useState } from "react";
import { Calendar, Clock, MapPin, ExternalLink, Filter } from "lucide-react";
import Navbar from "../../components/shared/Navbar";

// Events Page Component
const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    category: "all",
    location: "all"
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/events`);
        const data = await response.json();
        
        // Sort events by date (upcoming first)
        const sortedEvents = data.sort((a, b) => new Date(a.date) - new Date(b.date));
        setEvents(sortedEvents);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events. Please try again later.");
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  // Filter events based on selected filters
  const filteredEvents = events.filter(event => {
    // This is placeholder logic - you would need to add category field to your schema
    // to make this fully functional
    if (filter.category !== "all" && event.category !== filter.category) return false;
    if (filter.location !== "all") {
      // Simple check if the location contains "online" or matches selected filter
      const isOnline = event.location.toLowerCase().includes("online");
      if (filter.location === "online" && !isOnline) return false;
      if (filter.location === "campus" && isOnline) return false;
    }
    return true;
  });

  // Format date to be human-readable
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Check if an event is upcoming
  const isUpcoming = (dateString) => {
    const eventDate = new Date(dateString);
    const today = new Date();
    return eventDate >= today;
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Fixed Sidebar Navigation */}
      <div className="flex-none">
       
      </div>

      {/* Main Content Area - Shifted right to accommodate sidebar */}
      <div className="flex-1 ml-64 p-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg mb-6">
          <div className="p-8">
            <h1 className="text-3xl font-bold mb-2">Events & Networking</h1>
            <p className="text-purple-100">
              Connect with alumni and participate in upcoming events
            </p>
          </div>
        </div>

        {/* Events List */}
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold">Upcoming Events</h2>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
              <div className="relative">
                <select 
                  className="border border-gray-300 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white w-full"
                  onChange={(e) => setFilter({...filter, category: e.target.value})}
                  value={filter.category}
                >
                  <option value="all">All Categories</option>
                  <option value="networking">Networking</option>
                  <option value="workshop">Workshops</option>
                  <option value="webinar">Webinars</option>
                </select>
                <Filter className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              </div>
              <div className="relative">
                <select 
                  className="border border-gray-300 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white w-full"
                  onChange={(e) => setFilter({...filter, location: e.target.value})}
                  value={filter.location}
                >
                  <option value="all">All Locations</option>
                  <option value="online">Online</option>
                  <option value="campus">On-Campus</option>
                </select>
                <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              </div>
            </div>
          </div>
          
          {/* Error display */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700 rounded">
              <p>{error}</p>
            </div>
          )}
          
          {/* Loading state */}
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
            </div>
          ) : (
            <>
              {/* No events state */}
              {filteredEvents.length === 0 && (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                  <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-10 h-10 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-800 mb-2">No events found</h3>
                  <p className="text-gray-600 mb-6">There are no events matching your filter criteria.</p>
                  <button 
                    onClick={() => setFilter({ category: "all", location: "all" })}
                    className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
                  >
                    View All Events
                  </button>
                </div>
              )}
              
              {/* Events grid */}
              <div className="grid gap-6">
                {filteredEvents.map((event) => (
                  <div 
                    key={event._id} 
                    className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow ${
                      !isUpcoming(event.date) ? 'border-l-4 border-gray-400' : 'border-l-4 border-purple-500'
                    }`}
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-3">
                            <h3 className="text-xl font-semibold">{event.title}</h3>
                            {!isUpcoming(event.date) && (
                              <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-full">
                                Past Event
                              </span>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-gray-600 flex items-center mb-2">
                                <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                                {formatDate(event.date)}
                              </p>
                              <p className="text-gray-600 flex items-center">
                                <Clock className="w-4 h-4 mr-2 text-purple-500" />
                                {event.time}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-600 flex items-center">
                                <MapPin className="w-4 h-4 mr-2 text-purple-500" />
                                {event.location}
                              </p>
                              {event.meetingLink && (
                                <p className="text-purple-600 flex items-center mt-2">
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  <a 
                                    href={event.meetingLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                  >
                                    Meeting Link
                                  </a>
                                </p>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-700">{event.description}</p>
                        </div>
                        
                        <div className="mt-6 md:mt-0 md:ml-6 flex flex-col items-center">
                          <div className="text-center mb-3 bg-purple-50 p-3 rounded-lg w-20">
                            <span className="block text-2xl font-bold text-purple-600">
                              {new Date(event.date).getDate()}
                            </span>
                            <span className="block text-sm text-gray-500">
                              {new Date(event.date).toLocaleString('default', { month: 'short' })}
                            </span>
                          </div>
                          
                          {isUpcoming(event.date) ? (
                            <button 
                              className="w-full bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors duration-200"
                              onClick={() => {
                                // This would typically open a registration form or modal
                                if (event.meetingLink) {
                                  window.open(event.meetingLink, '_blank');
                                } else {
                                  alert("Registration will be available soon.");
                                }
                              }}
                            >
                              {event.meetingLink ? "Join Event" : "Register Now"}
                            </button>
                          ) : (
                            <span className="w-full bg-gray-100 text-gray-500 py-2 px-6 rounded-lg text-center">
                              Event Ended
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventsPage;