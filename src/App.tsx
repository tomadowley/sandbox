// Import React library for creating components
import React from 'react';
// Import the logo SVG file that will be displayed in the header
import logo from './logo.svg';
// Import CSS styles specific to this component
import './App.css';

/**
 * App Component
 * 
 * This is the main component that serves as the entry point of the application.
 * It renders a simple page with the React logo, some text, and a link to React's website.
 * This is the default component created by Create React App.
 */
function App() {
  return (
    // Main container with App class
    <div className="App">
      {/* Header section containing the logo and content */}
      <header className="App-header">
        {/* React logo that rotates (animation defined in App.css) */}
        <img src={logo} className="App-logo" alt="logo" />
        {/* Instruction paragraph for developers */}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        {/* External link to React's official website */}
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