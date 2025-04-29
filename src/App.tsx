import React, { useRef, useEffect, useState } from "react";
import "./App.css";

// Optimization technique: pre-compute color palette to avoid expensive calculations in the render loop
function generateColorPalette(size: number): string[] {
  const palette: string[] = [];
  for (let i = 0; i < size; i++) {
    const hue = (i * 6) % 360;
    palette.push(`hsl(${hue}, 95%, 53%)`);
  }
  return palette;
}

// The worker will handle the heavy computation
const workerCode = `
  let width = 0;
  let height = 0;
  let colorPalette = [];
  let frameCount = 0;
  
  self.onmessage = function(e) {
    const { type, data } = e.data;
    
    if (type === 'init') {
      width = data.width;
      height = data.height;
      colorPalette = data.colorPalette;
    } 
    else if (type === 'render') {
      const { zoom, offsetX, offsetY, colorOffset } = data;
      frameCount++;
      
      // Use lower resolution when moving and progressively improve
      const pixelSkip = data.highQuality ? 1 : 2;
      
      // Use a typed array for better performance
      const pixelData = new Uint8ClampedArray(width * height * 4);
      
      let yStart = frameCount % pixelSkip;
      
      // Stagger the pixel calculation to improve responsiveness
      for (let py = yStart; py < height; py += pixelSkip) {
        for (let px = 0; px < width; px += pixelSkip) {
          const x0 = ((px / width) * 3.5 - 2.5) / zoom + offsetX;
          const y0 = ((py / height) * 2.6 - 1.3) / zoom + offsetY;
          
          let x = 0, y = 0, iter = 0;
          const maxIter = 100;
          
          // Fast path bailout - check if point is in main bulb or cardioid
          const q = (x0-0.25)*(x0-0.25) + y0*y0;
          if (x0 * (x0 + 1) + y0 * y0 < 0.25 || q*(q+(x0-0.25)) < 0.25*y0*y0) {
            iter = maxIter;
          } else {
            // Classic Mandelbrot iteration
            while (x*x + y*y < 4 && iter < maxIter) {
              const xtemp = x*x - y*y + x0;
              y = 2*x*y + y0;
              x = xtemp;
              iter++;
            }
          }
          
          // Get color from palette
          let idx, r, g, b;
          if (iter === maxIter) {
            r = 20; g = 20; b = 38;
          } else {
            // Simple smooth coloring
            const smoothed = iter + 1 - Math.log(Math.log(x*x + y*y)) / Math.LN2;
            idx = Math.floor((smoothed * 10 + colorOffset) % colorPalette.length);
            
            // Parse HSL color (simplified)
            const h = (idx * 6) % 360;
            // HSL to RGB conversion (simplified for performance)
            const c = 0.95 * 0.53 * 2;
            const x = c * (1 - Math.abs((h / 60) % 2 - 1));
            const m = 0.53 - c/2;
            
            let rc, gc, bc;
            if (h < 60) { rc = c; gc = x; bc = 0; }
            else if (h < 120) { rc = x; gc = c; bc = 0; }
            else if (h < 180) { rc = 0; gc = c; bc = x; }
            else if (h < 240) { rc = 0; gc = x; bc = c; }
            else if (h < 300) { rc = x; gc = 0; bc = c; }
            else { rc = c; gc = 0; bc = x; }
            
            r = Math.round((rc + m) * 255);
            g = Math.round((gc + m) * 255);
            b = Math.round((bc + m) * 255);
          }
          
          // Fill the area if using pixel skipping
          for (let fillY = 0; fillY < pixelSkip && py + fillY < height; fillY++) {
            for (let fillX = 0; fillX < pixelSkip && px + fillX < width; fillX++) {
              const pixelIndex = ((py + fillY) * width + (px + fillX)) * 4;
              pixelData[pixelIndex] = r;
              pixelData[pixelIndex + 1] = g;
              pixelData[pixelIndex + 2] = b;
              pixelData[pixelIndex + 3] = 255;
            }
          }
        }
      }
      
      self.postMessage({ 
        type: 'renderComplete', 
        pixelData, 
        width, 
        height,
        yStart,
        pixelSkip
      });
    }
  };
`;

function FractalVideo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerRef = useRef<Worker | null>(null);
  const [isHighQuality, setIsHighQuality] = useState(false);
  const [fps, setFps] = useState(0);

  useEffect(() => {
    // Create a blob URL for the worker
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    const workerURL = URL.createObjectURL(blob);
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Get the 2d context
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;
    
    // Initialize dimensions
    let width = canvas.width;
    let height = canvas.height;
    let isFirstRender = true;
    let running = true;
    let frameCount = 0;
    let lastTimestamp = performance.now();
    let lastFpsUpdate = performance.now();
    
    // Performance optimization: Create worker for heavy computation
    const worker = new Worker(workerURL);
    workerRef.current = worker;
    
    // Generate color palette
    const colorPalette = generateColorPalette(360);
    
    // Handle messages from worker
    worker.onmessage = (e) => {
      if (!running || !ctx || !canvas) return;
      
      if (e.data.type === 'renderComplete') {
        const { pixelData, width, height, yStart, pixelSkip } = e.data;
        
        // Create ImageData from the pixel data array
        const imageData = new ImageData(pixelData, width, height);
        ctx.putImageData(imageData, 0, 0);
        
        // Update FPS counter every second
        frameCount++;
        const now = performance.now();
        if (now - lastFpsUpdate > 1000) {
          const elapsed = (now - lastFpsUpdate) / 1000;
          setFps(Math.round(frameCount / elapsed));
          frameCount = 0;
          lastFpsUpdate = now;
        }
      }
    };
    
    const adaptCanvas = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      
      // Use lower resolution for better performance
      const scaleFactor = isHighQuality ? 1 : 0.6;
      
      const containerWidth = Math.min(window.innerWidth * 0.95, 700);
      const containerHeight = Math.min(window.innerHeight * 0.6, 700);
      
      // Physical size (CSS pixels)
      canvas.style.width = `${containerWidth}px`;
      canvas.style.height = `${containerHeight}px`;
      
      // Actual render resolution (scaled down for performance)
      width = Math.floor(containerWidth * pixelRatio * scaleFactor);
      height = Math.floor(containerHeight * pixelRatio * scaleFactor);
      
      canvas.width = width;
      canvas.height = height;
      
      // Initialize the worker when size changes
      worker.postMessage({
        type: 'init',
        data: {
          width,
          height,
          colorPalette
        }
      });
      
      isFirstRender = true;
    };
    
    // Initialize canvas size
    adaptCanvas();
    
    // Handle resize events
    window.addEventListener('resize', adaptCanvas);
    
    // Animation state
    let animTime = 0;
    let lastFrame = performance.now();
    
    // Main animation loop
    const animate = () => {
      if (!running) return;
      
      const now = performance.now();
      const deltaTime = now - lastFrame;
      lastFrame = now;
      
      // Control animation speed
      animTime += deltaTime * 0.15;
      
      // Calculate parameters for rendering
      const t = animTime;
      
      // Smooth zoom and pan animations
      const zoom = 1.3 + Math.sin(t / 3000) * 1.0 + (Math.cos(t / 9000) * 1.5);
      const offsetX = -0.7 + Math.sin(t / 7100) * 0.3;
      const offsetY = 0.0 + Math.cos(t / 6300) * 0.25;
      const colorOffset = t / 200;
      
      // Tell worker to render a frame
      worker.postMessage({
        type: 'render',
        data: {
          zoom,
          offsetX,
          offsetY,
          colorOffset,
          highQuality: isHighQuality
        }
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Toggle quality when clicking on canvas
    const handleClick = () => {
      setIsHighQuality(!isHighQuality);
    };
    
    canvas.addEventListener('click', handleClick);
    
    return () => {
      running = false;
      URL.revokeObjectURL(workerURL);
      worker.terminate();
      workerRef.current = null;
      window.removeEventListener('resize', adaptCanvas);
      canvas.removeEventListener('click', handleClick);
    };
  }, [isHighQuality]);

  return (
    <div className="fractal-video-container">
      <canvas ref={canvasRef} className="fractal-canvas" />
      <div className="fractal-caption">Fractal Video</div>
      <div className="fractal-info">
        <div className="fps-counter">{fps} FPS</div>
        <div className="quality-toggle">
          {isHighQuality ? "High Quality" : "Performance Mode"} (click to toggle)
        </div>
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