import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

const RAINBOW_COLORS = [
  "#FF0000", // Red
  "#FF7F00", // Orange
  "#FFFF00", // Yellow
  "#00FF00", // Green
  "#0000FF", // Blue
  "#4B0082", // Indigo
  "#9400D3", // Violet
];

function App() {
  const [colorIdx, setColorIdx] = useState(0);

  const handleLogoClick = () => {
    setColorIdx((prev) => (prev + 1) % RAINBOW_COLORS.length);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img
          src={logo}
          className="App-logo"
          alt="logo"
          style={{
            filter: `drop-shadow(0 0 0 ${RAINBOW_COLORS[colorIdx]}) drop-shadow(0 0 60px ${RAINBOW_COLORS[colorIdx]})`,
            WebkitFilter: `drop-shadow(0 0 0 ${RAINBOW_COLORS[colorIdx]}) drop-shadow(0 0 60px ${RAINBOW_COLORS[colorIdx]})`
          }}
          onClick={handleLogoClick}
        />
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
