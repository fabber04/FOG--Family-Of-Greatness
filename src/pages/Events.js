import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Star, 
  Search,
  Plus,
  Edit3,
  Trash2,
  X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Events = () => {
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    category: 'prayer',
    date: '',
    time: '',
    location: '',
    maxAttendees: '',
    isRecurring: false,
    recurrenceType: 'daily',
    isActive: true
  });

  const [events, setEvents] = useState([
    {
      id: 1,
      title: 'Morning Prayer Session',
      description: 'Daily morning prayer to start your day with spiritual focus and community connection.',
      category: 'prayer',
      date: '2024-01-15',
      time: '04:00',
      location: 'FOG Prayer Room',
      maxAttendees: 50,
      currentAttendees: 23,
      isRecurring: true,
      recurrenceType: 'daily',
      isActive: true,
      featured: true,
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop&crop=center'
    },
    {
      id: 2,
      title: 'Weekly Service',
      description: 'Join us every Sunday for our main service featuring worship, teaching, and fellowship.',
      category: 'service',
      date: '2024-01-21',
      time: '09:00',
      location: 'FOG Main Hall',
      maxAttendees: 200,
      currentAttendees: 156,
      isRecurring: true,
      recurrenceType: 'weekly',
      isActive: true,
      featured: true,
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb192ff757?w=400&h=250&fit=crop&crop=center'
    },
    {
      id: 3,
      title: 'Relationship Thursday',
      description: 'Weekly relationship-focused devotional and discussion for couples and families.',
      category: 'devotional',
      date: '2024-01-18',
      time: '19:00',
      location: 'FOG Community Center',
      maxAttendees: 80,
      currentAttendees: 45,
      isRecurring: true,
      recurrenceType: 'weekly',
      isActive: true,
      featured: false,
      image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=250&fit=crop&crop=center'
    },
    {
      id: 4,
      title: 'Empowerment Night',
      description: 'Monthly empowerment session focusing on personal growth and spiritual development.',
      category: 'empowerment',
      date: '2024-01-25',
      time: '18:30',
      location: 'FOG Conference Room',
      maxAttendees: 120,
      currentAttendees: 89,
      isRecurring: true,
      recurrenceType: 'monthly',
      isActive: true,
      featured: true,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop&crop=center'
    },
    {
      id: 5,
      title: 'Social Dinner',
      description: 'Quarterly community dinner for fellowship, networking, and building relationships.',
      category: 'social',
      date: '2024-02-10',
      time: '19:00',
      location: 'FOG Dining Hall',
      maxAttendees: 150,
      currentAttendees: 112,
      isRecurring: true,
      recurrenceType: 'quarterly',
      isActive: true,
      featured: false,
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=250&fit=crop&crop=center'
    },
    {
      id: 6,
      title: 'Wisdom Class',
      description: 'Ongoing wisdom classes covering various life topics from a spiritual perspective.',
      category: 'education',
      date: '2024-01-20',
      time: '16:00',
      location: 'FOG Learning Center',
      maxAttendees: 60,
      currentAttendees: 38,
      isRecurring: true,
      recurrenceType: 'ongoing',
      isActive: true,
      featured: false,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=250&fit=crop&crop=center'
    }
  ]);

  const categories = [
    { id: 'all', name: 'All Events', color: 'bg-gray-100 text-gray-800' },
    { id: 'prayer', name: 'Prayer', color: 'bg-blue-100 text-blue-800' },
    { id: 'service', name: 'Service', color: 'bg-purple-100 text-purple-800' },
    { id: 'devotional', name: 'Devotional', color: 'bg-green-100 text-green-800' },
    { id: 'empowerment', name: 'Empowerment', color: 'bg-orange-100 text-orange-800' },
    { id: 'social', name: 'Social', color: 'bg-pink-100 text-pink-800' },
    { id: 'education', name: 'Education', color: 'bg-indigo-100 text-indigo-800' }
  ];

  const getCategoryColor = (categoryId) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color : 'bg-gray-100 text-gray-800';
  };

  const getRecurrenceText = (recurrenceType) => {
    switch (recurrenceType) {
      case 'daily': return 'Daily';
      case 'weekly': return 'Weekly';
      case 'monthly': return 'Monthly';
      case 'quarterly': return 'Quarterly';
      case 'ongoing': return 'Ongoing';
      default: return 'One-time';
    }
  };

  const getStatusColor = (event) => {
    if (!event.isActive) return 'bg-gray-100 text-gray-600';
    if (event.currentAttendees >= event.maxAttendees) return 'bg-red-100 text-red-800';
    if (event.currentAttendees >= event.maxAttendees * 0.8) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStatusText = (event) => {
    if (!event.isActive) return 'Inactive';
    if (event.currentAttendees >= event.maxAttendees) return 'Full';
    if (event.currentAttendees >= event.maxAttendees * 0.8) return 'Almost Full';
    return 'Available';
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || event.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleAddEvent = () => {
    setShowAddModal(true);
    setEventForm({
      title: '',
      description: '',
      category: 'prayer',
      date: '',
      time: '',
      location: '',
      maxAttendees: '',
      isRecurring: false,
      recurrenceType: 'daily',
      isActive: true
    });
  };

  const handleEditEvent = (event) => {
    setEditingEvent({ ...event });
    setEventForm({
      title: event.title,
      description: event.description,
      category: event.category,
      date: event.date,
      time: event.time,
      location: event.location,
      maxAttendees: event.maxAttendees.toString(),
      isRecurring: event.isRecurring,
      recurrenceType: event.recurrenceType,
      isActive: event.isActive
    });
    setShowEditModal(true);
  };

  const handleDeleteEvent = (event) => {
    setEventToDelete(event);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (eventToDelete) {
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventToDelete.id));
      setEventToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (showEditModal && editingEvent) {
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === editingEvent.id 
            ? {
                ...event,
                title: eventForm.title,
                description: eventForm.description,
                category: eventForm.category,
                date: eventForm.date,
                time: eventForm.time,
                location: eventForm.location,
                maxAttendees: parseInt(eventForm.maxAttendees),
                isRecurring: eventForm.isRecurring,
                recurrenceType: eventForm.recurrenceType,
                isActive: eventForm.isActive
              }
            : event
        )
      );
      setShowEditModal(false);
      setEditingEvent(null);
    } else {
      const newEvent = {
        id: Date.now(),
        title: eventForm.title,
        description: eventForm.description,
        category: eventForm.category,
        date: eventForm.date,
        time: eventForm.time,
        location: eventForm.location,
        maxAttendees: parseInt(eventForm.maxAttendees),
        currentAttendees: 0,
        isRecurring: eventForm.isRecurring,
        recurrenceType: eventForm.recurrenceType,
        isActive: eventForm.isActive,
        featured: false,
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop&crop=center'
      };
      setEvents(prevEvents => [newEvent, ...prevEvents]);
      setShowAddModal(false);
    }
    
    setEventForm({
      title: '',
      description: '',
      category: 'prayer',
      date: '',
      time: '',
      location: '',
      maxAttendees: '',
      isRecurring: false,
      recurrenceType: 'daily',
      isActive: true
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">FOG Events</h1>
              <p className="mt-2 text-gray-600">Join our community events and grow together in faith</p>
            </div>
            
            {isAdmin() && (
              <button
                onClick={handleAddEvent}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Event
              </button>
            )}
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
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
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
            {events.filter(event => event.featured).map((event) => (
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
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>
                  
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
                      <MapPin className="w-4 h-4 mr-2" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-2" />
                      {event.currentAttendees}/{event.maxAttendees} attendees
                    </div>
                  </div>
                  
                  {event.isRecurring && (
                    <div className="mb-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Star className="w-3 h-3 mr-1" />
                        {getRecurrenceText(event.recurrenceType)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200">
                      Join Event
                    </button>
                    {isAdmin() && (
                      <>
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="px-4 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event)}
                          className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Events */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200">
                <div className="relative">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-2 left-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(event.category)}`}>
                      {categories.find(cat => cat.id === event.category)?.name}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(event)}`}>
                      {getStatusText(event)}
                    </span>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{event.title}</h3>
                  <p className="text-gray-600 mb-3 line-clamp-2 text-sm">{event.description}</p>
                  
                  <div className="space-y-1 mb-3">
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(event.date).toLocaleDateString('en-GB', { 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock className="w-3 h-3 mr-1" />
                      {event.time}
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Users className="w-3 h-3 mr-1" />
                      {event.currentAttendees}/{event.maxAttendees}
                    </div>
                  </div>
                  
                  {event.isRecurring && (
                    <div className="mb-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Star className="w-3 h-3 mr-1" />
                        {getRecurrenceText(event.recurrenceType)}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-primary-600 text-white px-3 py-2 rounded-lg hover:bg-primary-700 transition-colors duration-200 text-sm">
                      Join
                    </button>
                    {isAdmin() && (
                      <>
                        <button
                          onClick={() => handleEditEvent(event)}
                          className="px-3 py-2 text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(event)}
                          className="px-3 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* No Results */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {/* Add/Edit Event Modal */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-medium text-gray-900">
                    {showEditModal ? 'Edit Event' : 'Add New Event'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={eventForm.title}
                        onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter event title"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        required
                        value={eventForm.category}
                        onChange={(e) => setEventForm(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        {categories.filter(cat => cat.id !== 'all').map(category => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={eventForm.description}
                      onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter event description"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date *
                      </label>
                      <input
                        type="date"
                        required
                        value={eventForm.date}
                        onChange={(e) => setEventForm(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time *
                      </label>
                      <input
                        type="time"
                        required
                        value={eventForm.time}
                        onChange={(e) => setEventForm(prev => ({ ...prev, time: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Max Attendees
                      </label>
                      <input
                        type="number"
                        value={eventForm.maxAttendees}
                        onChange={(e) => setEventForm(prev => ({ ...prev, maxAttendees: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter max attendees"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location *
                    </label>
                    <input
                      type="text"
                      required
                      value={eventForm.location}
                      onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      placeholder="Enter event location"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="isRecurring"
                        checked={eventForm.isRecurring}
                        onChange={(e) => setEventForm(prev => ({ ...prev, isRecurring: e.target.checked }))}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="isRecurring" className="text-sm font-medium text-gray-700">
                        Recurring Event
                      </label>
                    </div>
                    
                    {eventForm.isRecurring && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Recurrence Type
                        </label>
                        <select
                          value={eventForm.recurrenceType}
                          onChange={(e) => setEventForm(prev => ({ ...prev, recurrenceType: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="daily">Daily</option>
                          <option value="weekly">Weekly</option>
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="ongoing">Ongoing</option>
                        </select>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={eventForm.isActive}
                      onChange={(e) => setEventForm(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
                      Active Event
                    </label>
                  </div>
                  
                  <div className="flex space-x-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowAddModal(false);
                        setShowEditModal(false);
                      }}
                      className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
                    >
                      {showEditModal ? 'Update Event' : 'Create Event'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && eventToDelete && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                  Delete Event
                </h3>
                <p className="text-sm text-gray-600 text-center mb-6">
                  Are you sure you want to delete "{eventToDelete.title}"? This action cannot be undone.
                </p>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setEventToDelete(null);
                    }}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
