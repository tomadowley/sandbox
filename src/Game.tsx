import React, { useRef, useState, useEffect } from "react";
import { GameEngine } from "react-game-engine";

// --- Horror Sound Placeholders ---
const HEARTBEAT_URL = "https://cdn.pixabay.com/audio/2022/03/15/audio_115b9ccf4c.mp3"; // free heartbeat
const SCREAM_URL = "https://cdn.pixabay.com/audio/2022/02/23/audio_115fb1b0fd.mp3";  // free horror scream

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

// ---- 8-bit horror Ali: animated, morphing, nightmare fuel ----
const ALI_APPEARANCES = [
  {
    bg: "#1a0000",
    face: (
      <span style={{ fontFamily: "monospace", color: "#ff2222", fontSize: 18, textShadow: "0 0 12px #ff0000, 0 0 2px #fff" }}>
        <span role="img" aria-label="glowing eyes">👁️‍🗨️</span>
        <span style={{ margin: "0 2px" }}>ಠ益ಠ</span>
        <span role="img" aria-label="fangs">🩸</span>
      </span>
    ),
    blood: true,
    border: "4px solid #7f0000",
    label: "Ali-DemonEyes"
  },
  {
    bg: "linear-gradient(135deg, #420303 70%, #d32f2f 100%)",
    face: (
      <span style={{ fontFamily: "monospace", color: "#fff", fontSize: 17, textShadow: "0 0 8px #f00, 0 0 2px #fff" }}>
        <span role="img" aria-label="teeth">🦷</span>
        <span style={{ margin: "0 2px" }}>ʘ͜ʖʘ</span>
        <span role="img" aria-label="blood tears">🩸</span>
      </span>
    ),
    blood: true,
    border: "4px double #ff1744",
    label: "Ali-Teeth"
  },
  {
    bg: "radial-gradient(circle, #111 70%, #9e0000 100%)",
    face: (
      <span style={{ fontFamily: "monospace", color: "#f44336", fontSize: 22, letterSpacing: "2px", textShadow: "0 0 12px #f00" }}>
        <span role="img" aria-label="skull">💀</span>
        <span style={{ margin: "0 2px" }}>☠︎</span>
        <span role="img" aria-label="eye">👁️</span>
      </span>
    ),
    blood: true,
    border: "4px groove #c62828",
    label: "Ali-Skull"
  },
  {
    bg: "#0c0017",
    face: (
      <span style={{ fontFamily: "monospace", color: "#e040fb", fontSize: 22, textShadow: "0 0 16px #d500f9" }}>
        <span role="img" aria-label="tentacles">🐙</span>
        <span style={{ margin: "0 2px" }}>≋(͒•˛•͒)≋</span>
        <span role="img" aria-label="gore">🩸</span>
      </span>
    ),
    blood: true,
    border: "4px dashed #6a1b9a",
    label: "Ali-Tentacle"
  },
  {
    bg: "linear-gradient(120deg, #c62828 70%, #000 100%)",
    face: (
      <span style={{ fontFamily: "monospace", color: "#fff", fontSize: 20, textShadow: "0 0 8px #b71c1c" }}>
        <span role="img" aria-label="demon">😈</span>
        <span style={{ margin: "0 2px" }}>{">:E"}</span>
        <span role="img" aria-label="bones">🦴</span>
      </span>
    ),
    blood: true,
    border: "4px dotted #d32f2f",
    label: "Ali-DemonSmirk"
  }
];

// ---- Gore: explicit, horror taunts ----
const ALI_TAUNTS = [
  "I'll rip out your heart and feast on your bones, Arlo.",
  "Your screams will echo in my oven!",
  "I'll lap up your blood, little dog.",
  "Tonight, you become my stew of flesh and fear.",
  "No treat can save you from dismemberment.",
  "Let me gnaw your paws off slowly...",
  "Your howls excite me. More. Louder.",
  "Look at me while I devour you.",
  "Your skin will sizzle. Your soul will burn.",
  "The hunt is over. The slaughter begins.",
  "I'll drag your corpse through rivers of blood.",
  "Your entrails will decorate my kitchen.",
  "Time to chew your eyes from their sockets.",
  "You smell delicious—like terror and meat.",
  "Every step you take leaks more blood.",
  "You can't run from what's inside you.",
  "I'll cook you alive, screaming.",
  "Your body will feed my nightmares.",
  "Salt your wounds, then salt your flesh.",
  "I want to taste your fear and fur.",
  "You are already dead, Arlo.",
];

// ---- Animated, morphing, gory horror Ali that leaves a blood trail ----
const Enemy = ({
  position,
  appearance,
  animFrame,
}: {
  position: Vec2;
  appearance: typeof ALI_APPEARANCES[0];
  animFrame: number;
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
      boxShadow: "0 2px 30px #000a, 0 0 32px 8px #f00b",
      border: appearance.border,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      fontWeight: "bold",
      fontSize: 22 + 2 * Math.sin(animFrame / 2),
      userSelect: "none",
      flexDirection: "column",
      textShadow: appearance.blood
        ? `0 0 8px #f00, 0 0px 2px #fff, 0 0 20px #ff1744`
        : "0 1px 2px #000",
      zIndex: 20,
      transition: "background 0.2s, border 0.2s",
      overflow: "visible",
      filter: animFrame % 10 < 5 ? "brightness(1.3) drop-shadow(0 0 8px #ff0044ee)" : "none",
      animation: animFrame % 20 < 8 ? "ali-flicker 0.10s alternate infinite" : undefined,
    }}
    aria-label={appearance.label}
  >
    <div style={{
      marginTop: 2 + 2 * Math.sin(animFrame / 3),
      animation: animFrame % 10 < 3 ? "ali-face-morph 0.19s alternate infinite" : undefined,
      filter: animFrame % 8 === 0 ? "contrast(2.0) hue-rotate(30deg) blur(0.5px)" : "none"
    }}>
      {appearance.face}
    </div>
    {/* Gore drip below Ali */}
    <div style={{
      position: "absolute",
      left: ENEMY_SIZE / 2 - 6,
      top: ENEMY_SIZE - 6,
      width: 12 + Math.abs(Math.sin(animFrame / 3)) * 5,
      height: 14 + Math.abs(Math.sin(animFrame / 2)) * 3,
      background: "radial-gradient(circle,#b71c1c 60%,#ff1744 100%)",
      borderRadius: "50%",
      opacity: 0.74 + 0.2 * Math.abs(Math.sin(animFrame / 7)),
      zIndex: 21,
      boxShadow: "0 2px 10px #f00c, 0 0 6px #b71c1c99",
      transition: "width 0.1s,height 0.1s",
      pointerEvents: "none"
    }} />
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

// --- Hellish oven: flickering fire, blood, gore ---
const Oven = ({ position, animFrame }: { position: Vec2; animFrame: number }) => (
  <div
    style={{
      position: "absolute",
      left: position.x,
      top: position.y,
      width: HAZARD_SIZE,
      height: HAZARD_SIZE,
      background: animFrame % 10 < 5
        ? "radial-gradient(circle at 50% 30%,#ffd600 50%,#b71c1c 100%)"
        : "radial-gradient(circle at 50% 60%,#b71c1c 60%,#222 100%)",
      borderRadius: 5,
      border: "3px ridge #b71c1c",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 18 + (animFrame % 4),
      color: "#fff",
      boxShadow: `0 0 16px 3px #ff174499, 0 0 8px #c62828`,
      overflow: "visible",
    }}
    aria-label="Oven"
  >
    <span
      style={{
        filter: animFrame % 10 < 4 ? "brightness(1.4)" : undefined,
        textShadow: "0 0 6px #ffeb3b,0 0 18px #d32f2f,0 0 2px #fff"
      }}
    >🔥</span>
    {/* Splattered blood */}
    <span style={{
      position: "absolute",
      right: -8, bottom: -6,
      fontSize: 24,
      color: "#f00",
      opacity: 0.85,
      textShadow: "0 0 6px #b71c1c"
    }}>🩸</span>
    {/* Bone */}
    <span style={{
      position: "absolute",
      left: -7, top: -7,
      fontSize: 14,
      color: "#fff"
    }}>🦴</span>
  </div>
);

// --- Blood-spewing skull seasoning ---
const Seasoning = ({ position, animFrame }: { position: Vec2; animFrame: number }) => (
  <div
    style={{
      position: "absolute",
      left: position.x,
      top: position.y,
      width: HAZARD_SIZE,
      height: HAZARD_SIZE,
      background: "#32031d",
      borderRadius: 5,
      border: "2px solid #c62828",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 18,
      color: "#fff",
      overflow: "visible",
      boxShadow: "0 0 8px #b71c1c, 0 0 24px #37011c90",
    }}
    aria-label="Seasoning"
  >
    {/* Skull & bones */}
    <span style={{
      fontSize: 22,
      textShadow: "0 1px 2px #000"
    }}>💀</span>
    {/* Blood spew */}
    <span style={{
      position: "absolute",
      left: HAZARD_SIZE / 2 - 3,
      top: HAZARD_SIZE - 3,
      fontSize: 14 + (animFrame % 4),
      color: "#ff1744",
      opacity: 0.7 + 0.2 * Math.abs(Math.sin(animFrame / 2)),
      filter: "blur(0.5px)",
      textShadow: "0 0 6px #b71c1c"
    }}>🩸</span>
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

// ----- Pools of blood & body parts -----
const GORE_PARTS = [
  { emoji: "🦴", label: "Bone" },
  { emoji: "👁️", label: "Eyeball" },
  { emoji: "🍖", label: "MeatChunk" },
  { emoji: "🩸", label: "BloodPool" },
  { emoji: "🦷", label: "Tooth" },
  { emoji: "🐾", label: "BloodyPaw" },
  { emoji: "🫀", label: "Heart" },
  { emoji: "🧠", label: "Brain" },
  { emoji: "👅", label: "Tongue" },
  { emoji: "🦴", label: "Bone2" },
];

function randomGoreProps(num: number): { pos: Vec2; kind: typeof GORE_PARTS[0] }[] {
  let out = [];
  for (let i = 0; i < num; ++i) {
    out.push({
      pos: getRandomPos(24),
      kind: GORE_PARTS[Math.floor(Math.random() * GORE_PARTS.length)],
    });
  }
  return out;
}

const initialTreats = Array.from({ length: 3 }, () => getRandomPos(10));
const initialOvens = [getRandomPos(30)];
const initialSeasonings = [getRandomPos(30)];
const initialGore = randomGoreProps(8 + Math.floor(Math.random() * 6));

type BloodTrail = { x: number; y: number; t: number };

type GameState = {
  player: Vec2;
  enemy: Vec2;
  enemyVel: Vec2; // Ali's velocity (vx, vy)
  treats: Vec2[];
  ovens: Vec2[];
  seasonings: Vec2[];
  goreProps: { pos: Vec2; kind: typeof GORE_PARTS[0] }[];
  bloodTrail: BloodTrail[];
  score: number;
  started: boolean;
  gameOver: boolean; // Game has ended (static overlay shown)
  cutscenePlaying: boolean; // Jump scare/cutscene is running (true only during cutscene, then false)
  cutsceneFinished: boolean; // Cutscene has finished (static game over shown)
};

function getInitialState(): GameState {
  return {
    player: { ...INITIAL_PLAYER },
    enemy: { ...INITIAL_ENEMY },
    enemyVel: { x: 0, y: 0 },
    treats: initialTreats.map((t) => ({ ...t })),
    ovens: initialOvens.map((o) => ({ ...o })),
    seasonings: initialSeasonings.map((s) => ({ ...s })),
    goreProps: initialGore.map((g) => ({ pos: { ...g.pos }, kind: g.kind })),
    bloodTrail: [],
    score: 0,
    started: false,
    gameOver: false,
    cutscenePlaying: false,
    cutsceneFinished: false,
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
  const [animFrame, setAnimFrame] = useState(0);

  // Focus management for keyboard/game container
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Sound refs
  const heartbeatRef = useRef<HTMLAudioElement>(null);
  const screamRef = useRef<HTMLAudioElement>(null);

  // For managing the game over cutscene timer (so we can clean up on restart)
  const cutsceneTimeouts = useRef<NodeJS.Timeout[]>([]);

  // --- Animation/game loop for blood trail and horror flicker ---
  useEffect(() => {
    let req: number;
    function tick() {
      setAnimFrame((f) => f + 1);
      req = requestAnimationFrame(tick);
    }
    req = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(req);
  }, []);

  // --- Ali appearance cycling ---
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (state.started && !state.gameOver && !state.cutscenePlaying && !state.cutsceneFinished) {
      interval = setInterval(() => {
        setAliIdx((prev) => {
          let next;
          do {
            next = Math.floor(Math.random() * ALI_APPEARANCES.length);
          } while (next === prev && ALI_APPEARANCES.length > 1);
          return next;
        });
      }, 700 + Math.random() * 400);
    }
    return () => interval && clearInterval(interval);
    // eslint-disable-next-line
  }, [state.started, state.gameOver, state.cutscenePlaying, state.cutsceneFinished]);

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

  // --- Keyboard Controls (Disabled during game over sequence) ---
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (!state.started || state.cutscenePlaying || state.cutsceneFinished || state.gameOver) return;
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
  }, [state.started, state.cutscenePlaying, state.cutsceneFinished, state.gameOver, state.player]);

  // Mobile Swipe/Touch Controls (Disabled during game over sequence)
  function onTouchStart(e: React.TouchEvent) {
    if (state.cutscenePlaying || state.cutsceneFinished || state.gameOver) return;
    if (e.touches.length > 0) {
      touchStart.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      };
    }
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (state.cutscenePlaying || state.cutsceneFinished || state.gameOver) return;
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    const threshold = 12;
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
      if (!prev.started || prev.cutscenePlaying || prev.cutsceneFinished || prev.gameOver) return prev;
      const newX = Math.max(0, Math.min(GAME_WIDTH - PLAYER_SIZE, prev.player.x + dx));
      const newY = Math.max(0, Math.min(GAME_HEIGHT - PLAYER_SIZE, prev.player.y + dy));
      return { ...prev, player: { x: newX, y: newY } };
    });
  }

  // Enemy AI Movement (Add blood trail, inertia/momentum)
  useEffect(() => {
    // Ali moves only when: started, not gameOver, not during or after cutscene
    if (!state.started || state.gameOver || state.cutscenePlaying || state.cutsceneFinished) return;
    const interval = setInterval(() => {
      setState((prev) => {
        if (!prev.started || prev.gameOver || prev.cutscenePlaying || prev.cutsceneFinished) return prev;
        const { enemy, player, enemyVel, bloodTrail } = prev;

        // --- Momentum/inertia chase ---
        // Parameters
        // REDUCED: Ali's max speed and acceleration for less overwhelming pursuit
        const ACCEL = 1.2; // Maximum acceleration per tick (was 2.5)
        const MAX_SPEED = 7; // Maximum velocity per tick (was 15)

        // Vector to player
        let toPlayerX = player.x - enemy.x;
        let toPlayerY = player.y - enemy.y;
        // Normalize toPlayer vector
        const dist = Math.sqrt(toPlayerX * toPlayerX + toPlayerY * toPlayerY) || 1;
        let dirX = toPlayerX / dist;
        let dirY = toPlayerY / dist;

        // Accelerate vx, vy toward player
        let vx = enemyVel.x + dirX * ACCEL;
        let vy = enemyVel.y + dirY * ACCEL;

        // Clamp speed to max
        const speed = Math.sqrt(vx * vx + vy * vy);
        if (speed > MAX_SPEED) {
          vx = (vx / speed) * MAX_SPEED;
          vy = (vy / speed) * MAX_SPEED;
        }

        // If very close to player, slow down (to avoid jitter)
        let stopDist = 8;
        if (dist < stopDist) {
          vx *= 0.7;
          vy *= 0.7;
        }

        // Update position by velocity
        let newX = Math.max(0, Math.min(GAME_WIDTH - ENEMY_SIZE, enemy.x + vx));
        let newY = Math.max(0, Math.min(GAME_HEIGHT - ENEMY_SIZE, enemy.y + vy));

        // Leave a blood block trail behind Ali
        let newBloodTrail = [
          ...bloodTrail,
          { x: enemy.x + ENEMY_SIZE / 2 - 7, y: enemy.y + ENEMY_SIZE / 2 - 7, t: animFrame }
        ].filter((b) => animFrame - b.t < 60); // fade after 60 frames

        return {
          ...prev,
          enemy: { x: newX, y: newY },
          enemyVel: { x: vx, y: vy },
          bloodTrail: newBloodTrail
        };
      });
    }, 50); // Faster tick for smoother inertia
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [state.started, state.gameOver, state.cutscenePlaying, state.cutsceneFinished]);

  // --- DeviceOrientation-based tilt controls for Arlo (mobile only) ---
  useEffect(() => {
    // Helper: Detect if device is mobile/touch capable
    function isMobileOrTablet() {
      return (
        ("ontouchstart" in window) ||
        (navigator.maxTouchPoints && navigator.maxTouchPoints > 1)
      );
    }

    // Only enable on mobile/touch devices
    if (!isMobileOrTablet()) return;

    let lastMove = { x: 0, y: 0 };

    // Deadzone (minimum tilt angle to trigger movement), in degrees
    const DEADZONE = 15;
    // Movement step per tilt event, in pixels (match arrow/swipe)
    const STEP = 24;

    // Prevent jitter: only move if tilt passes deadzone and direction changed
    function handleOrientation(e: DeviceOrientationEvent) {
      if (!state.started || state.cutscenePlaying || state.cutsceneFinished || state.gameOver) return;
      // gamma: left/right tilt (-90 to 90), beta: front/back (-180 to 180)
      const gamma = e.gamma ?? 0; // left/right
      const beta = e.beta ?? 0;   // front/back

      let dx = 0, dy = 0;
      // Left/right tilt (gamma): move Arlo left/right
      if (gamma > DEADZONE) dx = STEP;
      else if (gamma < -DEADZONE) dx = -STEP;
      // Forward/backward tilt (beta): move Arlo up/down
      // On most phones, beta=90 is flat, so subtract 90 to get relative angle
      const relBeta = beta - 90;
      if (relBeta > DEADZONE) dy = STEP;
      else if (relBeta < -DEADZONE) dy = -STEP;

      // Only move if new direction, to avoid repeated moves on same tilt
      if (dx !== lastMove.x || dy !== lastMove.y) {
        lastMove = { x: dx, y: dy };
        if (dx !== 0 || dy !== 0) {
          movePlayer(dx, dy);
        }
      }
      // If no tilt, reset lastMove so movement can resume when tilt resumes
      if (dx === 0 && dy === 0) lastMove = { x: 0, y: 0 };
    }

    window.addEventListener("deviceorientation", handleOrientation, true);
    return () => {
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
    // eslint-disable-next-line
  }, [state.started, state.cutscenePlaying, state.cutsceneFinished, state.gameOver]);

  // Main Game Loop (collisions, treat collection, hazards, game over)
  useEffect(() => {
    if (!state.started || state.gameOver || state.cutscenePlaying || state.cutsceneFinished) return;
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

    if ((hitHazard || enemyTouch)) {
      // If already in game over or cutscene, do nothing
      setShowBlood(true);
      setShake(true);
      // Prevent retrigger
      setState((prev) => {
        // Only trigger once per run
        if (prev.gameOver || prev.cutscenePlaying || prev.cutsceneFinished) return prev;
        return { ...prev, cutscenePlaying: true, gameOver: false, cutsceneFinished: false };
      });

      // Clear any previous timeouts
      cutsceneTimeouts.current.forEach(clearTimeout);
      cutsceneTimeouts.current = [];
      // Sequence: shake, scream, cutscene, then finish
      cutsceneTimeouts.current.push(
        setTimeout(() => setShake(false), 800)
      );
      cutsceneTimeouts.current.push(
        setTimeout(() => {
          if (heartbeatRef.current) {
            heartbeatRef.current.pause();
            heartbeatRef.current.currentTime = 0;
          }
          if (screamRef.current) screamRef.current.play();
        }, 600)
      );
      // Show cutscene for 2 seconds, then show static game over overlay
      cutsceneTimeouts.current.push(
        setTimeout(() => {
          setShowBlood(false);
          setState((prev) => ({
            ...prev,
            cutscenePlaying: false,
            cutsceneFinished: true,
            gameOver: true,
          }));
        }, 2000)
      );
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
  }, [state.player, state.enemy, state.treats, state.started, state.gameOver, state.cutscenePlaying, state.cutsceneFinished]);

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

  // Always play horror heartbeat while game is running (stop on cutscene/game over)
  useEffect(() => {
    if (state.started && !state.cutscenePlaying && !state.cutsceneFinished && !state.gameOver) {
      if (heartbeatRef.current) {
        heartbeatRef.current.loop = true;
        heartbeatRef.current.volume = 0.6;
        heartbeatRef.current.play().catch(() => {});
      }
    } else {
      if (heartbeatRef.current) {
        heartbeatRef.current.pause();
        heartbeatRef.current.currentTime = 0;
      }
    }
  }, [state.started, state.cutscenePlaying, state.cutsceneFinished, state.gameOver]);

  // Start/Restart
  function handleStart() {
    // Clear all cutscene/game over timeouts
    cutsceneTimeouts.current.forEach(clearTimeout);
    cutsceneTimeouts.current = [];
    setState(getInitialState());
    setTimeout(() => {
      setState((prev) => ({
        ...prev,
        started: true,
        enemyVel: { x: 0, y: 0 } // Reset Ali's velocity on start/restart
      }));
      if (gameContainerRef.current) {
        gameContainerRef.current.focus();
      }
    }, 200);
    setTaunt(null);
    setTauntPos(null);
    setShake(false);
    setShowBlood(false);
    setAliIdx(Math.floor(Math.random() * ALI_APPEARANCES.length));
    if (heartbeatRef.current) {
      heartbeatRef.current.play().catch(() => {});
    }
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
      {/* Blood trail left by Ali */}
      {state.bloodTrail.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: b.x,
            top: b.y,
            width: 15,
            height: 15,
            background: "radial-gradient(circle,#c62828 60%,#ff1744 100%)",
            borderRadius: "50%",
            opacity: Math.max(0, 0.75 - (animFrame - b.t) * 0.012),
            boxShadow: "0 0 8px #b71c1c66, 0 0 14px #f00c",
            pointerEvents: "none",
            zIndex: 7,
            filter: "blur(0.5px)",
          }}
        ></div>
      ))}
      {/* Pools of blood and gore */}
      {state.goreProps.map((g, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: g.pos.x,
            top: g.pos.y,
            width: 24 + (g.kind.emoji === "🩸" ? 18 : 0),
            height: 24,
            fontSize: g.kind.emoji === "🩸" ? 34 : 26,
            userSelect: "none",
            filter: "blur(0.3px) drop-shadow(0 2px 8px #a00b)",
            zIndex: 5,
            opacity: g.kind.emoji === "🩸"
              ? (0.7 + 0.17 * Math.sin(animFrame / 13 + i))
              : 0.93,
            transform: g.kind.emoji === "🩸"
              ? `rotate(${animFrame % 360}deg)`
              : undefined,
          }}
          aria-label={g.kind.label}
        >
          {g.kind.emoji}
        </div>
      ))}
      <Enemy position={state.enemy} appearance={ALI_APPEARANCES[aliIdx]} animFrame={animFrame} />
      {state.treats.map((t, i) => (
        <Treat key={i} position={t} />
      ))}
      {state.ovens.map((o, i) => (
        <Oven key={i} position={o} animFrame={animFrame} />
      ))}
      {state.seasonings.map((s, i) => (
        <Seasoning key={i} position={s} animFrame={animFrame} />
      ))}

      {/* Evil Taunt */}
      {/* Horror Taunt */}
      {taunt && tauntPos && state.started && !state.gameOver && (
        <div
          style={{
            position: "absolute",
            left: tauntPos.x - 90,
            top: tauntPos.y - 48,
            width: 180,
            textAlign: "center",
            zIndex: 30,
            pointerEvents: "none",
            color: "#ff2222",
            fontSize: 19 * scale,
            fontWeight: "bold",
            textShadow: "0 2px 16px #b71c1c, 0 0px 4px #fff4",
            filter: shake ? "blur(1.4px) hue-rotate(30deg)" : "contrast(1.3)",
            transition: "opacity 0.1s",
            opacity: shake ? 0.77 : 1,
            fontFamily: "'Creepster', 'monospace', cursive, sans-serif",
            userSelect: "none",
            animation: "horror-flicker 0.25s alternate infinite"
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
            zIndex: 40,
            pointerEvents: "none",
            color: "#ff2222",
            fontSize: 23 * scale,
            fontWeight: "bold",
            textShadow: "0 2px 16px #b71c1c, 0 0px 4px #fff4",
            filter: shake ? "blur(1.6px) hue-rotate(-30deg)" : "contrast(1.6)",
            transition: "opacity 0.1s",
            opacity: shake ? 0.55 : 1,
            fontFamily: "'Creepster', 'monospace', cursive, sans-serif",
            userSelect: "none",
            animation: "horror-flicker 0.16s alternate infinite"
          }}
        >
          {taunt}
        </div>
      )}

      {/* Blood Splatter Effect */}
      {/* Blood Splatter Effect */}
      {showBlood && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            zIndex: 90,
            background: "rgba(120,0,0,0.19)",
            animation: "fade-blood 1.1s linear 0s 1",
            filter: "contrast(1.4) blur(0.6px) brightness(0.87)"
          }}
        >
          {/* Gore and blood pools */}
          {BLOOD_SPLATTERS.map((s, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: s.left,
                top: s.top,
                width: s.size + (i % 2 === 0 ? 12 : -4),
                height: s.size + (i % 3 === 0 ? 14 : -2),
                background:
                  "radial-gradient(circle at 60% 40%, #d32f2f 55%, #b71c1c 90%)",
                borderRadius: "50%",
                opacity: s.opacity,
                transform: `rotate(${s.rot + animFrame * 7}deg) scale(${0.95 + Math.random() * 0.20})`,
                boxShadow:
                  "0 0 24px 2px rgba(180,0,0,0.48), 0 0 0 12px #b71c1c22",
                filter: "blur(0.7px)",
                zIndex: 91,
                pointerEvents: "none",
              }}
            ></div>
          ))}
          {/* Dismembered bits */}
          {GORE_PARTS.map((g, i) =>
            <span
              key={g.label}
              style={{
                position: "absolute",
                left: 40 + Math.sin(animFrame / 8 + i) * 110 + i * 11,
                top: 80 + Math.cos(animFrame / 13 + i) * 80 + i * 6,
                fontSize: 25 + (i % 3 ? 3 : 0),
                filter: "blur(0.3px) drop-shadow(0 2px 8px #a00b)",
                opacity: 0.75,
                zIndex: 92,
                pointerEvents: "none",
                userSelect: "none"
              }}
            >
              {g.emoji}
            </span>
          )}
        </div>
      )}

      {/* HUD */}
      {/* HUD */}
      <div
        style={{
          position: "absolute",
          top: 8,
          left: 8,
          background: "#fff9",
          borderRadius: 8,
          padding: "8px 18px 10px 18px",
          fontWeight: "bold",
          fontSize: 19 * scale,
          color: "#d32f2f",
          boxShadow: "0 1px 16px #0004",
          zIndex: 10,
          userSelect: "none",
          textShadow: "0 0 8px #f00, 0 1px 2px #b71c1c"
        }}
      >
        Blood Collected: <span style={{ color: "#b71c1c", fontWeight: 900 }}>{state.score}</span>
      </div>

      {/* Overlay Screens */}
      {/* Start Screen */}
      {!state.started && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(circle, #1a0000 85%, #000 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
            filter: "contrast(1.19) hue-rotate(-10deg)",
            boxShadow: "inset 0 0 120px #f00b"
          }}
        >
          <h2
            style={{
              color: "#fff",
              fontSize: 36 * scale,
              marginBottom: 13,
              letterSpacing: 2.2,
              textShadow: "0 0 20px #f44336,0 1px 2px #b71c1c",
              fontFamily: "'Creepster', 'monospace', cursive, sans-serif"
            }}
          >
            ARLO'S NIGHTMARE FEAST
          </h2>
          <div
            style={{
              color: "#fff",
              background: "#6a1b9aee",
              borderRadius: 10,
              padding: "14px 26px",
              marginBottom: 16,
              fontSize: 19 * scale,
              boxShadow: "0 2px 18px #2227",
              fontWeight: 500,
              maxWidth: 330,
              textAlign: "center",
              textShadow: "0 1px 8px #0009"
            }}
          >
            <b>Survive</b> Ali's bloody pursuit.<br />
            <span style={{ color: "#ff1744" }}>Collect meat, avoid ovens, run from the demon chef.<br /></span>
            <span style={{ color: "#fff" }}>Use <b>arrow keys</b> (desktop) or <b>swipe</b> (mobile) to move.</span>
          </div>
          <button
            style={{
              fontSize: 24 * scale,
              padding: "18px 44px",
              borderRadius: 12,
              background: "linear-gradient(90deg,#b71c1c,#4caf50)",
              color: "#fff",
              fontWeight: "bold",
              border: "none",
              boxShadow: "0 2px 18px #2229",
              marginTop: 12,
              cursor: "pointer",
              transition: "background 0.2s",
              letterSpacing: 2,
              textShadow: "0 2px 8px #0008"
            }}
            onClick={handleStart}
          >
            BEGIN SLAUGHTER
          </button>
        </div>
      )}

      {/* Game Over/Cutscene Overlay */}
      {(state.cutscenePlaying || state.cutsceneFinished) && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: state.cutscenePlaying
              ? "radial-gradient(circle, #ff1744 70%, #000 100%)"
              : "radial-gradient(circle, #1a0000 90%, #000 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 100,
            boxShadow: "inset 0 0 160px #ff1744",
            overflow: "hidden",
          }}
        >
          {/* Jump scare/cutscene: Ali devours Arlo (only if cutscene is playing) */}
          {state.cutscenePlaying ? (
            <div style={{
              animation: "jump-scare-zoom 0.66s cubic-bezier(.1,2.8,.9,1) 0s 1",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}>
              <div style={{
                width: 200 * scale,
                height: 200 * scale,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                background: "#000",
                boxShadow: "0 0 38px #f00d",
                border: "12px solid #b71c1c",
                marginBottom: 30 * scale,
                overflow: "hidden",
              }}>
                <Enemy position={{ x: 0, y: 0 }} appearance={ALI_APPEARANCES[(aliIdx + 2) % ALI_APPEARANCES.length]} animFrame={animFrame + 33} />
              </div>
              <div
                style={{
                  color: "#fff",
                  fontSize: 36 * scale,
                  fontWeight: "bold",
                  textShadow: "0 0 30px #ff1744,0 0 6px #fff,0 1px 2px #b71c1c",
                  fontFamily: "'Creepster', 'monospace', cursive, sans-serif",
                  padding: "6px 0"
                }}
              >
                YOU ARE MEAT NOW
              </div>
            </div>
          ) : (
            <>
              {/* Static game over screen, shown only after cutscene has finished */}
              <div style={{ position: "relative", width: 160, height: 120, marginBottom: 14 }}>
                <Enemy position={{ x: 60, y: 10 }} appearance={ALI_APPEARANCES[aliIdx]} animFrame={animFrame + 17} />
                {/* Cooked/dismembered Arlo */}
                <div style={{
                  position: "absolute",
                  left: 60,
                  top: 55,
                  zIndex: 12
                }}>
                  <div
                    style={{
                      width: 36, height: 36,
                      background: "radial-gradient(circle,#fff 65%,#b71c1c 100%)",
                      borderRadius: "50%",
                      border: "3px solid #222",
                      boxShadow: "0 2px 8px #b71c1c,0 0 24px #b71c1c90",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 32,
                      color: "#b71c1c",
                      userSelect: "none",
                      opacity: 0.77 + 0.17 * Math.sin(animFrame / 7),
                      transform: "rotate(-22deg)",
                    }}
                  >🥩</div>
                  {/* Arlo's cooked eye */}
                  <span style={{
                    position: "absolute",
                    left: 9, top: 18,
                    fontSize: 16,
                    color: "#fff"
                  }}>👁️</span>
                  {/* Blood spray */}
                  <span style={{
                    position: "absolute",
                    left: 16, top: 28,
                    fontSize: 22,
                    color: "#ff1744",
                    opacity: 0.8,
                    textShadow: "0 0 8px #b71c1c"
                  }}>🩸</span>
                </div>
                {/* Ali expands to devour Arlo */}
                <div style={{
                  position: "absolute",
                  left: 45,
                  top: 60,
                  width: 60,
                  height: 40,
                  background: "radial-gradient(circle at 70% 30%, #d32f2f 55%, #b71c1c 90%)",
                  borderRadius: "50%",
                  opacity: 0.33 + 0.18 * Math.sin(animFrame / 13),
                  zIndex: 11,
                  boxShadow: "0 0 40px #b71c1c99",
                  filter: "blur(0.5px)",
                }}></div>
              </div>
              <div
                style={{
                  color: "#ffeb3b",
                  fontWeight: "bold",
                  fontSize: 24 * scale,
                  marginBottom: 10,
                  textShadow: "0 2px 16px #ff1744,0 2px 6px #0008",
                  fontFamily: "'Creepster', 'monospace', cursive, sans-serif"
                }}
              >
                BLOOD SPILLED: <span style={{ color: "#b71c1c" }}>{state.score}</span>
              </div>
              <div
                style={{
                  color: "#fff",
                  background: "#d32f2f",
                  padding: "10px 18px",
                  fontWeight: "bold",
                  fontSize: 20 * scale,
                  borderRadius: 10,
                  margin: "0 0 10px 0",
                  textShadow: "0 0 10px #b71c1c",
                  fontFamily: "'Creepster', 'monospace', cursive, sans-serif"
                }}
              >
                <span>
                  <b>Arlo has been <span style={{ color: "#b71c1c" }}>dismembered</span> and <span style={{ color: "#ff1744" }}>devoured</span>.<br /></b>
                  <span style={{ color: "#ffeb3b" }}>Ali feasts on the flesh.<br /></span>
                  Your soul gurgles in the oven.<br />
                  <span style={{ color: "#fff" }}>Restart to try and survive the horror... <span style={{ fontSize: 22 }}>🦴🩸</span></span>
                </span>
              </div>
              <button
                style={{
                  fontSize: 22 * scale,
                  padding: "13px 36px",
                  borderRadius: 11,
                  background: "linear-gradient(90deg,#d32f2f,#b71c1c)",
                  color: "#fff",
                  fontWeight: "bold",
                  border: "none",
                  boxShadow: "0 2px 18px #2229",
                  marginTop: 8,
                  cursor: "pointer",
                  letterSpacing: 2,
                  textShadow: "0 2px 8px #0008"
                }}
                onClick={handleStart}
                disabled={state.cutscenePlaying}
              >
                {state.cutscenePlaying ? "..." : "RESURRECT"}
              </button>
            </>
          )}
        </div>
      )}

      {/* Animations */}
      {/* Audio effects */}
      <audio ref={heartbeatRef} src={HEARTBEAT_URL} preload="auto" />
      <audio ref={screamRef} src={SCREAM_URL} preload="auto" />

      {/* Horror background flicker */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: animFrame % 8 < 4
            ? "rgba(40,0,0,0.08)"
            : "rgba(0,0,0,0.13)",
          zIndex: 1,
          pointerEvents: "none",
          transition: "background 0.25s",
          animation: "horror-flicker 0.28s alternate infinite"
        }}
      />

      {/* Animations */}
      <style>
        {`
        @keyframes shake-screen {
          0% { transform: translate(0px, 0px) rotate(0deg);}
          20% { transform: translate(-10px, 9px) rotate(-2deg);}
          40% { transform: translate(12px, -7px) rotate(2deg);}
          60% { transform: translate(-8px, 12px) rotate(1deg);}
          80% { transform: translate(7px, -12px) rotate(-3deg);}
          100% { transform: translate(0, 0) rotate(0deg);}
        }
        @keyframes fade-blood {
          0% { opacity: 1;}
          90% { opacity: 1;}
          100% { opacity: 0;}
        }
        @keyframes horror-flicker {
          0% { filter: brightness(0.9) grayscale(0.1);}
          44% { filter: brightness(1.1) grayscale(0.2);}
          55% { filter: brightness(0.7) grayscale(0.3);}
          100% { filter: brightness(1.2) grayscale(0.14);}
        }
        @keyframes ali-flicker {
          0% { filter: brightness(1.07) contrast(1.2); }
          100% { filter: brightness(1.45) contrast(2.2) hue-rotate(-10deg);}
        }
        @keyframes ali-face-morph {
          0% { filter: blur(0.5px) hue-rotate(0deg);}
          100% { filter: blur(2.2px) hue-rotate(60deg);}
        }
        @keyframes jump-scare-zoom {
          0% { transform: scale(1);}
          50% { transform: scale(1.19) rotate(-10deg);}
          80% { transform: scale(2.3) rotate(8deg);}
          100% { transform: scale(1.3) rotate(-2deg);}
        }
        `}
      </style>
    </div>
  );
};

export default Game;