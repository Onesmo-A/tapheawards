/**
 * adminApi.ts — Shared Axios instance for all admin API calls.
 *
 * Token is read from localStorage on every request via the request interceptor,
 * so there is no race-condition between AdminLayout mounting and sub-pages fetching.
 * If the token is missing the user is automatically redirected to the login page.
 */
import axios from 'axios';

const adminApi = axios.create({
  baseURL: '/',
});

// Attach the bearer token before every request
adminApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Redirect to login only when the token is missing or expired
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default adminApi;

