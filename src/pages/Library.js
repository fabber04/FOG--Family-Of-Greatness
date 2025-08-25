import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLibrary } from '../contexts/LibraryContext';
import { 
  BookOpen, 
  Search, 
  Filter, 
  Download, 
  Heart, 
  Share2, 
  Lock,
  Unlock,
  Star,
  Clock,
  User,
  Tag,
  Calendar,
  Bookmark,
  Play,
  Eye,
  Plus,
  Upload,
  X,
  Edit3,
  Trash2
} from 'lucide-react';

const Library = () => {
  const { isAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [showAccessCodeModal, setShowAccessCodeModal] = useState(false);
  const [selectedItemForPurchase, setSelectedItemForPurchase] = useState(null);
  const [accessCode, setAccessCode] = useState('');
  const [unlockedItems, setUnlockedItems] = useState(new Set()); // Track unlocked items
  
  // Upload state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    title: '',
    author: '',
    type: 'book',
    category: 'devotional',
    description: '',
    isFree: true,
    price: '',
    accessCode: '',
    previewContent: '',
    tags: '',
    content: '',
    cover: null
  });
  const [uploading, setUploading] = useState(false);
  
  // Admin management state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  
  // Initial library items data
  const initialLibraryItems = [
    {
      id: 1,
      title: 'Walking in Faith: A Daily Devotional',
      author: 'Pastor Sarah Wilson',
      type: 'book',
      category: 'devotional',
      description: 'A comprehensive 365-day devotional guide for spiritual growth and daily reflection.',
      cover: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=center',
      isFree: true,
      previewContent: 'Faith is the foundation of our spiritual journey. Each day, we have the opportunity to grow closer to God through prayer, scripture reading, and reflection. This devotional guide provides daily insights and practical applications...',
      rating: 4.8,
      downloads: 1250,
      publishDate: '2024-01-01',
      tags: ['devotional', 'daily', 'faith', 'growth'],
      content: 'This devotional provides daily scripture readings, reflections, and practical applications for living a faith-filled life...'
    },
    {
      id: 2,
      title: 'Youth Ministry in the Digital Age',
      author: 'Mike Johnson',
      type: 'book',
      category: 'ministry',
      description: 'Modern approaches to youth ministry using technology and social media platforms.',
      cover: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=400&fit=crop&crop=center',
      isFree: false,
      price: 19.99,
      accessCode: 'YM2024',
      previewContent: 'Youth ministry in today\'s digital age requires a delicate balance between embracing technology and maintaining spiritual depth. This book explores how to leverage social media platforms, mobile apps, and digital tools to connect with young people while preserving the core message of faith...',
      rating: 4.6,
      downloads: 890,
      publishDate: '2023-12-15',
      tags: ['youth', 'ministry', 'technology', 'social media'],
      content: 'Explore innovative ways to engage young people through digital platforms while maintaining spiritual depth...'
    },
    {
      id: 3,
      title: 'Building Strong Relationships',
      author: 'Dr. Emily Brown',
      type: 'blog',
      category: 'relationships',
      description: 'A series of articles on building and maintaining healthy relationships in today\'s world.',
      cover: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=400&fit=crop&crop=center',
      isFree: true,
      previewContent: 'Building strong relationships requires intentional effort and biblical wisdom. This series explores the foundations of healthy relationships, communication skills, and conflict resolution from a Christian perspective...',
      rating: 4.7,
      views: 2100,
      publishDate: '2024-01-10',
      tags: ['relationships', 'family', 'marriage', 'friendship'],
      content: 'Healthy relationships are the foundation of a fulfilling life. This series explores biblical principles...'
    },
    {
      id: 4,
      title: 'Prayer Warriors: A Guide to Intercessory Prayer',
      author: 'Rev. David Smith',
      type: 'book',
      category: 'prayer',
      description: 'Learn the art and power of intercessory prayer for yourself and others.',
      cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop&crop=center',
      isFree: false,
      price: 24.99,
      accessCode: 'PW2024',
      previewContent: 'Intercessory prayer is one of the most powerful forms of spiritual warfare. When we pray for others, we become conduits of God\'s grace and mercy. This guide will teach you how to develop a consistent prayer life and intercede effectively for those around you...',
      rating: 4.9,
      downloads: 1560,
      publishDate: '2023-11-20',
      tags: ['prayer', 'intercession', 'spiritual warfare', 'faith'],
      content: 'Discover the transformative power of praying for others and how it can change lives...'
    },
    {
      id: 5,
      title: 'Daily Wisdom Quotes Collection',
      author: 'FOG Community',
      type: 'quotes',
      category: 'wisdom',
      description: 'A curated collection of inspiring quotes from spiritual leaders and scripture.',
      cover: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=400&fit=crop&crop=center',
      isFree: true,
      rating: 4.5,
      views: 3400,
      publishDate: '2024-01-05',
      tags: ['quotes', 'wisdom', 'inspiration', 'daily'],
      content: 'Start each day with wisdom and inspiration from these carefully selected quotes...'
    },
    {
      id: 6,
      title: 'Financial Stewardship for Christians',
      author: 'Financial Ministry Team',
      type: 'book',
      category: 'finance',
      description: 'Biblical principles for managing money and resources according to God\'s plan.',
      cover: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=300&h=400&fit=crop&crop=center',
      isFree: false,
      price: 29.99,
      accessCode: 'FS2024',
      previewContent: 'Financial stewardship is not just about managing money—it\'s about honoring God with everything we have. This book provides biblical principles for budgeting, saving, investing, and giving, helping you build a solid financial foundation that glorifies God...',
      rating: 4.4,
      downloads: 720,
      publishDate: '2023-10-30',
      tags: ['finance', 'stewardship', 'biblical', 'money management'],
      content: 'Learn how to honor God with your finances and build a secure financial future...'
    },
    {
      id: 7,
      title: 'Biblical Leadership Principles',
      author: 'Dr. James Anderson',
      type: 'book',
      category: 'leadership',
      description: 'Essential leadership principles drawn from biblical examples and modern applications.',
      cover: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=400&fit=crop&crop=center',
      isFree: false,
      price: 22.99,
      accessCode: 'BL2024',
      previewContent: 'Biblical leadership is fundamentally different from worldly leadership. It\'s about serving others, leading with humility, and following Christ\'s example. This book examines leadership principles from both the Old and New Testaments...',
      rating: 4.7,
      downloads: 980,
      publishDate: '2023-09-15',
      tags: ['leadership', 'biblical', 'management', 'servant leadership'],
      content: 'Discover how biblical leadership principles can transform your approach to leading others...'
    },
    {
      id: 8,
      title: 'Family Devotionals for All Ages',
      author: 'Family Ministry Team',
      type: 'book',
      category: 'family',
      description: 'Interactive devotionals designed for families to grow together in faith.',
      cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&h=400&fit=crop&crop=center',
      isFree: true,
      previewContent: 'Family devotionals create opportunities for spiritual growth and meaningful conversations. These interactive sessions are designed to engage family members of all ages in learning and growing together...',
      rating: 4.6,
      downloads: 2100,
      publishDate: '2024-01-08',
      tags: ['family', 'devotional', 'children', 'togetherness'],
      content: 'Strengthen family bonds through shared spiritual experiences and meaningful conversations...'
    },
    {
      id: 9,
      title: 'Worship Through Music',
      author: 'Worship Ministry',
      type: 'blog',
      category: 'worship',
      description: 'Exploring the power of music in worship and spiritual connection.',
      cover: 'https://images.unsplash.com/photo-1493225457124-a3eb192ff757?w=300&h=400&fit=crop&crop=center',
      isFree: true,
      previewContent: 'Music has the power to connect us with God in profound ways. This blog explores how different musical styles and worship practices can enhance our spiritual experience and deepen our connection with the divine...',
      rating: 4.8,
      views: 1800,
      publishDate: '2024-01-12',
      tags: ['worship', 'music', 'praise', 'spiritual connection'],
      content: 'Discover how music can deepen your worship experience and connect you with God...'
    }
  ];

  // State for library items - this ensures updates trigger re-renders
  const [libraryItems, setLibraryItems] = useState(initialLibraryItems);

  // Use useMemo to recalculate categories and types when libraryItems changes
  const categories = React.useMemo(() => [
    { id: 'all', name: 'All Categories', count: libraryItems.length },
    { id: 'devotional', name: 'Devotionals', count: libraryItems.filter(item => item.category === 'devotional').length },
    { id: 'ministry', name: 'Ministry', count: libraryItems.filter(item => item.category === 'ministry').length },
    { id: 'relationships', name: 'Relationships', count: libraryItems.filter(item => item.category === 'relationships').length },
    { id: 'prayer', name: 'Prayer', count: libraryItems.filter(item => item.category === 'prayer').length },
    { id: 'wisdom', name: 'Wisdom', count: libraryItems.filter(item => item.category === 'wisdom').length },
    { id: 'finance', name: 'Finance', count: libraryItems.filter(item => item.category === 'finance').length },
    { id: 'leadership', name: 'Leadership', count: libraryItems.filter(item => item.category === 'leadership').length },
    { id: 'family', name: 'Family', count: libraryItems.filter(item => item.category === 'family').length },
    { id: 'worship', name: 'Worship', count: libraryItems.filter(item => item.category === 'worship').length }
  ], [libraryItems]);

  const types = React.useMemo(() => [
    { id: 'all', name: 'All Types', count: libraryItems.length },
    { id: 'book', name: 'Books', count: libraryItems.filter(item => item.type === 'book').length },
    { id: 'blog', name: 'Blogs', count: libraryItems.filter(item => item.type === 'blog').length },
    { id: 'quotes', name: 'Quotes', count: libraryItems.filter(item => item.type === 'quotes').length }
  ], [libraryItems]);

  const filteredItems = libraryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const handleDownload = (item) => {
    if (item.isFree) {
      alert(`Downloading ${item.title}...`);
    } else {
      alert(`Redirecting to payment for ${item.title}...`);
    }
  };

  const handlePreview = (item) => {
    setSelectedItem(item);
    setPreviewMode(true);
  };

  const handlePurchase = (item) => {
    setSelectedItemForPurchase(item);
    setShowAccessCodeModal(true);
  };

  const confirmAccessCode = () => {
    if (selectedItemForPurchase && accessCode.trim()) {
      if (accessCode.toUpperCase() === selectedItemForPurchase.accessCode) {
        setUnlockedItems(prev => new Set([...prev, selectedItemForPurchase.id]));
        setShowAccessCodeModal(false);
        setSelectedItemForPurchase(null);
        setAccessCode('');
        alert(`Successfully unlocked "${selectedItemForPurchase.title}"! You now have full access to this content.`);
      } else {
        alert('Invalid access code. Please check your email for the correct code.');
      }
    }
  };

  const isItemUnlocked = (item) => {
    return item.isFree || unlockedItems.has(item.id);
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'book':
        return <BookOpen className="w-5 h-5" />;
      case 'blog':
        return <Bookmark className="w-5 h-5" />;
      case 'quotes':
        return <Star className="w-5 h-5" />;
      default:
        return <BookOpen className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'book':
        return 'bg-blue-100 text-blue-800';
      case 'blog':
        return 'bg-green-100 text-green-800';
      case 'quotes':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Upload functions
  const handleUpload = () => {
    setShowUploadModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadForm(prev => ({ ...prev, cover: file }));
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create new item
      const newItem = {
        id: Date.now(), // Use timestamp for unique ID
        title: uploadForm.title,
        author: uploadForm.author,
        type: uploadForm.type,
        category: uploadForm.category,
        description: uploadForm.description,
        isFree: uploadForm.isFree,
        price: uploadForm.isFree ? null : parseFloat(uploadForm.price),
        accessCode: uploadForm.isFree ? null : uploadForm.accessCode,
        previewContent: uploadForm.previewContent,
        content: uploadForm.content,
        tags: uploadForm.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        cover: uploadForm.cover ? URL.createObjectURL(uploadForm.cover) : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=center',
        rating: 0,
        downloads: 0,
        views: 0,
        publishDate: new Date().toISOString().split('T')[0]
      };
      
      // Add to library (in a real app, this would be sent to backend)
      setLibraryItems(prevItems => [newItem, ...prevItems]);
      
      // Reset form and close modal
      setUploadForm({
        title: '',
        author: '',
        type: 'book',
        category: 'devotional',
        description: '',
        isFree: true,
        price: '',
        accessCode: '',
        previewContent: '',
        content: '',
        tags: '',
        cover: null
      });
      setShowUploadModal(false);
      
      alert('Material uploaded successfully!');
    } catch (error) {
      alert('Error uploading material. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const resetUploadForm = () => {
    setUploadForm({
      title: '',
      author: '',
      type: 'book',
      category: 'devotional',
      description: '',
      isFree: true,
      price: '',
      accessCode: '',
      previewContent: '',
      content: '',
      tags: '',
      cover: null
    });
  };

  // Admin management functions
  const handleEdit = (item) => {
    setEditingItem({ ...item });
    setShowEditModal(true);
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      setLibraryItems(prevItems => prevItems.filter(item => item.id !== itemToDelete.id));
      setItemToDelete(null);
      setShowDeleteConfirm(false);
      alert(`"${itemToDelete.title}" has been removed from the library.`);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      // Simulate update process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the item in the library
      setLibraryItems(prevItems => 
        prevItems.map(item => 
          item.id === editingItem.id 
            ? {
                ...item,
                title: editingItem.title,
                author: editingItem.author,
                type: editingItem.type,
                category: editingItem.category,
                description: editingItem.description,
                isFree: editingItem.isFree,
                price: editingItem.isFree ? null : parseFloat(editingItem.price),
                accessCode: editingItem.isFree ? null : editingItem.accessCode,
                previewContent: editingItem.previewContent,
                content: editingItem.content,
                tags: typeof editingItem.tags === 'string' 
                  ? editingItem.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
                  : editingItem.tags
              }
            : item
        )
      );
      
      setShowEditModal(false);
      setEditingItem(null);
      alert('Material updated successfully!');
    } catch (error) {
      console.error('Edit error:', error);
      alert('Error updating material. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const resetEditForm = () => {
    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Digital Library</h1>
              <p className="mt-2 text-gray-600">Access free and premium spiritual resources, books, and content</p>
            </div>
            
            {/* Upload Button for Admin */}
            {isAdmin() && (
              <button
                onClick={handleUpload}
                className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors duration-200"
              >
                <Plus className="w-5 h-5 mr-2" />
                Upload Material
              </button>
            )}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search library content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name} ({category.count})
                </option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {types.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name} ({type.count})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Library Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
              {/* Cover Image */}
              <div className="relative">
                <img
                  src={item.cover}
                  alt={item.title}
                  className="w-full h-64 object-cover bg-gray-100"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=center';
                  }}
                />
                {/* Gradient overlay for better badge readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none"></div>
                <div className="absolute top-2 right-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
                    {getTypeIcon(item.type)}
                    <span className="ml-1 capitalize">{item.type}</span>
                  </span>
                </div>
                {!item.isFree && (
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                      <Lock className="w-3 h-3 mr-1" />
                      ${item.price}
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>
                
                {/* Author and Date */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-1" />
                    {item.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(item.publishDate).toLocaleDateString()}
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    {item.rating}
                  </div>
                  <div className="flex items-center">
                    {item.downloads ? (
                      <>
                        <Download className="w-4 h-4 mr-1" />
                        {item.downloads}
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-1" />
                        {item.views}
                      </>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {item.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>

                                                 {/* Actions */}
                 <div className="flex space-x-2">
                   {isItemUnlocked(item) ? (
                     <button
                       onClick={() => handleDownload(item)}
                       className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
                     >
                       <Download className="w-4 h-4 mr-2" />
                       {item.isFree ? 'Download' : 'Access Full Content'}
                     </button>
                   ) : (
                     <button
                       onClick={() => handlePurchase(item)}
                       className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-secondary-600 rounded-lg hover:bg-secondary-700"
                     >
                       <Lock className="w-4 h-4 mr-2" />
                       Purchase ${item.price}
                     </button>
                   )}
                   
                   <button
                     onClick={() => handlePreview(item)}
                     className="px-3 py-2 text-sm font-medium text-primary-600 border border-primary-300 rounded-lg hover:bg-primary-50"
                   >
                     <Eye className="w-4 h-4 mr-2" />
                     Preview
                   </button>
                 </div>
                 
                 {/* Admin Actions */}
                 {isAdmin() && (
                   <div className="flex space-x-2 mt-3 pt-3 border-t border-gray-100">
                     <button
                       onClick={() => handleEdit(item)}
                       className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
                     >
                       <Edit3 className="w-4 h-4 mr-2" />
                       Edit
                     </button>
                     <button
                       onClick={() => handleDelete(item)}
                       className="flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                     >
                       <Trash2 className="w-4 h-4 mr-2" />
                       Delete
                     </button>
                   </div>
                 )}
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No content found</h3>
            <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {/* Item Details Modal */}
        {selectedItem && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-medium text-gray-900">{selectedItem.title}</h3>
                  <button
                    onClick={() => {
                      setSelectedItem(null);
                      setPreviewMode(false);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Cover */}
                  <div>
                    <img
                      src={selectedItem.cover}
                      alt={selectedItem.title}
                      className="w-full rounded-lg bg-gray-100"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=400&fit=crop&crop=center';
                      }}
                    />
                  </div>
                  
                  {/* Details */}
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-2">{selectedItem.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="w-4 h-4 mr-2" />
                        {selectedItem.author}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 mr-1" />
                        {selectedItem.rating}
                      </div>
                      <div className="flex items-center">
                        {selectedItem.downloads ? (
                          <>
                            <Download className="w-4 h-4 mr-1" />
                            {selectedItem.downloads} downloads
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-1" />
                            {selectedItem.views} views
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Tags</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedItem.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-4">
                      {selectedItem.isFree ? (
                        <button
                          onClick={() => handleDownload(selectedItem)}
                          className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Free
                        </button>
                                             ) : (
                         <div className="space-y-3">
                           <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                             <div className="text-center">
                               <span className="text-sm font-medium text-orange-800">
                                 Premium Content - ${selectedItem.price}
                               </span>
                               <p className="text-xs text-orange-600 mt-1">
                                 Purchase to receive access code via email
                               </p>
                             </div>
                           </div>
                           <button
                             onClick={() => handlePurchase(selectedItem)}
                             className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-secondary-600 rounded-lg hover:bg-secondary-700"
                           >
                             <Lock className="w-4 h-4 mr-2" />
                             Purchase & Get Access Code
                           </button>
                         </div>
                       )}
                    </div>
                  </div>
                </div>

                {/* Preview Content */}
                {selectedItem.previewContent && (
                  <div className="mt-6 border-t pt-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-3">
                      {previewMode ? 'Preview' : 'Sample Content'}
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                                           <p className="text-gray-700 leading-relaxed">
                       {previewMode && !isItemUnlocked(selectedItem) ? (
                         <>
                           {selectedItem.previewContent}
                           <span className="block mt-3 text-sm text-gray-500 italic">
                             ... This is a preview. Purchase this content for ${selectedItem.price} to receive an access code via email and unlock the full content.
                           </span>
                         </>
                       ) : (
                         selectedItem.previewContent
                       )}
                     </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Access Code Modal */}
        {showAccessCodeModal && selectedItemForPurchase && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-primary-100 rounded-full mb-4">
                  <Lock className="w-6 h-6 text-primary-600" />
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                  Enter Access Code
                </h3>
                <p className="text-sm text-gray-600 text-center mb-6">
                  Please enter the access code you received via email for "{selectedItemForPurchase.title}"
                </p>
                
                <div className="mb-6">
                  <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Access Code
                  </label>
                  <input
                    type="text"
                    id="accessCode"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    placeholder="Enter your access code"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">How to get your access code:</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                      <li>Complete your purchase for ${selectedItemForPurchase.price}</li>
                      <li>Check your email for the access code</li>
                      <li>Enter the code above to unlock content</li>
                    </ol>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowAccessCodeModal(false);
                      setSelectedItemForPurchase(null);
                      setAccessCode('');
                    }}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmAccessCode}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
                  >
                    Unlock Content
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-medium text-gray-900">Upload New Material</h3>
                  <button
                    onClick={() => {
                      setShowUploadModal(false);
                      resetUploadForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <form onSubmit={handleUploadSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                          Title *
                        </label>
                        <input
                          type="text"
                          id="title"
                          required
                          value={uploadForm.title}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter material title"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                          Author *
                        </label>
                        <input
                          type="text"
                          id="author"
                          required
                          value={uploadForm.author}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, author: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter author name"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                            Type *
                          </label>
                          <select
                            id="type"
                            required
                            value={uploadForm.type}
                            onChange={(e) => setUploadForm(prev => ({ ...prev, type: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          >
                            <option value="book">Book</option>
                            <option value="blog">Blog</option>
                            <option value="quotes">Quotes</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                            Category *
                          </label>
                          <select
                            id="category"
                            required
                            value={uploadForm.category}
                            onChange={(e) => setUploadForm(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          >
                            {categories.filter(cat => cat.id !== 'all').map(category => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                          Description *
                        </label>
                        <textarea
                          id="description"
                          required
                          rows={3}
                          value={uploadForm.description}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter material description"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                          Tags
                        </label>
                        <input
                          type="text"
                          id="tags"
                          value={uploadForm.tags}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, tags: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter tags separated by commas"
                        />
                      </div>
                    </div>
                    
                    {/* Right Column */}
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="cover" className="block text-sm font-medium text-gray-700 mb-2">
                          Cover Image
                        </label>
                        <input
                          type="file"
                          id="cover"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        {uploadForm.cover && (
                          <div className="mt-2">
                            <img
                              src={URL.createObjectURL(uploadForm.cover)}
                              alt="Preview"
                              className="w-32 h-32 object-cover rounded-lg border"
                            />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="isFree"
                          checked={uploadForm.isFree}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, isFree: e.target.checked }))}
                          className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="isFree" className="text-sm font-medium text-gray-700">
                          Free Material
                        </label>
                      </div>
                      
                      {!uploadForm.isFree && (
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                              Price *
                            </label>
                            <input
                              type="number"
                              id="price"
                              required={!uploadForm.isFree}
                              step="0.01"
                              min="0"
                              value={uploadForm.price}
                              onChange={(e) => setUploadForm(prev => ({ ...prev, price: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              placeholder="Enter price"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-2">
                              Access Code *
                            </label>
                            <input
                              type="text"
                              id="accessCode"
                              required={!uploadForm.isFree}
                              value={uploadForm.accessCode}
                              onChange={(e) => setUploadForm(prev => ({ ...prev, accessCode: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              placeholder="Enter access code"
                            />
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <label htmlFor="previewContent" className="block text-sm font-medium text-gray-700 mb-2">
                          Preview Content
                        </label>
                        <textarea
                          id="previewContent"
                          rows={4}
                          value={uploadForm.previewContent}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, previewContent: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter preview content"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Content
                        </label>
                        <textarea
                          id="content"
                          rows={4}
                          value={uploadForm.content}
                          onChange={(e) => setUploadForm(prev => ({ ...prev, content: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter full content"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowUploadModal(false);
                        resetUploadForm();
                      }}
                      className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploading}
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading ? (
                        <>
                          <Upload className="w-4 h-4 inline mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4 inline mr-2" />
                          Upload Material
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && editingItem && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-medium text-gray-900">Edit Material</h3>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      resetEditForm();
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <form onSubmit={handleEditSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="edit-title" className="block text-sm font-medium text-gray-700 mb-2">
                          Title *
                        </label>
                        <input
                          type="text"
                          id="edit-title"
                          required
                          value={editingItem.title}
                          onChange={(e) => setEditingItem(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter material title"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="edit-author" className="block text-sm font-medium text-gray-700 mb-2">
                          Author *
                        </label>
                        <input
                          type="text"
                          id="edit-author"
                          required
                          value={editingItem.author}
                          onChange={(e) => setEditingItem(prev => ({ ...prev, author: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter author name"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="edit-type" className="block text-sm font-medium text-gray-700 mb-2">
                            Type *
                          </label>
                          <select
                            id="edit-type"
                            required
                            value={editingItem.type}
                            onChange={(e) => setEditingItem(prev => ({ ...prev, type: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          >
                            <option value="book">Book</option>
                            <option value="blog">Blog</option>
                            <option value="quotes">Quotes</option>
                          </select>
                        </div>
                        
                        <div>
                          <label htmlFor="edit-category" className="block text-sm font-medium text-gray-700 mb-2">
                            Category *
                          </label>
                          <select
                            id="edit-category"
                            required
                            value={editingItem.category}
                            onChange={(e) => setEditingItem(prev => ({ ...prev, category: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          >
                            {categories.filter(cat => cat.id !== 'all').map(category => (
                              <option key={category.id} value={category.id}>
                                {category.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700 mb-2">
                          Description *
                        </label>
                        <textarea
                          id="edit-description"
                          required
                          rows={3}
                          value={editingItem.description}
                          onChange={(e) => setEditingItem(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter material description"
                        />
                      </div>
                      
                                             <div>
                         <label htmlFor="edit-tags" className="block text-sm font-medium text-gray-700 mb-2">
                           Tags
                         </label>
                         <input
                           type="text"
                           id="edit-tags"
                           value={Array.isArray(editingItem.tags) ? editingItem.tags.join(', ') : editingItem.tags || ''}
                           onChange={(e) => setEditingItem(prev => ({ ...prev, tags: e.target.value }))}
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                           placeholder="Enter tags separated by commas"
                         />
                       </div>
                    </div>
                    
                    {/* Right Column */}
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="edit-isFree"
                          checked={editingItem.isFree}
                          onChange={(e) => setEditingItem(prev => ({ ...prev, isFree: e.target.checked }))}
                          className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="edit-isFree" className="text-sm font-medium text-gray-700">
                          Free Material
                        </label>
                      </div>
                      
                      {!editingItem.isFree && (
                        <div className="space-y-4">
                          <div>
                            <label htmlFor="edit-price" className="block text-sm font-medium text-gray-700 mb-2">
                              Price *
                            </label>
                            <input
                              type="number"
                              id="edit-price"
                              required={!editingItem.isFree}
                              step="0.01"
                              min="0"
                              value={editingItem.price || ''}
                              onChange={(e) => setEditingItem(prev => ({ ...prev, price: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              placeholder="Enter price"
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="edit-accessCode" className="block text-sm font-medium text-gray-700 mb-2">
                              Access Code *
                            </label>
                            <input
                              type="text"
                              id="edit-accessCode"
                              required={!editingItem.isFree}
                              value={editingItem.accessCode || ''}
                              onChange={(e) => setEditingItem(prev => ({ ...prev, accessCode: e.target.value }))}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              placeholder="Enter access code"
                            />
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <label htmlFor="edit-previewContent" className="block text-sm font-medium text-gray-700 mb-2">
                          Preview Content
                        </label>
                        <textarea
                          id="edit-previewContent"
                          rows={4}
                          value={editingItem.previewContent || ''}
                          onChange={(e) => setEditingItem(prev => ({ ...prev, previewContent: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter preview content"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="edit-content" className="block text-sm font-medium text-gray-700 mb-2">
                          Full Content
                        </label>
                        <textarea
                          id="edit-content"
                          rows={4}
                          value={editingItem.content || ''}
                          onChange={(e) => setEditingItem(prev => ({ ...prev, content: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          placeholder="Enter full content"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-3 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setShowEditModal(false);
                        resetEditForm();
                      }}
                      className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={uploading}
                      className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {uploading ? (
                        <>
                          <Upload className="w-4 h-4 inline mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Edit3 className="w-4 h-4 inline mr-2" />
                          Update Material
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && itemToDelete && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-full max-w-md shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                
                <h3 className="text-lg font-medium text-gray-900 text-center mb-2">
                  Delete Material
                </h3>
                <p className="text-sm text-gray-600 text-center mb-6">
                  Are you sure you want to delete "{itemToDelete.title}"? This action cannot be undone.
                </p>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowDeleteConfirm(false);
                      setItemToDelete(null);
                    }}
                    className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
