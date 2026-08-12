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
      { id: 111, name: 'Nury Chevron Ring', description: 'Nury Chevron Ring', price: 7914.29, categoryName: 'Diamond' },
      { id: 112, name: 'The trina ring', description: 'beautifuly designed Trina', price: 9642.86, categoryName: 'Diamond' },
      { id: 113, name: 'Ozo stud earing', description: 'Handmade Ozo earrings for women', price: 7743.29, categoryName: 'Diamond' },
      { id: 114, name: 'Nuray earings', description: 'N-shaped Rings with pure gold', price: 9287.00, categoryName: 'Diamond' },
      { id: 115, name: 'Mazikeen Necklace', description: 'Mazi-Queen Royal look Necklace', price: 12785.71, categoryName: 'Diamond' },
      { id: 116, name: 'ryck princess', description: 'The ryck Princess Necklace', price: 14285.57, categoryName: 'Diamond' },
      { id: 117, name: 'Bracelite', description: 'The Aelric Bracelet', price: 9000.00, categoryName: 'Diamond' },
      { id: 118, name: 'resilent Bracelet', description: 'The Chain-typed Bracelet', price: 9200.00, categoryName: 'Diamond' },
      { id: 119, name: 'Line Bangles', description: 'Royal elegent Bangles for women', price: 9571.43, categoryName: 'Diamond' },
      { id: 120, name: 'Set Bangles', description: 'The Bazel-Set Bangles', price: 10000.00, categoryName: 'Diamond' },
      { id: 151, name: 'Royal Diamond Choker', description: 'Exquisite Royal Choker', price: 12000.00, categoryName: 'Diamond' },
      { id: 159, name: 'Stoned Diamond Necklace', description: 'Beautiful stoned Necklace for women', price: 9889.00, categoryName: 'Diamond' },
      { id: 160, name: 'Stoned Ring', description: 'A Beautiful Diamond Ring Stands in solitaire', price: 9563.00, categoryName: 'Diamond' }
    ],
    Gold: [
      { id: 121, name: 'Spiral Ring', description: 'Classic Spiral Gold Ring', price: 9000.00, categoryName: 'Gold' },
      { id: 122, name: 'leaf design Ring', description: 'Elegant Leaf Design Gold Ring', price: 6600.00, categoryName: 'Gold' },
      { id: 123, name: 'Stud Earrings', description: 'Temple Gold Stud Earrings', price: 8800.00, categoryName: 'Gold' },
      { id: 124, name: 'Mahroosh Diamond Necklace', description: 'Indriya Necklace by Aditya Birla', price: 9285.71, categoryName: 'Gold' },
      { id: 125, name: 'Lakshmi Temple Necklace', description: 'Beautifully designed Necklace', price: 11111.00, categoryName: 'Gold' },
      { id: 126, name: 'Lakshmi Gold Necklace', description: 'Wonderfully designed Necklace', price: 12698.29, categoryName: 'Gold' },
      { id: 127, name: 'Gold Beaded Bracelet', description: 'Handicrafted Bracelet for Women', price: 9162.40, categoryName: 'Gold' },
      { id: 128, name: 'Textured Gold Bracelet', description: 'Men Stylish and elogant look Bracelet', price: 7712.40, categoryName: 'Gold' },
      { id: 155, name: 'Neckpice Necklace', description: 'Beautifully crafted necklace for women', price: 7886.00, categoryName: 'Gold' },
      { id: 156, name: 'Long Necklace', description: 'Antique Gold Necklace for women', price: 7896.00, categoryName: 'Gold' },
      { id: 157, name: 'Antique Jumkas', description: 'Gold Plated One Gram Gold Antique Jhumkas', price: 5632.00, categoryName: 'Gold' },
      { id: 158, name: 'Kemp-green Lakshmi Vankii', description: 'Antique gold tone kemp-green lakshmi peacock elephant nakshi 1 vankii', price: 7986.00, categoryName: 'Gold' }
    ],
    Platinum: [
      { id: 131, name: 'Vidh Platinum Solitire', description: 'Best Ring for men', price: 9004.20, categoryName: 'Platinum' },
      { id: 132, name: 'Elegant floral Ring', description: 'Elegant floral Platinum Ring', price: 9391.57, categoryName: 'Platinum' },
      { id: 133, name: 'Swirl Stud Earrings', description: 'Circular Earrings', price: 6650.80, categoryName: 'Platinum' },
      { id: 134, name: 'Floral Stud Earrings', description: 'Flower Stud Earrings', price: 6509.20, categoryName: 'Platinum' },
      { id: 135, name: 'Emerald Drop Platinum Necklece', description: 'Wonderfully Crafted Necklace for Women', price: 12842.71, categoryName: 'Platinum' },
      { id: 136, name: 'Solitaire Platinum Pendant Necklace', description: 'Looking Gorgeous', price: 12556.86, categoryName: 'Platinum' },
      { id: 137, name: 'Start Motif Platinum Bracelet', description: 'Start Bracelet', price: 9353.57, categoryName: 'Platinum' },
      { id: 138, name: 'Floral Two-Tone Platinum Bracelet', description: 'Floral Two-Tone Platinum Bracelet', price: 8124.86, categoryName: 'Platinum' },
      { id: 139, name: 'Start- Motif Platinum Bangles', description: 'Floral Two-Tone Platinum Bracelet', price: 9353.86, categoryName: 'Platinum' },
      { id: 140, name: 'Eternity Platinum Bangle', description: 'Premium Bangles', price: 7807.86, categoryName: 'Platinum' },
      { id: 161, name: 'Rose Gold paltinum Necklace', description: 'Rose Gold Platinum Collection', price: 6548.00, categoryName: 'Platinum' },
      { id: 162, name: 'Square Piece-Set Neckalce', description: 'Square Piece Step Necklace', price: 6541.00, categoryName: 'Platinum' }
    ],
    Silver: [
      { id: 141, name: 'Meris Textured Band Ring', description: 'Wonderful Silverplated Ring', price: 6666.40, categoryName: 'Silver' },
      { id: 142, name: 'Butterfly Ring', description: 'Adjustable silver Butterfly Ring', price: 4542.40, categoryName: 'Silver' },
      { id: 143, name: 'Dangler Earrings', description: 'Silver Flower Dangler Earrings', price: 4917.80, categoryName: 'Silver' },
      { id: 144, name: 'Ossum Earrings', description: 'Beautiful Eearings for Women', price: 5517.20, categoryName: 'Silver' },
      { id: 145, name: 'Wisdom Sterling Silver Necklace', description: 'Infinite Wisdom Sterling Silver Necklace', price: 9164.20, categoryName: 'Silver' },
      { id: 146, name: 'GargiStone Necklace', description: 'Beautifully Crafted Stone Necklace', price: 9305.00, categoryName: 'Silver' },
      { id: 147, name: 'Flexi Bracelet', description: 'Fleur Flexi Bracelet in Silver', price: 7936.29, categoryName: 'Silver' },
      { id: 148, name: 'Chain Bracelet', description: 'Clara Womens Evil Eye Bracelet', price: 7048.20, categoryName: 'Silver' },
      { id: 149, name: 'Rewa Bangles', description: 'Beautiful Rewa Bangles', price: 8503.20, categoryName: 'Silver' },
      { id: 150, name: 'Sterling Bangles', description: 'Beautiful Sterling Bangles', price: 7912.80, categoryName: 'Silver' },
      { id: 163, name: 'Ghungroo Jwellery Set', description: 'Ghungroo Studded Filigree Work Silver Plated Antique Jewellery Set', price: 5469.00, categoryName: 'Silver' },
      { id: 164, name: 'Navaratri Jewellery', description: 'Silver Necklace, Navratri Jewellery', price: 4589.00, categoryName: 'Silver' }
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
