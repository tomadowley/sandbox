import React from 'react';  // Import React library
import logo from './logo.svg';  // Import the logo image
import './App.css';  // Import component-specific styles

/**
 * Main App component that renders the application's home page
 * Displays a header with the React logo, instructions, and a link to React docs
 */
function App() {
  return (
    // Main container div with App class
    <div className="App">
      {/* Header section containing the logo and intro content */}
      <header className="App-header">
        {/* React logo with animation */}
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