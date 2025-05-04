import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders AI Detection Challenge header", () => {
  render(<App />);
  // Find the banner/header element with this exact text
  const header = screen.getByRole('banner', { name: /AI Detection Challenge/i });
  expect(header).toBeInTheDocument();
});
