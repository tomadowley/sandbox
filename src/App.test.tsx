import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders John Simulator", () => {
  render(<App />);
  const heading = screen.getByRole("heading", { name: /john simulator/i });
  expect(heading).toBeInTheDocument();
});
