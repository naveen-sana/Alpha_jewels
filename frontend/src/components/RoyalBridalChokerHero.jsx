import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Play, Pause, Gem, ShieldCheck, Award, Star } from 'lucide-react';

const RoyalBridalChokerHero = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const canvasRef = useRef(null);

  const slides = [
    {
      badge: 'Haute Joaillerie 2026 Flagship',
      title: 'The Royal Heritage 22K Gold Choker',
      subtitle: 'Artisanal 22K yellow gold handcrafted with antique Kundan filigree, certified rubies, and emerald teardrop accents.',
      tag: 'Handcrafted Artistry',
      img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=1200',
      price: '₹2,45,000'
    },
    {
      badge: 'Solitaire Collection',
      title: 'Solitaire Platinum & Diamond Choker',
      subtitle: 'Pure 950 Platinum set with brilliant VVS1 clarity round solitaire diamonds for unmatched fire and brilliance.',
      tag: 'Certified Solitaire',
      img: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=1200',
      price: '₹3,80,000'
    },
    {
      badge: 'Bridal Heritage Edition',
      title: 'Imperial Emerald & Gold Suite',
      subtitle: 'Columbian emerald gemstones embedded in 24K gold leafing, designed for monumental celebrations.',
      tag: 'Royal Bridal Edition',
      img: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?q=80&w=1200',
      price: '₹4,10,000'
    }
  ];

  const current = slides[activeSlide];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = 720;
    canvas.height = 540;

    const img = new Image();
    img.src = current.img;

    let animId;
    let rotation = 0;
    let particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2.5 + 1,
      alpha: Math.random() * 0.8 + 0.2,
      speedY: Math.random() * 0.35 + 0.1,
    }));

    const render = () => {
      // Soft champagne-gold vignette background
      const bgGrad = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 40,
        canvas.width / 2, canvas.height / 2, 400
      );
      bgGrad.addColorStop(0, '#ffffff');
      bgGrad.addColorStop(0.65, '#f7f2ea');
      bgGrad.addColorStop(1, '#e8e0d2');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw golden dust particles
      particles.forEach((p) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
        ctx.shadowColor = '#d4af37';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();

        if (isPlaying) {
          p.y -= p.speedY;
          if (p.y < 0) p.y = canvas.height;
        }
      });

      // Draw high-fashion full-bleed image with smooth floating 60FPS slow motion
      if (img.complete && img.naturalWidth > 0) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);

        if (isPlaying) {
          rotation += 0.003;
        }
        const scale = 1.08 + Math.sin(rotation * 2) * 0.03;
        const tilt = Math.sin(rotation) * 0.02;

        ctx.rotate(tilt);
        ctx.scale(scale, scale);

        const drawW = 680;
        const drawH = 500;
        ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();
      }

      // Draw lens flare sweep
      ctx.save();
      const flareX = (Math.sin(rotation) * 0.5 + 0.5) * canvas.width;
      const flareGrad = ctx.createLinearGradient(flareX - 100, 0, flareX + 100, canvas.height);
      flareGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
      flareGrad.addColorStop(0.5, 'rgba(212, 175, 55, 0.28)');
      flareGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = flareGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, activeSlide]);

  return (
    <section className="royal-flagship-hero py-5 position-relative bg-cream-soft border-bottom border-gold-soft overflow-hidden">
      <div className="container py-4 position-relative z-index-3">
        <div className="row align-items-center g-5">
          {/* Left Column: Flagship Title & CTAs */}
          <div className="col-lg-6 text-center text-lg-start">
            <div className="d-inline-flex align-items-center gap-2 px-3.5 py-1.5 rounded-pill border border-gold bg-white shadow-sm mb-3">
              <Sparkles size={16} className="text-gold-dark fill-gold" />
              <span className="text-gold-dark text-uppercase tracking-widest small fw-bold mb-0">{current.badge}</span>
            </div>

            <h1 className="display-3 font-serif text-black fw-bold my-3" style={{ lineHeight: '1.1', letterSpacing: '-0.02em' }}>
              {current.title.split(' ')[0]} {current.title.split(' ')[1]} <br />
              <span className="text-gold-dark font-italic">{current.title.split(' ').slice(2).join(' ')}</span>
            </h1>

            <p className="lead text-dark max-width-md fs-5 font-light mb-4" style={{ maxWidth: '560px', lineHeight: '1.8' }}>
              {current.subtitle}
            </p>

            <div className="d-flex flex-wrap align-items-center gap-4 mb-4 justify-content-center justify-content-lg-start">
              <div>
                <span className="text-muted small d-block text-uppercase tracking-wider">Flagship Price</span>
                <span className="fs-3 font-serif fw-bold text-black">{current.price}</span>
              </div>
              <div className="border-start border-gold-soft ps-4 d-none d-sm-block">
                <span className="text-muted small d-block text-uppercase tracking-wider">Authenticity</span>
                <span className="fs-6 fw-bold text-gold-dark d-flex align-items-center gap-1">
                  <ShieldCheck size={16} /> 22K BIS Hallmarked
                </span>
              </div>
            </div>

            <div className="d-flex flex-wrap gap-3 align-items-center justify-content-center justify-content-lg-start mb-4">
              <Link to="/shop?category=Gold" className="btn btn-gold btn-lg px-5 py-3 text-black fw-bold shadow-lg rounded-3 fs-6">
                Explore Gold Collection <ArrowRight size={18} className="ms-2" />
              </Link>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="btn btn-outline-gold btn-lg px-4 py-3 text-black rounded-3 d-flex align-items-center gap-2 bg-white shadow-sm"
              >
                {isPlaying ? <Pause size={18} className="text-gold-dark" /> : <Play size={18} className="text-gold-dark fill-gold" />}
                <span className="small fw-bold">{isPlaying ? 'Pause Motion' : 'Play Slow Motion'}</span>
              </button>
            </div>

            {/* Slide Navigation Tabs */}
            <div className="d-flex align-items-center gap-2 justify-content-center justify-content-lg-start">
              {slides.map((slide, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveSlide(idx)}
                  className={`btn btn-sm rounded-pill px-3 py-1.5 fw-bold transition-all ${
                    activeSlide === idx ? 'btn-gold text-black shadow-sm' : 'btn-outline-secondary bg-white'
                  }`}
                >
                  0{idx + 1}. {slide.tag}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Full-Bleed 60FPS Slow Motion Flagship Canvas Frame */}
          <div className="col-lg-6">
            <div className="flagship-hero-canvas-frame position-relative rounded-4 overflow-hidden border-gold-glowing shadow-2xl bg-white">
              {/* Badge */}
              <div className="position-absolute top-0 start-0 m-3 z-index-3 bg-white-90 backdrop-blur border border-gold px-3 py-1.5 rounded-pill d-flex align-items-center gap-2 shadow-sm">
                <Play size={14} className="fill-gold text-gold-dark" />
                <span className="small fw-bold text-black">60FPS Slow Motion Craftsmanship Reel (0.35x)</span>
              </div>

              {/* 60FPS Full-Bleed Canvas */}
              <canvas
                ref={canvasRef}
                className="w-100 d-block rounded-4"
                style={{ maxHeight: '540px', minHeight: '440px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoyalBridalChokerHero;
