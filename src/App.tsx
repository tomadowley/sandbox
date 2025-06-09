import React, { useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';

// You can replace this with any royalty-free disco music mp3 link if you want a different song!
const DISCO_MUSIC_URL =
  "https://cdn.pixabay.com/audio/2022/10/16/audio_12d6d6b2f2.mp3";

function DiscoBall() {
  // 6x6 grid of mirrored tiles
  const tiles = [];
  for (let y = 0; y < 6; y++) {
    for (let x = 0; x < 6; x++) {
      const color = (x + y) % 2 === 0 ? "#fff" : "#dddddd";
      tiles.push(
        <rect
          key={x + '-' + y}
          x={10 + x * 13}
          y={10 + y * 13}
          width={11}
          height={11}
          fill={color}
          stroke="#bfbfbf"
          strokeWidth="1"
          opacity={Math.random() * 0.4 + 0.6}
        />
      );
    }
  }
  return (
    <div className="disco-ball" style={{ position: "relative" }}>
      <svg width={100} height={100} viewBox="0 0 100 100">
        <defs>
          <radialGradient id="shine" cx="50%" cy="40%" r="70%">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#bfbfbf" stopOpacity="0.7" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="url(#shine)" stroke="#bfbfbf" strokeWidth="4" />
        {tiles}
        <ellipse cx="50" cy="32" rx="15" ry="5" fill="#fff" opacity="0.5"/>
        <line x1="50" y1="0" x2="50" y2="15" stroke="#fff" strokeWidth="3" opacity="0.6"/>
      </svg>
      {/* Disco beam */}
      <div className="disco-beam" style={{
        left: '50%',
        marginLeft: '-4px',
        top: 90
      }} />
    </div>
  );
}

function RaveSpots() {
  // Generates animated colored circles ("spotlights") at random positions
  const spots = [
    { top: '18%', left: '10%', size: 140, color: 'rgba(255,0,204,0.5)' },
    { top: '60%', left: '75%', size: 180, color: 'rgba(0,255,204,0.5)' },
    { top: '80%', left: '20%', size: 110, color: 'rgba(255,251,0,0.4)' },
    { top: '35%', left: '60%', size: 130, color: 'rgba(51,51,255,0.35)' },
    { top: '70%', left: '45%', size: 170, color: 'rgba(0,255,255,0.4)' },
    { top: '55%', left: '15%', size: 100, color: 'rgba(255,0,204,0.4)' }
  ];
  return (
    <>
      {spots.map((spot, i) => (
        <div
          key={i}
          className="rave-spot"
          style={{
            top: spot.top,
            left: spot.left,
            width: spot.size,
            height: spot.size,
            background: spot.color,
            animationDelay: `${i * 0.7}s`
          }}
        />
      ))}
    </>
  );
}

function App() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggleMusic = () => {
    setPlaying((prev) => {
      const next = !prev;
      if (audioRef.current) {
        if (next) {
          audioRef.current.play();
        } else {
          audioRef.current.pause();
        }
      }
      return next;
    });
  };

  return (
    <div className="App">
      {/* Animated Rave Spots */}
      <RaveSpots />
      <header className="App-header">
        {/* Disco Ball */}
        <DiscoBall />
        <img src={logo} className="App-logo" alt="logo" />
        <p style={{
          fontWeight: 'bold',
          fontSize: '2em',
          background: 'linear-gradient(90deg,#ff00cc,#00ffcc,#fffb00 80%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 16px #ff00cc, 0 0 8px #00ffcc'
        }}>
          Disco Rave Mode!
        </p>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://react.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          Party with React
        </a>
        <button className="music-btn" onClick={toggleMusic}>
          {playing ? "🕺 Stop Music" : "🎶 Start Disco Music"}
        </button>
        <audio
          ref={audioRef}
          src={DISCO_MUSIC_URL}
          loop
          preload="auto"
          style={{ display: 'none' }}
        />
      </header>
    </div>
  );
}

export default App;
