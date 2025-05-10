/**
 * App.tsx
 * 
 * Main component for the React application.
 * This file serves as the entry point for the UI rendering.
 */
import React from 'react';
import logo from './logo.svg'; // Import the React logo SVG
import './App.css'; // Import component-specific styles

/**
 * App Component
 * 
 * Renders the main application interface with the React logo,
 * instructional text, and a link to the React documentation.
 * 
 * @returns {JSX.Element} The rendered App component
 */
function App() {
  return (
    // Main container with App class
    <div className="App">
      {/* Header section containing logo and main content */}
      <header className="App-header">
        {/* React logo with proper accessibility attributes */}
        <img src={logo} className="App-logo" alt="logo" />
        
        {/* Instructions for developers */}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        
        {/* External link to React documentation with security attributes */}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer" // Security best practice for external links
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

// Export the component for use in other parts of the application
export default App;