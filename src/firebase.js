import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Your Firebase configuration
// You'll need to replace these with your actual Firebase project config
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "demo-api-key",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "demo-project.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "demo-project.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "demo-app-id"
};

// Check if we're in development mode and using demo config
const isDemoMode = !process.env.REACT_APP_FIREBASE_API_KEY || process.env.REACT_APP_FIREBASE_API_KEY === "your_actual_api_key_here";

if (isDemoMode) {
  console.warn('⚠️ Firebase Demo Mode: Using demo configuration. Please set up your Firebase credentials in .env file for full functionality.');
  console.log('📝 To set up Firebase:');
  console.log('1. Go to https://console.firebase.google.com/');
  console.log('2. Create a new project or select existing one');
  console.log('3. Go to Project Settings > General > Your apps');
  console.log('4. Copy the config values to your .env file');
}

// Debug: Log configuration (remove this later)
console.log('Firebase Config Status:', {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY ? 'Set' : 'Missing/Demo',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN ? 'Set' : 'Missing/Demo',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID ? 'Set' : 'Missing/Demo',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET ? 'Set' : 'Missing/Demo',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID ? 'Set' : 'Missing/Demo',
  appId: process.env.REACT_APP_FIREBASE_APP_ID ? 'Set' : 'Missing/Demo'
});

// Validate Firebase config before initialization
const hasValidConfig = firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== "demo-api-key" &&
  firebaseConfig.apiKey !== "your_actual_api_key_here" &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== "demo-project";

// Initialize Firebase
let app;
let db, auth, storage;

if (!hasValidConfig) {
  console.warn('⚠️ Firebase not configured. Running in demo mode.');
  console.warn('📝 To enable Firebase:');
  console.warn('1. Create a .env file in the project root');
  console.warn('2. Add your Firebase credentials (see env.example)');
  console.warn('3. Restart the development server');
  
  // Set to null so the app can handle demo mode
  app = null;
  db = null;
  auth = null;
  storage = null;
} else {
  try {
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase initialized successfully');
    
    // Initialize Firebase services
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    console.error('Error details:', error.message);
    
    if (error.message.includes('api-key-not-valid')) {
      console.error('🔑 Invalid API key. Please check your .env file:');
      console.error('   - Make sure REACT_APP_FIREBASE_API_KEY is set correctly');
      console.error('   - Get your API key from Firebase Console > Project Settings > General');
      console.error('   - Restart the development server after updating .env');
    }
    
    // Set to null so the app can handle errors gracefully
    app = null;
    db = null;
    auth = null;
    storage = null;
  }
}

export { db, auth, storage };
export default app; 