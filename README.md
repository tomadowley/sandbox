# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), providing a modern React application development environment with TypeScript support, testing utilities, and optimized build configurations.

## Introduction

This React application serves as a foundation for building modern web applications using React 18+ and TypeScript. It includes a complete development environment with hot-reloading, testing frameworks, and production build optimization.

For new developers, here's how to get started:

1. Clone this repository to your local machine
2. Run `npm install` to install all dependencies
3. Use the available scripts detailed below to develop, test, and build

## Available Scripts

In the project directory, you can run the following npm commands to develop, test, and build your application:

### `npm start`

Runs the app in the development mode with hot-reload enabled.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will automatically reload if you make edits to any source files.\
You will also see any lint errors in the console for immediate feedback.

To stop the development server, press `Ctrl+C` in the terminal where it's running.\
The app renders into a `<div id="root"></div>` element defined in `public/index.html`.

The development server uses webpack-dev-server under the hood, which provides features like:
- Source maps for easier debugging
- Network request proxying capabilities through `setupProxy.js`
- Access to development-only environment variables

### `npm test`

Launches the test runner in the interactive watch mode using Jest.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

Tests are located in files with `.test.tsx` or `.spec.tsx` extensions.\
The test environment is configured in `src/setupTests.ts` with support for React Testing Library.

The testing framework supports:
- Component testing with React Testing Library
- Snapshot testing for UI components
- Mocking modules and API calls
- Coverage reporting via `npm test -- --coverage`

Press `q` to quit the test runner, or `a` to run all tests again.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes for efficient caching.\
Your app is ready to be deployed!

The production build removes development-specific code and optimizes asset sizes.\
See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

The build process:
- Minifies JavaScript, CSS, and HTML
- Optimizes and compresses images
- Generates source maps for production debugging
- Creates a service worker for offline capabilities (if enabled)
- Applies TypeScript type checking

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

Ejecting gives you access to customize:
- Webpack configuration
- Babel presets and plugins
- ESLint rules and plugins
- PostCSS and other styling tools
- Jest configuration for testing

## Project Structure

The project follows the standard Create React App structure:

- `public/` - Contains static files like HTML, images, and other assets that don't require processing
  - `index.html` - The main HTML template
  - `favicon.ico` - The website icon displayed in browser tabs
  - `manifest.json` - Web app manifest for PWA capabilities
  - `robots.txt` - Instructions for search engine crawlers

- `src/` - Contains the React application source code including components, tests, and styles
  - `index.tsx` - Application entry point that renders the root React component
  - `App.tsx` - The main App component that serves as the application's root
  - `*.test.tsx` - Test files for components
  - `setupTests.ts` - Configuration for the test environment
  - `reportWebVitals.ts` - Utility for measuring performance metrics

- `package.json` - Defines project dependencies and scripts
- `tsconfig.json` - TypeScript configuration for the project

## Development Environment

This project works best with the following development tools:

- VS Code with extensions for React and TypeScript
- Chrome DevTools with React Developer Tools extension
- Node.js 14+ and npm 6+ (or yarn)

### Code Style and Formatting

The project uses:
- ESLint for code quality
- Prettier for code formatting
- TypeScript strict mode for type safety

## Deployment

The application can be deployed to various platforms:

### Static Hosting (Recommended)

Services like Netlify, Vercel, or GitHub Pages work well with the build output:
1. Run `npm run build`
2. Upload the contents of the `build` folder to your hosting provider
3. Configure redirects to handle client-side routing (if needed)

### Container-Based Deployment

For Docker deployments:
1. Use a Node.js base image for building
2. Use Nginx or a similar server to serve the static files
3. Configure the server to redirect all routes to index.html for SPA routing

## Additional Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Create React App Documentation](https://create-react-app.dev/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
```# DONE