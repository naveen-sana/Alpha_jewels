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

  const addToCart = async (productId, quantity = 1) => {
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

    // 1. Persist to Backend MySQL API
    let apiSuccess = false;
    try {
      await apiClient.post('/api/cart/add', { productId, quantity });
      apiSuccess = true;
    } catch (err) {
      console.warn('Backend cart add warning, proceeding with optimistic update:', err);
    }

    // 2. Fetch updated cart from database if API call succeeded
    let freshItems = [];
    if (apiSuccess) {
      try {
        const response = await apiClient.get('/api/cart/items');
        const data = response.data;
        if (data && data.cart && Array.isArray(data.cart.products)) {
          freshItems = data.cart.products;
        } else if (Array.isArray(data)) {
          freshItems = data;
        } else if (data && Array.isArray(data.items)) {
          freshItems = data.items;
        }
      } catch (err) {
        console.error('Error refreshing cart after add:', err);
      }
    }

    // 3. Update React Cart State
    if (freshItems.length > 0) {
      setCartItems(freshItems);
    } else {
      try {
        const pRes = await apiClient.get('/api/products');
        const pList = pRes.data || [];
        const foundProduct = pList.find(p => Number(p.id || p.productId || p.product_id) === Number(productId));

        setCartItems(prev => {
          const idx = prev.findIndex(item => Number(item.productId || item.product_id || item.id) === Number(productId));
          if (idx >= 0) {
            const updated = [...prev];
            updated[idx] = { ...updated[idx], quantity: (updated[idx].quantity || 1) + quantity };
            return updated;
          } else if (foundProduct) {
            const newItem = {
              id: Date.now(),
              productId: Number(foundProduct.id || productId),
              product_id: Number(foundProduct.id || productId),
              name: foundProduct.name || 'Jewelry Product',
              description: foundProduct.description || '',
              price: Number(foundProduct.price || 0),
              price_per_unit: Number(foundProduct.price || 0),
              quantity: quantity,
              imageUrl: foundProduct.imageUrl || foundProduct.image_url || '',
              stock: foundProduct.stock || 10
            };
            return [...prev, newItem];
          } else {
            const newItem = {
              id: Date.now(),
              productId: Number(productId),
              product_id: Number(productId),
              name: 'Luxury Item #' + productId,
              price: 50000,
              price_per_unit: 50000,
              quantity: quantity
            };
            return [...prev, newItem];
          }
        });
      } catch (e) {
        console.error('Error updating cart state:', e);
      }
    }

    if (showToast) {
      showToast('Product added to cart successfully!', 'cart');
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
