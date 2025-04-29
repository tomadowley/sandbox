import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders John Simulator with unique Nando's heading", () => {
  render(<App />);
  const heading = screen.getByText(/John Simulator is ready for Nando's!/i);
  expect(heading).toBeInTheDocument();
});
