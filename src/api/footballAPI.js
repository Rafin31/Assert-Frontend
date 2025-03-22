import axios from 'axios';

const footballApi = axios.create({
    baseURL: 'https://api.sportmonks.com/v3/football',
});

// Interceptor to add the token to headers
footballApi.interceptors.request.use((config) => {
    const token = import.meta.env.VITE_FOOTBALL_TOKEN; // using Vite env
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
});

export default footballApi;
