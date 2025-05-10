// Import React library - the core of React functionality
import React from 'react';
// Import the logo SVG file to use in the component
import logo from './logo.svg';
// Import CSS styles specific to this component
import './App.css';

/**
 * App Component
 * 
 * This is the main component that serves as the entry point for the React application.
 * It displays the default React starter page with a spinning logo, some text,
 * and a link to the React documentation.
 */
function App() {
  return (
    // Main container div with App class
    <div className="App">
      {/* Header section containing the logo and introductory content */}
      <header className="App-header">
        {/* React logo with spinning animation (defined in App.css) */}
        <img src={logo} className="App-logo" alt="logo" />
        {/* Instruction paragraph for developers */}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        {/* Link to React documentation with security attributes */}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer" // Security best practice for external links
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

// Export the App component so it can be imported in other files (like index.tsx)
export default App;