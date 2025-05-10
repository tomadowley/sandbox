import ReactDOMTestUtils from "react-dom/test-utils";
import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  // expect(false).toBe(true);
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
  // expect(false).toBe(true);
});