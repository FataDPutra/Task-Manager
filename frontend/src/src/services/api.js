import axios from "axios";
import {
  API_ENDPOINTS,
  HTTP_STATUS,
  STORAGE_KEYS,
} from "../constants/apiConstants";

// Base URL untuk API backend
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";

// Buat instance axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Interceptor untuk menambahkan token ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor untuk handle error response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {
      // Jangan redirect jika request ke endpoint auth (login/register)
      // karena 401 di endpoint auth adalah normal (password salah)
      const isAuthEndpoint =
        error.config?.url?.includes(API_ENDPOINTS.AUTH.LOGIN) ||
        error.config?.url?.includes(API_ENDPOINTS.AUTH.REGISTER);

      if (!isAuthEndpoint) {
        // Token expired atau invalid, logout user
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data) => api.post(API_ENDPOINTS.AUTH.REGISTER, data),
  login: (data) => api.post(API_ENDPOINTS.AUTH.LOGIN, data),
  logout: () => api.post(API_ENDPOINTS.AUTH.LOGOUT),
  me: () => api.get(API_ENDPOINTS.AUTH.ME),
};

// Task API
export const taskAPI = {
  getAll: (params = {}) => api.get(API_ENDPOINTS.TASKS.BASE, { params }),
  getById: (id) => api.get(API_ENDPOINTS.TASKS.BY_ID(id)),
  create: (data) => api.post(API_ENDPOINTS.TASKS.BASE, data),
  update: (id, data) => api.put(API_ENDPOINTS.TASKS.BY_ID(id), data),
  delete: (id) => api.delete(API_ENDPOINTS.TASKS.BY_ID(id)),
};

export default api;
