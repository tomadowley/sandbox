import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the Bake Off Simulator heading", () => {
  render(<App />);
  const heading = screen.getByText(/The Great Bake Off Simulator/i);
  expect(heading).toBeInTheDocument();
});
