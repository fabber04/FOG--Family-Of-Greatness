import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize2, Download, SkipBack, SkipForward, X } from 'lucide-react';
import { getAuthToken } from '../services/apiService';

// Use the same API base URL logic as apiService.js
const API_BASE_URL = process.env.REACT_APP_API_URL || 
  (typeof window !== 'undefined' && 
   (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:8000'
    : 'https://fog-backend-iyhz.onrender.com');

const AudioPlayer = ({ audioUrl, podcastId, podcastTitle, podcastCover, onClose }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  // Get playable URL - handle local files and Google Drive links
  const getPlayableUrl = () => {
    if (!audioUrl || audioUrl === '#' || audioUrl === 'null' || audioUrl === 'undefined') {
      console.warn('AudioPlayer: No audio URL provided');
      return null;
    }
    
    console.log('AudioPlayer: Processing audio URL:', audioUrl);
    
    // If it's a local storage URL (/storage/... or /uploads/...), prefer streaming endpoint for tracking
    if (audioUrl.includes('/storage/') || audioUrl.includes('/uploads/')) {
      // If we have a podcastId, use streaming endpoint for play count tracking
      if (podcastId) {
        const streamUrl = `${API_BASE_URL}/api/podcasts/${podcastId}/stream`;
        console.log('AudioPlayer: Using stream endpoint for local file:', streamUrl);
        return streamUrl;
      }
      
      // Already a full URL
      if (audioUrl.startsWith('http://') || audioUrl.startsWith('https://')) {
        console.log('AudioPlayer: Using full URL:', audioUrl);
        return audioUrl;
      }
      // Convert relative URL to absolute
      const fullUrl = `${API_BASE_URL}${audioUrl}`;
      console.log('AudioPlayer: Converted to full URL:', fullUrl);
      return fullUrl;
    }
    
    // For Google Drive links, use streaming endpoint if podcastId available (for play tracking)
    // Otherwise convert to direct link
    if (audioUrl.includes('drive.google.com')) {
      if (podcastId) {
        // Use streaming endpoint for play count tracking
        const streamUrl = `${API_BASE_URL}/api/podcasts/${podcastId}/stream`;
        console.log('AudioPlayer: Using stream endpoint:', streamUrl);
        return streamUrl;
      }
      
      // Convert Google Drive share link to direct link
      if (audioUrl.includes('drive.google.com/uc?export=open')) {
        console.log('AudioPlayer: Using direct Google Drive URL:', audioUrl);
        return audioUrl;
      }
      
      // Extract file ID and convert
      const match = audioUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || audioUrl.match(/[?&]id=([a-zA-Z0-9_-]+)/);
      if (match) {
        const driveUrl = `https://drive.google.com/uc?export=open&id=${match[1]}`;
        console.log('AudioPlayer: Converted Google Drive URL:', driveUrl);
        return driveUrl;
      }
    }
    
    // If it's already a full URL, return as-is
    if (audioUrl.startsWith('http://') || audioUrl.startsWith('https://')) {
      console.log('AudioPlayer: Using provided full URL:', audioUrl);
      return audioUrl;
    }
    
    // Last resort: try to construct URL
    const constructedUrl = audioUrl.startsWith('/') 
      ? `${API_BASE_URL}${audioUrl}`
      : `${API_BASE_URL}/${audioUrl}`;
    console.log('AudioPlayer: Constructed URL:', constructedUrl);
    return constructedUrl;
  };

  const playableUrl = getPlayableUrl();

  // Update audio source when URL changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) {
      console.warn('AudioPlayer: Audio element not found');
      return;
    }
    
    if (!playableUrl) {
      console.warn('AudioPlayer: No playable URL available');
      return;
    }
    
    console.log('AudioPlayer: Setting audio source to:', playableUrl);
    
    // Reset state when URL changes
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    
    // Set the source and load
    audio.src = playableUrl;
    audio.load();
    
    // Add error handler for debugging
    const handleLoadError = (e) => {
      console.error('AudioPlayer: Error loading audio:', {
        error: e,
        src: audio.src,
        networkState: audio.networkState,
        readyState: audio.readyState
      });
    };
    
    audio.addEventListener('error', handleLoadError);
    
    return () => {
      audio.removeEventListener('error', handleLoadError);
    };
  }, [playableUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);
    const handleError = (e) => {
      const audio = e.target;
      console.error('AudioPlayer: Playback error:', {
        error: e,
        src: audio.src,
        networkState: audio.networkState,
        readyState: audio.readyState,
        errorCode: audio.error ? audio.error.code : 'unknown',
        errorMessage: audio.error ? audio.error.message : 'unknown'
      });
      setIsPlaying(false);
      
      // Show user-friendly error message
      if (audio.error) {
        const errorMessages = {
          1: 'Media aborted',
          2: 'Network error - please check your connection',
          3: 'Decode error - audio file may be corrupted',
          4: 'Source not supported - audio format may not be supported'
        };
        const errorMsg = errorMessages[audio.error.code] || 'Unknown playback error';
        alert(`Unable to play audio: ${errorMsg}`);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
    };
  }, [playableUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(err => {
        console.error('Error playing audio:', err);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const audio = audioRef.current;
    if (!audio) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    audio.currentTime = percentage * duration;
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleSkipBack = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.max(0, audio.currentTime - 10);
    }
  };

  const handleSkipForward = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = Math.min(duration, audio.currentTime + 10);
    }
  };

  const handleDownload = () => {
    if (!playableUrl || !audioUrl) return;
    
    // Get download URL - use direct URL for downloads
    let downloadUrl = playableUrl;
    
    // If using stream endpoint, convert to direct download URL
    if (playableUrl.includes('/stream')) {
      // For local files, use direct storage URL
      if (audioUrl.includes('/storage/') || audioUrl.includes('/uploads/')) {
        downloadUrl = audioUrl.startsWith('http') ? audioUrl : `${API_BASE_URL}${audioUrl}`;
      } else {
        // For Google Drive, use download endpoint
        downloadUrl = playableUrl.replace('/stream', '/download');
      }
    } else if (audioUrl && !audioUrl.startsWith('http')) {
      // Convert relative URL to absolute
      downloadUrl = `${API_BASE_URL}${audioUrl}`;
    }
    
    // Extract filename from URL
    const urlPath = audioUrl.includes('/') ? audioUrl.split('/').pop() : audioUrl;
    const filename = urlPath || `${podcastTitle || 'podcast'}.${audioUrl?.split('.').pop() || 'm4a'}`;
    
    // Create temporary link and trigger download
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!playableUrl) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-2xl z-50">
        <div className="max-w-6xl mx-auto p-4 text-center">
          <p className="text-sm">No audio URL available for this podcast</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white shadow-2xl z-50 border-t border-gray-700">
      <audio 
        ref={audioRef} 
        src={playableUrl} 
        preload="metadata"
        crossOrigin="anonymous"
        playsInline
        onError={(e) => {
          const audio = e.target;
          console.error('Audio playback error:', {
            error: e,
            src: audio.src,
            networkState: audio.networkState,
            readyState: audio.readyState,
            errorCode: audio.error ? audio.error.code : 'unknown',
            errorMessage: audio.error ? audio.error.message : 'unknown'
          });
        }}
        onLoadedMetadata={() => {
          const audio = audioRef.current;
          console.log('Audio metadata loaded successfully', {
            duration: audio?.duration,
            readyState: audio?.readyState,
            networkState: audio?.networkState
          });
        }}
        onCanPlay={() => {
          console.log('Audio can play');
        }}
        onCanPlayThrough={() => {
          console.log('Audio can play through');
        }}
        onLoadStart={() => {
          console.log('Audio load started:', playableUrl);
        }}
        onStalled={() => {
          console.warn('Audio stalled - buffering may be slow');
        }}
      />
      
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Cover Image */}
          {podcastCover && (
            <div className="hidden sm:block flex-shrink-0">
              <img
                src={podcastCover}
                alt={podcastTitle}
                className="w-14 h-14 rounded-lg object-cover shadow-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Main Controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={handleSkipBack}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              title="Skip back 10s"
            >
              <SkipBack className="w-5 h-5" />
            </button>
            
            <button
              onClick={togglePlay}
              className="w-12 h-12 bg-white text-gray-900 rounded-full flex items-center justify-center hover:bg-gray-100 transition-all shadow-lg hover:scale-105"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 ml-0.5" />
              ) : (
                <Play className="w-6 h-6 ml-1" />
              )}
            </button>
            
            <button
              onClick={handleSkipForward}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              title="Skip forward 10s"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Section */}
          <div className="flex-1 min-w-0 mx-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-gray-300 font-mono min-w-[45px]">
                {formatTime(currentTime)}
              </span>
              <div
                className="flex-1 h-1.5 bg-gray-700 rounded-full cursor-pointer group"
                onClick={handleSeek}
              >
                <div
                  className="h-full bg-white rounded-full transition-all relative group-hover:bg-primary-400"
                  style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow" />
                </div>
              </div>
              <span className="text-xs text-gray-300 font-mono min-w-[45px] text-right">
                {formatTime(duration)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold truncate pr-2">{podcastTitle}</h4>
            </div>
          </div>

          {/* Volume & Download Controls */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-24 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white"
                style={{
                  background: `linear-gradient(to right, white 0%, white ${(isMuted ? 0 : volume) * 100}%, #374151 ${(isMuted ? 0 : volume) * 100}%, #374151 100%)`
                }}
              />
            </div>

            <button
              onClick={handleDownload}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              title="Download podcast"
            >
              <Download className="w-5 h-5" />
            </button>

            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              title="Close player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;

