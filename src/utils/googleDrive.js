/**
 * Utility functions for Google Drive integration
 */

/**
 * Check if URL is a Google Drive folder link
 * @param {string} url - Google Drive URL
 * @returns {boolean} - True if it's a folder link
 */
export const isDriveFolderLink = (url) => {
  if (!url) return false;
  return url.includes('/drive/folders/') || url.includes('/folders/');
};

/**
 * Extract file ID from various Google Drive URL formats
 * @param {string} url - Google Drive share URL
 * @returns {string|null} - File ID or null if invalid
 */
export const extractDriveFileId = (url) => {
  if (!url) return null;

  // Remove any whitespace
  url = url.trim();

  // Check if it's a folder link first
  if (isDriveFolderLink(url)) {
    // Extract folder ID
    const folderMatch = url.match(/\/folders\/([a-zA-Z0-9_-]+)/);
    if (folderMatch) {
      // Return null for folders - we need individual file links
      return null;
    }
  }

  // Pattern 1: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  let match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (match) return match[1];

  // Pattern 2: https://drive.google.com/open?id=FILE_ID
  match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match) return match[1];

  // Pattern 3: https://docs.google.com/uc?export=download&id=FILE_ID
  match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (match) return match[1];

  // Pattern 4: FILE_ID (if just the ID is provided)
  if (/^[a-zA-Z0-9_-]+$/.test(url)) {
    return url;
  }

  return null;
};

/**
 * Convert Google Drive share link to direct download link
 * @param {string} shareUrl - Google Drive share URL
 * @returns {string|null} - Direct download URL or null if invalid
 */
export const convertDriveToDirectLink = (shareUrl) => {
  const fileId = extractDriveFileId(shareUrl);
  if (!fileId) return null;

  // Return direct download link
  return `https://drive.google.com/uc?export=download&id=${fileId}`;
};

/**
 * Convert Google Drive share link to embed/stream link (for audio/video)
 * @param {string} shareUrl - Google Drive share URL
 * @returns {string|null} - Embed URL or null if invalid
 */
export const convertDriveToEmbedLink = (shareUrl) => {
  // Check if it's a folder link
  if (isDriveFolderLink(shareUrl)) {
    return null; // Cannot convert folder links - need individual file links
  }

  const fileId = extractDriveFileId(shareUrl);
  if (!fileId) return null;

  // Return embed link (better for streaming audio/video)
  return `https://drive.google.com/uc?export=open&id=${fileId}`;
};

/**
 * Validate if a URL is a Google Drive link
 * @param {string} url - URL to validate
 * @returns {boolean} - True if it's a Google Drive link
 */
export const isGoogleDriveLink = (url) => {
  if (!url) return false;
  return url.includes('drive.google.com') || url.includes('docs.google.com') || /^[a-zA-Z0-9_-]+$/.test(url.trim());
};

