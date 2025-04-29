import React from 'react';
import './App.css';

const MAX_DEPTH = 10;

function MirrorFrame({ level }: { level: number }) {
  if (level > MAX_DEPTH) return null;

  return (
    <div
      className="mirror-frame"
      style={{
        boxShadow: `0 0 32px 8px rgba(97,218,251, 0.25)`,
        border: `3px solid rgba(97,218,251, 0.5)`,
        background: `rgba(40,44,52,0.6)`,
        // Gradually scale and offset each deeper layer
        transform: `scale(${1 - level * 0.06}) rotateY(${-3 * level}deg)`,
        zIndex: MAX_DEPTH - level,
        animationDelay: `${level * 100}ms`
      }}
    >
      <MirrorFrame level={level + 1} />
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <div className="mirror-container">
        <MirrorFrame level={1} />
      </div>
      <p className="mirror-caption">
        Infinity Mirror Simulator
      </p>
    </div>
  );
}

export default App;
