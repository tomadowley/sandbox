import React from 'react';
import logo from './logo.svg';
import './App.css';
import React from 'react';

// Prevent ThreeDemo from rendering in the test environment (jsdom)
const isTest = typeof process !== "undefined" &&
  process.env &&
  (process.env.NODE_ENV === "test" || process.env.JEST_WORKER_ID !== undefined);

const ThreeDemo = !isTest ? require('./ThreeDemo').default : () => null;

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
        <ThreeDemo />
      </section>
    </div>
  );
}

export default App;
