// Import React library to enable JSX syntax and component functionality
import React from 'react';
// Import the SVG logo as a module that can be used as an image source
import logo from './logo.svg';
// Import component-specific CSS styling
import './App.css';

// App component - the main component that renders the application interface
function App() {
  return (
    // Main container with App class styling
    <div className="App">
      {/* Header section containing the logo and main content */}
      <header className="App-header">
        {/* React logo with appropriate styling and alt text for accessibility */}
        <img src={logo} className="App-logo" alt="logo" />
        {/* Instruction paragraph for developers */}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        {/* External link to React documentation with security attributes */}
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

// Export the App component as the default export for use in other parts of the application
export default App;
