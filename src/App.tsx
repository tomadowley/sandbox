import React, { useRef, useState, useEffect } from "react";
import "./App.css";

type BallState = "ready" | "flying" | "hit" | "missed";

const OUTS_ALLOWED = 3;
const BALL_INTERVAL = 1400; // ms between balls
const BALL_SPEED = 700; // ms to cross the pitch

const getRandomY = () =>
  45 + Math.floor(Math.random() * 10); // Ball vertical position (vh)

function App() {
  const [score, setScore] = useState(0);
  const [outs, setOuts] = useState(0);
  const [ballState, setBallState] = useState<BallState>("ready");
  const [ballX, setBallX] = useState(0); // % left
  const [ballY, setBallY] = useState(getRandomY());
  const [showSwing, setShowSwing] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [ballKey, setBallKey] = useState(0); // rerender for new ball

  // Refs for animation and state tracking
  const animationFrame = useRef<number | null>(null);
  const ballStartTime = useRef<number>(0);
  const ballStateRef = useRef<BallState>(ballState);
  const ballXRef = useRef<number>(ballX);
  const hitWindow = 0.17; // fraction of pitch where bat can hit

  // Responsive: Bat position and size (fixed to right side for mobile)
  const batZoneLeft = 68; // %
  const batZoneWidth = 14; // %

  // Keep ballStateRef and ballXRef in sync with state
  useEffect(() => {
    ballStateRef.current = ballState;
  }, [ballState]);
  useEffect(() => {
    ballXRef.current = ballX;
  }, [ballX]);

  // Start game or replay
  const startGame = () => {
    setScore(0);
    setOuts(0);
    setGameOver(false);
    setShowInstructions(false);
    resetBall();
  };

  // Reset ball for next delivery
  function resetBall() {
    setBallState("ready");
    setBallX(0);
    setBallY(getRandomY());
    setShowSwing(false);
    setBallKey((k) => k + 1);
  }

  // Animate ball when ready and not game over
  useEffect(() => {
    if (gameOver || ballState !== "ready") return;
    let timeout = setTimeout(() => {
      setBallState("flying");
      ballStateRef.current = "flying";
      ballStartTime.current = performance.now();
      animateBall();
    }, 500);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line
  }, [ballState, gameOver, outs, score, ballKey]);

  // Ball animation
  const animateBall = () => {
    const animate = (now: number) => {
      let elapsed = now - ballStartTime.current;
      let frac = Math.min(1, elapsed / BALL_SPEED);
      const ballXVal = frac * 90; // Ball travels from 0% to 90%
      setBallX(ballXVal);
      ballXRef.current = ballXVal;
      if (frac < 1 && ballStateRef.current === "flying") {
        animationFrame.current = requestAnimationFrame(animate);
      } else if (ballStateRef.current === "flying") {
        // Ball missed if not hit in time
        setBallState("missed");
        ballStateRef.current = "missed";
        setShowSwing(false);
        setTimeout(() => {
          setOuts((o) => {
            const newOuts = o + 1;
            if (newOuts >= OUTS_ALLOWED) setGameOver(true);
            return newOuts;
          });
          resetBall();
        }, 700);
      }
    };
    if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    animationFrame.current = requestAnimationFrame(animate);
  };

  // Clean up animation frame
  useEffect(() => {
    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, []);

  // Handle swing (tap/click)
  const handleSwing = () => {
    if (gameOver || ballStateRef.current !== "flying") return;
    setShowSwing(true);
    // Check if ball is in the bat zone
    const frac = ballXRef.current / 90;
    const batZoneFracLeft = batZoneLeft / 100;
    const batZoneFracRight = (batZoneLeft + batZoneWidth) / 100;
    if (frac >= batZoneFracLeft && frac <= batZoneFracRight) {
      // Hit!
      setBallState("hit");
      ballStateRef.current = "hit";
      setScore((s) => s + Math.ceil(Math.random() * 6)); // Random runs: 1-6
      setTimeout(() => {
        resetBall();
      }, 500);
    } else {
      // Missed
      setBallState("missed");
      ballStateRef.current = "missed";
      setShowSwing(false);
      setTimeout(() => {
        setOuts((o) => {
          const newOuts = o + 1;
          if (newOuts >= OUTS_ALLOWED) setGameOver(true);
          return newOuts;
        });
        resetBall();
      }, 700);
    }
  };

  // Keyboard (spacebar) for accessibility
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        handleSwing();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line
  }, [gameOver]);

  // Touch/click on pitch or "Swing!" button triggers swing
  const handlePitchClick = () => {
    handleSwing();
  };

  // Game instructions
  const instructions = (
    <div className="instructions">
      <h1>🏏 Cricket Minigame</h1>
      <ul>
        <li>Tap anywhere on the pitch or press <b>Swing!</b> to swing the bat.</li>
        <li>Time your swing to hit the ball as it enters the <span className="bat-zone-highlight">bat zone</span> (right side of the screen).</li>
        <li>Each hit scores runs. Missing counts as an out.</li>
        <li>3 outs and it's game over. Try to set a high score!</li>
      </ul>
      <button className="start-btn" onClick={startGame}>Start Game</button>
    </div>
  );

  // Game over/replay screen
  const replayScreen = (
    <div className="gameover">
      <h2>Game Over!</h2>
      <div className="finalscore">🏏 Score: {score}</div>
      <div className="finalouts">❌ Outs: {outs}</div>
      <button className="start-btn" onClick={startGame}>Play Again</button>
    </div>
  );

  // Game pitch with SVG ball, bat, and pitch
  return (
    <div className="game-outer">
      {showInstructions ? (
        instructions
      ) : (
        <div className="game-main">
          <header className="game-header">
            <div className="score">
              <span role="img" aria-label="score">🏏</span> {score}
            </div>
            <div className="outs">
              <span role="img" aria-label="outs">❌</span> {outs} / {OUTS_ALLOWED}
            </div>
          </header>
          <div
            className="pitch-area"
            tabIndex={0}
            onClick={handlePitchClick}
            onTouchStart={handlePitchClick}
            aria-label="Pitch area, tap to swing"
          >
            {/* Bat zone highlight */}
            <div
              className="bat-zone"
              style={{
                left: `${batZoneLeft}%`,
                width: `${batZoneWidth}%`,
              }}
            ></div>
            {/* Ball */}
            {(ballState === "flying" || ballState === "hit" || ballState === "missed") && (
              <svg
                className="ball"
                style={{
                  left: `calc(${ballX}% - 2vw)`,
                  top: `${ballY}vh`,
                }}
                width="6vw"
                height="6vw"
                viewBox="0 0 60 60"
              >
                <circle
                  cx="30"
                  cy="30"
                  r="28"
                  fill={ballState === "hit" ? "#4CAF50" : ballState === "missed" ? "#F44336" : "#f44336"}
                  stroke="#fff"
                  strokeWidth="3"
                />
                {/* seam lines */}
                <rect x="27" y="10" width="6" height="40" fill="#fff" opacity="0.2" rx="2"/>
              </svg>
            )}
            {/* Bat */}
            <svg
              className={`bat${showSwing ? " swinging" : ""}`}
              style={{
                left: `calc(${batZoneLeft + batZoneWidth / 2}% - 4vw)`,
                top: "70vh",
              }}
              width="8vw"
              height="18vw"
              viewBox="0 0 40 90"
            >
              <rect x="16" y="10" width="8" height="60" rx="5" fill="#d4af37" stroke="#b1942e" strokeWidth="2"/>
              <rect x="14" y="70" width="12" height="18" rx="4" fill="#555" />
            </svg>
            {/* Pitch background */}
            <div className="pitch-bg" />
          </div>
          <button className="swing-btn" onClick={handleSwing} tabIndex={0}>
            Swing!
          </button>
          {gameOver && replayScreen}
        </div>
      )}
      <footer className="footer-info">
        <span>Mobile Cricket Minigame &copy; {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}

export default App;