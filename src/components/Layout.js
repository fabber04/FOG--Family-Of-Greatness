import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Calendar, 
  Menu, 
  X,
  Bell,
  Search,
  MessageCircle,
  Library,
  Headphones,
  GraduationCap,
  HeartHandshake
} from 'lucide-react';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Event Added',
      message: 'Morning Prayer Session has been scheduled for tomorrow',
      time: '2 hours ago',
      type: 'event',
      read: false,
      target: '/events',
      specificItem: 'morning-prayer-session',
      scrollToId: 'morning-prayer-session-event'
    },
    {
      id: 2,
      title: 'Ladies Night Event',
      message: 'New photos from Ladies Night event are now available',
      time: '1 day ago',
      type: 'event',
      read: false,
      target: '/events',
      specificItem: 'ladies-night',
      scrollToId: 'ladies-night-highlight'
    },
    {
      id: 3,
      title: 'New Podcast Episode',
      message: 'New episode "Walking in Faith" is now available',
      time: '3 hours ago',
      type: 'podcast',
      read: false,
      target: '/podcasts',
      specificItem: 'walking-in-faith',
      scrollToId: 'walking-in-faith-podcast'
    },
    {
      id: 4,
      title: 'Relationship Devotional',
      message: 'New relationship devotional "Walking in Faith" is available',
      time: '2 days ago',
      type: 'devotional',
      read: true,
      target: '/devotionals',
      specificItem: 'walking-in-faith-devotional',
      scrollToId: 'walking-in-faith-devotional'
    }
  ]);
  const flyingHeartRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Library', href: '/library', icon: Library },
    { name: 'Podcasts', href: '/podcasts', icon: Headphones }, // Public podcasts page
    { name: 'Events', href: '/events', icon: Calendar },
    { name: 'Genius Academy', href: '/masterclass', icon: GraduationCap },
    { name: 'Counseling', href: '/counseling', icon: HeartHandshake },
    { name: 'Relationship Devotionals', href: '/devotionals', icon: BookOpen },
    { name: 'Prayer Requests', href: '/prayer-requests', icon: MessageCircle }
  ];

  const isActive = (path) => location.pathname === path;

  // Add flying heart animation handler
  const handleHeartClick = (e) => {
    // Only animate if the clicked icon is the Heart
    if (flyingHeartRef.current) {
      flyingHeartRef.current.classList.remove('animate-fly-heart');
    
      // Force reflow to restart animation
      void flyingHeartRef.current.offsetWidth;
      flyingHeartRef.current.classList.add('animate-fly-heart');
    }
  };

  // Mock notifications data
  const unreadCount = notifications.filter(n => !n.read).length;

  // Close notifications dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsOpen && !event.target.closest('.notifications-dropdown')) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [notificationsOpen]);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 lg:relative lg:inset-0 lg:w-80 xl:w-96 2xl:w-[28rem] bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-20 lg:h-28 xl:h-32 px-4 lg:px-8 xl:px-10 border-b border-gray-200">
          <Link to="/" className="flex items-center space-x-3 lg:space-x-4 xl:space-x-5 min-w-0 hover:opacity-80 transition-opacity duration-200">
            <div className="w-12 h-12 lg:w-16 lg:h-16 xl:w-20 xl:h-20 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-md flex-shrink-0">
              <span className="text-white font-bold text-lg lg:text-2xl xl:text-3xl">FOG</span>
            </div>
            <h1 className="text-base lg:text-xl xl:text-2xl 2xl:text-3xl font-bold text-gray-900 truncate whitespace-nowrap">FOG</h1>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="mt-8 lg:mt-12 xl:mt-16 px-4 lg:px-6 xl:px-8">
          <div className="space-y-2 lg:space-y-3 xl:space-y-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isHeart = item.name === 'Prayer Requests';
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`group flex items-center px-4 lg:px-6 xl:px-8 py-3 lg:py-4 xl:py-5 text-sm lg:text-lg xl:text-xl font-medium rounded-xl transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-primary-50 text-primary-700 border-r-4 border-primary-600 shadow-sm'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm'
                  }`}
                  onClick={(e) => {
                    setSidebarOpen(false);
                    if (isHeart) handleHeartClick(e);
                  }}
                >
                  <span className="relative">
                    <Icon
                      ref={isHeart ? flyingHeartRef : null}
                      size={20}
                      className={`mr-3 lg:mr-4 xl:mr-5 lg:w-6 lg:h-6 xl:w-7 xl:h-7 ${
                        isActive(item.href) ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-500'
                      } ${isHeart ? '' : ''}`}
                    />
                    {isHeart && (
                      <span className="absolute inset-0 pointer-events-none" style={{zIndex: 10}}></span>
                    )}
                  </span>
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Spacer to push footer down */}
        <div className="flex-1 min-h-[100px] lg:min-h-[120px] xl:min-h-[140px]"></div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full p-4 lg:p-8 xl:p-10 border-t border-gray-200 flex justify-center">
          <div className="text-center max-w-xs w-full">
            <p className="text-sm lg:text-lg xl:text-xl font-bold text-primary-700 tracking-wide">FOG</p>
            <p className="mt-2 lg:mt-3 text-xs lg:text-sm xl:text-base text-gray-500 italic">Family of Greatness</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:pl-0">
        {/* Top header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 lg:h-24 xl:h-28 px-4 sm:px-6 lg:px-12 xl:px-16 2xl:px-20">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <Menu size={20} />
              </button>
              <div className="ml-4 lg:ml-0">
                <h2 className="text-lg lg:text-3xl xl:text-4xl 2xl:text-5xl font-semibold text-gray-900">
                  {navigation.find(item => isActive(item.href))?.name || 'Dashboard'}
                </h2>
              </div>
            </div>

            <div className="flex items-center space-x-4 lg:space-x-6 xl:space-x-8">
              {/* Search */}
              <div className="relative hidden sm:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-48 lg:w-72 xl:w-80 2xl:w-96 pl-10 pr-3 py-2 lg:py-3 xl:py-4 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm lg:text-base xl:text-lg"
                />
              </div>

              {/* Notifications */}
              <div className="relative notifications-dropdown">
                <button 
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 lg:p-3 xl:p-4 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg relative"
                >
                  <Bell size={20} className="lg:w-6 lg:h-6 xl:w-7 xl:h-7" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 block h-5 w-5 lg:h-6 lg:w-6 xl:h-7 xl:w-7 rounded-full bg-red-500 text-white text-xs lg:text-sm font-medium flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 lg:w-96 xl:w-[28rem] bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <div className="p-4 lg:p-6 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg lg:text-xl font-semibold text-gray-900">Notifications</h3>
                        <button 
                          onClick={() => setNotificationsOpen(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X size={16} className="lg:w-5 lg:h-5" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 lg:p-6 text-center text-gray-500">
                          <Bell size={24} className="mx-auto mb-2 text-gray-300 lg:w-8 lg:h-8" />
                          <p className="lg:text-lg">No notifications</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`p-4 lg:p-6 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-all duration-200 ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              
                              console.log('Notification clicked:', notification.title, 'Target:', notification.target, 'ScrollTo:', notification.scrollToId);
                              
                              // Navigate to the relevant area
                              if (notification.target) {
                                // Mark as read when clicked
                                if (!notification.read) {
                                  setNotifications(prevNotifications => 
                                    prevNotifications.map(n => 
                                      n.id === notification.id ? { ...n, read: true } : n
                                    )
                                  );
                                }
                                
                                // Close dropdown first
                                setNotificationsOpen(false);
                                
                                // Navigate after dropdown closes
                                setTimeout(() => {
                                  navigate(notification.target);
                                  
                                  // Scroll to specific item if it exists
                                  if (notification.scrollToId) {
                                    setTimeout(() => {
                                      const element = document.getElementById(notification.scrollToId);
                                      if (element) {
                                        element.scrollIntoView({ 
                                          behavior: 'smooth',
                                          block: 'center'
                                        });
                                        // Highlight the element briefly
                                        element.style.transition = 'background-color 0.3s ease';
                                        element.style.backgroundColor = '#dbeafe';
                                        setTimeout(() => {
                                          element.style.backgroundColor = '';
                                        }, 2000);
                                      }
                                    }, 300);
                                  }
                                }, 150);
                              }
                            }}
                          >
                            <div className="flex items-start space-x-3 lg:space-x-4">
                              <div className={`w-2 h-2 lg:w-3 lg:h-3 rounded-full mt-2 flex-shrink-0 ${
                                notification.type === 'event' ? 'bg-blue-500' :
                                notification.type === 'prayer' ? 'bg-green-500' :
                                'bg-yellow-500'
                              }`}></div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm lg:text-base font-medium ${
                                  !notification.read ? 'text-gray-900' : 'text-gray-700'
                                }`}>
                                  {notification.title}
                                </p>
                                <p className="text-sm lg:text-base text-gray-600 mt-1 lg:mt-2">
                                  {notification.message}
                                </p>
                                <p className="text-xs lg:text-sm text-gray-400 mt-2 lg:mt-3">
                                  {notification.time}
                                </p>
                                {notification.type === 'event' && (
                                  <p className="text-xs lg:text-sm text-blue-600 mt-1 font-medium">
                                    Click to view event details →
                                  </p>
                                )}
                              </div>
                              {!notification.read && (
                                <div className="w-2 h-2 lg:w-3 lg:h-3 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    {notifications.length > 0 && (
                      <div className="p-4 lg:p-6 border-t border-gray-200">
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            // Mark all as read functionality
                            setNotifications(prevNotifications => 
                              prevNotifications.map(n => ({ ...n, read: true }))
                            );
                            setNotificationsOpen(false);
                          }}
                          className="w-full text-sm lg:text-base text-primary-600 hover:text-primary-700 font-medium"
                        >
                          Mark all as read
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-12 xl:p-16 2xl:p-20">
          <div className="max-w-none xl:max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 