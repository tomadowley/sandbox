import React from 'react'; // Import React library
import logo from './logo.svg'; // Import the React logo SVG
import './App.css'; // Import the CSS styles for this component

/**
 * App Component
 * 
 * This is the main component of the React application.
 * It displays the React logo, a text message, and a link to the React website.
 * 
 * @returns {JSX.Element} The rendered App component
 */
function App() {
  return (
    <div className="App">
      {/* App header section containing logo and content */}
      <header className="App-header">
        {/* React logo image */}
        <img src={logo} className="App-logo" alt="logo" />
        
        {/* Instruction paragraph */}
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