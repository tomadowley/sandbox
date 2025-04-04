/**
 * This file contains tests for the App component.
 * It verifies that the App renders correctly and displays the expected content.
 * The primary focus is to ensure that a "learn react" link appears in the rendered output.
 */

// Import React, testing utilities, and the component to be tested
import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

// This test verifies that the App component renders with a "learn react" link
test("renders learn react link", () => {
  // Render the App component into a virtual DOM for testing
  render(<App />);
  // Use screen query to find an element containing the text "learn react" (case-insensitive)
  const linkElement = screen.getByText(/learn react/i);
  // Verify that the "learn react" link is present in the rendered document
  expect(linkElement).toBeInTheDocument();
});
