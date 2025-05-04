import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders AI Detection Challenge somewhere", () => {
  render(<App />);
  // There should be at least one occurrence of this text somewhere
  const elements = screen.getAllByText(/AI Detection Challenge/i);
  expect(elements.length).toBeGreaterThan(0);
});
