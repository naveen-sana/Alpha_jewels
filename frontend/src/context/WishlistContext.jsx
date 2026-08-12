import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { useToast } from './ToastContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const saved = localStorage.getItem('alpha_wishlist_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      return;
    }
    setLoading(true);
    try {
      const response = await apiClient.get('/api/wishlist');
      if (Array.isArray(response.data)) {
        setWishlistItems(response.data);
        localStorage.setItem('alpha_wishlist_items', JSON.stringify(response.data));
      }
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
    const item = typeof productOrId === 'object' ? productOrId : { id: productOrId, productId: productOrId };
    const pId = item.id || item.productId;
    if (!pId) return;

    const isAlreadyIn = wishlistItems.some(
      (w) => Number(w.id || w.productId) === Number(pId)
    );

    let updatedList = [];
    if (isAlreadyIn) {
      updatedList = wishlistItems.filter(
        (w) => Number(w.id || w.productId) !== Number(pId)
      );
      if (showToast) showToast('Product removed from wishlist', 'wishlist');
    } else {
      updatedList = [...wishlistItems, item];
      if (showToast) showToast('Product added to wishlist successfully!', 'wishlist');
    }

    setWishlistItems(updatedList);
    localStorage.setItem('alpha_wishlist_items', JSON.stringify(updatedList));

    if (isAuthenticated) {
      try {
        await apiClient.post('/api/wishlist', { productId: pId });
        await fetchWishlist();
      } catch (err) {
        console.error('Error syncing wishlist with database:', err);
      }
    }
  };

  const isInWishlist = (productId) => {
    if (!productId) return false;
    return wishlistItems.some(
      (item) => Number(item.id || item.productId) === Number(productId)
    );
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
