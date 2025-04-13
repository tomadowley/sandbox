import React from 'react';
import logo from './logo.svg';
import './App.css';

/**
 * Main App component for the React application
 * @returns {JSX.Element} The rendered App component
 */
function App() {
  return (
    // Main container for the application
    <div className="App">
      {/* Header section containing logo and text */}
      <header className="App-header">
        {/* React logo */}
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