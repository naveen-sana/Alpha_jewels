import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import apiClient from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import { ArrowLeft, Trash2, Plus, Minus, CheckCircle, AlertCircle, ShoppingBag, User, ShieldCheck, Lock, Sparkles, QrCode } from 'lucide-react';

const Cart = () => {
  const { cartItems, overallTotalPrice, loading, updateQuantity, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [stockError, setStockError] = useState('');
  const [paymentSuccess, setPaymentSuccess] = useState(null);

  // Dynamic calculations as shown in Image 1 reference
  const subtotal = overallTotalPrice;
  const shippingFee = cartItems.length > 0 ? (subtotal > 5000 ? 0.00 : 370.00) : 0.00;
  const totalProductsCount = cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0);
  const grandTotal = subtotal + shippingFee;

  const handleIncrement = async (productId, currentQty) => {
    setStockError('');
    try {
      await updateQuantity(productId, currentQty + 1);
    } catch (err) {
      setStockError(err.message || 'Cannot add more items. Stock limit reached.');
    }
  };

  const handleDecrement = async (productId, currentQty) => {
    setStockError('');
    try {
      if (currentQty > 1) {
        await updateQuantity(productId, currentQty - 1);
      }
    } catch (err) {
      setStockError(err.message || 'Failed to update quantity.');
    }
  };

  const handleRemove = async (productId) => {
    setStockError('');
    try {
      await removeFromCart(productId);
    } catch (err) {
      setStockError('Failed to remove product from cart.');
    }
  };

  // Dynamically load Razorpay SDK
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Proceed to Checkout -> Delivery Address & Payment Page
  const handleProceedToCheckout = () => {
    if (cartItems.length === 0) return;
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-vh-100 py-5 d-flex align-items-center justify-content-center bg-cream-soft">
        <LoadingSpinner size="lg" label="Loading Alpha Jewels Cart..." />
      </div>
    );
  }

  // Payment Success View
  if (paymentSuccess) {
    return (
      <div className="min-vh-100 py-5 bg-cream-soft">
        <div className="container max-width-md mx-auto" style={{ maxWidth: '600px' }}>
          <div className="card shadow-lg border-0 rounded-4 p-5 text-center bg-white">
            <div className="mb-4">
              <CheckCircle size={64} className="text-success mx-auto" />
            </div>
            <h2 className="fw-bold mb-2 font-serif text-black">Order Confirmed!</h2>
            <p className="text-muted mb-4">Thank you for purchasing with Alpha Jewels.</p>
            
            <div className="bg-light p-4 rounded-3 text-start mb-4 border border-gold-soft">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Payment ID:</span>
                <span className="fw-semibold text-dark">{paymentSuccess.paymentId}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Order ID:</span>
                <span className="fw-semibold text-dark">{paymentSuccess.orderId}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">Total Paid:</span>
                <span className="fw-bold text-success">₹{paymentSuccess.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            <Link to="/shop" className="btn luxury-btn btn-gold rounded-3 px-4 py-2 fw-semibold">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-cream-soft" style={{ paddingBottom: '3rem' }}>
      
      {/* Top Banner Matching Reference Layout (Alpha Jewels Luxury Dark Header) */}
      <header className="w-100 py-3 px-4 shadow-md d-flex align-items-center justify-content-between bg-black text-white border-bottom border-gold-subtle">
        <div className="d-flex align-items-center gap-3">
          <div className="p-2 rounded-circle border border-gold d-flex align-items-center justify-content-center" style={{ width: '42px', height: '42px', background: 'rgba(212,175,55,0.1)' }}>
            <ShoppingBag size={20} className="text-gold" />
          </div>
          <div>
            <h2 className="fw-normal font-serif text-gold-metallic mb-0" style={{ fontSize: '1.6rem', letterSpacing: '0.1em' }}>
              ALPHA JEWELS
            </h2>
          </div>
        </div>

        <div className="d-flex align-items-center gap-4">
          <div className="position-relative">
            <ShoppingBag size={22} className="text-gold" />
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-gold text-black fw-bold" style={{ fontSize: '0.65rem' }}>
              {totalProductsCount}
            </span>
          </div>
          <div className="d-flex align-items-center gap-2 text-white-50 fw-medium small">
            <User size={18} className="text-gold" />
            <span className="text-gold-light">{user?.fullName?.split(' ')[0] || user?.username || 'Guest'}</span>
          </div>
        </div>
      </header>

      <div className="container py-4">
        {/* Navigation Link matching Reference */}
        <div className="mb-3">
          <Link to="/shop" className="text-decoration-none text-secondary d-inline-flex align-items-center gap-2 fw-medium hover-gold">
            <ArrowLeft size={16} />
            <span>← Shopping Continue</span>
          </Link>
        </div>

        {/* Stock or Checkout Error Alert */}
        {stockError && (
          <div className="alert alert-danger alert-dismissible fade show d-flex align-items-center gap-2 mb-4 shadow-sm" role="alert">
            <AlertCircle size={20} className="flex-shrink-0" />
            <div>{stockError}</div>
            <button type="button" className="btn-close" onClick={() => setStockError('')} aria-label="Close"></button>
          </div>
        )}

        <div className="row g-4">
          {/* Left Column: Cart Items List */}
          <div className="col-lg-7">
            <div className="cart-left-header mb-4">
              <h2 className="fw-bold font-serif mb-1 text-black" style={{ fontSize: '1.8rem' }}>Shopping Cart</h2>
              <p className="text-secondary small mb-0">
                You have {totalProductsCount} {totalProductsCount === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>

            {cartItems.length === 0 ? (
              <div className="card shadow-sm border-0 rounded-4 p-5 text-center bg-white my-3">
                <ShoppingBag size={48} className="text-gold mx-auto mb-3 opacity-50" />
                <h4 className="fw-semibold text-black font-serif">Your cart is empty</h4>
                <p className="text-muted mb-4">Discover our handcrafted gold, diamond, platinum & silver collections.</p>
                <div>
                  <Link to="/shop" className="btn luxury-btn btn-gold rounded-3 px-4 py-2">
                    Explore Collections
                  </Link>
                </div>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {cartItems.map((item) => {
                  const unitPrice = Number(item.price || item.price_per_unit || 0);
                  const itemTotal = unitPrice * (item.quantity || 1);
                  const productId = item.productId || item.product_id;

                  return (
                    <div key={item.id || productId} className="card shadow-sm border-0 rounded-4 p-3 bg-white hover-shadow transition-all">
                      <div className="row align-items-center g-3">
                        {/* Image */}
                        <div className="col-auto">
                          <img
                            src={item.imageUrl || item.image_url || 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500'}
                            alt={item.name}
                            className="rounded-3 border"
                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500';
                            }}
                          />
                        </div>

                        {/* Title & Subtitle */}
                        <div className="col min-width-0">
                          <h5 className="fw-bold font-serif text-black mb-1 text-truncate">{item.name}</h5>
                          <p className="text-muted small mb-0 text-truncate" style={{ maxWidth: '220px' }}>
                            {item.description || `Handcrafted ${item.name}`}
                          </p>
                        </div>

                        {/* Quantity Counter (- Qty +) */}
                        <div className="col-auto">
                          <div className="d-flex align-items-center gap-2">
                            <button
                              onClick={() => handleDecrement(productId, item.quantity)}
                              className="btn btn-dark btn-sm rounded-1 d-flex align-items-center justify-content-center p-0"
                              style={{ width: '32px', height: '32px', backgroundColor: '#121212' }}
                              title="Decrease Quantity"
                            >
                              <Minus size={14} />
                            </button>
                            
                            <span className="fw-semibold px-2 text-black" style={{ minWidth: '24px', textAlign: 'center' }}>
                              {item.quantity}
                            </span>

                            <button
                              onClick={() => handleIncrement(productId, item.quantity)}
                              className="btn btn-secondary btn-sm rounded-1 d-flex align-items-center justify-content-center p-0"
                              style={{ width: '32px', height: '32px', backgroundColor: '#5c6778', borderColor: '#5c6778' }}
                              title="Increase Quantity"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>

                        {/* Price Tag */}
                        <div className="col-auto text-end" style={{ minWidth: '95px' }}>
                          <div className="fw-bold text-black font-serif">
                            ₹{itemTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        </div>

                        {/* Delete Button */}
                        <div className="col-auto">
                          <button
                            onClick={() => handleRemove(productId)}
                            className="btn btn-light rounded-2 p-2 text-secondary hover-danger"
                            style={{ backgroundColor: '#f1f5f9', borderColor: '#cbd5e1' }}
                            title="Remove Product"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Order Summary Card (Matching Reference Layout) */}
          <div className="col-lg-5">
            <div className="card shadow-sm border-0 rounded-4 p-4 bg-white sticky-top" style={{ top: '100px' }}>
              <h4 className="fw-bold text-black font-serif mb-4" style={{ fontSize: '1.4rem' }}>Order Summary</h4>

              <div className="d-flex justify-content-between mb-3 text-secondary" style={{ fontSize: '0.95rem' }}>
                <span>Subtotal</span>
                <span className="fw-medium text-black">
                  ₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              <div className="d-flex justify-content-between mb-3 text-secondary" style={{ fontSize: '0.95rem' }}>
                <span>Shipping</span>
                <span className="fw-medium text-black">
                  {shippingFee === 0 ? '₹0.00 (Free Insured)' : `₹${shippingFee.toFixed(2)}`}
                </span>
              </div>

              <div className="d-flex justify-content-between mb-3 text-secondary" style={{ fontSize: '0.95rem' }}>
                <span>Total Products</span>
                <span className="fw-medium text-black">{totalProductsCount}</span>
              </div>

              <hr className="my-4 border-secondary-subtle" />

              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold text-black font-serif fs-5">Total</span>
                <span className="fw-bold text-black font-serif fs-5">
                  ₹{grandTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>

              {/* Proceed to Checkout Button */}
              <button
                onClick={handleProceedToCheckout}
                disabled={cartItems.length === 0 || checkoutLoading}
                className="btn w-100 py-3 rounded-3 fw-bold shadow-lg transition-all border-0 d-flex align-items-center justify-content-center gap-2 text-black"
                style={{
                  background: 'linear-gradient(135deg, #d4af37 0%, #f7e089 50%, #b8860b 100%)',
                  fontSize: '1.08rem',
                  letterSpacing: '0.04em',
                  boxShadow: '0 8px 24px rgba(212, 175, 55, 0.35)',
                  cursor: cartItems.length === 0 || checkoutLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {checkoutLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2 text-black" role="status" aria-hidden="true"></span>
                    <span>Securing Order...</span>
                  </>
                ) : (
                  <>
                    <Lock size={18} className="text-black" />
                    <span>Proceed to Checkout</span>
                    <Sparkles size={16} className="text-black ms-1" />
                  </>
                )}
              </button>

              <div className="mt-3 text-center text-muted small d-flex align-items-center justify-content-center gap-1">
                <ShieldCheck size={15} className="text-success" />
                <span>Secured 256-Bit Razorpay Payment</span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;


