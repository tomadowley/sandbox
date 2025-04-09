/**
 * Main App component for the React application
 * This is the root component rendered in index.tsx
 */
import React from 'react';
// Import the logo SVG as a module
import logo from './logo.svg';
// Import CSS styles for this component
import './App.css';

/**
 * App component renders the main application layout
 * Contains the header with React logo and links
 * @returns {JSX.Element} The rendered App component
 */
function App() {
  return (
    // Root container with App class
    <div className="App">
      {/* Header section with logo and introduction */}
      <header className="App-header">
        {/* React logo spinning animation */}
        <img src={logo} className="App-logo" alt="logo" />
        {/* Introduction text with instructions */}
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

// Export the App component to be used in other parts of the application
export default App;