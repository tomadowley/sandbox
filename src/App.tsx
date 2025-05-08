import React, { useState } from 'react';
import './App.css';

function randomBetween(a: number, b: number) {
  return Math.random() * (b - a) + a;
}

function Sparkles() {
  // Generate 30 sparkles with random positions and animation delays
  return (
    <>
      {Array.from({ length: 30 }).map((_, i) => {
        const left = randomBetween(0, 100);
        const top = randomBetween(0, 100);
        const delay = randomBetween(0, 8);
        const size = randomBetween(6, 18);
        return (
          <div
            key={i}
            className="sparkle"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              animationDelay: `${delay}s`,
              width: size,
              height: size,
            }}
          />
        );
      })}
    </>
  );
}

function FloatingIsland() {
  // Magical floating island SVG
  return (
    <svg className="floating-island" viewBox="0 0 300 180" fill="none">
      <ellipse cx="150" cy="160" rx="90" ry="18" fill="#0008" />
      <g className="island-bob">
        <path
          d="M60 150 Q80 120 120 130 Q160 110 220 140 Q240 150 150 170 Q60 150 60 150Z"
          fill="url(#island-grad)"
        />
        <ellipse cx="160" cy="120" rx="26" ry="10" fill="#eee8" />
        <ellipse cx="100" cy="133" rx="16" ry="6" fill="#eee4" />
        <g>
          <ellipse cx="170" cy="105" rx="16" ry="24" fill="#cfc" />
          <ellipse cx="195" cy="120" rx="10" ry="18" fill="#b8e2ff" />
          <ellipse cx="125" cy="117" rx="10" ry="15" fill="#fdd6fa" />
        </g>
        <text
          x="150"
          y="150"
          textAnchor="middle"
          fontSize="32"
          fill="#fff"
          filter="url(#glow)"
          style={{ fontFamily: 'cursive', letterSpacing: 2 }}
        >
          ✧
        </text>
        <defs>
          <linearGradient id="island-grad" x1="60" y1="130" x2="220" y2="170" gradientUnits="userSpaceOnUse">
            <stop stopColor="#c9f9e1" />
            <stop offset="1" stopColor="#9adcf6" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </g>
    </svg>
  );
}

function MagicPortal({ onOpen }: { onOpen: () => void }) {
  // Magical portal SVG, clickable for effect
  const [active, setActive] = useState(false);
  return (
    <div
      className={`magic-portal-container${active ? ' portal-active' : ''}`}
      tabIndex={0}
      onClick={() => {
        setActive(true);
        setTimeout(() => {
          setActive(false);
          onOpen();
        }, 1200);
      }}
      onKeyPress={e => {
        if (e.key === "Enter" || e.key === " ") {
          setActive(true);
          setTimeout(() => {
            setActive(false);
            onOpen();
          }, 1200);
        }
      }}
      aria-label="Open the magical portal"
    >
      <svg className="magic-portal" viewBox="0 0 120 120">
        <defs>
          <radialGradient id="portal-glow" cx="50%" cy="50%" r="50%">
            <stop offset="10%" stopColor="#fff7b1" stopOpacity="1" />
            <stop offset="60%" stopColor="#c7b1ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#6c34f6" stopOpacity="0.6" />
          </radialGradient>
        </defs>
        <ellipse
          cx="60"
          cy="60"
          rx="48"
          ry="48"
          fill="url(#portal-glow)"
          filter="url(#portal-blur)"
        />
        <circle
          cx="60"
          cy="60"
          r="36"
          fill="none"
          stroke="#fff7b1"
          strokeWidth="3"
          strokeDasharray="8 8"
          className="portal-spin"
        />
        <ellipse
          cx="60"
          cy="60"
          rx="28"
          ry="16"
          fill="#fff8"
        />
        <text
          x="60"
          y="68"
          textAnchor="middle"
          fontSize="32"
          fill="#fff"
          style={{ fontFamily: 'cursive', letterSpacing: 2 }}
        >🌀</text>
      </svg>
      <div className="portal-label">Enter Portal</div>
    </div>
  );
}

function MagicMessage({ revealed }: { revealed: boolean }) {
  // Poetic, magical message for the user
  return (
    <div className={`magic-message${revealed ? " revealed" : ""}`}>
      <h1>🌙 Welcome to the Realm of Reactical Wonders! 🌈</h1>
      <p>
        Here, floating islands drift on cosmic breezes,
        <br />
        Portals shimmer with possibility,
        <br />
        And sparkles dance on the edge of imagination.
      </p>
      <p>
        <em>
          Click the Portal to cast a spell of creativity.<br />
          Let your code become magic!
        </em>
      </p>
    </div>
  );
}

function App() {
  const [portalOpened, setPortalOpened] = useState(false);

  return (
    <div className="App magical-bg">
      <Sparkles />
      <header className="App-header magical">
        <FloatingIsland />
        <MagicPortal onOpen={() => setPortalOpened(true)} />
        <MagicMessage revealed={portalOpened} />
      </header>
    </div>
  );
}

export default App;
