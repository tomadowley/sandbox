import React, { useState, useRef, useEffect, useCallback } from 'react';
import './App.css';

/** Helper for responsive squash court dimensions */
function useCourtDimensions() {
  // Dynamically calculate based on viewport
  const [dims, setDims] = useState({ w: 360, h: 560 });
  useEffect(() => {
    function updateDims() {
      // 9:14 ratio, up to 90vw wide, up to 860px or 70vw tall
      let vw = Math.min(window.innerWidth, 540);
      let vh = Math.min(window.innerHeight - 48, 850); // allow for mobile bar
      let width = Math.min(vw * 0.9, 540);
      let height = Math.min(vh * 0.85, width * 14 / 9);
      if (height > 860) height = 860;
      setDims({ w: width, h: height });
    }
    updateDims();
    window.addEventListener('resize', updateDims);
    return () => window.removeEventListener('resize', updateDims);
  }, []);
  return dims;
}

function App() {
  const { w: canvasWidth, h: canvasHeight } = useCourtDimensions();

  // Racket parameters
  const racketWidth = canvasWidth * 0.28; // 28% court width
  const racketHeight = canvasHeight * 0.038;
  const racketY = canvasHeight - racketHeight * 2.1;

  // Ball parameters
  const ballRadius = Math.max(0.031 * canvasWidth, 15);

  // State hooks
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(() => Number(localStorage.getItem("bestScore") || 0));
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Racket and ball state
  const [racketX, setRacketX] = useState(canvasWidth / 2);
  const [ball, setBall] = useState({ x: canvasWidth/2, y: racketY-ballRadius*3.6, vx: 0, vy: 0, incoming: true, canHit: true });
  const [touching, setTouching] = useState(false);

  const canvasRef = useRef<HTMLDivElement>(null);

  // NEW: Reset on resize
  useEffect(() => {
    // Reset racket & ball position on resize
    setRacketX(canvasWidth / 2);
    setBall({
      x: canvasWidth/2,
      y: racketY-ballRadius*3.6,
      vx: 0,
      vy: 0,
      incoming: true,
      canHit: true
    });
  // eslint-disable-next-line
  }, [canvasWidth, canvasHeight]); 

  // Launch the game/ball
  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    // Always serve straight upward (randomly skewed), ensuring vy is negative (toward front wall)
    const minAngle = -Math.PI / 3; // -60deg from vertical up (left)
    const maxAngle = Math.PI / 3;  // +60deg from vertical up (right)
    const angle = Math.PI * 1.5 + (Math.random() * (maxAngle - minAngle) + minAngle); // PI*1.5 = vertical up
    const speed = Math.max(7, canvasHeight / 85);
    // Place ball well above racket, so it's clear of loss zone on first serve
    const launchY = Math.max(ballRadius * 2.5, racketY - ballRadius * 6);
    setBall({
      x: racketX,
      y: launchY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      incoming: false,
      canHit: false
    });
  };

  // === CONTROLS ===
  // Mouse
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left;
    x = Math.min(Math.max(x, racketWidth / 2), canvasWidth - racketWidth / 2);
    setRacketX(x);
  }, [canvasWidth, racketWidth]);
  // Touch
  const handleTouch = useCallback(
    (e: React.TouchEvent) => {
      if (!canvasRef.current) return;
      let x = e.touches[0].clientX - canvasRef.current.getBoundingClientRect().left;
      x = Math.min(Math.max(x, racketWidth / 2), canvasWidth - racketWidth / 2);
      setRacketX(x);
      setTouching(true);
    },
    [canvasWidth, racketWidth]
  );

  const handleTouchEnd = useCallback(() => setTouching(false), []);

  // Keyboard (left/right)
  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (!gameStarted || gameOver) return;
      if (e.key === "ArrowLeft" || e.key === "a") {
        setRacketX(x => Math.max(x - racketWidth / 4, racketWidth / 2));
      }
      if (e.key === "ArrowRight" || e.key === "d") {
        setRacketX(x => Math.min(x + racketWidth / 4, canvasWidth - racketWidth / 2));
      }
    }
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [gameStarted, gameOver, racketWidth, canvasWidth]);

  // === GAME LOOP (requestAnimationFrame) ===
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    let animationFrame: number;
    function step() {
      setBall(old => {
        let { x, y, vx, vy, incoming, canHit } = old;

        // Move
        let nextX = x + vx;
        let nextY = y + vy;

        // Bounce off left/right walls
        if (nextX - ballRadius <= 0) {
          nextX = ballRadius;
          vx = Math.abs(vx);
        } else if (nextX + ballRadius >= canvasWidth) {
          nextX = canvasWidth - ballRadius;
          vx = -Math.abs(vx);
        }

        // Bounce off front wall (top), change to "return" mode
        if (!incoming && nextY - ballRadius <= 0) {
          nextY = ballRadius;
          vy = Math.abs(vy) * 0.98; // slight energy loss
          incoming = true;
          canHit = true; // enable collision with racket again
        }
        // Bounce off floor (loss): missed
        if (nextY + ballRadius > canvasHeight) {
          setGameOver(true);
          if (score > bestScore) {
            setBestScore(score);
            localStorage.setItem("bestScore", String(score));
          }
          return { x, y, vx:0, vy:0, incoming: true, canHit: false };
        }
        // Racket collision when ball is returning (incoming toward player) and close to racket y
        let hit = false;
        if (
          incoming && canHit &&
          nextY + ballRadius >= racketY &&
          nextY - ballRadius <= racketY + racketHeight &&
          nextX + ballRadius >= racketX - racketWidth / 2 &&
          nextX - ballRadius <= racketX + racketWidth / 2
        ) {
          // Calculate hit angle: base vy up, vx based on strike position
          let rel = ((nextX - racketX) / (racketWidth/2));
          let angle = (Math.PI*1.48) - rel*0.6;
          let speed = Math.max(6.2, canvasHeight/93 + score * 0.04);
          vx = Math.cos(angle) * speed;
          vy = -Math.abs(Math.sin(angle)) * speed;
          nextY = racketY - ballRadius * 1.25;
          incoming = false;
          canHit = false; // prevent double-collision
          hit = true;
        }

        if (hit) setScore(s => s + 1);

        return { x: nextX, y: nextY, vx, vy, incoming, canHit };
      });
      animationFrame = requestAnimationFrame(step);
    }
    animationFrame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrame);
  }, [gameStarted, gameOver, canvasWidth, canvasHeight, racketY, racketWidth, ballRadius, score, bestScore, racketX]);

  // MENU: Resets ball/racket on game end/start
  useEffect(() => {
    if (!gameStarted) {
      setRacketX(canvasWidth / 2);
      setBall({
        x: canvasWidth/2,
        y: racketY-ballRadius*3.2,
        vx: 0,
        vy: 0,
        incoming: true,
        canHit: true
      });
    }
  }, [gameStarted, canvasWidth, canvasHeight, racketY, ballRadius]);

  // === RENDER ===

  return (
    <div className="App">
      <h1>Squash Game</h1>
      <div className="game-stats">
        <p>Score: {score}&nbsp;|&nbsp;Best: {bestScore}</p>
      </div>
      {!gameStarted ? (
        <div className="game-menu">
          <h2>Welcome to Squash!</h2>
          <p>
            {window.innerWidth < 600
              ? "Drag with your finger to move the racket and return the ball! "
              : "Move the racket left/right using your mouse, touch, or ←→ keys. Hit the ball against the front wall and return it."}
          </p>
          <button onClick={startGame}>Start Game</button>
          <p style={{ fontSize: "0.91em", marginTop: 14, opacity: 0.7 }}>
            {window.innerWidth > 700
              ? "Try playing on your phone—with one finger!"
              : "Pro Tip: Try with your thumb :)"}
          </p>
        </div>
      ) : gameOver ? (
        <div className="game-menu">
          <h2>Game Over!</h2>
          <p>Your final score: {score}</p>
          <p>Best this session: {bestScore}</p>
          <button onClick={() => setGameStarted(false)}>Play Again</button>
        </div>
      ) : (
        <div
          ref={canvasRef}
          className="game-canvas"
          style={{}}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouch}
          onTouchMove={handleTouch}
          onTouchEnd={handleTouchEnd}
        >
          {/* Ball */}
          <div
            className="ball"
            style={{
              left: ball.x - ballRadius,
              top: ball.y - ballRadius,
              width: ballRadius * 2,
              height: ballRadius * 2,
            }}
          />
          {/* Racket */}
          <div
            className="racket"
            style={{
              left: racketX - racketWidth / 2,
              width: racketWidth,
              height: racketHeight,
              bottom: 3 * canvasHeight / 140,
              boxShadow: touching ? "0 0 18px #9cf" : undefined,
              transition: touching ? "none" : "left 0.05s",
            }}
          />
          {/* Front wall highlight */}
          <div className="front-wall" />
        </div>
      )}
      <div className="game-instructions">
        <h3>How to Play:</h3>
        <p>1. Move the racket: drag with your finger (mobile), mouse, or use ←→ keys.</p>
        <p>2. Return the ball after it bounces off the front wall (top of the court).</p>
        <p>3. Score by returning the ball each time—more points for longer rallies!</p>
        <p>4. Don't let the ball pass your racket.</p>
      </div>
    </div>
  );
}

export default App;