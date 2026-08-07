import React, { useState } from 'react'
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom'
import { Gem, ShoppingCart, User, LogOut, Trash2, Heart, Search, X, ShoppingBag, ChevronDown } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { getProductImage } from '../utils/productImages'

const Navbar = () => {
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuth()
  const { cartItems, cartCount, removeFromCart, addToCart } = useCart()
  const { wishlistItems, wishlistCount, toggleWishlist } = useWishlist()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [showCartDropdown, setShowCartDropdown] = useState(false)
  const [showWishlistDropdown, setShowWishlistDropdown] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const [searchExpanded, setSearchExpanded] = useState(false)

  // Hide top global navbar on Home page and Admin pages
  if (location.pathname === '/' || location.pathname.toLowerCase().includes('admin')) {
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
    if (val) {
      navigate(`/shop?category=${activeCategory}&search=${encodeURIComponent(val)}`)
    } else {
      navigate(`/shop?category=${activeCategory}`)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    if (searchQuery) {
      navigate(`/shop?category=${activeCategory}&search=${encodeURIComponent(searchQuery)}`)
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
                    <form onSubmit={handleSearchSubmit} className="search-input-wrapper animate-slide-left">
                      <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                        className="search-input-field-luxury"
                        autoFocus
                      />
                      {searchQuery && (
                        <button 
                          type="button"
                          onClick={() => {
                            navigate(`/shop?category=${activeCategory}`)
                          }}
                          className="search-clear-btn"
                        >
                          <X size={14} className="text-gold" />
                        </button>
                      )}
                    </form>
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
                                src={getProductImage(item)}
                                alt={item.name}
                                className="cart-item-preview-img"
                                onError={(e) => {
                                  e.target.src = getProductImage(item);
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
                  <Link 
                    to="/cart"
                    onClick={() => {
                      setShowCartDropdown(false)
                      setShowWishlistDropdown(false)
                    }} 
                    className="cart-toggle-btn d-flex align-items-center text-decoration-none"
                    aria-label="Open Cart"
                  >
                    <div className="position-relative">
                      <ShoppingCart size={22} className="text-gold" />
                      {cartCount > 0 && (
                        <span className="cart-badge-count">{cartCount}</span>
                      )}
                    </div>
                  </Link>

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
                                src={getProductImage(item)}
                                alt={item.name}
                                className="cart-item-preview-img"
                                onError={(e) => {
                                  e.target.src = getProductImage(item);
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

                {/* User Profile Dropdown Badge matching Reference Image 2 */}
                <div className="user-profile-dropdown-container position-relative">
                  <button
                    onClick={() => {
                      setShowProfileDropdown(!showProfileDropdown)
                      setShowCartDropdown(false)
                      setShowWishlistDropdown(false)
                    }}
                    className="user-profile-badge-btn d-flex align-items-center gap-2 flex-shrink-0 bg-transparent border-0 text-white cursor-pointer py-1 px-2.5 rounded-3 hover-bg-dark-trans"
                    aria-label="User Profile Menu"
                  >
                    <div 
                      className="avatar-circle-blue d-flex align-items-center justify-content-center fw-bold text-white rounded-circle shadow-sm"
                      style={{ 
                        width: '34px', 
                        height: '34px', 
                        background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                        fontSize: '15px'
                      }}
                    >
                      {(user?.fullName || user?.email || 'V').charAt(0).toUpperCase()}
                    </div>
                    <span className="profile-username-text text-white fw-semibold text-nowrap fs-6">
                      {user?.fullName || user?.email?.split('@')[0] || 'vrashabha13'}
                    </span>
                    <ChevronDown 
                      size={16} 
                      className={`text-white-50 transition-transform ${showProfileDropdown ? 'rotate-180' : ''}`} 
                    />
                  </button>

                  {/* Profile Dropdown Popup matching Reference Image 2 */}
                  {showProfileDropdown && (
                    <div 
                      className="user-profile-dropdown-menu shadow-2xl rounded-4 position-absolute end-0 mt-2 p-3 border animate-fade-in z-index-dropdown"
                      style={{ 
                        width: '260px', 
                        background: '#ffffff', 
                        borderColor: '#e2e8f0',
                        boxShadow: '0 20px 30px -10px rgba(0, 0, 0, 0.15)'
                      }}
                    >
                      {/* Header inside dropdown */}
                      <div className="profile-dropdown-header pb-2 mb-2 border-bottom">
                        <h6 className="fw-bold text-dark mb-0 font-mono text-truncate">
                          {user?.fullName || user?.email?.split('@')[0] || 'vrashabha13'}
                        </h6>
                        <small className="text-muted text-truncate d-block" style={{ fontSize: '0.8rem' }}>
                          {user?.email || 'vrashabhanilajagi1@gmail.com'}
                        </small>
                      </div>

                      {/* Options list */}
                      <div className="d-flex flex-column gap-1">
                        <Link 
                          to="/profile" 
                          className="dropdown-item-link d-flex align-items-center gap-2.5 px-3 py-2 rounded-3 text-dark font-medium text-decoration-none hover-bg-light"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          <User size={18} className="text-secondary" />
                          <span>Profile</span>
                        </Link>

                        <Link 
                          to="/orders" 
                          className="dropdown-item-link d-flex align-items-center gap-2.5 px-3 py-2 rounded-3 text-dark font-medium text-decoration-none hover-bg-light"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          <ShoppingBag size={18} className="text-secondary" />
                          <span>Orders</span>
                        </Link>

                        <button 
                          onClick={() => {
                            setShowProfileDropdown(false)
                            handleLogout()
                          }}
                          className="dropdown-item-link w-100 border-0 bg-transparent text-start d-flex align-items-center gap-2.5 px-3 py-2 rounded-3 text-dark font-medium hover-bg-light"
                        >
                          <LogOut size={18} className="text-secondary" />
                          <span>Logout</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

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
