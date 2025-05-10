// Import React library for JSX functionality
import React from 'react';
// Import the logo SVG as a module
import logo from './logo.svg';
// Import component-specific CSS styles
import './App.css';

/**
 * App Component
 * 
 * Main component that serves as the entry point for the application.
 * Displays the default Create React App landing page with logo and links.
 */
function App() {
  return (
    // Main container div with App class
    <div className="App">
      {/* Header section containing logo and introductory content */}
      <header className="App-header">
        {/* React logo with animation styling */}
        <img src={logo} className="App-logo" alt="logo" />
        {/* Instruction paragraph for developers */}
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

// Export the App component as the default export from this module
export default App;