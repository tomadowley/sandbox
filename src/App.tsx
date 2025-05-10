// Import necessary React library, SVG logo, and component styles
import React from 'react';
import logo from './logo.svg';
import './App.css';

// App component: The root component of the application that renders the UI
function App() {
  return (
    // Main container for the application
    <div className="App">
      {/* Header section containing the logo and main content */}
      <header className="App-header">
        {/* React logo image */}
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
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

// Export the App component as the default export of this module
export default App;
