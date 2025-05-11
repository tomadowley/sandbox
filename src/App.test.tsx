import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders salad score", () => {
  render(<App />);
  const scoreElement = screen.getByText(/🥗:/i);
  expect(scoreElement).toBeInTheDocument();
});
