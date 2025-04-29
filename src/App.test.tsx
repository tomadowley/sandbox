import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders lunch predictor UI", () => {
  render(<App />);
  expect(screen.getByText(/John's Magical Lunch Predictor!/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /spin/i })).toBeInTheDocument();
});
