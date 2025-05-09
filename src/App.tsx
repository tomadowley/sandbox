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

  // Control: track jump "buffer" to avoid repeat jumps while holding stick up
  const jumpRequested = useRef(false);
  const lastJoystickY = useRef(0);

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
      jumpRequested.current = false;
      lastJoystickY.current = 0;
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
      // Player movement via joystick
      let inputX = joystick.active ? joystick.dx : 0;
      // Deadzone for stick
      if (Math.abs(inputX) < 0.20) inputX = 0;
      playerVel.current.x = inputX * moveSpeed;

      // Jump only on joystick up "press" event (not hold)
      if (
        joystick.active &&
        joystick.dy < -0.5 &&
        lastJoystickY.current >= -0.5 &&
        onGround.current &&
        !jumpRequested.current
      ) {
        playerVel.current.y = -jumpSpeed - Math.abs(joystick.dy * 3);
        onGround.current = false;
        jumpRequested.current = true;
      }
      // Reset jump request when stick returns to neutral/down
      if (!(joystick.active && joystick.dy < -0.5)) {
        jumpRequested.current = false;
      }
      lastJoystickY.current = joystick.dy;

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

  // Handle joystick input
  function handleJoystickStart(e: React.TouchEvent | React.MouseEvent) {
    e.preventDefault();
    setJoystick((js) => ({ ...js, active: true }));
  }
  function handleJoystickMove(e: React.TouchEvent | React.MouseEvent) {
    e.preventDefault();
    let clientX: number, clientY: number;
    if ("touches" in e) {
      if (e.touches.length === 0) return;
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    // Joystick pad center
    const padX = rect.left + rect.width - JOYSTICK_PAD_RADIUS - 25;
    const padY = rect.top + rect.height - JOYSTICK_PAD_RADIUS - 25;
    const dx = clientX - padX;
    const dy = clientY - padY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    let normDx = dx / JOYSTICK_PAD_RADIUS;
    let normDy = dy / JOYSTICK_PAD_RADIUS;
    if (dist > JOYSTICK_PAD_RADIUS) {
      normDx *= JOYSTICK_PAD_RADIUS / dist;
      normDy *= JOYSTICK_PAD_RADIUS / dist;
    }
    setJoystick({
      active: true,
      dx: clamp(normDx, -1, 1),
      dy: clamp(normDy, -1, 1),
    });
  }
  function handleJoystickEnd(e: React.TouchEvent | React.MouseEvent) {
    e.preventDefault();
    setJoystick({ active: false, dx: 0, dy: 0 });
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

      {/* Joystick overlay */}
      <div
        className="JoystickPad"
        style={{
          position: "fixed",
          right: 25,
          bottom: 25,
          width: JOYSTICK_PAD_RADIUS * 2,
          height: JOYSTICK_PAD_RADIUS * 2,
          zIndex: 10,
          touchAction: "none",
          userSelect: "none",
        }}
        onTouchStart={handleJoystickStart}
        onTouchMove={handleJoystickMove}
        onTouchEnd={handleJoystickEnd}
        onMouseDown={handleJoystickStart}
        onMouseMove={(e) => joystick.active && handleJoystickMove(e)}
        onMouseUp={handleJoystickEnd}
        onMouseLeave={handleJoystickEnd}
      >
        {/* Outer pad */}
        <svg
          width={JOYSTICK_PAD_RADIUS * 2}
          height={JOYSTICK_PAD_RADIUS * 2}
          style={{ pointerEvents: "none", position: "absolute", left: 0, top: 0 }}
        >
          <circle
            cx={JOYSTICK_PAD_RADIUS}
            cy={JOYSTICK_PAD_RADIUS}
            r={JOYSTICK_PAD_RADIUS}
            fill="#444b"
          />
        </svg>
        {/* Inner stick */}
        {joystick.active && (
          <svg
            width={JOYSTICK_PAD_RADIUS * 2}
            height={JOYSTICK_PAD_RADIUS * 2}
            style={{
              pointerEvents: "none",
              position: "absolute",
              left: 0,
              top: 0,
            }}
          >
            <circle
              cx={
                JOYSTICK_PAD_RADIUS +
                joystick.dx * (JOYSTICK_PAD_RADIUS - JOYSTICK_RADIUS)
              }
              cy={
                JOYSTICK_PAD_RADIUS +
                joystick.dy * (JOYSTICK_PAD_RADIUS - JOYSTICK_RADIUS)
              }
              r={JOYSTICK_RADIUS}
              fill="#1e88e5"
              opacity={0.9}
            />
          </svg>
        )}
      </div>
    </div>
  );
}

export default App;
