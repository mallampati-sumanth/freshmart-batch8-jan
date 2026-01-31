import api from './axios';

// Get all packages
export const getPackages = async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/packages/${params ? `?${params}` : ''}`);
    return response.data;
};

// Get package by ID
export const getPackageById = async (id) => {
    const response = await api.get(`/packages/${id}/`);
    return response.data;
};

// Get package recommendations
export const getPackageRecommendations = async (people, days, budget) => {
    const params = new URLSearchParams();
    if (people) params.append('people', people);
    if (days) params.append('days', days);
    if (budget) params.append('budget', budget);
    
    const response = await api.get(`/packages/recommendations/?${params}`);
    return response.data;
};

// Add package to cart
export const addPackageToCart = async (packageId) => {
    const response = await api.post(`/packages/${packageId}/add_to_cart/`);
    return response.data;
};

// Get my package orders
export const getMyPackageOrders = async () => {
    const response = await api.get('/packages/my_orders/');
    return response.data;
};
