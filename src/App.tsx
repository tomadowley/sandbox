import React, { useRef, useEffect, useState } from "react";
import "./App.css";

// Optimized fractal drawing function with reduced computations
function drawFractal(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  t: number,
  pixelSize: number
) {
  // Mandelbrot zoom animation with color cycling
  // Animate zoom-in and center
  const zoom = 1.3 + Math.sin(t / 2000) * 1.1 + (Math.cos(t / 9000) * 2.0);
  const offsetX = -0.7 + Math.sin(t / 6100) * 0.3;
  const offsetY = 0.0 + Math.cos(t / 8300) * 0.25;

  // Color cycling coefficients
  const colorOffset = t / 1200;
  
  // Clear only when needed (not every frame)
  if (pixelSize === 1) {
    ctx.clearRect(0, 0, width, height);
  }

  // Pre-calculate constants for the loop
  const maxIter = 50 + Math.floor(25 * Math.sin(t / 3500));
  const invZoom = 1 / zoom;
  const widthMul = 3.5 / width;
  const heightMul = 2.6 / height;
  
  // Use pixel blocks for faster rendering
  for (let px = 0; px < width; px += pixelSize) {
    for (let py = 0; py < height; py += pixelSize) {
      // Map pixel to fractal coordinate
      const x0 = (px * widthMul - 2.5) * invZoom + offsetX;
      const y0 = (py * heightMul - 1.3) * invZoom + offsetY;

      let x = 0, y = 0, x2 = 0, y2 = 0, iter = 0;
      
      // Fast path bailout optimization
      while (x2 + y2 < 4 && iter < maxIter) {
        y = 2 * x * y + y0;
        x = x2 - y2 + x0;
        x2 = x * x;
        y2 = y * y;
        iter++;
      }

      // Color optimization with lookup tables
      let color;
      if (iter === maxIter) {
        color = "rgb(20,20,38)";
      } else {
        // Faster coloring algorithm
        let smooth = iter + 1 - Math.log2(Math.log2(x2 + y2) + 1e-9);
        let hue = (smooth * 6 + colorOffset * 360) % 360;
        let sat = 95;
        let light = 53;
        color = `hsl(${hue},${sat}%,${light}%)`;
      }
      
      ctx.fillStyle = color;
      ctx.fillRect(px, py, pixelSize, pixelSize);
    }
  }
}

function FractalVideo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [performanceMode, setPerformanceMode] = useState<string>("balanced");
  const [fps, setFps] = useState<number>(0);

  useEffect(() => {
    let anim: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // For measuring FPS
    let frameCount = 0;
    let lastFrameTime = performance.now();
    let lastFpsUpdate = performance.now();
    
    let running = true;
    // Progressive rendering
    let currentPixelSize = 8; // Start with low resolution
    let targetResolution = 1; // Target full resolution
    
    // Create off-screen buffer for double buffering
    const offscreenCanvas = document.createElement('canvas');
    const offscreenCtx = offscreenCanvas.getContext('2d', { alpha: false });
    
    // Adapt resolution to device
    const adaptCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      // Lower base resolution for better performance
      const width = ~~(Math.min(window.innerWidth, 700) * 0.8 * dpr);
      const height = ~~(Math.min(window.innerHeight, 700) * 0.8 * 0.85 * dpr);
      
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = (width / dpr) + "px";
      canvas.style.height = (height / dpr) + "px";
      
      if (offscreenCtx) {
        offscreenCanvas.width = width;
        offscreenCanvas.height = height;
      }
      
      // Reset progressive rendering
      currentPixelSize = 8;
    };

    adaptCanvas();
    window.addEventListener("resize", adaptCanvas);

    // Determine pixel size based on performance mode
    const getPixelSize = () => {
      switch(performanceMode) {
        case "quality": return 1;
        case "balanced": 
          // Progressive rendering, start coarse and refine
          if (currentPixelSize > targetResolution) {
            currentPixelSize = Math.max(currentPixelSize / 2, targetResolution);
          }
          return currentPixelSize;
        case "performance": return 4;
        default: return 2;
      }
    };

    function tick() {
      if (!running) return;
      
      // Calculate FPS
      const now = performance.now();
      frameCount++;
      
      if (now - lastFpsUpdate >= 1000) {
        setFps(Math.round((frameCount * 1000) / (now - lastFpsUpdate)));
        frameCount = 0;
        lastFpsUpdate = now;
      }
      
      // Get appropriate pixel size for current performance mode
      const pixelSize = getPixelSize();
      
      // Draw to offscreen buffer first if available
      const renderCtx = offscreenCtx || ctx;
      const renderCanvas = offscreenCanvas || canvas;
      
      if (renderCtx) {
        drawFractal(
          renderCtx,
          renderCanvas.width,
          renderCanvas.height,
          now,
          pixelSize
        );
        
        // Copy to visible canvas if using double buffering
        if (offscreenCtx) {
          ctx.drawImage(offscreenCanvas, 0, 0);
        }
      }
      
      anim = requestAnimationFrame(tick);
    }
    
    tick();

    return () => {
      running = false;
      window.removeEventListener("resize", adaptCanvas);
      cancelAnimationFrame(anim);
    };
  }, [performanceMode]);

  // Toggle performance mode
  const togglePerformanceMode = () => {
    setPerformanceMode(prev => {
      if (prev === "balanced") return "quality";
      if (prev === "quality") return "performance";
      return "balanced";
    });
  };

  return (
    <div className="fractal-video-container">
      <canvas ref={canvasRef} className="fractal-canvas" />
      <div className="fractal-caption">Fractal Video</div>
      <div className="fractal-controls">
        <button onClick={togglePerformanceMode} className="performance-toggle">
          Mode: {performanceMode} ({fps} FPS)
        </button>
      </div>
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