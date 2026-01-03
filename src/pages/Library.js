import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLibrary } from '../contexts/LibraryContext';
import { 
  BookOpen, 
  Bookmark,
  Star,
  ExternalLink,
  ArrowRight
} from 'lucide-react';

const Library = () => {
  const { isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Digital Library</h1>
              <p className="mt-2 text-gray-600">Access our complete collection of spiritual resources and books</p>
            </div>
          </div>
        </div>

        {/* Book Website Redirect Section */}
        <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-8 mb-8 text-white">
          <div className="text-center">
            <BookOpen className="mx-auto h-16 w-16 mb-4" />
            <h2 className="text-2xl font-bold mb-4">Complete Book Collection</h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Discover our full library of spiritual books, devotionals, and resources. 
              Browse, purchase, and download books directly from our dedicated book platform.
            </p>
            <button 
              onClick={() => window.open('https://wisdomlibrary.co.zw/', '_blank')}
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center mx-auto"
            >
              <ExternalLink className="w-5 h-5 mr-2" />
              Visit Our Book Website
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>

        {/* Other Content Types */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Blog Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200">
              <div className="text-center">
                <Bookmark className="mx-auto h-12 w-12 text-green-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Blog Articles</h3>
                <p className="text-gray-600 mb-4">Read our latest blog posts on faith, relationships, and spiritual growth</p>
                <button className="text-primary-600 font-medium hover:text-primary-700">
                  Read Blogs →
                </button>
              </div>
            </div>

            {/* Quotes Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200">
              <div className="text-center">
                <Star className="mx-auto h-12 w-12 text-yellow-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Quotes</h3>
                <p className="text-gray-600 mb-4">Get inspired with daily wisdom quotes and scripture</p>
                <button className="text-primary-600 font-medium hover:text-primary-700">
                  View Quotes →
                </button>
              </div>
            </div>

            {/* Wisdom For Youth Blogs Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200">
              <div className="text-center">
                <BookOpen className="mx-auto h-12 w-12 text-blue-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">WISDOM FOR YOUTH BLOGS</h3>
                <p className="text-gray-600 mb-4">Inspiring blogs and articles designed specifically for youth spiritual growth</p>
                <button className="text-primary-600 font-medium hover:text-primary-700">
                  Read Blogs →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Library;
