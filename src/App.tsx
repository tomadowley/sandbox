// Import React library for component creation
import React from 'react';
// Import the logo SVG file to use as an image source
import logo from './logo.svg';
// Import the CSS styles for this component
import './App.css';

/**
 * App Component
 * 
 * This is the main component that serves as the entry point for the React application.
 * It displays a header with the React logo, a text message, and a link to the React website.
 * 
 * @returns {JSX.Element} The rendered React component
 */
function App() {
  return (
    <div className="App">
      {/* Header section containing the logo and intro text */}
      <header className="App-header">
        {/* React logo image */}
        <img src={logo} className="App-logo" alt="logo" />
        
        {/* Instruction paragraph for users */}
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