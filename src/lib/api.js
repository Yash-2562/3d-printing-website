import axios from 'axios';

const fallbackApiUrl = import.meta.env.DEV
  ? 'http://localhost:8000/api/v1'
  : 'https://issuing-scant-attire.ngrok-free.dev/api/v1';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || fallbackApiUrl,
  headers: {
    'ngrok-skip-browser-warning': '1',
  },
});

export function getApiOrigin() {
  try {
    return new URL(apiClient.defaults.baseURL, window.location.origin).origin;
  } catch {
    return '';
  }
}

export function resolveImageUrl(imageUrl) {
  if (!imageUrl) return imageUrl;

  try {
    const apiOrigin = getApiOrigin();
    const fallbackOrigin =
      typeof window !== 'undefined' ? window.location.origin : apiOrigin;
    const image = new URL(imageUrl, fallbackOrigin);
    if (!image.pathname.startsWith('/uploads/')) return imageUrl;

    return apiOrigin
      ? `${apiOrigin}${image.pathname}${image.search}`
      : `${image.origin}${image.pathname}${image.search}`;
  } catch {
    return imageUrl;
  }
}

export function isBackendUploadUrl(imageUrl) {
  if (!imageUrl) return false;

  try {
    const apiOrigin = getApiOrigin();
    const image = new URL(resolveImageUrl(imageUrl), window.location.origin);
    return image.pathname.startsWith('/uploads/') && image.origin === apiOrigin;
  } catch {
    return false;
  }
}

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
