import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Camera, ArrowRight } from 'lucide-react';

const modelHeroImages = [
  {
    id: 1,
    name: 'Regal Emerald & 22k Gold Choker',
    url: '/images/hero_gold_necklace_model.png',
    tag: 'Haute Joaillerie 22K',
  },
  {
    id: 2,
    name: 'Royal Heritage Gold Bridal Necklace',
    url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=2400&auto=format&fit=crop',
    tag: 'Royal Heritage Edition',
  },
  {
    id: 3,
    name: 'Solitaire Diamond & Gold Collar',
    url: 'https://images.unsplash.com/photo-1611591475281-8d2813298c4d?q=80&w=2400&auto=format&fit=crop',
    tag: 'Contemporary Luxury',
  },
];

const LuxuryJewelryHero = () => {
  const [activeModel, setActiveModel] = useState(0);
  const currentHero = modelHeroImages[activeModel];

  return (
    <div className="aurum-hero-container position-relative overflow-hidden w-100 min-vh-100 d-flex flex-column justify-content-between text-white bg-black">
      
      {/* Background Image: Woman Model Wearing Gold Necklace */}
      <div 
        className="aurum-hero-bg position-absolute top-0 start-0 w-100 h-100 transition-all duration-700"
        style={{
          backgroundImage: `url('${currentHero.url}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          filter: 'brightness(0.68) contrast(1.15)',
        }}
      >
        {/* Dark Silk & Radial Spotlight Gradient Overlay */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: `
              radial-gradient(circle at 50% 50%, rgba(15, 15, 20, 0.40) 0%, rgba(5, 5, 8, 0.92) 80%),
              linear-gradient(180deg, rgba(0, 0, 0, 0.85) 0%, rgba(0, 0, 0, 0.25) 50%, rgba(0, 0, 0, 0.95) 100%)
            `,
          }}
        />

        {/* Ambient Gold Particle Accents */}
        <div className="bokeh-particle bokeh-1" />
        <div className="bokeh-particle bokeh-2" />
        <div className="bokeh-particle bokeh-3" />
      </div>

      {/* Top Header Navigation (HOME | COLLECTIONS | OUR STORY | BOUTIQUES) */}
      <header className="position-relative z-3 w-100 py-4 text-center">
        <nav className="d-flex align-items-center justify-content-center gap-3 gap-md-4 font-sans text-uppercase tracking-widest small fw-medium">
          <Link to="/" className="aurum-nav-link text-white text-decoration-none border-bottom border-gold pb-1 px-1">HOME</Link>
          <span className="text-white-50 opacity-40">|</span>
          <Link to="/shop?category=Collections" className="aurum-nav-link text-white-50 text-decoration-none hover-gold px-1">COLLECTIONS</Link>
          <span className="text-white-50 opacity-40">|</span>
          <Link to="/shop" className="aurum-nav-link text-white-50 text-decoration-none hover-gold px-1">OUR STORY</Link>
          <span className="text-white-50 opacity-40">|</span>
          <Link to="/shop" className="aurum-nav-link text-white-50 text-decoration-none hover-gold px-1">BOUTIQUES</Link>
        </nav>
      </header>

      {/* Center Main Section */}
      <main className="position-relative z-3 container text-center my-auto py-4">
        
        {/* Brand Header */}
        <div className="mb-4">
          <h1 className="aurum-brand-title font-serif display-4 fw-normal text-gold-metallic tracking-ultra mb-1" style={{ letterSpacing: '0.25em' }}>
            AURUM & CO.
          </h1>
          <p className="aurum-brand-subtitle font-sans text-gold-light opacity-85 tracking-widest extra-small text-uppercase mb-0" style={{ letterSpacing: '0.35em', fontSize: '0.75rem' }}>
            EXQUISITE JEWELRY · SINCE 1928
          </p>
        </div>

        {/* Main Headline */}
        <div className="mb-5">
          <h2 className="aurum-headline font-serif display-5 fw-normal text-white tracking-wide lh-sm max-width-md mx-auto" style={{ maxWidth: '850px', letterSpacing: '0.12em' }}>
            TIMELESS ELEGANCE, <br />
            <span className="text-gold-metallic fw-normal">UNRIVALED CRAFTSMANSHIP</span>
          </h2>
        </div>

        {/* Action Buttons */}
        <div className="d-flex flex-column align-items-center gap-3 mt-4">
          <Link 
            to="/shop" 
            className="btn aurum-btn-outline px-5 py-3 rounded-0 text-white font-sans text-uppercase tracking-widest small shadow-lg transition-all"
            style={{
              border: '1px solid rgba(212, 175, 55, 0.6)',
              background: 'rgba(0, 0, 0, 0.4)',
              letterSpacing: '0.2em',
              backdropFilter: 'blur(8px)',
            }}
          >
            EXPLORE THE COLLECTION
          </Link>

          <Link 
            to="/shop?category=New" 
            className="aurum-link-underline font-sans text-gold-light small tracking-widest text-uppercase text-decoration-none pt-2"
            style={{ letterSpacing: '0.18em', borderBottom: '1px solid rgba(212, 175, 55, 0.4)', paddingBottom: '2px' }}
          >
            SHOP NEW ARRIVALS
          </Link>
        </div>

      </main>

      {/* Bottom Corner Brand Indicators (ROLEX / Spark / CARTIER) */}
      <footer className="position-relative z-3 w-100 py-3 px-4 px-md-5 d-flex align-items-center justify-content-between">
        <div className="text-white-50 font-serif tracking-widest small opacity-75" style={{ letterSpacing: '0.2em' }}>
          ROLEX
        </div>

        <div className="d-flex align-items-center gap-2">
          <Sparkles size={16} className="text-gold opacity-75 animate-pulse" />
        </div>

        <div className="text-white-50 font-serif tracking-widest small opacity-75" style={{ letterSpacing: '0.2em' }}>
          CARTIER
        </div>
      </footer>

    </div>
  );
};

export default LuxuryJewelryHero;

