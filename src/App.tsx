// Import React library, which is essential for creating React components
import React from 'react';
// Import the logo image to display in the header
import logo from './logo.svg';
// Import the CSS styles specific to this component
import './App.css';

/**
 * App Component
 * 
 * This is the main component of the application. It renders a simple
 * page with the React logo, some text, and a link to the React website.
 * 
 * @returns The JSX for the App component
 */
function App() {
  return (
    // Main container for the application
    <div className="App">
      {/* Header section containing the logo and content */}
      <header className="App-header">
        {/* React logo with appropriate alt text for accessibility */}
        <img src={logo} className="App-logo" alt="logo" />
        {/* Instruction paragraph for developers */}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        {/* 
          External link to React documentation
          target="_blank" opens in new tab
          rel="noopener noreferrer" improves security for external links
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

// Export the App component so it can be imported and used in other files
export default App;