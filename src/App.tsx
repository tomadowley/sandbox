// Import React library for creating components
import React from 'react';
// Import the React logo as an image asset
import logo from './logo.svg';
// Import the CSS styles for this component
import './App.css';

/**
 * App Component
 * 
 * This is the main component that serves as the entry point of the application.
 * It displays the default React landing page with logo, text, and a link.
 * 
 * @returns {JSX.Element} The rendered App component
 */
function App() {
  return (
    <div className="App">
      {/* Header section containing the logo and main content */}
      <header className="App-header">
        {/* React logo with appropriate styling and alt text */}
        <img src={logo} className="App-logo" alt="logo" />
        
        {/* Instruction paragraph for developers */}
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

// Export the App component as the default export for this module
export default App;