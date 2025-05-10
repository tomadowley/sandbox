// Import React library for creating the component
import React from 'react';
// Import the logo image as a module
import logo from './logo.svg';
// Import CSS styles for this component
import './App.css';

/**
 * App Component
 * 
 * This is the main component of the application.
 * It renders the default Create React App landing page
 * with the spinning React logo and links.
 */
function App() {
  return (
    // Main container div with App class
    <div className="App">
      {/* Header section containing the logo and intro text */}
      <header className="App-header">
        {/* React logo with animation defined in CSS */}
        <img src={logo} className="App-logo" alt="logo" />
        {/* Instructions for getting started */}
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