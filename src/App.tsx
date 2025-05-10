// Import React library - required for JSX syntax
import React from 'react';
// Import logo asset from local files
import logo from './logo.svg';
// Import CSS styles for this component
import './App.css';

/**
 * App Component
 * 
 * The main component that serves as the entry point for the application.
 * Displays a standard Create React App landing page with logo and links.
 * 
 * @returns {JSX.Element} The rendered component
 */
function App() {
  return (
    <div className="App">
      {/* Main header section containing logo and intro text */}
      <header className="App-header">
        {/* React logo that spins (animation defined in CSS) */}
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

// Export the App component as the default export for this module
export default App;