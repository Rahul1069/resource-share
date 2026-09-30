import axios from "axios";

const api = axios.create({
  baseURL: "https://resource-share.onrender.com/api",
  withCredentials: true,
});

export default api;