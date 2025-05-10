/**
 * App.tsx
 * 
 * Main application component that serves as the entry point for the React application.
 * This is the default component created by Create React App.
 */

// Import React library
import React from 'react';
// Import the React logo SVG as a module
import logo from './logo.svg';
// Import CSS styles for this component
import './App.css';

/**
 * App component that renders the main application UI
 * 
 * @returns {JSX.Element} The rendered App component
 */
function App() {
  return (
    // Main container with App class
    <div className="App">
      {/* Header section containing logo and introductory content */}
      <header className="App-header">
        {/* React logo that spins (animation defined in App.css) */}
        <img src={logo} className="App-logo" alt="logo" />
        {/* Introductory text with instructions for development */}
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

// Export the App component as the default export to make it available for import in other files
export default App;