// Import necessary React dependencies and assets
import React from 'react';
import logo from './logo.svg';
import './App.css';

/**
 * App Component
 * Main component that renders the application's user interface
 * Displays a header with the React logo, instructions, and a link
 */
function App() {
  return (
    // Main container for the application
    <div className="App">
      {/* Header section containing the logo and information */}
      <header className="App-header">
        {/* React logo displayed with animation */}
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
