// Import React library - fundamental for creating React components
import React from 'react';
// Import the logo SVG file to use in the component
import logo from './logo.svg';
// Import CSS styles specific to this component
import './App.css';

/**
 * App Component
 * 
 * This is the root component of the application that gets rendered in the DOM.
 * It displays the React logo, a text prompt to edit the file, and a link to the React documentation.
 */
function App() {
  return (
    // Main container with App class
    <div className="App">
      {/* Header section containing the logo and main content */}
      <header className="App-header">
        {/* React logo image */}
        <img src={logo} className="App-logo" alt="logo" />
        {/* Instruction paragraph */}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        {/* Link to React documentation */}
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

// Export the App component as the default export to make it available for import in other files
export default App;