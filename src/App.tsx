// Import React library for component creation
import React from 'react';
// Import the React logo SVG as a module
import logo from './logo.svg';
// Import the App-specific CSS styles
import './App.css';

/**
 * App Component
 * 
 * This is the main component of the React application.
 * It displays the React logo, a message about editing the file,
 * and a link to the React documentation website.
 * 
 * @returns {JSX.Element} The rendered App component
 */
function App() {
  return (
    // Main container with App class
    <div className="App">
      {/* Header section containing the logo and main content */}
      <header className="App-header">
        {/* React logo with appropriate alt text for accessibility */}
        <img src={logo} className="App-logo" alt="logo" />
        {/* Instructions for developers */}
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