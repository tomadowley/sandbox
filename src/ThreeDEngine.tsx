import React, { useRef, useEffect } from "react";
import { Renderer3D } from "./Renderer3D";

const CANVAS_SIZE = 480;

const ThreeDEngine: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<Renderer3D | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    rendererRef.current = new Renderer3D(canvas);
    rendererRef.current.start();

    return () => {
      rendererRef.current?.stop();
    };
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>3D Rendering Engine Demo</h2>
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        style={{
          border: "1px solid #444",
          background: "#111",
        }}
      />
    </div>
  );
};

export default ThreeDEngine;