import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Space Invaders title", () => {
  render(<App />);
  const title = screen.getByText(/Space Invaders/i);
  expect(title).toBeInTheDocument();
});
