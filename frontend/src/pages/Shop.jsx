import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import apiClient from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import { ShoppingCart, Heart, ImageOff } from 'lucide-react';
import { getProductImage } from '../utils/productImages';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'Diamond';
  const searchQuery = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [addingId, setAddingId] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      // 1. Clear previous category state immediately on category switch
      setProducts([]);

      try {
        const response = await apiClient.get('/api/products', {
          params: { category: activeCategory }
        });

        if (!isMounted) return;

        const resData = response.data || [];
        
        // 2. Deduplicate returned products by unique Product ID
        const uniqueProducts = [];
        const seenIds = new Set();

        for (const item of resData) {
          const pId = item.id || item.productId || item.product_id;
          if (pId && !seenIds.has(pId)) {
            seenIds.add(pId);
            uniqueProducts.push(item);
          }
        }

        setProducts(uniqueProducts);
      } catch (err) {
        if (!isMounted) return;
        console.error('Error fetching products from API:', err);
        setError('Unable to load products from database server.');
        setProducts([]);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => {
      isMounted = false;
    };
  }, [activeCategory]);

  const handleAddToCart = async (product) => {
    const pId = typeof product === 'object' ? (product.id || product.productId || product.product_id) : product;
    setAddingId(pId);
    setError('');
    try {
      await addToCart(pId, 1, typeof product === 'object' ? product : null);
      setTimeout(() => setAddingId(null), 800);
    } catch (err) {
      console.error(err);
      const rawMsg = err.message || '';
      if (rawMsg.includes('POST') || rawMsg.includes('supported') || rawMsg.includes('401') || rawMsg.includes('403') || rawMsg.includes('Unauthorized')) {
        setError('Please log in to add products to your cart.');
      } else {
        setError(rawMsg || 'Failed to add product to cart.');
      }
      setAddingId(null);
    }
  };

  const filteredProducts = products.filter(p => {
    const pName = (p.name || '').toLowerCase();
    const pDesc = (p.description || '').toLowerCase();
    const matchesSearch = !searchQuery ||
      pName.includes(searchQuery.toLowerCase()) ||
      pDesc.includes(searchQuery.toLowerCase());

    const itemCategory = (p.categoryName || p.category || '').toLowerCase();
    const activeCat = activeCategory.toLowerCase();
    const matchesCategory = !activeCategory || activeCat === 'all' || itemCategory === activeCat;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="shop-container py-5">
      <div className="container">
        {loading && (
          <div className="text-center py-5">
            <LoadingSpinner size="lg" label={`Loading ${activeCategory} collection...`} />
          </div>
        )}

        {!loading && error && (
          <div className="alert alert-warning text-center max-width-md mx-auto mb-4" role="alert">
            {error}
          </div>
        )}

        {!loading && !filteredProducts.length && (
          <div className="text-center py-5 empty-shop-state">
            <h3>No Products Found</h3>
            <p className="text-muted">
              {searchQuery 
                ? `No items match "${searchQuery}" in the ${activeCategory} category.`
                : `No items found in the ${activeCategory} category.`}
            </p>
          </div>
        )}

        {!loading && filteredProducts.length > 0 && (
          <div className="row g-4 justify-content-center">
            {filteredProducts.map((product) => {
              const productId = product.id || product.productId || product.product_id;
              const isWishlisted = isInWishlist(productId);
              const stockVal = product.stock !== undefined ? product.stock : product.stock_quantity;
              const isOutOfStock = stockVal !== undefined && stockVal <= 0;
              const imgSrc = getProductImage(product);

              return (
                <div className="col-sm-6 col-md-4 col-lg-3" key={productId}>
                  <div className="product-luxury-card">
                    <div className="product-image-wrapper position-relative">
                      {imgSrc ? (
                        <img
                          src={imgSrc}
                          alt={product.name}
                          className="product-display-image"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            const fallbackBadge = e.target.parentElement.querySelector('.img-unavailable-badge');
                            if (fallbackBadge) fallbackBadge.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div 
                        className="img-unavailable-badge d-flex flex-column align-items-center justify-content-center text-muted"
                        style={{ display: imgSrc ? 'none' : 'flex', height: '220px', backgroundColor: '#1a1a1a', borderRadius: '8px' }}
                      >
                        <ImageOff size={28} className="mb-2 text-gold opacity-75" />
                        <span className="small text-gold-light opacity-75">Image Unavailable</span>
                      </div>
                      <button 
                        onClick={() => toggleWishlist(product)}
                        className={`wishlist-btn-badge ${isWishlisted ? 'active' : ''}`} 
                        aria-label="Add to wishlist"
                      >
                        <Heart 
                          size={16} 
                          fill={isWishlisted ? "var(--gold)" : "none"} 
                          className={isWishlisted ? "text-gold" : "text-muted"} 
                        />
                      </button>
                    </div>
                    <div className="product-details-content">
                      <h3 className="product-name-title">{product.name}</h3>
                      <p className="product-desc-text">{product.description || 'Exclusive luxury craftsmanship'}</p>
                      <div className="product-footer-row">
                        <span className="product-price-tag">
                          ₹{Number(product.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <button
                          className={`add-to-cart-action-btn ${addingId === productId ? 'added' : ''}`}
                          onClick={() => handleAddToCart(product)}
                          disabled={addingId === productId || isOutOfStock}
                        >
                          <ShoppingCart size={14} className="me-1" />
                          {isOutOfStock ? 'Out of Stock' : addingId === productId ? 'Added!' : 'Add to Cart'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
