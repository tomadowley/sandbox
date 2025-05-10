import React from 'react';  // Import React library
import logo from './logo.svg';  // Import the React logo SVG
import './App.css';  // Import the App component's CSS

/**
 * App component - the main component of the application
 * Renders the React logo and introductory content
 */
function App() {
  return (
    // Main container with App class
    <div className="App">
      {/* Header section containing the logo and links */}
      <header className="App-header">
        {/* React logo image */}
        <img src={logo} className="App-logo" alt="logo" />
        {/* Introductory text with code highlighting */}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        {/* External link to React documentation */}
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