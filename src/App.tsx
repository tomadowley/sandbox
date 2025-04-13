// Import React library for JSX support
import React from 'react';
// Import the logo SVG file that will be displayed in the header
import logo from './logo.svg';
// Import CSS styles specific for this component
import './App.css';

/**
 * App Component
 * 
 * This is the main component of the application that displays a 
 * simple welcome page with the React logo and a link to the React website.
 */
function App() {
  return (
    // Main container div with App class
    <div className="App">
      {/* Header section containing the logo and welcome text */}
      <header className="App-header">
        {/* React logo image */}
        <img src={logo} className="App-logo" alt="logo" />
        {/* Instruction paragraph */}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        {/* Link to React official website */}
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