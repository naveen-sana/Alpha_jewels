import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../api/client';
import { useAuth } from '../hooks/useAuth';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }
    setLoading(true);
    try {
      const response = await apiClient.get('/api/cart');
      setCartItems(response.data || []);
    } catch (err) {
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      await apiClient.post('/api/cart', { productId, quantity });
      await fetchCart();
    } catch (err) {
      console.error('Error adding to cart:', err);
      throw err;
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await apiClient.delete(`/api/cart/${productId}`);
      await fetchCart();
    } catch (err) {
      console.error('Error removing from cart:', err);
      throw err;
    }
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, cartCount, loading, addToCart, removeFromCart, refetchCart: fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
