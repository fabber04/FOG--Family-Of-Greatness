import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Calendar, 
  BookOpen, 
  Users, 
  ArrowRight,
  Library,
  Headphones,
  GraduationCap,
  HeartHandshake
} from 'lucide-react';


const Dashboard = () => {
  const { isAdmin } = useAuth();



  const latestDevotional = {
    title: "Walking in Faith",
    scripture: "Hebrews 11:1",
    verse: "Now faith is confidence in what we hope for and assurance about what we do not see.",
    author: "Pastor Sarah",
    date: "2024-01-14",
    readTime: "5 min read"
  };

  const announcements = [
    {
      id: 1,
      title: "New Youth Ministry Team",
      content: "We're excited to announce our new youth ministry leadership team!",
      date: "2024-01-13",
      priority: "high"
    },
    {
      id: 2,
      title: "Mission Trip Registration",
      content: "Registration for the summer mission trip is now open. Limited spots available!",
      date: "2024-01-12",
      priority: "medium"
    }
  ];



  const quickActions = [
    ...(isAdmin() ? [
      { name: "Members", href: "/members", icon: Users, color: "bg-primary-700" }
    ] : []),
    { name: "Library", href: "/library", icon: Library, color: "bg-accent-500" },
    { name: "Podcasts", href: "/podcasts", icon: Headphones, color: "bg-secondary-500" },
    { name: "Events", href: "/events", icon: Calendar, color: "bg-green-600" },
    { name: "Genius Academy", href: "/masterclass", icon: GraduationCap, color: "bg-primary-800" },
    { name: "Counseling", href: "/counseling", icon: HeartHandshake, color: "bg-secondary-600" },
    { name: "Relationship Devotionals", href: "/devotionals", icon: BookOpen, color: "bg-accent-600" }
  ];



  return (
    <div className="space-y-6 lg:space-y-10 xl:space-y-12 2xl:space-y-16">
      {/* Enhanced Hero Section */}
      <div className="gradient-bg rounded-3xl lg:rounded-[2rem] xl:rounded-[2.5rem] p-6 lg:p-10 xl:p-12 2xl:p-16 text-white text-center hover-lift glow-primary">
        <h1 className="text-2xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-4 text-shadow">
          WELCOME TO FOG
        </h1>
        <p className="text-white/90 text-sm lg:text-lg xl:text-xl 2xl:text-2xl mb-6 max-w-4xl mx-auto">
          JOIN US IN A JOURNEY OF FAITH, FELLOWSHIP, AND SPIRITUAL GROWTH. OUR PLATFORM IS A PLACE WHERE YOU CAN EXPERIENCE THE POWER OF GOD\'S LOVE.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-primary-600 px-8 py-3 rounded-full font-semibold hover:bg-accent-50 hover:scale-105 transition-all duration-200 hover-lift">
            Explore Ministries 🚀
          </button>
          <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-primary-600 hover:scale-105 transition-all duration-200 hover-lift">
            Join Our Community 💖
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6 xl:gap-8 2xl:gap-10">
        {quickActions.map((action) => (
          action.href ? (
            <Link
              key={action.name}
              to={action.href}
              className="card-hover text-center p-4 lg:p-6 xl:p-8 group"
            >
              <div className={`w-12 h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 ${action.color} rounded-xl lg:rounded-2xl xl:rounded-3xl flex items-center justify-center mx-auto mb-3 lg:mb-4 xl:mb-5 group-hover:scale-110 transition-transform duration-200`}>
                <action.icon size={24} className="lg:w-7 lg:h-7 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10 text-white" />
              </div>
              <h3 className="font-medium text-gray-900 text-sm lg:text-base xl:text-lg 2xl:text-xl">{action.name}</h3>
            </Link>
          ) : (
            <button
              key={action.name}
              onClick={action.action}
              className="card-hover text-center p-4 lg:p-6 xl:p-8 group w-full"
            >
              <div className={`w-12 h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 ${action.color} rounded-xl lg:rounded-2xl xl:rounded-3xl flex items-center justify-center mx-auto mb-3 lg:mb-4 xl:mb-5 group-hover:scale-110 transition-transform duration-200`}>
                <action.icon size={24} className="lg:w-7 lg:h-7 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10 text-white" />
              </div>
              <h3 className="font-medium text-gray-900 text-sm lg:text-base xl:text-lg 2xl:text-xl">{action.name}</h3>
            </button>
          )
        ))}
      </div>

      {/* Services Section */}
      <div className="card">
        <h2 className="text-xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-semibold mb-6 text-center">Our Services</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="text-center p-6 bg-blue-50 rounded-xl hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={32} className="text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Sunday Services</h3>
            <p className="text-gray-600">1st Service: 7:00 AM</p>
            <p className="text-gray-600">2nd Service: 11:00 AM</p>
          </div>
          <div className="text-center p-6 bg-green-50 rounded-xl hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen size={32} className="text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Youth Bible Study</h3>
            <p className="text-gray-600">Monday & Tuesday, 6:00 PM</p>
          </div>
          <div className="text-center p-6 bg-purple-50 rounded-xl hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap size={32} className="text-white" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Genius Academy</h3>
            <p className="text-gray-600">Wednesday, 7:00 PM</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-1 gap-6 lg:gap-8 xl:gap-10 2xl:gap-12">
        {/* Events section removed */}

        {/* Right sidebar content */}
        <div className="lg:col-span-1 xl:col-span-1 2xl:col-span-1 space-y-6 lg:space-y-8 xl:space-y-10">
          {/* Latest Devotional */}
          <div className="card">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <h2 className="text-lg lg:text-2xl xl:text-3xl 2xl:text-4xl font-semibold text-gray-900">Latest Devotional</h2>
              <Link to="/devotionals" className="text-primary-600 hover:text-primary-700 text-sm lg:text-base font-medium">
                <BookOpen size={16} className="lg:w-6 lg:h-6 xl:w-7 xl:h-7" />
              </Link>
            </div>
            <div className="space-y-3 lg:space-y-4 xl:space-y-5">
              <h3 className="font-semibold text-gray-900 text-base lg:text-xl xl:text-2xl">{latestDevotional.title}</h3>
              <p className="text-sm lg:text-base xl:text-lg text-gray-600 italic">"{latestDevotional.verse}"</p>
              <p className="text-xs lg:text-sm xl:text-base text-gray-500">
                {latestDevotional.scripture} • {latestDevotional.readTime}
              </p>
              <div className="pt-2 lg:pt-3 xl:pt-4">
                <Link 
                  to="/devotionals" 
                  className="inline-flex items-center text-sm lg:text-base xl:text-lg font-medium text-primary-600 hover:text-primary-700"
                >
                  Read full devotional
                  <ArrowRight size={16} className="ml-1 lg:w-5 lg:h-5 xl:w-6 xl:h-6" />
                </Link>
              </div>
            </div>
          </div>


        </div>
      </div>

      {/* Announcements Section */}
      <div className="card">
        <div className="flex items-center justify-between mb-4 lg:mb-6 xl:mb-8">
          <h2 className="text-xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-semibold text-gray-900">Announcements</h2>
          <div className="flex space-x-2 lg:space-x-3">
            <button className="px-3 py-1 lg:px-4 lg:py-2 xl:px-5 xl:py-3 text-xs lg:text-sm xl:text-base font-medium text-gray-600 bg-gray-100 rounded-lg lg:rounded-xl hover:bg-gray-200">
              All
            </button>
            <button className="px-3 py-1 lg:px-4 lg:py-2 xl:px-5 xl:py-3 text-xs lg:text-sm xl:text-base font-medium text-gray-600 bg-gray-100 rounded-lg lg:rounded-xl hover:bg-gray-200">
              High Priority
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-6 xl:gap-8">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="border border-gray-200 rounded-xl lg:rounded-2xl p-4 lg:p-6 xl:p-8 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-2 lg:mb-3">
                <h3 className="font-semibold text-gray-900 text-base lg:text-lg xl:text-xl">{announcement.title}</h3>
                <span className={`px-2 py-1 lg:px-3 lg:py-2 text-xs lg:text-sm font-medium rounded-full ${
                  announcement.priority === 'high' 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {announcement.priority}
                </span>
              </div>
              <p className="text-gray-600 text-sm lg:text-base xl:text-lg mb-3 lg:mb-4">{announcement.content}</p>
              <p className="text-xs lg:text-sm xl:text-base text-gray-400">{announcement.date}</p>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
};

export default Dashboard; 