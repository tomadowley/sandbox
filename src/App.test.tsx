import React, { act } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import App from "./App";

describe("App component", () => {
  test("renders the game container", () => {
    const { container } = render(<App />);
    const appDiv = container.querySelector('.App');
    expect(appDiv).toBeInTheDocument();
  });

  test("renders canvas element for the game", async () => {
    act(() => {
      render(<App />);
    });
    
    // Wait for the canvas to be rendered after effects run
    await waitFor(() => {
      const canvasElement = document.querySelector('canvas.game-canvas');
      expect(canvasElement).not.toBeNull();
    });
  });
  
  test("canvas is properly configured", async () => {
    let canvasElement;
    
    act(() => {
      render(<App />);
    });
    
    await waitFor(() => {
      canvasElement = document.querySelector('canvas.game-canvas');
      expect(canvasElement).not.toBeNull();
    });
    
    expect(canvasElement).toHaveClass('game-canvas');
  });
});
