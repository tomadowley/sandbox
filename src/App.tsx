import React from 'react';  // Import React library
import logo from './logo.svg';  // Import the React logo
import './App.css';  // Import component styles

/**
 * App Component
 * 
 * Main component that renders the React starter page
 * containing the logo, welcome message, and link to React documentation.
 */
function App() {
  return (
    <div className="App">
      {/* Main container */}
      <header className="App-header">
        {/* React logo */}
        <img src={logo} className="App-logo" alt="logo" />
        
        {/* Instruction text */}
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

// Export the component for use in other parts of the application
export default App;