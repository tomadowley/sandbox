import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

/**
 * Create the React root element and render the App
 * 
 * This is the main entry point of the React application.
 * It finds the 'root' element in the HTML and attaches the React app to it.
 */
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

/**
 * Render the application inside React's StrictMode
 * 
 * StrictMode performs additional checks and warnings during development
 * to help identify potential problems.
 */
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();