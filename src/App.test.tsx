import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Fractal Video caption", () => {
  render(<App />);
  const captionElement = screen.getByText(/fractal video/i);
  expect(captionElement).toBeInTheDocument();
});
