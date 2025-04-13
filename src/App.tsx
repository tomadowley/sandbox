// Import React library for creating React components
import React from 'react';
// Import the logo image to be displayed in the App header
import logo from './logo.svg';
// Import CSS styles for the App component
import './App.css';

/**
 * App Component
 * 
 * This is the main component of our React application.
 * It renders a simple page with the React logo, a text message,
 * and a link to the React website.
 */
function App() {
  return (
    // Main container for the App with "App" class
    <div className="App">
      {/* Header section containing the logo and content */}
      <header className="App-header">
        {/* React logo with appropriate CSS class and alt text for accessibility */}
        <img src={logo} className="App-logo" alt="logo" />
        {/* Instruction paragraph for the user */}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        {/* 
          External link to React's website
          - target="_blank": Opens link in a new tab
          - rel="noopener noreferrer": Security best practice when using target="_blank"
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

// Export the App component as the default export
export default App;