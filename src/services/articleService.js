import api from './api';

export const getActiveArticles = async () => {
    const response = await api.get('/articles');
    return response.data;
};

export const createArticle = async (articleData) => {
    const response = await api.post('/articles', articleData);
    return response.data;
};

export const downloadArticlePdf = async (id) => {
    const response = await api.get(`/articles/${id}/pdf`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `articulo_${id}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
};