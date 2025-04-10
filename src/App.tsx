// Import React library for component creation
import React from 'react';
// Import the logo SVG file
import logo from './logo.svg';
// Import CSS styles for the App component
import './App.css';

/**
 * App component
 * This is the main component that gets rendered in the root element
 * Contains the default React starter page
 */
function App() {
  return (
    // Main container with App class
    <div className="App">
      {/* Header section containing logo and links */}
      <header className="App-header">
        {/* React logo with animation */}
        <img src={logo} className="App-logo" alt="logo" />
        {/* Instructions for the developer */}
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

// Export the App component to be used in other files
export default App;