import api from './axios';

export const fetchSystemInfo = async () => {
    try {
        const { data } = await api.get('/system/info/');
        return data;
    } catch {
        return {};
    }
};

export const fetchAdminStats = async () => {
    try {
        // Parallel requests for stats
        const results = await Promise.allSettled([
            api.get('/products/admin/all/?page_size=1'),
            api.get('/accounts/admin/customers/?page_size=1'),
            api.get('/purchases/admin/stats/')
        ]);

        const products = results[0].status === 'fulfilled' ? results[0].value.data : { count: 0 };
        const customers = results[1].status === 'fulfilled' ? results[1].value.data : { count: 0 };
        const stats = results[2].status === 'fulfilled' ? results[2].value.data.stats : {};

        return {
            products_count: products.count,
            customers_count: customers.count,
            orders_count: stats.total_orders || 0,
            revenue: stats.total_revenue || 0,
            revenue_trend: stats.revenue_trend || { categories: [], revenue: [] },
            orders_trend: stats.revenue_trend || { categories: [], orders: [] },
            category_distribution: stats.category_distribution || { labels: [], series: [] },
            customer_growth: stats.customer_growth || { months: [], counts: [] }
        };
    } catch (e) {
        console.error("Stats fetch error", e);
        return { products_count: 0, customers_count: 0, orders_count: 0, revenue: 0 };
    }
};

export const adminFetchProducts = async (page = 1) => {
    const { data } = await api.get(`/products/admin/all/?page=${page}`);
    return data;
};

export const createProduct = async (productData) => {
    const formData = new FormData();
    Object.keys(productData).forEach(key => {
        if (productData[key] !== null && productData[key] !== undefined) {
            formData.append(key, productData[key]);
        }
    });

    const { data } = await api.post('/products/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
};

export const updateProduct = async (id, productData) => {
    const formData = new FormData();
    Object.keys(productData).forEach(key => {
        if (productData[key] !== null && productData[key] !== undefined && key !== 'image') {
            formData.append(key, productData[key]);
        }
        if (key === 'image' && productData[key] instanceof File) {
            formData.append(key, productData[key]);
        }
    });

    const { data } = await api.patch(`/products/${id}/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
};

export const deleteProduct = async (id) => {
    await api.delete(`/products/${id}/`);
};

// Customers
export const adminFetchCustomers = async (page = 1) => {
    const { data } = await api.get(`/accounts/admin/customers/?page=${page}`);
    return data;
};

export const updateCustomer = async (id, customerData) => {
    const { data } = await api.patch(`/accounts/admin/customers/${id}/`, customerData);
    return data;
};

export const deleteCustomer = async (id) => {
    await api.delete(`/accounts/admin/customers/${id}/`);
};

// Orders
export const adminFetchOrders = async (page = 1) => {
    const { data } = await api.get(`/purchases/admin/all/?page=${page}`);
    return data;
};

export const updateOrderStatus = async (id, status) => {
    const { data } = await api.patch(`/purchases/admin/${id}/`, { status });
    return data;
};
