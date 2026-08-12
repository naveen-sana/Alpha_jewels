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
      { id: 111, name: 'Nury Chevron Ring', description: 'Nury Chevron Ring', price: 7914.29, categoryName: 'Diamond', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/ring2-the%20nury%20Chevron%20Ring.webp?updatedAt=1785154185476' },
      { id: 112, name: 'The trina ring', description: 'beautifuly designed Trina', price: 9642.86, categoryName: 'Diamond', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/ring4-the%20trina%20ring(m).webp?updatedAt=1785154301792' },
      { id: 113, name: 'Ozo stud earing', description: 'Handmade Ozo earrings for women', price: 7743.29, categoryName: 'Diamond', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/earring1.webp?updatedAt=1785154351435' },
      { id: 114, name: 'Nuray earings', description: 'N-shaped Rings with pure gold', price: 9287.00, categoryName: 'Diamond', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/earring2-nuray%20earring.webp?updatedAt=1785154471167' },
      { id: 115, name: 'Mazikeen Necklace', description: 'Mazi-Queen Royal look Necklace', price: 12785.71, categoryName: 'Diamond', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/necklace1-the%20mazikeen%20necklace.webp?updatedAt=1785154535171' },
      { id: 116, name: 'ryck princess', description: 'The ryck Princess Necklace', price: 14285.57, categoryName: 'Diamond', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/necklace-2%20the%20ryck%20princess%20necklace.webp?updatedAt=1785154594402' },
      { id: 117, name: 'Bracelite', description: 'The Aelric Bracelet', price: 9000.00, categoryName: 'Diamond', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/bracelete1-the%20aelric%20link.webp?updatedAt=1785154656778' },
      { id: 118, name: 'resilent Bracelet', description: 'The Chain-typed Bracelet', price: 9200.00, categoryName: 'Diamond', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/bracelet2-%20the%20resilent%20chain%20bracelet.webp?updatedAt=1785154688366' },
      { id: 119, name: 'Line Bangles', description: 'Royal elegent Bangles for women', price: 9571.43, categoryName: 'Diamond', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/bangle-1.webp?updatedAt=1785155940553' },
      { id: 120, name: 'Set Bangles', description: 'The Bazel-Set Bangles', price: 10000.00, categoryName: 'Diamond', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/bangle%202.webp?updatedAt=1785155972034' },
      { id: 151, name: 'Royal Diamond Choker', description: 'Exquisite Royal Choker', price: 12000.00, categoryName: 'Diamond', imageUrl: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f' },
      { id: 159, name: 'Stoned Diamond Necklace', description: 'Beautiful stoned Necklace for women', price: 9889.00, categoryName: 'Diamond', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeg4gTnQNB8QwFa2NabGCY6GIyuk-O5YgHPh0lWk89FQ&s=10' },
      { id: 160, name: 'Stoned Ring', description: 'A Beautiful Diamond Ring Stands in solitaire', price: 9563.00, categoryName: 'Diamond', imageUrl: 'https://thumbs.dreamstime.com/b/beautiful-diamond-ring-stands-store-window-306068234.jpg' }
    ],
    Gold: [
      { id: 121, name: 'Spiral Ring', description: 'Classic Spiral Gold Ring', price: 9000.00, categoryName: 'Gold', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/gold%20ring2.jpg' },
      { id: 122, name: 'leaf design Ring', description: 'Elegant Leaf Design Gold Ring', price: 6600.00, categoryName: 'Gold', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/gold%20ring1.jpg' },
      { id: 123, name: 'Stud Earrings', description: 'Temple Gold Stud Earrings', price: 8800.00, categoryName: 'Gold', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/earrings.jpg' },
      { id: 124, name: 'Mahroosh Diamond Necklace', description: 'Indriya Necklace by Aditya Birla', price: 9285.71, categoryName: 'Gold', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/earings2.jpg' },
      { id: 125, name: 'Lakshmi Temple Necklace', description: 'Beautifully designed Necklace', price: 11111.00, categoryName: 'Gold', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/Lakshmi%20necklace-gold.avif' },
      { id: 126, name: 'Lakshmi Gold Necklace', description: 'Wonderfully designed Necklace', price: 12698.29, categoryName: 'Gold', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/necklace2.jpg' },
      { id: 127, name: 'Gold Beaded Bracelet', description: 'Handicrafted Bracelet for Women', price: 9162.40, categoryName: 'Gold', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/bracelite1.webp' },
      { id: 128, name: 'Textured Gold Bracelet', description: 'Men Stylish and elogant look Bracelet', price: 7712.40, categoryName: 'Gold', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/gold%20bracelet2.avif' },
      { id: 155, name: 'Neckpice Necklace', description: 'Beautifully crafted necklace for women', price: 7886.00, categoryName: 'Gold', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFjFl-t7B2tgiTFxwu0DjLM06_sGl06qvLn9_ZQj29gg&s=10' },
      { id: 156, name: 'Long Necklace', description: 'Antique Gold Necklace for women', price: 7896.00, categoryName: 'Gold', imageUrl: 'https://cpimg.tistatic.com/07549410/b/4/Antique-Gold-Long-Necklace.jpg' },
      { id: 157, name: 'Antique Jumkas', description: 'Gold Plated One Gram Gold Antique Jhumkas', price: 5632.00, categoryName: 'Gold', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUGXcUrPc96aQ0Bkex6Iz88U2rtbIhTsRHaKhuIvqvBgfiiWOgJ680coY&s=10' },
      { id: 158, name: 'Kemp-green Lakshmi Vankii', description: 'Antique gold tone kemp-green lakshmi peacock elephant nakshi 1 vankii', price: 7986.00, categoryName: 'Gold', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsSouth25K9Qof9iRlt-NmhGjWBoWjbnY4NX8fYX1ElA&s=10' }
    ],
    Platinum: [
      { id: 131, name: 'Vidh Platinum Solitire', description: 'Best Ring for men', price: 9004.20, categoryName: 'Platinum', imageUrl: 'https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%201.webp' },
      { id: 132, name: 'Elegant floral Ring', description: 'Elegant floral Platinum Ring', price: 9391.57, categoryName: 'Platinum', imageUrl: 'https://ik.imagekit.io/StringstackSanjana/Platinum/Ring%202.webp' },
      { id: 133, name: 'Swirl Stud Earrings', description: 'Circular Earrings', price: 6650.80, categoryName: 'Platinum', imageUrl: 'https://ik.imagekit.io/StringstackSanjana/Platinum/ear%201.jpeg' },
      { id: 134, name: 'Floral Stud Earrings', description: 'Flower Stud Earrings', price: 6509.20, categoryName: 'Platinum', imageUrl: 'https://ik.imagekit.io/StringstackSanjana/Platinum/ear%202.webp' },
      { id: 135, name: 'Emerald Drop Platinum Necklece', description: 'Wonderfully Crafted Necklace for Women', price: 12842.71, categoryName: 'Platinum', imageUrl: 'https://ik.imagekit.io/StringstackSanjana/Platinum/necklace%202.webp' },
      { id: 136, name: 'Solitaire Platinum Pendant Necklace', description: 'Looking Gorgeous', price: 12556.86, categoryName: 'Platinum', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/necklace1.jpeg' },
      { id: 137, name: 'Start Motif Platinum Bracelet', description: 'Start Bracelet', price: 9353.57, categoryName: 'Platinum', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/bracelet.jpg' },
      { id: 138, name: 'Floral Two-Tone Platinum Bracelet', description: 'Floral Two-Tone Platinum Bracelet', price: 8124.86, categoryName: 'Platinum', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/WhatsApp%20Image%202026-07-28%20at%2010.02.17%20AM.jpeg' },
      { id: 139, name: 'Start- Motif Platinum Bangles', description: 'Floral Two-Tone Platinum Bracelet', price: 9353.86, categoryName: 'Platinum', imageUrl: 'https://ik.imagekit.io/StringstackSanjana/Platinum/braclet%201.webp' },
      { id: 140, name: 'Eternity Platinum Bangle', description: 'Premium Bangles', price: 7807.86, categoryName: 'Platinum', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/platinum%20bangle.jpg' },
      { id: 161, name: 'Rose Gold paltinum Necklace', description: 'Rose Gold Platinum Collection', price: 6548.00, categoryName: 'Platinum', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsGuP29OiLm3h8E4bWxCr_6IkP3o_Pn86YyBk_3tqsAw&s=10' },
      { id: 162, name: 'Square Piece-Set Neckalce', description: 'Square Piece Step Necklace', price: 6541.00, categoryName: 'Platinum', imageUrl: 'https://5.imimg.com/data5/SELLER/Default/2025/12/566237565/GW/XI/IP/103582308/platinum-jewelry-500x500.jpg' }
    ],
    Silver: [
      { id: 141, name: 'Meris Textured Band Ring', description: 'Wonderful Silverplated Ring', price: 6666.40, categoryName: 'Silver', imageUrl: 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image1.webp' },
      { id: 142, name: 'Butterfly Ring', description: 'Adjustable silver Butterfly Ring', price: 4542.40, categoryName: 'Silver', imageUrl: 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image2.webp' },
      { id: 143, name: 'Dangler Earrings', description: 'Silver Flower Dangler Earrings', price: 4917.80, categoryName: 'Silver', imageUrl: 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image3.webp' },
      { id: 144, name: 'Ossum Earrings', description: 'Beautiful Eearings for Women', price: 5517.20, categoryName: 'Silver', imageUrl: 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image4.webp' },
      { id: 145, name: 'Wisdom Sterling Silver Necklace', description: 'Infinite Wisdom Sterling Silver Necklace', price: 9164.20, categoryName: 'Silver', imageUrl: 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image5.webp' },
      { id: 146, name: 'GargiStone Necklace', description: 'Beautifully Crafted Stone Necklace', price: 9305.00, categoryName: 'Silver', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/silver%20necklace.webp' },
      { id: 147, name: 'Flexi Bracelet', description: 'Fleur Flexi Bracelet in Silver', price: 7936.29, categoryName: 'Silver', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/silver%20bracelet.jpg' },
      { id: 148, name: 'Chain Bracelet', description: 'Clara Womens Evil Eye Bracelet', price: 7048.20, categoryName: 'Silver', imageUrl: 'https://ik.imagekit.io/StringstackNaveen/silver%20bracelet2.jpg' },
      { id: 149, name: 'Rewa Bangles', description: 'Beautiful Rewa Bangles', price: 8503.20, categoryName: 'Silver', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxvNTouHpMaDkVQE0EBj9ACaFYTpdnjHseaPqkPxpqLQ&s=10' },
      { id: 150, name: 'Sterling Bangles', description: 'Beautiful Sterling Bangles', price: 7912.80, categoryName: 'Silver', imageUrl: 'https://ik.imagekit.io/StringStackSavitri/SilverImages/image10.webp' },
      { id: 163, name: 'Ghungroo Jwellery Set', description: 'Ghungroo Studded Filigree Work Silver Plated Antique Jewellery Set', price: 5469.00, categoryName: 'Silver', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtETkKAxYb9cdrBBVOBDlQMWvWmvMdaWGq2OvoOOXWbtVwR4zmQVLEPh8b&s=10' },
      { id: 164, name: 'Navaratri Jewellery', description: 'Silver Necklace, Navratri Jewellery', price: 4589.00, categoryName: 'Silver', imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_jhWvKIVjAe9n7QaDN6uMFMb_IPmbINqHvMHp7p9A9z2K_GiGMpDIiz8&s=10' }
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
