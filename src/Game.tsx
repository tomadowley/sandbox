import React, { useRef, useState, useEffect } from "react";
import { GameEngine } from "react-game-engine";

type Vec2 = { x: number; y: number };

const GAME_WIDTH = 320;
const GAME_HEIGHT = 480;
const PLAYER_SIZE = 40;
const ENEMY_SIZE = 40;
const ITEM_SIZE = 24;
const HAZARD_SIZE = 32;

const INITIAL_PLAYER: Vec2 = { x: 40, y: GAME_HEIGHT / 2 - PLAYER_SIZE / 2 };
const INITIAL_ENEMY: Vec2 = { x: GAME_WIDTH - 80, y: GAME_HEIGHT / 2 - ENEMY_SIZE / 2 };

function getRandomPos(margin: number = 0): Vec2 {
  return {
    x: margin + Math.floor(Math.random() * (GAME_WIDTH - margin * 2 - ITEM_SIZE)),
    y: margin + Math.floor(Math.random() * (GAME_HEIGHT - margin * 2 - ITEM_SIZE)),
  };
}

// ----- Entity Renderers -----
const Player = ({ position }: { position: Vec2 }) => (
  <div
    style={{
      position: "absolute",
      left: position.x,
      top: position.y,
      width: PLAYER_SIZE,
      height: PLAYER_SIZE,
      background: "#4caf50",
      borderRadius: 6,
      boxShadow: "0 1px 4px #2225",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "bold",
      color: "#fff",
      fontSize: 18,
      userSelect: "none",
      backgroundImage: "linear-gradient(135deg,#7be,#4caf50)", // placeholder 8-bit dog
    }}
    aria-label="Arlo-Dog"
  >
    🐶
  </div>
);

const ALI_APPEARANCES = [
  {
    bg: "#b71c1c",
    emoji: "👹",
    face: "ಠ益ಠ",
    blood: true,
    border: "4px solid #820000",
    label: "Ali-Evil1",
  },
  {
    bg: "#311b92",
    emoji: "💀",
    face: "☠️",
    blood: false,
    border: "4px dashed #222",
    label: "Ali-Evil2",
  },
  {
    bg: "#212121",
    emoji: "🦴",
    face: "≋(͒•˛•͒)≋",
    blood: false,
    border: "4px double #ad1457",
    label: "Ali-Evil3",
  },
  {
    bg: "#880e4f",
    emoji: "🩸",
    face: "ಥ﹏ಥ",
    blood: true,
    border: "4px solid #ad1457",
    label: "Ali-Evil4",
  },
  {
    bg: "#263238",
    emoji: "😈",
    face: ">:) ",
    blood: false,
    border: "4px dotted #d32f2f",
    label: "Ali-Evil5",
  },
];
const ALI_TAUNTS = [
  "I'm going to roast you, Arlo!",
  "Prepare for seasoning!",
  "Your treats are mine!",
  "You'll be dog dinner soon!",
  "No escape from my oven!",
  "Blood will be spilled...",
  "Run while you can!",
  "I'll chew your bones!",
  "My teeth are sharp tonight.",
  "I'll turn you into stew!",
  "You'll beg for salt!",
  "The hunt is on, pup!",
];

const Enemy = ({
  position,
  appearance,
}: {
  position: Vec2;
  appearance: typeof ALI_APPEARANCES[0];
}) => (
  <div
    style={{
      position: "absolute",
      left: position.x,
      top: position.y,
      width: ENEMY_SIZE,
      height: ENEMY_SIZE,
      background: appearance.bg,
      borderRadius: 6,
      boxShadow: "0 2px 10px #000a",
      border: appearance.border,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontWeight: "bold",
      fontSize: 20,
      userSelect: "none",
      flexDirection: "column",
      textShadow: appearance.blood ? "0 2px 8px #f00, 0 0px 2px #000" : "0 1px 2px #000",
      zIndex: 20,
      transition: "background 0.2s, border 0.2s"
    }}
    aria-label={appearance.label}
  >
    <span style={{ fontSize: 24 }}>{appearance.emoji}</span>
    <span style={{ fontFamily: "monospace", marginTop: -2 }}>
      {appearance.face}
    </span>
    {appearance.blood && (
      <span
        style={{
          fontSize: 18,
          color: "#ff1744",
          fontWeight: "bold",
          marginTop: -6,
          textShadow: "0 1px 6px #300",
        }}
      >
        🩸
      </span>
    )}
  </div>
);

const Treat = ({ position }: { position: Vec2 }) => (
  <div
    style={{
      position: "absolute",
      left: position.x,
      top: position.y,
      width: ITEM_SIZE,
      height: ITEM_SIZE,
      background: "#ffeb3b",
      borderRadius: "50%",
      border: "2px solid #fbc02d",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 16,
      color: "#b48a00",
    }}
    aria-label="Treat"
  >
    🍖
  </div>
);

const Oven = ({ position }: { position: Vec2 }) => (
  <div
    style={{
      position: "absolute",
      left: position.x,
      top: position.y,
      width: HAZARD_SIZE,
      height: HAZARD_SIZE,
      background: "#777",
      borderRadius: 5,
      border: "2px solid #444",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 16,
      color: "#fff",
    }}
    aria-label="Oven"
  >
    🔥
  </div>
);

const Seasoning = ({ position }: { position: Vec2 }) => (
  <div
    style={{
      position: "absolute",
      left: position.x,
      top: position.y,
      width: HAZARD_SIZE,
      height: HAZARD_SIZE,
      background: "#ce93d8",
      borderRadius: 5,
      border: "2px solid #7b1fa2",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 16,
      color: "#fff",
    }}
    aria-label="Seasoning"
  >
    🧂
  </div>
);

// ----- Game Logic System -----
function rectsOverlap(a: Vec2, as: number, b: Vec2, bs: number) {
  return (
    a.x < b.x + bs &&
    a.x + as > b.x &&
    a.y < b.y + bs &&
    a.y + as > b.y
  );
}

const initialTreats = Array.from({ length: 3 }, () => getRandomPos(10));
const initialOvens = [getRandomPos(30)];
const initialSeasonings = [getRandomPos(30)];

type GameState = {
  player: Vec2;
  enemy: Vec2;
  treats: Vec2[];
  ovens: Vec2[];
  seasonings: Vec2[];
  score: number;
  gameOver: boolean;
  started: boolean;
};

function getInitialState(): GameState {
  return {
    player: { ...INITIAL_PLAYER },
    enemy: { ...INITIAL_ENEMY },
    treats: initialTreats.map((t) => ({ ...t })),
    ovens: initialOvens.map((o) => ({ ...o })),
    seasonings: initialSeasonings.map((s) => ({ ...s })),
    score: 0,
    gameOver: false,
    started: false,
  };
}

// ----- Main Game Component -----
const BLOOD_SPLATTERS = [
  { left: 80, top: 160, size: 60, rot: 15, opacity: 0.75 },
  { left: 160, top: 220, size: 38, rot: -25, opacity: 0.65 },
  { left: 210, top: 100, size: 32, rot: 10, opacity: 0.7 },
  { left: 70, top: 300, size: 44, rot: -16, opacity: 0.6 },
  { left: 200, top: 380, size: 70, rot: 22, opacity: 0.55 },
];
const TAUNT_DISTANCE = 80;

const Game: React.FC = () => {
  // State controlled outside GameEngine for UI and mobile input
  const [state, setState] = useState<GameState>(getInitialState());

  // Ali evil appearance state and timer
  const [aliIdx, setAliIdx] = useState(() => Math.floor(Math.random() * ALI_APPEARANCES.length));

  // For taunt logic
  const [taunt, setTaunt] = useState<string | null>(null);
  const [tauntPos, setTauntPos] = useState<{ x: number; y: number } | null>(null);

  // For screen shake and blood splatter
  const [shake, setShake] = useState(false);
  const [showBlood, setShowBlood] = useState(false);

  // For mobile swipe/touch
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  // Used for animation/game loop
  const [_, setTick] = useState(0);

  // Focus management for keyboard/game container
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // --- Ali appearance cycling ---
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (state.started && !state.gameOver) {
      interval = setInterval(() => {
        setAliIdx((prev) => {
          let next;
          do {
            next = Math.floor(Math.random() * ALI_APPEARANCES.length);
          } while (next === prev && ALI_APPEARANCES.length > 1);
          return next;
        });
      }, 1000);
    }
    return () => interval && clearInterval(interval);
    // eslint-disable-next-line
  }, [state.started, state.gameOver]);

  // --- Taunt logic ---
  useEffect(() => {
    if (!state.started || state.gameOver) {
      if (state.gameOver) {
        // Centered taunt on game over
        setTaunt(ALI_TAUNTS[Math.floor(Math.random() * ALI_TAUNTS.length)]);
        setTauntPos(null);
      } else {
        setTaunt(null);
        setTauntPos(null);
      }
      return;
    }
    // If Ali is close to player, show a taunt above Ali
    const px = state.player.x + PLAYER_SIZE / 2;
    const py = state.player.y + PLAYER_SIZE / 2;
    const ex = state.enemy.x + ENEMY_SIZE / 2;
    const ey = state.enemy.y + ENEMY_SIZE / 2;
    const dist = Math.hypot(px - ex, py - ey);
    if (dist < TAUNT_DISTANCE) {
      setTaunt(ALI_TAUNTS[Math.floor(Math.random() * ALI_TAUNTS.length)]);
      setTauntPos({ x: state.enemy.x + ENEMY_SIZE / 2, y: state.enemy.y });
    } else {
      setTaunt(null);
      setTauntPos(null);
    }
  }, [state.player, state.enemy, state.started, state.gameOver]);

  // --- Keyboard Controls ---
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!state.started || state.gameOver) return;
      let dx = 0, dy = 0;
      if (e.key === "ArrowUp") dy = -24;
      else if (e.key === "ArrowDown") dy = 24;
      else if (e.key === "ArrowLeft") dx = -24;
      else if (e.key === "ArrowRight") dx = 24;
      if (dx !== 0 || dy !== 0) movePlayer(dx, dy);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line
  }, [state.started, state.gameOver, state.player]);

  // Mobile Swipe/Touch Controls
  function onTouchStart(e: React.TouchEvent) {
    if (e.touches.length > 0) {
      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    const threshold = 12; // Lowered from 24px to 12px for more responsive control
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > threshold) movePlayer(24, 0);
      else if (dx < -threshold) movePlayer(-24, 0);
    } else {
      if (dy > threshold) movePlayer(0, 24);
      else if (dy < -threshold) movePlayer(0, -24);
    }
    touchStart.current = null;
  }

  // Move player and update state
  function movePlayer(dx: number, dy: number) {
    setState((prev) => {
      if (!prev.started || prev.gameOver) return prev;
      const newX = Math.max(0, Math.min(GAME_WIDTH - PLAYER_SIZE, prev.player.x + dx));
      const newY = Math.max(0, Math.min(GAME_HEIGHT - PLAYER_SIZE, prev.player.y + dy));
      return { ...prev, player: { x: newX, y: newY } };
    });
  }

  // Enemy AI Movement
  useEffect(() => {
    if (!state.started || state.gameOver) return;
    const interval = setInterval(() => {
      setState((prev) => {
        if (!prev.started || prev.gameOver) return prev;
        // Move enemy towards player
        const { enemy, player } = prev;
        let dx = player.x - enemy.x;
        let dy = player.y - enemy.y;
        const step = 14;
        let moveX = Math.abs(dx) > step ? (dx > 0 ? step : -step) : dx;
        let moveY = Math.abs(dy) > step ? (dy > 0 ? step : -step) : dy;
        // Enemy moves both axes for more challenge
        let newEnemy = {
          x: Math.max(0, Math.min(GAME_WIDTH - ENEMY_SIZE, enemy.x + moveX)),
          y: Math.max(0, Math.min(GAME_HEIGHT - ENEMY_SIZE, enemy.y + moveY)),
        };
        return { ...prev, enemy: newEnemy };
      });
      setTick((tick) => tick + 1); // trigger re-render
    }, 220);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [state.started, state.gameOver, state.enemy, state.player]);

  // Main Game Loop (collisions, treat collection, hazards, game over)
  useEffect(() => {
    if (!state.started || state.gameOver) return;
    // Check treat collection
    let collected = false;
    let treats = state.treats.filter((t) => {
      if (
        rectsOverlap(state.player, PLAYER_SIZE, t, ITEM_SIZE)
      ) {
        collected = true;
        return false; // remove collected treat
      }
      return true;
    });
    // If all treats collected, respawn
    if (treats.length === 0 && collected) {
      treats = Array.from({ length: 3 }, () => getRandomPos(10));
    }
    // If collected, add score
    let score = state.score;
    if (collected) score += 1;

    // Check hazards
    const hazards = [
      ...state.ovens.map((o) => ({ pos: o, size: HAZARD_SIZE })),
      ...state.seasonings.map((s) => ({ pos: s, size: HAZARD_SIZE })),
    ];
    let hitHazard = hazards.some((hz) =>
      rectsOverlap(state.player, PLAYER_SIZE, hz.pos, hz.size)
    );
    // Enemy touches player: game over
    let enemyTouch = rectsOverlap(state.player, PLAYER_SIZE, state.enemy, ENEMY_SIZE);

    if (hitHazard || enemyTouch) {
      // Shake and blood splatter on game over
      setShake(true);
      setShowBlood(true);
      setTimeout(() => setShake(false), 600);
      setTimeout(() => setShowBlood(false), 1000);
      setState((prev) => ({ ...prev, gameOver: true }));
    } else {
      // Update state if changed
      if (collected || treats.length !== state.treats.length) {
        setState((prev) => ({
          ...prev,
          treats,
          score,
        }));
      }
    }
    // eslint-disable-next-line
  }, [state.player, state.enemy, state.treats, state.started, state.gameOver]);

  // Responsive sizing (auto scale for mobile)
  const [scale, setScale] = useState(1);
  useEffect(() => {
    function handleResize() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      // Fit to width, with margin
      let s = Math.min(w / (GAME_WIDTH + 8), h / (GAME_HEIGHT + 8), 1.2);
      setScale(s);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Start/Restart
  function handleStart() {
    setState(getInitialState());
    setTimeout(() => {
      setState((prev) => ({ ...prev, started: true }));
      // Focus game container after the overlay disappears
      if (gameContainerRef.current) {
        gameContainerRef.current.focus();
      }
    }, 200);
    setTaunt(null);
    setTauntPos(null);
    setShake(false);
    setShowBlood(false);
    setAliIdx(Math.floor(Math.random() * ALI_APPEARANCES.length));
  }

  // Render UI Overlay
  return (
    <div
      ref={gameContainerRef}
      style={{
        width: GAME_WIDTH * scale,
        height: GAME_HEIGHT * scale,
        margin: "24px auto",
        position: "relative",
        border: isFocused ? "3px solid #2196f3" : "2px solid #2226",
        borderRadius: 12,
        background: "linear-gradient(175deg,#e3f2fd 60%,#fffde7)",
        overflow: "hidden",
        touchAction: "none",
        boxShadow: isFocused
          ? "0 0 0 4px #90caf9, 0 4px 24px #3333"
          : "0 4px 24px #3333",
        maxWidth: "95vw",
        maxHeight: "90vh",
        transition: "box-shadow 0.2s, border 0.2s",
        animation: shake
          ? "shake-screen 0.14s cubic-bezier(.36,.07,.19,.97) 0s 6 alternate"
          : undefined,
        outline: "none"
      }}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      tabIndex={0}
    >
      {/* Game Entities */}
      <Player position={state.player} />
      <Enemy position={state.enemy} appearance={ALI_APPEARANCES[aliIdx]} />
      {state.treats.map((t, i) => (
        <Treat key={i} position={t} />
      ))}
      {state.ovens.map((o, i) => (
        <Oven key={i} position={o} />
      ))}
      {state.seasonings.map((s, i) => (
        <Seasoning key={i} position={s} />
      ))}

      {/* Evil Taunt */}
      {taunt && tauntPos && state.started && !state.gameOver && (
        <div
          style={{
            position: "absolute",
            left: tauntPos.x - 80,
            top: tauntPos.y - 34,
            width: 160,
            textAlign: "center",
            zIndex: 25,
            pointerEvents: "none",
            color: "#d50000",
            fontSize: 18 * scale,
            fontWeight: "bold",
            textShadow: "0 2px 8px #000, 0 0px 4px #fff4",
            filter: shake ? "blur(1px)" : undefined,
            transition: "opacity 0.1s",
            opacity: shake ? 0.85 : 1,
            fontFamily: "'Creepster', 'monospace', cursive, sans-serif",
            userSelect: "none",
          }}
        >
          {taunt}
        </div>
      )}
      {taunt && !tauntPos && state.gameOver && (
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: 60 * scale,
            textAlign: "center",
            zIndex: 25,
            pointerEvents: "none",
            color: "#d50000",
            fontSize: 20 * scale,
            fontWeight: "bold",
            textShadow: "0 2px 8px #000, 0 0px 4px #fff4",
            filter: shake ? "blur(1px)" : undefined,
            transition: "opacity 0.1s",
            opacity: shake ? 0.85 : 1,
            fontFamily: "'Creepster', 'monospace', cursive, sans-serif",
            userSelect: "none",
          }}
        >
          {taunt}
        </div>
      )}

      {/* Blood Splatter Effect */}
      {showBlood && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 90,
            background: "rgba(120,0,0,0.15)",
            animation: "fade-blood 0.8s linear 0s 1",
          }}
        >
          {BLOOD_SPLATTERS.map((s, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: s.left,
                top: s.top,
                width: s.size,
                height: s.size,
                background:
                  "radial-gradient(circle at 60% 40%, #d32f2f 55%, #b71c1c 90%)",
                borderRadius: "50%",
                opacity: s.opacity,
                transform: `rotate(${s.rot}deg) scale(${0.95 + Math.random() * 0.15})`,
                boxShadow:
                  "0 0 24px 2px rgba(180,0,0,0.38), 0 0 0 6px #b71c1c22",
                filter: "blur(0.5px)",
                zIndex: 91,
                pointerEvents: "none",
              }}
            ></div>
          ))}
        </div>
      )}

      {/* HUD */}
      <div
        style={{
          position: "absolute",
          top: 8,
          left: 8,
          background: "#fff9",
          borderRadius: 8,
          padding: "6px 18px",
          fontWeight: "bold",
          fontSize: 18 * scale,
          color: "#333",
          boxShadow: "0 1px 6px #0002",
          zIndex: 10,
          userSelect: "none",
        }}
      >
        Score: {state.score}
      </div>

      {/* Overlay Screens */}
      {!state.started && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#222a",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 20,
          }}
        >
          <h2
            style={{
              color: "#fff",
              fontSize: 32 * scale,
              marginBottom: 16,
              letterSpacing: 1.2,
            }}
          >
            Arlo's Treat Chase!
          </h2>
          <div
            style={{
              color: "#fff",
              background: "#1565c0ee",
              borderRadius: 10,
              padding: "12px 22px",
              marginBottom: 16,
              fontSize: 18 * scale,
              boxShadow: "0 2px 8px #2227",
              fontWeight: 500,
              maxWidth: 300,
              textAlign: "center",
            }}
          >
            Use <b>arrow keys</b> (desktop) or <b>swipe</b> (mobile) to move Arlo.
          </div>
          <button
            style={{
              fontSize: 22 * scale,
              padding: "14px 36px",
              borderRadius: 12,
              background: "#4caf50",
              color: "#fff",
              fontWeight: "bold",
              border: "none",
              boxShadow: "0 2px 8px #2224",
              marginTop: 12,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onClick={handleStart}
          >
            Start Game
          </button>
        </div>
      )}
      {state.gameOver && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "#222c",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 30,
          }}
        >
          <h2
            style={{
              color: "#fff",
              fontSize: 32 * scale,
              marginBottom: 8,
              letterSpacing: 1.2,
            }}
          >
            Game Over!
          </h2>
          <div
            style={{
              color: "#ffeb3b",
              fontWeight: "bold",
              fontSize: 22 * scale,
              marginBottom: 12,
              textShadow: "0 2px 6px #0008",
            }}
          >
            Final Score: {state.score}
          </div>
          <button
            style={{
              fontSize: 20 * scale,
              padding: "11px 30px",
              borderRadius: 10,
              background: "#e53935",
              color: "#fff",
              fontWeight: "bold",
              border: "none",
              boxShadow: "0 2px 8px #2226",
              marginTop: 8,
              cursor: "pointer",
            }}
            onClick={handleStart}
          >
            Restart
          </button>
        </div>
      )}

      {/* Animations */}
      <style>
        {`
        @keyframes shake-screen {
          0% { transform: translate(0px, 0px) rotate(0deg);}
          20% { transform: translate(-6px, 6px) rotate(-2deg);}
          40% { transform: translate(7px, -4px) rotate(1deg);}
          60% { transform: translate(-4px, 6px) rotate(1deg);}
          80% { transform: translate(4px, -6px) rotate(-2deg);}
          100% { transform: translate(0, 0) rotate(0deg);}
        }
        @keyframes fade-blood {
          0% { opacity: 1;}
          90% { opacity: 1;}
          100% { opacity: 0;}
        }
        `}
      </style>
    </div>
  );
};

export default Game;