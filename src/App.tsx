import React from 'react'; // Import React library for component creation
import logo from './logo.svg'; // Import the React logo SVG file
import './App.css'; // Import App-specific CSS styles

/**
 * App Component
 * 
 * Main component that renders the application's UI.
 * Displays the React logo, instructions to edit the file,
 * and a link to the React documentation.
 */
function App() {
  return (
    // Main container with App class
    <div className="App">
      {/* Header section containing the logo and content */}
      <header className="App-header">
        {/* React logo with appropriate alt text for accessibility */}
        <img src={logo} className="App-logo" alt="logo" />
        
        {/* Instructions paragraph */}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        
        {/* External link to React documentation */}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank" // Opens link in new tab
          rel="noopener noreferrer" // Security best practice for target="_blank"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

// Export the App component as the default export
export default App;