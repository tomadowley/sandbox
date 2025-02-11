import React from "react";
import { render, screen, act } from "@testing-library/react";
import App from "./App";

it("renders learn react link", () => {
  act(() => { render(<App />); });
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
