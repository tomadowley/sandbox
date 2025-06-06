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
  isDog?: boolean;
  specialVariant?: "gaddafi" | "aladeen";
  className?: string;
};

// Fur palette for dogs
const FUR_COLORS = [
  "#e1b382", // tan
  "#b08251", // brown
  "#232323", // black
  "#fff",    // white
  "#bcbcbc", // gray
  "#e1b382,#fff", // tan with white spot
  "#232323,#fff", // black with white spot
  "#fff,#b08251", // white with brown spot
];

function drawDog(ctx: CanvasRenderingContext2D, rand: () => number) {
  // Choose fur color, possibly multi-color for spot/mix
  const furCombo = FUR_COLORS[Math.floor(rand() * FUR_COLORS.length)];
  let [fur, spot] = furCombo.split(",");
  // Base head ellipse
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(110, 120, 78, 88, 0, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fillStyle = fur;
  ctx.fill();
  ctx.restore();

  // --- Snout (ellipse) ---
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(110, 170, 46, 32, 0, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fillStyle = "#fbeee0";
  ctx.globalAlpha = 0.87;
  ctx.fill();
  ctx.restore();

  // --- Ears ---
  const earType = rand();
  if (earType < 0.33) {
    // Floppy (beagle)
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(110-75, 85, 23, 48, 0.2, 0, 2 * Math.PI);
    ctx.ellipse(110+75, 85, 23, 48, -0.2, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = fur;
    ctx.globalAlpha = 0.92;
    ctx.fill();
    ctx.restore();
  } else if (earType < 0.66) {
    // Pointy (shepherd)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(110-64, 44);
    ctx.lineTo(110-94, 14);
    ctx.lineTo(110-54, 52);
    ctx.closePath();
    ctx.moveTo(110+64, 44);
    ctx.lineTo(110+94, 14);
    ctx.lineTo(110+54, 52);
    ctx.closePath();
    ctx.fillStyle = fur;
    ctx.globalAlpha = 0.9;
    ctx.fill();
    ctx.restore();
  } else {
    // Triangle (cartoon)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(110-70, 60);
    ctx.lineTo(110-90, 10);
    ctx.lineTo(110-40, 50);
    ctx.closePath();
    ctx.moveTo(110+70, 60);
    ctx.lineTo(110+90, 10);
    ctx.lineTo(110+40, 50);
    ctx.closePath();
    ctx.fillStyle = fur;
    ctx.globalAlpha = 0.91;
    ctx.fill();
    ctx.restore();
  }

  // --- Spot/patch on one eye (optional) ---
  if (spot && rand() > 0.4) {
    ctx.save();
    ctx.beginPath();
    const leftOrRight = rand() > 0.5 ? -1 : 1;
    ctx.ellipse(110 + leftOrRight * 36, 110, 20 + rand()*8, 26 + rand()*6, 0, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fillStyle = spot;
    ctx.globalAlpha = 0.5 + rand()*0.2;
    ctx.fill();
    ctx.restore();
  }

  // --- Eyes ---
  const eyeY = 120;
  const eyeSpacing = 34 + rand()*4;
  const eyeRadius = 13 + rand()*2;
  const irisColor = "#222";
  const pupilRadius = 6 + rand()*1.5;
  [110 - eyeSpacing, 110 + eyeSpacing].forEach((eyeX) => {
    // Eye white
    ctx.save();
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, eyeRadius, 0, 2*Math.PI);
    ctx.closePath();
    ctx.fillStyle = "#fff";
    ctx.shadowColor = "#0003";
    ctx.shadowBlur = 2;
    ctx.fill();
    ctx.restore();

    // Iris (dark)
    ctx.save();
    ctx.beginPath();
    ctx.arc(eyeX, eyeY, pupilRadius, 0, 2*Math.PI);
    ctx.closePath();
    ctx.fillStyle = irisColor;
    ctx.fill();
    ctx.restore();

    // Reflection
    ctx.save();
    ctx.beginPath();
    ctx.arc(eyeX - 2, eyeY - 2, 2, 0, 2*Math.PI);
    ctx.closePath();
    ctx.fillStyle = "#fff";
    ctx.globalAlpha = 0.7;
    ctx.fill();
    ctx.restore();
  });

  // --- Nose ---
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(110, 182, 17, 13, 0, 0, 2*Math.PI);
  ctx.closePath();
  ctx.fillStyle = "#232323";
  ctx.fill();
  ctx.restore();

  // --- Mouth line ---
  ctx.save();
  ctx.strokeStyle = "#603913";
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(110, 195);
  ctx.lineTo(110, 205);
  ctx.moveTo(110, 205);
  ctx.arc(110, 205, 15, Math.PI*0.15, Math.PI*0.85, false);
  ctx.stroke();
  ctx.restore();

  // --- Tongue (optional) ---
  if (rand() > 0.5) {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(110, 215, 13, 8, 0, 0, 2*Math.PI);
    ctx.closePath();
    ctx.fillStyle = "#ff7d84";
    ctx.globalAlpha = 0.89;
    ctx.fill();
    ctx.restore();
    // Tongue line
    ctx.save();
    ctx.strokeStyle = "#c4586e";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(110, 215);
    ctx.lineTo(110, 223);
    ctx.stroke();
    ctx.restore();
  }
}

export const FaceCanvas: React.FC<FaceCanvasProps> = ({ seed, isDog, specialVariant, className }) => {
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

    if (specialVariant === "gaddafi") {
      drawGaddafi(ctx);
      return;
    } else if (specialVariant === "aladeen") {
      drawAladeen(ctx);
      return;
    }

    if (isDog) {
      drawDog(ctx, rand);
      return;
    }

    // --- Skin tone ---
    const skinColor = SKIN_TONES[Math.floor(rand() * SKIN_TONES.length)];
    // Head shape (variable proportions)
    const headCenterX = 110, headCenterY = 120;
    const headNarrow = rand();
    const headRadiusX = (72 + rand() * 10) * (headNarrow < 0.5 ? 0.92 + headNarrow * 0.12 : 1 + (headNarrow-0.5)*0.16);
    const headRadiusY = (92 + rand() * 12) * (headNarrow > 0.5 ? 0.93 + (1-headNarrow)*0.13 : 1 + (0.5-headNarrow)*0.13);

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

    // --- Hair (variable styles) ---
    const hairColor = HAIR_COLORS[Math.floor(rand() * HAIR_COLORS.length)];
    const hairStyle = rand();
    if (hairStyle < 0.25) {
      // Bald (no hair)
    } else if (hairStyle < 0.5) {
      // Bold circle top (round cap)
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(headCenterX, headCenterY - headRadiusY + 32, headRadiusX * 0.78, 30, 0, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fillStyle = hairColor;
      ctx.shadowColor = "#0004";
      ctx.shadowBlur = 4;
      ctx.fill();
      ctx.restore();
    } else if (hairStyle < 0.75) {
      // Side part: rectangle + circle
      ctx.save();
      ctx.fillStyle = hairColor;
      ctx.shadowColor = "#0003";
      ctx.shadowBlur = 3;
      ctx.fillRect(headCenterX - headRadiusX * 0.7, headCenterY - headRadiusY + 16, headRadiusX * 1.4, 24);
      ctx.beginPath();
      ctx.ellipse(headCenterX + headRadiusX * 0.53, headCenterY - headRadiusY + 29, headRadiusX * 0.3, 22, 0, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    } else {
      // Classic ellipse hair
      const hairHeight = 38 + rand() * 20;
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
    }

    // Side hair (randomize presence & length)
    if (rand() > 0.45 && hairStyle > 0.25) {
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(headCenterX - headRadiusX + 14, headCenterY-10, 14, 22 + rand()*14, 0.3, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fillStyle = hairColor;
      ctx.globalAlpha = 0.83;
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.ellipse(headCenterX + headRadiusX - 14, headCenterY-10, 14, 22 + rand()*14, -0.3, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.fillStyle = hairColor;
      ctx.globalAlpha = 0.83;
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
    const eyeY = headCenterY - 25;
    const eyeSpacing = 38 + rand()*7;
    const eyeRadius = 15 + rand()*2;
    const scleraColor = "#fff";
    const irisColor = EYE_COLORS[Math.floor(rand() * EYE_COLORS.length)];
    const irisRadius = 7 + rand()*2;
    const pupilRadius = 3.7 + rand()*1.1;

    [headCenterX - eyeSpacing, headCenterX + eyeSpacing].forEach((eyeX, i) => {
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

    // --- Eyebrows (random arch/type/style) ---
    if (rand() > 0.17) {
      const arch = rand();
      const thick = rand() > 0.5;
      [headCenterX - eyeSpacing, headCenterX + eyeSpacing].forEach((eyeX, i) => {
        ctx.save();
        ctx.beginPath();
        const browY = eyeY - 17 - arch*6;
        const thickNum = Number(thick);
        if (arch < 0.5) {
          // Gentle arch
          ctx.ellipse(eyeX, browY, 16, 3 + thickNum*2, 0.13 + (i ? -0.13 : 0.13), Math.PI*0.18, Math.PI*0.82);
        } else {
          // Steep arch
          ctx.ellipse(eyeX, browY, 13, 4 + thickNum*3, 0.23 + (i ? -0.16 : 0.16), Math.PI*0.06, Math.PI*0.94);
        }
        ctx.lineWidth = thick ? 5 : 3;
        ctx.strokeStyle = hairColor;
        ctx.globalAlpha = 0.79;
        ctx.stroke();
        ctx.restore();
      });
    }

    // --- Glasses (optional, 33%) ---
    if (rand() > 0.67) {
      const glassType = rand();
      [headCenterX - eyeSpacing, headCenterX + eyeSpacing].forEach((eyeX, i) => {
        ctx.save();
        ctx.beginPath();
        if (glassType < 0.5) {
          // Wireframe (circle)
          ctx.arc(eyeX, eyeY, eyeRadius + 4, 0, 2 * Math.PI);
        } else {
          // Rectangle
          ctx.rect(eyeX - eyeRadius - 2, eyeY - eyeRadius/1.5, eyeRadius*2 + 4, eyeRadius*1.4);
        }
        ctx.lineWidth = 2.2;
        ctx.strokeStyle = "#444";
        ctx.globalAlpha = 0.78;
        ctx.stroke();
        ctx.restore();
      });
      // Bridge
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(headCenterX - eyeSpacing + (glassType<0.5?eyeRadius+4:eyeRadius), eyeY);
      ctx.lineTo(headCenterX + eyeSpacing - (glassType<0.5?eyeRadius+4:eyeRadius), eyeY);
      ctx.lineWidth = 2.1;
      ctx.strokeStyle = "#444";
      ctx.globalAlpha = 0.73;
      ctx.stroke();
      ctx.restore();
    }

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

    // --- Moustache/Beard (optional, 33%) ---
    const facialHair = rand();
    if (facialHair > 0.67) {
      // Moustache
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(headCenterX - 18, noseY + 17);
      ctx.bezierCurveTo(headCenterX - 8, noseY + 24, headCenterX + 8, noseY + 24, headCenterX + 18, noseY + 17);
      ctx.lineWidth = 8;
      ctx.strokeStyle = hairColor;
      ctx.globalAlpha = 0.81;
      ctx.lineCap = "round";
      ctx.shadowColor = "#0002";
      ctx.shadowBlur = 1.5;
      ctx.stroke();
      ctx.restore();
    } else if (facialHair > 0.34) {
      // Full beard
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(headCenterX, headCenterY+47, headRadiusX*0.6, 32, 0, Math.PI*0.13, Math.PI*0.87, false);
      ctx.lineWidth = 17;
      ctx.strokeStyle = hairColor;
      ctx.globalAlpha = 0.43 + rand()*0.21;
      ctx.lineCap = "round";
      ctx.shadowColor = "#0003";
      ctx.shadowBlur = 2;
      ctx.stroke();
      ctx.restore();
    }

    // --- Mouth (multiple expressions) ---
    const mouthY = headCenterY + 45;
    ctx.save();
    ctx.beginPath();
    const mouthType = rand();
    if (mouthType < 0.4) {
      // Smile
      ctx.arc(headCenterX, mouthY, 22, Math.PI*0.13, Math.PI*0.87, false);
    } else if (mouthType < 0.7) {
      // Neutral
      ctx.arc(headCenterX, mouthY + 2, 16, Math.PI*0.13, Math.PI*0.87, false);
    } else {
      // Frown
      ctx.arc(headCenterX, mouthY + 10, 18, Math.PI*0.87, Math.PI*0.13, true);
    }
    ctx.lineWidth = 3.3;
    ctx.strokeStyle = "#8b3f2f";
    ctx.shadowColor = "#0003";
    ctx.shadowBlur = 1.5;
    ctx.stroke();
    ctx.restore();

  }, [seed, isDog]);

  // ARIA label logic
  let ariaLabel = "Randomly generated face";
  if (specialVariant === "gaddafi") {
    ariaLabel = "Randomly generated Gaddafi";
  } else if (specialVariant === "aladeen") {
    ariaLabel = "Randomly generated Aladeen";
  } else if (isDog) {
    ariaLabel = "Randomly generated dog";
  }

  return (
    <canvas
      ref={canvasRef}
      width={220}
      height={220}
      className={className ? "FaceCanvas " + className : "FaceCanvas"}
      aria-label={ariaLabel}
      style={{ display: "block" }}
    />
  );
};

// --- Gaddafi and Aladeen Draw Functions ---

function drawGaddafi(ctx: CanvasRenderingContext2D) {
  // Head (brown/tan skin)
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(110, 120, 78, 92, 0, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fillStyle = "#d9aa87";
  ctx.fill();
  ctx.restore();

  // Hair: thick curly dark halo
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(110, 82, 93, 58, 0, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fillStyle = "#2d1b10";
  ctx.globalAlpha = 0.96;
  ctx.shadowColor = "#000a";
  ctx.shadowBlur = 6;
  ctx.fill();
  ctx.restore();

  // Ears
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(34, 130, 15, 26, 0.1, 0, 2*Math.PI);
  ctx.ellipse(186, 130, 15, 26, -0.1, 0, 2*Math.PI);
  ctx.closePath();
  ctx.fillStyle = "#d9aa87";
  ctx.globalAlpha = 0.93;
  ctx.fill();
  ctx.restore();

  // Sunglasses: black rectangle across eyes
  ctx.save();
  ctx.beginPath();
  ctx.rect(55, 98, 110, 34);
  ctx.closePath();
  ctx.fillStyle = "#181818";
  ctx.globalAlpha = 0.89;
  ctx.shadowColor = "#000b";
  ctx.shadowBlur = 8;
  ctx.fill();
  ctx.restore();

  // Sunglasses reflection
  ctx.save();
  ctx.beginPath();
  ctx.rect(65, 104, 25, 10);
  ctx.rect(130, 104, 25, 10);
  ctx.closePath();
  ctx.fillStyle = "#fff";
  ctx.globalAlpha = 0.13;
  ctx.fill();
  ctx.restore();

  // Nose
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(110, 120);
  ctx.lineTo(116, 155);
  ctx.lineTo(104, 155);
  ctx.closePath();
  ctx.fillStyle = "#b47d56";
  ctx.globalAlpha = 0.7;
  ctx.fill();
  ctx.restore();

  // Thin moustache (under nose, above mouth)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(90, 170);
  ctx.bezierCurveTo(110, 175, 110, 175, 130, 170);
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#2d1b10";
  ctx.globalAlpha = 0.98;
  ctx.lineCap = "round";
  ctx.stroke();
  ctx.restore();

  // Mouth (neutral)
  ctx.save();
  ctx.beginPath();
  ctx.arc(110, 185, 22, Math.PI*0.13, Math.PI*0.87, false);
  ctx.lineWidth = 3.8;
  ctx.strokeStyle = "#8b3f2f";
  ctx.shadowColor = "#0003";
  ctx.shadowBlur = 1.5;
  ctx.stroke();
  ctx.restore();
}

function drawAladeen(ctx: CanvasRenderingContext2D) {
  // Head with dark olive skin
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(110, 120, 78, 92, 0, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fillStyle = "#d9aa87";
  ctx.fill();
  ctx.restore();

  // Big beard (full, thick)
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(110, 185, 60, 38, 0, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fillStyle = "#2d1b10";
  ctx.globalAlpha = 0.95;
  ctx.shadowColor = "#000a";
  ctx.shadowBlur = 3;
  ctx.fill();
  ctx.restore();

  // Thick hair (top)
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(110, 64, 72, 38, 0, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fillStyle = "#2d1b10";
  ctx.globalAlpha = 0.95;
  ctx.shadowColor = "#000a";
  ctx.shadowBlur = 5;
  ctx.fill();
  ctx.restore();

  // Ears
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(34, 130, 15, 26, 0.1, 0, 2*Math.PI);
  ctx.ellipse(186, 130, 15, 26, -0.1, 0, 2*Math.PI);
  ctx.closePath();
  ctx.fillStyle = "#d9aa87";
  ctx.globalAlpha = 0.93;
  ctx.fill();
  ctx.restore();

  // Aviator sunglasses
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(77, 114, 28, 18, 0, 0, 2 * Math.PI);
  ctx.ellipse(143, 114, 28, 18, 0, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fillStyle = "#222";
  ctx.globalAlpha = 0.90;
  ctx.shadowColor = "#000b";
  ctx.shadowBlur = 8;
  ctx.fill();
  ctx.restore();

  // Sunglasses reflection
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(77, 114, 13, 6, 0, 0, 2 * Math.PI);
  ctx.ellipse(143, 114, 13, 6, 0, 0, 2 * Math.PI);
  ctx.closePath();
  ctx.fillStyle = "#fff";
  ctx.globalAlpha = 0.15;
  ctx.fill();
  ctx.restore();

  // Military hat: triangular green with orange star
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(73, 43);
  ctx.lineTo(110, 10);
  ctx.lineTo(147, 43);
  ctx.closePath();
  ctx.fillStyle = "#3e7e3a";
  ctx.globalAlpha = 0.95;
  ctx.shadowColor = "#0007";
  ctx.shadowBlur = 4;
  ctx.fill();
  // Orange star
  ctx.beginPath();
  const starCenterX = 110, starCenterY = 29, starOuter = 9, starInner = 4;
  for (let i = 0; i < 5; i++) {
    const angle = Math.PI/2 + i*2*Math.PI/5;
    const x = starCenterX + Math.cos(angle) * starOuter;
    const y = starCenterY - Math.sin(angle) * starOuter;
    ctx.lineTo(x, y);
    const x2 = starCenterX + Math.cos(angle + Math.PI/5) * starInner;
    const y2 = starCenterY - Math.sin(angle + Math.PI/5) * starInner;
    ctx.lineTo(x2, y2);
  }
  ctx.closePath();
  ctx.fillStyle = "#ff9800";
  ctx.globalAlpha = 0.88;
  ctx.shadowColor = "#0006";
  ctx.shadowBlur = 2;
  ctx.fill();
  ctx.restore();

  // Nose (triangle)
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(110, 120);
  ctx.lineTo(116, 155);
  ctx.lineTo(104, 155);
  ctx.closePath();
  ctx.fillStyle = "#b47d56";
  ctx.globalAlpha = 0.75;
  ctx.fill();
  ctx.restore();

  // Mouth (neutral)
  ctx.save();
  ctx.beginPath();
  ctx.arc(110, 185, 22, Math.PI*0.13, Math.PI*0.87, false);
  ctx.lineWidth = 3.8;
  ctx.strokeStyle = "#8b3f2f";
  ctx.shadowColor = "#0003";
  ctx.shadowBlur = 1.5;
  ctx.stroke();
  ctx.restore();
}

export default FaceCanvas;