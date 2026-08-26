import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'ngrok-skip-browser-warning': '1',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = config.url?.startsWith('/admin')
    ? localStorage.getItem('adminAuthToken')
    : localStorage.getItem('authToken') || localStorage.getItem('adminAuthToken');

  if (token) {
    config.headers.token = token;
  }

  return config;
});

export default apiClient;
