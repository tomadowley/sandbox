import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/Edit src\/App.tsx and save to reload/i);
  expect(linkElement).toBeInTheDocument();
});
