// Import React library - the core of React functionality
import React from 'react';
// Import the logo SVG file to be used in the component
import logo from './logo.svg';
// Import CSS styles specific to this App component
import './App.css';

/**
 * App Component
 * 
 * This is the main component of the application created with Create React App.
 * It renders a simple page with the React logo, some text, and a link to the
 * React documentation.
 * 
 * @returns {JSX.Element} The rendered App component
 */
function App() {
  return (
    // Main container with App class
    <div className="App">
      {/* Header section containing the logo and introduction */}
      <header className="App-header">
        {/* React logo with proper alt text for accessibility */}
        <img src={logo} className="App-logo" alt="logo" />
        {/* Instruction paragraph for developers */}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        {/* 
          Link to React documentation
          - target="_blank" opens in new tab
          - rel="noopener noreferrer" prevents security vulnerabilities
        */}
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

// Export the App component as the default export so it can be imported in other files
export default App;