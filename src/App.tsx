import React, { useEffect, useRef, useState } from "react";
import "./App.css";

// Simple mobile-first game: Arlo (miniature deer) vs Ali (large man)

// Game constants
const GAME_WIDTH = 360; // px (mobile width)
const GAME_HEIGHT = 600; // px (mobile height)
const ARLO_SIZE = 40;
const ALI_SIZE = 60;
const MOVE_SPEED = 20; // px per move
const ALI_SPEED = 8; // px per frame

// Helper for random position
function randomPosition(size: number) {
  return {
    x: Math.floor(Math.random() * (GAME_WIDTH - size)),
    y: Math.floor(Math.random() * (GAME_HEIGHT - size)),
  };
}

// Emoji or colored divs as placeholders
const ARLO_EMOJI = "🦌";
const ALI_EMOJI = "🧔";

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

type Position = { x: number; y: number };

function getDistance(a: Position, b: Position) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

const initialArlo: Position = { x: 40, y: GAME_HEIGHT / 2 - ARLO_SIZE / 2 };
const initialAli: Position = { x: GAME_WIDTH - ALI_SIZE - 40, y: GAME_HEIGHT / 2 - ALI_SIZE / 2 };

function App() {
  const [arlo, setArlo] = useState<Position>(initialArlo);
  const [ali, setAli] = useState<Position>(initialAli);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState("");
  const gameRef = useRef<HTMLDivElement>(null);

  // Move Ali: runs away from Arlo, random path, simple AI
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setAli((prevAli) => {
        // Move Ali away from Arlo
        const dx = prevAli.x - arlo.x;
        const dy = prevAli.y - arlo.y;
        const dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));

        // Ali runs away, but stays on screen
        let newX = prevAli.x + (ALI_SPEED * (dx / dist));
        let newY = prevAli.y + (ALI_SPEED * (dy / dist));

        // Add some randomness
        newY += (Math.random() - 0.5) * 10;

        newX = clamp(newX, 0, GAME_WIDTH - ALI_SIZE);
        newY = clamp(newY, 0, GAME_HEIGHT - ALI_SIZE);

        return { x: newX, y: newY };
      });
    }, 40); // 25fps
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [arlo, gameOver]);

  // Check for collision (Arlo catches Ali)
  useEffect(() => {
    if (getDistance(
      { x: arlo.x + ARLO_SIZE/2, y: arlo.y + ARLO_SIZE/2 },
      { x: ali.x + ALI_SIZE/2, y: ali.y + ALI_SIZE/2 }
    ) < (ARLO_SIZE + ALI_SIZE) / 2) {
      setGameOver(true);
      setMessage("You caught Ali! Arlo rips him to shreds! 🦌💥🧔");
    }
  }, [arlo, ali]);

  // Keyboard controls (for desktop/dev)
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (gameOver) return;
      let { x, y } = arlo;
      if (e.key === "ArrowUp") y -= MOVE_SPEED;
      if (e.key === "ArrowDown") y += MOVE_SPEED;
      if (e.key === "ArrowLeft") x -= MOVE_SPEED;
      if (e.key === "ArrowRight") x += MOVE_SPEED;
      x = clamp(x, 0, GAME_WIDTH - ARLO_SIZE);
      y = clamp(y, 0, GAME_HEIGHT - ARLO_SIZE);
      setArlo({ x, y });
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [arlo, gameOver]);

  // Touch controls (swipe)
  useEffect(() => {
    let touchStart: { x: number; y: number } | null = null;
    function onTouchStart(e: TouchEvent) {
      const t = e.touches[0];
      touchStart = { x: t.clientX, y: t.clientY };
    }
    function onTouchEnd(e: TouchEvent) {
      if (!touchStart) return;
      const t = e.changedTouches[0];
      const dx = t.clientX - touchStart.x;
      const dy = t.clientY - touchStart.y;
      if (gameOver) return;
      let { x, y } = arlo;
      if (Math.abs(dx) > Math.abs(dy)) {
        // horizontal swipe
        if (dx > 30) x += MOVE_SPEED;
        if (dx < -30) x -= MOVE_SPEED;
      } else {
        // vertical swipe
        if (dy > 30) y += MOVE_SPEED;
        if (dy < -30) y -= MOVE_SPEED;
      }
      x = clamp(x, 0, GAME_WIDTH - ARLO_SIZE);
      y = clamp(y, 0, GAME_HEIGHT - ARLO_SIZE);
      setArlo({ x, y });
      touchStart = null;
    }
    const gameEl = gameRef.current;
    if (gameEl) {
      gameEl.addEventListener("touchstart", onTouchStart);
      gameEl.addEventListener("touchend", onTouchEnd);
    }
    return () => {
      if (gameEl) {
        gameEl.removeEventListener("touchstart", onTouchStart);
        gameEl.removeEventListener("touchend", onTouchEnd);
      }
    };
  }, [arlo, gameOver]);

  function reset() {
    setArlo(randomPosition(ARLO_SIZE));
    setAli(randomPosition(ALI_SIZE));
    setGameOver(false);
    setMessage("");
  }

  // On-screen controls for mobile
  function moveArlo(dx: number, dy: number) {
    if (gameOver) return;
    let x = clamp(arlo.x + dx, 0, GAME_WIDTH - ARLO_SIZE);
    let y = clamp(arlo.y + dy, 0, GAME_HEIGHT - ARLO_SIZE);
    setArlo({ x, y });
  }

  return (
    <div
      className="App"
      style={{
        background: "#a3d9a5",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h2 style={{ margin: 10 }}>Arlo's Hunt: Mobile Game</h2>
      <div
        ref={gameRef}
        style={{
          position: "relative",
          width: GAME_WIDTH,
          height: GAME_HEIGHT,
          background: "#fffbe6",
          border: "3px solid #664229",
          borderRadius: 22,
          overflow: "hidden",
          boxShadow: "0 4px 40px #aaa",
          touchAction: "none",
        }}
      >
        {/* Arlo (player) */}
        <div
          style={{
            position: "absolute",
            left: arlo.x,
            top: arlo.y,
            width: ARLO_SIZE,
            height: ARLO_SIZE,
            fontSize: 32,
            zIndex: 2,
            userSelect: "none",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "left 0.08s, top 0.08s",
          }}
        >
          {ARLO_EMOJI}
        </div>
        {/* Ali (target) */}
        <div
          style={{
            position: "absolute",
            left: ali.x,
            top: ali.y,
            width: ALI_SIZE,
            height: ALI_SIZE,
            fontSize: 38,
            zIndex: 1,
            userSelect: "none",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "left 0.04s, top 0.04s",
          }}
        >
          {ALI_EMOJI}
        </div>
        {/* Game Over overlay */}
        {gameOver && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: GAME_WIDTH,
              height: GAME_HEIGHT,
              background: "rgba(0,0,0,0.7)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 10,
              color: "#fff",
              fontSize: 26,
              fontWeight: "bold",
            }}
          >
            <div>{message}</div>
            <button
              style={{
                marginTop: 24,
                fontSize: 18,
                padding: "10px 28px",
                background: "#f8b400",
                border: "none",
                borderRadius: 12,
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
              }}
              onClick={reset}
            >
              Play Again
            </button>
          </div>
        )}
        {/* Mobile controls */}
        {!gameOver && (
          <div
            style={{
              position: "absolute",
              bottom: 15,
              left: 0,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              zIndex: 9,
              pointerEvents: "none",
            }}
          >
            <div style={{ display: "flex", gap: 20, marginBottom: 10 }}>
              <button
                className="ctrl-btn"
                style={{ pointerEvents: "auto" }}
                aria-label="Up"
                onClick={() => moveArlo(0, -MOVE_SPEED)}
              >
                ⬆️
              </button>
            </div>
            <div style={{ display: "flex", gap: 20 }}>
              <button
                className="ctrl-btn"
                style={{ pointerEvents: "auto" }}
                aria-label="Left"
                onClick={() => moveArlo(-MOVE_SPEED, 0)}
              >
                ⬅️
              </button>
              <button
                className="ctrl-btn"
                style={{ pointerEvents: "auto" }}
                aria-label="Down"
                onClick={() => moveArlo(0, MOVE_SPEED)}
              >
                ⬇️
              </button>
              <button
                className="ctrl-btn"
                style={{ pointerEvents: "auto" }}
                aria-label="Right"
                onClick={() => moveArlo(MOVE_SPEED, 0)}
              >
                ➡️
              </button>
            </div>
          </div>
        )}
      </div>
      <div style={{ marginTop: 18, maxWidth: 340, fontSize: 15, color: "#664229", background: "#f4efe3", borderRadius: 7, padding: 10 }}>
        Move Arlo (🦌) with swipe or arrows.<br />
        Catch Ali (🧔) to win. <br />
        <span style={{ fontSize: 13, color: "#888" }}>(Game is mobile-first! Try it on your phone.)</span>
      </div>
    </div>
  );
}

export default App;