import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  orderBy,
  limit 
} from 'firebase/firestore';
import { db } from '../firebase';

// Check if Firebase is properly configured
const isFirebaseAvailable = () => {
  return db !== null;
};

// Mock data for development
const mockData = {
  users: [
    { id: 'demo-user-id', name: 'Tinotenda Mtotela', email: 'john@example.com', phone: '555-0123' }
  ],
  devotionals: [
    { id: '1', title: 'Walking in Faith', scripture: 'Hebrews 11:1', author: 'Pastor Sarah', date: '2024-01-14', readTime: '5 min read' }
  ],

  prayerRequests: [
    { id: '1', title: 'Community Prayer', content: 'Praying for our community', date: new Date(), prayerCount: 5 }
  ]
};

// User Profile Services
export const userService = {
  // Get user profile
  async getUserProfile(userId) {
    try {
      if (!isFirebaseAvailable()) {
        // Return mock data in development
        return mockData.users.find(user => user.id === userId) || { name: 'Demo User', email: 'demo@example.com' };
      }

      const userDoc = await getDoc(doc(db, 'users', userId));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      // Return mock data on error
      return { name: 'Demo User', email: 'demo@example.com' };
    }
  },

  // Create or update user profile
  async saveUserProfile(userId, profileData) {
    try {
      if (!isFirebaseAvailable()) {
        console.log('Demo mode: Profile would be saved:', { userId, profileData });
        return true;
      }

      await setDoc(doc(db, 'users', userId), profileData, { merge: true });
      return true;
    } catch (error) {
      console.error('Error saving user profile:', error);
      throw error;
    }
  },

  // Update specific profile fields
  async updateUserProfile(userId, updates) {
    try {
      if (!isFirebaseAvailable()) {
        console.log('Demo mode: Profile would be updated:', { userId, updates });
        return true;
      }

      await updateDoc(doc(db, 'users', userId), updates);
      return true;
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }
};

// Devotionals Services
export const devotionalService = {
  // Get all devotionals
  async getDevotionals() {
    try {
      if (!isFirebaseAvailable()) {
        return mockData.devotionals;
      }

      const q = query(collection(db, 'devotionals'), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting devotionals:', error);
      return mockData.devotionals;
    }
  },

  // Save devotional to user's saved list
  async saveDevotional(userId, devotionalId) {
    try {
      if (!isFirebaseAvailable()) {
        console.log('Demo mode: Devotional would be saved:', { userId, devotionalId });
        return true;
      }

      await addDoc(collection(db, 'savedDevotionals'), {
        userId,
        devotionalId,
        savedAt: new Date()
      });
      return true;
    } catch (error) {
      console.error('Error saving devotional:', error);
      throw error;
    }
  },

  // Get user's saved devotionals
  async getSavedDevotionals(userId) {
    try {
      if (!isFirebaseAvailable()) {
        return mockData.devotionals.slice(0, 2); // Return first 2 as "saved"
      }

      const q = query(
        collection(db, 'savedDevotionals'), 
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting saved devotionals:', error);
      return [];
    }
  }
};



// Prayer Requests Services
export const prayerService = {
  // Get all prayer requests
  async getPrayerRequests() {
    try {
      if (!isFirebaseAvailable()) {
        return mockData.prayerRequests;
      }

      const q = query(collection(db, 'prayerRequests'), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting prayer requests:', error);
      return mockData.prayerRequests;
    }
  },

  // Add new prayer request
  async addPrayerRequest(requestData) {
    try {
      if (!isFirebaseAvailable()) {
        console.log('Demo mode: Prayer request would be added:', requestData);
        return 'demo-request-id';
      }

      const docRef = await addDoc(collection(db, 'prayerRequests'), {
        ...requestData,
        date: new Date(),
        prayerCount: 0,
        comments: []
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding prayer request:', error);
      throw error;
    }
  },

  // Increment prayer count
  async incrementPrayerCount(requestId) {
    try {
      if (!isFirebaseAvailable()) {
        console.log('Demo mode: Prayer count would be incremented for:', requestId);
        return true;
      }

      const requestRef = doc(db, 'prayerRequests', requestId);
      const requestDoc = await getDoc(requestRef);
      if (requestDoc.exists()) {
        const currentCount = requestDoc.data().prayerCount || 0;
        await updateDoc(requestRef, { prayerCount: currentCount + 1 });
      }
      return true;
    } catch (error) {
      console.error('Error incrementing prayer count:', error);
      throw error;
    }
  }
}; 