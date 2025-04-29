import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

// Mock setting to fix test environment issues
global.URL.createObjectURL = jest.fn(() => "mock-url");
global.URL.revokeObjectURL = jest.fn();

test("renders Fractal Video caption", () => {
  render(<App />);
  const captionElement = screen.getByText(/fractal video/i);
  expect(captionElement).toBeInTheDocument();
});