// Import React library
import React from 'react';
// Import the logo SVG
import logo from './logo.svg';
// Import the App CSS styles
import './App.css';

/**
 * App Component
 * 
 * The main component that represents the application.
 * Displays a simple React landing page with logo and links.
 */
function App() {
  return (
    <div className="App">
      {/* Header section containing logo and text */}
      <header className="App-header">
        {/* React logo animation */}
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