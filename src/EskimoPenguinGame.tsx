import React, { useEffect, useRef, useState } from "react";

// Responsive game area (canvas) constants
const ASPECT_RATIO = 2; // width:height = 2:1 (orig 800:400)
const GAME_WIDTH = 800;
const GAME_HEIGHT = 400;
const GROUND_HEIGHT = 60;
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 60;
const PLAYER_SPEED = 5;
const JUMP_VELOCITY = -14;
const GRAVITY = 0.7;
const PENGUIN_SIZE = 30;
const POLAR_BEAR_SIZE = 60;
const SPAWN_INTERVAL = 1400; // ms

type GameState = "playing" | "gameover";

interface Platform {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Entity {
  x: number;
  y: number;
  vx: number;
  vy: number;
  w: number;
  h: number;
  type: "penguin" | "polarBear";
  alive: boolean;
}

function rectsCollide(
  a: { x: number; y: number; w: number; h: number },
  b: { x: number; y: number; w: number; h: number }
) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

// Platforms defined for original GAME_WIDTH/GAME_HEIGHT
const platformsOrig: Platform[] = [
  { x: 0, y: GAME_HEIGHT - GROUND_HEIGHT, w: GAME_WIDTH, h: GROUND_HEIGHT },
  { x: 120, y: 290, w: 160, h: 16 },
  { x: 340, y: 220, w: 130, h: 16 },
  { x: 540, y: 140, w: 120, h: 16 },
];

const getRandomYPlatform = (platforms: Platform[]) => {
  // Returns a random platform (not the ground)
  const idx = Math.floor(Math.random() * (platforms.length - 1)) + 1;
  return platforms[idx];
};

const isTouchDevice = () =>
  !!(
    typeof window !== "undefined" &&
    ("ontouchstart" in window || navigator.maxTouchPoints)
  );

// Mobile: on-screen controls
const ControlButton: React.FC<{
  label: string;
  onPress: () => void;
  onRelease: () => void;
  style?: React.CSSProperties;
}> = ({ label, onPress, onRelease, style }) => (
  <button
    style={{
      width: 56,
      height: 56,
      fontSize: 22,
      margin: 4,
      borderRadius: "50%",
      border: "2px solid #357ab7",
      background: "#e3f3fa",
      color: "#357ab7",
      fontWeight: "bold",
      touchAction: "none",
      ...style,
    }}
    onTouchStart={e => {
      e.preventDefault();
      onPress();
    }}
    onTouchEnd={e => {
      e.preventDefault();
      onRelease();
    }}
    onMouseDown={e => {
      e.preventDefault();
      onPress();
    }}
    onMouseUp={e => {
      e.preventDefault();
      onRelease();
    }}
    aria-label={label}
  >
    {label}
  </button>
);

const EskimoPenguinGame: React.FC = () => {
  // Responsive canvas size
  const [canvasDims, setCanvasDims] = useState({ width: GAME_WIDTH, height: GAME_HEIGHT });
  const [scale, setScale] = useState(1);

  // On resize, set canvas size to fit viewport
  useEffect(() => {
    function handleResize() {
      const margin = 16;
      let w = window.innerWidth - margin * 2;
      let h = window.innerHeight - 120;
      // Keep aspect ratio
      if (w / h > ASPECT_RATIO) {
        w = h * ASPECT_RATIO;
      } else {
        h = w / ASPECT_RATIO;
      }
      w = Math.max(320, Math.min(w, GAME_WIDTH));
      h = w / ASPECT_RATIO;
      setCanvasDims({ width: Math.round(w), height: Math.round(h) });
      setScale(w / GAME_WIDTH);
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Responsive platforms/entities
  const platforms = platformsOrig;

  // Player state
  const [player, setPlayer] = useState({
    x: 40,
    y: GAME_HEIGHT - GROUND_HEIGHT - PLAYER_HEIGHT,
    vx: 0,
    vy: 0,
    onGround: false,
  });

  // Entities: penguins and polar bears
  const [entities, setEntities] = useState<Entity[]>([]);

  // Score and game state
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<GameState>("playing");

  // Keys (simulate for mobile controls too)
  const keys = useRef<{ [key: string]: boolean }>({});

  // Spawning timer
  const spawnTimer = useRef<NodeJS.Timeout | null>(null);

  // Canvas ref for drawing
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Mobile: touch controls
  const [showTouchControls, setShowTouchControls] = useState(isTouchDevice());

  // Reset game
  const resetGame = () => {
    setPlayer({
      x: 40,
      y: GAME_HEIGHT - GROUND_HEIGHT - PLAYER_HEIGHT,
      vx: 0,
      vy: 0,
      onGround: false,
    });
    setEntities([]);
    setScore(0);
    setGameState("playing");
  };

  // Controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.key] = true;
      // Prevent scrolling with arrow keys/space
      if (
        ["ArrowLeft", "ArrowRight", "ArrowUp", " "].includes(e.key)
      ) {
        e.preventDefault();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.key] = false;
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Main game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    let animationId: number;

    const update = () => {
      // Controls
      let vx = 0;
      if (keys.current["ArrowLeft"] || keys.current["a"]) vx -= PLAYER_SPEED;
      if (keys.current["ArrowRight"] || keys.current["d"]) vx += PLAYER_SPEED;

      // Jump
      let vy = player.vy;
      let y = player.y;
      let x = player.x;
      let onGround = player.onGround;

      if (
        (keys.current["ArrowUp"] || keys.current["w"] || keys.current[" "]) &&
        onGround
      ) {
        vy = JUMP_VELOCITY;
        onGround = false;
      }

      vy += GRAVITY;
      x += vx;
      y += vy;

      // Platform collision
      onGround = false;
      for (const plat of platforms) {
        // Only check if falling
        if (
          y + PLAYER_HEIGHT > plat.y &&
          y + PLAYER_HEIGHT - vy <= plat.y &&
          x + PLAYER_WIDTH > plat.x &&
          x < plat.x + plat.w
        ) {
          // Land on platform
          y = plat.y - PLAYER_HEIGHT;
          vy = 0;
          onGround = true;
        }
      }

      // Stay in bounds
      if (x < 0) x = 0;
      if (x + PLAYER_WIDTH > GAME_WIDTH) x = GAME_WIDTH - PLAYER_WIDTH;

      // Update player state
      setPlayer((prev) => ({
        ...prev,
        x,
        y,
        vx,
        vy,
        onGround,
      }));

      // Update entities (move left)
      setEntities((prevEntities) =>
        prevEntities
          .map((e) => ({
            ...e,
            x: e.x - (e.type === "penguin" ? 2 : 3.5),
          }))
          .filter(
            (e) =>
              e.x + e.w > 0 && e.alive // Remove offscreen or dead
          )
      );

      // Check collisions with penguins and bears
      setEntities((prevEntities) => {
        let penguinEaten = false;
        let gameOver = false;
        const newEntities = prevEntities.map((e) => {
          if (
            rectsCollide(
              { x, y, w: PLAYER_WIDTH, h: PLAYER_HEIGHT },
              e
            )
          ) {
            if (e.type === "penguin" && e.alive) {
              penguinEaten = true;
              return { ...e, alive: false };
            } else if (e.type === "polarBear") {
              gameOver = true;
              return { ...e };
            }
          }
          return e;
        });
        if (penguinEaten) setScore((s) => s + 1);
        if (gameOver) setGameState("gameover");
        return newEntities.filter((e) => e.alive || e.type === "polarBear");
      });

      animationId = requestAnimationFrame(update);
    };

    animationId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationId);
    // eslint-disable-next-line
  }, [gameState, player.y, player.onGround]);

  // Spawn penguins and polar bears
  useEffect(() => {
    if (gameState !== "playing") return;
    function spawnEntity() {
      // 70% penguin, 30% polar bear
      if (Math.random() < 0.7) {
        // Penguin
        const plat = getRandomYPlatform(platforms);
        setEntities((prev) => [
          ...prev,
          {
            x: GAME_WIDTH,
            y: plat.y - PENGUIN_SIZE,
            vx: -2,
            vy: 0,
            w: PENGUIN_SIZE,
            h: PENGUIN_SIZE,
            type: "penguin",
            alive: true,
          },
        ]);
      } else {
        // Polar bear
        const plat = getRandomYPlatform(platforms);
        setEntities((prev) => [
          ...prev,
          {
            x: GAME_WIDTH,
            y: plat.y - POLAR_BEAR_SIZE,
            vx: -3.5,
            vy: 0,
            w: POLAR_BEAR_SIZE,
            h: POLAR_BEAR_SIZE,
            type: "polarBear",
            alive: true,
          },
        ]);
      }
      spawnTimer.current = setTimeout(
        spawnEntity,
        SPAWN_INTERVAL + Math.random() * 800
      );
    }
    spawnEntity();
    return () => {
      if (spawnTimer.current) clearTimeout(spawnTimer.current);
    };
  }, [gameState, platforms]);

  // Drawing
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    // Scale for responsive canvas
    ctx.setTransform(scale, 0, 0, scale, 0, 0);

    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw background
    ctx.fillStyle = "#aeefff";
    ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Draw platforms
    ctx.fillStyle = "#b2e3e0";
    for (const plat of platforms) {
      ctx.fillRect(plat.x, plat.y, plat.w, plat.h);
    }

    // Draw player (Eskimo)
    ctx.save();
    ctx.translate(player.x + PLAYER_WIDTH / 2, player.y + PLAYER_HEIGHT / 2);
    ctx.scale(1, 1);
    ctx.beginPath();
    ctx.ellipse(0, 10, 18, 26, 0, 0, Math.PI * 2); // body
    ctx.fillStyle = "#eaeaea";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, -15, 16, 0, Math.PI * 2); // head
    ctx.fillStyle = "#dadada";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, -15, 9, 0, Math.PI * 2); // face
    ctx.fillStyle = "#fbe6c3";
    ctx.fill();
    ctx.restore();

    // Draw penguins
    entities
      .filter((e) => e.type === "penguin" && e.alive)
      .forEach((penguin) => {
        ctx.save();
        ctx.translate(
          penguin.x + penguin.w / 2,
          penguin.y + penguin.h / 2
        );
        ctx.beginPath();
        ctx.ellipse(0, 6, 10, 14, 0, 0, Math.PI * 2); // body
        ctx.fillStyle = "#222";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, -5, 8, 0, Math.PI * 2); // head
        ctx.fillStyle = "#eee";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, -5, 4, 0, Math.PI * 2); // face
        ctx.fillStyle = "#fff";
        ctx.fill();
        // Beak
        ctx.beginPath();
        ctx.moveTo(0, -1);
        ctx.lineTo(4, 2);
        ctx.lineTo(0, 4);
        ctx.closePath();
        ctx.fillStyle = "#ffb300";
        ctx.fill();
        ctx.restore();
      });

    // Draw polar bears
    entities
      .filter((e) => e.type === "polarBear")
      .forEach((bear) => {
        ctx.save();
        ctx.translate(bear.x + bear.w / 2, bear.y + bear.h / 2);
        ctx.beginPath();
        ctx.ellipse(0, 10, 22, 28, 0, 0, Math.PI * 2); // body
        ctx.fillStyle = "#fff";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, -17, 16, 0, Math.PI * 2); // head
        ctx.fillStyle = "#f6f6f6";
        ctx.fill();
        // Nose
        ctx.beginPath();
        ctx.ellipse(0, -9, 6, 3, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#222";
        ctx.fill();
        ctx.restore();
      });

    // Draw score
    ctx.fillStyle = "#123";
    ctx.font = "20px Arial";
    ctx.fillText("Penguins hunted: " + score, 16, 30);

    if (gameState === "gameover") {
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 38px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        "Game Over!",
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2 - 30
      );
      ctx.font = "24px Arial";
      ctx.fillText(
        `Penguins hunted: ${score}`,
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2 + 10
      );
      ctx.font = "18px Arial";
      ctx.fillText(
        "Press R or tap Restart",
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2 + 44
      );
      ctx.textAlign = "start";
    }
  }, [player, entities, score, gameState, scale, platforms]);

  // Restart game key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (gameState === "gameover" && (e.key === "r" || e.key === "R")) {
        resetGame();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line
  }, [gameState]);

  // Touch controls: left/right/jump
  // Set key state on touch press/release
  const handleTouchControl = (key: string, pressed: boolean) => {
    keys.current[key] = pressed;
  };

  // On mobile, allow tap on game over screen to restart
  const handleCanvasTap = () => {
    if (gameState === "gameover") {
      resetGame();
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        margin: 0,
        padding: 0,
        minHeight: "100vh",
        background: "linear-gradient(to bottom, #aeefff 60%, #e0f7fa 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
      }}
    >
      <h2 style={{
        fontSize: "clamp(1.2rem, 4vw, 2.2rem)",
        marginTop: 16,
        marginBottom: 10,
        color: "#24618A",
        letterSpacing: "1px",
      }}>
        Eskimo Penguin Hunt
      </h2>
      <div
        style={{
          position: "relative",
          width: canvasDims.width,
          height: canvasDims.height,
          maxWidth: "98vw",
          maxHeight: "60vh",
          margin: "0 auto",
        }}
      >
        <canvas
          ref={canvasRef}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          style={{
            width: canvasDims.width,
            height: canvasDims.height,
            border: "3px solid #357ab7",
            background: "#e0f7fa",
            borderRadius: 8,
            touchAction: "manipulation",
            display: "block",
            boxShadow: "0 3px 16px 0 #357ab733",
            margin: "0 auto",
          }}
          onClick={handleCanvasTap}
          onTouchEnd={handleCanvasTap}
        />
        {showTouchControls && (
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 12,
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: 12,
              zIndex: 2,
              pointerEvents: "none",
            }}
          >
            <div style={{ pointerEvents: "auto" }}>
              <ControlButton
                label="⯇"
                onPress={() => handleTouchControl("ArrowLeft", true)}
                onRelease={() => handleTouchControl("ArrowLeft", false)}
              />
            </div>
            <div style={{ pointerEvents: "auto" }}>
              <ControlButton
                label="⯈"
                onPress={() => handleTouchControl("ArrowRight", true)}
                onRelease={() => handleTouchControl("ArrowRight", false)}
              />
            </div>
            <div style={{ pointerEvents: "auto" }}>
              <ControlButton
                label="⯅"
                onPress={() => handleTouchControl(" ", true)}
                onRelease={() => handleTouchControl(" ", false)}
                style={{ background: "#e0f7fa", color: "#357ab7" }}
              />
            </div>
          </div>
        )}
      </div>
      <div style={{ marginTop: 8, color: "#345", fontSize: "clamp(0.9rem, 2.5vw, 1.2rem)" }}>
        <span>
          Controls: <b>←/→</b> to move, <b>↑/Space</b> to jump.<br />
          {showTouchControls ? "Use on-screen buttons!" : "Hunt penguins, avoid polar bears!"}
        </span>
      </div>
      {gameState === "gameover" && (
        <button
          style={{
            marginTop: 18,
            fontSize: "1.1rem",
            padding: "10px 24px",
            borderRadius: 8,
            background: "#357ab7",
            color: "#fff",
            border: "none",
            fontWeight: "bold",
            boxShadow: "0 2px 8px #357ab733",
          }}
          onClick={resetGame}
        >
          Restart Game
        </button>
      )}
    </div>
  );
};

export default EskimoPenguinGame;