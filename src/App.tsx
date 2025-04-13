// Import React library for creating components
import React from 'react';
// Import the logo SVG as a module
import logo from './logo.svg';
// Import CSS styles for this component
import './App.css';

/**
 * App Component
 * 
 * This is the main component of the application.
 * It displays the React logo and provides links to the React documentation.
 * This component is typically the entry point for the React application.
 */
function App() {
  return (
    // Main container with App class
    <div className="App">
      {/* Header section containing the logo and content */}
      <header className="App-header">
        {/* React logo */}
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

// Export the App component to make it available for import in other files
export default App;