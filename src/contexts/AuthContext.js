import React, { createContext, useContext, useState, useEffect } from 'react';

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
  const [loading, setLoading] = useState(false);

  // For beta launch: Auth is disabled, return null user
  useEffect(() => {
    // Check localStorage for any saved user (for backward compatibility)
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
  }, []);

  // Register - disabled for beta
  const register = async (email, password, fullName, additionalData = {}) => {
    console.warn('Registration is disabled for beta launch');
    return { success: false, error: 'Registration is currently disabled' };
  };

  // Login - disabled for beta
  const login = async (email, password) => {
    console.warn('Login is disabled for beta launch');
    return { success: false, error: 'Login is currently disabled' };
  };

  // Logout
  const logout = async () => {
    setCurrentUser(null);
    localStorage.removeItem('fog_user');
  };

  const isAdmin = () => {
    // For beta: no admin access
    return false;
  };

  const hasPermission = (permission) => {
    // For beta: no permissions needed
    return false;
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    isAdmin,
    hasPermission,
    loading,
    isFirebaseAvailable: false
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
