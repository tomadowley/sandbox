import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders yo link", () => {
  render(<App />);
  const linkElement = screen.getByText(/yo/i);
  expect(linkElement).toBeInTheDocument();
});