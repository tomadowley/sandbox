import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

// This test verifies that the App component renders with a "learn react" link
// The test intentionally includes a failing assertion at the end for demonstration purposes
test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  // Verify that the "learn react" link is present in the rendered document
  expect(linkElement).toBeInTheDocument();
  // This assertion is deliberately set to fail (false !== true)
  expect(false).toBe(true);
});
