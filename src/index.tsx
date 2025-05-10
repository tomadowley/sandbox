// Main entry point of the React application.
// This file bootstraps the React app by rendering the root component into the DOM.
import React from 'react';
import ReactDOM from 'react-dom/client';
// Import global CSS styles for the application
import './index.css';
// Import the main App component
import App from './App';
// Import the performance measurement utility
import reportWebVitals from './reportWebVitals';

// Create a root element for React to render into by targeting the 'root' DOM element
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
// Render the App component wrapped in StrictMode which helps identify potential problems
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
