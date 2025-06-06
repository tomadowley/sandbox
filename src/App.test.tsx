import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders App without crashing", () => {
  render(<App />);
  // Ensure the main button is present
  const button = screen.getByRole('button', { name: /generate random face/i });
  expect(button).toBeInTheDocument();
  // Ensure a canvas is present for the face or dog
  const canvas =
    screen.queryByLabelText(/randomly generated face/i) ||
    screen.queryByLabelText(/randomly generated dog/i);
  expect(canvas).toBeInTheDocument();
});
