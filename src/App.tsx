import React, { useRef, useEffect, useState } from "react";
import "./App.css";

// Helper: clamp value between min and max
const clamp = (val: number, min: number, max: number) =>
  Math.max(min, Math.min(max, val));

// Player, pint, and chaser types
type Vec2 = { x: number; y: number };
type Rect = { x: number; y: number; w: number; h: number };

const GAME_WIDTH = 400; // Logical width for scaling (mobile friendly)
const GAME_HEIGHT = 700; // Logical height

// Mobile joystick size and position
const JOYSTICK_RADIUS = 50;
const JOYSTICK_PAD_RADIUS = 80;

function getRandomPos(): Vec2 {
  // Avoid edges for pints
  return {
    x: Math.random() * (GAME_WIDTH - 40) + 20,
    y: Math.random() * (GAME_HEIGHT - 120) + 60,
  };
}

// Character assets (placeholder colors for now; can be replaced with sprites)
const JakeColor = "#1e88e5";
const JakeTall = 64;
const JakeWidth = 26;
const EleColor = "#e53935";
const EleTall = 62;
const EleWidth = 28;
const PintColor = "#ffd600";

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Game state
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(
    Number(localStorage.getItem("jake_highscore") || 0)
  );
  const [gameOver, setGameOver] = useState(false);

  // Joystick state
  const [joystick, setJoystick] = useState<{ active: boolean; dx: number; dy: number }>({
    active: false, dx: 0, dy: 0,
  });

  // Internal game objects (not in React state for perf)
  const player = useRef<Rect>({
    x: GAME_WIDTH / 2 - JakeWidth / 2,
    y: GAME_HEIGHT - JakeTall - 30,
    w: JakeWidth,
    h: JakeTall,
  });
  const playerVel = useRef<Vec2>({ x: 0, y: 0 });
  const onGround = useRef(true);

  const pints = useRef<Rect[]>([
    { x: 100, y: 500, w: 16, h: 24 },
    { x: 300, y: 250, w: 16, h: 24 },
  ]);
  const ele = useRef<Rect>({
    x: 40,
    y: GAME_HEIGHT - EleTall - 30,
    w: EleWidth,
    h: EleTall,
  });

  // Physics
  const gravity = 0.6;
  const moveSpeed = 3.5;
  const jumpSpeed = 10;

  // Platforms
  const platforms: Rect[] = [
    // Floor
    { x: 0, y: GAME_HEIGHT - 20, w: GAME_WIDTH, h: 20 },
    // Floating
    { x: 40, y: 610, w: 140, h: 14 },
    { x: 200, y: 480, w: 180, h: 14 },
    { x: 80, y: 340, w: 200, h: 14 },
    { x: 120, y: 210, w: 170, h: 14 },
  ];

  // Control: Track button-press state for each direction
  const [controls, setControls] = useState<{left: boolean; right: boolean; up: boolean; down: boolean}>({
    left: false, right: false, up: false, down: false
  });
  // Prevent repeated jumps on hold
  const jumpBuffer = useRef(false);

  // Game loop
  useEffect(() => {
    let anim: number;
    let lastTime: number | null = null;

    function resetGame() {
      setScore(0);
      setGameOver(false);
      player.current.x = GAME_WIDTH / 2 - JakeWidth / 2;
      player.current.y = GAME_HEIGHT - JakeTall - 30;
      playerVel.current.x = 0;
      playerVel.current.y = 0;
      onGround.current = true;
      ele.current.x = 40;
      ele.current.y = GAME_HEIGHT - EleTall - 30;
      pints.current = [
        { x: 100, y: 500, w: 16, h: 24 },
        { x: 300, y: 250, w: 16, h: 24 },
      ];
      jumpBuffer.current = false;
    }

    function spawnPint() {
      // Add new pint in random spot
      pints.current.push({ x: getRandomPos().x, y: getRandomPos().y, w: 16, h: 24 });
    }

    function checkCollision(a: Rect, b: Rect) {
      return (
        a.x < b.x + b.w &&
        a.x + a.w > b.x &&
        a.y < b.y + b.h &&
        a.y + a.h > b.y
      );
    }

    function gameStep(dt: number) {
      // Player movement via buttons
      let inputX = 0;
      if (controls.left) inputX -= 1;
      if (controls.right) inputX += 1;
      playerVel.current.x = inputX * moveSpeed;

      // Jump only when up is pressed and not repeating
      if (controls.up && onGround.current && !jumpBuffer.current) {
        playerVel.current.y = -jumpSpeed;
        onGround.current = false;
        jumpBuffer.current = true;
      }
      if (!controls.up) {
        jumpBuffer.current = false;
      }

      // (Optional: allow down to drop faster if desired)
      if (controls.down && !onGround.current) {
        playerVel.current.y += gravity * 0.7;
      }

      // Apply gravity
      playerVel.current.y += gravity;

      // Move player
      player.current.x += playerVel.current.x;
      player.current.y += playerVel.current.y;

      // Clamp to game area
      player.current.x = clamp(player.current.x, 0, GAME_WIDTH - player.current.w);
      if (player.current.y > GAME_HEIGHT - player.current.h) {
        player.current.y = GAME_HEIGHT - player.current.h;
        playerVel.current.y = 0;
        onGround.current = true;
      }

      // Platform collisions
      let landed = false;
      for (const plat of platforms) {
        // Only check if falling
        if (
          playerVel.current.y >= 0 &&
          player.current.x + player.current.w > plat.x &&
          player.current.x < plat.x + plat.w
        ) {
          // Is player landing on this platform?
          const feet = player.current.y + player.current.h;
          if (
            feet > plat.y &&
            feet - playerVel.current.y <= plat.y + 1 // Only land if coming from above
          ) {
            player.current.y = plat.y - player.current.h;
            playerVel.current.y = 0;
            landed = true;
            onGround.current = true;
          }
        }
      }
      if (!landed && player.current.y + player.current.h < GAME_HEIGHT - 1) {
        onGround.current = false;
      }

      // Pint collisions
      pints.current = pints.current.filter((pint) => {
        if (checkCollision(player.current, pint)) {
          setScore((s) => s + 1);
          spawnPint();
          return false;
        }
        return true;
      });

      // Ele chases Jake
      // Simple AI: move toward player horizontally, jump if player is higher
      if (ele.current.x < player.current.x) ele.current.x += 1.5;
      else if (ele.current.x > player.current.x) ele.current.x -= 1.5;
      if (
        player.current.y + player.current.h < ele.current.y &&
        Math.random() < 0.02
      ) {
        ele.current.y -= 18; // Hop up occasionally if Jake is above
      }

      // Ele gravity
      if (ele.current.y < GAME_HEIGHT - EleTall - 30) ele.current.y += gravity * 2;
      if (ele.current.y > GAME_HEIGHT - EleTall - 30)
        ele.current.y = GAME_HEIGHT - EleTall - 30;

      // Game over if Ele catches Jake
      if (checkCollision(player.current, ele.current)) {
        setGameOver(true);
        if (score > highScore) {
          setHighScore(score);
          localStorage.setItem("jake_highscore", String(score));
        }
      }
    }

    function draw(ctx: CanvasRenderingContext2D) {
      // Clear
      ctx.fillStyle = "#23272b";
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

      // Draw platforms
      ctx.fillStyle = "#484848";
      for (const plat of platforms) {
        ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
      }

      // Draw pints
      for (const pint of pints.current) {
        ctx.save();
        ctx.fillStyle = PintColor;
        ctx.beginPath();
        ctx.ellipse(
          pint.x + pint.w / 2,
          pint.y + pint.h / 2,
          pint.w / 2,
          pint.h / 2,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();
        // Cartoon foam on top
        ctx.fillStyle = "#fffde7";
        ctx.beginPath();
        ctx.ellipse(
          pint.x + pint.w / 2,
          pint.y + 2,
          pint.w / 2.5,
          3,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();
        ctx.restore();
      }

      // Jake: Tall body, blue
      ctx.save();
      ctx.fillStyle = JakeColor;
      ctx.fillRect(player.current.x, player.current.y, player.current.w, player.current.h);
      // Funny face (smile & eyes)
      ctx.fillStyle = "#fff";
      ctx.fillRect(player.current.x + 6, player.current.y + 12, 5, 5);
      ctx.fillRect(player.current.x + 15, player.current.y + 12, 5, 5);
      ctx.strokeStyle = "#000";
      ctx.beginPath();
      ctx.arc(
        player.current.x + player.current.w / 2,
        player.current.y + 34,
        7,
        0,
        Math.PI,
        false
      );
      ctx.stroke();
      ctx.restore();

      // Ele: Red, chasing
      ctx.save();
      ctx.fillStyle = EleColor;
      ctx.fillRect(ele.current.x, ele.current.y, ele.current.w, ele.current.h);
      // Angry eyebrows
      ctx.strokeStyle = "#000";
      ctx.beginPath();
      ctx.moveTo(ele.current.x + 7, ele.current.y + 13);
      ctx.lineTo(ele.current.x + 11, ele.current.y + 10);
      ctx.moveTo(ele.current.x + 17, ele.current.y + 10);
      ctx.lineTo(ele.current.x + 21, ele.current.y + 13);
      ctx.stroke();
      ctx.restore();

      // Score
      ctx.font = "bold 30px sans-serif";
      ctx.fillStyle = "#fff";
      ctx.fillText(`Pints: ${score}`, 18, 38);

      ctx.font = "16px sans-serif";
      ctx.fillStyle = "#aaa";
      ctx.fillText(`High Score: ${highScore}`, 18, 58);

      // Game over overlay
      if (gameOver) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        ctx.font = "38px sans-serif";
        ctx.fillStyle = "#fff";
        ctx.fillText("Caught by Ele!", 65, 320);
        ctx.font = "20px sans-serif";
        ctx.fillText("Tap to play again", 115, 360);
      }
    }

    function frame(time: number) {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext("2d");
      if (!ctx) return;

      // Handle time-based updates
      if (lastTime !== null && !gameOver) {
        const dt = Math.min((time - lastTime) / 16.67, 2); // ~60fps
        gameStep(dt);
      }
      lastTime = time;

      draw(ctx);
      anim = requestAnimationFrame(frame);
    }

    resetGame();
    anim = requestAnimationFrame(frame);

    // Tap to restart
    function handleRestart(e: MouseEvent | TouchEvent) {
      if (gameOver) {
        resetGame();
        lastTime = null;
      }
    }
    window.addEventListener("mousedown", handleRestart);
    window.addEventListener("touchstart", handleRestart);

    return () => {
      cancelAnimationFrame(anim);
      window.removeEventListener("mousedown", handleRestart);
      window.removeEventListener("touchstart", handleRestart);
    };
    // eslint-disable-next-line
  }, [gameOver, highScore]);

  // Button controls for mobile/desktop
  function handleControl(direction: "left" | "right" | "up" | "down", pressed: boolean) {
    setControls((prev) => ({ ...prev, [direction]: pressed }));
  }

  // Responsive canvas: fullscreen, mobile-first
  useEffect(() => {
    function resizeCanvas() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      // Fit screen, maintain aspect ratio
      const w = window.innerWidth;
      const h = window.innerHeight;
      let scale = Math.min(w / GAME_WIDTH, h / GAME_HEIGHT);
      canvas.style.width = `${GAME_WIDTH * scale}px`;
      canvas.style.height = `${GAME_HEIGHT * scale}px`;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  // Render
  return (
    <div
      className="GameRoot"
      style={{
        position: "fixed",
        inset: 0,
        background: "#23272b",
        touchAction: "none",
        overflow: "hidden",
      }}
    >
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        style={{
          display: "block",
          margin: "0 auto",
          background: "#23272b",
          border: "2px solid #333",
          borderRadius: 12,
          boxShadow: "0 0 40px #000d",
          touchAction: "none",
        }}
        tabIndex={0}
      />

      {/* Directional button controls */}
      <div
        className="ControlsPad"
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 10,
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-end",
          zIndex: 10,
          gap: 24,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        {/* Left/Right/Up/Down Buttons */}
        <div style={{
          display: "flex",
          flexDirection: "row",
          gap: 24,
          pointerEvents: "auto"
        }}>
          {/* Left */}
          <button
            className="ControlBtn"
            style={buttonStyle}
            onTouchStart={e => (e.preventDefault(), handleControl("left", true))}
            onTouchEnd={e => (e.preventDefault(), handleControl("left", false))}
            onMouseDown={e => (e.preventDefault(), handleControl("left", true))}
            onMouseUp={e => (e.preventDefault(), handleControl("left", false))}
            onMouseLeave={e => handleControl("left", false)}
            aria-label="Left"
          >
            &#8592;
          </button>
          {/* Down */}
          <button
            className="ControlBtn"
            style={buttonStyle}
            onTouchStart={e => (e.preventDefault(), handleControl("down", true))}
            onTouchEnd={e => (e.preventDefault(), handleControl("down", false))}
            onMouseDown={e => (e.preventDefault(), handleControl("down", true))}
            onMouseUp={e => (e.preventDefault(), handleControl("down", false))}
            onMouseLeave={e => handleControl("down", false)}
            aria-label="Down"
          >
            &#8595;
          </button>
          {/* Up */}
          <button
            className="ControlBtn"
            style={buttonStyle}
            onTouchStart={e => (e.preventDefault(), handleControl("up", true))}
            onTouchEnd={e => (e.preventDefault(), handleControl("up", false))}
            onMouseDown={e => (e.preventDefault(), handleControl("up", true))}
            onMouseUp={e => (e.preventDefault(), handleControl("up", false))}
            onMouseLeave={e => handleControl("up", false)}
            aria-label="Up"
          >
            &#8593;
          </button>
          {/* Right */}
          <button
            className="ControlBtn"
            style={buttonStyle}
            onTouchStart={e => (e.preventDefault(), handleControl("right", true))}
            onTouchEnd={e => (e.preventDefault(), handleControl("right", false))}
            onMouseDown={e => (e.preventDefault(), handleControl("right", true))}
            onMouseUp={e => (e.preventDefault(), handleControl("right", false))}
            onMouseLeave={e => handleControl("right", false)}
            aria-label="Right"
          >
            &#8594;
          </button>
        </div>
      </div>
    </div>
  );
}

// Mobile-friendly button style
const buttonStyle: React.CSSProperties = {
  width: 64,
  height: 64,
  borderRadius: "50%",
  background: "#222",
  color: "#fff",
  fontSize: 34,
  border: "2px solid #1e88e5",
  margin: 0,
  outline: "none",
  boxShadow: "0 2px 8px #0005",
  touchAction: "none",
  userSelect: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: "bold",
};

export default App;
