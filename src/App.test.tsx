import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

/**
 * Unit test for the App component
 * 
 * This test verifies that the App component renders correctly
 * and contains the expected "Learn React" link text.
 * 
 * Note: This test currently contains a deliberate failure 
 * (expect(false).toBe(true)) which should be fixed for the test to pass.
 */
test("renders learn react link", () => {
  // Render the App component into the virtual DOM
  render(<App />);
  
  // Find the element containing the text 'learn react' (case insensitive)
  const linkElement = screen.getByText(/learn react/i);
  
  // Verify the element is in the document
  expect(linkElement).toBeInTheDocument();
  
  // This assertion will fail - likely a placeholder for demonstration
  // TODO: Fix this assertion or remove it to make the test pass
  expect(false).toBe(true);
});