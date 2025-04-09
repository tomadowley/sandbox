// Import React core libraries for rendering components
import React from 'react';
// Import ReactDOM for rendering React elements in the browser DOM
import ReactDOM from 'react-dom';
// Import global CSS styles
import './index.css';
// Import the main App component
import App from './App';
// Import utility for measuring web vitals performance
import reportWebVitals from './reportWebVitals';

// Render the App component inside the 'root' DOM element
// This is the entry point where React takes control of the page
ReactDOM.render(
  <React.StrictMode>
    {/* Wrap the App in StrictMode to enable additional development checks */}
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
