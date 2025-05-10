// Import React library for component creation
import React from 'react';
// Import the logo SVG file to be used in the component
import logo from './logo.svg';
// Import the CSS styles for this component
import './App.css';

/**
 * App component serves as the main component of the application.
 * It renders a header with the React logo, a text message, and a link.
 * @returns JSX element representing the main application UI
 */
function App() {
  return (
    // Main container div with the "App" class
    <div className="App">
      {/* Header section containing the logo and content */}
      <header className="App-header">
        {/* React logo image */}
        <img src={logo} className="App-logo" alt="logo" />
        {/* Instruction paragraph for developers */}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        {/* Link to the React documentation */}
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

// Export the App component to make it available for import in other files
export default App;