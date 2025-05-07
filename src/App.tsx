import React from 'react';
import logo from './logo.svg';
import './App.css';
import React from 'react';
import ThreeDemoLoader from './ThreeDemoLoader';

function App() {
  return (
    <div className="App">
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
      <section style={{ marginTop: 32 }}>
        <h2>3D Rendering Demo</h2>
        <ThreeDemoLoader />
      </section>
    </div>
  );
}

export default App;
