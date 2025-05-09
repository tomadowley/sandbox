import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

const colorFilters = [
  'invert(20%) sepia(91%) saturate(7490%) hue-rotate(192deg) brightness(99%) contrast(101%)', // blue
  'invert(21%) sepia(97%) saturate(7457%) hue-rotate(357deg) brightness(97%) contrast(104%)', // red
  'invert(66%) sepia(64%) saturate(315%) hue-rotate(74deg) brightness(87%) contrast(87%)',    // green
  'invert(13%) sepia(100%) saturate(7471%) hue-rotate(277deg) brightness(87%) contrast(110%)', // purple
];

function App() {
  const [colorIdx, setColorIdx] = useState(0);

  const handleLogoClick = () => {
    setColorIdx((prevIdx) => (prevIdx + 1) % colorFilters.length);
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
