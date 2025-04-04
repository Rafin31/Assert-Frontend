import axios from 'axios';

const ServerApi = axios.create({
    baseURL: import.meta.env.VITE_BACKEND,
});

ServerApi.interceptors.request.use(
    (config) => {
        // Optionally: attach auth token
        // config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default ServerApi;
