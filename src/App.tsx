import React, { useRef, useEffect, useState } from "react";
import "./App.css";

// --- Game Constants ---
const GAME_WIDTH = 480;
const GAME_HEIGHT = 800;
const PLAYER_WIDTH = 48;
const PLAYER_HEIGHT = 48;
const PLAYER_SPEED = 5;
const JUMP_VY = -12;
const GRAVITY = 0.6;
const GROUND_Y = GAME_HEIGHT - 80;

const ENEMY_WIDTH = 48;
const ENEMY_HEIGHT = 48;
const ENEMY_SPEED = 3;

const SALAD_SIZE = 32;

// --- Helper functions ---
function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- Assets (simple emoji for demo) ---
const NIA_EMOJI = "🧑‍🦱"; // Nia
const MAX_EMOJI = "👾"; // Max
const SALAD_EMOJI = "🥗";

// --- Main Game Component ---
const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // For responsive scaling
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
    scale: 1,
  });

  // Game State
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  // Touch/Keyboard Controls
  const controls = useRef({
    left: false,
    right: false,
    jump: false,
  });

  // --- Game Objects ---
  const gameState = useRef({
    player: {
      x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2,
      y: GROUND_Y - PLAYER_HEIGHT,
      vx: 0,
      vy: 0,
      onGround: true,
    },
    enemy: {
      x: GAME_WIDTH / 4,
      y: GROUND_Y - ENEMY_HEIGHT,
      vx: 0,
      vy: 0,
    },
    salad: {
      x: getRandomInt(32, GAME_WIDTH - 32 - SALAD_SIZE),
      y: GROUND_Y - SALAD_SIZE,
    },
    started: false,
    initialized: false,
  });

  // --- Handle Window Resize for mobile-first scaling ---
  useEffect(() => {
    function handleResize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Scale to fit and preserve aspect ratio
      const scale = Math.min(w / GAME_WIDTH, h / GAME_HEIGHT);
      setDimensions({ width: w, height: h, scale });
    }
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Touch Controls ---
  function handleTouchStart(dir: "left" | "right" | "jump") {
    controls.current[dir] = true;
  }
  function handleTouchEnd(dir: "left" | "right" | "jump") {
    controls.current[dir] = false;
  }

  // --- Keyboard Controls (for desktop fallback) ---
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft" || e.key === "a") controls.current.left = true;
      if (e.key === "ArrowRight" || e.key === "d") controls.current.right = true;
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w") controls.current.jump = true;
      if (gameOver && e.key === "Enter") restartGame();
    }
    function handleKeyUp(e: KeyboardEvent) {
      if (e.key === "ArrowLeft" || e.key === "a") controls.current.left = false;
      if (e.key === "ArrowRight" || e.key === "d") controls.current.right = false;
      if (e.key === " " || e.key === "ArrowUp" || e.key === "w") controls.current.jump = false;
    }
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
    // eslint-disable-next-line
  }, [gameOver]);

  // --- Game Loop ---
  useEffect(() => {
    let animationFrame: number;
    let lastTime = performance.now();

    function gameLoop(now: number) {
      const dt = Math.min((now - lastTime) / (1000 / 60), 2); // Max 2 frames
      lastTime = now;

      if (!gameOver && gameState.current.started) {
        update(dt);
      }
      render();
      animationFrame = requestAnimationFrame(gameLoop);
    }

    animationFrame = requestAnimationFrame(gameLoop);
    return () => cancelAnimationFrame(animationFrame);
    // eslint-disable-next-line
  }, [gameOver, dimensions.scale]);

  // --- Game Update Logic ---
  function update(dt: number) {
    const { player, enemy, salad } = gameState.current;

    // Player movement
    let vx = 0;
    if (controls.current.left) vx -= PLAYER_SPEED;
    if (controls.current.right) vx += PLAYER_SPEED;

    // Jump
    if (controls.current.jump && player.onGround) {
      player.vy = JUMP_VY;
      player.onGround = false;
    }
    controls.current.jump = false; // Prevent holding jump

    // Physics
    player.x += vx;
    player.vy += GRAVITY;
    player.y += player.vy;

    // Clamp to ground
    if (player.y + PLAYER_HEIGHT >= GROUND_Y) {
      player.y = GROUND_Y - PLAYER_HEIGHT;
      player.vy = 0;
      player.onGround = true;
    }
    // Clamp to walls
    player.x = clamp(player.x, 0, GAME_WIDTH - PLAYER_WIDTH);

    // Enemy movement: chases player
    if (player.x < enemy.x) enemy.x -= ENEMY_SPEED;
    else if (player.x > enemy.x) enemy.x += ENEMY_SPEED;
    enemy.x = clamp(enemy.x, 0, GAME_WIDTH - ENEMY_WIDTH);

    // Check collision with salad
    if (
      player.x + PLAYER_WIDTH > salad.x &&
      player.x < salad.x + SALAD_SIZE &&
      player.y + PLAYER_HEIGHT > salad.y &&
      player.y < salad.y + SALAD_SIZE
    ) {
      // Salad collected!
      setScore((prev) => prev + 1);
      // Respawn salad at random x
      salad.x = getRandomInt(32, GAME_WIDTH - 32 - SALAD_SIZE);
      salad.y = GROUND_Y - SALAD_SIZE;
    }

    // Check collision with enemy
    if (
      player.x + PLAYER_WIDTH > enemy.x &&
      player.x < enemy.x + ENEMY_WIDTH &&
      player.y + PLAYER_HEIGHT > enemy.y &&
      player.y < enemy.y + ENEMY_HEIGHT
    ) {
      // Game Over!
      setGameOver(true);
      gameState.current.started = false;
    }
  }

  // --- Game Render Logic ---
  function render() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Scale for mobile
    ctx.setTransform(dimensions.scale, 0, 0, dimensions.scale, 0, 0);

    // Clear
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw sky
    ctx.fillStyle = "#b3e0ff";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw ground
    ctx.fillStyle = "#64b964";
    ctx.fillRect(0, GROUND_Y, GAME_WIDTH, GAME_HEIGHT - GROUND_Y);

    // Draw player (Nia)
    drawEmoji(ctx, NIA_EMOJI, gameState.current.player.x, gameState.current.player.y, PLAYER_WIDTH, PLAYER_HEIGHT);

    // Draw enemy (Max)
    drawEmoji(ctx, MAX_EMOJI, gameState.current.enemy.x, gameState.current.enemy.y, ENEMY_WIDTH, ENEMY_HEIGHT);

    // Draw salad
    drawEmoji(ctx, SALAD_EMOJI, gameState.current.salad.x, gameState.current.salad.y, SALAD_SIZE, SALAD_SIZE);

    // Draw Score
    ctx.font = "bold 32px sans-serif";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "left";
    ctx.fillText(`🥗: ${score}`, 16, 44);

    // Draw Game Over
    if (gameOver) {
      ctx.font = "bold 48px sans-serif";
      ctx.fillStyle = "#d93838";
      ctx.textAlign = "center";
      ctx.fillText("Max caught you!", GAME_WIDTH / 2, GAME_HEIGHT / 2 - 40);
      ctx.font = "bold 32px sans-serif";
      ctx.fillStyle = "#fff";
      ctx.fillText(`Salads eaten: ${score}`, GAME_WIDTH / 2, GAME_HEIGHT / 2 + 10);
      ctx.font = "bold 24px sans-serif";
      ctx.fillText("Tap to play again", GAME_WIDTH / 2, GAME_HEIGHT / 2 + 50);
    }

    // Draw mobile controls
    drawControls(ctx);
  }

  // --- Draw Emoji Helper ---
  function drawEmoji(
    ctx: CanvasRenderingContext2D,
    emoji: string,
    x: number,
    y: number,
    w: number,
    h: number
  ) {
    ctx.font = `${h}px serif`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(emoji, x, y + 4); // y+4 for vertical centering tweak
  }

  // --- Draw Touch Controls ---
  function drawControls(ctx: CanvasRenderingContext2D) {
    // Show controls on mobile (always for demo)
    const opacity = 0.5;
    // Left
    ctx.fillStyle = `rgba(0,0,0,${opacity})`;
    ctx.beginPath();
    ctx.arc(70, GAME_HEIGHT - 70, 48, 0, 2 * Math.PI);
    ctx.fill();
    ctx.font = "bold 40px sans-serif";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("◀", 70, GAME_HEIGHT - 70);

    // Right
    ctx.fillStyle = `rgba(0,0,0,${opacity})`;
    ctx.beginPath();
    ctx.arc(GAME_WIDTH - 70, GAME_HEIGHT - 70, 48, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.fillText("▶", GAME_WIDTH - 70, GAME_HEIGHT - 70);

    // Jump
    ctx.fillStyle = `rgba(0,0,0,${opacity})`;
    ctx.beginPath();
    ctx.arc(GAME_WIDTH / 2, GAME_HEIGHT - 70, 48, 0, 2 * Math.PI);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.fillText("⭮", GAME_WIDTH / 2, GAME_HEIGHT - 70);
  }

  // --- Touch Events for Controls ---
  function handleCanvasTouch(e: React.TouchEvent) {
    if (gameOver) {
      restartGame();
      return;
    }
    for (let i = 0; i < e.touches.length; i++) {
      const t = e.touches[i];
      // Map touch to control areas
      const rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
      const x =
        ((t.clientX - rect.left) / rect.width) * GAME_WIDTH;
      const y =
        ((t.clientY - rect.top) / rect.height) * GAME_HEIGHT;
      if (y > GAME_HEIGHT - 140) {
        if (x < 140) handleTouchStart("left");
        else if (x > GAME_WIDTH - 140) handleTouchStart("right");
        else handleTouchStart("jump");
      }
    }
  }

  function handleCanvasTouchEnd(e: React.TouchEvent) {
    // On touch end, always reset controls
    controls.current.left = false;
    controls.current.right = false;
    controls.current.jump = false;
  }

  // --- Mouse Events for Desktop Controls (optional) ---
  function handleCanvasClick() {
    if (gameOver) {
      restartGame();
    } else if (!gameState.current.started) {
      gameState.current.started = true;
    }
  }

  // --- Start/Restart Game ---
  function restartGame() {
    setScore(0);
    setGameOver(false);
    gameState.current.player = {
      x: GAME_WIDTH / 2 - PLAYER_WIDTH / 2,
      y: GROUND_Y - PLAYER_HEIGHT,
      vx: 0,
      vy: 0,
      onGround: true,
    };
    gameState.current.enemy = {
      x: GAME_WIDTH / 4,
      y: GROUND_Y - ENEMY_HEIGHT,
      vx: 0,
      vy: 0,
    };
    gameState.current.salad = {
      x: getRandomInt(32, GAME_WIDTH - 32 - SALAD_SIZE),
      y: GROUND_Y - SALAD_SIZE,
    };
    gameState.current.started = true;
  }

  // --- Start on first tap ---
  useEffect(() => {
    if (!gameState.current.initialized) {
      gameState.current.started = false;
      gameState.current.initialized = true;
    }
    // eslint-disable-next-line
  }, []);

  // --- Render ---
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#222",
        overflow: "hidden",
        touchAction: "none",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 999,
      }}
    >
      <canvas
        ref={canvasRef}
        width={GAME_WIDTH}
        height={GAME_HEIGHT}
        style={{
          width: dimensions.width,
          height: dimensions.height,
          display: "block",
          background: "#222",
          touchAction: "none",
        }}
        onTouchStart={handleCanvasTouch}
        onTouchEnd={handleCanvasTouchEnd}
        onClick={handleCanvasClick}
      />
      {/* Optional: Accessible fallback for score/game over */}
      <div
        style={{
          position: "absolute",
          left: 8,
          top: 8,
          color: "#fff",
          fontSize: 20,
          pointerEvents: "none",
          textShadow: "0 1px 4px #222",
        }}
        aria-live="polite"
      >
        🥗: {score}
        {gameOver ? (
          <div>
            <strong>Game Over!</strong> Max caught you.<br />
            Salads eaten: {score}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default App;
