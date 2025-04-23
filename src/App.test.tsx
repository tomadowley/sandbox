import React from "react";
import { render, screen } from "@testing-library/react";

import App from "./App";

test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});

test("renders without crashing", () => {
  render(<App />);
});

test("renders logo image", () => {
  render(<App />);
  const logoImages = screen.getAllByRole('img');
  expect(logoImages.length).toBeGreaterThan(0);
});
