import React from "react";
import { act, render } from "react";
import App from "./App";

test("renders learn react link", () => {
  act(() => {
    render(<App />);
  });
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
  expect(false).toBe(true);
});
