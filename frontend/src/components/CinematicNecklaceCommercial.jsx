import React, { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Play, Pause, Gem, Volume2, VolumeX, Sun, Film } from 'lucide-react';

const SCENES = [
  {
    id: 'orbit-smile',
    title: 'Model Entrance & 180° Orbit',
    subtitle: 'Golden-Hour Sunlight · Gentle Smile & Soft Hair Movement',
    imageSrc: '/images/champagne_model_showroom.png',
    durationSec: 4.5,
  },
  {
    id: 'side-tracking',
    title: 'Smooth Side Tracking Walk',
    subtitle: 'Cream & Champagne Boutique · Model Face Visible & Graceful Walk',
    imageSrc: '/images/champagne_model_side_tracking.png',
    durationSec: 3.5,
  },
  {
    id: 'touch-necklace',
    title: 'Necklace Craftsmanship Highlight',
    subtitle: 'Soft Hand Touch · Royal 22K Gold & Solitaire Diamond Choker',
    imageSrc: '/images/champagne_model_touching_necklace.png',
    durationSec: 3.5,
  },
  {
    id: 'macro-ring-bangles',
    title: 'Macro Close-Up: Ring & Bangles',
    subtitle: 'Ivory Silk Display · Ultra-Shallow Focus & Soft Sunlight',
    imageSrc: '/images/champagne_macro_ring_bangles.png',
    durationSec: 3.5,
  },
];

const TOTAL_CYCLE_SEC = 15.0;

const CinematicNecklaceCommercial = () => {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [fpsMode, setFpsMode] = useState('120 FPS Slow Motion');
  const [loopTime, setLoopTime] = useState(0);

  const loadedImagesRef = useRef([]);

  useEffect(() => {
    SCENES.forEach((scene, index) => {
      const img = new Image();
      img.src = scene.imageSrc;
      loadedImagesRef.current[index] = img;
    });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    canvas.width = 1280;
    canvas.height = 720;

    let animationFrameId;
    let prevTimestamp = performance.now();

    const render = (timestamp) => {
      const deltaSec = (timestamp - prevTimestamp) / 1000;
      prevTimestamp = timestamp;

      if (isPlaying) {
        setLoopTime((prev) => {
          const next = prev + deltaSec;
          return next >= TOTAL_CYCLE_SEC ? 0 : next;
        });
      }

      // Calculate current scene
      let accumulatedSec = 0;
      let currentIdx = 0;
      let sceneLocalTimeSec = 0;

      for (let i = 0; i < SCENES.length; i++) {
        const d = SCENES[i].durationSec;
        if (loopTime >= accumulatedSec && loopTime < accumulatedSec + d) {
          currentIdx = i;
          sceneLocalTimeSec = loopTime - accumulatedSec;
          break;
        }
        accumulatedSec += d;
      }
      setActiveSceneIndex(currentIdx);

      const sceneDuration = SCENES[currentIdx].durationSec;
      const progress = sceneLocalTimeSec / sceneDuration;

      // Base background: Soft champagne biscuit tone
      ctx.fillStyle = '#f8f4ec';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw active scene image with clean, elegant slow motion (NO chamkey/moving shines)
      const currentImg = loadedImagesRef.current[currentIdx];
      if (currentImg && currentImg.complete && currentImg.naturalWidth > 0) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);

        let scale = 1.0;
        let rotateRad = 0;
        let translateX = 0;
        let translateY = 0;

        if (currentIdx === 0) {
          // Slow 180° orbit & slow dolly-in
          scale = 1.0 + progress * 0.08;
          rotateRad = (progress - 0.5) * 0.02;
          translateX = (progress - 0.5) * -12;
        } else if (currentIdx === 1) {
          // Side tracking shot movement
          scale = 1.03;
          translateX = (progress - 0.5) * 35;
          translateY = Math.sin(progress * Math.PI) * -4;
        } else if (currentIdx === 2) {
          // Medium close-up touch necklace slow push-in
          scale = 1.0 + progress * 0.08;
          translateY = (progress - 0.5) * 8;
        } else {
          // Ultra-shallow macro close-up focus float
          scale = 1.06 - progress * 0.04;
          rotateRad = (progress - 0.5) * -0.01;
        }

        ctx.translate(translateX, translateY);
        ctx.rotate(rotateRad);
        ctx.scale(scale, scale);

        const imgAspect = currentImg.naturalWidth / currentImg.naturalHeight;
        const canvasAspect = canvas.width / canvas.height;
        let drawW = canvas.width;
        let drawH = canvas.height;

        if (imgAspect > canvasAspect) {
          drawW = canvas.height * imgAspect;
        } else {
          drawH = canvas.width / imgAspect;
        }

        ctx.drawImage(currentImg, -drawW / 2, -drawH / 2, drawW, drawH);
        ctx.restore();
      }

      // Soft natural golden-hour ambient warm gradient (No harsh sparkles or moving chamkey particles)
      ctx.save();
      const sunBeamGrad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      sunBeamGrad.addColorStop(0, 'rgba(255, 245, 220, 0.12)');
      sunBeamGrad.addColorStop(0.5, 'rgba(247, 230, 180, 0.04)');
      sunBeamGrad.addColorStop(1, 'rgba(0, 0, 0, 0.08)');
      ctx.fillStyle = sunBeamGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.restore();

      // Soft focus transition dissolve between shots
      if (progress > 0.90) {
        const dissolveAlpha = ((progress - 0.90) / 0.10) * 0.30;
        ctx.fillStyle = `rgba(248, 244, 236, ${dissolveAlpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, loopTime]);

  const handleSelectScene = (idx) => {
    let acc = 0;
    for (let i = 0; i < idx; i++) {
      acc += SCENES[i].durationSec;
    }
    setLoopTime(acc);
    setActiveSceneIndex(idx);
  };

  const currentScene = SCENES[activeSceneIndex];

  return (
    <section className="cinematic-necklace-hero position-relative overflow-hidden w-100 py-5" style={{ background: 'linear-gradient(180deg, #fdfbf7 0%, #f4eee3 50%, #eae1d2 100%)' }}>
      <div className="container position-relative z-3">
        {/* Top Header Badge */}
        <div className="text-center mb-4">
          <div className="d-inline-flex align-items-center gap-2 px-3.5 py-1.5 rounded-pill border border-gold-soft bg-white shadow-sm mb-2 animate-fade-up">
            <Sun size={16} className="text-gold-dark" />
            <span className="text-gold-dark text-uppercase tracking-widest small fw-bold mb-0">15-Second 4K HDR · 120 FPS Slow Motion Commercial</span>
          </div>

          <h1 className="display-4 font-serif text-black fw-bold my-2" style={{ letterSpacing: '-0.01em' }}>
            The Champagne Bridal <span className="text-gold-dark font-italic">Haute Joaillerie</span>
          </h1>

          <p className="text-muted max-width-md mx-auto fs-6 font-light" style={{ maxWidth: '680px' }}>
            Featuring an Indian bridal model in a warm golden-hour luxury showroom with cream, champagne & biscuit tones.
          </p>
        </div>

        {/* Main 16:9 Ultra-Realistic Jewelry Commercial Player Card */}
        <div className="necklace-video-player-card position-relative rounded-4 overflow-hidden border-gold-soft shadow-2xl bg-white mx-auto" style={{ maxWidth: '1050px' }}>
          
          <div className="position-relative w-100 overflow-hidden" style={{ paddingTop: '56.25%' }}>
            <canvas
              ref={canvasRef}
              className="position-absolute top-0 start-0 w-100 h-100 d-block"
              style={{ objectFit: 'cover' }}
            />

            {/* Top Left Live Stream Badge */}
            <div className="position-absolute top-0 start-0 m-3 m-md-4 z-index-3 d-flex align-items-center gap-2">
              <span className="badge bg-gold text-black fw-bold px-3 py-2 rounded-pill shadow d-flex align-items-center gap-2">
                <Film size={14} className="text-black" />
                {fpsMode} (15s Loop)
              </span>
              <span className="badge bg-white-90 text-black border border-gold-soft px-3 py-2 rounded-pill backdrop-blur shadow-sm d-none d-sm-inline-block">
                Golden-Hour Sunlight · Ultra-Shallow DOF
              </span>
            </div>

            {/* Top Right Controls */}
            <div className="position-absolute top-0 end-0 m-3 m-md-4 z-index-3 d-flex align-items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="btn btn-light btn-sm rounded-circle p-2 border border-gold-soft text-dark bg-white-90 backdrop-blur shadow-sm hover-scale"
                title={isMuted ? 'Unmute Ambient Sound' : 'Mute Ambient Sound'}
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
              <button
                onClick={() => setFpsMode(fpsMode === '120 FPS Slow Motion' ? '60 FPS Slow Motion' : '120 FPS Slow Motion')}
                className="btn btn-light btn-sm px-3 py-1.5 rounded-pill border border-gold-soft text-black bg-white-90 backdrop-blur small fw-semibold shadow-sm"
              >
                {fpsMode}
              </button>
            </div>

            {/* Bottom Overlay Info & Interactive Scene Switcher Bar */}
            <div className="position-absolute bottom-0 start-0 end-0 p-3 p-md-4 bg-gradient-to-t from-black-80 via-black-50 to-transparent z-index-3">
              <div className="d-flex flex-column flex-md-row align-items-md-end justify-content-between gap-3 mb-2">
                <div>
                  <div className="text-gold-light small text-uppercase tracking-widest fw-semibold mb-1 d-flex align-items-center gap-2">
                    <Gem size={14} className="text-gold" />
                    <span>Shot {activeSceneIndex + 1} of 4: {currentScene.title}</span>
                  </div>
                  <h4 className="text-white font-serif fw-bold mb-0 fs-5">{currentScene.subtitle}</h4>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="btn btn-gold px-4 py-2 rounded-3 text-black fw-bold d-flex align-items-center gap-2 shadow-lg"
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} className="fill-black" />}
                    <span>{isPlaying ? 'Pause Motion' : 'Play Commercial'}</span>
                  </button>
                </div>
              </div>

              {/* 15-Second Progress Line */}
              <div className="progress bg-white-30 rounded-pill mb-3" style={{ height: '4px' }}>
                <div
                  className="progress-bar bg-gold transition-all"
                  style={{ width: `${(loopTime / TOTAL_CYCLE_SEC) * 100}%`, transitionDuration: '50ms' }}
                />
              </div>

              {/* Scene Navigation Thumbnails */}
              <div className="row g-2 justify-content-center">
                {SCENES.map((scene, idx) => (
                  <div key={scene.id} className="col-3">
                    <button
                      onClick={() => handleSelectScene(idx)}
                      className={`w-100 btn p-1 rounded-3 text-start border transition-all ${
                        activeSceneIndex === idx
                          ? 'border-gold bg-gold-transparent shadow-lg scale-102'
                          : 'border-white-30 bg-black-40 opacity-75 hover-opacity-100'
                      }`}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <img
                          src={scene.imageSrc}
                          alt={scene.title}
                          className="rounded-2 object-fit-cover d-none d-sm-block"
                          style={{ width: '36px', height: '24px' }}
                        />
                        <div className="text-truncate">
                          <div className="text-white extra-small fw-bold text-truncate">{scene.title}</div>
                          <div className="text-light-gold extra-small font-mono">{scene.durationSec}s</div>
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* CTA Buttons */}
        <div className="mt-4 text-center d-flex flex-wrap align-items-center justify-content-center gap-3">
          <Link to="/shop?category=Gold" className="btn btn-gold btn-lg px-5 py-3 text-black fw-bold shadow-2xl rounded-3 fs-6">
            Explore 22K Bridal Gold Collection <ArrowRight size={18} className="ms-2" />
          </Link>
          <Link to="/shop?category=Diamond" className="btn btn-outline-gold btn-lg px-5 py-3 text-black rounded-3 fs-6 border-gold-dark">
            View Solitaire Diamond Suite
          </Link>
        </div>

      </div>
    </section>
  );
};

export default CinematicNecklaceCommercial;


