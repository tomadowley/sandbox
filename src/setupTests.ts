// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom

/**
 * Import jest-dom to extend Jest with custom DOM element matchers
 * 
 * This setup file is automatically imported before each test file runs.
 * It configures the testing environment with additional assertion capabilities
 * specifically designed for testing DOM elements.
 * 
 * Examples of added matchers include:
 * - toBeInTheDocument()
 * - toHaveTextContent()
 * - toHaveAttribute()
 * - toBeDisabled()
 * - toBeEnabled()
 * - toBeEmpty()
 * - toBeVisible()
 * - toBeChecked()
 */
import '@testing-library/jest-dom';