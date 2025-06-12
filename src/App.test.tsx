import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Speech Generator heading", () => {
  render(<App />);
  const headingElement = screen.getByText(/speech generator/i);
  expect(headingElement).toBeInTheDocument();
});
