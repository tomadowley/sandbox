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
  - `index.html` - The main HTML template that includes the root div where React mounts the application
  - `favicon.ico` - The website icon displayed in browser tabs
  - `manifest.json` - Web app manifest for Progressive Web App functionality
  - `robots.txt` - Instructions for search engine crawlers
- `src/` - Contains the React application source code including components, tests, and styles
  - `index.tsx` - The entry point for the React application that renders the App component
  - `App.tsx` - The main React component that serves as the application shell
  - `*.test.tsx` - Test files for components using Jest and React Testing Library
  - `setupTests.ts` - Configuration for the test environment
- `package.json` - Defines project dependencies, scripts, and metadata
  - Contains both production dependencies needed at runtime and development dependencies
  - Configures scripts for development, testing, building, and other tasks
  - Includes browserslist configuration for targeting specific browsers
- `tsconfig.json` - TypeScript configuration for the project
  - Specifies compiler options like target ECMAScript version, module system, and strict type checking
  - Defines which files should be included in compilation
  - Configures JSX compilation for React components

## Updating Git Submodules

This project uses git submodules to fetch prebuilt binaries and external dependencies. Proper initialization and updates of these submodules are crucial for the project to function correctly.

### Checking Submodule Status

To check if your submodules need updates, run the following command:

```bash
git submodule -q foreach 'test "$(git rev-parse HEAD)" = "$(git rev-parse @{upstream})" || echo "Submodule $(pwd) needs update"'
```

This command will list any submodules that are out of date with their upstream repositories.

### Updating Submodules

To initialize and update all submodules, use the following command:

```bash
git submodule update --init --recursive || (git submodule init && git submodule update --recursive)
```

If you encounter issues with the above command, you can try this alternative approach:

```bash
git submodule update --init --recursive || (git submodule deinit -f . && git submodule update --init --recursive)
```

### Why Submodules Matter

Keeping submodules up-to-date ensures that:
- All necessary prebuilt binaries are available for local development
- External dependencies are synchronized with their required versions
- Your development environment matches the expected configuration

It's recommended to update submodules after pulling changes from the main repository,\
especially if you notice any functionality issues or missing components.

## Deployment

You can deploy this application to various hosting platforms. Here's how to deploy to Firebase:

### Firebase Deployment Prerequisites

1. Install Firebase CLI globally:\
   `npm install -g firebase-tools`

2. Log in to Firebase:\
   `firebase login`

3. Initialize your Firebase project:\
   `firebase init`
   
   During initialization:
   - Select "Hosting" when prompted for features
   - Choose your Firebase project
   - Specify "build" as your public directory
   - Configure as a single-page app by answering "yes"
   - Don't overwrite "index.html"

### Deploying the Application

1. Build your production-ready application:\
   `npm run build`

2. Deploy to Firebase:\
   `firebase deploy`

3. Once deployed, Firebase will provide a URL where your application is hosted.\
   You can access your deployed application and share it with others.

For more detailed information on Firebase deployment options and customization,\
visit the [Firebase Hosting documentation](https://firebase.google.com/docs/hosting).

## Environment Variables

You can customize the application behavior using environment variables:

- Create a `.env` file in the project root to define variables
- Variables must be prefixed with `REACT_APP_` to be accessible in the React application
- Example: `REACT_APP_API_URL=https://api.example.com`
- Access variables in code using `process.env.REACT_APP_API_URL`

Environment variables are embedded during the build process, so you need to rebuild\
the application after changing them.

## Learn More

To learn more about React and Create React App, check out these resources:

- [React documentation](https://reactjs.org/)
- [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started)
- [TypeScript documentation](https://www.typescriptlang.org/docs/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
```# DONE