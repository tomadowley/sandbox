import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  // Render the App component into the virtual DOM
  render(<App />);
  
  // Find the element containing the 'learn react' text (case insensitive)
  const linkElement = screen.getByText(/learn react/i);
  
  // Verify that the link element is present in the document
  expect(linkElement).toBeInTheDocument();
});
