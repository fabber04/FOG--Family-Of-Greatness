import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  Filter, 
  Play, 
  Clock, 
  Users, 
  Star,
  MessageCircle,
  Phone,
  Calendar,
  MapPin,
  BookOpen,
  Video,
  Download,
  Certificate,
  Lock,
  Unlock,
  Eye,
  Heart,
  Share2
} from 'lucide-react';

const GeniusAcademy = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showEnrollment, setShowEnrollment] = useState(false);

  // Mock Genius Academy data
  const courses = [
    {
      id: 1,
      title: 'Biblical Leadership Fundamentals',
      instructor: 'Coach Noble Masvingise',
      category: 'leadership',
      level: 'beginner',
      description: 'Learn the foundational principles of biblical leadership and how to apply them in ministry and life.',
      cover: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop&crop=center',
      duration: '8 weeks',
      sessions: 16,
      students: 245,
      rating: 4.9,
      price: 199.99,
      originalPrice: 299.99,
      isEnrolled: false,
      startDate: '2024-02-01',
      tags: ['leadership', 'biblical', 'ministry', 'fundamentals'],
      curriculum: [
        'Week 1: Understanding Biblical Leadership',
        'Week 2: Character and Integrity',
        'Week 3: Vision and Mission',
        'Week 4: Team Building',
        'Week 5: Communication Skills',
        'Week 6: Decision Making',
        'Week 7: Conflict Resolution',
        'Week 8: Legacy Building'
      ],
      features: [
        'Live weekly sessions',
        'Interactive Q&A',
        'Downloadable resources',
        'Certificate of completion',
        'Phone group access',
        'Lifetime access'
      ]
    },
    {
      id: 2,
      title: 'Advanced Ministry Strategy',
      instructor: 'Pastor Mike Johnson',
      category: 'ministry',
      level: 'advanced',
      description: 'Advanced strategies for building and growing effective ministries in the digital age.',
      cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop&crop=center',
      duration: '12 weeks',
      sessions: 24,
      students: 189,
      rating: 4.8,
      price: 299.99,
      originalPrice: 399.99,
      isEnrolled: false,
      startDate: '2024-02-15',
      tags: ['ministry', 'strategy', 'advanced', 'digital'],
      curriculum: [
        'Week 1-3: Digital Ministry Foundations',
        'Week 4-6: Content Strategy',
        'Week 7-9: Community Building',
        'Week 10-12: Growth and Scaling'
      ],
      features: [
        'Live weekly sessions',
        'One-on-one mentoring',
        'Strategy templates',
        'Case studies',
        'Phone group access',
        'Lifetime access'
      ]
    },
    {
      id: 3,
      title: 'Financial Stewardship Mastery',
      instructor: 'Financial Ministry Team',
      category: 'finance',
      level: 'intermediate',
      description: 'Master biblical financial principles and learn practical money management skills.',
      cover: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop&crop=center',
      duration: '6 weeks',
      sessions: 12,
      students: 312,
      rating: 4.7,
      price: 149.99,
      originalPrice: 199.99,
      isEnrolled: false,
      startDate: '2024-02-10',
      tags: ['finance', 'stewardship', 'biblical', 'practical'],
      curriculum: [
        'Week 1: Biblical Financial Principles',
        'Week 2: Budgeting and Planning',
        'Week 3: Debt Management',
        'Week 4: Investment Basics',
        'Week 5: Generosity and Giving',
        'Week 6: Long-term Financial Planning'
      ],
      features: [
        'Live weekly sessions',
        'Financial planning tools',
        'Budget templates',
        'Expert Q&A',
        'Phone group access',
        'Lifetime access'
      ]
    },
    {
      id: 4,
      title: 'Youth Ministry Excellence',
      instructor: 'Youth Ministry Experts',
      category: 'youth',
      level: 'intermediate',
      description: 'Comprehensive training for effective youth ministry leadership and engagement.',
      cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop&crop=center',
      duration: '10 weeks',
      sessions: 20,
      students: 178,
      rating: 4.6,
      price: 249.99,
      originalPrice: 349.99,
      isEnrolled: false,
      startDate: '2024-02-20',
      tags: ['youth', 'ministry', 'leadership', 'engagement'],
      curriculum: [
        'Week 1-2: Understanding Youth Culture',
        'Week 3-4: Building Relationships',
        'Week 5-6: Program Development',
        'Week 7-8: Crisis Management',
        'Week 9-10: Long-term Impact'
      ],
      features: [
        'Live weekly sessions',
        'Youth program templates',
        'Crisis management guide',
        'Peer networking',
        'Phone group access',
        'Lifetime access'
      ]
    },
    {
      id: 5,
      title: 'Prayer and Intercession Mastery',
      instructor: 'Rev. David Smith',
      category: 'spiritual',
      level: 'beginner',
      description: 'Deepen your prayer life and learn the power of intercessory prayer.',
      cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center',
      duration: '8 weeks',
      sessions: 16,
      students: 423,
      rating: 4.9,
      price: 179.99,
      originalPrice: 249.99,
      isEnrolled: false,
      startDate: '2024-02-05',
      tags: ['prayer', 'intercession', 'spiritual', 'growth'],
      curriculum: [
        'Week 1: Foundations of Prayer',
        'Week 2: Types of Prayer',
        'Week 3: Intercessory Prayer',
        'Week 4: Spiritual Warfare',
        'Week 5: Prayer Strategies',
        'Week 6: Building Prayer Teams',
        'Week 7: Prayer and Revival',
        'Week 8: Sustaining Prayer Life'
      ],
      features: [
        'Live weekly sessions',
        'Prayer guides and templates',
        'Spiritual warfare resources',
        'Prayer team building',
        'Phone group access',
        'Lifetime access'
      ]
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', count: courses.length },
    { id: 'leadership', name: 'Leadership', count: courses.filter(course => course.category === 'leadership').length },
    { id: 'ministry', name: 'Ministry', count: courses.filter(course => course.category === 'ministry').length },
    { id: 'finance', name: 'Finance', count: courses.filter(course => course.category === 'finance').length },
    { id: 'youth', name: 'Youth', count: courses.filter(course => course.category === 'youth').length },
    { id: 'spiritual', name: 'Spiritual', count: courses.filter(course => course.category === 'spiritual').length }
  ];

  const levels = [
    { id: 'all', name: 'All Levels', count: courses.length },
    { id: 'beginner', name: 'Beginner', count: courses.filter(course => course.level === 'beginner').length },
    { id: 'intermediate', name: 'Intermediate', count: courses.filter(course => course.level === 'intermediate').length },
    { id: 'advanced', name: 'Advanced', count: courses.filter(course => course.level === 'advanced').length }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
    const matchesLevel = filterLevel === 'all' || course.level === filterLevel;
    return matchesSearch && matchesCategory && matchesLevel;
  });

  const handleEnroll = (course) => {
    setSelectedCourse(course);
    setShowEnrollment(true);
  };

  const handlePhoneEnrollment = (course) => {
    const message = `Hi! I'm interested in enrolling in "${course.title}" Genius Academy course. Can you provide more information?`;
    const phoneUrl = `tel:1234567890`;
    window.open(phoneUrl, '_blank');
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'leadership':
        return <GraduationCap className="w-5 h-5" />;
      case 'ministry':
        return <BookOpen className="w-5 h-5" />;
      case 'finance':
        return <Download className="w-5 h-5" />;
      case 'youth':
        return <Users className="w-5 h-5" />;
      case 'spiritual':
        return <Star className="w-5 h-5" />;
      default:
        return <GraduationCap className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'leadership':
        return 'bg-blue-100 text-blue-800';
      case 'ministry':
        return 'bg-green-100 text-green-800';
      case 'finance':
        return 'bg-orange-100 text-orange-800';
      case 'youth':
        return 'bg-purple-100 text-purple-800';
      case 'spiritual':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Genius Academy</h1>
          <p className="mt-2 text-gray-600">Transform your ministry and leadership skills with expert-led courses</p>
        </div>

        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-8 mb-8 text-white">
          <div className="text-center">
            <GraduationCap className="mx-auto h-16 w-16 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Join the Genius Academy</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Access world-class ministry training, connect with experts, and grow your skills through our comprehensive Genius Academy program.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors">
                <Phone className="w-5 h-5 inline mr-2" />
                Contact via Phone
              </button>
              <button className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-primary-600 transition-colors">
                View All Courses
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
                placeholder="Search Genius Academy courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>

            {/* Level Filter */}
            <select
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {levels.map(level => (
                <option key={level.id} value={level.id}>
                  {level.name} ({level.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
              {/* Cover Image */}
              <div className="relative">
                <img
                  src={course.cover}
                  alt={course.title}
                  className="w-full h-48 object-cover bg-gray-100"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center';
                  }}
                />
                <div className="absolute top-2 left-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(course.category)}`}>
                    {getCategoryIcon(course.category)}
                    <span className="ml-1 capitalize">{course.category}</span>
                  </span>
                </div>
                <div className="absolute top-2 right-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(course.level)}`}>
                    {course.level}
                  </span>
                </div>
                {course.originalPrice > course.price && (
                  <div className="absolute bottom-2 left-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% OFF
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{course.description}</p>
                
                {/* Instructor */}
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Users className="w-4 h-4 mr-2" />
                  {course.instructor}
                </div>

                {/* Course Details */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {course.duration}
                  </div>
                  <div className="flex items-center">
                    <Video className="w-4 h-4 mr-1" />
                    {course.sessions} sessions
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    {course.rating}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {course.students} students
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-primary-600">${course.price}</span>
                    {course.originalPrice > course.price && (
                      <span className="text-sm text-gray-500 line-through ml-2">${course.originalPrice}</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    Starts {new Date(course.startDate).toLocaleDateString()}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEnroll(course)}
                    className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
                  >
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Enroll Now
                  </button>
                  
                  <button
                    onClick={() => handlePhoneEnrollment(course)}
                    className="px-3 py-2 text-sm font-medium text-green-600 border border-green-300 rounded-lg hover:bg-green-50"
                  >
                    <Phone className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No courses found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {/* Course Details Modal */}
        {selectedCourse && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-medium text-gray-900">{selectedCourse.title}</h3>
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Cover and Basic Info */}
                  <div>
                    <img
                      src={selectedCourse.cover}
                      alt={selectedCourse.title}
                      className="w-full rounded-lg mb-4 bg-gray-100"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=center';
                      }}
                    />
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(selectedCourse.category)}`}>
                          {getCategoryIcon(selectedCourse.category)}
                          <span className="ml-2 capitalize">{selectedCourse.category}</span>
                        </span>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getLevelColor(selectedCourse.level)}`}>
                          {selectedCourse.level}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="w-4 h-4 mr-2" />
                        {selectedCourse.instructor}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        Starts {new Date(selectedCourse.startDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-2" />
                        {selectedCourse.duration} • {selectedCourse.sessions} sessions
                      </div>
                    </div>
                  </div>
                  
                  {/* Details and Enrollment */}
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">About This Course</h4>
                      <p className="text-gray-600">{selectedCourse.description}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">What You'll Learn</h4>
                      <ul className="space-y-2">
                        {selectedCourse.curriculum.map((item, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                            <span className="text-sm text-gray-600">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Course Features</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedCourse.features.map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-3xl font-bold text-primary-600">${selectedCourse.price}</span>
                          {selectedCourse.originalPrice > selectedCourse.price && (
                            <span className="text-lg text-gray-500 line-through ml-2">${selectedCourse.originalPrice}</span>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">{selectedCourse.students} students enrolled</div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            {selectedCourse.rating} rating
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleEnroll(selectedCourse)}
                          className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                        >
                          Enroll Now
                        </button>
                        <button
                          onClick={() => handlePhoneEnrollment(selectedCourse)}
                          className="bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
                        >
                          <Phone className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Enrollment Modal */}
        {showEnrollment && selectedCourse && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="text-center">
                  <GraduationCap className="mx-auto h-12 w-12 text-primary-600 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Enroll in {selectedCourse.title}</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    Ready to transform your skills? Complete your enrollment below.
                  </p>
                  
                  <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Course Price:</span>
                        <span className="text-lg font-bold text-primary-600">${selectedCourse.price}</span>
                      </div>
                      {selectedCourse.originalPrice > selectedCourse.price && (
                        <div className="flex justify-between items-center text-sm text-gray-500">
                          <span>Original Price:</span>
                          <span className="line-through">${selectedCourse.originalPrice}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        onClick={() => setShowEnrollment(false)}
                        className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          alert('Redirecting to payment...');
                          setShowEnrollment(false);
                        }}
                        className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700"
                      >
                        Proceed to Payment
                      </button>
                    </div>
                    
                    <div className="text-center">
                                              <button
                          onClick={() => handlePhoneEnrollment(selectedCourse)}
                          className="text-sm text-green-600 hover:text-green-700 flex items-center justify-center mx-auto"
                        >
                          <Phone className="w-4 h-4 mr-1" />
                          Have questions? Contact us via Phone
                        </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GeniusAcademy;
