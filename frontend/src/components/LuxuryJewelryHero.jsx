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
    <div className="aurum-hero-container position-relative overflow-hidden w-100 min-vh-100 d-flex align-items-center text-white bg-black">
      
      {/* Background Image: Woman Model Wearing Gold Necklace (Shifted right for clear model visibility) */}
      <div 
        className="aurum-hero-bg position-absolute top-0 start-0 w-100 h-100 transition-all duration-700"
        style={{
          backgroundImage: `url('${currentHero.url}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'right 15% center',
          filter: 'brightness(1.04) contrast(1.05)',
        }}
      >
        {/* Left Dark Vignette Gradient Overlay so text is 100% legible while right portrait is 100% crystal clear */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: `
              linear-gradient(90deg, rgba(5, 5, 8, 0.96) 0%, rgba(5, 5, 8, 0.80) 45%, rgba(5, 5, 8, 0.20) 75%, rgba(5, 5, 8, 0) 100%),
              linear-gradient(180deg, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.55) 100%)
            `,
          }}
        />
      </div>

      {/* Main Section: Left-aligned luxury framed card */}
      <main className="position-relative z-3 container py-5">
        <div className="row align-items-center">
          <div className="col-lg-6 col-md-8 text-start ps-4 ps-md-5" style={{ borderLeft: '3px solid #d4af37' }}>
            
            {/* Category Tag */}
            <div className="mb-3">
              <span className="badge bg-gold-subtle text-gold fw-bold text-uppercase px-3 py-1.5 rounded-pill mb-2 border border-gold-soft" style={{ letterSpacing: '0.25em', fontSize: '0.75rem' }}>
                HAUTE JOAILLERIE
              </span>
              
              {/* Brand Title: Single line responsive serif typography */}
              <h1 
                className="aurum-brand-title font-serif fw-bold text-gold-metallic tracking-wider mb-2 text-nowrap" 
                style={{ 
                  fontSize: 'clamp(2.2rem, 5vw, 3.8rem)', 
                  letterSpacing: '0.12em', 
                  textShadow: '0 4px 20px rgba(0,0,0,0.9)' 
                }}
              >
                ALPHA JEWELS
              </h1>
              
              <p className="aurum-brand-subtitle font-sans text-gold-light opacity-90 tracking-widest text-uppercase mb-0" style={{ letterSpacing: '0.22em', fontSize: '0.8rem' }}>
                EXQUISITE CRAFTSMANSHIP · SINCE 1928
              </p>
            </div>

            {/* Main Headline */}
            <div className="my-4">
              <h2 className="aurum-headline font-serif fw-normal text-white tracking-wide lh-sm" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)', letterSpacing: '0.06em', textShadow: '0 4px 15px rgba(0,0,0,0.8)' }}>
                TIMELESS ELEGANCE, <br />
                <span className="text-gold-metallic fw-normal">UNRIVALED CRAFTSMANSHIP</span>
              </h2>
              <p className="text-white-50 mt-3 fs-6" style={{ maxWidth: '460px', lineHeight: '1.75' }}>
                Discover our bespoke 22K gold chokers, hand-set solitaire diamonds, and royal heritage bridal masterpieces.
              </p>
            </div>

            {/* Explore Collection Button */}
            <div className="d-flex align-items-center gap-3 mt-4 pt-2">
              <Link 
                to="/shop" 
                className="btn aurum-btn-outline px-5 py-3 rounded-3 text-black font-sans fw-bold text-uppercase tracking-widest shadow-2xl transition-all d-inline-flex align-items-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #d4af37 0%, #f7e089 50%, #b8860b 100%)',
                  border: 'none',
                  letterSpacing: '0.15em',
                  boxShadow: '0 10px 30px rgba(212, 175, 55, 0.5)',
                  fontSize: '0.95rem',
                }}
              >
                <Sparkles size={18} className="text-black" />
                <span>EXPLORE THE COLLECTION</span>
              </Link>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default LuxuryJewelryHero;

