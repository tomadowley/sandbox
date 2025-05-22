import React, { useRef, useEffect, useState } from "react";

/**
 * Fullscreen, responsive game component with keyboard and touch D-pad input.
 */
const directions = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
};

type DirKey = keyof typeof directions;

const dpadButtons: { key: DirKey; label: string }[] = [
  { key: "ArrowUp", label: "▲" },
  { key: "ArrowLeft", label: "◀" },
  { key: "ArrowDown", label: "▼" },
  { key: "ArrowRight", label: "▶" },
];

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [movement, setMovement] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Simple player state
  const player = useRef({ x: 100, y: 100, size: 40, speed: 3 });

  // Track which keys are pressed
  const keysPressed = useRef<{ [k in DirKey]?: boolean }>({});

  // Resize canvas to fill viewport
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

  // Keyboard input
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

  // Main game loop
  useEffect(() => {
    let anim: number;
    const render = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (!canvas || !ctx) return;

      // Movement logic
      let dx = 0,
        dy = 0;
      for (const key in keysPressed.current) {
        if (keysPressed.current[key as DirKey]) {
          const [mx, my] = directions[key as DirKey];
          dx += mx;
          dy += my;
        }
      }
      // Normalize diagonal movement
      if (dx && dy) {
        dx *= Math.SQRT1_2;
        dy *= Math.SQRT1_2;
      }
      player.current.x += dx * player.current.speed;
      player.current.y += dy * player.current.speed;

      // Keep player in bounds
      player.current.x = Math.max(0, Math.min(canvas.width - player.current.size, player.current.x));
      player.current.y = Math.max(0, Math.min(canvas.height - player.current.size, player.current.y));

      // Drawing
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Example: Draw player
      ctx.fillStyle = "#3498db";
      ctx.fillRect(player.current.x, player.current.y, player.current.size, player.current.size);

      anim = requestAnimationFrame(render);
    };
    anim = requestAnimationFrame(render);
    return () => cancelAnimationFrame(anim);
  }, []);

  // Touch D-pad handlers (mobile)
  const handleDpad = (key: DirKey, pressed: boolean) => {
    keysPressed.current[key] = pressed;
    // Move immediately for tap
    if (pressed) {
      setMovement((m) => ({ ...m, [key]: true }));
    } else {
      setMovement((m) => ({ ...m, [key]: false }));
    }
  };

  // D-pad layout (mobile)
  return (
    <div className="game-root">
      <canvas ref={canvasRef} className="game-canvas" />
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
    </div>
  );
}