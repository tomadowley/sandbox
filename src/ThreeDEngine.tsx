import React, { useRef, useEffect } from "react";
import { Renderer3D } from "./Renderer3D";

const CANVAS_SIZE = 640;

const ThreeDEngine: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<Renderer3D | null>(null);
  const dragging = useRef(false);
  const last = useRef({ x: 0, y: 0 });
  const lastYawPitch = useRef<[number, number]>([0, 0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    rendererRef.current = new Renderer3D(canvas);
    rendererRef.current.start();

    function onPointerDown(e: MouseEvent | TouchEvent) {
      dragging.current = true;
      let x = 0, y = 0;
      if (e instanceof MouseEvent) {
        x = e.clientX;
        y = e.clientY;
      } else if (e.touches && e.touches[0]) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      }
      last.current = { x, y };
      lastYawPitch.current = rendererRef.current!.getCameraRotation();
      window.addEventListener("mousemove", onPointerMove);
      window.addEventListener("touchmove", onPointerMove);
      window.addEventListener("mouseup", onPointerUp);
      window.addEventListener("touchend", onPointerUp);
    }
    function onPointerMove(e: MouseEvent | TouchEvent) {
      if (!dragging.current) return;
      let x = 0, y = 0;
      if (e instanceof MouseEvent) {
        x = e.clientX;
        y = e.clientY;
      } else if (e.touches && e.touches[0]) {
        x = e.touches[0].clientX;
        y = e.touches[0].clientY;
      }
      const dx = x - last.current.x;
      const dy = y - last.current.y;
      const [yaw, pitch] = lastYawPitch.current;
      rendererRef.current?.setCameraRotation(yaw + dx * 0.01, pitch + dy * 0.01);
    }
    function onPointerUp() {
      dragging.current = false;
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      window.removeEventListener("touchend", onPointerUp);
    }
    function onWheel(e: WheelEvent) {
      if (!rendererRef.current) return;
      const d = rendererRef.current.getCameraDistance();
      rendererRef.current.setCameraDistance(d + e.deltaY * 0.02);
    }

    const canvasElem = canvasRef.current;
    canvasElem?.addEventListener("mousedown", onPointerDown);
    canvasElem?.addEventListener("touchstart", onPointerDown);
    canvasElem?.addEventListener("wheel", onWheel);

    return () => {
      rendererRef.current?.stop();
      canvasElem?.removeEventListener("mousedown", onPointerDown);
      canvasElem?.removeEventListener("touchstart", onPointerDown);
      canvasElem?.removeEventListener("wheel", onWheel);
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("touchmove", onPointerMove);
      window.removeEventListener("mouseup", onPointerUp);
      window.removeEventListener("touchend", onPointerUp);
    };
  }, []);

  return (
    <div style={{ textAlign: "center" }}>
      <h2>3D Animated Gorillas (Drag to rotate, scroll to zoom)</h2>
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        style={{
          border: "1.5px solid #444",
          background: "#111",
          cursor: "grab",
        }}
      />
    </div>
  );
};

export default ThreeDEngine;