import React, { useRef, useEffect } from 'react';

const HeroJewelryVideoBg = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.35; // 0.35x Slow Motion
      videoRef.current.play().catch(() => {});
    }
  }, []);

  return (
    <div className="position-absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="w-100 h-100 object-fit-cover"
        onLoadedData={() => {
          if (videoRef.current) videoRef.current.playbackRate = 0.35;
        }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          minWidth: '100%',
          minHeight: '100%',
          transform: 'translate(-50%, -50%)',
          objectFit: 'cover',
          opacity: 0.35,
          filter: 'brightness(1.05) contrast(1.1)'
        }}
      >
        <source src="/videos/jewelry_hero.mp4" type="video/mp4" />
        <source src="/videos/jewelry_slowmo.mp4" type="video/mp4" />
      </video>

      {/* Light Overlay Gradient for Royal Champagne Theme */}
      <div 
        className="position-absolute inset-0" 
        style={{
          background: 'radial-gradient(circle at 30% 40%, rgba(255, 255, 255, 0.4) 0%, rgba(245, 240, 232, 0.88) 100%)',
          pointerEvents: 'none'
        }} 
      />
    </div>
  );
};

export default HeroJewelryVideoBg;
