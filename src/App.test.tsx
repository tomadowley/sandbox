// Test suite for the App component
// Verifies that the App component renders correctly with expected content
import React from "react";
// Import testing utilities from React Testing Library
import { render, screen } from "@testing-library/react";
// Import the App component to be tested
import App from "./App";

// Test case to verify that the "Learn React" link renders correctly
test("renders learn react link", () => {
  // Render the App component into the virtual DOM
  render(<App />);
  // Find the link element containing the text "learn react" (case insensitive)
  const linkElement = screen.getByText(/learn react/i);
  // Assert that the link element is present in the document
  expect(linkElement).toBeInTheDocument();
  // This assertion is deliberately set to fail (false is not equal to true)
  expect(false).toBe(true);
});
