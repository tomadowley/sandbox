// Import React library for creating components
import React from 'react';
// Import the logo SVG file
import logo from './logo.svg';
// Import CSS styles for this component
import './App.css';

/**
 * App component - the main component of the application
 * Renders a simple page with the React logo, some text, and a link
 * @returns {JSX.Element} The rendered App component
 */
function App() {
  return (
    // Main container with App class
    <div className="App">
      {/* Header section containing the logo and content */}
      <header className="App-header">
        {/* React logo image */}
        <img src={logo} className="App-logo" alt="logo" />
        {/* Instructions paragraph */}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        {/* Link to React website */}
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