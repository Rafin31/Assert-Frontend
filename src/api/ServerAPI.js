import axios from 'axios';

const ServerApi = axios.create({
    baseURL: import.meta.env.VITE_BACKEND,
});

ServerApi.interceptors.request.use(
    (config) => {
        const rawToken = localStorage.getItem('token');
        if (rawToken) {
            try {
                const token = JSON.parse(rawToken);
                config.headers.Authorization = `Bearer ${token}`;
            } catch {
                config.headers.Authorization = `Bearer ${rawToken}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default ServerApi;
