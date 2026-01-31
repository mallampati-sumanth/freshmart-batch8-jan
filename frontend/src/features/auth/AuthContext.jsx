import { createContext, useContext, useState, useEffect } from 'react';
import api from '../../api/axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [tokens, setTokens] = useState({
        access: localStorage.getItem('access_token'),
        refresh: localStorage.getItem('refresh_token'),
    });
    const [loading, setLoading] = useState(true);

    // Check auth status on mount
    useEffect(() => {
        if (tokens.access) {
            try {
                const decoded = jwtDecode(tokens.access);
                const currentTime = Date.now() / 1000;

                if (decoded.exp < currentTime) {
                    // Token expired, clear tokens
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('refresh_token');
                    setUser(null);
                } else {
                    // Fetch profile
                    fetchProfile();
                }
            } catch (e) {
                console.error("Token decode error:", e);
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                setUser(null);
            }
        }
        setLoading(false);
    }, []);

    const fetchProfile = async () => {
        try {
            const { data } = await api.get('/accounts/profile/');
            setUser(data);
        } catch (error) {
            console.error("Failed to fetch profile", error);
        }
    };

    const formatError = (error) => {
        if (error.response?.data) {
            const data = error.response.data;
            
            // If backend returns success: false with error object
            if (data.success === false && data.error) {
                if (typeof data.error === 'string') return data.error;
                if (typeof data.error === 'object') {
                    try {
                        return Object.entries(data.error)
                            .map(([key, value]) => {
                                const msg = Array.isArray(value) ? value.join(' ') : String(value);
                                const prefix = (key === 'detail' || key === 'non_field_errors') ? '' : `${key}: `;
                                return `${prefix}${msg}`;
                            })
                            .join('\n') || 'Registration failed';
                    } catch (e) {
                        return 'Registration failed';
                    }
                }
            }
            
            // Standard Django REST validation errors
            if (typeof data === 'string') return data;
            if (Array.isArray(data)) return data.join(', ');
            
            try {
                return Object.entries(data)
                    .map(([key, value]) => {
                        const msg = Array.isArray(value) ? value.join(' ') : String(value);
                        const prefix = (key === 'detail' || key === 'non_field_errors') ? '' : `${key}: `;
                        return `${prefix}${msg}`;
                    })
                    .join('\n');
            } catch (e) {
                return 'An error occurred';
            }
        }
        return error.message || 'An error occurred';
    };

    const login = async (username, password) => {
        try {
            const { data } = await api.post('/accounts/login/', { username, password });

            localStorage.setItem('access_token', data.tokens.access);
            localStorage.setItem('refresh_token', data.tokens.refresh);
            setTokens(data.tokens);

            // Fetch user profile immediately after login
            await fetchProfile();

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: formatError(error)
            };
        }
    };

    const register = async (userData) => {
        try {
            console.log('Registration data being sent:', userData);
            const { data } = await api.post('/accounts/register/', userData);

            localStorage.setItem('access_token', data.tokens.access);
            localStorage.setItem('refresh_token', data.tokens.refresh);
            setTokens(data.tokens);
            setUser(data.user);

            return { success: true };
        } catch (error) {
            console.error('Registration error:', error);
            console.error('Error response:', error.response?.data);
            return { success: false, error: formatError(error) };
        }
    };

    const logout = async () => {
        try {
            const refresh = localStorage.getItem('refresh_token');
            if (refresh) {
                await api.post('/accounts/logout/', { refresh });
            }
        } catch (e) {
            console.error('Logout error', e);
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setTokens({ access: null, refresh: null });
            setUser(null);
            window.location.href = '/login';
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, register, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
