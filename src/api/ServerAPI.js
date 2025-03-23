import axios from 'axios';

const ServerApi = axios.create({
    baseURL: 'http://localhost:5000/api/v1',
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
