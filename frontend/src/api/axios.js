import axios from 'axios';

// Create a custom instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://44b2323e6640.ngrok-free.app/api',
    headers: {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': '69420',
    },
});

// Request Interceptor: Attach Token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor: Handle Token Refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried refreshing yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh_token');

            if (refreshToken) {
                try {
                    // Attempt to refresh token
                    const { data } = await axios.post('/api/token/refresh/', {
                        refresh: refreshToken,
                    });

                    // Store new token
                    localStorage.setItem('access_token', data.access);

                    // Retry original request with new token
                    originalRequest.headers['Authorization'] = `Bearer ${data.access}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    // If refresh fails, logout user
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            } else {
                // No refresh token available
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
