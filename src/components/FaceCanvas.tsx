import React, { useEffect, useRef } from "react";

// Simple deterministic PRNG (mulberry32)
function mulberry32(seed: number) {
  let t = seed;
  return function() {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ t >>> 15, t | 1);
    r ^= r + Math.imul(r ^ r >>> 7, r | 61);
    return ((r ^ r >>> 14) >>> 0) / 4294967296;
  }
}

const SKIN_TONES = [
  "#f2d6cb", "#ffe1cd", "#d9aa87", "#b47d56", "#8d5524"
];
const HAIR_COLORS = [
  "#5a3a1b", "#2d1b10", "#d1b280", "#b55239", "#000", "#f5e4b7"
];
const EYE_COLORS = [
  "#5c4328", // brown
  "#a0522d", // hazel
  "#3e8469", // green
  "#487baf"  // blue
];

type FaceCanvasProps = {
  seed: number | string;
  className?: string;
};

export const FaceCanvas: React.FC<FaceCanvasProps> = ({ seed, className }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Convert seed to number
    let numericSeed: number;
    if (typeof seed === "number") numericSeed = seed;
    else {
      // Hash string to number
      numericSeed = Array.from(seed)
        .map((ch, i) => ch.charCodeAt(0) * (i + 17))
        .reduce((a, b) => a + b, 0);
    }
    const rand = mulberry32(numericSeed);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, 220, 220);

    // --- Skin tone ---
    const skinColor = SKIN_TONES[Math.floor(rand() * SKIN_TONES.length)];
    // Head shape
    const headCenterX = 110, headCenterY = 120;
    const headRadiusX = 78 + rand() * 8; // ellipse width
    const headRadiusY = 95 + rand() * 8; // ellipse height

    // Subtle shading (radial gradient)
    const grad = ctx.createRadialGradient(
      headCenterX, headCenterY-30, 40,
      headCenterX, headCenterY, headRadiusY
    );
    grad.addColorStop(0, "#fff7");
    grad.addColorStop(0.7, skinColor);
    grad.addColorStop(1, "#0001");

    ctx.save();
    ctx.beginPath();
    ctx.ellipse(headCenterX, headCenterY, headRadiusX, headRadiusY, 0, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.restore();

    // --- Hair ---
    const hairColor = HAIR_COLORS[Math.floor(rand() * HAIR_COLORS.length)];
    const hairHeight = 40 + rand() * 16;
    const hairWidth = (headRadiusX * 2) * (0.7 + rand() * 0.3);
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(headCenterX, headCenterY - headRadiusY + hairHeight/2, hairWidth/2, hairHeight/2, 0, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = hairColor;
    ctx.shadowColor = "#0004";
    ctx.shadowBlur = 4;
    ctx.fill();
    ctx.restore();

    // Side hair (randomize length)
    if (rand() > 0.5) {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(headCenterX - headRadiusX + 16, headCenterY-10, 13, 24 + rand()*10, 0.3, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fillStyle = hairColor;
      ctx.globalAlpha = 0.8;
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.ellipse(headCenterX + headRadiusX - 16, headCenterY-10, 13, 24 + rand()*10, -0.3, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fillStyle = hairColor;
      ctx.globalAlpha = 0.8;
      ctx.fill();
      ctx.restore();
    }

    // --- Ears ---
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(headCenterX - headRadiusX + 10, headCenterY + 10, 15, 22, 0.1, 0, 2*Math.PI);
    ctx.ellipse(headCenterX + headRadiusX - 10, headCenterY + 10, 15, 22, -0.1, 0, 2*Math.PI);
    ctx.closePath();
    ctx.fillStyle = skinColor;
    ctx.globalAlpha = 0.89;
    ctx.fill();
    ctx.restore();

    // --- Eyes ---
    // left eye
    const eyeY = headCenterY - 25;
    const eyeSpacing = 38 + rand()*7;
    const eyeRadius = 15 + rand()*2;
    const scleraColor = "#fff";
    const irisColor = EYE_COLORS[Math.floor(rand() * EYE_COLORS.length)];
    const irisRadius = 7 + rand()*2;
    const pupilRadius = 3.7 + rand()*1.1;

    // Draw two eyes
    [headCenterX - eyeSpacing, headCenterX + eyeSpacing].forEach((eyeX) => {
      // Sclera
      ctx.save();
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, eyeRadius, 0, 2*Math.PI);
      ctx.closePath();
      ctx.fillStyle = scleraColor;
      ctx.shadowColor = "#0002";
      ctx.shadowBlur = 2;
      ctx.fill();
      ctx.restore();

      // Iris
      ctx.save();
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, irisRadius, 0, 2*Math.PI);
      ctx.closePath();
      ctx.fillStyle = irisColor;
      ctx.shadowColor = "#0003";
      ctx.shadowBlur = 2;
      ctx.fill();
      ctx.restore();

      // Pupil
      ctx.save();
      ctx.beginPath();
      ctx.arc(eyeX, eyeY, pupilRadius, 0, 2*Math.PI);
      ctx.closePath();
      ctx.fillStyle = "#222";
      ctx.fill();
      ctx.restore();

      // Reflection
      ctx.save();
      ctx.beginPath();
      ctx.arc(eyeX - irisRadius/3, eyeY - irisRadius/3, 2.2, 0, 2*Math.PI);
      ctx.closePath();
      ctx.fillStyle = "#fff";
      ctx.globalAlpha = 0.75;
      ctx.fill();
      ctx.restore();
    });

    // --- Nose ---
    ctx.save();
    ctx.beginPath();
    const noseY = headCenterY + 7;
    if (rand() > 0.5) {
      // Triangle
      ctx.moveTo(headCenterX, noseY - 12);
      ctx.lineTo(headCenterX - 10, noseY + 15);
      ctx.lineTo(headCenterX + 10, noseY + 15);
      ctx.closePath();
    } else {
      // Trapezoid
      ctx.moveTo(headCenterX - 7, noseY - 7);
      ctx.lineTo(headCenterX + 7, noseY - 7);
      ctx.lineTo(headCenterX + 11, noseY + 16);
      ctx.lineTo(headCenterX - 11, noseY + 16);
      ctx.closePath();
    }
    ctx.fillStyle = "#c4a48499";
    ctx.globalAlpha = 0.85;
    ctx.fill();
    ctx.restore();

    // --- Mouth ---
    const mouthY = headCenterY + 45;
    ctx.save();
    ctx.beginPath();
    const smile = rand() > 0.45;
    if (smile) {
      ctx.arc(headCenterX, mouthY, 22, Math.PI*0.13, Math.PI*0.87, false);
    } else {
      ctx.arc(headCenterX, mouthY + 4, 16, Math.PI*0.15, Math.PI*0.85, false);
    }
    ctx.lineWidth = 3.3;
    ctx.strokeStyle = "#8b3f2f";
    ctx.shadowColor = "#0003";
    ctx.shadowBlur = 1.5;
    ctx.stroke();
    ctx.restore();

  }, [seed]);

  return (
    <canvas
      ref={canvasRef}
      width={220}
      height={220}
      className={className ? "FaceCanvas " + className : "FaceCanvas"}
      aria-label="Randomly generated face"
      style={{ display: "block" }}
    />
  );
};

export default FaceCanvas;