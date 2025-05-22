import React, { useRef, useEffect, useState } from "react";

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
// We'll use a small office layout for demo purposes.
const officeMap: number[][] = [
  // 0 = floor, 1 = wall
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
// All positions are {col, row}
const objects = [
  { type: "bowl", col: 2, row: 2 },        // Feeding bowl
  { type: "fridge", col: 10, row: 2 },     // Fridge
  { type: "alcohol", col: 9, row: 7 },     // Alcohol item
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

const dpadButtons: { key: DirKey; label: string }[] = [
  { key: "ArrowUp", label: "▲" },
  { key: "ArrowLeft", label: "◀" },
  { key: "ArrowDown", label: "▼" },
  { key: "ArrowRight", label: "▶" },
];

// --- Main Game Component ---
export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Track which keys are pressed
  const keysPressed = useRef<{ [k in DirKey]?: boolean }>({});

  // Player/game state that should trigger rerender
  const [stats, setStats] = useState({
    hunger: 80,
    adorability: 60,
    stamina: 90,
  });

  // Player position in px (for smooth movement)
  const player = useRef({
    ...initialPlayer,
    x: initialPlayer.col * TILE_SIZE + TILE_SIZE/2,
    y: initialPlayer.row * TILE_SIZE + TILE_SIZE/2,
  });

  // Resize canvas to fill viewport (mobile-first)
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // --- Keyboard input ---
  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
      if (e.key in directions) {
        keysPressed.current[e.key as DirKey] = true;
      }
    };
    const handleUp = (e: KeyboardEvent) => {
      if (e.key in directions) {
        keysPressed.current[e.key as DirKey] = false;
      }
    };
    window.addEventListener("keydown", handleDown);
    window.addEventListener("keyup", handleUp);
    return () => {
      window.removeEventListener("keydown", handleDown);
      window.removeEventListener("keyup", handleUp);
    };
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

      // Compute intended move in tile space
      const speed = player.current.speed * scale;
      let nextX = player.current.x + dx * speed;
      let nextY = player.current.y + dy * speed;

      // Clamp to map bounds
      const r = player.current.size/2 * scale;
      nextX = Math.max(r, Math.min(mapW*scale - r, nextX));
      nextY = Math.max(r, Math.min(mapH*scale - r, nextY));

      // Collision test: check 4 corners of player hitbox in tile coordinates
      const isWalkable = (px: number, py: number) => {
        const tileX = Math.floor(px / (TILE_SIZE * scale));
        const tileY = Math.floor(py / (TILE_SIZE * scale));
        // Out of bounds is not walkable
        if (
          tileX < 0 ||
          tileY < 0 ||
          tileX >= MAP_COLS ||
          tileY >= MAP_ROWS
        )
          return false;
        // Is wall?
        if (officeMap[tileY][tileX] === 1) return false;
        // Is object?
        for (const obj of objects) {
          if (obj.col === tileX && obj.row === tileY) return false;
        }
        // Is coworker?
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

      // --- Drawing ---
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. HUD overlay
      drawHUD(ctx, stats, canvas.width, HUD_HEIGHT);

      // 2. Draw map
      for (let y = 0; y < MAP_ROWS; ++y) {
        for (let x = 0; x < MAP_COLS; ++x) {
          const tile = officeMap[y][x];
          ctx.save();
          ctx.translate(offsetX + x * TILE_SIZE * scale, offsetY + y * TILE_SIZE * scale);
          // Floor
          ctx.fillStyle = tile === 1 ? "#4e495a" : "#e3decf";
          ctx.fillRect(0, 0, TILE_SIZE * scale, TILE_SIZE * scale);
          // Gridlines (optional)
          ctx.strokeStyle = "rgba(0,0,0,0.1)";
          ctx.lineWidth = 1;
          ctx.strokeRect(0, 0, TILE_SIZE * scale, TILE_SIZE * scale);
          ctx.restore();
        }
      }

      // 3. Draw interactive objects
      for (const obj of objects) {
        ctx.save();
        ctx.translate(
          offsetX + (obj.col + 0.5) * TILE_SIZE * scale,
          offsetY + (obj.row + 0.5) * TILE_SIZE * scale
        );
        switch (obj.type) {
          case "bowl": // Feeding bowl: blue ellipse
            ctx.beginPath();
            ctx.ellipse(0, 0, 14 * scale, 9 * scale, 0, 0, Math.PI * 2);
            ctx.fillStyle = "#3498db";
            ctx.fill();
            ctx.strokeStyle = "#1c4966";
            ctx.lineWidth = 2 * scale;
            ctx.stroke();
            break;
          case "fridge": // Fridge: white rectangle
            ctx.fillStyle = "#fafafa";
            ctx.fillRect(-11 * scale, -18 * scale, 22 * scale, 36 * scale);
            ctx.strokeStyle = "#bbb";
            ctx.strokeRect(-11 * scale, -18 * scale, 22 * scale, 36 * scale);
            break;
          case "alcohol": // Alcohol: green bottle
            ctx.beginPath();
            ctx.ellipse(0, 0, 5 * scale, 12 * scale, 0, 0, Math.PI * 2);
            ctx.fillStyle = "#387d3b";
            ctx.fill();
            ctx.strokeStyle = "#1c3d1d";
            ctx.stroke();
            // Bottle cap
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
        // Seated coworker: body (rect), head (circle)
        ctx.fillStyle = "#8e44ad";
        ctx.fillRect(-13 * scale, 7 * scale, 26 * scale, 12 * scale);
        ctx.beginPath();
        ctx.arc(0, 0, 10 * scale, 0, Math.PI * 2);
        ctx.fillStyle = "#ffdcb2";
        ctx.fill();
        // Name tag
        ctx.font = `${10 * scale}px monospace`;
        ctx.fillStyle = "#111";
        ctx.textAlign = "center";
        ctx.fillText(c.name, 0, 22 * scale);
        ctx.restore();
      }

      // 5. Draw player (dog as a brown circle with ear "triangle")
      ctx.save();
      ctx.translate(player.current.x * scale + offsetX - mapW * (scale - 1) / 2, player.current.y * scale + offsetY - mapH * (scale - 1) / 2);
      // Body
      ctx.beginPath();
      ctx.arc(0, 0, player.current.size * scale / 2, 0, Math.PI * 2);
      ctx.fillStyle = "#b08453";
      ctx.fill();
      ctx.strokeStyle = "#6d4c1a";
      ctx.lineWidth = 2 * scale;
      ctx.stroke();
      // Ear (triangle)
      ctx.beginPath();
      ctx.moveTo(-10 * scale, -12 * scale);
      ctx.lineTo(-2 * scale, -18 * scale);
      ctx.lineTo(2 * scale, -10 * scale);
      ctx.closePath();
      ctx.fillStyle = "#6d4c1a";
      ctx.fill();
      ctx.restore();

      anim = requestAnimationFrame(render);
    };
    anim = requestAnimationFrame(render);
    return () => cancelAnimationFrame(anim);
  }, [stats]);

  // -- Touch D-pad handlers (mobile) --
  const handleDpad = (key: DirKey, pressed: boolean) => {
    keysPressed.current[key] = pressed;
  };

  // --- HUD Drawing function ---
  function drawHUD(ctx: CanvasRenderingContext2D, stats: typeof maxStats, width: number, height: number) {
    ctx.save();
    ctx.globalAlpha = 0.95;
    ctx.fillStyle = "#181c24";
    ctx.fillRect(0, 0, width, height);
    ctx.globalAlpha = 1.0;

    // Draw stat bars
    const margin = 15, barH = 16, spacing = 28, barW = 110;
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
      ctx.fillRect(margin + 78, margin + idx * spacing, (barW * val) / 100, barH);
      // Value
      ctx.fillStyle = "#fff";
      ctx.font = "bold 13px monospace";
      ctx.textAlign = "right";
      ctx.fillText(String(val), margin + 78 + barW + 38, margin + idx * spacing + barH - 2);
      ctx.restore();
    });

    // Title
    ctx.save();
    ctx.font = "bold 18px monospace";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText("OFFICE DOG QUEST", width / 2, 26);
    ctx.restore();

    ctx.restore();
  }

  // --- Main render ---
  return (
    <div className="game-root">
      <canvas ref={canvasRef} className="game-canvas" />
      {/* D-pad for mobile */}
      <div className="dpad">
        <button
          className="dpad-btn up"
          aria-label="Up"
          onTouchStart={(e) => { e.preventDefault(); handleDpad("ArrowUp", true); }}
          onTouchEnd={(e) => { e.preventDefault(); handleDpad("ArrowUp", false); }}
        >▲</button>
        <div className="dpad-row">
          <button
            className="dpad-btn left"
            aria-label="Left"
            onTouchStart={(e) => { e.preventDefault(); handleDpad("ArrowLeft", true); }}
            onTouchEnd={(e) => { e.preventDefault(); handleDpad("ArrowLeft", false); }}
          >◀</button>
          <span className="dpad-center" />
          <button
            className="dpad-btn right"
            aria-label="Right"
            onTouchStart={(e) => { e.preventDefault(); handleDpad("ArrowRight", true); }}
            onTouchEnd={(e) => { e.preventDefault(); handleDpad("ArrowRight", false); }}
          >▶</button>
        </div>
        <button
          className="dpad-btn down"
          aria-label="Down"
          onTouchStart={(e) => { e.preventDefault(); handleDpad("ArrowDown", true); }}
          onTouchEnd={(e) => { e.preventDefault(); handleDpad("ArrowDown", false); }}
        >▼</button>
      </div>
    </div>
  );
}