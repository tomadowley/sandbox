import React, { useRef, useEffect } from "react";

type Player = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  width: number;
  height: number;
  onGround: boolean;
};

type Platform = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const WIDTH = 600;
const HEIGHT = 400;
const GRAVITY = 0.6;
const JUMP_VELOCITY = -11;
const MOVE_SPEED = 3;

function createPlatforms(): Platform[] {
  return [
    { x: 0, y: HEIGHT - 24, width: WIDTH, height: 24 },    // Ground
    { x: 100, y: 320, width: 120, height: 16 },
    { x: 280, y: 240, width: 120, height: 16 },
    { x: 180, y: 150, width: 80, height: 16 },
    { x: 420, y: 180, width: 120, height: 16 },
    { x: 40, y: 85, width: 90, height: 16 },
  ];
}

export const PlatformerGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const keys = useRef<{ [key: string]: boolean }>({});
  const animation = useRef<number>();
  
  useEffect(() => {
    const player: Player = {
      x: 50,
      y: HEIGHT - 60,
      vx: 0,
      vy: 0,
      width: 30,
      height: 30,
      onGround: false,
    };
    const platforms = createPlatforms();

    const handleKeyDown = (e: KeyboardEvent) => {
      keys.current[e.code] = true;
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    function collidePlatform(p: Player, plat: Platform): boolean {
      return (
        p.x < plat.x + plat.width &&
        p.x + p.width > plat.x &&
        p.y < plat.y + plat.height &&
        p.y + p.height > plat.y
      );
    }

    function update() {
      // Movement
      if (keys.current["ArrowLeft"] || keys.current["KeyA"]) {
        player.vx = -MOVE_SPEED;
      } else if (keys.current["ArrowRight"] || keys.current["KeyD"]) {
        player.vx = MOVE_SPEED;
      } else {
        player.vx = 0;
      }
      // Jump
      if ((keys.current["ArrowUp"] || keys.current["Space"] || keys.current["KeyW"]) && player.onGround) {
        player.vy = JUMP_VELOCITY;
        player.onGround = false;
      }

      // Physics
      player.vy += GRAVITY;
      player.x += player.vx;
      player.y += player.vy;
      player.onGround = false;

      // Collision
      for (const plat of platforms) {
        // Only check if falling
        if (
          player.vy >= 0 &&
          player.y + player.height <= plat.y + player.vy &&
          player.x + player.width > plat.x + 2 &&
          player.x < plat.x + plat.width - 2 &&
          player.y + player.height >= plat.y &&
          player.y + player.height <= plat.y + plat.height
        ) {
          // Land on platform
          player.y = plat.y - player.height;
          player.vy = 0;
          player.onGround = true;
        }
      }
      // Prevent out of bounds
      if (player.x < 0) player.x = 0;
      if (player.x + player.width > WIDTH) player.x = WIDTH - player.width;
      if (player.y + player.height > HEIGHT) {
        player.y = HEIGHT - player.height;
        player.vy = 0;
        player.onGround = true;
      }
    }

    function draw(ctx: CanvasRenderingContext2D) {
      ctx.clearRect(0, 0, WIDTH, HEIGHT);

      // Platforms
      ctx.fillStyle = "#654321";
      for (const plat of platforms) {
        ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
      }
      // Player
      ctx.fillStyle = "#2374f9";
      ctx.fillRect(player.x, player.y, player.width, player.height);

      // Text
      ctx.fillStyle = "#111";
      ctx.font = "18px monospace";
      ctx.fillText("⬅️➡️ Move  ⬆️/Space Jump", 16, 24);
    }

    function gameLoop() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      update();
      draw(ctx);

      animation.current = requestAnimationFrame(gameLoop);
    }

    animation.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      if (animation.current) cancelAnimationFrame(animation.current);
    };
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>2D Platformer Game</h2>
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        style={{
          border: "2px solid #444",
          background: "#cfe5fc",
          margin: "auto",
          display: "block",
          maxWidth: "100%"
        }}
      />
    </div>
  );
};

export default PlatformerGame;