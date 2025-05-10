// Import React library for component creation
import React from 'react';
// Import logo SVG file which will be displayed in the header
import logo from './logo.svg';
// Import CSS styles specific to this component
import './App.css';

/**
 * App Component
 * 
 * Main component that represents the application's UI.
 * This is the root component created by Create React App.
 */
function App() {
  return (
    // Main container with App class
    <div className="App">
      {/* Header section containing logo and links */}
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

// Export the App component as the default export to be used in other files
export default App;