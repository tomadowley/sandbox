import React, { useEffect, useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';

const KONAMI_CODE = [
  "ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown",
  "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"
];

function App() {
  const [showConfetti, setShowConfetti] = useState(false);
  const keyBuffer = useRef<string[]>([]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      keyBuffer.current.push(e.key);
      if (keyBuffer.current.length > KONAMI_CODE.length) {
        keyBuffer.current.shift();
      }
      if (KONAMI_CODE.every((code, idx) => keyBuffer.current[keyBuffer.current.length - KONAMI_CODE.length + idx] === code)) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="App">
      {showConfetti && (
        <div className="confetti-container" aria-hidden>
          {[...Array(40)].map((_, i) => (
            <div key={i} className="confetti" />
          ))}
          <span className="confetti-message">✨ KEWL! ✨</span>
        </div>
      )}
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
