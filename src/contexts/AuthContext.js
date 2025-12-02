import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { syncFirebaseUser } from '../services/apiService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFirebaseAvailable, setIsFirebaseAvailable] = useState(false);

  // Check if Firebase is available
  useEffect(() => {
    setIsFirebaseAvailable(auth !== null && db !== null);
  }, []);

  // Register new user
  const register = async (email, password, fullName, additionalData = {}) => {
    setLoading(true);
    try {
      if (!isFirebaseAvailable) {
        // Fallback to mock registration for demo mode
        return mockRegister(email, password, fullName);
      }

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile with display name
      await updateProfile(user, { displayName: fullName });

      // Create user document in Firestore
      const userDoc = {
        uid: user.uid,
        email: user.email,
        name: fullName,
        role: additionalData.role || 'user',
        permissions: additionalData.role === 'admin' 
          ? ['admin', 'members', 'content', 'settings']
          : ['profile', 'devotionals', 'prayer-requests'],
        phone: additionalData.phone || '',
        grade: additionalData.grade || '',
        joinDate: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        ...additionalData
      };

      await setDoc(doc(db, 'users', user.uid), userDoc);

      // Sync user to backend API
      try {
        const firebaseToken = await user.getIdToken();
        const backendUser = await syncFirebaseUser(firebaseToken, {
          full_name: fullName,
          phone: additionalData.phone,
          location: additionalData.location,
          role: additionalData.role || 'Member',
          is_admin: additionalData.role === 'admin'
        });
        userDoc.backendUserId = backendUser.id;
        console.log('User synced to backend:', backendUser);
      } catch (syncError) {
        console.warn('Failed to sync user to backend (will retry on login):', syncError);
        // Don't fail registration if backend sync fails
      }

      // Set current user
      const userData = {
        id: user.uid,
        email: user.email,
        name: fullName,
        role: userDoc.role,
        permissions: userDoc.permissions,
        ...userDoc
      };
      setCurrentUser(userData);
      localStorage.setItem('fog_user', JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        error: error.message || 'Registration failed. Please try again.' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    try {
      if (!isFirebaseAvailable) {
        // Fallback to mock login for demo mode
        return mockLogin(email, password);
      }

      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get user data from Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userInfo = {
          id: user.uid,
          email: user.email,
          name: user.displayName || userData.name || user.email,
          role: userData.role || 'user',
          permissions: userData.permissions || ['profile', 'devotionals', 'prayer-requests'],
          ...userData
        };
        setCurrentUser(userInfo);
        localStorage.setItem('fog_user', JSON.stringify(userInfo));
        return { success: true, user: userInfo };
      } else {
        // User exists in Auth but not in Firestore - create basic profile
        const userInfo = {
          id: user.uid,
          email: user.email,
          name: user.displayName || user.email,
          role: 'user',
          permissions: ['profile', 'devotionals', 'prayer-requests']
        };
        await setDoc(doc(db, 'users', user.uid), userInfo);
        setCurrentUser(userInfo);
        localStorage.setItem('fog_user', JSON.stringify(userInfo));
        return { success: true, user: userInfo };
      }
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Invalid email or password';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address';
      }
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Mock login for demo mode
  const mockLogin = async (email, password) => {
    if (email === 'admin@fog.com' && password === 'admin123') {
      const user = {
        id: 'admin-1',
        email: 'admin@fog.com',
        name: 'FOG Administrator',
        role: 'admin',
        permissions: ['admin', 'members', 'content', 'settings']
      };
      setCurrentUser(user);
      localStorage.setItem('fog_user', JSON.stringify(user));
      return { success: true, user };
    } else if (email === 'user@fog.com' && password === 'user123') {
      const user = {
        id: 'user-1',
        email: 'user@fog.com',
        name: 'Regular User',
        role: 'user',
        permissions: ['profile', 'devotionals', 'prayer-requests']
      };
      setCurrentUser(user);
      localStorage.setItem('fog_user', JSON.stringify(user));
      return { success: true, user };
    } else {
      return { success: false, error: 'Invalid credentials' };
    }
  };

  // Mock register for demo mode
  const mockRegister = async (email, password, fullName) => {
    const user = {
      id: `user-${Date.now()}`,
      email: email,
      name: fullName,
      role: 'user',
      permissions: ['profile', 'devotionals', 'prayer-requests']
    };
    setCurrentUser(user);
    localStorage.setItem('fog_user', JSON.stringify(user));
    return { success: true, user };
  };

  // Logout function
  const logout = async () => {
    try {
      if (isFirebaseAvailable && auth) {
        await signOut(auth);
      }
      setCurrentUser(null);
      localStorage.removeItem('fog_user');
    } catch (error) {
      console.error('Logout error:', error);
      setCurrentUser(null);
      localStorage.removeItem('fog_user');
    }
  };

  const isAdmin = () => {
    return currentUser?.role === 'admin';
  };

  const hasPermission = (permission) => {
    return currentUser?.permissions?.includes(permission) || false;
  };

  // Listen for auth state changes
  useEffect(() => {
    if (!isFirebaseAvailable) {
      // Fallback to localStorage for demo mode
      const savedUser = localStorage.getItem('fog_user');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          setCurrentUser(user);
        } catch (error) {
          console.error('Error parsing saved user:', error);
          localStorage.removeItem('fog_user');
        }
      }
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user data from Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            const userInfo = {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || userData.name || firebaseUser.email,
              role: userData.role || 'user',
              permissions: userData.permissions || ['profile', 'devotionals', 'prayer-requests'],
              ...userData
            };
            setCurrentUser(userInfo);
            localStorage.setItem('fog_user', JSON.stringify(userInfo));
            
            // Sync to backend if not already synced
            if (!userData.backendUserId) {
              try {
                const firebaseToken = await firebaseUser.getIdToken();
                const backendUser = await syncFirebaseUser(firebaseToken);
                userInfo.backendUserId = backendUser.id;
                await setDoc(doc(db, 'users', firebaseUser.uid), {
                  ...userData,
                  backendUserId: backendUser.id
                });
                console.log('User synced to backend on login:', backendUser);
              } catch (syncError) {
                console.warn('Failed to sync user to backend:', syncError);
              }
            }
          } else {
            // User exists in Auth but not in Firestore
            const userInfo = {
              id: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || firebaseUser.email,
              role: 'user',
              permissions: ['profile', 'devotionals', 'prayer-requests']
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), userInfo);
            
            // Sync to backend
            try {
              const firebaseToken = await firebaseUser.getIdToken();
              const backendUser = await syncFirebaseUser(firebaseToken);
              userInfo.backendUserId = backendUser.id;
              await setDoc(doc(db, 'users', firebaseUser.uid), {
                ...userInfo,
                backendUserId: backendUser.id
              });
            } catch (syncError) {
              console.warn('Failed to sync user to backend:', syncError);
            }
            
            setCurrentUser(userInfo);
            localStorage.setItem('fog_user', JSON.stringify(userInfo));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
        localStorage.removeItem('fog_user');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, [isFirebaseAvailable]);

  const value = {
    currentUser,
    login,
    register,
    logout,
    isAdmin,
    hasPermission,
    loading,
    isFirebaseAvailable
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
