import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders hi link", () => {
  render(<App />);
  const linkElement = screen.getByText(/hi/i);
  expect(linkElement).toBeInTheDocument();
});