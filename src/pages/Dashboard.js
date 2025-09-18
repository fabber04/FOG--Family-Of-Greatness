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
    title: "Ukufa KukaJesu",
    scripture: "Johane 3:16",
    verse: "Ngokuba uThixo wathanda ihlabathi kangangokuba wanika uNyana wakhe yedwa, ukuze bonke abakholwayo kuye bangatshabalali, kodwa babe nobomi obungunaphakade.",
    author: "Pastor Tafadzwa Moyo",
    date: "2024-01-14",
    readTime: "5 min read"
  };

  const announcements = [
    {
      id: 1,
      title: "Youth Ministry Team",
      content: "We're excited to announce our new youth ministry leadership team led by Tinashe Chiwenga and Rutendo Mupfumira!",
      date: "2024-01-13",
      priority: "high"
    },
    {
      id: 2,
      title: "Harare Mission Trip",
      content: "Registration for the Harare mission trip is now open. Limited to 25 participants. Contact Pastor Tafadzwa at +263 77 123 4567",
      date: "2024-01-12",
      priority: "medium"
    },
    {
      id: 3,
      title: "Bulawayo Outreach Program",
      content: "Join us for our monthly outreach program in Bulawayo. Meeting at 8:00 AM at FOG Community Center. Transport provided.",
      date: "2024-01-11",
      priority: "high"
    },
    {
      id: 4,
      title: "Chitungwiza Bible Study",
      content: "New Bible study group starting in Chitungwiza. Led by Pastor Farai Ndlovu. Every Tuesday at 6:30 PM.",
      date: "2024-01-10",
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
      <div className="gradient-bg rounded-3xl lg:rounded-[2rem] xl:rounded-[2.5rem] p-6 lg:p-10 xl:p-12 2xl:p-16 text-white text-center hover-lift glow-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="/images/events/IMG-20250825-WA0070.jpg" alt="FOG Community" className="w-full h-full object-cover" />
        </div>
        <div className="relative z-10">
          <h1 className="text-2xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-4 text-shadow">
            WELCOME TO FOG
          </h1>
          <p className="text-white/90 text-sm lg:text-lg xl:text-xl 2xl:text-2xl mb-6 max-w-4xl mx-auto">
            JOIN US IN A JOURNEY OF FAITH, FELLOWSHIP, AND SPIRITUAL GROWTH ACROSS ZIMBABWE. FROM HARARE TO BULAWAYO, CHITUNGWIZA TO MUTARE, EXPERIENCE THE POWER OF GOD'S LOVE IN OUR COMMUNITIES.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary-600 px-8 py-3 rounded-full font-semibold hover:bg-accent-50 hover:scale-105 transition-all duration-200 hover-lift">
              Explore Ministries
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-primary-600 hover:scale-105 transition-all duration-200 hover-lift">
              Join Our Community
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-8">
        <div className="text-center">
          <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-900 mb-2">Quick Access</h2>
          <p className="text-gray-600 text-lg">Explore our ministries and resources</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-4 lg:gap-6 xl:gap-8">
          {quickActions.map((action) => (
            action.href ? (
              <Link
                key={action.name}
                to={action.href}
                className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-gray-200"
              >
                <div className="text-center">
                  <div className={`w-16 h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 ${action.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <action.icon size={28} className="lg:w-8 lg:h-8 xl:w-10 xl:h-10 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm lg:text-base xl:text-lg leading-tight group-hover:text-primary-600 transition-colors duration-200">
                    {action.name}
                  </h3>
                </div>
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-50/0 to-primary-50/0 group-hover:from-primary-50/20 group-hover:to-primary-50/0 rounded-2xl transition-all duration-300"></div>
              </Link>
            ) : (
              <button
                key={action.name}
                onClick={action.action}
                className="group relative bg-white rounded-2xl p-6 lg:p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-gray-200 w-full"
              >
                <div className="text-center">
                  <div className={`w-16 h-16 lg:w-20 lg:h-20 xl:w-24 xl:h-24 ${action.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <action.icon size={28} className="lg:w-8 lg:h-8 xl:w-10 xl:h-10 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm lg:text-base xl:text-lg leading-tight group-hover:text-primary-600 transition-colors duration-200">
                    {action.name}
                  </h3>
                </div>
                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-50/0 to-primary-50/0 group-hover:from-primary-50/20 group-hover:to-primary-50/0 rounded-2xl transition-all duration-300"></div>
              </button>
            )
          ))}
        </div>
      </div>

      {/* Services Section */}
      <div className="card">
        <h2 className="text-xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-semibold mb-6 text-center">Our Services & Events</h2>
        <div className="grid grid-cols-3 gap-6">
          {/* Morning Prayer Sessions */}
          <div className="text-center p-6 bg-blue-50 rounded-xl hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                             <img src="/images/events/IMG-20250825-WA0070.jpg" alt="Prayer Room" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Morning Prayer Sessions</h3>
            <p className="text-gray-600">Daily at 4:00 AM</p>
            <p className="text-gray-500 text-sm">Harare Central Prayer Room</p>
          </div>

          {/* Weekly Service */}
          <div className="text-center p-6 bg-purple-50 rounded-xl hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                             <img src="/images/events/IMG-20250825-WA0064.jpg" alt="Main Hall" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Weekly Service</h3>
            <p className="text-gray-600">Every Sunday at 9:00 AM</p>
            <p className="text-gray-500 text-sm">Bulawayo Main Hall</p>
          </div>

          {/* Relationship Thursday */}
          <div className="text-center p-6 bg-pink-50 rounded-xl hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                             <img src="/images/events/IMG-20250825-WA0062.jpg" alt="Community Center" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Relationship Thursday</h3>
            <p className="text-gray-600">Every Thursday at 7:00 PM</p>
            <p className="text-gray-500 text-sm">Chitungwiza Community Center</p>
          </div>

          {/* Empowerment Nights */}
          <div className="text-center p-6 bg-orange-50 rounded-xl hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                             <img src="/images/events/IMG-20250825-WA0065.jpg" alt="Conference Room" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Empowerment Nights</h3>
            <p className="text-gray-600">Monthly at 6:30 PM</p>
            <p className="text-gray-500 text-sm">Mutare Conference Room</p>
          </div>

          {/* Social Dinner */}
          <div className="text-center p-6 bg-green-50 rounded-xl hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                             <img src="/images/events/IMG-20250825-WA0063.jpg" alt="Dining Hall" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Social Dinner</h3>
            <p className="text-gray-600">Quarterly at 7:00 PM</p>
            <p className="text-gray-500 text-sm">Gweru Dining Hall</p>
          </div>

          {/* Wisdom Class */}
          <div className="text-center p-6 bg-indigo-50 rounded-xl hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 overflow-hidden">
                             <img src="/images/events/IMG-20250825-WA0061.jpg" alt="Learning Center" className="w-full h-full object-cover" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Wisdom Class</h3>
            <p className="text-gray-600">Ongoing at 4:00 PM</p>
            <p className="text-gray-500 text-sm">Kwekwe Learning Center</p>
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