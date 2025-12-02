import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Settings,
  Calendar,
  Headphones,
  GraduationCap,
  Book,
  Bell,
  BookOpen
} from 'lucide-react';

const AdminDashboard = () => {
  const { isAdmin } = useAuth();

  const managementSections = [
    {
      id: 'events',
      title: 'Events',
      icon: Calendar,
      path: '/admin/events'
    },
    {
      id: 'podcasts',
      title: 'Podcasts',
      icon: Headphones,
      path: '/admin/podcasts'
    },
    {
      id: 'courses',
      title: 'Courses',
      icon: GraduationCap,
      path: '/admin/courses'
    },
    {
      id: 'devotionals',
      title: 'Devotionals',
      icon: Book,
      path: '/admin/devotionals'
    },
    {
      id: 'announcements',
      title: 'Announcements',
      icon: Bell,
      path: '/admin/announcements'
    },
    {
      id: 'library',
      title: 'Library',
      icon: BookOpen,
      path: '/admin/library'
    }
  ];

  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="mt-2 text-gray-600">Upload and preview content</p>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {managementSections.map((section) => {
            const Icon = section.icon;
            return (
              <Link
                key={section.id}
                to={section.path}
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 text-center"
              >
                <Icon className="w-8 h-8 mx-auto mb-3 text-primary-600" />
                <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
