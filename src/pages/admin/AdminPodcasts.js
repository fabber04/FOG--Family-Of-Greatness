import React, { useState, useEffect } from 'react';
import { 
  Headphones, 
  Plus, 
  Eye,
  X,
  Upload,
  Loader2,
  Trash2,
  Edit,
  ExternalLink,
  FileAudio
} from 'lucide-react';
import { podcastService } from '../../services/apiService';
import { convertDriveToDirectLink, convertDriveToEmbedLink, isGoogleDriveLink, isDriveFolderLink } from '../../utils/googleDrive';
import toast from 'react-hot-toast';

const AdminPodcasts = () => {
  const [podcasts, setPodcasts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPodcast, setEditingPodcast] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    host: '',
    type: 'episode',
    category: 'spiritual-development',
    description: '',
    duration: '',
    is_live: false,
    is_free: true,
    tags: '',
    audio_url: '',
    audio_file: null,
    transcript: '',
    cover: null
  });

  const categories = [
    'spiritual-development',
    'relationships',
    'personal-development',
    'wisdom-keys',
    'beyond-dating-game',
    'wisdom-for-ladies',
    'teens',
    'university-students'
  ];

  const types = ['episode', 'live', 'series'];

  useEffect(() => {
    loadPodcasts();
  }, []);

  const loadPodcasts = async () => {
    try {
      setLoading(true);
      const data = await podcastService.getPodcasts();
      setPodcasts(data);
    } catch (error) {
      console.error('Error loading podcasts:', error);
      toast.error('Failed to load podcasts');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let audioUrl = formData.audio_url;
      
      // If audio file is uploaded, use that instead of URL
      if (formData.audio_file) {
        const audioUploadResult = await podcastService.uploadPodcastAudio(formData.audio_file);
        audioUrl = audioUploadResult.url; // This will be /uploads/podcasts/audio/filename
        toast.success('Audio file uploaded successfully!');
      } else if (audioUrl && isGoogleDriveLink(audioUrl)) {
        // Convert Google Drive link if provided
        audioUrl = convertDriveToEmbedLink(audioUrl) || convertDriveToDirectLink(audioUrl);
        if (!audioUrl) {
          toast.error('Invalid Google Drive link');
          return;
        }
      } else if (!audioUrl && !formData.audio_file) {
        toast.error('Please either upload an audio file or provide a Google Drive link');
        return;
      }

      const podcastData = {
        title: formData.title,
        host: formData.host,
        type: formData.type,
        category: formData.category,
        description: formData.description,
        duration: formData.duration || null,
        is_live: formData.is_live,
        is_free: formData.is_free,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).join(',') : null,
        audio_url: audioUrl || null,
        transcript: formData.transcript || null,
        cover: formData.cover || null
      };

      if (editingPodcast) {
        await podcastService.updatePodcast(editingPodcast.id, podcastData);
        toast.success('Podcast updated successfully!');
      } else {
        await podcastService.createPodcast(podcastData);
        toast.success('Podcast created successfully!');
      }

      setShowForm(false);
      resetForm();
      loadPodcasts();
    } catch (error) {
      console.error('Error saving podcast:', error);
      toast.error(error.message || 'Failed to save podcast');
    }
  };

  const handleEdit = (podcast) => {
    setEditingPodcast(podcast);
    setFormData({
      title: podcast.title || '',
      host: podcast.host || '',
      type: podcast.type || 'episode',
      category: podcast.category || 'spiritual-development',
      description: podcast.description || '',
      duration: podcast.duration || '',
      is_live: podcast.is_live || false,
      is_free: podcast.is_free !== undefined ? podcast.is_free : true,
      tags: podcast.tags ? (Array.isArray(podcast.tags) ? podcast.tags.join(', ') : podcast.tags) : '',
      audio_url: podcast.audio_url || '',
      audio_file: null, // Don't pre-populate file input
      transcript: podcast.transcript || '',
      cover: podcast.cover || null
    });
    setShowForm(true);
  };

  const handleDelete = async (podcastId) => {
    if (!window.confirm('Are you sure you want to delete this podcast?')) {
      return;
    }

    try {
      await podcastService.deletePodcast(podcastId);
      toast.success('Podcast deleted successfully!');
      loadPodcasts();
    } catch (error) {
      console.error('Error deleting podcast:', error);
      toast.error('Failed to delete podcast');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      host: '',
      type: 'episode',
      category: 'spiritual-development',
      description: '',
      duration: '',
      is_live: false,
      is_free: true,
      tags: '',
      audio_url: '',
      audio_file: null,
      transcript: '',
      cover: null
    });
    setEditingPodcast(null);
  };

  const handleCoverUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const result = await podcastService.uploadPodcastCover(file);
      // Store the full URL path, not just filename
      setFormData({ ...formData, cover: result.url || `/uploads/podcasts/${result.filename}` });
      toast.success('Cover image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading cover:', error);
      toast.error('Failed to upload cover image');
    }
  };

  const handleDriveLinkChange = (e) => {
    const url = e.target.value;
    setFormData({ ...formData, audio_url: url });
    
    // Check if it's a folder link
    if (url && isDriveFolderLink(url)) {
      toast.error('Please use individual file links, not folder links. Right-click on a file in the folder and select "Get link".', { duration: 5000 });
      return;
    }
    
    // Show helpful message if it's a Google Drive file link
    if (url && isGoogleDriveLink(url)) {
      const converted = convertDriveToEmbedLink(url);
      if (converted) {
        toast.success('Google Drive link detected! It will be converted automatically.', { duration: 3000 });
      } else {
        toast.error('Invalid Google Drive link. Please use a share link for an individual file.', { duration: 4000 });
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Add Button */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Manage Podcasts</h1>
            <p className="mt-1 text-sm text-gray-600">
              {podcasts.length} {podcasts.length === 1 ? 'podcast' : 'podcasts'} uploaded
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow-sm"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Podcast
          </button>
        </div>

        {/* Uploaded Content - Podcasts List */}
        {podcasts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {podcasts.map((podcast) => (
              <div key={podcast.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {podcast.cover && (
                  <img
                    src={`http://localhost:8000/uploads/podcasts/${podcast.cover}`}
                    alt={podcast.title}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-semibold text-gray-900 line-clamp-2 flex-1">{podcast.title}</h3>
                    {podcast.is_live && (
                      <span className="px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded ml-2 flex-shrink-0">Live</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mb-2">Host: {podcast.host}</p>
                  <p className="text-xs text-gray-600 mb-3 line-clamp-2">{podcast.description}</p>
                  <div className="flex items-center gap-1 mb-3 flex-wrap">
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">{podcast.type}</span>
                    <span className="text-xs px-2 py-0.5 bg-green-100 text-green-800 rounded">{podcast.category}</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(podcast)}
                      className="flex-1 flex items-center justify-center px-2 py-1.5 text-xs bg-primary-50 text-primary-600 rounded hover:bg-primary-100"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(podcast.id)}
                      className="px-2 py-1.5 text-xs bg-red-50 text-red-600 rounded hover:bg-red-100"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    {podcast.audio_url && (
                      <a
                        href={podcast.audio_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1.5 text-xs bg-gray-50 text-gray-600 rounded hover:bg-gray-100"
                        title="Open Audio"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
            <Headphones className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No podcasts uploaded yet</h3>
            <p className="text-sm text-gray-500 mb-6">Get started by uploading your first podcast</p>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add First Podcast
            </button>
          </div>
        )}


        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold">{editingPodcast ? 'Edit Podcast' : 'Add Podcast'}</h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Host *</label>
                    <input
                      type="text"
                      required
                      value={formData.host}
                      onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      {types.map(type => (
                        <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>
                          {cat.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                    <input
                      type="text"
                      placeholder="e.g., 15:30 or Live"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                    <input
                      type="text"
                      placeholder="spiritual, faith, inspiration"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Audio File *
                  </label>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setFormData({ ...formData, audio_file: file, audio_url: '' });
                        toast.success('Audio file selected. You can also provide a Google Drive link as alternative.');
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <p className="mt-1 text-xs text-gray-500 mb-3">
                    Upload audio file directly (MP3, M4A, WAV, OGG, AAC) or use Google Drive link below.
                  </p>
                  
                  {formData.audio_file && (
                    <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileAudio className="w-4 h-4 text-green-600" />
                        <p className="text-sm text-green-800">
                          Selected: {formData.audio_file.name} ({(formData.audio_file.size / 1024 / 1024).toFixed(2)} MB)
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, audio_file: null })}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                  
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-2 bg-white text-gray-500">OR</span>
                    </div>
                  </div>
                  
                  <label className="block text-sm font-medium text-gray-700 mb-1 mt-3">
                    Google Drive Link (Alternative)
                  </label>
                  <input
                    type="text"
                    placeholder="https://drive.google.com/file/d/FILE_ID/view?usp=sharing"
                    value={formData.audio_url}
                    onChange={handleDriveLinkChange}
                    disabled={!!formData.audio_file}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.audio_file ? 'File upload takes priority. Clear file to use Google Drive link.' : 'Paste your Google Drive share link as an alternative to file upload.'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transcript</label>
                  <textarea
                    value={formData.transcript}
                    onChange={(e) => setFormData({ ...formData, transcript: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    placeholder="Optional transcript of the podcast..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_live}
                      onChange={(e) => setFormData({ ...formData, is_live: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Live Podcast</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.is_free}
                      onChange={(e) => setFormData({ ...formData, is_free: e.target.checked })}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">Free</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    {editingPodcast ? 'Update Podcast' : 'Create Podcast'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPodcasts;

