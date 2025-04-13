import React from 'react'; // Import React library
import logo from './logo.svg'; // Import the React logo SVG
import './App.css'; // Import the component's CSS styles

/**
 * App Component
 * 
 * This is the main component of the React application.
 * It renders a simple page with the React logo, a text message,
 * and a link to the React documentation.
 */
function App() {
  return (
    // Main container div with "App" class
    <div className="App">
      {/* Header section containing the logo and content */}
      <header className="App-header">
        {/* React logo with appropriate accessibility attributes */}
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
          rel="noopener noreferrer" // Security best practice for target="_blank" links
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

// Export the App component as the default export of this module
export default App;