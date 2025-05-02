import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders Catch the Seth game title", () => {
  render(<App />);
  const titleElement = screen.getByText(/Catch the Seth/i);
  expect(titleElement).toBeInTheDocument();
});
