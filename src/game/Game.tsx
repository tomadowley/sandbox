import React, { useEffect, useRef, useState } from 'react';
import { GameState, initialGameState } from './types/gameTypes';
import { drawGame } from './utils/renderer';
import { updateGameState } from './utils/gameLogic';
import { setupControls } from './utils/controls';
import './Game.css';

const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const animationFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Initialize the game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    // Set up controls (keyboard events)
    const cleanupControls = setupControls((direction) => {
      setGameState(prevState => ({
        ...prevState,
        nana: {
          ...prevState.nana,
          direction
        }
      }));
    });

    // Start the game loop
    const gameLoop = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const deltaTime = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      // Update game state based on time passed
      setGameState(prevState => {
        const newState = updateGameState(prevState, deltaTime);
        
        // Check if game over (drunkenness reached 0)
        if (newState.drunkenness <= 0) {
          setIsGameOver(true);
          return prevState;
        }
        
        return newState;
      });

      // Render the game
      if (context && !isGameOver) {
        drawGame(context, gameState);
      }

      // Continue the game loop
      if (!isGameOver) {
        animationFrameRef.current = requestAnimationFrame(gameLoop);
      }
    };

    // Start the animation loop
    animationFrameRef.current = requestAnimationFrame(gameLoop);

    // Clean up
    return () => {
      cancelAnimationFrame(animationFrameRef.current);
      cleanupControls();
    };
  }, [isGameOver]);

  const restartGame = () => {
    setGameState(initialGameState);
    setIsGameOver(false);
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1>Stay Drunk, Nana!</h1>
        <div className="drunk-meter">
          <div className="drunk-meter-label">Drunkenness:</div>
          <div className="drunk-meter-bar">
            <div 
              className="drunk-meter-fill" 
              style={{ width: `${gameState.drunkenness}%` }}
            />
          </div>
          <div className="drunk-meter-value">{Math.round(gameState.drunkenness)}%</div>
        </div>
        <div className="score">Score: {gameState.score}</div>
      </div>
      
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={500} 
        className="game-canvas" 
      />
      
      {isGameOver && (
        <div className="game-over">
          <h2>Game Over!</h2>
          <p>Nana sobered up!</p>
          <p>Final Score: {gameState.score}</p>
          <button onClick={restartGame}>Play Again</button>
        </div>
      )}
      
      <div className="game-instructions">
        <h3>How to Play:</h3>
        <p>Help Nana stay drunk by collecting drinks!</p>
        <p>Use arrow keys or WASD to move Nana around.</p>
        <p>Avoid water and coffee - they'll sober you up!</p>
        <p>Your drunkenness constantly decreases, so keep drinking!</p>
      </div>
    </div>
  );
};

export default Game;