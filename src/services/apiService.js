// API Service for Backend Communication
// This service handles all communication with the Python FastAPI backend

import { auth } from '../firebase';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Helper function to get auth token
const getAuthToken = async () => {
  try {
    // Try to get Firebase ID token first
    if (auth && auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      return token;
    }
    
    // Fallback: check localStorage for backend JWT token
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

// Helper function for API requests
const apiRequest = async (endpoint, options = {}) => {
  const token = await getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: response.statusText }));
      
      // Handle 401 Unauthorized - token might be expired
      if (response.status === 401) {
        // Try to refresh token
        if (auth && auth.currentUser) {
          try {
            const newToken = await auth.currentUser.getIdToken(true);
            headers['Authorization'] = `Bearer ${newToken}`;
            // Retry the request
            const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
              ...options,
              headers,
            });
            if (retryResponse.ok) {
              return await retryResponse.json();
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
          }
        }
      }
      
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    // If it's a network error, provide a helpful message
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Cannot connect to backend API. Please ensure the server is running at ' + API_BASE_URL);
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
};

// Firebase User Sync
export const syncFirebaseUser = async (firebaseToken, userData = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/sync-firebase-user-with-token`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${firebaseToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error syncing Firebase user:', error);
    throw error;
  }
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

