import React from 'react';
import logo from './logo.svg';
import './App.css';

/**
 * Main App component
 * 
 * This is the root component of the application that renders
 * the primary UI including the header, logo, and links.
 * 
 * @returns {JSX.Element} The rendered App component
 */
function App() {
  return (
    <div className="App">
      {/* Main header section with logo and content */}
      <header className="App-header">
        {/* React logo with spinning animation */}
        <img src={logo} className="App-logo" alt="logo" />
        {/* Instructions for development */}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        {/* Link to React documentation */}
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

// Export the App component as the default export
export default App;
