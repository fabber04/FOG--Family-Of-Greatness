// API Service for Backend Communication
// This service handles all communication with the Python FastAPI backend

// Pick the right API base depending on environment.
// - REACT_APP_API_URL: explicit override (build time)
// - localhost/127.0.0.1: local dev
// - otherwise: deployed Render API
const DEFAULT_PROD_API = 'https://fog-backend-iyhz.onrender.com';

// Get API URL - React env vars are replaced at build time
// If REACT_APP_API_URL is not set, it becomes undefined, so we check for that
const getApiBaseUrl = () => {
  // Check for explicit environment variable (set at build time)
  // In production builds, undefined env vars become the string "undefined"
  const envApiUrl = process.env.REACT_APP_API_URL;
  if (envApiUrl && envApiUrl !== 'undefined' && envApiUrl.trim() !== '') {
    return envApiUrl;
  }
  
  // Check if running locally
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8000';
    }
  }
  
  // Always default to production API
  return DEFAULT_PROD_API;
};

const API_BASE_URL = getApiBaseUrl();

// Log API URL for debugging (always log in production to help diagnose issues)
if (typeof window !== 'undefined') {
  console.log('🔧 API_BASE_URL:', API_BASE_URL);
  console.log('🔧 REACT_APP_API_URL env:', process.env.REACT_APP_API_URL);
  console.log('🔧 Hostname:', window.location.hostname);
}

// Helper function to get auth token
const getAuthToken = async () => {
  try {
    // Check localStorage for backend JWT token
    const user = localStorage.getItem('fog_user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.backendToken || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Helper function for API requests with fallback
const apiRequest = async (endpoint, options = {}) => {
  const token = await getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Ensure we have a valid API URL - always fallback to production API
  let apiUrl = API_BASE_URL || DEFAULT_PROD_API;
  if (!apiUrl || apiUrl === 'undefined' || apiUrl.trim() === '') {
    console.warn('⚠️ API_BASE_URL is empty, using default:', DEFAULT_PROD_API);
    apiUrl = DEFAULT_PROD_API;
  }
  const fallbackUrl = DEFAULT_PROD_API;
  
  // Ensure endpoint starts with /
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const fullUrl = `${apiUrl}${normalizedEndpoint}`;
  
  // Always log the full URL being requested (helps debug production issues)
  console.log('🌐 API Request:', fullUrl);
  
  try {
    let response = await fetch(fullUrl, {
      ...options,
      headers,
    });

    // If primary URL fails with 502/503/504, try fallback
    if ((response.status === 502 || response.status === 503 || response.status === 504) && 
        apiUrl !== fallbackUrl && 
        process.env.REACT_APP_API_URL) {
      console.warn(`Primary API (${apiUrl}) returned ${response.status}, trying fallback...`);
      apiUrl = fallbackUrl;
      const fallbackFullUrl = `${apiUrl}${normalizedEndpoint}`;
      response = await fetch(fallbackFullUrl, {
        ...options,
        headers,
      });
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: response.statusText }));
      
      // Handle 401 Unauthorized - token might be expired
      if (response.status === 401) {
        // Token expired - user needs to re-authenticate
        console.warn('Authentication token expired');
      }
      
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    // If it's a network error and we haven't tried fallback, try it
    if ((error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) && 
        apiUrl !== fallbackUrl && 
        process.env.REACT_APP_API_URL) {
      console.warn('Primary API failed, trying fallback URL...');
      try {
        const fallbackFullUrl = `${fallbackUrl}${normalizedEndpoint}`;
        const fallbackResponse = await fetch(fallbackFullUrl, {
          ...options,
          headers,
        });
        if (fallbackResponse.ok) {
          return await fallbackResponse.json();
        }
      } catch (fallbackError) {
        console.error('Fallback API also failed:', fallbackError);
      }
    }
    // If it's a network error, provide a helpful message
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Cannot connect to backend API. Please ensure the server is running at ' + apiUrl);
    }
    throw error;
  }
};

// Member Management API
export const memberService = {
  // Get all members
  async getMembers(skip = 0, limit = 100) {
    return apiRequest(`/api/users/?skip=${skip}&limit=${limit}`);
  },

  // Get member by ID
  async getMember(userId) {
    return apiRequest(`/api/users/${userId}`);
  },

  // Create new member (admin only)
  async createMember(memberData) {
    return apiRequest('/api/users/', {
      method: 'POST',
      body: JSON.stringify(memberData),
    });
  },

  // Update member (admin only)
  async updateMember(userId, memberData) {
    return apiRequest(`/api/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(memberData),
    });
  },

  // Delete member (admin only)
  async deleteMember(userId) {
    return apiRequest(`/api/users/${userId}`, {
      method: 'DELETE',
    });
  },

  // Get user statistics (admin only)
  async getUserStats() {
    return apiRequest('/api/users/stats/overview');
  },
};

// Library API
export const libraryService = {
  // Get all library items
  async getLibraryItems(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/api/library/?${queryParams}`);
  },

  // Get library item by ID
  async getLibraryItem(itemId) {
    return apiRequest(`/api/library/${itemId}`);
  },

  // Create library item (admin only)
  async createLibraryItem(itemData) {
    return apiRequest('/api/library/', {
      method: 'POST',
      body: JSON.stringify(itemData),
    });
  },

  // Update library item (admin only)
  async updateLibraryItem(itemId, itemData) {
    return apiRequest(`/api/library/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify(itemData),
    });
  },

  // Delete library item (admin only)
  async deleteLibraryItem(itemId) {
    return apiRequest(`/api/library/${itemId}`, {
      method: 'DELETE',
    });
  },
};

// Prayer Requests API
export const prayerService = {
  // Get prayer requests
  async getPrayerRequests(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/api/prayer/?${queryParams}`);
  },

  // Get prayer request by ID
  async getPrayerRequest(requestId) {
    return apiRequest(`/api/prayer/${requestId}`);
  },

  // Create prayer request
  async createPrayerRequest(requestData) {
    return apiRequest('/api/prayer/', {
      method: 'POST',
      body: JSON.stringify(requestData),
    });
  },

  // Update prayer request
  async updatePrayerRequest(requestId, requestData) {
    return apiRequest(`/api/prayer/${requestId}`, {
      method: 'PUT',
      body: JSON.stringify(requestData),
    });
  },

  // Delete prayer request
  async deletePrayerRequest(requestId) {
    return apiRequest(`/api/prayer/${requestId}`, {
      method: 'DELETE',
    });
  },

  // Update prayer request status (admin only)
  async updatePrayerStatus(requestId, status) {
    return apiRequest(`/api/prayer/${requestId}/status`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  },

  // Get prayer statistics (admin only)
  async getPrayerStats() {
    return apiRequest('/api/prayer/stats/overview');
  },
};

// User Sync (Firebase removed - kept for backward compatibility)
export const syncFirebaseUser = async (token, userData = {}) => {
  console.warn('syncFirebaseUser is deprecated - Firebase has been removed');
  return null;
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return await response.json();
  } catch (error) {
    console.error('Health check failed:', error);
    return { status: 'unavailable', message: 'Backend API is not available' };
  }
};

// Events API
export const eventService = {
  async getEvents(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/api/events/?${queryParams}`);
  },

  async getEvent(eventId) {
    return apiRequest(`/api/events/${eventId}`);
  },

  async createEvent(eventData) {
    return apiRequest('/api/events/', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  async updateEvent(eventId, eventData) {
    return apiRequest(`/api/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  },

  async deleteEvent(eventId) {
    return apiRequest(`/api/events/${eventId}`, {
      method: 'DELETE',
    });
  },

  async uploadEventImage(file) {
    const token = await getAuthToken();
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/api/events/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },
};

// Podcasts API
export const podcastService = {
  async getPodcasts(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/api/podcasts/?${queryParams}`);
  },

  async getPodcast(podcastId) {
    return apiRequest(`/api/podcasts/${podcastId}`);
  },

  async createPodcast(podcastData) {
    return apiRequest('/api/podcasts/', {
      method: 'POST',
      body: JSON.stringify(podcastData),
    });
  },

  async updatePodcast(podcastId, podcastData) {
    return apiRequest(`/api/podcasts/${podcastId}`, {
      method: 'PUT',
      body: JSON.stringify(podcastData),
    });
  },

  async deletePodcast(podcastId) {
    return apiRequest(`/api/podcasts/${podcastId}`, {
      method: 'DELETE',
    });
  },

  async uploadPodcastCover(file) {
    const token = await getAuthToken();
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/api/podcasts/upload-cover`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },

  async uploadPodcastAudio(file) {
    const token = await getAuthToken();
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/api/podcasts/upload-audio`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },
};

// Courses API
export const courseService = {
  async getCourses(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/api/courses/?${queryParams}`);
  },

  async getCourse(courseId) {
    return apiRequest(`/api/courses/${courseId}`);
  },

  async createCourse(courseData) {
    return apiRequest('/api/courses/', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  },

  async updateCourse(courseId, courseData) {
    return apiRequest(`/api/courses/${courseId}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  },

  async deleteCourse(courseId) {
    return apiRequest(`/api/courses/${courseId}`, {
      method: 'DELETE',
    });
  },

  async uploadCourseCover(file) {
    const token = await getAuthToken();
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/api/courses/upload-cover`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  },
};

// Devotionals API
export const devotionalService = {
  async getDevotionals(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/api/devotionals/?${queryParams}`);
  },

  async getLatestDevotional() {
    return apiRequest('/api/devotionals/latest');
  },

  async getDevotional(devotionalId) {
    return apiRequest(`/api/devotionals/${devotionalId}`);
  },

  async createDevotional(devotionalData) {
    return apiRequest('/api/devotionals/', {
      method: 'POST',
      body: JSON.stringify(devotionalData),
    });
  },

  async updateDevotional(devotionalId, devotionalData) {
    return apiRequest(`/api/devotionals/${devotionalId}`, {
      method: 'PUT',
      body: JSON.stringify(devotionalData),
    });
  },

  async deleteDevotional(devotionalId) {
    return apiRequest(`/api/devotionals/${devotionalId}`, {
      method: 'DELETE',
    });
  },
};

// Announcements API
export const announcementService = {
  async getAnnouncements(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    return apiRequest(`/api/announcements/?${queryParams}`);
  },

  async getActiveAnnouncements(limit = 10) {
    return apiRequest(`/api/announcements/active?limit=${limit}`);
  },

  async getAnnouncement(announcementId) {
    return apiRequest(`/api/announcements/${announcementId}`);
  },

  async createAnnouncement(announcementData) {
    return apiRequest('/api/announcements/', {
      method: 'POST',
      body: JSON.stringify(announcementData),
    });
  },

  async updateAnnouncement(announcementId, announcementData) {
    return apiRequest(`/api/announcements/${announcementId}`, {
      method: 'PUT',
      body: JSON.stringify(announcementData),
    });
  },

  async deleteAnnouncement(announcementId) {
    return apiRequest(`/api/announcements/${announcementId}`, {
      method: 'DELETE',
    });
  },
};

export default {
  memberService,
  libraryService,
  prayerService,
  eventService,
  podcastService,
  courseService,
  devotionalService,
  announcementService,
  healthCheck,
};

