import React, { useRef, useState, useEffect } from "react";
import "./App.css";

type BallState = "ready" | "falling" | "hit" | "missed" | "bowled";
type AnimState = "idle" | "swinging" | "hit" | "bowled" | "missed";

const OUTS_ALLOWED = 3;
const BALL_INTERVAL = 1200; // ms between balls
const BALL_FALL_SPEED = 900; // ms for ball to fall
const BALL_RADIUS = 18; // px, for collision
const BAT_WIDTH = 60; // px
const BAT_HEIGHT = 100; // px
const STUMP_WIDTH = 68; // px (for 3 stumps + bails)
const STUMP_HEIGHT = 80; // px
const PITCH_WIDTH = 380; // px
const PITCH_HEIGHT = 380; // px

function clamp(x: number, min: number, max: number) {
  return Math.max(min, Math.min(x, max));
}

function App() {
  // State
  const [score, setScore] = useState(0);
  const [outs, setOuts] = useState(0);
  const [ballState, setBallState] = useState<BallState>("ready");
  const [ballY, setBallY] = useState(0);
  // Ref for ballY to avoid stale closure in animation loop
  const ballYRef = useRef(0);
  const [ballX, setBallX] = useState(PITCH_WIDTH / 2);
  const [batSwinging, setBatSwinging] = useState(false);
  const [animState, setAnimState] = useState<AnimState>("idle");
  const [gameOver, setGameOver] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [ballKey, setBallKey] = useState(0); // rerender for new ball
  const [ballAngle, setBallAngle] = useState(0); // only for "hit" animation
  const [ballFly, setBallFly] = useState({ x: 0, y: 0 }); // for hit animation
  const [showBails, setShowBails] = useState(true);

  // Animation refs
  const animationFrame = useRef<number | null>(null);
  const ballStartTime = useRef<number>(0);
  const swingTime = useRef<number>(0);
  const hitRegistered = useRef<boolean>(false);

  // Responsive pitch sizing
  const [pitchSize, setPitchSize] = useState({
    w: PITCH_WIDTH,
    h: PITCH_HEIGHT,
    scale: 1,
  });

  // Responsive: update pitch size on window resize
  useEffect(() => {
    const update = () => {
      const maxW = Math.min(window.innerWidth * 0.94, 500);
      const maxH = Math.max(Math.min(window.innerHeight * 0.55, 500), 280);
      const scale = Math.min(maxW / PITCH_WIDTH, maxH / PITCH_HEIGHT, 1);
      setPitchSize({ w: PITCH_WIDTH * scale, h: PITCH_HEIGHT * scale, scale });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Ball falls vertically from random x near center
  const getRandomBallX = () => {
    // ±40px from center, avoid hitting wide
    return clamp(
      PITCH_WIDTH / 2 + (Math.random() - 0.5) * 80,
      PITCH_WIDTH / 2 - 70,
      PITCH_WIDTH / 2 + 70
    );
  };

  // Start/replay
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
    setBatSwinging(false);
    setAnimState("idle");
    setBallY(0);
    ballYRef.current = 0;
    setBallX(getRandomBallX());
    setBallAngle(0);
    setBallFly({ x: 0, y: 0 });
    setShowBails(true);
    setBallKey((k) => k + 1);
    hitRegistered.current = false;
  }

  // Animate ball falling: ensure animation starts when ballState becomes "falling"
useEffect(() => {
  if (gameOver || ballState !== "falling") return;

  ballStartTime.current = performance.now();

  function animate(now: number) {
    let elapsed = now - ballStartTime.current;
    let frac = clamp(elapsed / BALL_FALL_SPEED, 0, 1);
    const y = frac * (PITCH_HEIGHT - 58); // 58px above bottom for stumps
    ballYRef.current = y;
    setBallY(y);

    // If bat is swinging at right time and position, register hit
    if (
      batSwinging &&
      !hitRegistered.current &&
      frac > 0.78 &&
      frac < 0.94 &&
      Math.abs(ballX - PITCH_WIDTH / 2) < BAT_WIDTH * 0.58
    ) {
      registerHit();
      return;
    }

    if (frac < 1 && ballState === "falling") {
      animationFrame.current = requestAnimationFrame(animate);
    } else if (ballState === "falling") {
      // Reached bottom, check for collision with stumps!
      if (
        !hitRegistered.current &&
        Math.abs(ballX - PITCH_WIDTH / 2) < (STUMP_WIDTH / 2)
      ) {
        // Bowled out!
        setBallState("bowled");
        setAnimState("bowled");
        setShowBails(false);
        setTimeout(() => {
          setOuts((o) => {
            const newOuts = o + 1;
            if (newOuts >= OUTS_ALLOWED) setGameOver(true);
            return newOuts;
          });
          resetBall();
        }, 1400);
      } else {
        // Missed everything!
        setBallState("missed");
        setAnimState("missed");
        setTimeout(() => {
          resetBall();
        }, 800);
      }
    }
  }

  if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
  animationFrame.current = requestAnimationFrame(animate);

  return () => {
    if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
  };
  // eslint-disable-next-line
}, [ballState, gameOver, batSwinging, ballX]);

  // Clean up animation frame
  useEffect(() => {
    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    };
  }, []);

  // Handle swing (tap/click)
  const handleSwing = () => {
    if (gameOver || ballState !== "falling" || batSwinging) return;
    setBatSwinging(true);
    setAnimState("swinging");
    swingTime.current = performance.now();
    setTimeout(() => {
      setBatSwinging(false);
      // If no hit was registered during swing, and ball already passed bat, treat as miss
      if (!hitRegistered.current && ballYRef.current > PITCH_HEIGHT - 98) {
        setAnimState("missed");
      }
    }, 260);
  };

  // Register a hit
  const registerHit = () => {
    hitRegistered.current = true;
    setBallState("hit");
    setAnimState("hit");
    // Animate ball flying off at an angle (randomized left/right)
    const angle = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 36 + 20); // degrees
    setBallAngle(angle);
    setBallFly({ x: Math.cos((angle * Math.PI) / 180), y: -Math.sin((angle * Math.PI) / 180) });
    setScore((s) => s + Math.ceil(Math.random() * 6)); // Random runs: 1-6
    setTimeout(() => {
      resetBall();
    }, 1000);
  };

  // Animate hit ball (flying away)
  useEffect(() => {
    if (ballState !== "hit") return;
    let start: number | null = null;
    let x0 = ballX;
    let y0 = ballY;
    const animate = (now: number) => {
      if (!start) start = now;
      let t = (now - start) / 1000; // seconds
      // Ball flies away with some velocity
      const speed = pitchSize.scale * 370;
      const vx = ballFly.x * speed;
      const vy = ballFly.y * speed;
      setBallX(x0 + vx * t);
      setBallY(y0 + vy * t + 0.5 * 540 * t * t); // gravity
      if (t < 0.7) {
        animationFrame.current = requestAnimationFrame(animate);
      }
    };
    if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
    animationFrame.current = requestAnimationFrame(animate);
    // eslint-disable-next-line
  }, [ballState, ballFly, pitchSize.scale]);

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
  }, [gameOver, ballState, batSwinging]);

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
        <li>Time your swing to hit the ball as it falls onto the <span className="bat-zone-highlight">bat zone</span> in front of the stumps.</li>
        <li>If you miss and the ball hits the stumps, you're bowled out!</li>
        <li>Each hit scores runs. 3 outs and it's game over. Try to set a high score!</li>
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

  // SVG Bat
  const BatSVG = (
    <g>
      {/* Handle */}
      <rect x={18} y={12} width={10} height={48} rx={5} fill="#d4af37" stroke="#b1942e" strokeWidth="2"/>
      {/* Blade */}
      <rect x={12} y={58} width={22} height={36} rx={8} fill="#ffe4b2" stroke="#b1942e" strokeWidth="2"/>
      {/* Grip */}
      <rect x={17.5} y={2} width={13} height={16} rx={4} fill="#555" />
    </g>
  );

  // SVG Stumps
  const StumpsSVG = (
    <g>
      {/* Three stumps */}
      <rect x={8} y={10} width={8} height={STUMP_HEIGHT} rx={3} fill="#f4e2ba" stroke="#b1942e" strokeWidth="1.5"/>
      <rect x={22} y={10} width={8} height={STUMP_HEIGHT} rx={3} fill="#f4e2ba" stroke="#b1942e" strokeWidth="1.5"/>
      <rect x={36} y={10} width={8} height={STUMP_HEIGHT} rx={3} fill="#f4e2ba" stroke="#b1942e" strokeWidth="1.5"/>
      {/* Bails */}
      {showBails && <rect x={8} y={6} width={16} height={5} rx={2.5} fill="#fff6d5" stroke="#b1942e" strokeWidth="1"/>}
      {showBails && <rect x={28} y={6} width={16} height={5} rx={2.5} fill="#fff6d5" stroke="#b1942e" strokeWidth="1"/>}
      {/* Flying bails animation */}
      {!showBails && (
        <>
          <rect x={4} y={2} width={16} height={5} rx={2.5} fill="#fff6d5" stroke="#b1942e" strokeWidth="1"
            style={{transform: "rotate(-19deg)", transformOrigin: "12px 4.5px"}}
          />
          <rect x={38} y={-7} width={16} height={5} rx={2.5} fill="#fff6d5" stroke="#b1942e" strokeWidth="1"
            style={{transform: "rotate(23deg)", transformOrigin: "46px 0.5px"}}
          />
        </>
      )}
    </g>
  );

  // SVG Ball
  const BallSVG = (
    <svg
      className="ball"
      style={{
        position: "absolute",
        left: (ballX * pitchSize.scale - 0.5 * BALL_RADIUS * pitchSize.scale),
        top: (ballY * pitchSize.scale - BALL_RADIUS * 0.5 * pitchSize.scale),
        zIndex: 8,
        pointerEvents: "none",
        transition: ballState === "hit" ? "none" : "top 0.05s, left 0.05s",
        width: BALL_RADIUS * pitchSize.scale * 1.18,
        height: BALL_RADIUS * pitchSize.scale * 1.18,
      }}
      width={BALL_RADIUS * 1.2}
      height={BALL_RADIUS * 1.2}
      viewBox="0 0 36 36"
    >
      <circle
        cx="18"
        cy="18"
        r="16"
        fill={ballState === "hit" ? "#4CAF50" : ballState === "missed" ? "#F44336" : "#f44336"}
        stroke="#fff"
        strokeWidth="2.2"
      />
      {/* seam lines */}
      <rect x="16" y="5" width="4" height="25" fill="#fff" opacity="0.13" rx="1.6"/>
    </svg>
  );

  // Bat zone rectangle (for user cue)
  const batZonePx = 74 * pitchSize.scale;
  const batZoneHeight = 56 * pitchSize.scale;
  const batZoneY = pitchSize.h - STUMP_HEIGHT * pitchSize.scale - batZoneHeight + 8 * pitchSize.scale;
  const batZoneX = pitchSize.w / 2 - (batZonePx / 2);

  // Main pitch area
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
            style={{
              width: pitchSize.w,
              height: pitchSize.h,
              maxWidth: 500,
              maxHeight: 500,
              minHeight: 230,
            }}
            onClick={handlePitchClick}
            onTouchStart={handlePitchClick}
            aria-label="Pitch area, tap to swing"
          >
            {/* Pitch BG stripes */}
            <div className="pitch-bg" />
            {/* Bat zone */}
            <div
              className="bat-zone"
              style={{
                left: batZoneX,
                width: batZonePx,
                top: batZoneY,
                height: batZoneHeight,
                borderRadius: "16px",
                background: animState === "swinging" && batSwinging ? "rgba(255,220,40,0.22)" : "rgba(255,255,0,0.13)",
                border: animState === "swinging" && batSwinging ? "2.4px solid #ffeb3b" : undefined,
                borderLeft: "2px dashed #fff8",
                borderRight: "2px dashed #fff8",
                zIndex: 2,
                pointerEvents: "none",
                transition: "background 0.19s, border 0.13s"
              }}
            ></div>
            {/* Render ball */}
            {(ballState === "falling" || ballState === "hit" || ballState === "missed" || ballState === "bowled") && BallSVG}
            {/* Render stumps at bottom center */}
            <svg
              style={{
                position: "absolute",
                left: pitchSize.w / 2 - STUMP_WIDTH / 2 * pitchSize.scale,
                top: pitchSize.h - (STUMP_HEIGHT + 16) * pitchSize.scale,
                width: STUMP_WIDTH * pitchSize.scale,
                height: (STUMP_HEIGHT + 28) * pitchSize.scale,
                zIndex: 3,
                pointerEvents: "none",
              }}
              width={STUMP_WIDTH}
              height={STUMP_HEIGHT + 28}
              viewBox="0 0 52 112"
            >
              {/* Stumps */}
              <g
                style={{
                  transition: "all 0.35s cubic-bezier(.58,2,.31,1.1)",
                  opacity: ballState === "bowled" ? 0.81 : 1,
                  filter: ballState === "bowled" ? "drop-shadow(0 -6px 8px #ffcda7)" : undefined,
                  transform: ballState === "bowled" ? "skewX(-7deg) translateY(7px)" : undefined,
                }}
              >
                {StumpsSVG}
              </g>
            </svg>
            {/* Render bat as a separate absolutely positioned SVG above the stumps */}
            <svg
              style={{
                position: "absolute",
                left: pitchSize.w / 2 - 27 * pitchSize.scale, // 27 centers the bat
                top: pitchSize.h - (BAT_HEIGHT + 10) * pitchSize.scale, // Lower than stumps for visual overlap
                width: 56 * pitchSize.scale,
                height: BAT_HEIGHT * pitchSize.scale,
                zIndex: 9, // Above stumps
                pointerEvents: "none",
                overflow: "visible",
              }}
              width={56}
              height={BAT_HEIGHT}
              viewBox="0 0 56 100"
            >
              <g
                style={{
                  transform: batSwinging
                    ? "rotate(-32deg) translate(-6px,-26px) scaleX(1.06)"
                    : "rotate(-1deg) translate(0,0)",
                  transformOrigin: "center 85px",
                  transition: "transform 0.17s cubic-bezier(.42,2,.58,1)",
                  filter: batSwinging
                    ? "drop-shadow(0 2px 9px #ffe44c7a)"
                    : "drop-shadow(0 1px 4px #2229)",
                }}
              >
                {BatSVG}
              </g>
            </svg>
            {/* Hit/miss/bowled text/animations */}
            {animState === "hit" && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "37%",
                  transform: "translate(-50%,-50%) scale(1.13)",
                  color: "#39e949",
                  fontSize: "2em",
                  textShadow: "0 1px 16px #fff9, 0 2px 10px #3e9",
                  zIndex: 21,
                  pointerEvents: "none",
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  opacity: 1,
                  transition: "opacity 0.22s"
                }}
              >
                🎉 Hit!
              </div>
            )}
            {animState === "missed" && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "43%",
                  transform: "translate(-50%,-50%) scale(1.11)",
                  color: "#F44336",
                  fontSize: "2em",
                  textShadow: "0 1px 11px #fff7, 0 2px 10px #f33",
                  zIndex: 21,
                  pointerEvents: "none",
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  opacity: 1,
                  transition: "opacity 0.21s"
                }}
              >
                Missed
              </div>
            )}
            {animState === "bowled" && (
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "38%",
                  transform: "translate(-50%,-50%) scale(1.11)",
                  color: "#b12c2c",
                  fontSize: "2em",
                  textShadow: "0 1px 10px #fff7, 0 2px 10px #f33",
                  zIndex: 23,
                  pointerEvents: "none",
                  fontWeight: 800,
                  letterSpacing: "0.06em",
                  opacity: 1,
                  transition: "opacity 0.21s"
                }}
              >
                Bowled!
              </div>
            )}
          </div>
          <button className="swing-btn" onClick={handleSwing} tabIndex={0} style={{marginTop: "0.3em"}}>
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