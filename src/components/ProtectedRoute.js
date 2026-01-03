import React from 'react';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  // For beta launch, always allow access - no authentication required
  return children;
};

export default ProtectedRoute;
