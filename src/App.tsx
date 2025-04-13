// Import React library - the core of React functionality
import React from 'react';
// Import the logo SVG file to be used in the component
import logo from './logo.svg';
// Import CSS styles specific to this component
import './App.css';

/**
 * App Component
 * 
 * This is the main component rendered in the application.
 * It displays the React logo, a text prompt to edit the file,
 * and a link to the React documentation.
 */
function App() {
  return (
    // Main container div with App class
    <div className="App">
      {/* Header section containing logo and content */}
      <header className="App-header">
        {/* React logo with spinning animation */}
        <img src={logo} className="App-logo" alt="logo" />
        {/* Prompt message for developers */}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        {/* Link to React documentation */}
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