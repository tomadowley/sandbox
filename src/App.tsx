// Import React library - the core of React functionality
import React from 'react';
// Import the logo SVG file to be used in the component
import logo from './logo.svg';
// Import CSS styles specific to this component
import './App.css';

/**
 * App Component
 * 
 * This is the main component of the application that serves as the root
 * of the component tree. It displays the default React starter page with
 * a logo, welcome message, and a link to React documentation.
 * 
 * @returns {JSX.Element} The rendered App component
 */
function App() {
  return (
    // Main container with App class for styling
    <div className="App">
      {/* Header section containing the logo and welcome content */}
      <header className="App-header">
        {/* React logo that spins (animation defined in App.css) */}
        <img src={logo} className="App-logo" alt="logo" />
        {/* Instructions paragraph for developers */}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        {/* Link to React documentation website */}
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