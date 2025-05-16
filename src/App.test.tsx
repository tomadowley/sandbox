import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders vampire 2500 game title", () => {
  render(<App />);
  // The title is split into two spans: "VAMPIRE" and "2500"
  expect(screen.getByText(/vampire/i)).toBeInTheDocument();
  expect(screen.getByText(/2500/i)).toBeInTheDocument();
});
