import axios from 'axios';

const ServerApi = axios.create({
    baseURL: 'http://localhost:5000/api/v1',
});

ServerApi.interceptors.request.use(
    (config) => {
        console.log('📤 [Request]', config.method?.toUpperCase(), config.url);
        // Optionally: attach auth token
        // config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => {
        console.error('❌ [Request Error]', error);
        return Promise.reject(error);
    }
);

export default ServerApi;
