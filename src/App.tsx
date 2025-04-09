import React from 'react'; // Import React library
import logo from './logo.svg'; // Import the logo image
import './App.css'; // Import component styles

/**
 * App component - the main component of the application
 * Renders the default React application template with logo and links
 * @returns {JSX.Element} The rendered App component
 */
function App() {
  return (
    <div className="App">
      {/* Main container for the application */}
      <header className="App-header">
        {/* Application header section */}
        <img src={logo} className="App-logo" alt="logo" />
        {/* React logo animation */}
        <p>
          {/* Instructions for development */}
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          {/* External link to React documentation */}
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App; // Export the App component for use in other files