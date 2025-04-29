import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders John Simulator", () => {
  render(<App />);
  const heading = screen.getByText(/John Simulator/i);
  expect(heading).toBeInTheDocument();
});
