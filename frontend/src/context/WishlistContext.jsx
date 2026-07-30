import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../api/client';
import { useAuth } from '../hooks/useAuth';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Clear legacy localStorage wishlist if present
  useEffect(() => {
    if (localStorage.getItem('alpha_wishlist')) {
      localStorage.removeItem('alpha_wishlist');
    }
  }, []);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      return;
    }
    setLoading(true);
    try {
      const response = await apiClient.get('/api/wishlist');
      setWishlistItems(response.data || []);
    } catch (err) {
      console.error('Error fetching wishlist from database:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async (productOrId) => {
    if (!productOrId) return;
    const productId = typeof productOrId === 'object' ? (productOrId.id || productOrId.productId) : productOrId;
    if (!productId) return;
    try {
      await apiClient.post('/api/wishlist', { productId });
      await fetchWishlist();
    } catch (err) {
      console.error('Error toggling wishlist in database:', err);
    }
  };

  const isInWishlist = (productId) => {
    if (!productId) return false;
    return wishlistItems.some((item) => Number(item.id) === Number(productId) || Number(item.productId) === Number(productId));
  };

  const wishlistCount = wishlistItems.length;

  return (
    <WishlistContext.Provider 
      value={{ 
        wishlistItems, 
        wishlistCount, 
        loading, 
        toggleWishlist, 
        isInWishlist, 
        refetchWishlist: fetchWishlist 
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
