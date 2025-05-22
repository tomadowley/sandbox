import React, { useRef, useEffect, useState, useCallback } from "react";

// -- Configurable constants for map and game --
const TILE_SIZE = 48; // px, will scale to screen
const MAP_COLS = 12;
const MAP_ROWS = 10;
const HUD_HEIGHT = 52; // px, fixed HUD

// Directions (for movement input)
const directions = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
};
type DirKey = keyof typeof directions;

// Map legend: 0 = empty/walkable, 1 = wall, other = special
const officeMap: number[][] = [
  [1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,0,0,1,1,1,1,0,1],
  [1,0,1,0,0,0,0,0,0,1,0,1],
  [1,0,1,0,1,1,1,1,0,1,0,1],
  [1,0,0,0,1,0,0,1,0,0,0,1],
  [1,0,1,0,1,0,0,1,0,1,0,1],
  [1,0,1,0,0,0,0,0,0,1,0,1],
  [1,0,0,0,0,1,1,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1]
];

// -- Interactive objects and coworkers --
const objects = [
  { type: "bowl" as const, col: 2, row: 2 },        // Feeding bowl
  { type: "fridge" as const, col: 10, row: 2 },     // Fridge
  { type: "alcohol" as const, col: 9, row: 7 },     // Alcohol item
];
const coworkers = [
  { name: "Alice", col: 4, row: 5 },
  { name: "Bob", col: 7, row: 7 },
];

// Player initial state
const initialPlayer = {
  col: 1,
  row: 1,
  x: 0, // px, filled in on game start
  y: 0,
  size: 28, // px, player "sprite"
  speed: 3, // px per frame
};

// Player stats
const maxStats = {
  hunger: 100,
  adorability: 100,
  stamina: 100,
};

const MIN_HUNGER = 0;
const MAX_HUNGER = maxStats.hunger;
const MIN_STAMINA = 0;
const MAX_STAMINA = maxStats.stamina;
const MIN_ADOR = 0;
const MAX_ADOR = maxStats.adorability;

// Mobile D-pad
const dpadButtons: { key: DirKey; label: string }[] = [
  { key: "ArrowUp", label: "▲" },
  { key: "ArrowLeft", label: "◀" },
  { key: "ArrowDown", label: "▼" },
  { key: "ArrowRight", label: "▶" },
];

// --- Main Game Component ---
type ActionType = "Eat" | "Steal Food" | "Drink Alcohol" | "Sit" | "Pee" | null;
type Feedback = { text: string; color: string; time: number }; // time = ms remaining
type Puddle = { col: number; row: number; alpha: number };

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Track which keys are pressed
  const keysPressed = useRef<{ [k in DirKey]?: boolean }>({});

  // Player/game state (triggers rerender)
  const [stats, setStats] = useState({
    hunger: 80,
    adorability: 60,
    stamina: 90,
  });

  // Visual feedback popups
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  // Drunk state
  const [drunk, setDrunk] = useState(false);
  const drunkTimer = useRef(0);

  // Puddles on floor
  const [puddles, setPuddles] = useState<Puddle[]>([]);

  // Player position in px (for smooth movement)
  const player = useRef({
    ...initialPlayer,
    x: initialPlayer.col * TILE_SIZE + TILE_SIZE/2,
    y: initialPlayer.row * TILE_SIZE + TILE_SIZE/2,
    lastAction: 0, // ms
  });

  // Used to detect mobile vs desktop for action button
  const [isMobile, setIsMobile] = useState(false);

  // -- Contextual action logic --
  const [action, setAction] = useState<ActionType>(null);
  const [actionTarget, setActionTarget] = useState<any>(null);

  // --- Game over state ---
  const [gameOver, setGameOver] = useState<null | { reason: string }>(null);

  // --- Nearest interactable detection ---
  function getNearbyAction(px: number, py: number) : {action: ActionType, target: any} {
    // Convert px,py to tile coordinates
    const tileX = (px / TILE_SIZE);
    const tileY = (py / TILE_SIZE);
    // Helper: is close enough to interact (distance in tile units)
    const isNear = (col: number, row: number, dist=0.7) =>
      Math.hypot(col + 0.5 - tileX, row + 0.5 - tileY) < dist;
    for (const obj of objects) {
      if (isNear(obj.col, obj.row)) {
        if (obj.type === "bowl") return {action: "Eat", target: obj};
        if (obj.type === "fridge") return {action: "Steal Food", target: obj};
        if (obj.type === "alcohol") return {action: "Drink Alcohol", target: obj};
      }
    }
    for (const c of coworkers) {
      if (isNear(c.col, c.row)) return {action: "Sit", target: c};
    }
    // Else, Pee anywhere
    return {action: "Pee", target: null};
  }

  // --- Visual Feedback helpers ---
  const popup = useCallback((text: string, color: string = "#fff", ms = 1100) => {
    setFeedbacks(fbs => [...fbs, { text, color, time: ms }]);
  }, []);

  // --- Action performance logic ---
  const doAction = useCallback(() => {
    // Don't allow spamming actions
    if (Date.now() - player.current.lastAction < 500) return;
    player.current.lastAction = Date.now();

    if (!action) return;
    // Block actions on stat limits
    if ((action === "Eat" || action === "Steal Food") && stats.hunger >= MAX_HUNGER) {
      popup("Already full!", "#f8c471");
      return;
    }
    if (action === "Pee" && stats.adorability <= MIN_ADOR) {
      popup("Too un-adorable...", "#bbb");
      return;
    }
    if (stats.stamina <= MIN_STAMINA + 2) {
      popup("Too tired!", "#95a5a6");
      return;
    }

    // Action effect switch
    if (action === "Eat") {
      setStats(s => ({ ...s, hunger: Math.min(s.hunger + 30, MAX_HUNGER) }));
      popup("Nom nom!", "#3498db");
    } else if (action === "Steal Food") {
      setStats(s => ({ ...s, hunger: Math.min(s.hunger + 15, MAX_HUNGER) }));
      popup("Stole food!", "#e67e22");
    } else if (action === "Drink Alcohol") {
      if (!drunk) {
        setDrunk(true);
        drunkTimer.current = 60; // seconds
        popup("Wasted!", "#27ae60");
      } else {
        popup("Already drunk!", "#f1948a");
      }
    } else if (action === "Sit") {
      setStats(s => ({ ...s, adorability: Math.min(s.adorability + 10, MAX_ADOR) }));
      popup("Sat on lap!", "#e74c3c");
    } else if (action === "Pee") {
      // Add puddle at player's tile
      const px = player.current.x / TILE_SIZE;
      const py = player.current.y / TILE_SIZE;
      const col = Math.floor(px);
      const row = Math.floor(py);

      // Check if near coworker
      let nearCoworker = false;
      for (const c of coworkers) {
        if (Math.hypot(c.col + 0.5 - px, c.row + 0.5 - py) < 1.2) {
          nearCoworker = true;
          break;
        }
      }
      setPuddles(p => [...p, { col, row, alpha: 1 }]);
      if (nearCoworker) {
        setStats(s => ({
          ...s,
          adorability: Math.max(s.adorability - 30, MIN_ADOR)
        }));
        popup("Coworker grossed out!", "#e67e22");
      } else {
        setStats(s => ({
          ...s,
          adorability: Math.max(s.adorability - 15, MIN_ADOR)
        }));
        popup("Pee'd on floor...", "#f1c40f");
      }
    }

    // Stamina cost (except peeing, which is free)
    if (action !== "Pee") {
      setStats(s => ({ ...s, stamina: Math.max(s.stamina - 8, MIN_STAMINA) }));
    }
  }, [action, stats, drunk, popup]);

  // --- Handle Space keyboard for action ---
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        doAction();
      }
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [doAction]);

  // --- Detect mobile for action button ---
  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth < 700);
    }
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // --- Main game loop ---
  useEffect(() => {
    let anim: number;
    const render = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      // --- Compute tile size dynamically for mobile ---
      const mapW = MAP_COLS * TILE_SIZE;
      const mapH = MAP_ROWS * TILE_SIZE;
      // Fit map to screen (minus HUD), centered
      const availW = canvas.width;
      const availH = canvas.height - HUD_HEIGHT;
      const scale = Math.min(availW / mapW, availH / mapH, 1);
      const offsetX = (availW - mapW * scale) / 2;
      const offsetY = HUD_HEIGHT + (availH - mapH * scale) / 2;

      // --- Movement logic with collision ---
      let dx = 0, dy = 0;
      for (const key in keysPressed.current) {
        if (keysPressed.current[key as DirKey]) {
          const [mx, my] = directions[key as DirKey];
          dx += mx;
          dy += my;
        }
      }
      if (dx && dy) {
        dx *= Math.SQRT1_2;
        dy *= Math.SQRT1_2;
      }

      // Drunk makes you move slower, and wiggle a bit
      let moveSpeed = player.current.speed * scale;
      if (drunk) {
        moveSpeed *= 0.5;
      }

      // Compute intended move in tile space
      let nextX = player.current.x + dx * moveSpeed;
      let nextY = player.current.y + dy * moveSpeed;
      if (drunk) {
        // Wiggle
        nextX += Math.sin(Date.now() / 90) * 0.5 * scale;
        nextY += Math.cos(Date.now() / 75) * 0.5 * scale;
      }

      // Clamp to map bounds
      const r = player.current.size/2 * scale;
      nextX = Math.max(r, Math.min(mapW*scale - r, nextX));
      nextY = Math.max(r, Math.min(mapH*scale - r, nextY));

      // Collision test: check 4 corners of player hitbox in tile coordinates
      const isWalkable = (px: number, py: number) => {
        const tileX = Math.floor(px / (TILE_SIZE * scale));
        const tileY = Math.floor(py / (TILE_SIZE * scale));
        if (tileX < 0 || tileY < 0 || tileX >= MAP_COLS || tileY >= MAP_ROWS) return false;
        if (officeMap[tileY][tileX] === 1) return false;
        // Block objects
        for (const obj of objects) {
          if (obj.col === tileX && obj.row === tileY) return false;
        }
        // Block coworkers
        for (const coworker of coworkers) {
          if (coworker.col === tileX && coworker.row === tileY) return false;
        }
        return true;
      };
      // Check 4 corners
      const corners = [
        [nextX - r, nextY - r],
        [nextX + r, nextY - r],
        [nextX - r, nextY + r],
        [nextX + r, nextY + r],
      ];
      if (corners.every(([px, py]) => isWalkable(px, py))) {
        player.current.x = nextX;
        player.current.y = nextY;
      }

      // --- Contextual action detection ---
      const { action: act, target } = getNearbyAction(player.current.x / scale, player.current.y / scale);
      setAction(act);
      setActionTarget(target);

      // --- Drawing ---
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. HUD overlay
      drawHUD(ctx, stats, canvas.width, HUD_HEIGHT, drunk);

      // 2. Draw map
      for (let y = 0; y < MAP_ROWS; ++y) {
        for (let x = 0; x < MAP_COLS; ++x) {
          const tile = officeMap[y][x];
          ctx.save();
          ctx.translate(offsetX + x * TILE_SIZE * scale, offsetY + y * TILE_SIZE * scale);
          ctx.fillStyle = tile === 1 ? "#4e495a" : "#e3decf";
          ctx.fillRect(0, 0, TILE_SIZE * scale, TILE_SIZE * scale);
          ctx.strokeStyle = "rgba(0,0,0,0.1)";
          ctx.lineWidth = 1;
          ctx.strokeRect(0, 0, TILE_SIZE * scale, TILE_SIZE * scale);
          ctx.restore();
        }
      }

      // 2b. Draw puddles (fading)
      for (const puddle of puddles) {
        if (puddle.alpha <= 0) continue;
        ctx.save();
        ctx.globalAlpha = Math.max(0, puddle.alpha);
        ctx.translate(
          offsetX + (puddle.col + 0.5) * TILE_SIZE * scale,
          offsetY + (puddle.row + 0.7) * TILE_SIZE * scale
        );
        ctx.beginPath();
        ctx.ellipse(0, 0, 16 * scale, 8 * scale, 0, 0, Math.PI * 2);
        ctx.fillStyle = "#cae4f7";
        ctx.fill();
        ctx.strokeStyle = "#87b2c8";
        ctx.lineWidth = 1.5 * scale;
        ctx.stroke();
        ctx.restore();
      }

      // 3. Draw interactive objects
      for (const obj of objects) {
        ctx.save();
        ctx.translate(
          offsetX + (obj.col + 0.5) * TILE_SIZE * scale,
          offsetY + (obj.row + 0.5) * TILE_SIZE * scale
        );
        switch (obj.type) {
          case "bowl":
            ctx.beginPath();
            ctx.ellipse(0, 0, 14 * scale, 9 * scale, 0, 0, Math.PI * 2);
            ctx.fillStyle = "#3498db";
            ctx.fill();
            ctx.strokeStyle = "#1c4966";
            ctx.lineWidth = 2 * scale;
            ctx.stroke();
            break;
          case "fridge":
            ctx.fillStyle = "#fafafa";
            ctx.fillRect(-11 * scale, -18 * scale, 22 * scale, 36 * scale);
            ctx.strokeStyle = "#bbb";
            ctx.strokeRect(-11 * scale, -18 * scale, 22 * scale, 36 * scale);
            break;
          case "alcohol":
            ctx.beginPath();
            ctx.ellipse(0, 0, 5 * scale, 12 * scale, 0, 0, Math.PI * 2);
            ctx.fillStyle = "#387d3b";
            ctx.fill();
            ctx.strokeStyle = "#1c3d1d";
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, -11 * scale, 5 * scale, 0, Math.PI, true);
            ctx.fillStyle = "#e1e1e1";
            ctx.fill();
            ctx.stroke();
            break;
        }
        ctx.restore();
      }

      // 4. Draw coworkers
      for (const c of coworkers) {
        ctx.save();
        ctx.translate(
          offsetX + (c.col + 0.5) * TILE_SIZE * scale,
          offsetY + (c.row + 0.5) * TILE_SIZE * scale
        );
        ctx.fillStyle = "#8e44ad";
        ctx.fillRect(-13 * scale, 7 * scale, 26 * scale, 12 * scale);
        ctx.beginPath();
        ctx.arc(0, 0, 10 * scale, 0, Math.PI * 2);
        ctx.fillStyle = "#ffdcb2";
        ctx.fill();
        ctx.font = `${10 * scale}px monospace`;
        ctx.fillStyle = "#111";
        ctx.textAlign = "center";
        ctx.fillText(c.name, 0, 22 * scale);
        ctx.restore();
      }

      // 5. Draw player (dog as a brown circle with ear "triangle")
      ctx.save();
      ctx.translate(player.current.x * scale + offsetX - mapW * (scale - 1) / 2, player.current.y * scale + offsetY - mapH * (scale - 1) / 2);
      ctx.beginPath();
      ctx.arc(0, 0, player.current.size * scale / 2, 0, Math.PI * 2);
      ctx.fillStyle = "#b08453";
      ctx.fill();
      ctx.strokeStyle = "#6d4c1a";
      ctx.lineWidth = 2 * scale;
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-10 * scale, -12 * scale);
      ctx.lineTo(-2 * scale, -18 * scale);
      ctx.lineTo(2 * scale, -10 * scale);
      ctx.closePath();
      ctx.fillStyle = "#6d4c1a";
      ctx.fill();
      ctx.restore();

      // 6. Draw feedback popups (fade up)
      feedbacks.forEach((fb, i) => {
        if (fb.time <= 0) return;
        ctx.save();
        ctx.font = "bold 22px monospace";
        ctx.textAlign = "center";
        ctx.fillStyle = fb.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, fb.time / 1000));
        ctx.fillText(
          fb.text,
          canvas.width / 2,
          canvas.height / 2 - 36 - 32 * i
        );
        ctx.restore();
      });

      anim = requestAnimationFrame(render);
    };
    anim = requestAnimationFrame(render);
    return () => cancelAnimationFrame(anim);
  }, [stats, drunk, feedbacks, action, puddles]);

  // -- Touch D-pad handlers (mobile) --
  const handleDpad = (key: DirKey, pressed: boolean) => {
    keysPressed.current[key] = pressed;
  };

  // --- HUD Drawing function (with drunk indicator) ---
  function drawHUD(
    ctx: CanvasRenderingContext2D,
    stats: typeof maxStats,
    width: number,
    height: number,
    drunk: boolean
  ) {
    ctx.save();
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = "#181c24";
    ctx.fillRect(0, 0, width, height);
    ctx.globalAlpha = 1.0;

    // Draw stat bars
    const margin = 15,
      barH = 16,
      spacing = 28,
      barW = 110;
    const statList: { key: keyof typeof maxStats; color: string; label: string }[] = [
      { key: "hunger", color: "#f39c12", label: "HUNGER" },
      { key: "adorability", color: "#e74c3c", label: "ADORABLE" },
      { key: "stamina", color: "#2ecc71", label: "STAMINA" },
    ];
    statList.forEach((stat, idx) => {
      const val = stats[stat.key];
      ctx.save();
      ctx.font = "bold 11px monospace";
      ctx.fillStyle = "#fff";
      ctx.textAlign = "left";
      ctx.fillText(stat.label, margin, margin + idx * spacing + barH - 2);
      // Bar bg
      ctx.fillStyle = "#333";
      ctx.fillRect(margin + 78, margin + idx * spacing, barW, barH);
      // Bar fg
      ctx.fillStyle = stat.color;
      ctx.fillRect(
        margin + 78,
        margin + idx * spacing,
        (barW * val) / 100,
        barH
      );
      // Value
      ctx.fillStyle = "#fff";
      ctx.font = "bold 13px monospace";
      ctx.textAlign = "right";
      ctx.fillText(
        String(val),
        margin + 78 + barW + 38,
        margin + idx * spacing + barH - 2
      );
      ctx.restore();
    });

    // Drunk indicator
    if (drunk) {
      ctx.save();
      ctx.font = "bold 17px monospace";
      ctx.fillStyle = "#27ae60";
      ctx.textAlign = "right";
      ctx.fillText("DRUNK!", width - 22, 30);
      ctx.restore();
    }

    // Title
    ctx.save();
    ctx.font = "bold 18px monospace";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText("OFFICE DOG QUEST", width / 2, 26);
    ctx.restore();

    ctx.restore();
  }

  // --- Stat ticking / effect timers ---
  useEffect(() => {
    const interval = setInterval(() => {
      // Hunger drains over time, stamina recovers if idle, drains if moving, adorability ticks for drunk/sit/pee
      setStats((s) => {
        let { hunger, adorability, stamina } = s;

        // Hunger drain over time
        hunger = Math.max(MIN_HUNGER, hunger - 0.11);

        // Detect movement
        let moving = false;
        for (const key in keysPressed.current) {
          if (keysPressed.current[key as DirKey]) moving = true;
        }

        // Stamina use/recovery
        if (moving) {
          stamina = Math.max(MIN_STAMINA, stamina - (drunk ? 0.12 : 0.18));
        } else {
          stamina = Math.min(MAX_STAMINA, stamina + 0.22);
        }

        // Drunk state: gain adorability/sec
        if (drunk) {
          adorability = Math.min(MAX_ADOR, adorability + 0.22);
        }

        // Clamp
        hunger = Math.min(MAX_HUNGER, hunger);
        adorability = Math.max(MIN_ADOR, Math.min(MAX_ADOR, adorability));
        stamina = Math.max(MIN_STAMINA, Math.min(MAX_STAMINA, stamina));

        // GAME OVER detection
        if (!gameOver) {
          if (hunger <= MIN_HUNGER) setGameOver({ reason: "Starved! Too hungry." });
          else if (stamina <= MIN_STAMINA) setGameOver({ reason: "Collapsed! Too tired." });
          else if (adorability <= MIN_ADOR) setGameOver({ reason: "Fired! Too un-adorable." });
        }

        return {
          hunger: Math.round(hunger),
          adorability: Math.round(adorability),
          stamina: Math.round(stamina),
        };
      });

      // Drunk timer countdown
      if (drunk) {
        drunkTimer.current -= 1;
        if (drunkTimer.current <= 0) {
          setDrunk(false);
          popup("Sobered up!", "#b2bec3");
        }
      }

      // Feedback popups tick
      setFeedbacks((fbs) =>
        fbs
          .map((fb) => ({ ...fb, time: fb.time - 100 }))
          .filter((fb) => fb.time > 0)
      );

      // Fade puddles
      setPuddles((list) =>
        list
          .map((p) => ({ ...p, alpha: p.alpha - 0.012 }))
          .filter((p) => p.alpha > 0)
      );
    }, 100);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [drunk, popup, gameOver]);

  // --- Main render ---
  return (
    <div className="game-root">
      <canvas ref={canvasRef} className="game-canvas" />
      {/* D-pad for mobile */}
      <div className="dpad">
        <button
          className="dpad-btn up"
          aria-label="Up"
          onTouchStart={(e) => {
            e.preventDefault();
            handleDpad("ArrowUp", true);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            handleDpad("ArrowUp", false);
          }}
        >
          ▲
        </button>
        <div className="dpad-row">
          <button
            className="dpad-btn left"
            aria-label="Left"
            onTouchStart={(e) => {
              e.preventDefault();
              handleDpad("ArrowLeft", true);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleDpad("ArrowLeft", false);
            }}
          >
            ◀
          </button>
          <span className="dpad-center" />
          <button
            className="dpad-btn right"
            aria-label="Right"
            onTouchStart={(e) => {
              e.preventDefault();
              handleDpad("ArrowRight", true);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              handleDpad("ArrowRight", false);
            }}
          >
            ▶
          </button>
        </div>
        <button
          className="dpad-btn down"
          aria-label="Down"
          onTouchStart={(e) => {
            e.preventDefault();
            handleDpad("ArrowDown", true);
          }}
          onTouchEnd={(e) => {
            e.preventDefault();
            handleDpad("ArrowDown", false);
          }}
        >
          ▼
        </button>
      </div>
      {/* Action button (mobile) */}
      {isMobile && action && (
        <button
          className="action-btn"
          onTouchStart={(e) => {
            e.preventDefault();
            doAction();
          }}
          style={{
            position: "absolute",
            right: "8vw",
            bottom: "18vw",
            zIndex: 10,
            fontSize: "1.1rem",
            padding: "0.9em 2.1em",
            borderRadius: "1em",
            background: "#282c34",
            color: "#fff",
            border: "2px solid #fff",
            opacity: stats.stamina <= MIN_STAMINA + 2 ? 0.5 : 1,
          }}
          disabled={stats.stamina <= MIN_STAMINA + 2}
        >
          {action}
        </button>
      )}
      {/* Action hint (desktop) */}
      {!isMobile && action && (
        <div
          style={{
            position: "absolute",
            right: "30px",
            top: `${HUD_HEIGHT + 18}px`,
            zIndex: 10,
            color: "#fff",
            fontSize: "1.1rem",
            background: "rgba(40,44,52,0.9)",
            padding: "0.6em 1.3em",
            borderRadius: "0.8em",
            border: "1.5px solid #fff",
            opacity: stats.stamina <= MIN_STAMINA + 2 ? 0.5 : 1,
            pointerEvents: "none",
          }}
        >
          [Space] {action}
        </div>
      )}

      {/* Game Over Modal */}
      {gameOver && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 1000,
            background: "rgba(20,20,20,0.87)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "#282c34",
              color: "#fff",
              padding: "2.5em 2em",
              borderRadius: "1em",
              textAlign: "center",
              boxShadow: "0 0 32px #0009",
              maxWidth: 340,
            }}
          >
            <div style={{ fontSize: 34, fontWeight: 700, marginBottom: 16 }}>
              GAME OVER
            </div>
            <div style={{ fontSize: 20, marginBottom: 30 }}>
              {gameOver.reason}
            </div>
            <button
              style={{
                fontSize: 20,
                padding: "0.6em 1.3em",
                borderRadius: "0.8em",
                background: "#27ae60",
                color: "#fff",
                border: "none",
                fontWeight: 700,
                letterSpacing: "0.1em",
                boxShadow: "0 4px 20px #1116",
                cursor: "pointer",
              }}
              onClick={() => {
                // Reset all state
                setStats({
                  hunger: 80,
                  adorability: 60,
                  stamina: 90,
                });
                setDrunk(false);
                drunkTimer.current = 0;
                setFeedbacks([]);
                setPuddles([]);
                player.current.x = initialPlayer.col * TILE_SIZE + TILE_SIZE / 2;
                player.current.y = initialPlayer.row * TILE_SIZE + TILE_SIZE / 2;
                player.current.lastAction = 0;
                setGameOver(null);
              }}
            >
              Restart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}