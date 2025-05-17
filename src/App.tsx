import React, { useRef, useEffect } from "react";
import "./App.css";

// Game constants
const CANVAS_WIDTH = 360;
const CANVAS_HEIGHT = 520;
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 20;
const PLAYER_Y = CANVAS_HEIGHT - 40;
const PLAYER_SPEED = 6;
const BULLET_WIDTH = 4;
const BULLET_HEIGHT = 12;
const BULLET_SPEED = 8;
const INVADER_ROWS = 4;
const INVADER_COLUMNS = 8;
const INVADER_WIDTH = 32;
const INVADER_HEIGHT = 20;
const INVADER_H_GAP = 14;
const INVADER_V_GAP = 26;
const INVADER_X_OFFSET = 24;
const INVADER_Y_OFFSET = 40;
const INVADER_SPEED = 1.2;
const INVADER_DOWN_STEP = 12;
const INVADER_BULLET_SPEED = 4;
const INVADER_SHOOT_RATE = 0.012;

type Invader = {
  x: number;
  y: number;
  alive: boolean;
};

type Bullet = {
  x: number;
  y: number;
  fromPlayer: boolean;
};

const getInvaders = () => {
  const invaders: Invader[] = [];
  for (let row = 0; row < INVADER_ROWS; row++) {
    for (let col = 0; col < INVADER_COLUMNS; col++) {
      invaders.push({
        x: INVADER_X_OFFSET + col * (INVADER_WIDTH + INVADER_H_GAP),
        y: INVADER_Y_OFFSET + row * (INVADER_HEIGHT + INVADER_V_GAP),
        alive: true,
      });
    }
  }
  return invaders;
};

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  // All mutable game state in refs:
  const playerX = useRef(CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2);
  const leftPressed = useRef(false);
  const rightPressed = useRef(false);
  const firePressed = useRef(false);
  const canFire = useRef(true);
  const bullets = useRef<Bullet[]>([]);
  const invaderBullets = useRef<Bullet[]>([]);
  const invaders = useRef<Invader[]>(getInvaders());
  const invaderDir = useRef(1); // 1: right, -1: left
  const invaderStepDown = useRef(false);
  const gameOver = useRef(false);
  const win = useRef(false);
  const score = useRef(0);
  const touchStartX = useRef<number | null>(null);

  // --- Game logic and rendering ---
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // --- Keyboard controls ---
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft") leftPressed.current = true;
      if (e.code === "ArrowRight") rightPressed.current = true;
      if (e.code === "Space") firePressed.current = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === "ArrowLeft") leftPressed.current = false;
      if (e.code === "ArrowRight") rightPressed.current = false;
      if (e.code === "Space") firePressed.current = false;
    };

    // --- Touch controls (left/right half screen) ---
    const handleTouchStart = (e: TouchEvent) => {
      if (!e.touches.length) return;
      const x = e.touches[0].clientX - canvas.getBoundingClientRect().left;
      touchStartX.current = x;
      if (x < CANVAS_WIDTH / 3) leftPressed.current = true;
      else if (x > (CANVAS_WIDTH * 2) / 3) rightPressed.current = true;
      else firePressed.current = true;
    };
    const handleTouchEnd = () => {
      leftPressed.current = false;
      rightPressed.current = false;
      firePressed.current = false;
      touchStartX.current = null;
    };

    // --- Attach controls ---
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("touchstart", handleTouchStart);
    canvas.addEventListener("touchend", handleTouchEnd);

    // --- Game loop ---
    function loop() {
      if (gameOver.current || win.current) {
        if (ctx) drawEndScreen(ctx);
        return;
      }
      updateGame();
      drawGame(ctx);
      animationRef.current = requestAnimationFrame(loop);
    }

    // --- Game logic ---
    function updateGame() {
      // Player move
      if (leftPressed.current) {
        playerX.current = Math.max(0, playerX.current - PLAYER_SPEED);
      }
      if (rightPressed.current) {
        playerX.current = Math.min(
          CANVAS_WIDTH - PLAYER_WIDTH,
          playerX.current + PLAYER_SPEED
        );
      }

      // Player fire
      if (firePressed.current && canFire.current) {
        bullets.current.push({
          x: playerX.current + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
          y: PLAYER_Y - BULLET_HEIGHT,
          fromPlayer: true,
        });
        canFire.current = false;
      } else if (!firePressed.current) {
        canFire.current = true;
      }

      // Move player bullets
      bullets.current = bullets.current
        .map((b) =>
          b.fromPlayer
            ? { ...b, y: b.y - BULLET_SPEED }
            : { ...b, y: b.y + INVADER_BULLET_SPEED }
        )
        .filter((b) => b.y > -BULLET_HEIGHT && b.y < CANVAS_HEIGHT + BULLET_HEIGHT);

      // Invader movement
      let hitEdge = false;
      let minX = CANVAS_WIDTH, maxX = 0;
      invaders.current.forEach((inv) => {
        if (!inv.alive) return;
        inv.x += invaderDir.current * INVADER_SPEED;
        minX = Math.min(minX, inv.x);
        maxX = Math.max(maxX, inv.x + INVADER_WIDTH);
      });
      if (minX <= 0 || maxX >= CANVAS_WIDTH) {
        hitEdge = true;
      }
      if (hitEdge) {
        invaderDir.current *= -1;
        invaders.current.forEach((inv) => {
          if (!inv.alive) return;
          inv.y += INVADER_DOWN_STEP;
          // If invaders reach player, game over
          if (inv.y + INVADER_HEIGHT >= PLAYER_Y) {
            gameOver.current = true;
          }
        });
      }

      // Invader shooting
      if (Math.random() < INVADER_SHOOT_RATE) {
        // Pick a random alive invader from bottom row
        const columns: { [col: number]: Invader[] } = {};
        invaders.current.forEach((inv) => {
          if (!inv.alive) return;
          const col = Math.round((inv.x - INVADER_X_OFFSET) / (INVADER_WIDTH + INVADER_H_GAP));
          if (!columns[col]) columns[col] = [];
          columns[col].push(inv);
        });
        const aliveCols = Object.values(columns).filter((arr) => arr.length > 0);
        if (aliveCols.length) {
          const colInvaders = aliveCols[Math.floor(Math.random() * aliveCols.length)];
          const shooter = colInvaders[colInvaders.length - 1];
          invaderBullets.current.push({
            x: shooter.x + INVADER_WIDTH / 2 - BULLET_WIDTH / 2,
            y: shooter.y + INVADER_HEIGHT,
            fromPlayer: false,
          });
        }
      }

      // Move invader bullets (already handled above)

      // Bullet collision: player bullet vs invader
      bullets.current.forEach((b) => {
        if (!b.fromPlayer) return;
        invaders.current.forEach((inv) => {
          if (
            inv.alive &&
            b.x + BULLET_WIDTH > inv.x &&
            b.x < inv.x + INVADER_WIDTH &&
            b.y < inv.y + INVADER_HEIGHT &&
            b.y + BULLET_HEIGHT > inv.y
          ) {
            inv.alive = false;
            b.y = -9999; // Remove bullet
            score.current += 100;
          }
        });
      });

      // Bullet collision: invader bullet vs player
      invaderBullets.current.forEach((b) => {
        if (
          b.x + BULLET_WIDTH > playerX.current &&
          b.x < playerX.current + PLAYER_WIDTH &&
          b.y + BULLET_HEIGHT > PLAYER_Y &&
          b.y < PLAYER_Y + PLAYER_HEIGHT
        ) {
          gameOver.current = true;
        }
      });

      // Remove dead bullets
      bullets.current = bullets.current.filter((b) => b.y > -BULLET_HEIGHT && b.y < CANVAS_HEIGHT + BULLET_HEIGHT);
      invaderBullets.current = invaderBullets.current.filter(
        (b) => b.y > -BULLET_HEIGHT && b.y < CANVAS_HEIGHT + BULLET_HEIGHT
      );

      // Win condition
      if (invaders.current.every((inv) => !inv.alive)) {
        win.current = true;
      }
    } // <-- make sure this closing brace is present and properly placed
    }

    function drawGame(ctx: CanvasRenderingContext2D) {
      // Clear
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw player
      ctx.fillStyle = "#3fd6ff";
      ctx.fillRect(playerX.current, PLAYER_Y, PLAYER_WIDTH, PLAYER_HEIGHT);

      // Draw player bullets
      ctx.fillStyle = "#fff";
      bullets.current.forEach((b) => {
        if (b.fromPlayer) {
          ctx.fillRect(b.x, b.y, BULLET_WIDTH, BULLET_HEIGHT);
        }
      });

      // Draw invaders
      invaders.current.forEach((inv) => {
        if (!inv.alive) return;
        ctx.fillStyle = "#f7e172";
        ctx.fillRect(inv.x + 4, inv.y, INVADER_WIDTH - 8, INVADER_HEIGHT - 3);
        ctx.fillStyle = "#d62d2d";
        ctx.fillRect(inv.x, inv.y + INVADER_HEIGHT - 7, INVADER_WIDTH, 7);
        ctx.fillStyle = "#fff";
        ctx.fillRect(inv.x + 8, inv.y + 7, INVADER_WIDTH - 16, 5);
      });

      // Draw invader bullets
      ctx.fillStyle = "#e84040";
      invaderBullets.current.forEach((b) => {
        ctx.fillRect(b.x, b.y, BULLET_WIDTH, BULLET_HEIGHT);
      });

      // Draw score
      ctx.fillStyle = "#fff";
      ctx.font = "16px monospace";
      ctx.fillText("Score: " + score.current, 12, 24);
    }

    function drawEndScreen(ctx: CanvasRenderingContext2D) {
      // Overlay
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Message
      ctx.fillStyle = "#fff";
      ctx.font = "30px monospace";
      ctx.textAlign = "center";
      ctx.fillText(win.current ? "YOU WIN!" : "GAME OVER", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 10);
      ctx.font = "18px monospace";
      ctx.fillText("Score: " + score.current, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 24);
      ctx.font = "16px monospace";
      ctx.fillText("Tap or press R to restart", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 50);
    }

    // --- Restart logic ---
    const restart = () => {
      playerX.current = CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2;
      bullets.current = [];
      invaderBullets.current = [];
      invaders.current = getInvaders();
      invaderDir.current = 1;
      gameOver.current = false;
      win.current = false;
      score.current = 0;
      animationRef.current = requestAnimationFrame(loop);
    };

    // Listen for R key or canvas tap to restart
    const handleRestart = (e: any) => {
      if (gameOver.current || win.current) {
        if (e.type === "keydown" && e.code === "KeyR") {
          restart();
        }
        if (e.type === "touchend") {
          restart();
        }
      }
    };
    window.addEventListener("keydown", handleRestart);
    canvas.addEventListener("touchend", handleRestart);

    // Start animation
    animationRef.current = requestAnimationFrame(loop);

    // Cleanup
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("keydown", handleRestart);
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("touchend", handleRestart);
    };
    // eslint-disable-next-line
  }, []);

  // Center the canvas for mobile and desktop
  return (
    <div
      className="App"
      style={{
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        minHeight: "100vh",
        justifyContent: "center",
      }}
    >
      <h2 style={{ color: "#fff", marginBottom: 12, fontFamily: "monospace" }}>
        Space Invaders
      </h2>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        style={{
          border: "2px solid #fff",
          background: "#111",
          touchAction: "none",
          borderRadius: 10,
        }}
        tabIndex={0}
      />
      <div style={{ color: "#fff", fontSize: 15, marginTop: 12, fontFamily: "monospace", textAlign: "center" }}>
        Controls: Tap left/right or space to move/fire.<br />
        On desktop: arrow keys to move, space to fire.<br />
        On mobile: tap left/right/center of canvas.
      </div>
    </div>
  );
};

export default App;
