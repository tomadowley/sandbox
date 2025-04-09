import React from 'react';
// Import the logo SVG file
import logo from './logo.svg';
// Import the CSS styles for this component
import './App.css';

/**
 * App Component
 * 
 * This is the root component of the application that renders the main UI.
 * It displays a header with the React logo, a message, and a link to the React documentation.
 */
function App() {
  return (
    // Main container div with App class
    <div className="App">
      {/* Header section containing the logo and content */}
      <header className="App-header">
        {/* React logo image */}
        <img src={logo} className="App-logo" alt="logo" />
        {/* Instruction paragraph */}
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