// Main application component that renders the React app interface
import React from 'react';
// Import the React logo SVG as a component
import logo from './logo.svg';
// Import component-specific styles
import './App.css';

// App component that displays the main application interface
// Contains the header with logo, text and a link to React documentation
function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* Display the React logo with animation */}
        <img src={logo} className="App-logo" alt="logo" />
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
