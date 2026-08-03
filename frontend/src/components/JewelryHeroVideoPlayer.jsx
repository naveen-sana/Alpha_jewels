import React, { useState, useEffect } from 'react';
import { Play, Pause, Sparkles, Gem, ShieldCheck, Eye, RotateCw } from 'lucide-react';

const JewelryHeroVideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeItem, setActiveItem] = useState(0);

  const jewelryAds = [
    {
      title: 'Royal Heritage Diamond Choker',
      category: '22K Gold & Solitaire Diamonds',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200',
      specs: '18.5ct Round Solitaire Diamonds • Pure Gold Filigree',
      badge: 'Slow Motion 0.35x Ad'
    },
    {
      title: 'Solitaire Platinum Wedding Band',
      category: '950 Platinum & Cushion Cut Solitaire',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200',
      specs: 'VVS1 Fire Clarity Solitaire Diamond',
      badge: 'Precision Polishing Reel'
    },
    {
      title: 'Emerald & Heritage Gold Pendant',
      category: 'Columbian Emerald & Antique 24K Gold',
      image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1200',
      specs: 'Hand-carved Temple Artwork • Certified Gemstone',
      badge: 'Haute Joaillerie Motion'
    }
  ];

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveItem((prev) => (prev + 1) % jewelryAds.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const current = jewelryAds[activeItem];

  return (
    <div className="hero-jewelry-video-player-card position-relative rounded-4 overflow-hidden border-gold-glowing shadow-2xl bg-black">
      {/* Top Badge Overlay */}
      <div className="position-absolute top-0 start-0 m-3 z-index-3 bg-white-90 backdrop-blur border border-gold px-3 py-1.5 rounded-pill d-flex align-items-center gap-2 shadow-sm">
        <Sparkles size={14} className="text-gold-dark fill-gold animate-pulse" />
        <span className="small fw-bold text-black">{current.badge}</span>
      </div>

      {/* Main Slow Motion Jewelry Motion Canvas */}
      <div 
        className="position-relative d-flex align-items-center justify-content-center overflow-hidden" 
        style={{ height: '420px', background: 'radial-gradient(circle at center, #1c1c28 0%, #06060a 100%)' }}
      >
        {/* Slow Motion Shimmer Rotation Frame */}
        <div className={`slowmo-jewelry-frame position-relative text-center p-3 ${isPlaying ? 'slowmo-zoom-pan' : ''}`}>
          <img
            src={current.image}
            alt={current.title}
            className="img-fluid rounded-4 object-fit-cover shadow-2xl border-gold-soft"
            style={{ maxHeight: '310px', width: '310px', objectFit: 'cover' }}
          />
          {/* Sparkling Gemstone Light Flares */}
          <div className="sparkle-particle sparkle-1" />
          <div className="sparkle-particle sparkle-2" />
          <div className="sparkle-particle sparkle-3" />
        </div>

        {/* Dark Vignette Overlay */}
        <div className="position-absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)' }} />

        {/* Bottom Title & Ad Info Bar */}
        <div className="position-absolute bottom-0 start-0 end-0 p-4 text-white z-index-3 d-flex align-items-end justify-content-between gap-3">
          <div>
            <span className="badge bg-gold text-black rounded-pill mb-1 small fw-bold">{current.category}</span>
            <h4 className="font-serif fw-bold text-white mb-0 fs-5">{current.title}</h4>
            <p className="text-light-gold small mb-0 font-light">{current.specs}</p>
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="btn btn-gold rounded-circle d-flex align-items-center justify-content-center p-3 shadow-lg hover-scale"
            style={{ width: '48px', height: '48px' }}
            title={isPlaying ? 'Pause Motion' : 'Play Motion'}
          >
            {isPlaying ? <Pause size={20} className="text-black" /> : <Play size={20} className="text-black ms-px" />}
          </button>
        </div>
      </div>

      {/* Ad Indicator Tabs */}
      <div className="bg-cream p-2 px-3 border-top border-gold-soft d-flex justify-content-center gap-2">
        {jewelryAds.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveItem(idx)}
            className={`btn btn-sm rounded-circle p-0 transition-all ${
              activeItem === idx ? 'bg-gold' : 'bg-secondary opacity-40'
            }`}
            style={{ width: '10px', height: '10px' }}
          />
        ))}
      </div>
    </div>
  );
};

export default JewelryHeroVideoPlayer;
