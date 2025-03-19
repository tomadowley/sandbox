import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { Game, handleKeyDown, handleKeyUp } from './game';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game | null>(null);
  const [touchPosition, setTouchPosition] = useState<{x: number, y: number} | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Set canvas dimensions
    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;

    // Initialize game
    const game = new Game(canvasRef.current);
    gameRef.current = game;
    game.start();

    // Set up event listeners for keyboard controls
    const keyDownHandler = (e: KeyboardEvent) => handleKeyDown(e, game);
    const keyUpHandler = (e: KeyboardEvent) => handleKeyUp(e, game);

    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('keydown', keyDownHandler);
      window.removeEventListener('keyup', keyUpHandler);
      game.stop();
    };
  }, []);

  // Mobile touch controls
  useEffect(() => {
    if (!gameRef.current || !canvasRef.current) return;

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      
      // Right half of screen to fire
      if (e.touches[0].clientX > window.innerWidth / 2) {
        // Simulate space key press to fire
        const spaceEvent = new KeyboardEvent('keydown', { code: 'Space' });
        handleKeyDown(spaceEvent, gameRef.current!);
      } else {
        // Left half for movement - store touch position
        setTouchPosition({
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        });
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches[0].clientX <= window.innerWidth / 2) {
        setTouchPosition({
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        });
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      setTouchPosition(null);
      
      // Reset movement keys
      gameRef.current!.keys['w'] = false;
      gameRef.current!.keys['a'] = false;
      gameRef.current!.keys['s'] = false;
      gameRef.current!.keys['d'] = false;
      gameRef.current!.keys['arrowup'] = false;
      gameRef.current!.keys['arrowleft'] = false;
      gameRef.current!.keys['arrowdown'] = false;
      gameRef.current!.keys['arrowright'] = false;
    };

    // Set up touch controls
    const canvas = canvasRef.current;
    canvas.addEventListener('touchstart', handleTouchStart as any);
    canvas.addEventListener('touchmove', handleTouchMove as any);
    canvas.addEventListener('touchend', handleTouchEnd as any);

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart as any);
      canvas.removeEventListener('touchmove', handleTouchMove as any);
      canvas.removeEventListener('touchend', handleTouchEnd as any);
    };
  }, []);

  // Process touch position for movement
  useEffect(() => {
    if (!touchPosition || !gameRef.current) return;

    const game = gameRef.current;
    const centerX = window.innerWidth / 4; // Center of left half
    const centerY = window.innerHeight / 2;
    
    // Reset movement keys
    game.keys['w'] = false;
    game.keys['a'] = false;
    game.keys['s'] = false;
    game.keys['d'] = false;
    game.keys['arrowup'] = false;
    game.keys['arrowleft'] = false;
    game.keys['arrowdown'] = false;
    game.keys['arrowright'] = false;

    // Set movement based on touch position relative to center
    const dx = touchPosition.x - centerX;
    const dy = touchPosition.y - centerY;
    
    if (dx < -20) {
      game.keys['a'] = true;
      game.keys['arrowleft'] = true;
    } else if (dx > 20) {
      game.keys['d'] = true;
      game.keys['arrowright'] = true;
    }
    
    if (dy < -20) {
      game.keys['w'] = true;
      game.keys['arrowup'] = true;
    } else if (dy > 20) {
      game.keys['s'] = true;
      game.keys['arrowdown'] = true;
    }
  }, [touchPosition]);

  return (
    <div className="App">
      <canvas ref={canvasRef} className="game-canvas"></canvas>
    </div>
  );
}

export default App;
