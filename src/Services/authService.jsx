// src/Services/authService.js
import ServerApi from '../api/ServerAPI';

export const signupUser = async (userData) => {
    const response = await ServerApi.post(`/auth/signup`, userData);
    return response.data;
};

export const loginUser = async (credentials) => {
    const response = await ServerApi.post(`/auth/login`, credentials);
    return response.data;
};
