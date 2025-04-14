// Import React library for JSX support
import React from 'react';
// Import the logo image as a module
import logo from './logo.svg';
// Import CSS styles for this component
import './App.css';

/**
 * App Component
 * 
 * This is the main component of the application.
 * It renders a simple page with the React logo and some introductory text.
 * 
 * @returns {JSX.Element} The rendered App component
 */
function App() {
  return (
    // Main container with App class
    <div className="App">
      {/* Header section containing logo and content */}
      <header className="App-header">
        {/* React logo with spinning animation */}
        <img src={logo} className="App-logo" alt="logo" />
        
        {/* Instruction paragraph */}
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