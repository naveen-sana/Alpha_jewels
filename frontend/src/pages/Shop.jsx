import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import apiClient from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import { ShoppingCart, Heart } from 'lucide-react';

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
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await apiClient.get('/api/products', {
          params: { category: activeCategory }
        });
        setProducts(response.data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError('Failed to load products. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [activeCategory]);

  const handleAddToCart = async (productId) => {
    setAddingId(productId);
    setError('');
    try {
      await addToCart(productId, 1);
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

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="shop-container py-5">
      <div className="container">
        {loading && (
          <div className="text-center py-5">
            <LoadingSpinner size="lg" label={`Loading our finest ${activeCategory} collection...`} />
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
              const isWishlisted = isInWishlist(product.id);
              const isOutOfStock = product.stock !== undefined && product.stock <= 0;

              return (
                <div className="col-sm-6 col-md-4 col-lg-3" key={product.id}>
                  <div className="product-luxury-card">
                    <div className="product-image-wrapper">
                      <img
                        src={product.imageUrl || '/default-product.png'}
                        alt={product.name}
                        className="product-display-image"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500';
                        }}
                      />
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
                          ₹{Number(product.price).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                        <button
                          className={`add-to-cart-action-btn ${addingId === product.id ? 'added' : ''}`}
                          onClick={() => handleAddToCart(product.id)}
                          disabled={addingId === product.id || isOutOfStock}
                        >
                          <ShoppingCart size={14} className="me-1" />
                          {isOutOfStock ? 'Out of Stock' : addingId === product.id ? 'Added!' : 'Add to Cart'}
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
