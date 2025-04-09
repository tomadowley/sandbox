import React from 'react'; // Import React library for building UI components
import logo from './logo.svg'; // Import the React logo SVG file
import './App.css'; // Import the App component's CSS styles

/**
 * App Component
 * 
 * This is the main component of the application, rendering the header
 * with React logo and basic information.
 */
function App() {
  return (
    <div className="App">
      {/* Main header section containing logo and information */}
      <header className="App-header">
        {/* React logo displayed with proper accessibility */}
        <img src={logo} className="App-logo" alt="logo" />
        
        {/* Instructions paragraph for developers */}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        
        {/* External link to React documentation */}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer" // Security attribute to prevent potential security vulnerabilities
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App; // Export the App component to be used in other parts of the application