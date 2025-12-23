import axios from 'axios';

const useApi = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Replace with your API URL
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Optional: Add a request interceptor (e.g., for Auth Tokens)
useApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default useApi;