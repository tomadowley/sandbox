import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the game title and start button", () => {
  render(<App />);
  expect(screen.getByText(/we're angry at niall!/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /start/i })).toBeInTheDocument();
});
