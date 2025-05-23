import React, { useEffect, useRef, useState } from "react";
import "./App.css";

// Insanely gruesome mobile-first game: Arlo (miniature deer) vs Ali (large man)
// Now with ultra-gore and much smarter Ali!

// Game constants
const GAME_WIDTH = 360; // px (mobile width)
const GAME_HEIGHT = 600; // px (mobile height)
const ARLO_SIZE = 40;
const ALI_SIZE = 60;
const MOVE_SPEED = 20; // px per move
const BASE_ALI_SPEED = 8; // px per frame
const ALI_SPEED_MAX = 16; // Ali can burst speed if close!
const ALI_JITTER = 14; // How much random zig-zag Ali does per move
const BLOOD_SPLASHES = 16; // How many blood splatters on kill

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
const BLOOD_EMOJI = "🩸";
const GORE_EMOJI = "🧠";
const RIB_EMOJI = "🦴";

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

type Position = { x: number; y: number };

function getDistance(a: Position, b: Position) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

const initialArlo: Position = { x: 40, y: GAME_HEIGHT / 2 - ARLO_SIZE / 2 };
const initialAli: Position = { x: GAME_WIDTH - ALI_SIZE - 40, y: GAME_HEIGHT / 2 - ALI_SIZE / 2 };

function randomAngle() {
  return Math.random() * Math.PI * 2;
}

function App() {
  const [arlo, setArlo] = useState<Position>(initialArlo);
  const [ali, setAli] = useState<Position>(initialAli);
  const [gameOver, setGameOver] = useState(false);
  const [winStage, setWinStage] = useState<"none"|"beg"|"attack"|"gore"|"aftermath">("none");
  const [blood, setBlood] = useState<{ x: number; y: number; angle: number; key: number; stage: number }[]>([]);
  const [showGore, setShowGore] = useState(false);
  const [shaking, setShaking] = useState(false);
  const gameRef = useRef<HTMLDivElement>(null);
  const [corpse, setCorpse] = useState<Position | null>(null);
  const [aliBegText, setAliBegText] = useState("");
  const [arloText, setArloText] = useState("");
  const [aliBegAnim, setAliBegAnim] = useState(false);

  // --- Smarter Ali AI ---
  useEffect(() => {
    if (gameOver) return;
    let lastAngle = randomAngle();
    let fakeoutTimer = 0;
    let fakeout = false;

    const interval = setInterval(() => {
      setAli((prevAli) => {
        // Vector from Arlo to Ali
        const dx = prevAli.x + ALI_SIZE / 2 - (arlo.x + ARLO_SIZE / 2);
        const dy = prevAli.y + ALI_SIZE / 2 - (arlo.y + ARLO_SIZE / 2);
        let dist = Math.max(1, Math.sqrt(dx * dx + dy * dy));

        // Panic: If Arlo is close, Ali sprints!
        let speed = BASE_ALI_SPEED + (dist < 100 ? ALI_SPEED_MAX : 0);

        // Ali's escape angle is away from Arlo, but not purely so: some randomness, and avoidance of corners.
        let angle = Math.atan2(dy, dx);

        // If Ali is close to wall, bias angle inward
        const wallBuffer = 36;
        if (prevAli.x < wallBuffer) angle = 0; // right
        if (prevAli.x > GAME_WIDTH - ALI_SIZE - wallBuffer) angle = Math.PI; // left
        if (prevAli.y < wallBuffer) angle = Math.PI / 2; // down
        if (prevAli.y > GAME_HEIGHT - ALI_SIZE - wallBuffer) angle = -Math.PI / 2; // up

        // Occasionally, Ali fakes out and reverses!
        if (Math.random() < 0.01 && !fakeout && dist > 60) {
          fakeout = true;
          fakeoutTimer = Math.floor(Math.random() * 10 + 6);
        }
        if (fakeout) {
          angle += Math.PI; // reverse!
          fakeoutTimer -= 1;
          if (fakeoutTimer <= 0) fakeout = false;
        }

        // Zig-zag: Add jitter
        angle += (Math.random() - 0.5) * 0.7;

        // Move
        let newX = prevAli.x + Math.cos(angle) * speed + (Math.random() - 0.5) * ALI_JITTER;
        let newY = prevAli.y + Math.sin(angle) * speed + (Math.random() - 0.5) * ALI_JITTER;

        newX = clamp(newX, 0, GAME_WIDTH - ALI_SIZE);
        newY = clamp(newY, 0, GAME_HEIGHT - ALI_SIZE);

        lastAngle = angle;

        return { x: newX, y: newY };
      });
    }, 33); // ~30fps
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [arlo, gameOver]);

  // Multi-stage win sequence:
  useEffect(() => {
    if (
      getDistance(
        { x: arlo.x + ARLO_SIZE / 2, y: arlo.y + ARLO_SIZE / 2 },
        { x: ali.x + ALI_SIZE / 2, y: ali.y + ALI_SIZE / 2 }
      ) <
      (ARLO_SIZE + ALI_SIZE) / 2
    ) {
      setGameOver(true);
      setWinStage("beg");
      setAliBegText("Please! Don't hurt me!\nI have a family!");
      setAliBegAnim(true);
      setArloText("");
      setTimeout(() => {
        setAliBegText("Mercy! I beg you! No, please, Arlo!");
      }, 1100);
      setTimeout(() => {
        setAliBegAnim(false);
        setArloText("NO MERCY.");
      }, 2200);
      setTimeout(() => {
        setWinStage("attack");
        setArloText("");
        // Animate blood spurts, sequentially
        let splatters: typeof blood = [];
        for (let i = 0; i < BLOOD_SPLASHES; ++i) {
          const r = Math.random() * 40 + 14;
          const angle = Math.random() * Math.PI * 2;
          splatters.push({
            x: ali.x + ALI_SIZE / 2 + Math.cos(angle) * r,
            y: ali.y + ALI_SIZE / 2 + Math.sin(angle) * r,
            angle,
            key: i + Math.random(),
            stage: 0,
          });
        }
        splatters.forEach((splat, idx) => {
          setTimeout(() => {
            setBlood((prev) => [...prev, { ...splat, stage: 1 }]);
          }, 150 + idx * 60);
        });
        setShaking(true);
        setTimeout(() => setShaking(false), 950);
      }, 3200);
      setTimeout(() => {
        setWinStage("gore");
        setShowGore(true);
        setCorpse({ ...ali });
        setAliBegText("");
      }, 4300);
      setTimeout(() => {
        setWinStage("aftermath");
      }, 6000);
    }
    // eslint-disable-next-line
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
    setWinStage("none");
    setBlood([]);
    setShowGore(false);
    setCorpse(null);
    setAliBegText("");
    setArloText("");
    setAliBegAnim(false);
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
        transition: shaking ? "none" : "background 0.5s",
        animation: shaking
          ? "shake 0.2s cubic-bezier(.36,.07,.19,.97) both 5"
          : undefined,
      }}
    >
      <style>
        {`
        @keyframes shake {
          0% { transform: translate(4px, 2px) rotate(0deg); }
          10% { transform: translate(-2px, -4px) rotate(-1deg);}
          20% { transform: translate(-6px, 0px) rotate(1deg);}
          30% { transform: translate(6px, 4px) rotate(0deg);}
          40% { transform: translate(4px, -2px) rotate(1deg);}
          50% { transform: translate(-4px, 2px) rotate(-1deg);}
          60% { transform: translate(-2px, 4px) rotate(0deg);}
          70% { transform: translate(2px, -4px) rotate(-1deg);}
          80% { transform: translate(6px, 0px) rotate(1deg);}
          90% { transform: translate(-6px, 4px) rotate(0deg);}
          100% { transform: translate(4px, -2px) rotate(-1deg);}
        }
        `}
      </style>
      <h2 style={{ margin: 10, color: "#911" }}>Arlo's Hunt: Gruesome Edition</h2>
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
        {/* Blood splatters */}
        {blood.map((b, i) => (
          <div
            key={b.key}
            style={{
              position: "absolute",
              left: b.x,
              top: b.y,
              fontSize: 28 + ((b.stage || 0) ? Math.random() * 16 : 0),
              opacity: (b.stage || 0) ? 0.91 : 0.01,
              transform: `rotate(${b.angle}rad) scale(${1 + Math.random() * 0.6})`,
              pointerEvents: "none",
              userSelect: "none",
              zIndex: 30 + i,
              transition: "opacity 0.24s",
              color: "#b10010",
              textShadow: "2px 2px 4px #a00",
              filter: "blur(0.5px) drop-shadow(0 2px 4px #a00)",
            }}
          >
            {BLOOD_EMOJI}
          </div>
        ))}

        {/* Gore and corpse */}
        {showGore && corpse && (
          <div
            style={{
              position: "absolute",
              left: corpse.x + ALI_SIZE / 2 - 24,
              top: corpse.y + ALI_SIZE / 2 - 24,
              zIndex: 120,
            }}
          >
            <span style={{ fontSize: 38 }}>{GORE_EMOJI}</span>
            <span style={{ fontSize: 34, marginLeft: -8 }}>{RIB_EMOJI}</span>
            <span style={{ fontSize: 28, marginLeft: -8 }}>{BLOOD_EMOJI}</span>
          </div>
        )}

        {/* Arlo (player) */}
        <div
          style={{
            position: "absolute",
            left: arlo.x,
            top: arlo.y,
            width: ARLO_SIZE,
            height: ARLO_SIZE,
            fontSize: 32,
            zIndex: winStage === "attack" ? 200 : 2,
            userSelect: "none",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "left 0.08s, top 0.08s",
            filter: (winStage === "attack" || winStage === "gore" || winStage === "aftermath") ? "brightness(1.2) contrast(1.2) saturate(1.2)" : undefined,
            animation: winStage === "attack" ? "shake 0.12s cubic-bezier(.36,.07,.19,.97) both 4" : undefined,
          }}
        >
          {ARLO_EMOJI}
        </div>

        {/* Ali (target, with multi-stage animation) */}
        {!gameOver && (
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
              filter: "brightness(0.95)",
            }}
          >
            {ALI_EMOJI}
          </div>
        )}
        {/* Ali, win sequence - Begging, Attack, Gore */}
        {gameOver && winStage !== "none" && (
          <div
            style={{
              position: "absolute",
              left: ali.x,
              top: ali.y,
              width: ALI_SIZE,
              height: ALI_SIZE,
              fontSize: 38,
              zIndex: 400,
              userSelect: "none",
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              filter: winStage === "beg" ? "saturate(0.8) blur(0.5px)" : winStage === "attack" ? "contrast(0.7) opacity(0.7)" : "opacity(0.2)",
              transition: "filter 0.4s, opacity 0.7s",
              animation: aliBegAnim ? "shake 0.22s cubic-bezier(.36,.07,.19,.97) both 2" : undefined,
            }}
          >
            {ALI_EMOJI}
            {/* Speech bubble */}
            {winStage === "beg" && (
              <div
                style={{
                  position: "absolute",
                  top: -62,
                  left: -30,
                  width: 140,
                  background: "#fff7",
                  color: "#b00",
                  border: "2px solid #b00",
                  borderRadius: 16,
                  padding: "5px 10px",
                  fontSize: 15,
                  fontWeight: 700,
                  boxShadow: "0 2px 8px #c83535",
                  whiteSpace: "pre-line",
                  zIndex: 800,
                  pointerEvents: "none",
                  textAlign: "center",
                }}
              >
                {aliBegText}
              </div>
            )}
            {winStage === "attack" && (
              <div
                style={{
                  position: "absolute",
                  bottom: -62,
                  left: -30,
                  width: 140,
                  background: "#fff7",
                  color: "#b00",
                  border: "2px solid #b00",
                  borderRadius: 16,
                  padding: "6px 11px",
                  fontSize: 16,
                  fontWeight: 700,
                  boxShadow: "0 2px 8px #c83535",
                  whiteSpace: "pre-line",
                  zIndex: 800,
                  pointerEvents: "none",
                  textAlign: "center",
                }}
              >
                {"ARRRGHH!!"}
              </div>
            )}
          </div>
        )}

        {/* Arlo's NO MERCY bubble */}
        {gameOver && winStage === "beg" && arloText && (
          <div
            style={{
              position: "absolute",
              left: arlo.x,
              top: arlo.y - 64,
              width: 110,
              background: "#fff7",
              color: "#222",
              border: "2px solid #222",
              borderRadius: 16,
              padding: "5px 10px",
              fontSize: 15,
              fontWeight: 700,
              boxShadow: "0 2px 8px #444",
              zIndex: 850,
              pointerEvents: "none",
              textAlign: "center",
            }}
          >
            {arloText}
          </div>
        )}

        {/* Gore and corpse */}
        {showGore && corpse && (
          <div
            style={{
              position: "absolute",
              left: corpse.x + ALI_SIZE / 2 - 24,
              top: corpse.y + ALI_SIZE / 2 - 24,
              zIndex: 120,
              animation: "shake 0.4s cubic-bezier(.36,.07,.19,.97) both 2",
            }}
          >
            <span style={{ fontSize: 38 }}>{GORE_EMOJI}</span>
            <span style={{ fontSize: 34, marginLeft: -8 }}>{RIB_EMOJI}</span>
            <span style={{ fontSize: 28, marginLeft: -8 }}>{BLOOD_EMOJI}</span>
          </div>
        )}

        {/* Aftermath overlay */}
        {gameOver && winStage === "aftermath" && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: GAME_WIDTH,
              height: GAME_HEIGHT,
              background: "rgba(70,0,0,0.82)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 990,
              color: "#fff",
              fontSize: 23,
              fontWeight: "bold",
              letterSpacing: 1,
              textShadow: "2px 3px 12px #b20009, 1px 1px 0 #400",
              animation: "bloodFadeIn 1.5s",
              padding: 18,
              whiteSpace: "pre-line"
            }}
          >
            <div style={{ fontSize: 34, marginBottom: 16 }}>🦌🩸🦴🧠</div>
            <div>
              {"Arlo rips Ali apart with a sickening crunch!\nBlood sprays EVERYWHERE. Ali is now a pile of gore."}
            </div>
            <button
              style={{
                marginTop: 28,
                fontSize: 18,
                padding: "14px 34px",
                background: "#b10010",
                border: "none",
                borderRadius: 15,
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 2px 8px #300",
              }}
              onClick={reset}
            >
              <span role="img" aria-label="reload">🔄</span> Play Again
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
      <div style={{ marginTop: 18, maxWidth: 350, fontSize: 15, color: "#a00", background: "#f4efe3", borderRadius: 7, padding: 10, fontWeight: 700 }}>
        Move Arlo (🦌) with swipe or arrows.
        <br />
        Catch Ali (🧔) to win.<br />
        <span style={{ fontSize: 13, color: "#a00", fontWeight: 400 }}>
          (Warning: Extremely violent. <b>Game is mobile-first!</b>)
        </span>
      </div>
    </div>
  );
}

export default App;