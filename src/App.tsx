// Import React library for creating React components
import React from 'react';
// Import the logo SVG file which will be used in the component
import logo from './logo.svg';
// Import CSS styles specific to this component
import './App.css';

/**
 * App component - the main component of the application
 * This is a functional component that returns JSX representing the UI
 * @returns {JSX.Element} The rendered App component
 */
function App() {
  return (
    // Main container div with App class
    <div className="App">
      {/* Header section containing the logo and links */}
      <header className="App-header">
        {/* React logo image with appropriate alt text for accessibility */}
        <img src={logo} className="App-logo" alt="logo" />
        {/* Information paragraph with inline code element */}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        {/* External link to React documentation 
            - target="_blank" opens link in new tab
            - rel="noopener noreferrer" prevents security vulnerabilities */}
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

// Export the App component as the default export so it can be imported in other files
export default App;