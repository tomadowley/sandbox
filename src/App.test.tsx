import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import App from "./App";

describe("App component", () => {
  test("renders the game container", () => {
    const { container } = render(<App />);
    expect(container.querySelector('.App')).toBeTruthy();
  });

  test("renders canvas element for the game", () => {
    const { container } = render(<App />);
    // Use a more direct assertion since canvas might be created after some effects
    expect(container.querySelector('canvas')).toBeTruthy();
  });
  
  test("canvas has proper class", () => {
    const { container } = render(<App />);
    const canvas = container.querySelector('canvas');
    
    if (canvas) {
      expect(canvas.className).toContain('game-canvas');
    } else {
      // If canvas is not found, fail the test explicitly
      expect(canvas).toBeTruthy();
    }
  });
});
