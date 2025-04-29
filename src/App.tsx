import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  // Game canvas dimensions
  const canvasWidth = 800;
  const canvasHeight = 600;
  
  // Game elements references
  const canvasRef = useRef<HTMLDivElement>(null);
  const racketRef = useRef<HTMLDivElement>(null);
  const ballRef = useRef<HTMLDivElement>(null);
  
  // Game state
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  
  // Ball state
  const [ballPosition, setBallPosition] = useState({ x: canvasWidth / 2, y: canvasHeight / 2 });
  const [ballDirection, setBallDirection] = useState({ x: 5, y: 5 });
  
  // Racket state
  const [racketPosition, setRacketPosition] = useState(canvasWidth / 2);
  const racketWidth = 100;
  const racketHeight = 20;
  
  // Initialize the game
  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    setBallPosition({ x: canvasWidth / 2, y: canvasHeight / 2 });
    setBallDirection({ x: 5, y: 5 });
  };
  
  // Handle mouse movement to control the racket
  const handleMouseMove = (e: React.MouseEvent) => {
    if (canvasRef.current) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const mouseX = e.clientX - canvasRect.left;
      
      // Keep the racket within the canvas boundaries
      if (mouseX >= racketWidth / 2 && mouseX <= canvasWidth - racketWidth / 2) {
        setRacketPosition(mouseX);
      }
    }
  };
  
  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const gameLoop = () => {
      // Update ball position
      setBallPosition(prev => ({
        x: prev.x + ballDirection.x,
        y: prev.y + ballDirection.y
      }));
      
      // Check for collisions with the canvas boundaries
      if (ballPosition.x <= 10 || ballPosition.x >= canvasWidth - 10) {
        setBallDirection(prev => ({ ...prev, x: -prev.x }));
      }
      
      // Ball hits the top wall
      if (ballPosition.y <= 10) {
        setBallDirection(prev => ({ ...prev, y: -prev.y }));
      }
      
      // Ball hits the racket
      if (
        ballPosition.y >= canvasHeight - racketHeight - 10 &&
        ballPosition.y <= canvasHeight - 10 &&
        ballPosition.x >= racketPosition - racketWidth / 2 &&
        ballPosition.x <= racketPosition + racketWidth / 2
      ) {
        setBallDirection(prev => ({ ...prev, y: -prev.y }));
        setScore(prev => prev + 1);
      }
      
      // Ball falls below the racket (game over)
      if (ballPosition.y >= canvasHeight) {
        setGameOver(true);
      }
    };
    
    const gameInterval = setInterval(gameLoop, 16); // ~60fps
    
    return () => {
      clearInterval(gameInterval);
    };
  }, [gameStarted, gameOver, ballPosition, ballDirection, racketPosition, canvasWidth, canvasHeight]);
  
  return (
    <div className="App">
      <h1>Squash Game</h1>
      <div className="game-stats">
        <p>Score: {score}</p>
      </div>
      
      {!gameStarted ? (
        <div className="game-menu">
          <h2>Welcome to Squash!</h2>
          <p>Move your mouse to control the racket and hit the ball against the walls.</p>
          <button onClick={startGame}>Start Game</button>
        </div>
      ) : gameOver ? (
        <div className="game-menu">
          <h2>Game Over!</h2>
          <p>Your final score: {score}</p>
          <button onClick={startGame}>Play Again</button>
        </div>
      ) : (
        <div 
          ref={canvasRef}
          className="game-canvas"
          style={{ width: canvasWidth, height: canvasHeight }}
          onMouseMove={handleMouseMove}
        >
          {/* Ball */}
          <div
            ref={ballRef}
            className="ball"
            style={{
              left: ballPosition.x - 10,
              top: ballPosition.y - 10,
            }}
          />
          
          {/* Racket */}
          <div
            ref={racketRef}
            className="racket"
            style={{
              left: racketPosition - racketWidth / 2,
              width: racketWidth,
              height: racketHeight,
            }}
          />
          
          {/* Front Wall */}
          <div className="front-wall" />
        </div>
      )}
      
      <div className="game-instructions">
        <h3>How to Play:</h3>
        <p>1. Move your mouse to control the racket</p>
        <p>2. Hit the ball to keep it in play</p>
        <p>3. Score points each time you hit the ball</p>
        <p>4. Don't let the ball pass your racket!</p>
      </div>
    </div>
  );
}

export default App;