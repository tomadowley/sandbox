import React, { useRef, useEffect } from "react";
import "./App.css";

function drawFractal(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  t: number
) {
  // Mandelbrot zoom animation with color cycling
  // Animate zoom-in and center
  const zoom = 1.3 + Math.sin(t / 2000) * 1.1 + (Math.cos(t / 9000) * 2.0);
  const offsetX = -0.7 + Math.sin(t / 6100) * 0.3;
  const offsetY = 0.0 + Math.cos(t / 8300) * 0.25;

  // Color cycling coefficients
  const colorOffset = t / 1200;

  ctx.clearRect(0, 0, width, height);

  // Adapt pixel density for high-DPI screens
  for (let px = 0; px < width; px++) {
    for (let py = 0; py < height; py++) {
      // Map pixel to fractal coordinate
      const x0 =
        ((px / width) * 3.5 - 2.5) / zoom + offsetX;
      const y0 =
        ((py / height) * 2.6 - 1.3) / zoom + offsetY;

      let x = 0,
        y = 0,
        iter = 0;
      const maxIter = 70 + Math.floor(35 * Math.sin(t / 3500));
      while (x * x + y * y < 4 && iter < maxIter) {
        let xtemp = x * x - y * y + x0;
        y = 2 * x * y + y0;
        x = xtemp;
        iter++;
      }

      let color;
      if (iter === maxIter) {
        color = "rgb(20,20,38)";
      } else {
        // Smooth coloring
        let smooth = iter + 1 - Math.log2(Math.log2(x * x + y * y));
        let hue = (smooth * 6 + colorOffset * 360) % 360;
        let sat = 95;
        let light = 53;
        color = `hsl(${hue},${sat}%,${light}%)`;
      }
      ctx.fillStyle = color;
      ctx.fillRect(px, py, 1, 1);
    }
  }
}

function FractalVideo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let anim: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;

    const adaptCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = ~~(Math.min(window.innerWidth, 700) * dpr);
      const height = ~~(Math.min(window.innerHeight, 700) * dpr * 0.85);
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = width / dpr + "px";
      canvas.style.height = height / dpr + "px";
    };

    adaptCanvas();

    window.addEventListener("resize", adaptCanvas);

    function tick() {
      if (!running) return;
      const now = Date.now();
      drawFractal(ctx, canvas.width, canvas.height, now);
      anim = requestAnimationFrame(tick);
    }
    tick();

    return () => {
      running = false;
      window.removeEventListener("resize", adaptCanvas);
      cancelAnimationFrame(anim);
    };
  }, []);

  return (
    <div className="fractal-video-container">
      <canvas ref={canvasRef} className="fractal-canvas" />
      <div className="fractal-caption">Fractal Video</div>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <FractalVideo />
    </div>
  );
}

export default App;
