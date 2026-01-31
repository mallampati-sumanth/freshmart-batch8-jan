import { createContext, useContext, useState, useEffect } from 'react';
import api from '../../api/axios';
import { useAuth } from '../auth/AuthContext';
import { useToast } from '@chakra-ui/react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cart, setCart] = useState({ items: [], total_amount: 0 });
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const fetchCart = async () => {
        if (!user) return;
        try {
            setLoading(true);
            const { data } = await api.get('/purchases/cart/');
            setCart(data.cart || { items: [], total_amount: 0 });
        } catch (error) {
            // If 404, cart might be empty/not created, which is fine
            if (error.response?.status !== 404) {
                console.error("Failed to fetch cart", error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCart({ items: [], total_amount: 0 });
        }
    }, [user]);

    const addToCart = async (productId, quantity = 1) => {
        if (!user) return { success: false, error: 'Login required' };

        try {
            // Optimistic update could happen here, but we'll stick to network for accuracy first
            await api.post('/purchases/cart/items/', {
                product_id: productId,
                quantity: quantity
            });

            await fetchCart(); // Refresh cart

            return { success: true };
        } catch (error) {
            const msg = error.response?.data?.error || 'Failed to add to cart';
            toast({ status: 'error', title: msg });
            return { success: false, error: msg };
        }
    };

    const removeFromCart = async (itemId) => {
        try {
            await api.delete(`/purchases/cart/items/${itemId}/`);
            fetchCart();
        } catch (error) {
            console.error(error);
        }
    };

    const updateQuantity = async (itemId, quantity) => {
        try {
            await api.put(`/purchases/cart/items/${itemId}/`, { quantity });
            fetchCart();
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <CartContext.Provider value={{ cart, loading, addToCart, removeFromCart, updateQuantity, fetchCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
