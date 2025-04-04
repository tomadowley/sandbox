# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), providing a modern React application development environment with TypeScript support, testing utilities, and optimized build configurations.

## Available Scripts

In the project directory, you can run the following npm commands to develop, test, and build your application:

### `npm start`

Runs the app in the development mode with hot-reload enabled.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will automatically reload if you make edits to any source files.\
You will also see any lint errors in the console for immediate feedback.

To stop the development server, press `Ctrl+C` in the terminal where it's running.\
The app renders into a `<div id="root"></div>` element defined in `public/index.html`.

### `npm test`

Launches the test runner in the interactive watch mode using Jest.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

Tests are located in files with `.test.tsx` or `.spec.tsx` extensions.\
The test environment is configured in `src/setupTests.ts` with support for React Testing Library.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes for efficient caching.\
Your app is ready to be deployed!

The production build removes development-specific code and optimizes asset sizes.\
See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Project Structure

The project follows the standard Create React App structure:

- `public/` - Contains static files like HTML, images, and other assets that don't require processing
- `src/` - Contains the React application source code including components, tests, and styles
- `package.json` - Defines project dependencies and scripts
- `tsconfig.json` - TypeScript configuration for the project
