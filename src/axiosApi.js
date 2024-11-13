import axios from 'axios';
import { getToken } from './authService';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/',
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
