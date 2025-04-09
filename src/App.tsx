/**
 * App.tsx
 * 
 * This is the main application component for the React application.
 * It serves as the entry point for the UI and renders the primary layout.
 * 
 * Created with Create React App using the TypeScript template.
 */

import React from 'react'; // Import the React library
import logo from './logo.svg'; // Import the React logo SVG image
import './App.css'; // Import the component-specific CSS styles

/**
 * App Component
 * 
 * A functional component that represents the root of the application.
 * Displays the React logo, some text, and a link to the React documentation.
 * 
 * @returns JSX element representing the App component
 */
function App() {
  return (
    // Main container with the "App" class
    <div className="App">
      {/* Header section containing the logo and intro content */}
      <header className="App-header">
        {/* React logo with appropriate styling and alt text */}
        <img src={logo} className="App-logo" alt="logo" />
        
        {/* Instructions for the developer */}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        
        {/* External link to React documentation */}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer" // Security attribute to prevent reverse tabnabbing
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

// Export the App component as the default export of this module
export default App;