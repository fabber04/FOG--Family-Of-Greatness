import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  Users, 
  Star,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  BookOpen,
  Video,
  User,
  Plus,
  Eye,
  Heart,
  Share2,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const Counseling = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [filterAvailability, setFilterAvailability] = useState('all');
  const [selectedCounselor, setSelectedCounselor] = useState(null);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Mock counselors data
  const counselors = [
    {
      id: 1,
      name: 'Dr. Sarah Wilson',
      specialty: 'marriage',
      credentials: 'Licensed Marriage & Family Therapist',
      experience: '15+ years',
      rating: 4.9,
      sessions: 1250,
      hourlyRate: 120,
      availability: 'available',
      languages: ['English', 'Spanish'],
      description: 'Specialized in helping couples build stronger relationships through biblical principles and proven therapeutic techniques.',
      cover: '/api/placeholder/300/300',
      specialties: ['Marriage Counseling', 'Family Therapy', 'Relationship Issues', 'Communication Skills'],
      education: 'Ph.D. in Clinical Psychology, Master\'s in Marriage & Family Therapy',
      approach: 'Integrates Christian faith with evidence-based therapeutic approaches including CBT and Emotionally Focused Therapy.',
      nextAvailable: '2024-01-20',
      availableTimes: ['9:00 AM', '10:00 AM', '2:00 PM', '3:00 PM', '4:00 PM']
    },
    {
      id: 2,
      name: 'Pastor Mike Johnson',
      specialty: 'spiritual',
      credentials: 'Pastoral Counselor, M.Div.',
      experience: '20+ years',
      rating: 4.8,
      sessions: 980,
      hourlyRate: 80,
      availability: 'available',
      languages: ['English'],
      description: 'Provides spiritual guidance and counseling rooted in biblical wisdom and pastoral care experience.',
      cover: '/api/placeholder/300/300',
      specialties: ['Spiritual Guidance', 'Pastoral Care', 'Life Transitions', 'Grief Counseling'],
      education: 'Master of Divinity, Advanced Pastoral Counseling Certification',
      approach: 'Combines pastoral wisdom with practical life guidance, helping individuals navigate spiritual and life challenges.',
      nextAvailable: '2024-01-18',
      availableTimes: ['1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']
    },
    {
      id: 3,
      name: 'Dr. Emily Brown',
      specialty: 'youth',
      credentials: 'Licensed Clinical Social Worker',
      experience: '12+ years',
      rating: 4.7,
      sessions: 890,
      hourlyRate: 100,
      availability: 'available',
      languages: ['English', 'French'],
      description: 'Specialized in adolescent and young adult counseling, helping youth navigate life challenges and build resilience.',
      cover: '/api/placeholder/300/300',
      specialties: ['Youth Counseling', 'Adolescent Issues', 'Anxiety & Depression', 'Peer Relationships'],
      education: 'Master of Social Work, Licensed Clinical Social Worker',
      approach: 'Uses age-appropriate therapeutic techniques including play therapy, art therapy, and cognitive behavioral therapy.',
      nextAvailable: '2024-01-22',
      availableTimes: ['10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM']
    },
    {
      id: 4,
      name: 'Rev. David Smith',
      specialty: 'grief',
      credentials: 'Grief Counselor, Chaplain',
      experience: '18+ years',
      rating: 4.9,
      sessions: 1100,
      hourlyRate: 90,
      availability: 'limited',
      languages: ['English'],
      description: 'Specialized in grief counseling and helping individuals and families navigate loss and bereavement.',
      cover: '/api/placeholder/300/300',
      specialties: ['Grief Counseling', 'Loss & Bereavement', 'End-of-Life Care', 'Trauma Support'],
      education: 'Master of Divinity, Advanced Grief Counseling Certification',
      approach: 'Provides compassionate support through the grieving process, combining spiritual comfort with therapeutic techniques.',
      nextAvailable: '2024-01-25',
      availableTimes: ['9:00 AM', '11:00 AM', '2:00 PM']
    },
    {
      id: 5,
      name: 'Dr. Lisa Chen',
      specialty: 'anxiety',
      credentials: 'Licensed Professional Counselor',
      experience: '14+ years',
      rating: 4.6,
      sessions: 750,
      hourlyRate: 110,
      availability: 'available',
      languages: ['English', 'Mandarin'],
      description: 'Expert in treating anxiety, depression, and stress-related issues using evidence-based therapeutic approaches.',
      cover: '/api/placeholder/300/300',
      specialties: ['Anxiety Disorders', 'Depression', 'Stress Management', 'Mindfulness'],
      education: 'Ph.D. in Counseling Psychology, Licensed Professional Counselor',
      approach: 'Integrates cognitive behavioral therapy with mindfulness techniques and Christian faith principles.',
      nextAvailable: '2024-01-19',
      availableTimes: ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM']
    }
  ];

  const specialties = [
    { id: 'all', name: 'All Specialties', count: counselors.length },
    { id: 'marriage', name: 'Marriage & Family', count: counselors.filter(counselor => counselor.specialty === 'marriage').length },
    { id: 'spiritual', name: 'Spiritual Guidance', count: counselors.filter(counselor => counselor.specialty === 'spiritual').length },
    { id: 'youth', name: 'Youth Counseling', count: counselors.filter(counselor => counselor.specialty === 'youth').length },
    { id: 'grief', name: 'Grief & Loss', count: counselors.filter(counselor => counselor.specialty === 'grief').length },
    { id: 'anxiety', name: 'Anxiety & Depression', count: counselors.filter(counselor => counselor.specialty === 'anxiety').length }
  ];

  const availabilityOptions = [
    { id: 'all', name: 'All Availability', count: counselors.length },
    { id: 'available', name: 'Available Now', count: counselors.filter(counselor => counselor.availability === 'available').length },
    { id: 'limited', name: 'Limited Availability', count: counselors.filter(counselor => counselor.availability === 'limited').length }
  ];

  const filteredCounselors = counselors.filter(counselor => {
    const matchesSearch = counselor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         counselor.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSpecialty = filterSpecialty === 'all' || counselor.specialty === filterSpecialty;
    const matchesAvailability = filterAvailability === 'all' || counselor.availability === filterAvailability;
    return matchesSearch && matchesSpecialty && matchesAvailability;
  });

  const handleBookSession = (counselor) => {
    setSelectedCounselor(counselor);
    setShowBooking(true);
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    if (selectedDate && selectedTime) {
      alert(`Booking confirmed with ${selectedCounselor.name} on ${selectedDate} at ${selectedTime}`);
      setShowBooking(false);
      setSelectedDate('');
      setSelectedTime('');
    } else {
      alert('Please select both date and time');
    }
  };

  const getSpecialtyIcon = (specialty) => {
    switch (specialty) {
      case 'marriage':
        return <Heart className="w-5 h-5" />;
      case 'spiritual':
        return <Star className="w-5 h-5" />;
      case 'youth':
        return <Users className="w-5 h-5" />;
      case 'grief':
        return <HeartHandshake className="w-5 h-5" />;
      case 'anxiety':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <HeartHandshake className="w-5 h-5" />;
    }
  };

  const getSpecialtyColor = (specialty) => {
    switch (specialty) {
      case 'marriage':
        return 'bg-pink-100 text-pink-800';
      case 'spiritual':
        return 'bg-yellow-100 text-yellow-800';
      case 'youth':
        return 'bg-blue-100 text-blue-800';
      case 'grief':
        return 'bg-purple-100 text-purple-800';
      case 'anxiety':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityColor = (availability) => {
    switch (availability) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'limited':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Counseling Services</h1>
          <p className="mt-2 text-gray-600">Professional counseling and spiritual guidance for your journey of healing and growth</p>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-8 mb-8 text-white">
          <div className="text-center">
            <HeartHandshake className="mx-auto h-16 w-16 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Professional Christian Counseling</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Connect with experienced counselors who integrate professional expertise with Christian faith principles. 
              Find healing, guidance, and support for life's challenges.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                <Calendar className="w-5 h-5 inline mr-2" />
                Book Your Session
              </button>
              <button className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-primary-600 transition-colors">
                Learn More
              </button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search counselors or specialties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Specialty Filter */}
            <select
              value={filterSpecialty}
              onChange={(e) => setFilterSpecialty(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {specialties.map(specialty => (
                <option key={specialty.id} value={specialty.id}>
                  {specialty.name} ({specialty.count})
                </option>
              ))}
            </select>

            {/* Availability Filter */}
            <select
              value={filterAvailability}
              onChange={(e) => setFilterAvailability(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {availabilityOptions.map(option => (
                <option key={option.id} value={option.id}>
                  {option.name} ({option.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Counselors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCounselors.map((counselor) => (
            <div key={counselor.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              {/* Cover Image */}
              <div className="relative">
                <img
                  src={counselor.cover}
                  alt={counselor.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSpecialtyColor(counselor.specialty)}`}>
                    {getSpecialtyIcon(counselor.specialty)}
                    <span className="ml-1 capitalize">{counselor.specialty}</span>
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getAvailabilityColor(counselor.availability)}`}>
                    {counselor.availability === 'available' ? 'Available' : 'Limited'}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{counselor.name}</h3>
                <p className="text-sm text-gray-600 mb-3">{counselor.credentials}</p>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{counselor.description}</p>
                
                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    {counselor.rating}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {counselor.sessions} sessions
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {counselor.experience}
                  </div>
                </div>

                {/* Rate */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-bold text-primary-600">${counselor.hourlyRate}/hour</span>
                  <span className="text-sm text-gray-500">Next: {new Date(counselor.nextAvailable).toLocaleDateString()}</span>
                </div>

                {/* Specialties */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {counselor.specialties.slice(0, 2).map((specialty, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {specialty}
                    </span>
                  ))}
                  {counselor.specialties.length > 2 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      +{counselor.specialties.length - 2} more
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleBookSession(counselor)}
                    className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Book Session
                  </button>
                  
                  <button
                    onClick={() => setSelectedCounselor(counselor)}
                    className="px-3 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCounselors.length === 0 && (
          <div className="text-center py-12">
            <HeartHandshake className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No counselors found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {/* Counselor Details Modal */}
        {selectedCounselor && !showBooking && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-medium text-gray-900">{selectedCounselor.name}</h3>
                  <button
                    onClick={() => setSelectedCounselor(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Cover and Basic Info */}
                  <div>
                    <img
                      src={selectedCounselor.cover}
                      alt={selectedCounselor.name}
                      className="w-full rounded-lg mb-4"
                    />
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getSpecialtyColor(selectedCounselor.specialty)}`}>
                          {getSpecialtyIcon(selectedCounselor.specialty)}
                          <span className="ml-2 capitalize">{selectedCounselor.specialty}</span>
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getAvailabilityColor(selectedCounselor.availability)}`}>
                          {selectedCounselor.availability === 'available' ? 'Available' : 'Limited'}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <BookOpen className="w-4 h-4 mr-2" />
                        {selectedCounselor.credentials}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-2" />
                        {selectedCounselor.experience}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-2" />
                        Languages: {selectedCounselor.languages.join(', ')}
                      </div>
                    </div>
                  </div>
                  
                  {/* Details and Booking */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">About {selectedCounselor.name}</h4>
                      <p className="text-gray-600">{selectedCounselor.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Specialties</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCounselor.specialties.map((specialty, index) => (
                          <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Education & Approach</h4>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p><strong>Education:</strong> {selectedCounselor.education}</p>
                        <p><strong>Approach:</strong> {selectedCounselor.approach}</p>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-3xl font-bold text-primary-600">${selectedCounselor.hourlyRate}</span>
                          <span className="text-lg text-gray-500">/hour</span>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">{selectedCounselor.sessions} sessions completed</div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            {selectedCounselor.rating} rating
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleBookSession(selectedCounselor)}
                        className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                      >
                        Book Your Session
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Booking Modal */}
        {showBooking && selectedCounselor && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="text-center">
                  <Calendar className="mx-auto h-12 w-12 text-primary-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Book Session with {selectedCounselor.name}</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Select your preferred date and time for your counseling session.
                  </p>
                  
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                      <select
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        required
                      >
                        <option value="">Choose a time</option>
                        {selectedCounselor.availableTimes.map((time, index) => (
                          <option key={index} value={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Session Rate:</span>
                        <span className="text-lg font-bold text-primary-600">${selectedCounselor.hourlyRate}/hour</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowBooking(false)}
                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                      >
                        Confirm Booking
                      </button>
                    </div>
                    
                    <div className="text-center text-sm text-gray-500">
                      <p>Need to reschedule? Contact us at least 24 hours in advance.</p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Counseling;
