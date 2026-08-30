import api from './api';

export const getActiveArticles = async () => {
    const response = await api.get('/articles');
    return response.data;
};

export const createArticle = async (articleData) => {
    const response = await api.post('/articles', articleData);
    return response.data;
};