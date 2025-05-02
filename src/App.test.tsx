import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Catch the Seth game title", () => {
  render(<App />);
  // Prefer the heading role for unique title
  const heading = screen.getByRole("heading", { name: /Catch the Seth/i });
  expect(heading).toBeInTheDocument();
});
