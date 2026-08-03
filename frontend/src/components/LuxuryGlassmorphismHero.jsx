import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, Shield, Star, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const LuxuryGlassmorphismHero = () => {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please fill in both email and password.');
      return;
    }
    setErrorMsg('');
    setLoading(true);

    try {
      await login({ email, password });
      setShowSuccessPopup(true);
      setTimeout(() => {
        navigate('/shop');
      }, 1600);
    } catch (err) {
      setErrorMsg(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="luxury-hero-container position-relative overflow-hidden w-100 min-vh-100 d-flex flex-column justify-content-between">
      {/* Login Success Popup Modal */}
      {showSuccessPopup && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center animate-fade-in"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)', zIndex: 9999 }}
        >
          <div 
            className="card border-gold rounded-4 p-4 p-md-5 text-center shadow-2xl animate-scale-up"
            style={{ 
              maxWidth: '440px', 
              width: '90%', 
              background: 'linear-gradient(145deg, #18181b, #09090b)', 
              borderColor: '#d4af37',
              boxShadow: '0 25px 50px -12px rgba(212, 175, 55, 0.25)' 
            }}
          >
            <div className="mb-3 d-flex justify-content-center">
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '70px', height: '70px', backgroundColor: 'rgba(212, 175, 55, 0.15)', border: '2px solid #d4af37' }}
              >
                <CheckCircle size={40} className="text-gold" />
              </div>
            </div>
            
            <h3 className="font-serif text-gold display-6 mb-2 fw-bold">Login Successful!</h3>
            <p className="text-white fs-6 mb-1">
              User successfully logged in.
            </p>
            <p className="text-white-50 small mb-4">
              Welcome back to Alpha Jewels! Redirecting to boutique...
            </p>

            <button 
              onClick={() => navigate('/shop')}
              className="btn btn-gold rounded-3 w-100 py-2.5 text-black fw-bold d-flex align-items-center justify-content-center gap-2"
            >
              <Sparkles size={18} />
              <span>Explore Collection Now</span>
            </button>
          </div>
        </div>
      )}
      {/* Background Image with Dark Vignette Overlay */}
      <div 
        className="luxury-hero-bg position-absolute top-0 start-0 w-100 h-100"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=2000&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center right',
          filter: 'brightness(0.72) contrast(1.1)',
        }}
      >
        {/* Dark Ambient Gradient Overlays matching user's image */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: 'linear-gradient(90deg, rgba(10, 10, 12, 0.85) 0%, rgba(15, 15, 18, 0.45) 50%, rgba(10, 10, 12, 0.75) 100%)',
          }}
        />
        <div 
          className="position-absolute bottom-0 start-0 w-100 h-50"
          style={{
            background: 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(8, 8, 10, 0.95) 100%)',
          }}
        />
      </div>

      {/* Top Header Navigation Bar (Matching user's reference image header) */}
      <header className="luxury-top-nav position-relative z-3 py-3 px-4 px-md-5 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-4 gap-lg-5">
          <Link to="/" className="text-decoration-none">
            <span className="brand-logo-text fs-2 font-serif fw-bold text-gold-gradient tracking-wide">
              Alpha Jewels
            </span>
          </Link>
          <nav className="d-none d-lg-flex align-items-center gap-4 ms-3">
            <Link to="/shop?category=Collections" className="nav-link-luxury">Collections</Link>
            <Link to="/shop?category=FineJewelry" className="nav-link-luxury">Fine Jewelry</Link>
            <Link to="/shop?category=Watches" className="nav-link-luxury">Watches</Link>
            <Link to="/shop?category=Boutique" className="nav-link-luxury">Boutique</Link>
            <Link to="/shop" className="nav-link-luxury">Contact</Link>
          </nav>
        </div>

        <div className="d-flex align-items-center gap-3">
          <Link to="/shop" className="btn btn-luxury-review px-4 py-2 rounded-3 text-white fw-semibold small shadow-sm">
            <Star size={15} className="me-1 text-gold fill-gold" /> Explore Shop
          </Link>
        </div>
      </header>

      {/* Main Glassmorphism Center Section */}
      <main className="position-relative z-3 container my-auto py-5 d-flex align-items-center justify-content-center">
        <div className="row w-100 justify-content-center align-items-center">
          <div className="col-12 col-md-8 col-lg-5 col-xl-4">
            
            {/* Glassmorphism Frosted Floating Card */}
            <div className="glass-card-luxury p-4 p-sm-5 rounded-4 shadow-2xl text-center position-relative overflow-hidden">
              
              {/* Gold Lens Flare Accent */}
              <div className="glass-gold-glow position-absolute top-0 start-50 translate-middle-x w-75 h-1" />

              {/* Title Header */}
              <div className="mb-4">
                <h1 className="display-6 font-serif fw-normal text-gold-gradient mb-1 tracking-wide">
                  Alpha Jewels
                </h1>
                <p className="text-light-subtle small letter-spacing-1 font-serif opacity-75">
                  HAUTE JOAILLERIE & FINE DIAMONDS
                </p>
              </div>

              {user ? (
                /* Authenticated User Welcome State */
                <div className="py-3 text-center">
                  <div className="mb-3">
                    <span className="badge bg-gold-subtle text-gold border border-gold-soft px-3 py-2 fs-6 rounded-pill">
                      Welcome back, {user.fullName || user.username || 'Valued Member'}
                    </span>
                  </div>
                  <p className="text-light-subtle small mb-4">
                    Explore our newest handcrafted 22K gold & diamond masterworks.
                  </p>
                  <Link 
                    to="/shop" 
                    className="btn btn-gold-gradient w-100 py-3 rounded-3 text-black font-serif fw-bold text-uppercase tracking-wider shadow-lg d-inline-flex align-items-center justify-content-center gap-2"
                  >
                    Enter Fine Jewelry Shop <ArrowRight size={18} />
                  </Link>
                </div>
              ) : (
                /* Unauthenticated Sign In Form (Exactly like reference image) */
                <form onSubmit={handleSignIn} className="text-start">
                  {errorMsg && (
                    <div className="alert alert-danger bg-danger-subtle border-danger text-danger-emphasis py-2 px-3 small rounded-3 mb-3">
                      {errorMsg}
                    </div>
                  )}

                  {/* Email Input */}
                  <div className="mb-3">
                    <label className="form-label text-light-subtle small fw-medium mb-1 font-sans">
                      Email Address
                    </label>
                    <div className="glass-input-wrapper position-relative">
                      <Mail size={18} className="glass-input-icon text-gold position-absolute top-50 start-0 translate-middle-y ms-3 opacity-75" />
                      <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email@example.com"
                        className="form-control glass-input ps-5 pe-3 py-2.5 text-white bg-transparent rounded-3"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="mb-4">
                    <label className="form-label text-light-subtle small fw-medium mb-1 font-sans">
                      Password
                    </label>
                    <div className="glass-input-wrapper position-relative">
                      <Lock size={18} className="glass-input-icon text-gold position-absolute top-50 start-0 translate-middle-y ms-3 opacity-75" />
                      <input 
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="********"
                        className="form-control glass-input ps-5 pe-5 py-2.5 text-white bg-transparent rounded-3"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="btn border-0 text-gold position-absolute top-50 end-0 translate-middle-y me-2 bg-transparent p-1 opacity-75"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* Sign In Golden Metallic Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-gold-gradient w-100 py-3 rounded-3 text-black font-serif fw-bold fs-5 shadow-lg transition-all mb-3 d-flex align-items-center justify-content-center"
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                    ) : null}
                    {loading ? 'Authenticating...' : 'Sign In'}
                  </button>

                  {/* Links */}
                  <div className="text-center pt-2">
                    <div className="mb-2">
                      <Link to="/forgot-password" className="text-gold-light small hover-underline font-sans">
                        Forgot Password?
                      </Link>
                    </div>
                    <div className="text-light-subtle small font-sans">
                      Don't have an account?{' '}
                      <Link to="/register" className="text-gold fw-semibold hover-underline">
                        Sign Up
                      </Link>
                    </div>
                  </div>
                </form>
              )}

            </div>
          </div>
        </div>
      </main>

      {/* Bottom Subtle Guarantee Highlights */}
      <footer className="position-relative z-3 py-3 px-4 text-center border-top border-gold-faint bg-black-transparent">
        <div className="container d-flex flex-wrap align-items-center justify-content-center gap-4 gap-md-5 text-light-subtle small">
          <span className="d-inline-flex align-items-center gap-2">
            <Sparkles size={15} className="text-gold" /> 22K Certified Hallmarked Gold
          </span>
          <span className="d-inline-flex align-items-center gap-2">
            <Shield size={15} className="text-gold" /> Guaranteed VVS Solitaire Diamonds
          </span>
          <span className="d-inline-flex align-items-center gap-2">
            <Star size={15} className="text-gold" /> Bespoke Royal Craftsmanship
          </span>
        </div>
      </footer>
    </div>
  );
};

export default LuxuryGlassmorphismHero;
