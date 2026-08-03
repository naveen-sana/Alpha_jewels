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
          backgroundPosition: 'right 20% center',
          filter: 'brightness(1.02) contrast(1.05)',
        }}
      >
        {/* Left Dark Gradient Overlay so text is 100% legible while right portrait is 100% crystal clear */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: `
              linear-gradient(90deg, rgba(5, 5, 8, 0.95) 0%, rgba(5, 5, 8, 0.75) 42%, rgba(5, 5, 8, 0.15) 75%, rgba(5, 5, 8, 0) 100%),
              linear-gradient(180deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.6) 100%)
            `,
          }}
        />
      </div>

      {/* Main Section: Left-aligned content to never overlap face or jewelry */}
      <main className="position-relative z-3 container py-5">
        <div className="row align-items-center">
          <div className="col-lg-6 col-md-8 text-start">
            
            {/* Brand Header */}
            <div className="mb-3">
              <span className="badge bg-gold-subtle text-gold fw-bold text-uppercase px-3 py-1.5 rounded-pill mb-3 border border-gold-soft" style={{ letterSpacing: '0.25em', fontSize: '0.75rem' }}>
                HAUTE JOAILLERIE
              </span>
              <h1 className="aurum-brand-title font-serif display-3 fw-bold text-gold-metallic tracking-ultra mb-2" style={{ letterSpacing: '0.15em', textShadow: '0 4px 20px rgba(0,0,0,0.8)' }}>
                ALPHA JEWELS
              </h1>
              <p className="aurum-brand-subtitle font-sans text-gold-light opacity-90 tracking-widest text-uppercase mb-0" style={{ letterSpacing: '0.25em', fontSize: '0.85rem' }}>
                EXQUISITE CRAFTSMANSHIP · SINCE 1928
              </p>
            </div>

            {/* Main Slogan */}
            <div className="my-4">
              <h2 className="aurum-headline font-serif display-5 fw-normal text-white tracking-wide lh-sm" style={{ letterSpacing: '0.08em', textShadow: '0 4px 15px rgba(0,0,0,0.7)' }}>
                TIMELESS ELEGANCE, <br />
                <span className="text-gold-metallic fw-normal">UNRIVALED CRAFTSMANSHIP</span>
              </h2>
              <p className="text-white-50 mt-3 fs-6" style={{ maxWidth: '480px', lineHeight: '1.7' }}>
                Discover our signature 22K gold chokers, hand-set diamonds, and royal heritage bridal masterpieces.
              </p>
            </div>

            {/* Explore Collection Button */}
            <div className="d-flex align-items-center gap-3 mt-4 pt-2">
              <Link 
                to="/shop" 
                className="btn aurum-btn-outline px-5 py-3 rounded-3 text-black font-sans fw-bold text-uppercase tracking-widest shadow-2xl transition-all"
                style={{
                  background: 'linear-gradient(135deg, #d4af37 0%, #f7e089 50%, #b8860b 100%)',
                  border: 'none',
                  letterSpacing: '0.15em',
                  boxShadow: '0 10px 30px rgba(212, 175, 55, 0.5)',
                  fontSize: '0.95rem',
                }}
              >
                EXPLORE THE COLLECTION
              </Link>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default LuxuryJewelryHero;

