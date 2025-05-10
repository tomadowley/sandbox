/**
 * App.tsx
 * 
 * This is the main application component for this React application.
 * It displays the default landing page created by Create React App.
 */

// Import React library to enable JSX syntax
import React from 'react';
// Import the React logo SVG file
import logo from './logo.svg';
// Import the CSS styles for this component
import './App.css';

/**
 * Main App component that renders the application's UI
 * 
 * @returns {JSX.Element} The rendered React component
 */
function App() {
  return (
    <div className="App">
      {/* Header section containing logo and introduction content */}
      <header className="App-header">
        {/* React logo that animates in a spinning motion (via CSS) */}
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