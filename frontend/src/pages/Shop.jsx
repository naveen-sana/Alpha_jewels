import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import apiClient from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import { ShoppingCart, Heart } from 'lucide-react';

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

  const DEFAULT_CATALOGUE = {
    Diamond: [
      { id: 111, name: 'Nury Chevron Ring', description: 'Nury Chevron Ring', price: 54999, categoryName: 'Diamond' },
      { id: 112, name: 'The Trina Ring', description: 'Beautifully Designed Trina', price: 67500, categoryName: 'Diamond' },
      { id: 113, name: 'Ozo Stud Earring', description: 'Handmade Ozo Earrings for Women', price: 52400, categoryName: 'Diamond' },
      { id: 114, name: 'Nuray Earrings', description: 'N-Shaped Earrings', price: 62000, categoryName: 'Diamond' },
      { id: 115, name: 'Mazikeen Necklace', description: 'Mazi-Queen Royal Look Necklace', price: 89500, categoryName: 'Diamond' },
      { id: 116, name: 'Ryck Princess Necklace', description: 'The Ryck Princess Necklace', price: 125000, categoryName: 'Diamond' },
      { id: 117, name: 'Aelric Bracelet', description: 'The Aelric Bracelet', price: 68000, categoryName: 'Diamond' },
      { id: 118, name: 'Resilient Bracelet', description: 'The Chain-Type Bracelet', price: 72000, categoryName: 'Diamond' },
      { id: 119, name: 'Line Bangles', description: 'Royal Elegant Bangles for Women', price: 78000, categoryName: 'Diamond' },
      { id: 120, name: 'Set Bangles', description: 'The Bazel Set Bangles', price: 85000, categoryName: 'Diamond' },
    ],
    Gold: [
      { id: 121, name: 'Spiral Ring', description: 'Classic Spiral Gold Ring', price: 28500, categoryName: 'Gold' },
      { id: 122, name: 'Leaf Design Ring', description: 'Elegant Leaf Design Gold Ring', price: 32000, categoryName: 'Gold' },
      { id: 123, name: 'Stud Earrings', description: 'Temple Gold Stud Earrings', price: 34500, categoryName: 'Gold' },
      { id: 124, name: 'Jhumka Earrings', description: 'Gold Jhumka Earrings', price: 38000, categoryName: 'Gold' },
      { id: 125, name: 'Lakshmi Temple Necklace', description: 'Beautifully Designed Necklace', price: 72000, categoryName: 'Gold' },
      { id: 126, name: 'Lakshmi Gold Necklace', description: 'Wonderfully Designed Necklace', price: 85000, categoryName: 'Gold' },
      { id: 127, name: 'Gold Beaded Bracelet', description: 'Handcrafted Bracelet for Women', price: 42000, categoryName: 'Gold' },
      { id: 128, name: 'Textured Gold Bracelet', description: 'Stylish Gold Bracelet for Men', price: 48000, categoryName: 'Gold' },
      { id: 129, name: 'Floral Bangle Set', description: 'Wonderfully Crafted Bangles', price: 52000, categoryName: 'Gold' },
      { id: 130, name: 'Designer Gold Bangles', description: 'Beautifully Crafted Bangles', price: 58000, categoryName: 'Gold' },
    ],
    Platinum: [
      { id: 131, name: 'Vidh Platinum Solitaire', description: 'Best Ring for Men', price: 38000, categoryName: 'Platinum' },
      { id: 132, name: 'Elegant Floral Ring', description: 'Elegant Floral Platinum Ring', price: 45000, categoryName: 'Platinum' },
      { id: 133, name: 'Swirl Stud Earrings', description: 'Circular Platinum Earrings', price: 32000, categoryName: 'Platinum' },
      { id: 134, name: 'Floral Stud Earrings', description: 'Flower Platinum Stud Earrings', price: 36000, categoryName: 'Platinum' },
      { id: 135, name: 'Emerald Drop Platinum Necklace', description: 'Wonderfully Crafted Necklace for Women', price: 78000, categoryName: 'Platinum' },
      { id: 136, name: 'Solitaire Platinum Pendant Necklace', description: 'Looking Gorgeous', price: 88000, categoryName: 'Platinum' },
      { id: 137, name: 'Star Motif Platinum Bracelet', description: 'Star Motif Platinum Bracelet', price: 48000, categoryName: 'Platinum' },
      { id: 138, name: 'Floral Two-Tone Platinum Bracelet', description: 'Floral Two-Tone Platinum Bracelet', price: 54000, categoryName: 'Platinum' },
      { id: 139, name: 'Star Motif Platinum Bangles', description: 'Premium Platinum Bangles', price: 58000, categoryName: 'Platinum' },
      { id: 140, name: 'Eternity Platinum Bangle', description: 'Premium Platinum Bangle', price: 64000, categoryName: 'Platinum' },
    ],
    Silver: [
      { id: 141, name: 'Meris Textured Band Ring', description: 'Wonderful Silver Plated Ring', price: 2499, categoryName: 'Silver' },
      { id: 142, name: 'Butterfly Ring', description: 'Adjustable Silver Butterfly Ring', price: 2999, categoryName: 'Silver' },
      { id: 143, name: 'Dangler Earrings', description: 'Silver Flower Dangler Earrings', price: 3499, categoryName: 'Silver' },
      { id: 144, name: 'Ossum Earrings', description: 'Beautiful Earrings for Women', price: 3999, categoryName: 'Silver' },
      { id: 145, name: 'Wisdom Sterling Silver Necklace', description: 'Infinite Wisdom Sterling Silver Necklace', price: 5999, categoryName: 'Silver' },
      { id: 146, name: 'Gargi Stone Necklace', description: 'Beautifully Crafted Stone Necklace', price: 6499, categoryName: 'Silver' },
      { id: 147, name: 'Flexi Bracelet', description: 'Fleur Flexi Bracelet in Silver', price: 4999, categoryName: 'Silver' },
      { id: 148, name: 'Chain Bracelet', description: 'Clara Women\'s Evil Eye Bracelet', price: 5499, categoryName: 'Silver' },
      { id: 149, name: 'Rewa Bangles', description: 'Rounded Rewa Silver Bangles', price: 6999, categoryName: 'Silver' },
      { id: 150, name: 'Sterling Bangles', description: 'Sterling Silver Unique Bangles for Women', price: 7999, categoryName: 'Silver' },
    ]
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await apiClient.get('/api/products', {
          params: { category: activeCategory }
        });
        const resData = response.data || [];
        if (resData.length > 0) {
          setProducts(resData);
        } else {
          setProducts(DEFAULT_CATALOGUE[activeCategory] || DEFAULT_CATALOGUE.Diamond);
        }
      } catch (err) {
        console.error('Error fetching products from API, loading catalogue:', err);
        setProducts(DEFAULT_CATALOGUE[activeCategory] || DEFAULT_CATALOGUE.Diamond);
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
                        src={getProductImage(product)}
                        alt={product.name}
                        className="product-display-image"
                        onError={(e) => {
                          e.target.src = getProductImage(product);
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
