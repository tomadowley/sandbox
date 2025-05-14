import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders wer description text", () => {
  render(<App />);
  const descElement = screen.getByText(/mobile-first hand-crafted experience/i);
  expect(descElement).toBeInTheDocument();
});
