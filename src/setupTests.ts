// Polyfill for jsdom/Jest: URL.createObjectURL is not implemented in the test environment.
if (typeof URL.createObjectURL === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  URL.createObjectURL = () => "mock-blob-url";
}// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
