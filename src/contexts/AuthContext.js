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
  const [loading, setLoading] = useState(true);

  // Mock login function - in a real app, this would integrate with Firebase Auth
  const login = async (email, password) => {
    setLoading(true);
    try {
      // Mock authentication logic
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
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('fog_user');
  };

  const isAdmin = () => {
    return currentUser?.role === 'admin';
  };

  const hasPermission = (permission) => {
    return currentUser?.permissions?.includes(permission) || false;
  };

  // Check for existing session on app load
  useEffect(() => {
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

  const value = {
    currentUser,
    login,
    logout,
    isAdmin,
    hasPermission,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
