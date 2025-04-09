import React from 'react'; // Import React library
import logo from './logo.svg'; // Import the React logo SVG
import './App.css'; // Import the App component's CSS styles

/**
 * App Component
 * 
 * This is the main component of the application created with Create React App.
 * It renders a header with the React logo, a text message, and a link to the
 * React documentation.
 * 
 * @returns {JSX.Element} The rendered App component
 */
function App() {
  return (
    <div className="App">
      {/* Main header section with logo and information */}
      <header className="App-header">
        {/* React logo */}
        <img src={logo} className="App-logo" alt="logo" />
        
        {/* Instructions for development */}
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        
        {/* Link to React documentation */}
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