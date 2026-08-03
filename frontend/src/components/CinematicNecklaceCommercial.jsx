import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Play, Pause, Gem } from 'lucide-react';

const CinematicNecklaceCommercial = () => {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions for high DPI
    canvas.width = 640;
    canvas.height = 460;

    const img = new Image();
    img.src = '/images/hero_necklace_4k.png';

    let animationFrameId;
    let rotation = 0;
    let particles = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2.5 + 1,
      alpha: Math.random() * 0.8 + 0.2,
      speedY: Math.random() * 0.4 + 0.1,
    }));

    const render = () => {
      // Clear with dark ambient gradient background
      const bgGradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height / 2, 50,
        canvas.width / 2, canvas.height / 2, 350
      );
      bgGradient.addColorStop(0, '#1c1c28');
      bgGradient.addColorStop(0.6, '#09090e');
      bgGradient.addColorStop(1, '#040406');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw floating golden particles
      particles.forEach((p) => {
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${p.alpha})`;
        ctx.shadowColor = '#ffd700';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();

        if (isPlaying) {
          p.y -= p.speedY;
          if (p.y < 0) p.y = canvas.height;
        }
      });

      // Draw rotating 4K Gold Necklace
      if (img.complete && img.naturalWidth > 0) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);

        // Slow motion floating scale & rotation (0.35x speed = 0.005 rad per frame)
        if (isPlaying) {
          rotation += 0.003;
        }
        const scale = 1 + Math.sin(rotation * 2) * 0.03;
        const tilt = Math.sin(rotation) * 0.04;

        ctx.rotate(tilt);
        ctx.scale(scale, scale);

        const imgWidth = 340;
        const imgHeight = 340;
        ctx.drawImage(img, -imgWidth / 2, -imgHeight / 2, imgWidth, imgHeight);
        ctx.restore();
      }

      // Draw dynamic lens flare sweep across gold necklace
      ctx.save();
      const flareX = (Math.sin(rotation) * 0.5 + 0.5) * canvas.width;
      const flareGradient = ctx.createLinearGradient(flareX - 100, 0, flareX + 100, canvas.height);
      flareGradient.addColorStop(0, 'rgba(255, 235, 170, 0)');
      flareGradient.addColorStop(0.5, 'rgba(255, 215, 0, 0.25)');
      flareGradient.addColorStop(1, 'rgba(255, 235, 170, 0)');
      ctx.fillStyle = flareGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying]);

  return (
    <section className="cinematic-necklace-hero position-relative overflow-hidden w-100" style={{ minHeight: '85vh', background: 'radial-gradient(circle at 70% 50%, #15161e 0%, #08080c 60%, #040406 100%)' }}>
      {/* Background Ambient Glow */}
      <div className="position-absolute inset-0 bg-gold-transparent opacity-10 pointer-events-none" />

      {/* Main Content Layout Grid */}
      <div className="container position-relative py-5 h-100 d-flex align-items-center" style={{ minHeight: '85vh', zIndex: 3 }}>
        <div className="row w-100 align-items-center g-5">
          {/* Left Column: Premium Text & CTAs */}
          <div className="col-lg-6 text-center text-lg-start z-index-3">
            <div className="d-inline-flex align-items-center gap-2 px-3.5 py-1.5 rounded-pill border border-gold-soft bg-gold-transparent mb-3 animate-fade-up">
              <Sparkles size={16} className="text-gold fill-gold" />
              <span className="text-gold text-uppercase tracking-widest small fw-bold mb-0">Exclusive Haute Joaillerie</span>
            </div>

            <h1 className="display-2 font-serif text-white fw-bold my-3 animate-fade-up delay-1" style={{ letterSpacing: '-0.02em', lineHeight: '1.1' }}>
              Royal Heritage <br />
              <span className="text-gold font-italic">Gold & Diamonds</span>
            </h1>

            <p className="lead text-light-gold max-width-md fs-5 font-light mb-4 animate-fade-up delay-2" style={{ maxWidth: '540px', lineHeight: '1.8' }}>
              Handcrafted from 22K pure gold and solitaire diamonds. Captured in 60FPS slow-motion video with ray-traced reflections.
            </p>

            <div className="animate-fade-up delay-3 d-flex flex-wrap gap-3 align-items-center justify-content-center justify-content-lg-start">
              <Link to="/shop?category=Gold" className="btn btn-gold btn-lg px-5 py-3 text-black fw-bold shadow-2xl rounded-3 fs-6">
                Explore Gold Collection <ArrowRight size={18} className="ms-2" />
              </Link>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="btn btn-outline-gold btn-lg px-4 py-3 text-white rounded-3 d-flex align-items-center gap-2"
              >
                {isPlaying ? <Pause size={18} className="text-gold" /> : <Play size={18} className="text-gold fill-gold" />}
                <span className="small fw-semibold">{isPlaying ? 'Pause Motion Video' : 'Play Motion Video'}</span>
              </button>
            </div>
          </div>

          {/* Right Column: 60FPS Slow Motion Gold Jewelry Video Canvas Stream */}
          <div className="col-lg-6">
            <div className="necklace-video-player-card position-relative rounded-4 overflow-hidden border-gold-glowing shadow-2xl bg-black">
              {/* Badge Overlay */}
              <div className="position-absolute top-0 start-0 m-3 z-index-3 bg-white-90 backdrop-blur border border-gold px-3 py-1.5 rounded-pill d-flex align-items-center gap-2 shadow-sm">
                <Play size={14} className="fill-gold text-gold-dark" />
                <span className="small fw-bold text-black">60FPS Slow Motion Jewelry Stream (0.35x)</span>
              </div>

              {/* 60FPS Real Gold Jewelry Slow Motion Video Canvas */}
              <canvas
                ref={canvasRef}
                className="w-100 d-block rounded-4"
                style={{ maxHeight: '520px', minHeight: '380px', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CinematicNecklaceCommercial;
