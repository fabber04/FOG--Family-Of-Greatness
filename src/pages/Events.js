import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Search,
  Plus,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Events = () => {
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showFullView, setShowFullView] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const categories = [
    { id: 'all', name: 'All Events' },
    { id: 'prayer', name: 'Prayer' },
    { id: 'service', name: 'Service' },
    { id: 'devotional', name: 'Devotional' },
    { id: 'empowerment', name: 'Empowerment' },
    { id: 'social', name: 'Social' },
    { id: 'wisdom', name: 'Wisdom Class' }
  ];

  const events = [
    {
      id: 1,
      title: 'Prayer Sessions',
      description: 'Prayer sessions every Monday, Wednesday, Friday. Time: 0400hrs',
      category: 'prayer',
      date: '2024-01-15',
      time: '04:00',
      location: '',
      maxAttendees: 50,
      currentAttendees: 23,
      featured: true,
      image: '/FOG--Family-Of-Greatness/images/events/IMG-20250825-WA0070.jpg'
    },
    {
      id: 2,
      title: 'Weekly Service',
      description: 'Every Wednesday (Online)',
      category: 'service',
      date: '2024-01-21',
      time: '09:00',
      location: '',
      maxAttendees: 200,
      currentAttendees: 156,
      featured: true,
      image: '/FOG--Family-Of-Greatness/images/events/IMG-20250825-WA0064.jpg'
    },
    {
      id: 3,
      title: 'Relationship Service',
      description: 'Every Thursday - 2000Hrs CAT (live on YouTube)',
      category: 'devotional',
      date: '2024-01-18',
      time: '20:00',
      location: '',
      maxAttendees: 80,
      currentAttendees: 45,
      featured: false,
      image: '/FOG--Family-Of-Greatness/images/events/IMG-20250825-WA0062.jpg'
    }
  ];

  const ladiesNightPhotos = [
    '/FOG--Family-Of-Greatness/images/ladies-night/IMG-20250810-WA0001.jpg',
    '/FOG--Family-Of-Greatness/images/ladies-night/IMG-20250825-WA0066.jpg',
    '/FOG--Family-Of-Greatness/images/ladies-night/IMG-20250825-WA0067.jpg',
    '/FOG--Family-Of-Greatness/images/ladies-night/IMG-20250825-WA0068.jpg',
    '/FOG--Family-Of-Greatness/images/ladies-night/IMG-20250825-WA0069.jpg',
    '/FOG--Family-Of-Greatness/images/ladies-night/IMG-20250825-WA0071.jpg',
    '/FOG--Family-Of-Greatness/images/ladies-night/IMG-20250825-WA0072.jpg',
    '/FOG--Family-Of-Greatness/images/ladies-night/IMG-20250825-WA0073.jpg',
    '/FOG--Family-Of-Greatness/images/ladies-night/IMG-20250825-WA0074.jpg',
    '/FOG--Family-Of-Greatness/images/ladies-night/IMG-20250825-WA0075.jpg'
  ];

  const getCategoryColor = (category) => {
    const colors = {
      prayer: 'bg-blue-100 text-blue-800',
      service: 'bg-green-100 text-green-800',
      devotional: 'bg-purple-100 text-purple-800',
      empowerment: 'bg-orange-100 text-orange-800',
      social: 'bg-pink-100 text-pink-800',
      wisdom: 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (event) => {
    const now = new Date();
    const eventDate = new Date(event.date);
    if (eventDate < now) return 'bg-red-100 text-red-800';
    if (event.currentAttendees >= event.maxAttendees) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (event) => {
    const now = new Date();
    const eventDate = new Date(event.date);
    if (eventDate < now) return 'Past';
    if (event.currentAttendees >= event.maxAttendees) return 'Full';
    return 'Open';
  };

  const handleAddEvent = () => {
    setShowAddModal(true);
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
    return matchesSearch && matchesCategory;
  });


  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">FOG Events</h1>
              <p className="mt-2 text-gray-600">Join our community events and grow together</p>
            </div>
            
            {isAdmin() && (
              <button
                onClick={handleAddEvent}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Event
              </button>
            )}
          </div>
        </div>

        {/* Latest Event Highlight */}
        <div id="ladies-night-highlight" className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl overflow-hidden shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                                            {/* Image Section */}
               <div 
                 className="relative h-64 lg:h-72 cursor-pointer"
                                    onClick={() => setShowFullView(true)}
               >

                 <img
                   src={ladiesNightPhotos[currentPhotoIndex]}
                   alt="Ladies Night Event"
                   className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 pointer-events-none"

                 />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Navigation Buttons */}
                <button
                  onClick={() => setCurrentPhotoIndex(prev => prev > 0 ? prev - 1 : ladiesNightPhotos.length - 1)}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <button
                  onClick={() => setCurrentPhotoIndex(prev => prev < ladiesNightPhotos.length - 1 ? prev + 1 : 0)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                
                {/* Photo Indicator */}
                <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
                  <div className="flex space-x-1.5">
                    {ladiesNightPhotos.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentPhotoIndex(index)}
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                          index === currentPhotoIndex ? 'bg-white' : 'bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Content Section */}
              <div className="p-6 lg:p-8 text-white">
                <div className="mb-3">
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-white/20 text-white mb-2">
                    Latest Event
                  </span>
                  <h2 className="text-xl lg:text-2xl font-bold mb-2">
                    Ladies Night 2024
                  </h2>
                  <p className="text-white/90 mb-4">
                    A special evening celebrating women in faith, featuring worship, fellowship, and empowerment.
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      December 20, 2024
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      18:00 - 22:00
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2" />
                      85 attendees
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Featured Events */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Events</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredEvents.filter(event => event.featured).map((event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200">
                <div className="relative">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                      {categories.find(cat => cat.id === event.category)?.name}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event)}`}>
                      {getStatusText(event)}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(event.date).toLocaleDateString('en-GB', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-2" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-2" />
                      {event.currentAttendees}/{event.maxAttendees} attendees
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Events */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div 
                key={event.id} 
                id={`${event.title.toLowerCase().replace(/\s+/g, '-')}-event`}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200"
              >
                <div className="relative">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                      {categories.find(cat => cat.id === event.category)?.name}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event)}`}>
                      {getStatusText(event)}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-3 text-sm line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-1 mb-3 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(event.date).toLocaleDateString('en-GB', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {event.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full Screen Image Viewer */}
        {showFullView && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" style={{zIndex: 9999}}>
            
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Close Button */}
              <button
                onClick={() => setShowFullView(false)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200"
              >
                <X className="w-6 h-6" />
              </button>
              
              {/* Navigation Buttons */}
              <button
                onClick={() => setCurrentPhotoIndex(prev => prev > 0 ? prev - 1 : ladiesNightPhotos.length - 1)}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={() => setCurrentPhotoIndex(prev => prev < ladiesNightPhotos.length - 1 ? prev + 1 : 0)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-200 z-10"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              {/* Main Image */}
              <img
                src={ladiesNightPhotos[currentPhotoIndex]}
                alt="Ladies Night Event"
                className="max-w-full max-h-full object-contain"
              />
              
              {/* Photo Counter */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
                {currentPhotoIndex + 1} of {ladiesNightPhotos.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
