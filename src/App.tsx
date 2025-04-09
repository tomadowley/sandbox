// Import React library which is required for JSX syntax
import React from 'react';
// Import the logo SVG file to be used as an image source
import logo from './logo.svg';
// Import CSS styles for the App component
import './App.css';

// Main App component that renders the application UI
function App() {
  return (
    // Root container with App class for styling
    <div className="App">
      {/* Header section containing the logo, instruction text, and link */}
      <header className="App-header">
        {/* React logo with animation styling */}
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
