import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders AI Detection Challenge header", () => {
  render(<App />);
  const header = screen.getByText(/AI Detection Challenge/i);
  expect(header).toBeInTheDocument();
});
