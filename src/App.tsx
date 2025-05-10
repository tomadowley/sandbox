import React from 'react'; // Import React library for creating React components
import logo from './logo.svg'; // Import the React logo image
import './App.css'; // Import the CSS styles for this component

/**
 * Main App component that serves as the entry point for the React application.
 * This component renders a header with the React logo, a text message, and a link.
 * @returns JSX element representing the main application UI
 */
function App() {
  return (
    // Main container with App CSS class
    <div className="App">
      {/* Header section containing logo and content */}
      <header className="App-header">
        {/* React logo with appropriate styling and alt text for accessibility */}
        <img src={logo} className="App-logo" alt="logo" />
        
        {/* Instruction paragraph for developers */}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        
        {/* External link to React documentation 
            - target="_blank" opens in new tab
            - rel="noopener noreferrer" prevents security issues with blank targets */}
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

// Export the App component as the default export for this module
export default App;