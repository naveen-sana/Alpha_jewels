import React, { useState, useEffect } from 'react';
import { Sparkles, Gem, Play, Pause, Eye, RotateCcw, ShieldCheck, Award } from 'lucide-react';

const JewelryMotionReel = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(0.35); // 0.35x slow motion speed
  const [activeItemKey, setActiveItemKey] = useState('necklace');

  const items = {
    necklace: {
      title: 'Royal Heritage Diamond & Gold Choker',
      category: '22K Gold & Certified Solitaire Diamonds',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200',
      tag: 'Slow Motion 360° Showcase',
      specs: '18.5ct Round Brilliant Diamonds • 22K Gold Filigree'
    },
    ring: {
      title: 'Solitaire Platinum Diamond Ring',
      category: '950 Pure Platinum & Uncut Diamond',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200',
      tag: 'Precision Polishing Reel',
      specs: '3.2ct VVS1 Clarity Solitaire • Cushion Cut'
    },
    pendant: {
      title: 'Emerald & Gold Royal Pendant',
      category: 'Columbian Emerald & Antique Gold',
      image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1200',
      tag: 'Artisan Heritage Showcase',
      specs: 'Hand-carved Temple Artistry • 24K Gold Leafing'
    }
  };

  const current = items[activeItemKey];

  // Animation duration in seconds calculated based on slow motion speed
  // Normal speed = 10s, 0.35x slow motion = 28.5s rotation
  const animationDuration = `${(10 / speed).toFixed(1)}s`;

  return (
    <div className="jewelry-motion-reel-card card border-gold shadow-2xl rounded-4 overflow-hidden bg-white my-4">
      {/* Control Bar Header */}
      <div className="p-3 px-4 bg-cream border-bottom border-gold-soft d-flex flex-wrap align-items-center justify-content-between gap-3">
        <div className="d-flex align-items-center gap-2">
          <Sparkles size={20} className="text-gold-dark" />
          <span className="fw-bold font-serif fs-5 text-black">Jewelry Craftsmanship in Motion</span>
          <span className="badge bg-gold text-black rounded-pill ms-2 px-3 py-1 fw-bold">{speed}x Slow Motion</span>
        </div>

        {/* Speed Switcher Controls */}
        <div className="d-flex align-items-center gap-2">
          <span className="small text-muted fw-semibold me-1">Slow Motion Speed:</span>
          {[0.25, 0.35, 0.5, 1.0].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`btn btn-sm rounded-pill px-3 py-1 fw-bold transition-all ${
                speed === s ? 'btn-gold text-black shadow' : 'btn-outline-secondary'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Main 3D Motion Canvas Showcase */}
      <div className="position-relative overflow-hidden" style={{ minHeight: '520px', background: 'radial-gradient(circle at center, #1a1a24 0%, #08080c 100%)' }}>
        {/* Background Ambient Glow */}
        <div className="position-absolute inset-0 bg-gold-transparent opacity-20 pointer-events-none" />

        {/* Slow Motion Rotating Jewelry Display */}
        <div className="d-flex align-items-center justify-content-center h-100 py-5 position-relative z-index-2">
          <div className="text-center">
            <div 
              className={`jewelry-3d-motion-container position-relative d-inline-block rounded-circle p-4 ${isPlaying ? 'rotating-slowmo' : ''}`}
              style={{
                animationDuration: animationDuration,
                border: '2px solid rgba(212, 175, 55, 0.4)',
                boxShadow: '0 0 50px rgba(212, 175, 55, 0.3)',
                background: 'rgba(255, 255, 255, 0.03)'
              }}
            >
              <img
                src={current.image}
                alt={current.title}
                className="img-fluid rounded-circle object-fit-cover shadow-2xl"
                style={{ width: '320px', height: '320px', border: '4px solid #d4af37' }}
              />
              <div className="sparkle-particle sparkle-1" />
              <div className="sparkle-particle sparkle-2" />
              <div className="sparkle-particle sparkle-3" />
            </div>

            <div className="mt-4 text-center">
              <span className="badge bg-gold text-black rounded-pill px-3 py-1.5 fw-bold text-uppercase tracking-wider mb-2">
                {current.tag}
              </span>
              <h3 className="font-serif text-white display-6 mb-1">{current.title}</h3>
              <p className="text-light-gold mb-0 small">{current.specs}</p>
            </div>
          </div>
        </div>

        {/* Bottom Control Overlay Bar */}
        <div className="position-absolute bottom-0 start-0 end-0 p-4 text-white d-flex flex-wrap align-items-center justify-content-between gap-3 z-index-3" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)' }}>
          <div className="d-flex align-items-center gap-3">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="btn btn-gold rounded-circle d-flex align-items-center justify-content-center p-3 shadow-lg hover-scale"
              style={{ width: '50px', height: '50px' }}
              title={isPlaying ? 'Pause Motion' : 'Resume Slow Motion'}
            >
              {isPlaying ? <Pause size={22} className="text-black" /> : <Play size={22} className="text-black ms-px" />}
            </button>
            <div>
              <div className="fw-bold text-white small">{isPlaying ? 'Slow Motion Active' : 'Motion Paused'}</div>
              <div className="text-muted small">{speed}x Playback Rate</div>
            </div>
          </div>

          {/* Item Selector Buttons */}
          <div className="btn-group bg-dark p-1 rounded-pill border border-gold-subtle">
            {Object.keys(items).map((key) => (
              <button
                key={key}
                onClick={() => setActiveItemKey(key)}
                className={`btn btn-sm rounded-pill px-3 py-1.5 text-capitalize fw-semibold ${
                  activeItemKey === key ? 'bg-gold text-black shadow' : 'text-white-50 hover-white'
                }`}
              >
                {key}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JewelryMotionReel;
