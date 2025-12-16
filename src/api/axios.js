import axios from 'axios';
import { getCookie } from './cookies';
import { toast } from 'sonner';

export const backendUrl = () => {
  let remoteUrl = "https://love-meet.onrender.com/mall";

  return remoteUrl;
};

const api = axios.create({
  baseURL: backendUrl(),
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(
  (config) => {
    // Do Add auth token
    const token = getCookie("token");
    const adminToken = getCookie("adminToken");
    if (token || adminToken) {
      config.headers.Authorization = `Bearer ${adminToken || token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    // Show success toast if message exists
    if (response.data?.message) {
      toast.success(response.data.message);
    }
    return response.data;
  },
  (error) => {
    let errorMessage = 'An error occurred';
    if (error.response) {
      console.error('API Error:', error.response.data);
      errorMessage = error.response.data?.message || error.response.data?.error || 'Server error';
    } else if (error.request) {
      console.error('Network Error:', error.request);
      errorMessage = 'Network error - please check your connection';
    } else {
      console.error('Error:', error.message);
      errorMessage = error.message;
    }
    toast.error(errorMessage);
    return Promise.reject(error?.response?.data);
  }
);

export default api;
