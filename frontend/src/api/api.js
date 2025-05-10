import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(config => {
  const user = localStorage.getItem('user');
  if (user) {
    const userData = JSON.parse(user);
    if (userData && userData.token) {
      config.headers.Authorization = `Bearer ${userData.token}`;
    }
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;
