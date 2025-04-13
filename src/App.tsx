import React from 'react';
// Import the logo SVG as a module
import logo from './logo.svg';
// Import the CSS styles for this component
import './App.css';

/**
 * Main App component that serves as the root of the application
 * Displays the React logo and a welcome message with a link to React documentation
 */
function App() {
  return (
    // Main container div with the 'App' class
    <div className="App">
      {/* Header section containing the logo and welcome content */}
      <header className="App-header">
        {/* React logo image */}
        <img src={logo} className="App-logo" alt="logo" />
        {/* Instructions for getting started */}
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