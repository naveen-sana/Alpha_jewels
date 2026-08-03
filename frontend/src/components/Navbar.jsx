import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { Gem, ShoppingCart, User, LogOut, Trash2, Heart, Search, X, ShoppingBag } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'

const Navbar = () => {
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuth()
  const { cartItems, cartCount, removeFromCart, addToCart } = useCart()
  const { wishlistItems, wishlistCount, toggleWishlist } = useWishlist()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [showCartDropdown, setShowCartDropdown] = useState(false)
  const [showWishlistDropdown, setShowWishlistDropdown] = useState(false)
  const [searchExpanded, setSearchExpanded] = useState(false)

  // Hide top global navbar on Home page to display pure Aurum / Alpha Jewels hero banner
  if (location.pathname === '/') {
    return null
  }

  const activeCategory = searchParams.get('category') || 'Diamond'
  const searchQuery = searchParams.get('search') || ''


  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const handleCategoryClick = (category) => {
    const newParams = { category }
    setSearchParams(newParams)
    navigate(`/shop?category=${category}`)
  }

  const handleSearchChange = (e) => {
    const val = e.target.value
    const currentParams = Object.fromEntries(searchParams.entries())
    if (val) {
      setSearchParams({ ...currentParams, search: val })
    } else {
      const { search, ...rest } = currentParams
      setSearchParams(rest)
    }
  }

  const categories = ['Diamond', 'Gold', 'Platinum', 'Silver']

  return (
    <header className="main-header-shell">
      {/* Tier 1: Alpha Jewels Premium Header (Taller, strictly single line layout) */}
      <div className="top-luxury-header">
        <div className="container d-flex align-items-center justify-content-between flex-nowrap">
          {/* Logo / Brand Name (Left Corner) */}
          <Link to={isAuthenticated ? "/shop" : "/"} className="header-brand-logo d-flex align-items-center gap-2 flex-shrink-0">
            <Gem size={32} className="text-gold" />
            <span className="brand-title-text text-white font-serif fs-3">
              Alpha <span className="text-gold">Jewels</span>
            </span>
          </Link>

          {/* Right-side Auth & Actions Panel (Strictly one single line, no wrapping) */}
          <div className="header-actions-panel d-flex align-items-center gap-luxury-header flex-nowrap flex-shrink-0">
            {isAuthenticated ? (
              <>
                {/* Expandable Search Input */}
                <div className={`navbar-expandable-search d-flex align-items-center ${searchExpanded ? 'expanded' : ''}`}>
                  <button 
                    onClick={() => setSearchExpanded(!searchExpanded)} 
                    className="search-toggle-btn-luxury"
                    aria-label="Search Toggle"
                  >
                    <Search size={22} className="text-gold" />
                  </button>
                  {searchExpanded && (
                    <div className="search-input-wrapper animate-slide-left">
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="search-input-field-luxury"
                        autoFocus
                        onBlur={() => {
                          if (!searchQuery) {
                            setSearchExpanded(false)
                          }
                        }}
                      />
                      {searchQuery && (
                        <button 
                          onClick={() => {
                            const { search, ...rest } = Object.fromEntries(searchParams.entries())
                            setSearchParams(rest)
                          }}
                          className="search-clear-btn"
                        >
                          <X size={14} className="text-gold" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Wishlist Icon with Dropdown */}
                <div className="wishlist-dropdown-container position-relative">
                  <button 
                    onClick={() => {
                      setShowWishlistDropdown(!showWishlistDropdown)
                      setShowCartDropdown(false)
                    }} 
                    className="wishlist-toggle-btn position-relative" 
                    aria-label="Open Wishlist"
                  >
                    <Heart size={22} className="text-gold" />
                    {wishlistCount > 0 && (
                      <span className="wishlist-badge-count">{wishlistCount}</span>
                    )}
                  </button>

                  {showWishlistDropdown && (
                    <div className="cart-preview-dropdown shadow-lg animate-fade-in">
                      <div className="cart-dropdown-header d-flex justify-content-between align-items-center">
                        <span className="fw-semibold text-black">Wishlist</span>
                        <span className="badge bg-gold text-black rounded-pill">{wishlistCount} items</span>
                      </div>
                      <div className="cart-dropdown-items">
                        {wishlistItems.length === 0 ? (
                          <div className="empty-cart-message py-4 text-center text-muted">
                            Your wishlist is empty.
                          </div>
                        ) : (
                          wishlistItems.map((item) => (
                            <div key={item.id} className="cart-dropdown-item d-flex align-items-center gap-3 py-2 border-bottom">
                              <img
                                src={item.imageUrl || '/default-product.png'}
                                alt={item.name}
                                className="cart-item-preview-img"
                                onError={(e) => {
                                  e.target.src = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500';
                                }}
                              />
                              <div className="flex-grow-1 min-width-0 text-start">
                                <h5 className="cart-item-name text-truncate mb-0">{item.name}</h5>
                                <span className="cart-item-qty-price text-muted small">
                                  ₹{Number(item.price).toLocaleString('en-IN')}
                                </span>
                              </div>
                              <div className="d-flex align-items-center gap-2">
                                <button 
                                  onClick={async () => {
                                    try {
                                      await addToCart(item.id, 1);
                                      toggleWishlist(item);
                                    } catch (err) {
                                      console.error(err);
                                    }
                                  }}
                                  className="remove-cart-item-btn"
                                  title="Add to Basket"
                                >
                                  <ShoppingBag size={14} className="text-gold" />
                                </button>
                                <button 
                                  onClick={() => toggleWishlist(item)}
                                  className="remove-cart-item-btn"
                                  title="Remove from Wishlist"
                                >
                                  <Trash2 size={14} className="text-danger" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Cart Icon with Dropdown */}
                <div className="cart-dropdown-container position-relative">
                  <button 
                    onClick={() => {
                      setShowCartDropdown(!showCartDropdown)
                      setShowWishlistDropdown(false)
                    }} 
                    className="cart-toggle-btn d-flex align-items-center"
                    aria-label="Open Cart"
                  >
                    <div className="position-relative">
                      <ShoppingCart size={22} className="text-gold" />
                      {cartCount > 0 && (
                        <span className="cart-badge-count">{cartCount}</span>
                      )}
                    </div>
                  </button>

                  {showCartDropdown && (
                    <div className="cart-preview-dropdown shadow-lg animate-fade-in">
                      <div className="cart-dropdown-header d-flex justify-content-between align-items-center">
                        <span className="fw-semibold text-black">Shopping Basket</span>
                        <span className="badge bg-gold text-black rounded-pill">{cartCount} items</span>
                      </div>
                      <div className="cart-dropdown-items">
                        {cartItems.length === 0 ? (
                          <div className="empty-cart-message py-4 text-center text-muted">
                            Your basket is empty.
                          </div>
                        ) : (
                          cartItems.map((item) => (
                            <div key={item.id} className="cart-dropdown-item d-flex align-items-center gap-3 py-2 border-bottom">
                              <img
                                src={item.imageUrl || '/default-product.png'}
                                alt={item.name}
                                className="cart-item-preview-img"
                                onError={(e) => {
                                  e.target.src = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500';
                                }}
                              />
                              <div className="flex-grow-1 min-width-0 text-start">
                                <h5 className="cart-item-name text-truncate mb-0">{item.name}</h5>
                                <span className="cart-item-qty-price text-muted small">
                                  {item.quantity} x ₹{Number(item.price).toLocaleString('en-IN')}
                                </span>
                              </div>
                              <button 
                                onClick={() => removeFromCart(item.productId)}
                                className="remove-cart-item-btn"
                                aria-label="Remove item"
                              >
                                <Trash2 size={14} className="text-danger" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                      {cartItems.length > 0 && (
                        <div className="cart-dropdown-footer py-2 px-3 text-center border-top">
                          <div className="d-flex justify-content-between mb-2 small fw-semibold text-black">
                            <span>Total Price:</span>
                            <span>
                              ₹{cartItems.reduce((acc, item) => acc + ((item.price || item.price_per_unit || 0) * (item.quantity || 1)), 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                          <Link 
                            to="/cart" 
                            className="btn btn-dark w-100 btn-sm rounded-2 py-2 fw-semibold text-white text-decoration-none d-block"
                            onClick={() => setShowCartDropdown(false)}
                          >
                            View Full Cart & Checkout
                          </Link>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Profile Avatar & Name (e.g. shaik Sabjan) */}
                <div className="user-profile-badge d-flex align-items-center gap-2 flex-shrink-0">
                  <div className="avatar-circle-gold">
                    <User size={16} className="text-black" />
                  </div>
                  <span className="profile-username-text text-white text-nowrap">{user?.fullName || 'User'}</span>
                </div>

                {/* Logout Button */}
                <button onClick={handleLogout} className="header-logout-btn" title="Sign Out">
                  <LogOut size={20} className="text-gold" />
                </button>
              </>
            ) : (
              <div className="d-flex align-items-center gap-3 flex-nowrap">
                <Link to="/login" className="btn btn-outline-gold px-4 py-2 text-gold text-nowrap">Login</Link>
                <Link to="/register" className="btn btn-gold px-4 py-2 text-black text-nowrap">Register</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tier 2: Black Categories Navigation Bar (only visible when logged in) */}
      {isAuthenticated && (
        <div className="bottom-black-nav">
          <div className="container d-flex justify-content-center gap-5">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`category-navbar-link ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => handleCategoryClick(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
