import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Auto-handle auth errors
        if (error.response && error.response.status === 401) {
            console.warn("Unauthorized – user not logged in");
        }
        return Promise.reject(error);
    }
);

export default api;