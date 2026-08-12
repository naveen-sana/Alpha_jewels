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
      { id: 111, name: 'Nury Chevron Ring', description: 'Nury Chevron Ring', price: 55400.00, categoryName: 'Diamond', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/ring2-the%20nury%20Chevron%20Ring.webp?updatedAt=1785154185476' },
      { id: 112, name: 'The Trina Ring', description: 'Beautifully Designed Trina', price: 67500.00, categoryName: 'Diamond', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/ring4-the%20trina%20ring(m).webp?updatedAt=1785154301792' },
      { id: 113, name: 'Ozo Stud Earring', description: 'Handmade Ozo Earrings for Women', price: 54203.00, categoryName: 'Diamond', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/earring1.webp?updatedAt=1785154351435' },
      { id: 114, name: 'Nuray Earrings', description: 'N-Shaped Earrings', price: 65009.00, categoryName: 'Diamond', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/earring2-nuray%20earring.webp?updatedAt=1785154471167' },
      { id: 115, name: 'Mazikeen Necklace', description: 'Mazi-Queen Royal Look Necklace', price: 89500.00, categoryName: 'Diamond', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/necklace1-the%20mazikeen%20necklace.webp?updatedAt=1785154535171' },
      { id: 116, name: 'Ryck Princess Necklace', description: 'The Ryck Princess Necklace', price: 99999.00, categoryName: 'Diamond', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/necklace-2%20the%20ryck%20princess%20necklace.webp?updatedAt=1785154594402' },
      { id: 117, name: 'Aelric Bracelet', description: 'The Aelric Bracelet', price: 45000.00, categoryName: 'Diamond', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/bracelete1-the%20aelric%20link.webp?updatedAt=1785154656778' },
      { id: 118, name: 'Resilient Bracelet', description: 'The Chain-Type Bracelet', price: 46000.00, categoryName: 'Diamond', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/bracelet2-%20the%20resilent%20chain%20bracelet.webp?updatedAt=1785154688366' },
      { id: 119, name: 'Line Bangles', description: 'Royal Elegant Bangles for Women', price: 67000.00, categoryName: 'Diamond', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/bangle-1.webp?updatedAt=1785155940553' },
      { id: 120, name: 'Set Bangles', description: 'The Bazel Set Bangles', price: 70000.00, categoryName: 'Diamond', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/bangle%202.webp?updatedAt=1785155972034' }
    ],
    Gold: [
      { id: 121, name: 'Spiral Ring', description: 'Classic Spiral Gold Ring', price: 45000.00, categoryName: 'Gold', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/gold%20ring2.jpg' },
      { id: 122, name: 'Leaf Design Ring', description: 'Elegant Leaf Design Gold Ring', price: 33000.00, categoryName: 'Gold', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/gold%20ring1.jpg' },
      { id: 123, name: 'Stud Earrings', description: 'Temple Gold Stud Earrings', price: 44000.00, categoryName: 'Gold', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/earrings.jpg' },
      { id: 124, name: 'Jhumka Earrings', description: 'Gold Jhumka Earrings', price: 36411.00, categoryName: 'Gold', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/earings2.jpg' },
      { id: 125, name: 'Lakshmi Temple Necklace', description: 'Beautifully Designed Necklace', price: 77777.00, categoryName: 'Gold', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/Lakshmi%20necklace-gold.avif' },
      { id: 126, name: 'Lakshmi Gold Necklace', description: 'Wonderfully Designed Necklace', price: 88888.00, categoryName: 'Gold', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/necklace2.jpg' },
      { id: 127, name: 'Gold Beaded Bracelet', description: 'Handcrafted Bracelet for Women', price: 45812.00, categoryName: 'Gold', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/bracelite1.webp' },
      { id: 128, name: 'Textured Gold Bracelet', description: 'Stylish Gold Bracelet for Men', price: 38562.00, categoryName: 'Gold', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/gold%20bracelet2.avif' },
      { id: 129, name: 'Floral Bangle Set', description: 'Wonderfully Crafted Bangles', price: 65481.00, categoryName: 'Gold', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/bangles-1.webp' },
      { id: 130, name: 'Designer Gold Bangles', description: 'Beautifully Crafted Bangles', price: 65874.00, categoryName: 'Gold', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/bangle2.jpg' }
    ],
    Platinum: [
      { id: 131, name: 'Vidh Platinum Solitaire', description: 'Best Ring for Men', price: 45021.00, categoryName: 'Platinum', imageUrl: 'https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%201.webp' },
      { id: 132, name: 'Elegant Floral Ring', description: 'Elegant Floral Platinum Ring', price: 65741.00, categoryName: 'Platinum', imageUrl: 'https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%202.webp' },
      { id: 133, name: 'Swirl Stud Earrings', description: 'Circular Platinum Earrings', price: 33254.00, categoryName: 'Platinum', imageUrl: 'https://ik.imagekit.io/StringstackSanjana/Platinum/ear%201.jpeg' },
      { id: 134, name: 'Floral Stud Earrings', description: 'Flower Platinum Stud Earrings', price: 32546.00, categoryName: 'Platinum', imageUrl: 'https://ik.imagekit.io/StringstackSanjana/Platinum/ear%202.webp' },
      { id: 135, name: 'Emerald Drop Platinum Necklace', description: 'Wonderfully Crafted Necklace for Women', price: 89899.00, categoryName: 'Platinum', imageUrl: 'https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%202.webp' },
      { id: 136, name: 'Solitaire Platinum Pendant Necklace', description: 'Looking Gorgeous', price: 87898.00, categoryName: 'Platinum', imageUrl: 'https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%201.webp' },
      { id: 137, name: 'Star Motif Platinum Bracelet', description: 'Star Motif Platinum Bracelet', price: 65475.00, categoryName: 'Platinum', imageUrl: 'https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%201.webp' },
      { id: 138, name: 'Floral Two-Tone Platinum Bracelet', description: 'Floral Two-Tone Platinum Bracelet', price: 56874.00, categoryName: 'Platinum', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/WhatsApp%20Image%202026-07-28%20at%2010.02.17%20AM.jpeg' },
      { id: 139, name: 'Star Motif Platinum Bangles', description: 'Premium Platinum Bangles', price: 65477.00, categoryName: 'Platinum', imageUrl: 'https://ik.imagekit.io/StringstackSanjana/Platinum/braclet%201.webp' },
      { id: 140, name: 'Eternity Platinum Bangle', description: 'Premium Platinum Bangle', price: 54655.00, categoryName: 'Platinum', imageUrl: 'https://ik.imagekit.io/StringstackSanjana/Platinum/BANG%203.webp' }
    ],
    Silver: [
      { id: 141, name: 'Meris Textured Band Ring', description: 'Wonderful Silver Plated Ring', price: 33332.00, categoryName: 'Silver', imageUrl: 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image1.webp' },
      { id: 142, name: 'Butterfly Ring', description: 'Adjustable Silver Butterfly Ring', price: 22712.00, categoryName: 'Silver', imageUrl: 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image2.webp' },
      { id: 143, name: 'Dangler Earrings', description: 'Silver Flower Dangler Earrings', price: 24589.00, categoryName: 'Silver', imageUrl: 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image3.webp' },
      { id: 144, name: 'Ossum Earrings', description: 'Beautiful Earrings for Women', price: 27586.00, categoryName: 'Silver', imageUrl: 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image4.webp' },
      { id: 145, name: 'Wisdom Sterling Silver Necklace', description: 'Infinite Wisdom Sterling Silver Necklace', price: 45821.00, categoryName: 'Silver', imageUrl: 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image5.webp' },
      { id: 146, name: 'Gargi Stone Necklace', description: 'Beautifully Crafted Stone Necklace', price: 46525.00, categoryName: 'Silver', imageUrl: 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image6.webp' },
      { id: 147, name: 'Flexi Bracelet', description: 'Fleur Flexi Bracelet in Silver', price: 55554.00, categoryName: 'Silver', imageUrl: 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image7.webp' },
      { id: 148, name: 'Chain Bracelet', description: 'Clara Women\'s Evil Eye Bracelet', price: 35241.00, categoryName: 'Silver', imageUrl: 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image8.webp' },
      { id: 149, name: 'Rewa Bangles', description: 'Rounded Rewa Silver Bangles', price: 42516.00, categoryName: 'Silver', imageUrl: 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image9.webp' },
      { id: 150, name: 'Sterling Bangles', description: 'Sterling Silver Unique Bangles for Women', price: 39564.00, categoryName: 'Silver', imageUrl: 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image10.webp' }
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

  const filteredProducts = products.filter(p => {
    const matchesSearch = !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

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
