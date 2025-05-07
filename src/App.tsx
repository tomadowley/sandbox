import React from 'react';
import logo from './logo.svg';
import './App.css';
import React, { Suspense } from 'react';

// Only load ThreeDemo in the browser
const isBrowser = typeof window !== "undefined" && typeof document !== "undefined";
const ThreeDemo = React.lazy(() =>
  isBrowser
    ? import('./ThreeDemo')
    : Promise.resolve({ default: () => null })
);

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
        <Suspense fallback={null}>
          <ThreeDemo />
        </Suspense>
      </section>
    </div>
  );
}

export default App;
