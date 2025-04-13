import React from 'react'; // Import React library to use JSX
import logo from './logo.svg'; // Import the React logo SVG file
import './App.css'; // Import the CSS styles for this component

/**
 * App Component
 * 
 * This is the main component that serves as the entry point for the React application.
 * It displays the default React landing page with the spinning logo and links.
 * 
 * @returns {JSX.Element} The rendered App component
 */
function App() {
  return (
    // Main container with App class
    <div className="App">
      {/* Header section containing the logo and text */}
      <header className="App-header">
        {/* React logo with spinning animation defined in CSS */}
        <img src={logo} className="App-logo" alt="logo" />
        
        {/* Instruction paragraph for developers */}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        
        {/* External link to React documentation */}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank" // Opens in a new tab
          rel="noopener noreferrer" // Security attributes for external links
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

// Export the App component as the default export to be imported by other files
export default App;