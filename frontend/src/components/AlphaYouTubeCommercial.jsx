import React from 'react';
import { Link } from 'react-router-dom';
import { Gem, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const AlphaYouTubeCommercial = () => {
  const { isAuthenticated, logout } = useAuth();
  const videoRef = React.useRef(null);

  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.warn('Autoplay prevented or interrupted:', err);
      });
    }
  }, []);

  return (
    <section 
      className="alpha-fullscreen-video-hero position-relative overflow-hidden bg-black" 
      style={{ 
        height: '100vh', 
        width: '100%',
        margin: 0,
        padding: 0,
        top: 0,
        left: 0,
      }}
    >
      <style>{`
        html, body, #root, .app-shell, main, .home-page {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          overflow-x: hidden !important;
        }
        .alpha-fullscreen-video-hero {
          background-color: #000000 !important;
          position: relative !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          height: 100vh !important;
          overflow: hidden !important;
        }
        .alpha-video-bg {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important;
          object-position: center !important;
          pointer-events: none !important;
          user-select: none !important;
          -webkit-user-select: none !important;
          touch-action: none !important;
          transform: scale(1.05) !important;
        }
      `}</style>

      {/* Direct 1080p MP4 Video Background (Fits Entire Screen Perfectly) */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        controls={false}
        className="alpha-video-bg"
      >
        <source src="/videos/kalyan_ad_1080p_48s.mp4" type="video/mp4" />
        <source src="/videos/hero_jewellery.mp4" type="video/mp4" />
      </video>

      {/* Luxury Dark Header Bar */}
      <header
        className="position-absolute top-0 start-0 end-0 px-4 px-md-5 py-3 d-flex align-items-center justify-content-between"
        style={{
          zIndex: 10000,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)',
        }}
      >
        {/* Left Side: Logo & Company Name */}
        <Link to="/" className="d-flex align-items-center gap-2.5 text-decoration-none">
          <Gem size={28} className="text-gold" />
          <span className="font-serif fw-bold fs-3 text-white tracking-wide">
            Alpha <span className="text-gold">Jewels</span>
          </span>
        </Link>

        {/* Right Side: Login & Register Buttons */}
        <div className="d-flex align-items-center gap-3">
          <Link
            to="/login"
            className="btn btn-outline-gold px-4 py-2 rounded-3 text-white fw-bold hover-bg-gold hover-text-black transition-all"
            style={{ fontSize: '0.95rem', border: '1.5px solid #d4af37' }}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="btn btn-gold px-4 py-2 rounded-3 text-black fw-bold shadow transition-all"
            style={{ fontSize: '0.95rem' }}
          >
            Register
          </Link>
        </div>
      </header>
    </section>
  );
};

export default AlphaYouTubeCommercial;
