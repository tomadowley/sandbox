import React from 'react';
import logo from './logo.svg';
import './App.css';

const discoShapes = [
  { type: 'circle', color: '#ff00cc' },
  { type: 'triangle', color: '#ffe600' },
  { type: 'diamond', color: '#39ff14' },
  { type: 'squiggle', color: '#00fff7' },
  { type: 'circle', color: '#ff0080' },
  { type: 'triangle', color: '#3333ff' },
  { type: 'diamond', color: '#ff00cc' },
  { type: 'circle', color: '#ffe600' },
  { type: 'squiggle', color: '#39ff14' },
  { type: 'diamond', color: '#00fff7' },
];

function DiscoConfetti() {
  // Randomize positions and animation durations for each shape
  return (
    <div className="disco-confetti">
      {discoShapes.map((shape, i) => {
        const left = Math.random() * 90 + 5; // 5% to 95%
        const duration = 5 + Math.random() * 6; // 5s - 11s
        const delay = Math.random() * 4; // 0s - 4s
        const style: React.CSSProperties = {
          left: `${left}%`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          color: shape.color,
          zIndex: 10,
        };

        switch (shape.type) {
          case 'circle':
            return <span key={i} className="confetti-shape confetti-circle" style={style} />;
          case 'triangle':
            return <span key={i} className="confetti-shape confetti-triangle" style={style} />;
          case 'diamond':
            return <span key={i} className="confetti-shape confetti-diamond" style={style} />;
          case 'squiggle':
            return (
              <svg
                key={i}
                className="confetti-shape confetti-squiggle"
                style={style}
                width="30"
                height="18"
                viewBox="0 0 30 18"
                fill="none"
              >
                <path
                  d="M2 16 Q8 2, 15 10 Q22 18, 28 2"
                  stroke={shape.color}
                  strokeWidth="4"
                  fill="none"
                  filter="url(#glow)"
                />
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
              </svg>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <DiscoConfetti />
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
