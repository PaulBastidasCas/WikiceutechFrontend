import api from './api';

export const loginUser = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) localStorage.setItem('token', response.data.token);
    return response.data;
};

export const registerUser = async (username, email, password) => {
    const response = await api.post('/auth/register', { username, email, password });
    return response.data;
};

export const verifyUser = async (email, code) => {
    const response = await api.post('/auth/verify', { email, code });
    return response.data;
};

export const recoverPassword = async (email) => {
    const response = await api.post('/emails/recover-password', { email });
    return response.data;
};

export const logoutUser = () => localStorage.removeItem('token');