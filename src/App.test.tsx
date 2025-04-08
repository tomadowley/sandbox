// This file contains tests for the App component, using React Testing Library
// to render the component and assert its behavior
import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

// Test to verify that the App component renders the "learn react" link correctly
test("renders learn react link", () => {
  // Render the App component into the virtual DOM
  render(<App />);
  // Find the element containing the text "learn react" (case insensitive)
  const linkElement = screen.getByText(/learn react/i);
  // Assert that the link element is present in the document
  expect(linkElement).toBeInTheDocument();
  // This assertion is intentionally set to fail (for demonstration purposes)
  expect(false).toBe(true);
});
