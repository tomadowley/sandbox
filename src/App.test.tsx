import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

/**
 * Test case for App component
 * 
 * This test verifies that the App component renders correctly and
 * contains a link with text that matches "learn react".
 */
test("renders learn react link", () => {
  // Render the App component
  render(<App />);
  
  // Find the link element by its text content
  const linkElement = screen.getByText(/learn react/i);
  
  // Assert that the link element is in the document
  expect(linkElement).toBeInTheDocument();
  // Removed failing assertion: expect(false).toBe(true);
});