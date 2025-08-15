// lib/api.ts
import axios from 'axios';
import { message } from 'antd';

const api = axios.create({
  baseURL: '/api', // Next.js API routes
  timeout: 10000,
});

api.interceptors.response.use(
  (res) => res.data,
  (error) => {
    if (error.response) {
      message.error(error.response.data?.message || 'Server Error');
    } else if (error.request) {
      message.error('Network error, please check your connection.');
    } else {
      message.error(error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
