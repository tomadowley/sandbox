import React, { useRef, useEffect, useState } from "react";

const WIDTH = 800;
const HEIGHT = 600;

interface Viewport {
  x: number;
  y: number;
  scale: number;
}

function drawMandelbrot(
  ctx: CanvasRenderingContext2D,
  viewport: Viewport,
  width: number,
  height: number
) {
  const maxIter = 100;

  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  for (let px = 0; px < width; px++) {
    for (let py = 0; py < height; py++) {
      // Convert pixel to complex number
      const x0 = viewport.x + (px - width / 2) * viewport.scale;
      const y0 = viewport.y + (py - height / 2) * viewport.scale;
      let x = 0;
      let y = 0;
      let iteration = 0;

      while (x * x + y * y <= 4 && iteration < maxIter) {
        const xtemp = x * x - y * y + x0;
        y = 2 * x * y + y0;
        x = xtemp;
        iteration++;
      }

      const idx = 4 * (py * width + px);
      if (iteration === maxIter) {
        // Inside Mandelbrot set: black
        data[idx] = 0;
        data[idx + 1] = 0;
        data[idx + 2] = 0;
      } else {
        // Outside Mandelbrot set: white
        data[idx] = 255;
        data[idx + 1] = 255;
        data[idx + 2] = 255;
      }
      data[idx + 3] = 255; // Opaque
    }
  }
  ctx.putImageData(imageData, 0, 0);
}

const MandelbrotViewer: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Centered at (-0.5, 0), typical for Mandelbrot
  const [viewport, setViewport] = useState<Viewport>({
    x: -0.5,
    y: 0,
    scale: 3.0 / WIDTH,
  });

  // Redraw Mandelbrot set when viewport changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    drawMandelbrot(ctx, viewport, WIDTH, HEIGHT);
  }, [viewport]);

  // Zoom with mouse wheel and drag to pan
  const isPanning = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // Handle mouse wheel for zoom
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Convert pixel to complex-plane coordinate
    const x0 = viewport.x + (mouseX - WIDTH / 2) * viewport.scale;
    const y0 = viewport.y + (mouseY - HEIGHT / 2) * viewport.scale;

    const zoom = e.deltaY < 0 ? 0.8 : 1.25;
    const newScale = viewport.scale * zoom;

    // Adjust viewport.x/y so the point under the mouse stays fixed
    setViewport((v) => ({
      x: x0 - (mouseX - WIDTH / 2) * newScale,
      y: y0 - (mouseY - HEIGHT / 2) * newScale,
      scale: newScale,
    }));
  };

  // Handle drag to pan
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isPanning.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isPanning.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPanning.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };

    setViewport((v) => ({
      x: v.x - dx * v.scale,
      y: v.y - dy * v.scale,
      scale: v.scale,
    }));
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Mandelbrot Set Viewer</h2>
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        style={{
          border: "1px solid #333",
          cursor: isPanning.current ? "grabbing" : "grab",
          background: "#000",
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        tabIndex={0}
      />
      <div style={{ marginTop: 8 }}>
        <span>
          Drag to pan, scroll to zoom. <br />
          Center: ({viewport.x.toFixed(5)}, {viewport.y.toFixed(5)}) | Zoom: {(3.0/viewport.scale/WIDTH).toFixed(2)}x
        </span>
      </div>
    </div>
  );
};

export default MandelbrotViewer;