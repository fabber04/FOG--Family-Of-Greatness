import React, { useState, useEffect } from 'react';
import { 
  Headphones, 
  Search, 
  Filter, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2,
  Heart,
  MessageCircle,
  Share2,
  Clock,
  Calendar,
  User,
  Tag,
  Radio,
  Download,
  Bookmark,
  Star,
  BookOpen,
  Users,
  GraduationCap,
  Loader2
} from 'lucide-react';
import AudioPlayer from '../components/AudioPlayer';
import { isGoogleDriveLink } from '../utils/googleDrive';
import { podcastService } from '../services/apiService';

const Podcasts = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedPodcast, setSelectedPodcast] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playingPodcast, setPlayingPodcast] = useState(null);
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch podcasts from API
  useEffect(() => {
    const loadPodcasts = async () => {
      try {
        setLoading(true);
        const data = await podcastService.getPodcasts();
        // Map API response to component format
        const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';
        const mappedPodcasts = data.map(podcast => {
          // Helper to build full URL
          const buildUrl = (url) => {
            if (!url || url === '#') return '#';
            if (url.startsWith('http')) return url;
            return `${API_BASE}${url}`;
          };
          
          return {
            id: podcast.id,
            title: podcast.title,
            host: podcast.host,
            type: podcast.type,
            category: podcast.category,
            description: podcast.description,
            cover: buildUrl(podcast.cover),
            duration: podcast.duration || 'N/A',
            publishDate: podcast.publish_date ? podcast.publish_date.split('T')[0] : new Date().toISOString().split('T')[0],
            isLive: podcast.is_live || false,
            isFree: podcast.is_free !== undefined ? podcast.is_free : true,
            rating: podcast.rating || 0,
            plays: podcast.plays || 0,
            tags: podcast.tags ? (typeof podcast.tags === 'string' ? podcast.tags.split(',').map(t => t.trim()) : podcast.tags) : [],
            audioUrl: buildUrl(podcast.audio_url),
            transcript: podcast.transcript || ''
          };
        });
        // Sort podcasts by episode number (extract number from title)
        const sortedPodcasts = mappedPodcasts.sort((a, b) => {
          // Extract episode number from title (e.g., "Eps 01" -> 1, "Esp 02" -> 2)
          const getEpisodeNumber = (title) => {
            const match = title.match(/(?:Eps?|Esp)\s*(\d+)/i);
            return match ? parseInt(match[1], 10) : 9999; // Put non-matching at end
          };
          return getEpisodeNumber(a.title) - getEpisodeNumber(b.title);
        });
        
        setPodcasts(sortedPodcasts);
      } catch (error) {
        console.error('Error loading podcasts:', error);
        // Fallback to empty array on error
        setPodcasts([]);
      } finally {
        setLoading(false);
      }
    };

    loadPodcasts();
  }, []);

  // Mock podcasts data - can include Google Drive links in audioUrl (fallback if API fails)
  const mockPodcasts = [
    {
      id: 1,
      title: 'Morning Devotion: Walking in Faith',
      host: 'Pastor Sarah Wilson',
      type: 'episode',
      category: 'spiritual-development',
      description: 'Start your day with this inspiring devotional message about walking in faith through life\'s challenges.',
      cover: '/FOG--Family-Of-Greatness/images/podcasts/Wisdom%20keys.jpeg',
      duration: '15:30',
      publishDate: '2024-01-15',
      isLive: false,
      isFree: true,
      rating: 4.8,
      plays: 1250,
      tags: ['spiritual', 'morning', 'faith', 'inspiration'],
      audioUrl: '#',
      transcript: 'Welcome to Morning Devotion. Today we\'ll be discussing how to walk in faith...'
    },
    {
      id: 2,
      title: 'Personal Growth: Overcoming Life\'s Obstacles',
      host: 'Coach Noble Masvingise',
      type: 'episode',
      category: 'personal-development',
      description: 'Learn practical strategies for personal growth and overcoming life\'s challenges with biblical wisdom.',
      cover: '/FOG--Family-Of-Greatness/images/podcasts/Personal%20developments%20.jpeg',
      duration: '45:20',
      publishDate: '2024-01-14',
      isLive: false,
      isFree: true,
      rating: 4.6,
      plays: 890,
      tags: ['personal', 'growth', 'overcoming', 'challenges'],
      audioUrl: '#',
      transcript: 'Welcome to Personal Growth. Today we\'re discussing how to overcome life\'s obstacles...'
    },
    {
      id: 3,
      title: 'Live: Prayer Sessions',
      host: 'FOG Prayer Team',
      type: 'live',
      category: 'spiritual-development',
      description: 'Join us live prayer sessions every Monday, Wednesday and Friday.',
      cover: '/FOG--Family-Of-Greatness/images/podcasts/Wisdom%20keys.jpeg',
      duration: 'Live',
      publishDate: '2024-01-15',
      isLive: true,
      isFree: true,
      rating: 4.9,
      plays: 2100,
      tags: ['live', 'prayer', 'service', 'community'],
      audioUrl: '#',
      transcript: 'Welcome to our live prayer sessions...'
    },
    {
      id: 4,
      title: 'Relationship Wisdom: Building Strong Marriages',
      host: 'Dr. Emily Brown',
      type: 'episode',
      category: 'relationships',
      description: 'Biblical principles for building and maintaining strong, healthy marriages.',
      cover: '/FOG--Family-Of-Greatness/images/podcasts/wisdom%20for%20relationships%20.jpeg',
      duration: '32:15',
      publishDate: '2024-01-13',
      isLive: false,
      isFree: true,
      rating: 4.7,
      plays: 1560,
      tags: ['relationships', 'marriage', 'biblical', 'wisdom'],
      audioUrl: '#',
      transcript: 'Today we\'ll explore biblical principles for building strong marriages...'
    },
    {
      id: 5,
      title: 'Wisdom Keys: Unlocking Life\'s Secrets',
      host: 'Pastor Mike Johnson',
      type: 'series',
      category: 'wisdom-keys',
      description: 'Discover the keys to wisdom that unlock success, purpose, and fulfillment in life.',
      cover: '/FOG--Family-Of-Greatness/images/podcasts/Wisdom%20keys.jpeg',
      duration: 'Series',
      publishDate: '2024-01-10',
      isLive: false,
      isFree: true,
      rating: 4.5,
      plays: 3400,
      tags: ['wisdom', 'keys', 'success', 'purpose'],
      audioUrl: '#',
      transcript: 'Welcome to Wisdom Keys. Today we\'ll unlock the secrets to...'
    },
    {
      id: 6,
      title: 'Beyond The Dating Game: Finding True Love',
      host: 'Relationship Experts',
      type: 'episode',
      category: 'beyond-dating-game',
      description: 'Move beyond superficial dating and discover how to build meaningful, lasting relationships.',
      cover: '/FOG--Family-Of-Greatness/images/podcasts/Beyond%20the%20dating%20Game.jpeg',
      duration: '38:45',
      publishDate: '2024-01-14',
      isLive: false,
      isFree: true,
      rating: 4.8,
      plays: 1800,
      tags: ['dating', 'relationships', 'love', 'meaningful'],
      audioUrl: '#',
      transcript: 'Welcome to Beyond The Dating Game. Today we\'ll explore...'
    },
    {
      id: 7,
      title: 'Wisdom For Ladies: Embracing Your Purpose',
      host: 'Women\'s Ministry Team',
      type: 'episode',
      category: 'wisdom-for-ladies',
      description: 'Empowering women to discover and embrace their God-given purpose and potential.',
      cover: '/FOG--Family-Of-Greatness/images/podcasts/exceptional%20ladies.jpeg',
      duration: '42:15',
      publishDate: '2024-01-12',
      isLive: false,
      isFree: true,
      rating: 4.7,
      plays: 2100,
      tags: ['women', 'purpose', 'empowerment', 'wisdom'],
      audioUrl: '#',
      transcript: 'Welcome to Wisdom For Ladies. Today we\'ll discuss...'
    },
    {
      id: 8,
      title: 'Teen Talk: Navigating Life\'s Challenges',
      host: 'Youth Ministry Leaders',
      type: 'episode',
      category: 'teens',
      description: 'Real talk for teenagers about faith, relationships, school, and making wise choices.',
      cover: '/FOG--Family-Of-Greatness/images/podcasts/wisdom%20for%20teenagers.jpeg',
      duration: '28:30',
      publishDate: '2024-01-11',
      isLive: false,
      isFree: true,
      rating: 4.6,
      plays: 1650,
      tags: ['teens', 'youth', 'challenges', 'faith'],
      audioUrl: '#',
      transcript: 'Welcome to Teen Talk. Today we\'re discussing...'
    },
    {
      id: 9,
      title: 'University Life: Balancing Faith and Studies',
      host: 'Campus Ministry Team',
      type: 'episode',
      category: 'university-students',
      description: 'Practical advice for university students on maintaining faith while pursuing academic excellence.',
      cover: '/FOG--Family-Of-Greatness/images/podcasts/wisdom%20for%20univeristy%20students.jpeg',
      duration: '35:20',
      publishDate: '2024-01-09',
      isLive: false,
      isFree: true,
      rating: 4.5,
      plays: 1200,
      tags: ['university', 'students', 'faith', 'academics'],
      audioUrl: '#',
      transcript: 'Welcome to University Life. Today we\'ll explore...'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Categories', count: podcasts.length },
    { id: 'spiritual-development', name: 'Spiritual Development', count: podcasts.filter(podcast => podcast.category === 'spiritual-development').length },
    { id: 'relationships', name: 'Relationships', count: podcasts.filter(podcast => podcast.category === 'relationships').length },
    { id: 'personal-development', name: 'Personal Development', count: podcasts.filter(podcast => podcast.category === 'personal-development').length },
    { id: 'wisdom-keys', name: 'Wisdom Keys', count: podcasts.filter(podcast => podcast.category === 'wisdom-keys').length },
    { id: 'beyond-dating-game', name: 'Beyond The Dating Game', count: podcasts.filter(podcast => podcast.category === 'beyond-dating-game').length },
    { id: 'wisdom-for-ladies', name: 'Wisdom For Ladies', count: podcasts.filter(podcast => podcast.category === 'wisdom-for-ladies').length },
    { id: 'teens', name: 'Teens Podcasts', count: podcasts.filter(podcast => podcast.category === 'teens').length },
    { id: 'university-students', name: 'University Students', count: podcasts.filter(podcast => podcast.category === 'university-students').length }
  ];

  const types = [
    { id: 'all', name: 'All Types', count: podcasts.length },
    { id: 'episode', name: 'Episodes', count: podcasts.filter(podcast => podcast.type === 'episode').length },
    { id: 'live', name: 'Live', count: podcasts.filter(podcast => podcast.type === 'live').length },
    { id: 'series', name: 'Series', count: podcasts.filter(podcast => podcast.type === 'series').length }
  ];

  const filteredPodcasts = podcasts.filter(podcast => {
    const matchesSearch = podcast.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         podcast.host.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         podcast.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || podcast.category === filterCategory;
    const matchesType = filterType === 'all' || podcast.type === filterType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const handlePlay = (podcast) => {
    setSelectedPodcast(podcast);
    setIsPlaying(true);
    
    // If podcast has a valid audio URL (not '#'), use the audio player
    if (podcast.audioUrl && podcast.audioUrl !== '#') {
      setPlayingPodcast(podcast);
    } else {
      // Show alert if no audio URL
      alert(`No audio available for: ${podcast.title}`);
    }
  };

  const handleClosePlayer = () => {
    setPlayingPodcast(null);
    setIsPlaying(false);
  };

  const handleDownload = (podcast) => {
    if (!podcast.audioUrl || podcast.audioUrl === '#') {
      alert('No audio available for download');
      return;
    }

    // Get download URL
    const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8000';
    let downloadUrl = podcast.audioUrl;
    
    // Convert relative URL to absolute if needed
    if (downloadUrl.startsWith('/')) {
      downloadUrl = `${API_BASE}${downloadUrl}`;
    } else if (!downloadUrl.startsWith('http')) {
      downloadUrl = `${API_BASE}/${downloadUrl}`;
    }
    
    // Extract filename from URL (handle URL encoding)
    const urlPath = podcast.audioUrl.includes('/') ? podcast.audioUrl.split('/').pop() : podcast.audioUrl;
    const filename = decodeURIComponent(urlPath) || `${podcast.title || 'podcast'}.${podcast.audioUrl.split('.').pop() || 'm4a'}`;
    
    // Create temporary link and trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePurchase = (podcast) => {
    // All podcasts are free - no payment needed
    handlePlay(podcast);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'episode':
        return <Headphones className="w-5 h-5" />;
      case 'live':
        return <Radio className="w-5 h-5" />;
      case 'series':
        return <Bookmark className="w-5 h-5" />;
      default:
        return <Headphones className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'episode':
        return 'bg-blue-100 text-blue-800';
      case 'live':
        return 'bg-red-100 text-red-800';
      case 'series':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'spiritual-development':
        return 'bg-blue-100 text-blue-800';
      case 'relationships':
        return 'bg-pink-100 text-pink-800';
      case 'personal-development':
        return 'bg-green-100 text-green-800';
      case 'wisdom-keys':
        return 'bg-yellow-100 text-yellow-800';
      case 'beyond-dating-game':
        return 'bg-purple-100 text-purple-800';
      case 'wisdom-for-ladies':
        return 'bg-rose-100 text-rose-800';
      case 'teens':
        return 'bg-indigo-100 text-indigo-800';
      case 'university-students':
        return 'bg-cyan-100 text-cyan-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'spiritual-development':
        return <Star className="w-3 h-3" />;
      case 'relationships':
        return <Heart className="w-3 h-3" />;
      case 'personal-development':
        return <User className="w-3 h-3" />;
      case 'wisdom-keys':
        return <BookOpen className="w-3 h-3" />;
      case 'beyond-dating-game':
        return <MessageCircle className="w-3 h-3" />;
      case 'wisdom-for-ladies':
        return <Heart className="w-3 h-3" />;
      case 'teens':
        return <Users className="w-3 h-3" />;
      case 'university-students':
        return <GraduationCap className="w-3 h-3" />;
      default:
        return <Headphones className="w-3 h-3" />;
    }
  };

  const formatTime = (time) => {
    if (time === 'Live' || time === 'Series') return time;
    return time;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">FOG Podcasts</h1>
          <p className="mt-2 text-gray-600">Listen to inspiring messages, wisdom keys, and spiritual content across all life stages</p>
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
                placeholder="Search podcasts..."
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

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {types.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name} ({type.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Featured Categories Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Featured Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.filter(cat => cat.id !== 'all').map((category) => (
              <div 
                key={category.id} 
                className={`rounded-xl p-4 shadow-sm border transition-all duration-200 cursor-pointer hover:scale-105 ${
                  filterCategory === category.id 
                    ? 'bg-primary-50 border-primary-300 shadow-md' 
                    : 'bg-white border-gray-200 hover:shadow-md'
                }`}
                onClick={() => {
                  setFilterCategory(category.id);
                  // Scroll to podcasts section after a short delay
                  setTimeout(() => {
                    const podcastsSection = document.getElementById('podcasts-section');
                    if (podcastsSection) {
                      podcastsSection.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'start'
                      });
                    }
                  }, 100);
                }}
              >
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 ${
                    category.id === 'spiritual-development' ? 'bg-blue-100' :
                    category.id === 'relationships' ? 'bg-pink-100' :
                    category.id === 'personal-development' ? 'bg-green-100' :
                    category.id === 'wisdom-keys' ? 'bg-yellow-100' :
                    category.id === 'beyond-dating-game' ? 'bg-purple-100' :
                    category.id === 'wisdom-for-ladies' ? 'bg-rose-100' :
                    category.id === 'teens' ? 'bg-indigo-100' :
                    category.id === 'university-students' ? 'bg-cyan-100' : 'bg-gray-100'
                  }`}>
                    {(() => {
                      switch (category.id) {
                        case 'spiritual-development':
                          return <Star className="w-6 h-6 text-blue-600" />;
                        case 'relationships':
                          return <Heart className="w-6 h-6 text-pink-600" />;
                        case 'personal-development':
                          return <User className="w-6 h-6 text-green-600" />;
                        case 'wisdom-keys':
                          return <BookOpen className="w-6 h-6 text-yellow-600" />;
                        case 'beyond-dating-game':
                          return <MessageCircle className="w-6 h-6 text-purple-600" />;
                        case 'wisdom-for-ladies':
                          return <Heart className="w-6 h-6 text-rose-600" />;
                        case 'teens':
                          return <Users className="w-6 h-6 text-indigo-600" />;
                        case 'university-students':
                          return <GraduationCap className="w-6 h-6 text-cyan-600" />;
                        default:
                          return <Headphones className="w-6 h-6 text-gray-600" />;
                      }
                    })()}
                  </div>
                  <h3 className="text-sm font-medium text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-xs text-gray-500">{category.count} episodes</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Streams Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Live Now</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {podcasts.filter(podcast => podcast.isLive).map((podcast) => (
              <div key={podcast.id} className="bg-white rounded-xl shadow-sm border border-red-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div className="relative">
                  <img
                    src={podcast.cover}
                    alt={podcast.title}
                    className="w-full h-48 object-cover bg-gray-100"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=center';
                    }}
                  />
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                          <Radio className="w-3 h-3 mr-1" />
                    LIVE
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <button
                      onClick={() => handlePlay(podcast)}
                      className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 transition-colors duration-200"
                    >
                      <Radio className="w-8 h-8" />
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{podcast.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{podcast.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {podcast.host}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatTime(podcast.duration)}
                    </div>
                  </div>
                  <div className="flex items-center justify-end">
                    <button
                      onClick={() => handlePlay(podcast)}
                      className="flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                    >
                      <Radio className="w-4 h-4 mr-2" />
                      Join Live
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Podcasts Grid */}
        <div id="podcasts-section" className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">All Podcasts</h2>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
              <span className="ml-3 text-gray-600">Loading podcasts...</span>
            </div>
          ) : filteredPodcasts.filter(podcast => !podcast.isLive).length === 0 ? (
            <div className="text-center py-12">
              <Headphones className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No podcasts found</p>
            </div>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPodcasts.filter(podcast => !podcast.isLive).map((podcast) => (
              <div key={podcast.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
                {/* Cover Image */}
                <div className="relative">
                  <img
                    src={podcast.cover}
                    alt={podcast.title}
                    className="w-full h-48 object-cover bg-gray-100"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=center';
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(podcast.type)}`}>
                      {getTypeIcon(podcast.type)}
                      <span className="ml-1 capitalize">{podcast.type}</span>
                    </span>
                  </div>
                  <div className="absolute top-2 left-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(podcast.category)}`}>
                      {getCategoryIcon(podcast.category)}
                      <span className="ml-1 text-xs">
                        {podcast.category.replace('-', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      </span>
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handlePlay(podcast)}
                      className="bg-white hover:bg-gray-100 text-gray-900 rounded-full p-3 transition-colors duration-200"
                    >
                      <Play className="w-6 h-6" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{podcast.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">{podcast.description}</p>
                  
                  {/* Host and Duration */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {podcast.host}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatTime(podcast.duration)}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 text-red-400 mr-1" />
                      {podcast.rating}
                    </div>
                    <div className="flex items-center">
                      <Play className="w-4 h-4 mr-1" />
                      {podcast.plays}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {podcast.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePlay(podcast)}
                      className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Play
                    </button>
                    
                    <button
                      onClick={() => handleDownload(podcast)}
                      className="px-3 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      title="Download podcast"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    
                    <button className="px-3 py-2 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          )}
        </div>

        {/* Podcast Player Modal */}
        {selectedPodcast && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-medium text-gray-900">{selectedPodcast.title}</h3>
                  <button
                    onClick={() => setSelectedPodcast(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Cover */}
                  <div>
                    <img
                      src={selectedPodcast.cover}
                      alt={selectedPodcast.title}
                      className="w-full rounded-lg bg-gray-100"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=center';
                      }}
                    />
                  </div>
                  
                  {/* Details */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">{selectedPodcast.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="w-4 h-4 mr-2" />
                        {selectedPodcast.host}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatTime(selectedPodcast.duration)}
                      </div>
                      <div className="flex items-center">
                        <Play className="w-4 h-4 mr-1" />
                        {selectedPodcast.plays} plays
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedPodcast.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-4 flex gap-2">
                      <button
                        onClick={() => handlePlay(selectedPodcast)}
                        className="flex-1 flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors"
                      >
                        <Play className="w-4 h-4 mr-2" />
                        Play Now
                      </button>
                      <button
                        onClick={() => handleDownload(selectedPodcast)}
                        className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                        title="Download podcast"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Audio Player */}
        {playingPodcast && (
          <AudioPlayer
            audioUrl={playingPodcast.audioUrl}
            podcastId={playingPodcast.id}
            podcastTitle={playingPodcast.title}
            podcastCover={playingPodcast.cover}
            onClose={handleClosePlayer}
          />
        )}
      </div>
    </div>
  );
};

export default Podcasts;
