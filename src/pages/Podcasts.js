import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
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
  Loader2,
  ArrowLeft
} from 'lucide-react';
import AudioPlayer from '../components/AudioPlayer';
import { isGoogleDriveLink } from '../utils/googleDrive';
import { podcastService } from '../services/apiService';

const Podcasts = () => {
  const location = useLocation();
  
  // Ensure this is the public podcasts page, not admin
  useEffect(() => {
    // Redirect if somehow on admin route
    if (location.pathname && location.pathname.includes('/admin/podcasts')) {
      console.warn('Warning: Public Podcasts component loaded but URL suggests admin route');
      // This shouldn't happen, but safeguard just in case
    }
  }, [location.pathname]);

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
  const [selectedCategory, setSelectedCategory] = useState(null); // Track selected category for episode list view
  const [lastPlayedPodcastId, setLastPlayedPodcastId] = useState(null); // Track last played podcast
  const [apiError, setApiError] = useState(null); // Track API connection errors

  // Use the same API base URL logic as apiService.js
  const DEFAULT_PROD_API = 'https://fog-backend-iyhz.onrender.com';
  const API_BASE = useMemo(() => {
    // Check for explicit environment variable (set at build time)
    const envApiUrl = process.env.REACT_APP_API_URL;
    if (envApiUrl && envApiUrl !== 'undefined' && envApiUrl.trim() !== '' && !envApiUrl.includes('api.familyofgreatness.com')) {
      return envApiUrl;
    }
    
    // Check if running locally
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:8000';
      }
    }
    
    // Always default to production API (Render backend)
    // Never use api.familyofgreatness.com or railway.app
    return DEFAULT_PROD_API;
  }, []);
  
  // Log API base for debugging
  useEffect(() => {
    console.log('🔧 Podcasts page API_BASE:', API_BASE);
  }, [API_BASE]);

  // Normalize backend category values to the fixed originals
  const CATEGORY_ALIASES = {
    'wisdom-for-teenagers': 'teens',
    'wisdom for teenagers': 'teens',
    'wisdom-for-ladies': 'wisdom-for-ladies',
    'beyond-dating-game': 'beyond-dating-game',
    'spiritual-development': 'spiritual-development',
    'relationships': 'relationships',
    'personal-development': 'personal-development',
    'wisdom-keys': 'wisdom-keys',
    'university-students': 'university-students',
  };
  const normalizeCategory = (value = '') => {
    if (!value) return value;
    const normalized = CATEGORY_ALIASES[value.toLowerCase()] || value.toLowerCase();
    console.log(`🔄 Normalizing category: "${value}" → "${normalized}"`);
    return normalized;
  };

  // Map categories to local podcast cover images (matching filenames exactly)
  // Using absolute paths from public folder for proper resolution on live site
  const getCategoryCoverImage = (category) => {
    const categoryMap = {
      'beyond-dating-game': '/images/podcasts/Beyond the dating Game.jpeg',
      'wisdom-for-ladies': '/images/podcasts/exceptional ladies.jpeg',
      'fog-gents': '/images/podcasts/FOG Gents.jpeg',
      'personal-development': '/images/podcasts/Personal developments .jpeg',
      'relationships': '/images/podcasts/wisdom for relationships .jpeg',
      'teens': '/images/podcasts/wisdom for teenagers.jpeg',
      'university-students': '/images/podcasts/wisdom for univeristy students.jpeg',
      'wisdom-keys': '/images/podcasts/Wisdom keys.jpeg',
      'spiritual-development': '/images/podcasts/Wisdom keys.jpeg', // Use Wisdom keys as default for spiritual
    };
    return categoryMap[category] || '/images/podcasts/Wisdom keys.jpeg'; // Default fallback
  };

  // Extract episode number from title (e.g., "Episode 01", "Episode 3", "Ep 1", "Esp.4")
  const getEpisodeNumber = (title = '') => {
    // Try to match "Episode 01", "Episode 1", "Ep 01", etc.
    const match = title.match(/(?:ep|eps|esp|episode)[\s.-]*#?\s*(\d+)/i);
    if (match) {
      return parseInt(match[1], 10);
    }
    // Also try to match at the start of title (e.g., "Episode 01: Title")
    const startMatch = title.match(/^episode\s+(\d+)/i);
    if (startMatch) {
      return parseInt(startMatch[1], 10);
    }
    return null;
  };

  // Sort episodes so earliest numbers (or dates) appear first
  const sortEpisodes = useCallback((list = []) => {
    return [...list].sort((a, b) => {
      const aNum = getEpisodeNumber(a.title);
      const bNum = getEpisodeNumber(b.title);

      if (aNum !== null && bNum !== null && aNum !== bNum) return aNum - bNum;
      if (aNum !== null && bNum === null) return -1;
      if (aNum === null && bNum !== null) return 1;

      const aDate = new Date(a.publishDate || a.created_at || 0);
      const bDate = new Date(b.publishDate || b.created_at || 0);
      if (!isNaN(aDate) && !isNaN(bDate) && aDate.getTime() !== bDate.getTime()) {
        return aDate - bDate;
      }

      return (a.id || 0) - (b.id || 0);
    });
  }, []);

  // Load last played podcast from localStorage
  useEffect(() => {
    const lastPlayed = localStorage.getItem('fog_last_played_podcast_id');
    if (lastPlayed) {
      setLastPlayedPodcastId(parseInt(lastPlayed, 10));
    }
  }, []);

  // Fetch podcasts from API
  useEffect(() => {
    const loadPodcasts = async () => {
      try {
        setLoading(true);
        console.log('🔍 Loading podcasts from API...', API_BASE);
        const data = await podcastService.getPodcasts();
        console.log(' Podcasts loaded:', data.length, 'items');
        console.log(' Sample podcast:', data[0] || 'No podcasts');
        
        // Ensure data is an array
        if (!Array.isArray(data)) {
          console.error(' Podcasts data is not an array:', data);
          setPodcasts([]);
          return;
        }
        
        if (data.length === 0) {
          console.warn('warning No podcasts returned from API');
          setPodcasts([]);
          return;
        }
        
        // Map API response to component format
        const mappedPodcasts = data.map(podcast => {
          const normalizedCategory = normalizeCategory(podcast.category);
          // Helper to build full URL
          const buildUrl = (url) => {
            if (!url || url === '#' || url === 'null' || url === 'undefined') return null;
            // If already a full URL, return as-is
            if (url.startsWith('http://') || url.startsWith('https://')) return url;
            // If relative URL, make it absolute
            if (url.startsWith('/')) {
              return `${API_BASE}${url}`;
            }
            // If it's a Google Drive link, return as-is
            if (url.includes('drive.google.com')) return url;
            // Otherwise, assume it's a relative path
            return `${API_BASE}/${url}`;
          };
          
          // Get cover image - use API cover if available, otherwise use category default
          let coverImage = buildUrl(podcast.cover);
          if (!coverImage || coverImage === '#') {
            coverImage = getCategoryCoverImage(normalizedCategory);
          }
          
          // Build audio URL - log for debugging
          const audioUrl = buildUrl(podcast.audio_url);
          if (!audioUrl) {
            console.warn(`⚠️ Podcast "${podcast.title}" (ID: ${podcast.id}) has no audio_url:`, podcast.audio_url);
          } else {
            console.log(`✅ Podcast "${podcast.title}" (ID: ${podcast.id}) audio URL:`, audioUrl);
          }
          
          return {
            id: podcast.id,
            title: podcast.title,
            host: podcast.host,
            type: podcast.type,
            category: normalizedCategory,
            description: podcast.description,
            cover: coverImage,
            duration: podcast.duration || 'N/A',
            publishDate: podcast.publish_date ? podcast.publish_date.split('T')[0] : new Date().toISOString().split('T')[0],
            isLive: podcast.is_live || false,
            isFree: podcast.is_free !== undefined ? podcast.is_free : true,
            rating: podcast.rating || 0,
            plays: podcast.plays || 0,
            tags: podcast.tags ? (typeof podcast.tags === 'string' ? podcast.tags.split(',').map(t => t.trim()) : podcast.tags) : [],
            audioUrl: audioUrl,
            transcript: podcast.transcript || ''
          };
        });
        // Sort so Episode 1 starts at the top
        const sortedPodcasts = sortEpisodes(mappedPodcasts);
        console.log('✅ Podcasts sorted:', sortedPodcasts.length, 'items');
        console.log('📁 Categories found:', [...new Set(sortedPodcasts.map(p => p.category))]);
        setPodcasts(sortedPodcasts);
      } catch (error) {
        console.error('❌ Error loading podcasts:', error);
        console.error('Error details:', {
          message: error.message,
          stack: error.stack,
          API_BASE
        });
        
        // Set error message for user
        const errorMessage = error.message || 'Unknown error';
        if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError') || errorMessage.includes('Cannot connect')) {
          setApiError(`Cannot connect to backend API at ${API_BASE}. Please check if the server is running.`);
        } else {
          setApiError(`Error loading podcasts: ${errorMessage}`);
        }
        
        // Fallback to empty array on error
        setPodcasts([]);
      } finally {
        setLoading(false);
      }
    };

    loadPodcasts();
  }, [API_BASE, sortEpisodes]);

  // Mock podcasts data - can include Google Drive links in audioUrl (fallback if API fails)
  const mockPodcasts = [
    {
      id: 1,
      title: 'Morning Devotion: Walking in Faith',
      host: 'Pastor Sarah Wilson',
      type: 'episode',
      category: 'spiritual-development',
      description: 'Start your day with this inspiring devotional message about walking in faith through life\'s challenges.',
      cover: '/images/podcasts/Wisdom%20keys.jpeg',
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
      cover: '/images/podcasts/Personal%20developments%20.jpeg',
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
      cover: '/images/podcasts/Wisdom%20keys.jpeg',
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
      cover: '/images/podcasts/wisdom%20for%20relationships%20.jpeg',
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
      cover: '/images/podcasts/Wisdom%20keys.jpeg',
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
      cover: '/images/podcasts/Beyond%20the%20dating%20Game.jpeg',
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
      cover: '/images/podcasts/exceptional%20ladies.jpeg',
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
      cover: '/images/podcasts/wisdom%20for%20teenagers.jpeg',
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
      cover: '/images/podcasts/wisdom%20for%20univeristy%20students.jpeg',
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

  // Original fixed categories - preserve these exactly
  const ORIGINAL_CATEGORIES = [
    { id: 'spiritual-development', name: 'Spiritual Development' },
    { id: 'relationships', name: 'Relationships' },
    { id: 'personal-development', name: 'Personal Development' },
    { id: 'wisdom-keys', name: 'Wisdom Keys' },
    { id: 'beyond-dating-game', name: 'Beyond The Dating Game' },
    { id: 'wisdom-for-ladies', name: 'Wisdom For Ladies' },
    { id: 'teens', name: 'Teens Podcasts' },
    { id: 'university-students', name: 'University Students' }
  ];

  // Group podcasts by original categories only
  const getCategoryInfo = () => {
    const categoryMap = {};
    
    // Initialize all original categories with default covers
    ORIGINAL_CATEGORIES.forEach(cat => {
      categoryMap[cat.id] = {
        id: cat.id,
        name: cat.name,
        podcasts: [],
        cover: getCategoryCoverImage(cat.id) // Use local image as default
      };
    });
    
    // Only add podcasts that belong to original categories (after normalization)
    podcasts.forEach(podcast => {
      if (!podcast.category) {
        console.warn(`⚠️ Podcast "${podcast.title}" (ID: ${podcast.id}) has no category`);
        return;
      }
      const normalized = normalizeCategory(podcast.category);
      
      if (categoryMap[normalized]) {
        const withNormalized = { ...podcast, category: normalized };
        categoryMap[normalized].podcasts.push(withNormalized);
        console.log(`✅ Added podcast "${podcast.title}" to category "${normalized}"`);
      } else {
        console.warn(`⚠️ Podcast "${podcast.title}" (ID: ${podcast.id}) category "${podcast.category}" (normalized: "${normalized}") doesn't match any original category`);
        console.warn(`   Available categories: ${Object.keys(categoryMap).join(', ')}`);
      }
    });
    
    // Sort podcasts within each category so Episode 1 shows first
    Object.values(categoryMap).forEach(cat => {
      cat.podcasts = sortEpisodes(cat.podcasts);
    });
    
    // Return only original categories (even if they have no podcasts)
    return ORIGINAL_CATEGORIES.map(cat => categoryMap[cat.id]);
  };

  const categories = getCategoryInfo();
  
  // Debug: Log category info
  useEffect(() => {
    if (podcasts.length > 0) {
      console.log('📂 Categories after grouping:', categories.map(c => ({
        id: c.id,
        name: c.name,
        count: c.podcasts.length
      })));
      console.log('📊 Total podcasts loaded:', podcasts.length);
      console.log('📋 Podcast categories found:', [...new Set(podcasts.map(p => p.category))]);
      console.log('🔍 Category mapping:', categories.map(c => ({
        id: c.id,
        podcasts: c.podcasts.map(p => ({ id: p.id, title: p.title, category: p.category }))
      })));
    }
  }, [podcasts, categories]);
  
  // Get episodes for selected category
  const getCategoryEpisodes = () => {
    if (!selectedCategory) return [];
    const category = categories.find(cat => cat.id === selectedCategory);
    return category ? category.podcasts : [];
  };

  const handlePlay = (podcast) => {
    setSelectedPodcast(podcast);
    setIsPlaying(true);
    
    // Store last played podcast
    if (podcast.id) {
      localStorage.setItem('fog_last_played_podcast_id', podcast.id.toString());
      setLastPlayedPodcastId(podcast.id);
    }
    
    // Always set playing podcast - AudioPlayer will handle invalid URLs gracefully
    console.log('Setting playing podcast:', podcast.title, 'audioUrl:', podcast.audioUrl);
    setPlayingPodcast(podcast);
    
    // Show warning if no audio URL, but still set the podcast so player shows
    if (!podcast.audioUrl || podcast.audioUrl === '#' || podcast.audioUrl === 'null' || podcast.audioUrl === 'undefined') {
      console.warn('No audio URL available for podcast:', podcast.title, 'audioUrl:', podcast.audioUrl);
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

  // If a category is selected, show episode list view
  if (selectedCategory) {
    const categoryEpisodes = getCategoryEpisodes();
    const selectedCategoryInfo = categories.find(cat => cat.id === selectedCategory);
    
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <button
            onClick={() => setSelectedCategory(null)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            <span>Back to Categories</span>
          </button>

          {/* Category Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {selectedCategoryInfo ? selectedCategoryInfo.name : 'Podcasts'} Messages & Audio Sermons
            </h1>
            <p className="text-gray-600">{categoryEpisodes.length} episodes available</p>
          </div>

          {/* Episode List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
              <span className="ml-3 text-gray-600">Loading episodes...</span>
            </div>
          ) : apiError ? (
            <div className="text-center py-12">
              <Headphones className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Unable to load episodes due to API connection error</p>
              <p className="text-sm text-gray-500 mt-2">Please check the backend server status</p>
              <button
                onClick={() => {
                  setApiError(null);
                  window.location.reload();
                }}
                className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Retry Connection
              </button>
            </div>
          ) : categoryEpisodes.length === 0 ? (
            <div className="text-center py-12">
              <Headphones className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No episodes found in this category</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <ul className="space-y-3">
                {categoryEpisodes.map((podcast, index) => {
                  const isLastPlayed = lastPlayedPodcastId === podcast.id;
                  return (
                    <li
                      key={podcast.id}
                      className={`flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0 px-3 rounded transition-colors group ${
                        isLastPlayed 
                          ? 'bg-blue-50 border-l-4 border-l-blue-500' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div 
                        className="flex items-center flex-1 min-w-0 cursor-pointer"
                        onClick={() => handlePlay(podcast)}
                      >
                        <span className={`text-lg font-semibold mr-4 flex-shrink-0 ${
                          isLastPlayed ? 'text-blue-700' : 'text-gray-700'
                        }`}>
                          {index + 1}.
                        </span>
                        <span className={`text-base underline flex-1 truncate ${
                          isLastPlayed ? 'text-blue-900 font-medium' : 'text-gray-900'
                        }`}>
                          {podcast.title}
                          {isLastPlayed && (
                            <span className="ml-2 text-xs text-blue-600 font-normal">(Last played)</span>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 ml-4 flex-shrink-0">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(podcast);
                          }}
                          className={`p-2 rounded-lg transition-colors ${
                            isLastPlayed
                              ? 'text-blue-600 hover:text-blue-700 hover:bg-blue-100'
                              : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                          }`}
                          title="Download podcast"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

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
    );
  }

  // Default view: Show category covers
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">FOG Podcasts</h1>
          <p className="mt-2 text-gray-600">Listen to inspiring messages, wisdom keys, and spiritual content across all life stages</p>
        </div>

        {/* Search */}
        {!selectedCategory && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
            <div className="relative">
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
          </div>
        )}

        {/* API Error Message */}
        {apiError && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-red-800">API Connection Error</h3>
                <p className="mt-1 text-sm text-red-700">{apiError}</p>
                <button
                  onClick={() => {
                    setApiError(null);
                    window.location.reload();
                  }}
                  className="mt-2 text-sm font-medium text-red-800 hover:text-red-900 underline"
                >
                  Retry Connection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Category Covers Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Podcast Categories</h2>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary-600 animate-spin" />
              <span className="ml-3 text-gray-600">Loading categories...</span>
            </div>
          ) : apiError ? (
            <div className="text-center py-12">
              <Headphones className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Unable to load podcasts due to API connection error</p>
              <p className="text-sm text-gray-500 mt-2">Please check the backend server status</p>
            </div>
          ) : categories.filter(c => c.podcasts.length > 0).length === 0 ? (
            <div className="text-center py-12">
              <Headphones className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {podcasts.length > 0 
                  ? `Found ${podcasts.length} podcasts but no matching categories. Check console for details.`
                  : 'No podcasts found. Please check the API connection.'}
              </p>
              {podcasts.length > 0 && (
                <div className="mt-4 text-sm text-gray-500">
                  <p>Debug info: {podcasts.length} podcasts loaded</p>
                  <p>Categories: {categories.map(c => `${c.name} (${c.podcasts.length})`).join(', ')}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories
                .filter(category => {
                  // Only show categories that have podcasts
                  if (category.podcasts.length === 0) return false;
                  
                  // Filter by search term if provided
                  if (searchTerm) {
                    return category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           category.podcasts.some(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
                  }
                  return true;
                })
                .map((category) => (
                  <div
                    key={category.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer group"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {/* Category Cover Image */}
                    <div className="relative h-64 bg-gray-100">
                      {category.cover ? (
                        <img
                          src={category.cover}
                          alt={category.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          onError={(e) => {
                            // Fallback to category default image
                            e.target.src = getCategoryCoverImage(category.id);
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
                          <Headphones className="w-16 h-16 text-primary-600" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Category Info */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {category.podcasts.length} {category.podcasts.length === 1 ? 'episode' : 'episodes'}
                      </p>
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
                        // Fallback to category default image
                        e.target.src = getCategoryCoverImage(selectedPodcast.category);
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
