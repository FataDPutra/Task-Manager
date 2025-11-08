// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: "/register",
    LOGIN: "/login",
    LOGOUT: "/logout",
    ME: "/me",
  },
  TASKS: {
    BASE: "/tasks",
    BY_ID: (id) => `/tasks/${id}`,
  },
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
  TOO_MANY_REQUESTS: 429,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: "token",
  USER: "user",
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Terjadi kesalahan koneksi. Silakan coba lagi.",
  UNAUTHORIZED: "Sesi Anda telah berakhir. Silakan login kembali.",
  NOT_FOUND: "Data tidak ditemukan.",
  SERVER_ERROR: "Terjadi kesalahan pada server. Silakan coba lagi.",
  UNKNOWN_ERROR: "Terjadi kesalahan. Silakan coba lagi.",
};
