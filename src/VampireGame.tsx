import React, { useRef, useState, useEffect } from "react";
import "./VampireGame.css";

interface NPC {
  id: number;
  x: number;
  y: number;
  draining: boolean;
}

const GAME_WIDTH = 360; // px, for mobile
const GAME_HEIGHT = 600;

const NPC_SPAWN_INTERVAL = 1200; // ms
const NPC_MOVE_SPEED = 60; // px/sec
const DRAIN_TIME = 900; // ms to drain fully

export default function VampireGame() {
  const [npcs, setNpcs] = useState<NPC[]>([]);
  const [score, setScore] = useState(0);
  const [blood, setBlood] = useState(3); // lives
  const [gameOver, setGameOver] = useState(false);
  const npcId = useRef(0);

  // Spawn NPCs
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setNpcs((prev) => [
        ...prev,
        {
          id: npcId.current++,
          x: Math.random() * (GAME_WIDTH - 56),
          y: 0,
          draining: false,
        },
      ]);
    }, NPC_SPAWN_INTERVAL);
    return () => clearInterval(interval);
  }, [gameOver]);

  // Move NPCs
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      setNpcs((prev) =>
        prev
          .map((npc) =>
            npc.draining
              ? npc
              : { ...npc, y: npc.y + (NPC_MOVE_SPEED * 0.03) }
          )
          .filter((npc) => {
            if (npc.y > GAME_HEIGHT - 60 && !npc.draining) {
              setBlood((b) => b - 1);
              return false;
            }
            return true;
          })
      );
    }, 30);
    return () => clearInterval(interval);
  }, [gameOver]);

  // Lose condition
  useEffect(() => {
    if (blood <= 0 && !gameOver) {
      setGameOver(true);
    }
  }, [blood, gameOver]);

  // Tap to drain NPC
  function handleDrain(id: number) {
    setNpcs((prev) =>
      prev.map((npc) =>
        npc.id === id && !npc.draining ? { ...npc, draining: true } : npc
      )
    );
    setTimeout(() => {
      setNpcs((prev) => prev.filter((npc) => npc.id !== id));
      setScore((s) => s + 1);
    }, DRAIN_TIME);
  }

  function handleRestart() {
    setNpcs([]);
    setScore(0);
    setBlood(3);
    setGameOver(false);
    npcId.current = 0;
  }

  return (
    <div
      className="vampire-game-root"
      style={{
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        margin: "0 auto",
        background: "linear-gradient(to bottom,#1e002a,#090012 80%)",
        borderRadius: 16,
        position: "relative",
        overflow: "hidden",
        touchAction: "none",
      }}
    >
      {/* Futuristic City Skyline */}
      <div className="city-skyline" />
      {/* Score */}
      <div className="score-bar">
        <span>🩸 {score}</span>
        <span>
          {Array.from({ length: blood }).map((_, i) => (
            <span key={i} style={{ color: "#f04" }}>
              ❤️
            </span>
          ))}
        </span>
      </div>
      {/* NPCs */}
      {npcs.map((npc) => (
        <div
          key={npc.id}
          className={`npc ${npc.draining ? "draining" : ""}`}
          style={{
            left: npc.x,
            top: npc.y,
            position: "absolute",
            width: 56,
            height: 56,
            transition: npc.draining ? "background 0.4s" : undefined,
          }}
          onTouchStart={() => !npc.draining && handleDrain(npc.id)}
          onMouseDown={() => !npc.draining && handleDrain(npc.id)}
        >
          {/* Futuristic human - SVG */}
          <svg width="56" height="56" viewBox="0 0 56 56">
            <ellipse
              cx="28"
              cy="24"
              rx="14"
              ry="18"
              fill={npc.draining ? "#900" : "#7ff"}
              stroke="#ffe"
              strokeWidth="2"
            />
            {/* Eyes */}
            <ellipse
              cx="23"
              cy="24"
              rx="2"
              ry="3"
              fill="#111"
              stroke="#fff"
              strokeWidth="0.5"
            />
            <ellipse
              cx="33"
              cy="24"
              rx="2"
              ry="3"
              fill="#111"
              stroke="#fff"
              strokeWidth="0.5"
            />
            {/* Futuristic headband */}
            <rect
              x="16"
              y="17"
              width="24"
              height="3"
              rx="1"
              fill="#0ff"
              opacity="0.7"
            />
            {/* Fangs if draining */}
            {npc.draining && (
              <>
                <rect x="24" y="37" width="2" height="7" fill="#fff" />
                <rect x="30" y="37" width="2" height="7" fill="#fff" />
              </>
            )}
          </svg>
        </div>
      ))}
      {gameOver && (
        <div className="game-over-screen">
          <div style={{ fontSize: 36, marginBottom: 8, color: "#fff" }}>
            GAME OVER
          </div>
          <div style={{ fontSize: 22, color: "#fff", marginBottom: 16 }}>
            Score: {score}
          </div>
          <button className="restart-btn" onClick={handleRestart}>
            Play Again
          </button>
        </div>
      )}
      {/* Title */}
      <div className="game-title">
        <span style={{ color: "#f04" }}>VAMPIRE</span>
        <span style={{ color: "#0ff" }}>2500</span>
      </div>
    </div>
  );
}