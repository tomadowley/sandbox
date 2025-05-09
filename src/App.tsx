import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  // State to manage logo color
  const [colorIdx, setColorIdx] = useState(0);

  // You can add more color filter strings here for more choices
  const colorFilters = [
    'none', // default (original blue)
    'hue-rotate(90deg)', // greenish
    'hue-rotate(200deg)', // pink/purple
    'invert(1) hue-rotate(180deg)', // yellow/orange
    'grayscale(100%)', // gray
  ];

  // Cycle through color filters
  const handleLogoClick = () => {
    setColorIdx((prev) => (prev + 1) % colorFilters.length);
  };

  return (
    <div className="App">
      <header className="App-header">
        <img
          src={logo}
          className="App-logo"
          alt="logo"
          style={{ filter: colorFilters[colorIdx], cursor: 'pointer' }}
          onClick={handleLogoClick}
          title="Click me to change my color!"
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
