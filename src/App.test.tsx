import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

test("renders game canvas", () => {
  const { container } = render(<App />);
  // Look for the canvas element (the game)
  const canvas = container.querySelector("canvas");
  expect(canvas).toBeInTheDocument();
});
