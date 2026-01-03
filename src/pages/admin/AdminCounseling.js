import React from 'react';
import { HeartHandshake, Settings } from 'lucide-react';

const AdminCounseling = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <HeartHandshake className="w-16 h-16 text-pink-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Counseling Management</h1>
          <p className="text-gray-600 mb-6">Counseling services management interface coming soon.</p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Settings className="w-5 h-5" />
            <span>Admin management features will be available here</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCounseling;

