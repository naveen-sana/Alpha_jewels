import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [cartItems, setCartItems] = useState([]);
  const [overallTotalPrice, setOverallTotalPrice] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cartError, setCartError] = useState(null);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      setOverallTotalPrice(0);
      return;
    }
    setLoading(true);
    setCartError(null);
    try {
      const response = await apiClient.get('/api/cart/items');
      const data = response.data;
      if (data && data.cart && Array.isArray(data.cart.products)) {
        setCartItems(data.cart.products);
        setOverallTotalPrice(data.cart.overall_total_price || 0);
      } else if (Array.isArray(data)) {
        setCartItems(data);
        const total = data.reduce((acc, item) => acc + ((item.price || item.price_per_unit || 0) * (item.quantity || 1)), 0);
        setOverallTotalPrice(total);
      } else if (data && Array.isArray(data.items)) {
        setCartItems(data.items);
        setOverallTotalPrice(data.overall_total_price || 0);
      } else {
        setCartItems([]);
        setOverallTotalPrice(0);
      }
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
    setCartError(null);
    if (!isAuthenticated) {
      const msg = 'Please log in to add products to your cart.';
      setCartError(msg);
      if (showToast) showToast(msg, 'warning');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
      return;
    }
    try {
      const response = await apiClient.post('/api/cart/add', { productId, quantity });
      await fetchCart();
      if (showToast) {
        showToast('Product added to cart successfully!', 'cart');
      }
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || (err.response?.status === 403 || err.response?.status === 401 ? 'Please log in to add items to cart.' : 'Failed to add item to cart.');
      setCartError(errorMsg);
      if (showToast) {
        showToast(errorMsg, 'error');
      }
      console.error('Error adding to cart:', errorMsg);
      throw new Error(errorMsg);
    }
  };

  const updateQuantity = async (productId, newQtyOrAction) => {
    setCartError(null);
    try {
      let body = { productId };
      if (typeof newQtyOrAction === 'number') {
        body.quantity = newQtyOrAction;
      } else {
        body.action = newQtyOrAction;
      }
      const response = await apiClient.put('/api/cart/update', body);
      await fetchCart();
      return response.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.response?.data?.error || 'Failed to update quantity.';
      setCartError(errorMsg);
      console.error('Error updating quantity:', errorMsg);
      throw new Error(errorMsg);
    }
  };

  const removeFromCart = async (productId) => {
    setCartError(null);
    try {
      await apiClient.delete(`/api/cart/delete/${productId}`);
      await fetchCart();
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Error removing item from cart.';
      setCartError(errorMsg);
      console.error('Error removing from cart:', err);
      throw err;
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setOverallTotalPrice(0);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);

  return (
    <CartContext.Provider 
      value={{ 
        cartItems, 
        cartCount, 
        overallTotalPrice, 
        loading, 
        cartError,
        setCartError,
        addToCart, 
        updateQuantity, 
        removeFromCart, 
        clearCart,
        refetchCart: fetchCart 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
