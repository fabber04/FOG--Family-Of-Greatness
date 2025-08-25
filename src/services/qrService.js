import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs,
  orderBy,
  updateDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

// Check if Firebase is properly configured
const isFirebaseAvailable = () => {
  return db !== null;
};

// Mock data for development
const mockCheckIns = [];

// QR Check-in Services
export const qrService = {
  // Generate a unique QR code for an event
  async generateEventQR(eventId, eventData) {
    try {
      const qrData = {
        eventId,
        eventTitle: eventData.title,
        eventDate: eventData.date,
        eventTime: eventData.time,
        generatedAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours from now
        isActive: true
      };

      if (!isFirebaseAvailable()) {
        console.log('Demo mode: QR code would be generated:', qrData);
        return qrData;
      }

      await setDoc(doc(db, 'eventQRs', eventId), qrData);
      return qrData;
    } catch (error) {
      console.error('Error generating event QR:', error);
      throw error;
    }
  },

  // Get QR data for an event
  async getEventQR(eventId) {
    try {
      if (!isFirebaseAvailable()) {
        // Return mock QR data
        return {
          eventId,
          eventTitle: 'Demo Event',
          eventDate: '2024-01-15',
          eventTime: '19:00',
          generatedAt: new Date(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
          isActive: true
        };
      }

      const qrDoc = await getDoc(doc(db, 'eventQRs', eventId));
      if (qrDoc.exists()) {
        return qrDoc.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting event QR:', error);
      throw error;
    }
  },

  // Process a check-in
  async processCheckIn(userId, qrData, userProfile) {
    try {
      const checkInData = {
        userId,
        eventId: qrData.eventId,
        eventTitle: qrData.eventTitle,
        checkInTime: new Date(),
        userProfile: {
          name: userProfile.name || 'Anonymous',
          email: userProfile.email || '',
          phone: userProfile.phone || ''
        },
        status: 'checked-in'
      };

      if (!isFirebaseAvailable()) {
        // Check if already checked in (demo mode)
        const existingCheckIn = mockCheckIns.find(
          checkIn => checkIn.userId === userId && checkIn.eventId === qrData.eventId
        );
        
        if (existingCheckIn) {
          throw new Error('Already checked in to this event');
        }

        // Add to mock data
        mockCheckIns.push(checkInData);
        console.log('Demo mode: Check-in processed:', checkInData);
        return {
          id: `demo-${Date.now()}`,
          ...checkInData
        };
      }

      // Check if user already checked in
      const existingCheckIn = await this.getUserCheckIn(userId, qrData.eventId);
      if (existingCheckIn) {
        throw new Error('Already checked in to this event');
      }

      // Add check-in record
      const checkInRef = await addDoc(collection(db, 'checkIns'), {
        ...checkInData,
        checkInTime: serverTimestamp()
      });
      
      // Update event attendance count
      await this.updateEventAttendance(qrData.eventId);

      return {
        id: checkInRef.id,
        ...checkInData
      };
    } catch (error) {
      console.error('Error processing check-in:', error);
      throw error;
    }
  },

  // Get user's check-in for a specific event
  async getUserCheckIn(userId, eventId) {
    try {
      if (!isFirebaseAvailable()) {
        return mockCheckIns.find(
          checkIn => checkIn.userId === userId && checkIn.eventId === eventId
        ) || null;
      }

      const q = query(
        collection(db, 'checkIns'),
        where('userId', '==', userId),
        where('eventId', '==', eventId)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        return { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
      }
      return null;
    } catch (error) {
      console.error('Error getting user check-in:', error);
      throw error;
    }
  },

  // Get all check-ins for an event
  async getEventCheckIns(eventId) {
    try {
      if (!isFirebaseAvailable()) {
        return mockCheckIns.filter(checkIn => checkIn.eventId === eventId);
      }

      const q = query(
        collection(db, 'checkIns'),
        where('eventId', '==', eventId),
        orderBy('checkInTime', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting event check-ins:', error);
      throw error;
    }
  },

  // Update event attendance count
  async updateEventAttendance(eventId) {
    try {
      if (!isFirebaseAvailable()) {
        console.log('Demo mode: Attendance would be updated for event:', eventId);
        return mockCheckIns.filter(checkIn => checkIn.eventId === eventId).length;
      }

      const checkIns = await this.getEventCheckIns(eventId);
      const attendanceCount = checkIns.length;
      
      // Update the event document with attendance count
      await updateDoc(doc(db, 'events', eventId), {
        attendanceCount,
        lastUpdated: serverTimestamp()
      });

      return attendanceCount;
    } catch (error) {
      console.error('Error updating event attendance:', error);
      throw error;
    }
  },

  // Get user's check-in history
  async getUserCheckInHistory(userId) {
    try {
      if (!isFirebaseAvailable()) {
        return mockCheckIns.filter(checkIn => checkIn.userId === userId);
      }

      const q = query(
        collection(db, 'checkIns'),
        where('userId', '==', userId),
        orderBy('checkInTime', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting user check-in history:', error);
      throw error;
    }
  },

  // Validate QR code data
  validateQRData(qrData) {
    if (!qrData || !qrData.eventId) {
      return { valid: false, error: 'Invalid QR code data' };
    }

    if (qrData.expiresAt && new Date(qrData.expiresAt) < new Date()) {
      return { valid: false, error: 'QR code has expired' };
    }

    if (!qrData.isActive) {
      return { valid: false, error: 'QR code is not active' };
    }

    return { valid: true };
  }
}; 