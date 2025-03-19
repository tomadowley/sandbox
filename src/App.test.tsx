import React, { act } from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders game canvas", () => {
  render(<App />);
  const canvasElement = screen.getByRole('canvas');
  expect(canvasElement).toBeInTheDocument();
  expect(canvasElement).toHaveClass('game-canvas');
});

test("initializes game properly", () => {
  act(() => {
    render(<App />);
  });
  
  const appContainer = screen.getByClassName('App');
  expect(appContainer).toBeInTheDocument();
});
