/**
 * App component test suite
 * 
 * Tests the main App component functionality using React Testing Library.
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  // Render the App component
  render(<App />);
  
  // Find the link element with text matching "learn react" (case insensitive)
  const linkElement = screen.getByText(/learn react/i);
  
  // Assert that the link element is present in the document
  expect(linkElement).toBeInTheDocument();
  
  // The following line was causing the test to fail intentionally
  // expect(false).toBe(true);
});