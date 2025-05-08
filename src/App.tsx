import React, { useState } from 'react';
import './App.css';

const COLORS = [
  '#61dafb', // original React blue
  '#e34c26', // orange
  '#28a745', // green
  '#ffcc00', // yellow
  '#6f42c1', // purple
  '#ff4081', // pink
  '#222',    // black
  '#f44336', // red
];

function App() {
  const [colorIdx, setColorIdx] = useState(0);
  const [search, setSearch] = useState('');

  const handleLogoClick = () => {
    setColorIdx((prev) => (prev + 1) % COLORS.length);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (search.trim()) {
      // Open React docs search in a new tab
      window.open(`https://react.dev/search?q=${encodeURIComponent(search)}`, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        {/* Inline SVG for React logo */}
        <span
          style={{ display: 'inline-block', cursor: 'pointer' }}
          onClick={handleLogoClick}
          title="Click to change color!"
        >
          <svg
            className="App-logo"
            height="120"
            viewBox="0 0 841.9 595.3"
            width="120"
            style={{ fill: 'none', stroke: COLORS[colorIdx], transition: 'stroke 0.3s' }}
            xmlns="http://www.w3.org/2000/svg"
          >
            <g>
              <circle cx="420.9" cy="296.5" r="45.7" fill={COLORS[colorIdx]} />
              <g strokeWidth="20">
                <ellipse
                  rx="218.3"
                  ry="69.7"
                  cx="420.9"
                  cy="296.5"
                  transform="rotate(0 420.9 296.5)"
                />
                <ellipse
                  rx="218.3"
                  ry="69.7"
                  cx="420.9"
                  cy="296.5"
                  transform="rotate(60 420.9 296.5)"
                />
                <ellipse
                  rx="218.3"
                  ry="69.7"
                  cx="420.9"
                  cy="296.5"
                  transform="rotate(120 420.9 296.5)"
                />
              </g>
            </g>
          </svg>
        </span>
        <form
          onSubmit={handleSearchSubmit}
          style={{ marginTop: 24, marginBottom: 16, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }}
        >
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search React docs..."
            style={{
              padding: '0.5em 1em',
              borderRadius: 4,
              border: '1px solid #ccc',
              fontSize: 16,
              minWidth: 200,
            }}
            aria-label="Search React documentation"
          />
          <button
            type="submit"
            style={{
              padding: '0.5em 1em',
              borderRadius: 4,
              border: 'none',
              background: '#61dafb',
              color: '#222',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 16,
            }}
          >
            Search
          </button>
        </form>
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
