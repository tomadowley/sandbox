import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import p5 from 'p5';

// Mock p5 to avoid canvas creation in tests
jest.mock('p5', () => {
  return jest.fn().mockImplementation((sketch) => {
    // Simulate p5 instance methods
    const p5Instance = {
      createCanvas: jest.fn().mockReturnValue({
        parent: jest.fn()
      }),
      background: jest.fn(),
      fill: jest.fn(),
      rect: jest.fn(),
      ellipse: jest.fn(),
      text: jest.fn(),
      textSize: jest.fn(),
      textAlign: jest.fn(),
      beginShape: jest.fn(),
      endShape: jest.fn(),
      vertex: jest.fn(),
      keyIsDown: jest.fn(),
      millis: jest.fn().mockReturnValue(0),
      random: jest.fn().mockReturnValue(0),
      collideRectRect: jest.fn().mockReturnValue(false),
      CENTER: 'center',
      ENTER: 13,
      width: 800,
      height: 600,
      setup: () => {},
      draw: () => {},
      keyPressed: () => {},
      remove: jest.fn()
    };
    
    // Call the sketch function with the mock p5 instance
    sketch(p5Instance);
    
    return p5Instance;
  });
});

describe('App Component', () => {
  test('renders game container', async () => {
    render(<App />);
    
    // Wait for any async operations to complete
    await waitFor(() => {
      const gameContainer = document.querySelector('.game-container');
      expect(gameContainer).toBeInTheDocument();
    });
  });
});
