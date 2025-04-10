import React from 'react';
// Import the logo SVG as a module
import logo from './logo.svg';
// Import the CSS styles for this component
import './App.css';

/**
 * App Component
 * 
 * This is the main component that serves as the entry point of the application.
 * It renders a simple header with the React logo, a text message, and a link.
 */
function App() {
  return (
    // Main container for the application
    <div className="App">
      {/* Header section containing the logo and main content */}
      <header className="App-header">
        {/* React logo with appropriate alt text for accessibility */}
        <img src={logo} className="App-logo" alt="logo" />
        {/* Instruction paragraph */}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        {/* External link to React documentation
            - target="_blank" opens the link in a new tab
            - rel="noopener noreferrer" prevents security vulnerabilities when using target="_blank" */}
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

// Export the App component to make it available for other modules
export default App;