import axios from "axios";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api", // your backend base URL
  withCredentials: true, // Include credentials in requests
});

// Add interceptor to include token in headers
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken"); // get token from localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
