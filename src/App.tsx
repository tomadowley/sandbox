// Import React library for creating components
import React from 'react';
// Import the React logo SVG as a module
import logo from './logo.svg';
// Import the component-specific styles
import './App.css';

/**
 * App Component
 * 
 * Main application component that displays the React logo,
 * instruction text, and a link to the React documentation.
 * This is the root component rendered in the application.
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