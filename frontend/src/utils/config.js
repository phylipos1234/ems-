// Configuration utility for API and base URLs

// Get the base URL for API calls
export const getApiUrl = () => {
  return import.meta.env.VITE_API_URL || "http://localhost:5000/api";
};

// Get the base URL for images and static assets
// For Vercel, images are served from the same domain
export const getBaseUrl = () => {
  // If we have VITE_API_URL, extract the base URL from it
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl) {
    // Remove /api from the end to get base URL
    return apiUrl.replace("/api", "");
  }
  // Fallback to localhost for development
  return "http://localhost:5000";
};

// Helper to get full image URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  // If imagePath already starts with http, return as is
  if (imagePath.startsWith("http")) {
    return imagePath;
  }
  // Otherwise, prepend base URL
  return `${getBaseUrl()}${imagePath}`;
};

