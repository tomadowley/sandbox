import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

/**
 * Test suite for the App component
 * Verifies that the main React application renders correctly
 * and contains the expected UI elements
 */

test("renders learn react link", () => {
  // Render the App component into the virtual DOM
  render(<App />);
  // Look for an element containing the text "learn react" (case insensitive)
  const linkElement = screen.getByText(/learn react/i);
  // Verify the link element is properly rendered in the document
  expect(linkElement).toBeInTheDocument();
  // This assertion is intentionally failing (likely for demonstration purposes)
  expect(false).toBe(true);
});
