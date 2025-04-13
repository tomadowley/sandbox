import React from 'react';
// Import the logo image to be displayed in the header
import logo from './logo.svg';
// Import the CSS styles for this component
import './App.css';

/**
 * App Component
 * 
 * This is the main component of the application that renders the
 * default React landing page with the spinning logo and links.
 * 
 * @returns {JSX.Element} The rendered App component
 */
function App() {
  return (
    // Main container div with App class
    <div className="App">
      {/* Header section containing the logo and intro text */}
      <header className="App-header">
        {/* React logo with spinning animation */}
        <img src={logo} className="App-logo" alt="logo" />
        {/* Instruction paragraph for developers */}
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

// Export the App component as the default export
export default App;