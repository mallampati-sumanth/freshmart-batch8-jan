import api from './axios';

export const fetchProducts = async (params) => {
  const { data } = await api.get('/products/', { params });
  return data;
};

export const fetchCategories = async () => {
  const { data } = await api.get('/products/categories/');
  return data;
};

export const fetchBrands = async () => {
  const { data } = await api.get('/products/brands/');
  return data;
};

export const fetchProduct = async (id) => {
  const { data } = await api.get(`/products/${id}/`);
  return data;
};

export const createReview = async (productId, reviewData) => {
  const { data } = await api.post(`/products/${productId}/reviews/`, reviewData);
  return data;
};
