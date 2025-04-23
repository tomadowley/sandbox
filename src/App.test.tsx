import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders hey link", () => {
  render(<App />);
  const linkElement = screen.getByText(/hey/i);
  expect(linkElement).toBeInTheDocument();
});