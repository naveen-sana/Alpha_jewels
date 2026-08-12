import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { useToast } from './ToastContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartError, setCartError] = useState(null);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }
    setLoading(true);
    setCartError(null);
    try {
      const response = await apiClient.get('/api/cart/items');
      const data = response.data;
      let itemsList = [];
      if (data && data.cart && Array.isArray(data.cart.products)) {
        itemsList = data.cart.products;
      } else if (Array.isArray(data)) {
        itemsList = data;
      } else if (data && Array.isArray(data.items)) {
        itemsList = data.items;
      }

      if (itemsList.length > 0) {
        setCartItems(itemsList);
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

  const addToCart = async (productId, quantity = 1, productObj = null) => {
    setCartError(null);
    if (!isAuthenticated) {
      const msg = 'Please log in to add products to your cart.';
      setCartError(msg);
      if (showToast) showToast(msg, 'warning');
      setTimeout(() => {
        window.location.href = '/login';
      }, 1000);
      throw new Error(msg);
    }

    // 1. Instant Optimistic Local Cart State Update (0ms UI lag)
    setCartItems(prev => {
      const existingIdx = prev.findIndex(item => Number(item.productId || item.product_id || item.id) === Number(productId));
      if (existingIdx >= 0) {
        const updated = [...prev];
        const existingItem = updated[existingIdx];
        updated[existingIdx] = {
          ...existingItem,
          name: productObj?.name || existingItem.name,
          price: productObj?.price || existingItem.price,
          imageUrl: productObj?.imageUrl || productObj?.image_url || existingItem.imageUrl,
          quantity: (existingItem.quantity || 1) + quantity
        };
        return updated;
      }
      return [...prev, {
        id: productId,
        productId,
        quantity,
        name: productObj?.name || `Jewellery Item #${productId}`,
        price: productObj?.price || 0.00,
        imageUrl: productObj?.imageUrl || productObj?.image_url || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e'
      }];
    });

    if (showToast) showToast('Product added to cart!', 'success');

    // 2. Background API Sync
    try {
      await apiClient.post('/api/cart/add', { productId, quantity });
      const response = await apiClient.get('/api/cart/items');
      const data = response.data;
      let fresh = [];
      if (data && data.cart && Array.isArray(data.cart.products)) fresh = data.cart.products;
      else if (Array.isArray(data)) fresh = data;
      else if (data && Array.isArray(data.items)) fresh = data.items;
      if (fresh.length > 0) setCartItems(fresh);
    } catch (err) {
      console.warn('Background cart sync:', err);
    }
  };

  const updateQuantity = async (productId, newQtyOrAction) => {
    setCartError(null);

    setCartItems(prev => {
      return prev.map(item => {
        if (Number(item.productId || item.product_id || item.id) === Number(productId)) {
          const current = item.quantity || 1;
          let updatedQty = typeof newQtyOrAction === 'number' ? newQtyOrAction : (newQtyOrAction === 'increase' ? current + 1 : Math.max(1, current - 1));
          return { ...item, quantity: updatedQty };
        }
        return item;
      });
    });

    try {
      let body = { productId };
      if (typeof newQtyOrAction === 'number') {
        body.quantity = newQtyOrAction;
      } else {
        body.action = newQtyOrAction;
      }
      await apiClient.put('/api/cart/update', body);
      await fetchCart();
    } catch (err) {
      console.warn('Backend update quantity warning:', err);
    }
  };

  const removeFromCart = async (productId) => {
    setCartError(null);
    setCartItems(prev => prev.filter(item => Number(item.productId || item.product_id || item.id) !== Number(productId)));
    try {
      await apiClient.delete(`/api/cart/delete/${productId}`);
      await fetchCart();
    } catch (err) {
      console.warn('Backend remove item warning:', err);
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Dynamic calculations
  const overallTotalPrice = cartItems.reduce((acc, item) => {
    const price = Number(item.price || item.price_per_unit || 0);
    const qty = Number(item.quantity || 1);
    return acc + (price * qty);
  }, 0);

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
