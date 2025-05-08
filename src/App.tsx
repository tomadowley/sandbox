import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="Cosine logo" />
        <p style={{ fontSize: "1.5rem", maxWidth: 480, margin: "1.5rem auto" }}>
          Welcome to <b>Cosine</b> – Building the future of AI, together.<br />
          Our mission is to accelerate innovation and empower developers worldwide with cutting-edge tools and open collaboration.
        </p>
        <a
          className="App-link"
          href="https://cosine.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn more about Cosine
        </a>
      </header>
    </div>
  );
}

export default App;
