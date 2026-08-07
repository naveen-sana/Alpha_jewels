import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, Gem, Sun, Smartphone, Monitor, ShieldCheck, ArrowRight } from 'lucide-react';

const AD_SCENES = [
  {
    id: 'walk-entry',
    timeStart: 0,
    timeEnd: 3.5,
    title: 'The Graceful Walk',
    subtitle: 'Golden-hour sunlight streaming in soft biscuit-beige interiors',
    imageSrc: '/images/alpha_ad_scene1_walk.png',
    actionText: 'Model slow-motion entrance · Diamond necklace, earrings & bracelet',
  },
  {
    id: 'smile-portrait',
    timeStart: 3.5,
    timeEnd: 7.0,
    title: 'Gentle Smile & Sparkling Diamonds',
    subtitle: 'Subtle hair movement, shallow depth of field & creamy bokeh',
    imageSrc: '/images/alpha_ad_scene2_portrait.png',
    actionText: 'High fashion close-up portrait · Soft natural golden light',
  },
  {
    id: 'macro-diamonds',
    timeStart: 7.0,
    timeEnd: 9.5,
    title: 'Luxurious Diamond Macro',
    subtitle: 'Ultra-close focus on solitaire facets, light reflections & soft shadows',
    imageSrc: '/images/alpha_ad_scene3_macro.png',
    actionText: 'Macro sparkling diamonds · 120 FPS slow motion rack focus',
  },
  {
    id: 'gold-alpha-logo',
    timeStart: 9.5,
    timeEnd: 12.0,
    title: 'ALPHA Haute Joaillerie',
    subtitle: 'Clean fade to gold ALPHA logo on light biscuit-cream background',
    imageSrc: null, // Canvas renders metallic gold ALPHA logo
    actionText: 'Gold ALPHA Logo Reveal · Timeless Indian Luxury',
  },
];

const TOTAL_AD_DURATION = 12.0;

const Alpha12sLuxuryAdCommercial = () => {
  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [aspectRatio, setAspectRatio] = useState('9:16'); // '9:16' or '16:9'
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);

  const imagesRef = useRef([]);

  // Load images
  useEffect(() => {
    AD_SCENES.forEach((scene, index) => {
      if (scene.imageSrc) {
        const img = new Image();
        img.src = scene.imageSrc;
        imagesRef.current[index] = img;
      }
    });
  }, []);

  // Web Audio Synth Ambiance for luxury ad sound
  const playLuxuryAudioTone = useCallback(() => {
    if (isMuted) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 luxury chord chime
      const note = freqs[Math.floor(Math.random() * freqs.length)];
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(note, ctx.currentTime);
      gain.gain.setValueAtTime(0.015, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (err) {
      // Audio not permitted yet
    }
  }, [isMuted]);

  // Main 120 FPS Slow Motion Canvas Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // 4K Internal canvas resolution: 1080x1920 (9:16) or 1920x1080 (16:9)
    if (aspectRatio === '9:16') {
      canvas.width = 1080;
      canvas.height = 1920;
    } else {
      canvas.width = 1920;
      canvas.height = 1080;
    }

    let animId;
    let lastTime = performance.now();

    const render = (now) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;

      if (isPlaying) {
        setCurrentTime((prev) => {
          const next = prev + delta;
          if (next >= TOTAL_AD_DURATION) {
            return 0; // Loop back
          }
          return next;
        });
      }

      // Determine current scene based on currentTime
      let sceneIdx = 0;
      for (let i = 0; i < AD_SCENES.length; i++) {
        if (currentTime >= AD_SCENES[i].timeStart && currentTime <= AD_SCENES[i].timeEnd) {
          sceneIdx = i;
          break;
        }
      }
      if (currentTime >= 9.5) sceneIdx = 3;
      setActiveSceneIndex(sceneIdx);

      const scene = AD_SCENES[sceneIdx];
      const sceneProgress = Math.min(
        1,
        Math.max(0, (currentTime - scene.timeStart) / (scene.timeEnd - scene.timeStart))
      );

      // Trigger ambient audio chime occasionally
      if (isPlaying && Math.random() < 0.015 && !isMuted) {
        playLuxuryAudioTone();
      }

      // Fill base biscuit-cream background palette (#FAF6F0)
      ctx.fillStyle = '#f8f4ec';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      if (sceneIdx < 3) {
        // Render photographic scenes (0, 1, 2)
        const img = imagesRef.current[sceneIdx];
        if (img && img.complete && img.naturalWidth > 0) {
          ctx.save();
          ctx.translate(canvas.width / 2, canvas.height / 2);

          // 120 FPS slow motion subtle movement calculations
          let scale = 1.0;
          let panX = 0;
          let panY = 0;
          let rotate = 0;

          if (sceneIdx === 0) {
            // Graceful slow motion walk: gentle push in & right tracking
            scale = 1.0 + sceneProgress * 0.06;
            panX = (sceneProgress - 0.5) * -20;
            panY = Math.sin(sceneProgress * Math.PI) * -8;
          } else if (sceneIdx === 1) {
            // Portrait smile & hair movement: subtle tilt and slow zoom
            scale = 1.04 - sceneProgress * 0.03;
            rotate = (sceneProgress - 0.5) * 0.012;
            panY = (sceneProgress - 0.5) * 12;
          } else if (sceneIdx === 2) {
            // Diamond macro: ultra slow dolly track
            scale = 1.05 + sceneProgress * 0.07;
            panX = (sceneProgress - 0.5) * 25;
            rotate = (sceneProgress - 0.5) * -0.01;
          }

          ctx.translate(panX, panY);
          ctx.rotate(rotate);
          ctx.scale(scale, scale);

          // Cover scaling
          const imgRatio = img.naturalWidth / img.naturalHeight;
          const canvasRatio = canvas.width / canvas.height;
          let drawW = canvas.width;
          let drawH = canvas.height;

          if (imgRatio > canvasRatio) {
            drawW = canvas.height * imgRatio;
          } else {
            drawH = canvas.width / imgRatio;
          }

          ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
          ctx.restore();

          // Soft natural light overlay & shallow depth of field warm lighting
          ctx.save();
          const lightGrad = ctx.createRadialGradient(
            canvas.width * 0.4,
            canvas.height * 0.3,
            50,
            canvas.width / 2,
            canvas.height / 2,
            canvas.width * 0.8
          );
          lightGrad.addColorStop(0, 'rgba(255, 245, 225, 0.16)');
          lightGrad.addColorStop(0.5, 'rgba(245, 230, 200, 0.05)');
          lightGrad.addColorStop(1, 'rgba(30, 20, 10, 0.12)');
          ctx.fillStyle = lightGrad;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.restore();

          // Sparkle particles for diamond sparkles
          ctx.save();
          const timeOffset = currentTime * 2.5;
          for (let p = 0; p < 6; p++) {
            const px = (canvas.width * (0.3 + p * 0.11) + Math.sin(timeOffset + p) * 15);
            const py = (canvas.height * (0.35 + p * 0.08) + Math.cos(timeOffset + p) * 15);
            const size = Math.abs(Math.sin(timeOffset * 2 + p)) * 4 + 1;
            const alpha = Math.abs(Math.sin(timeOffset * 1.5 + p)) * 0.6 + 0.1;

            ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(px, py, size, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();

        }
      } else {
        // Scene 4 (9.5s - 12.0s): Fade to Metallic Gold 'ALPHA' Logo on light beige background
        const fadeProgress = Math.min(1, (currentTime - 9.5) / 1.0); // 1-second clean fade
        
        ctx.save();
        ctx.fillStyle = '#f8f4ec';
        ctx.globalAlpha = fadeProgress;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Soft golden radial halo
        const haloGrad = ctx.createRadialGradient(
          canvas.width / 2,
          canvas.height / 2,
          10,
          canvas.width / 2,
          canvas.height / 2,
          canvas.width * 0.45
        );
        haloGrad.addColorStop(0, 'rgba(212, 175, 55, 0.22)');
        haloGrad.addColorStop(0.6, 'rgba(212, 175, 55, 0.05)');
        haloGrad.addColorStop(1, 'rgba(248, 244, 236, 0)');
        ctx.fillStyle = haloGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Gold ALPHA Logo Typography
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Subtitle "HAUTE JOAILLERIE"
        ctx.font = '600 24px "Inter", sans-serif';
        ctx.fillStyle = '#b8941f';
        ctx.letterSpacing = '8px';
        ctx.fillText('HAUTE JOAILLERIE', canvas.width / 2, canvas.height / 2 - 110);

        // Main 'ALPHA' Metallic Gold Brand Text
        const logoGrad = ctx.createLinearGradient(
          canvas.width / 2 - 200,
          canvas.height / 2 - 50,
          canvas.width / 2 + 200,
          canvas.height / 2 + 50
        );
        logoGrad.addColorStop(0, '#a37c27');
        logoGrad.addColorStop(0.3, '#f5e396');
        logoGrad.addColorStop(0.5, '#d4af37');
        logoGrad.addColorStop(0.8, '#f7eaab');
        logoGrad.addColorStop(1, '#96711b');

        ctx.font = '700 120px "Cormorant Garamond", serif';
        ctx.fillStyle = logoGrad;
        ctx.shadowColor = 'rgba(184, 148, 31, 0.3)';
        ctx.shadowBlur = 20;
        ctx.fillText('ALPHA', canvas.width / 2, canvas.height / 2 - 10);

        // Reset shadow
        ctx.shadowBlur = 0;

        // Elegant Slogan
        ctx.font = '400 32px "Cormorant Garamond", serif';
        ctx.fillStyle = '#4a4237';
        ctx.fillText('Elegance Reimagined', canvas.width / 2, canvas.height / 2 + 80);

        // Diamond Icon symbol under logo
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const cx = canvas.width / 2;
        const cy = canvas.height / 2 + 140;
        ctx.moveTo(cx, cy - 12);
        ctx.lineTo(cx + 12, cy);
        ctx.lineTo(cx, cy + 12);
        ctx.lineTo(cx - 12, cy);
        ctx.closePath();
        ctx.stroke();

        ctx.restore();
      }

      // Smooth dissolve between photographic scenes
      const sceneEndTime = scene.timeEnd;
      if (currentTime > sceneEndTime - 0.4 && sceneIdx < 3) {
        const dissolveAlpha = ((currentTime - (sceneEndTime - 0.4)) / 0.4) * 0.35;
        ctx.fillStyle = `rgba(248, 244, 236, ${dissolveAlpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isPlaying, currentTime, aspectRatio, isMuted, playLuxuryAudioTone]);

  const handleSeek = (timeSec) => {
    setCurrentTime(timeSec);
  };

  const activeScene = AD_SCENES[activeSceneIndex];

  return (
    <section className="alpha-12s-ad-section py-5 position-relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #fbf8f3 0%, #f4eee3 50%, #eae1d2 100%)' }}>
      <div className="container position-relative z-3">
        
        {/* Header Title Badge */}
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center gap-2 px-3.5 py-1.5 rounded-pill border border-gold-soft bg-white shadow-sm mb-3">
            <Sparkles size={16} className="text-gold-dark" />
            <span className="text-gold-dark text-uppercase tracking-widest small fw-bold mb-0">Original 12-Second 4K Commercial · 120 FPS Slow Motion</span>
          </div>

          <h2 className="display-4 font-serif text-black fw-bold my-1" style={{ letterSpacing: '-0.01em' }}>
            ALPHA <span className="text-gold-dark font-italic">Haute Joaillerie</span>
          </h2>
          <p className="text-muted max-width-md mx-auto fs-6 font-light" style={{ maxWidth: '640px' }}>
            Inspired by luxury Indian jewellery commercials. Featuring diamond necklace, earrings, and bracelet in soft golden-beige interiors with warm natural light.
          </p>
        </div>

        {/* Commercial Player Container */}
        <div className="ad-commercial-wrapper mx-auto position-relative rounded-4 overflow-hidden shadow-2xl bg-white border border-gold-soft" style={{ maxWidth: aspectRatio === '9:16' ? '460px' : '960px', transition: 'max-width 0.4s ease' }}>
          
          {/* Top Aspect & Resolution Controls */}
          <div className="position-absolute top-0 start-0 end-0 p-3 z-index-3 d-flex align-items-center justify-content-between pointer-events-auto" style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)' }}>
            <div className="d-flex align-items-center gap-2">
              <span className="badge bg-gold text-black fw-bold px-2.5 py-1.5 rounded-pill d-flex align-items-center gap-1 shadow-sm">
                <Sun size={13} className="text-black" />
                120 FPS
              </span>
              <span className="badge bg-white-90 text-dark border border-gold-soft px-2.5 py-1.5 rounded-pill backdrop-blur d-none d-sm-inline-block small">
                4K Vertical 9:16
              </span>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                onClick={() => setAspectRatio(aspectRatio === '9:16' ? '16:9' : '9:16')}
                className="btn btn-light btn-sm px-2.5 py-1 rounded-pill border border-gold-soft text-black bg-white-90 backdrop-blur d-flex align-items-center gap-1.5 shadow-sm"
                title="Toggle 9:16 Vertical / 16:9 Landscape"
              >
                {aspectRatio === '9:16' ? <Smartphone size={14} className="text-gold-dark" /> : <Monitor size={14} className="text-gold-dark" />}
                <span className="extra-small fw-bold">{aspectRatio}</span>
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="btn btn-light btn-sm rounded-circle p-1.5 border border-gold-soft text-dark bg-white-90 backdrop-blur shadow-sm"
                title={isMuted ? 'Unmute Luxury Chime Sound' : 'Mute Ambiance'}
              >
                {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} className="text-gold-dark" />}
              </button>
            </div>
          </div>

          {/* Canvas Rendering Box */}
          <div className="position-relative w-100 overflow-hidden" style={{ paddingTop: aspectRatio === '9:16' ? '177.78%' : '56.25%', background: '#f8f4ec' }}>
            <canvas
              ref={canvasRef}
              className="position-absolute top-0 start-0 w-100 h-100 d-block"
              style={{ objectFit: 'cover' }}
            />

            {/* Bottom Overlay Controls & Progress Bar */}
            <div className="position-absolute bottom-0 start-0 end-0 p-3 p-sm-4 z-index-3" style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 70%, rgba(0,0,0,0) 100%)' }}>
              
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div>
                  <div className="text-gold-light extra-small text-uppercase tracking-widest fw-bold mb-0.5 d-flex align-items-center gap-1">
                    <Gem size={12} className="text-gold" />
                    <span>Shot {activeSceneIndex + 1} of 4: {activeScene.title}</span>
                  </div>
                  <div className="text-white font-serif fs-6 fw-semibold text-truncate" style={{ maxWidth: '320px' }}>
                    {activeScene.subtitle}
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <button
                    onClick={() => handleSeek(0)}
                    className="btn btn-outline-light btn-sm p-2 rounded-circle border-white-30 text-white hover-bg-gold hover-text-black"
                    title="Replay from 0s"
                  >
                    <RotateCcw size={15} />
                  </button>

                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="btn btn-gold btn-sm px-3 py-1.5 rounded-pill text-black fw-bold d-flex align-items-center gap-1.5 shadow"
                  >
                    {isPlaying ? <Pause size={15} /> : <Play size={15} className="fill-black" />}
                    <span className="extra-small">{isPlaying ? 'Pause' : 'Play 12s Ad'}</span>
                  </button>
                </div>
              </div>

              {/* 12-Second Interactive Seek Bar */}
              <div
                className="progress bg-white-20 rounded-pill cursor-pointer mb-3 position-relative"
                style={{ height: '6px' }}
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const pct = (e.clientX - rect.left) / rect.width;
                  handleSeek(pct * TOTAL_AD_DURATION);
                }}
              >
                <div
                  className="progress-bar bg-gold transition-all"
                  style={{ width: `${(currentTime / TOTAL_AD_DURATION) * 100}%`, transitionDuration: '40ms' }}
                />
              </div>

              {/* Scene Jump Pill Chips */}
              <div className="d-flex align-items-center justify-content-between gap-1">
                {AD_SCENES.map((sc, idx) => (
                  <button
                    key={sc.id}
                    onClick={() => handleSeek(sc.timeStart)}
                    className={`btn py-1 px-1.5 rounded-2 extra-small border text-truncate w-25 transition-all ${
                      activeSceneIndex === idx
                        ? 'border-gold bg-gold text-black fw-bold shadow-sm'
                        : 'border-white-20 bg-black-40 text-white-80 hover-bg-white-20'
                    }`}
                  >
                    {idx + 1}. {sc.id === 'gold-alpha-logo' ? 'Logo Fade' : sc.title.split(' ')[0]}
                  </button>
                ))}
              </div>

            </div>

          </div>

        </div>

        {/* Feature Badges & Call To Action */}
        <div className="mt-4 text-center">
          <div className="d-flex flex-wrap align-items-center justify-content-center gap-3 text-muted small mb-4">
            <span className="d-inline-flex align-items-center gap-1.5"><ShieldCheck size={16} className="text-gold-dark" /> Original Commercial (No Copyrighted Logos)</span>
            <span className="d-inline-flex align-items-center gap-1.5"><Sun size={16} className="text-gold-dark" /> Biscuit-Cream Warm Palette</span>
            <span className="d-inline-flex align-items-center gap-1.5"><Sparkles size={16} className="text-gold-dark" /> Solitaire Diamond Suite</span>
          </div>

          <div className="d-flex flex-wrap align-items-center justify-content-center gap-3">
            <Link to="/shop?category=Diamond" className="btn btn-gold btn-lg px-5 py-3 text-black fw-bold shadow-xl rounded-3 fs-6">
              Shop Diamond Collection <ArrowRight size={18} className="ms-2" />
            </Link>
            <Link to="/shop?category=Gold" className="btn btn-outline-gold btn-lg px-5 py-3 text-black rounded-3 fs-6 border-gold-dark">
              Explore 22K Royal Gold
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Alpha12sLuxuryAdCommercial;
