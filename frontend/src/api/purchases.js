import api from './axios';

export const getOrders = async () => {
    const { data } = await api.get('/purchases/');
    return data;
};

export const getOrderDetail = async (id) => {
    const { data } = await api.get(`/purchases/${id}/`);
    return data;
};
