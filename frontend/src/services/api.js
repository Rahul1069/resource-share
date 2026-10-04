import axios from "axios";

const api = axios.create({
  baseURL: "https://resource-share.onrender.com/api",
  withCredentials: true,
});

// ── Token helpers ──────────────────────────────────────────────
// Mobile browsers (Safari ITP, in-app browsers) often block cross-site
// cookies.  We keep the access token in memory (primary) with localStorage
// as a persistence fallback so sessions survive page reloads.

let inMemoryToken = null;

export const setAccessToken = (token) => {
  inMemoryToken = token;
  if (token) {
    localStorage.setItem("accessToken", token);
  } else {
    localStorage.removeItem("accessToken");
  }
};

export const getAccessToken = () => {
  return inMemoryToken || localStorage.getItem("accessToken");
};

export const clearAccessToken = () => {
  inMemoryToken = null;
  localStorage.removeItem("accessToken");
};

// ── Request interceptor ────────────────────────────────────────
// Attach the Bearer token to every outgoing request.  If the cookie
// also arrives, the backend reads it first – this is just a fallback.
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;