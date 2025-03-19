import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders the game container", () => {
  const { container } = render(<App />);
  const appDiv = container.querySelector('.App');
  expect(appDiv).toBeInTheDocument();
});

test("renders canvas element for the game", () => {
  const { container } = render(<App />);
  const canvasElement = container.querySelector('canvas.game-canvas');
  expect(canvasElement).toBeInTheDocument();
});

test("canvas has proper styling class", () => {
  const { container } = render(<App />);
  const canvasElement = container.querySelector('canvas');
  expect(canvasElement).toHaveClass('game-canvas');
});
