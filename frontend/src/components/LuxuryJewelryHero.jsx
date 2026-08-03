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
    <div className="aurum-hero-container position-relative overflow-hidden w-100 min-vh-100 d-flex flex-column justify-content-center text-white bg-black">
      
      {/* Background Image: Woman Model Wearing Gold Necklace (Zoomed out for full visibility) */}
      <div 
        className="aurum-hero-bg position-absolute top-0 start-0 w-100 h-100 transition-all duration-700"
        style={{
          backgroundImage: `url('${currentHero.url}')`,
          backgroundSize: 'contain',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          filter: 'brightness(1) contrast(1)',
        }}
      >
        {/* Subtle Ambient Gradient for Content Readability */}
        <div 
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{
            background: `
              linear-gradient(180deg, rgba(0, 0, 0, 0.35) 0%, rgba(0, 0, 0, 0.05) 50%, rgba(0, 0, 0, 0.55) 100%)
            `,
          }}
        />
      </div>

      {/* Center Main Section */}
      <main className="position-relative z-3 container text-center my-auto py-5">
        
        {/* Brand Header */}
        <div className="mb-4">
          <h1 className="aurum-brand-title font-serif display-3 fw-bold text-gold-metallic tracking-ultra mb-2" style={{ letterSpacing: '0.2em' }}>
            ALPHA JEWELS
          </h1>
          <p className="aurum-brand-subtitle font-sans text-gold-light opacity-90 tracking-widest text-uppercase mb-0" style={{ letterSpacing: '0.3em', fontSize: '0.85rem' }}>
            HAUTE JOAILLERIE · EXQUISITE CRAFTSMANSHIP
          </p>
        </div>

        {/* Main Slogan */}
        <div className="mb-5">
          <h2 className="aurum-headline font-serif display-5 fw-normal text-white tracking-wide lh-sm max-width-md mx-auto" style={{ maxWidth: '850px', letterSpacing: '0.1em' }}>
            TIMELESS ELEGANCE, <br />
            <span className="text-gold-metallic fw-normal">UNRIVALED CRAFTSMANSHIP</span>
          </h2>
        </div>

        {/* Explore Collection Button */}
        <div className="d-flex flex-column align-items-center gap-3 mt-4">
          <Link 
            to="/shop" 
            className="btn aurum-btn-outline px-5 py-3 rounded-3 text-black font-sans fw-bold text-uppercase tracking-widest shadow-2xl transition-all"
            style={{
              background: 'linear-gradient(135deg, #d4af37 0%, #f7e089 50%, #b8860b 100%)',
              border: 'none',
              letterSpacing: '0.15em',
              boxShadow: '0 10px 30px rgba(212, 175, 55, 0.4)',
              fontSize: '1rem',
            }}
          >
            EXPLORE THE COLLECTION
          </Link>
        </div>

      </main>
    </div>
  );
};

export default LuxuryJewelryHero;

