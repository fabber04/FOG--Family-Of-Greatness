import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { eventService, podcastService, memberService, prayerService, libraryService } from '../services/apiService';
import {
  Settings,
  Calendar,
  Headphones,
  FileText,
  Users,
  UserCheck,
  Shield,
  Heart,
  Database,
  RefreshCw,
  BookOpen,
  GraduationCap,
  HeartHandshake,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Loader2 } from 'lucide-react';

const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState({
    users: {
      total: 0,
      active: 0,
      admins: 0,
      recent: 0,
      loading: true
    },
    prayer: {
      total: 0,
      pending: 0,
      answered: 0,
      recent: 0,
      loading: true
    },
    content: {
      events: { total: 0, loading: true },
      podcasts: { total: 0, loading: true },
      library: { total: 0, loading: true }
    }
  });
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    loadAllStatistics();
  }, []);

  const loadAllStatistics = async () => {
    try {
      setLoading(true);
      const [
        userStats,
        prayerStats,
        eventsData,
        podcastsData,
        libraryData
      ] = await Promise.all([
        memberService.getUserStats().catch(() => ({
          total_users: 0,
          active_users: 0,
          admin_users: 0,
          regular_users: 0,
          recent_registrations: 0
        })),
        prayerService.getPrayerStats().catch(() => ({
          total_requests: 0,
          pending_requests: 0,
          in_progress_requests: 0,
          answered_requests: 0,
          private_requests: 0,
          recent_requests: 0
        })),
        eventService.getEvents().catch(() => []),
        podcastService.getPodcasts().catch(() => []),
        libraryService.getLibraryItems().catch(() => [])
      ]);

      setStats({
        users: {
          total: userStats.total_users || 0,
          active: userStats.active_users || 0,
          admins: userStats.admin_users || 0,
          recent: userStats.recent_registrations || 0,
          loading: false
        },
        prayer: {
          total: prayerStats.total_requests || 0,
          pending: prayerStats.pending_requests || 0,
          answered: prayerStats.answered_requests || 0,
          recent: prayerStats.recent_requests || 0,
          loading: false
        },
        content: {
          events: { total: eventsData.length || 0, loading: false },
          podcasts: { total: podcastsData.length || 0, loading: false },
          library: { total: libraryData.length || 0, loading: false }
        }
      });
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const managementSections = [
    {
      id: 'events',
      title: 'Events',
      icon: Calendar,
      path: '/admin/events',
      color: 'from-blue-500 to-blue-600',
      count: stats.content.events.total,
      countLoading: stats.content.events.loading
    },
    {
      id: 'podcasts',
      title: 'Podcasts',
      icon: Headphones,
      path: '/admin/podcasts',
      color: 'from-purple-500 to-purple-600',
      count: stats.content.podcasts.total,
      countLoading: stats.content.podcasts.loading
    },
    {
      id: 'library',
      title: 'Library',
      icon: BookOpen,
      path: '/admin/library',
      color: 'from-indigo-500 to-indigo-600',
      count: stats.content.library.total,
      countLoading: stats.content.library.loading
    },
    {
      id: 'genius-academy',
      title: 'Genius Academy',
      icon: GraduationCap,
      path: '/admin/masterclass',
      color: 'from-yellow-500 to-yellow-600',
      count: 0,
      countLoading: false
    },
    {
      id: 'counseling',
      title: 'Counseling',
      icon: HeartHandshake,
      path: '/admin/counseling',
      color: 'from-pink-500 to-pink-600',
      count: 0,
      countLoading: false
    },
    {
      id: 'devotionals',
      title: 'Devotionals',
      icon: FileText,
      path: '/admin/devotionals',
      color: 'from-teal-500 to-teal-600',
      count: 0,
      countLoading: false
    },
    {
      id: 'members',
      title: 'Members',
      icon: Users,
      path: '/members',
      color: 'from-green-500 to-green-600',
      count: stats.users.total,
      countLoading: stats.users.loading
    },
    {
      id: 'prayer',
      title: 'Prayer Requests',
      icon: Heart,
      path: '/prayer-requests',
      color: 'from-red-500 to-red-600',
      count: stats.prayer.total,
      countLoading: stats.prayer.loading
    }
  ];

  const totalContent = stats.content.events.total + stats.content.podcasts.total + stats.content.library.total;

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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">Platform overview and quick access</p>
            </div>
            <button
              onClick={loadAllStatistics}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Quick Stats - Compact */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Users</p>
                {stats.users.loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{stats.users.total}</p>
                )}
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            {!stats.users.loading && stats.users.recent > 0 && (
              <p className="text-xs text-gray-500 mt-1">+{stats.users.recent} this month</p>
            )}
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Active Users</p>
                {stats.users.loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{stats.users.active}</p>
                )}
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Prayer Requests</p>
                {stats.prayer.loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{stats.prayer.total}</p>
                )}
              </div>
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-red-600" />
              </div>
            </div>
            {!stats.prayer.loading && stats.prayer.pending > 0 && (
              <p className="text-xs text-red-600 mt-1">{stats.prayer.pending} pending</p>
            )}
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500 mb-1">Total Content</p>
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">{totalContent}</p>
                )}
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Management Sections - Clean Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Quick Management</h2>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Activity className="w-4 h-4" />
              <span>Last updated: {lastRefresh.toLocaleTimeString()}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {managementSections.map((section) => {
              const Icon = section.icon;
              return (
                <Link
                  key={section.id}
                  to={section.path}
                  className="group relative bg-white rounded-lg p-5 shadow-sm border border-gray-200 hover:shadow-md hover:border-gray-300 transition-all duration-200"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-12 h-12 bg-gradient-to-br ${section.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-sm`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">{section.title}</h3>
                    {section.countLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    ) : (
                      <p className="text-xs text-gray-500">{section.count} items</p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Summary Stats - Single Row */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Database className="w-5 h-5 text-gray-600" />
            Platform Summary
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-gray-500 mb-1">Events</p>
              {stats.content.events.loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              ) : (
                <p className="text-xl font-bold text-gray-900">{stats.content.events.total}</p>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Podcasts</p>
              {stats.content.podcasts.loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              ) : (
                <p className="text-xl font-bold text-gray-900">{stats.content.podcasts.total}</p>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Library Items</p>
              {stats.content.library.loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              ) : (
                <p className="text-xl font-bold text-gray-900">{stats.content.library.total}</p>
              )}
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Administrators</p>
              {stats.users.loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              ) : (
                <p className="text-xl font-bold text-gray-900">{stats.users.admins}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
