import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="WerApp">
      <header className="Wer-header">
        <img src={logo} className="Wer-logo" alt="wer logo" />
        <h1 className="Wer-title">wer</h1>
        <p className="Wer-description">
          Welcome to <b>wer</b> — a mobile-first hand-crafted experience.
        </p>
        <p className="Wer-message">
          This app is designed for mobile users. Resize your window or open on a phone to see the optimized layout!
        </p>
      </header>
    </div>
  );
}

export default App;
