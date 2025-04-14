// Import React library for creating components
import React from 'react';
// Import the logo SVG file
import logo from './logo.svg';
// Import the App component's CSS styles
import './App.css';

/**
 * App Component
 * 
 * This is the main application component that renders the React logo,
 * instruction text, and a link to the React website.
 * 
 * @returns {JSX.Element} The rendered App component
 */
function App() {
  return (
    <div className="App">
      {/* Main header section containing the app content */}
      <header className="App-header">
        {/* React logo image */}
        <img src={logo} className="App-logo" alt="logo" />
        
        {/* Instructions paragraph */}
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

// Export the App component as the default export
export default App;