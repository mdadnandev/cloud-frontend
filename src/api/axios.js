import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// JWT interceptor — attach token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('drive_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401/403 (expired/invalid token or access denied)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const isAuthRequest = error.config?.url?.includes('/auth/');
    
    if ((status === 401 || status === 403) && !isAuthRequest) {
      localStorage.removeItem('drive_token');
      localStorage.removeItem('drive_user');
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ============ AUTH ============
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// ============ FILES ============
export const fileAPI = {
  initUpload: (fileName, mimeType) =>
    api.post('/files/init-upload', null, { params: { fileName, mimeType } }),
  
  completeUpload: (fileName, storageKey, size, mimeType) =>
    api.post('/files/complete-upload', null, {
      params: { fileName, storageKey, size, mimeType },
    }),
  
  rename: (id, newName) =>
    api.put(`/files/${id}/rename`, null, { params: { newName } }),
  
  move: (id, folderId) =>
    api.put(`/files/${id}/move`, null, { params: { folderId } }),
  
  listFiles: (folderId) =>
    api.get('/files', { params: folderId ? { folderId } : {} }),

  getDownloadUrl: (id) =>
    api.get(`/files/${id}/download-url`),
};

// ============ FOLDERS ============
export const folderAPI = {
  create: (data) => api.post('/folders', data),
  listFolders: (parentId) =>
    api.get('/folders', { params: parentId ? { parentId } : {} }),
};

// ============ SEARCH ============
export const searchAPI = {
  search: (query, page = 0, size = 20) =>
    api.get('/search', { params: { query, page, size } }),
};

// ============ SHARES ============
export const shareAPI = {
  share: (data) => api.post('/shares', data),
  getSharedWithMe: () => api.get('/shares/me'),
};

// ============ TRASH ============
export const trashAPI = {
  trashFile: (id) => api.post(`/trash/files/${id}`),
  listTrashed: () => api.get('/trash/files'),
};

// ============ PUBLIC LINKS ============
export const publicLinkAPI = {
  create: (data) => api.post('/public-links', data),
};

// Upload a file directly to the presigned URL
export const uploadToPresignedUrl = async (url, file, onProgress) => {
  return axios.put(url, file, {
    headers: {
      'Content-Type': file.type,
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });
};

export default api;
