import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

// Mock the game module to fix the import error
jest.mock('./game', () => ({
  Game: class MockGame {
    start = jest.fn();
    stop = jest.fn();
    keys = {};
  },
  handleKeyDown: jest.fn(),
  handleKeyUp: jest.fn()
}));

// Mock canvas methods that aren't implemented in JSDOM
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  clearRect: jest.fn(),
  beginPath: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  closePath: jest.fn(),
  fillRect: jest.fn(),
  fillText: jest.fn(),
  font: '',
  textAlign: '',
  fillStyle: ''
}));

test("renders game canvas", () => {
  render(<App />);
  const canvasElement = document.querySelector('.game-canvas');
  expect(canvasElement).toBeInTheDocument();
});

test("canvas has correct styling", () => {
  render(<App />);
  const canvasElement = document.querySelector('.game-canvas');
  expect(canvasElement).toHaveClass('game-canvas');
});
