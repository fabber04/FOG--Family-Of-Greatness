import React from 'react';
import { BookOpen } from 'lucide-react';

const Devotionals = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Relationship Devotionals</h1>
        <p className="text-gray-600 mt-1">Strengthen your relationships through faith-based devotionals and guidance</p>
      </div>

      {/* Under Construction Message */}
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen size={48} className="text-gray-400" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Under Construction</h2>
          <p className="text-gray-500">This section is being developed and will be available soon.</p>
        </div>
      </div>
    </div>
  );
};

export default Devotionals; 