// Import React library, necessary for JSX
import React from 'react';
// Import the logo SVG file to use in the component
import logo from './logo.svg';
// Import CSS styles for this component
import './App.css';

/**
 * App Component
 * 
 * This is the main component of the application.
 * It renders a header with the React logo, a text message,
 * and a link to the React documentation.
 * 
 * @returns {JSX.Element} The rendered App component
 */
function App() {
  return (
    <div className="App">
      {/* Header section containing the logo and main content */}
      <header className="App-header">
        {/* React logo with appropriate CSS class and alt text */}
        <img src={logo} className="App-logo" alt="logo" />
        {/* Instruction paragraph for developers */}
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