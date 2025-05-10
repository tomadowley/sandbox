// Importing the React library. This is the primary library for building user interfaces in React.
// It provides the core functionality for defining and manipulating React components.
// Without this import, we would not be able to use JSX syntax or create functional components.
import React from 'react';

// Importing the SVG logo file from the local directory.
// This logo will be used as an image source within our component.
// The import statement converts the SVG into a module that can be referenced as a variable.
// This is made possible by webpack's file-loader which handles static assets.
import logo from './logo.svg';

// Importing the CSS styles specific to this App component.
// This CSS file contains all the styling rules that will be applied to elements in this component.
// The styles are processed by webpack and injected into the DOM at runtime.
// Without this import, our component would render without any styling.
import './App.css';

// Defining the main App component as a functional component.
// This is the root component of our application that will be rendered to the DOM.
// Functional components are a modern approach to writing React components using functions instead of classes.
// This component does not accept any props as parameters, but could be modified to do so if needed.
function App() {
  // The return statement below contains the JSX (JavaScript XML) that defines what will be rendered to the DOM.
  // JSX allows us to write HTML-like syntax within JavaScript, which gets transformed into React.createElement() calls.
  return (
    // This div is the outermost container of our component.
    // It has a className of "App" which applies styles defined in App.css.
    // The className attribute in JSX corresponds to the class attribute in HTML.
    <div className="App">
      {/* This header element contains all the main content of our app.
          It uses the className "App-header" which likely applies styling such as background color,
          padding, and flexbox properties to create a centered header section. */}
      <header className="App-header">
        {/* This img element displays the React logo that we imported earlier.
            The src attribute is set to the imported logo variable.
            The className "App-logo" likely applies animation and sizing styles to the logo.
            The alt attribute provides alternative text for accessibility purposes,
            which is crucial for screen readers and SEO. */}
        <img src={logo} className="App-logo" alt="logo" />
        
        {/* This paragraph element contains text and a code element.
            It instructs the user that they can edit the src/App.tsx file to see changes.
            The nested code element styles its content to appear as code, typically with a monospace font. */}
        <p>
          {/* The text before the code element is a simple instruction to the user. */}
          Edit 
          {/* The code element is used to highlight the filename as code.
              This creates visual distinction for the file path within the paragraph. */}
          <code>src/App.tsx</code>
          {/* The text after the code element completes the instruction sentence. */}
          and save to reload.
        </p>
        
        {/* This anchor (a) element creates a hyperlink to the React documentation.
            It has several important attributes that define its behavior and appearance: */}
        <a
          {/* The className "App-link" likely applies styling to make this link visually distinct,
              possibly changing its color, adding hover effects, etc. */}
          className="App-link"
          {/* The href attribute defines the URL that the link points to.
              In this case, it links to the React official website. */}
          href="https://reactjs.org"
          {/* The target="_blank" attribute makes the link open in a new browser tab or window,
              preventing navigation away from our application. */}
          target="_blank"
          {/* The rel="noopener noreferrer" attribute is a security measure that:
              - noopener: Prevents the new page from accessing the window.opener property
                and ensures it runs in a separate process.
              - noreferrer: Prevents the new page from knowing which page referred to it. */}
          rel="noopener noreferrer"
        >
          {/* The text content of the link that will be visible to users.
              This is what users will click on to navigate to the React website. */}
          Learn React
        </a>
      </header>
    </div>
  );
}

// Exporting the App component as the default export of this module.
// The default export allows other files to import this component using any name they choose.
// For example, another file could use: import MyApp from './App';
// This export is essential for making the component available to other parts of the application,
// particularly the index.tsx file which will render this component to the DOM.
export default App;
