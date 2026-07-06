import axios from "axios";

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/auth',
  headers: {
    "Content-Type": "application/json",
  },
});

const PUBLIC_ENDPOINTS = ['/register/', '/login/'];

//SimpleJWT Token Authentication
api.interceptors.request.use(
    (config) => {
        const isPublic = PUBLIC_ENDPOINTS.some((endpoint) => config.url?.includes(endpoint));
        if (!isPublic) {
            const token = localStorage.getItem("access_token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;