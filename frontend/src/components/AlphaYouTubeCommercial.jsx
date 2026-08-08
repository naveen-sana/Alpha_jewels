import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Gem } from 'lucide-react';

const AlphaYouTubeCommercial = () => {
  const playerRef = useRef(null);
  const checkIntervalRef = useRef(null);

  const videoId = 'pT0xD8UYbm0'; // User's exact Kalyan Jewellers YouTube commercial video
  const START_TIME_SEC = 35;     // Starts at lotus flower water dipping gold bangle scene (35s)
  const END_TIME_SEC = 49;       // Ends before 49s end card

  const directEmbedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&start=${START_TIME_SEC}&end=${END_TIME_SEC}&modestbranding=1&rel=0&disablekb=1&iv_load_policy=3&fs=0&playsinline=1&enablejsapi=1&showinfo=0`;

  useEffect(() => {
    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;

      try {
        playerRef.current = new window.YT.Player('alpha-yt-iframe-player', {
          events: {
            onReady: (event) => {
              try {
                if (typeof event.target.setPlaybackQuality === 'function') {
                  event.target.setPlaybackQuality('highres');
                  event.target.setPlaybackQuality('hd2160');
                  event.target.setPlaybackQuality('hd1440');
                  event.target.setPlaybackQuality('hd1080');
                }
              } catch (e) {
                // Ignore
              }
              event.target.mute();
              event.target.playVideo();
            },
            onStateChange: (event) => {
              if (event.data === 2 || event.data === 3 || event.data === -1) {
                event.target.mute();
                event.target.playVideo();
              }
              if (event.data === 0) {
                event.target.seekTo(START_TIME_SEC, true);
                event.target.playVideo();
              }
            },
          },
        });
      } catch (e) {
        // Fallback to iframe src
      }

      checkIntervalRef.current = setInterval(() => {
        if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
          const currentTime = playerRef.current.getCurrentTime();
          const state = playerRef.current.getPlayerState ? playerRef.current.getPlayerState() : null;

          if (state === 2 || state === -1) {
            playerRef.current.mute();
            playerRef.current.playVideo();
          }

          if (currentTime >= 48.8 || currentTime < 34.5) {
            playerRef.current.seekTo(START_TIME_SEC, true);
            playerRef.current.playVideo();
          }
        }
      }, 100);
    };

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    } else {
      initPlayer();
    }

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current);
      }
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
    };
  }, []);

  return (
    <section 
      className="alpha-fullscreen-video-hero position-relative overflow-hidden bg-black" 
      style={{ 
        height: '100vh', 
        width: '100vw',
        minWidth: '100vw',
        left: 0,
        top: 0,
        margin: 0,
        padding: 0,
      }}
    >
      {/* Global CSS overrides to eliminate any left white gaps & disable youtube controls */}
      <style>{`
        html, body, #root, .app-shell, main {
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
          overflow-x: hidden !important;
        }
        .alpha-fullscreen-video-hero {
          background-color: #000000 !important;
        }
        #alpha-yt-iframe-player,
        .alpha-fullscreen-video-hero iframe {
          pointer-events: none !important;
          user-select: none !important;
          -webkit-user-select: none !important;
          touch-action: none !important;
          border: none !important;
          outline: none !important;
        }
        .ytp-pause-overlay,
        .ytp-chrome-top,
        .ytp-chrome-bottom,
        .ytp-subtitles-button,
        .ytp-overlay-inline,
        .ytp-pause-overlay-container,
        .ytp-large-play-button,
        .ytp-button,
        .ytp-bezel,
        .ytp-bezel-icon {
          display: none !important;
          opacity: 0 !important;
          visibility: hidden !important;
          pointer-events: none !important;
        }
      `}</style>

      {/* 100% Pure Full-Screen Video Container */}
      <div
        className="w-100 h-100 position-relative overflow-hidden bg-black"
        style={{ border: 'none', margin: 0, padding: 0 }}
      >
        <iframe
          id="alpha-yt-iframe-player"
          src={directEmbedUrl}
          title="Alpha Jewels Commercial"
          className="position-absolute top-0 start-0 w-100 h-100"
          allow="autoplay; encrypted-media; picture-in-picture"
          tabIndex="-1"
          aria-hidden="true"
          style={{
            transform: 'scale(1.4)',
            transformOrigin: 'center center',
            pointerEvents: 'none',
            border: 'none',
          }}
        />
      </div>

      {/* Viewport Click Shield Overlay Intercepting Mouse & Keyboard Events (Z-Index 999) */}
      <div
        className="position-absolute top-0 start-0 w-100 h-100"
        style={{
          zIndex: 999,
          background: 'transparent',
          pointerEvents: 'auto',
          cursor: 'default',
        }}
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onMouseUp={(e) => { e.preventDefault(); e.stopPropagation(); }}
        onTouchStart={(e) => { e.preventDefault(); e.stopPropagation(); }}
      />

      {/* Luxury Dark Overlay Top Header Bar (Z-Index 1000) */}
      <header
        className="position-absolute top-0 start-0 end-0 px-4 px-md-5 py-3 d-flex align-items-center justify-content-between"
        style={{
          zIndex: 1000,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0) 100%)',
        }}
      >
        {/* Top-Left Logo & Brand Title */}
        <Link to="/" className="d-flex align-items-center gap-2.5 text-decoration-none">
          <Gem size={28} className="text-gold" />
          <span className="font-serif fw-bold fs-3 text-white tracking-wide">
            Alpha <span className="text-gold">Jewels</span>
          </span>
        </Link>

        {/* Top-Right Header Actions: ONLY Login & Register */}
        <div className="d-flex align-items-center gap-3">
          <Link
            to="/login"
            className="btn btn-outline-gold px-4 py-2 rounded-3 text-white fw-bold hover-bg-gold hover-text-black transition-all"
            style={{ fontSize: '0.95rem', border: '1.5px solid #d4af37' }}
          >
            Login
          </Link>
          <Link
            to="/register"
            className="btn btn-gold px-4 py-2 rounded-3 text-black fw-bold shadow transition-all"
            style={{ fontSize: '0.95rem' }}
          >
            Register
          </Link>
        </div>
      </header>
    </section>
  );
};

export default AlphaYouTubeCommercial;
