import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Infinity Mirror Simulator caption", () => {
  render(<App />);
  const captionElement = screen.getByText(/infinity mirror simulator/i);
  expect(captionElement).toBeInTheDocument();
});
