import React, { useRef, useState } from "react";
import "./App.css";

// Pretty, geometric sans with fallbacks
const FONT_STACK = `"Inter", "Manrope", "system-ui", "Segoe UI", "Helvetica Neue", Arial, sans-serif`;

// Four options (unchanged)
const OPTIONS = [
  { label: "Nando's", weight: 55, color: "#ffe38f", accent: "#ffcd45", emoji: "🍗" },
  { label: "Pizza Express", weight: 35, color: "#b2d6fd", accent: "#467bff", emoji: "🍕" },
  { label: "Subway", weight: 9, color: "#d2ffb5", accent: "#76ba1b", emoji: "🥪" },
  { label: "Willard", weight: 1, color: "#f7c4e4", accent: "#e2458c", emoji: "🎩" }
];
const SEGMENTS_COUNT = 100;

function getShuffledSegments() {
  let pool: number[] = [];
  OPTIONS.forEach((opt, idx) => {
    pool = pool.concat(Array(opt.weight).fill(idx));
  });
  for (let i = pool.length; i < SEGMENTS_COUNT; ++i) pool.push(0);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool;
}
function indexesOfWinningSegments(segments: number[], winnerIdx: number) {
  return segments.map((seg, i) => (seg === winnerIdx ? i : -1)).filter(i => i >= 0);
}
function describeArc(cx: number, cy: number, r: number, a0: number, a1: number) {
  const rad = (d: number) => (Math.PI / 180) * d;
  const x1 = cx + r * Math.cos(rad(a0 - 90)), y1 = cy + r * Math.sin(rad(a0 - 90));
  const x2 = cx + r * Math.cos(rad(a1 - 90)), y2 = cy + r * Math.sin(rad(a1 - 90));
  const largeArc = a1 - a0 > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
}
function getWheelSize() {
  // Clamp minimum
  const min = 320;
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
  const size = Math.max(min, Math.floor(Math.min(vw, vh) * 0.97));
  return size;
}
// For multi-tone segment style
function shade(color: string, percent: number) {
  // Blend color with white (percent>0) or black (percent<0)
  let f = color.charAt(0) === "#" ? color.slice(1) : color,
    t = percent < 0 ? 0 : 255,
    p = percent < 0 ? percent * -1 : percent,
    R = parseInt(f.substring(0, 2), 16),
    G = parseInt(f.substring(2, 4), 16),
    B = parseInt(f.substring(4, 6), 16);
  return (
    "#" +
    (
      0x1000000 +
      (Math.round((t - R) * p) + R) * 0x10000 +
      (Math.round((t - G) * p) + G) * 0x100 +
      (Math.round((t - B) * p) + B)
    )
      .toString(16)
      .slice(1)
  );
}
// Bulletproof ticker and pop
function playTick() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = 1200;
    gain.gain.value = 0.09;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.032);
    osc.onended = () => ctx.close();
  } catch { }
}
function playPop() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "square";
    o.frequency.value = 104;
    g.gain.value = 0.22;
    o.connect(g);
    g.connect(ctx.destination);
    o.start();
    o.frequency.value = 430;
    o.frequency.linearRampToValueAtTime(180, ctx.currentTime + 0.045);
    o.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.113);
    g.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
    o.stop(ctx.currentTime + 0.15);
    o.onended = () => ctx.close();
  } catch { }
}

function triggerConfetti({
  x = 0.5,
  y = 0.4,
  emojis = ["🎩", "✨", "🎉", "🍾", "🍕", "🍗", "🥪"]
} = {}) {
  // simple vanilla confetti
  // Only runs in browser, not SSR/test
  if (typeof window === "undefined") return;
  const N = 54, size = Math.min(window.innerWidth, window.innerHeight) * 0.03;
  for (let i = 0; i < N; ++i) {
    const conf = document.createElement("span");
    conf.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    conf.style.position = "fixed";
    conf.style.zIndex = "9999";
    conf.style.fontSize = size + 8 + Math.random()*8 + "px";
    conf.style.left = x * window.innerWidth + (Math.random() - 0.5) * 100 + "px";
    conf.style.top = y * window.innerHeight + (Math.random() - 0.5) * 80 + "px";
    conf.style.opacity = "1";
    conf.style.userSelect = "none";
    conf.style.pointerEvents = "none";
    const dx = (Math.random() - 0.5) * 2, dy = -0.55 - Math.random()*0.9;
    const rot = (Math.random() - 0.5) * 290;
    const delay = Math.random()*0.15;
    conf.animate([
      { transform: `translateY(0) scale(1) rotate(0deg)` },
      { transform: `translateY(${130 + 50*Math.random()}px) scale(${0.6 + Math.random()*0.23}) rotate(${rot}deg)` }
    ], {
      duration: 1200 + 700 * Math.random(),
      delay: delay * 800,
      easing: "cubic-bezier(.6,.19,.44,1.28)"
    });
    setTimeout(() => {
      conf.style.transition = "opacity 0.51s cubic-bezier(.2,.8,.88,1)";
      conf.style.opacity = "0";
      setTimeout(() => conf.remove(), 580);
    }, 900 + Math.random() * 800);
    document.body.appendChild(conf);
  }
}
export default function App() {
  const [segments, setSegments] = useState(() => getShuffledSegments());
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [wheelSize, setWheelSize] = useState(getWheelSize());
  const [pointerState, setPointerState] = useState<"idle"|"spin"|"bounce">("idle");
  const [showGloss, setShowGloss] = useState(true);
  const wheelRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleResize() {
      setWheelSize(getWheelSize());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; }
  }, []);
  // Scroll blocking root
  React.useEffect(() => {
    document.documentElement.style.overscrollBehavior = "contain";
    return () => { document.documentElement.style.overscrollBehavior = ""; };
  }, []);

  async function spin() {
    if (spinning) return;
    setResult(null);
    setSpinning(true);
    setPointerState("spin");
    setShowGloss(false);

    // Mobile tap = haptic
    if (window.navigator.vibrate) window.navigator.vibrate([12]);

    // Pick winner by probability
    let wrand = Math.random() * 100;
    let winIdx = -1, acc = 0;
    for (let i = 0; i < OPTIONS.length; ++i) {
      acc += OPTIONS[i].weight;
      if (wrand < acc) { winIdx = i; break; }
    }
    if (winIdx === -1) winIdx = 0;
    const winningSegments = indexesOfWinningSegments(segments, winIdx);
    const segIdx = winningSegments[Math.floor(Math.random() * winningSegments.length)];
    const fullSpins = 23 + Math.floor(Math.random() * 4); // More suspense!
    const segmentAngle = 360 / SEGMENTS_COUNT, segTargetAngle = segIdx * segmentAngle;
    const targetAngle = fullSpins * 360 + (360 - segTargetAngle) % 360;
    const duration = 4200 + Math.random() * 1200;

    // Animate
    let ticks = 0;
    let pointerBounceTriggered = false;

    function animate(now: number, startTime: number, from: number) {
      const elapsed = now - startTime;
      let t = Math.min(1, elapsed / duration);

      // Custom spin: ease in, snap fast in middle, out
      let ease;
      if (t < 0.09) {
        ease = Math.pow(t, 0.65) * 0.91;
      } else if (t > 0.79) {
        ease = 0.98 + (1 - Math.pow(1 - t, 1.98)) * 0.2;
      } else {
        ease = t * 1.03 + 0.06 * Math.sin(t * 25);
      }
      if (t > 1) ease = 1;
      const currentRotation = from + (targetAngle - from) * ease;
      setRotation(currentRotation);

      let segNow = Math.floor((currentRotation % 360) / segmentAngle);
      if (segNow !== ticks) {
        ticks = segNow;
        playTick();
      }

      // Pointer bounce detection (stop and bounce as result hits)
      if (!pointerBounceTriggered && t > 0.987) {
        setPointerState("bounce");
        setTimeout(() => setPointerState("idle"), 880);
        pointerBounceTriggered = true;
        playPop();
      }

      if (t < 1) {
        requestAnimationFrame(now2 => animate(now2, startTime, from));
      } else {
        setTimeout(() => {
          setShowGloss(true);
          setSpinning(false);
          setResult(winIdx);
          if (winIdx === 3) {
            setTimeout(() => triggerConfetti({}), 240);
          }
        }, 80);
      }
    }
    requestAnimationFrame(now => animate(now, performance.now(), rotation % 360));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      spin();
    }
  }

  // Wheel render
  const size = wheelSize;
  const center = size / 2;
  const radius = size / 2 - size * 0.026;
  const innerR = radius * 0.82;
  const segmentAngle = 360 / SEGMENTS_COUNT;
  // For "gloss" overlay
  function generateGlossPath() {
    const R = radius * 0.97, C = center;
    return [
      `M ${C - R * 0.1} ${C - R * 0.98}`,
      `Q ${C} ${C - R * 1.2} ${C + R * 0.28} ${C - R * 1.13}`,
      `Q ${C + R * 0.8} ${C - 0.38 * R} ${C + R * 0.55} ${C - R * 0.01}`,
      `Q ${C} ${C - R * 0.26} ${C - R * 0.43} ${C - R * 0.31}`,
      "Z"
    ].join(" ");
  }

  return (
    <div
      className="App"
      style={{
        fontFamily: FONT_STACK,
        fontWeight: 400,
        background: "linear-gradient(133deg, #d8deff 0%, #fdf6ee 86%, #fffad8 100%)",
        minHeight: "100svh",
        minWidth: "100vw",
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        touchAction: "none"
      }}
    >
      <header style={{
        fontFamily: FONT_STACK,
        fontWeight: 700,
        letterSpacing: 0.008,
        fontSize: "clamp(1.25rem, 6vw, 3.3rem)",
        color: "#232935",
        padding: "clamp(8px,2vw,21px) 0 clamp(3px,1vw,8px) 0",
        textShadow: "0 3px 14px #f7f2f9",
        userSelect: "none"
      }}>
        John's Lunch Predictor
      </header>
      <div style={{
        fontSize: "clamp(17px, 3vw, 1.58rem)",
        color: "#595e77",
        marginBottom: "clamp(8px, 2vw, 19px)",
        fontFamily: FONT_STACK,
        fontWeight: 400,
        textShadow: "0px 2px 10px #fff8, 0 1px 3px #fff7"
      }}>
        Spin the wheel. One spin, one answer.<br />
        <span style={{
          fontWeight: 400,
          color: "#bababb",
          fontSize: "clamp(12px,1.85vw,17px)"
        }}>No appeals. No drama.
        </span>
      </div>
      <div
        style={{
          position: "relative",
          width: size,
          height: size,
          flexShrink: 0,
          flexGrow: 0,
          maxWidth: "98vw",
          maxHeight: "calc(98svh - 19vw - 162px)",
          minHeight: "290px",
          margin: 0,
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
        {/* wheel aura and shadow */}
        <div
          style={{
            position: "absolute",
            top: "54%", left: "50%",
            pointerEvents: "none",
            zIndex: 0,
            width: size * 0.88,
            height: size * 0.27,
            background: "radial-gradient(ellipse at 50% 57%, #ddf9ff 0%, #edffe4 70%, #ffe7f3 100%)",
            filter: "blur(44px) opacity(0.64)",
            transform: "translate(-50%,-50%) scaleY(0.89)"
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "49%", left: "50%",
            width: size * 0.92,
            height: size * 0.92,
            background: "radial-gradient(circle, #fffbe9 0%, #e5eaea 52%, #e3e6ef 100%)",
            pointerEvents: "none",
            zIndex: 1,
            borderRadius: "50%",
            filter: "blur(33px) opacity(.78)",
            transform: "translate(-50%,-50%)"
          }}
        />
        {/* pointer */}
        <div
          className="pointer-bounce"
          style={{
            position: "absolute",
            left: "50%",
            top: (pointerState==="bounce"? `-${size*0.031}px` : `-${size*0.055}px`),
            transform: `translateX(-50%) scaleX(1.07)${pointerState==="bounce" ? " scaleY(0.93)" : ""}`,
            zIndex: 9,
            transition: pointerState==="bounce" ? "top 0.16s cubic-bezier(0.85,1.3,0.7,0.5)" : "top 0.31s cubic-bezier(0.20,1,0.44,1)",
            filter: pointerState==="bounce"
              ? "drop-shadow(0 4px 13px #ff3b62cc) brightness(1.13)" : "drop-shadow(0 1px 6px #2d5cdf24)",
          }}
        >
          <div style={{
            width: 0,
            height: 0,
            borderLeft: `${Math.max(size * 0.043, 13)}px solid transparent`,
            borderRight: `${Math.max(size * 0.043, 13)}px solid transparent`,
            borderBottom: `${Math.max(size * 0.092, 30)}px solid #191e28`,
            borderRadius: "8px 8px 25px 25px",
            position: "relative"
          }}>
          </div>
          {/* base */}
          <div style={{
            position: "absolute",
            left: "50%",
            bottom: "-12px",
            width: "26px",
            height: "13px",
            borderRadius: "62% 46% 51% 50%/50% 67% 31% 61%",
            background: "linear-gradient(90deg,#fff7ba 40%, #eac7ee 90%)",
            boxShadow: "0px 0px 8px 2px #fff9ccad",
            transform: "translateX(-50%) scaleY(1)",
            zIndex: 9
          }} />
        </div>
        {/* wheel */}
        <div
          ref={wheelRef}
          tabIndex={0}
          aria-label="Spin Lunch Wheel"
          onClick={spin}
          onKeyDown={handleKeyDown}
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            boxShadow: "0 3px 44px 5px #87b9ff30, 0 0px 8px 0 #fff7",
            background: "#fff",
            overflow: "visible",
            transition: spinning ? undefined : "transform .35s cubic-bezier(0.3,1.2,0.7,1.1)",
            transform: `rotate(${rotation}deg) scale(0.999)`,
            cursor: spinning ? "not-allowed" : "pointer",
            zIndex: 7
          }}
        >
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            style={{ display: "block" }}
          >
            {/* subtle background ring */}
            <circle
              cx={center}
              cy={center}
              r={radius * 0.99}
              fill="url(#linearback)"
              opacity={0.84}
            />
            <defs>
              <linearGradient id="linearback" x1="0%" y1="0%" x2="75%" y2="88%">
                <stop offset="0%" stopColor="#fffbe4" />
                <stop offset="90%" stopColor="#e8ecfa" />
                <stop offset="100%" stopColor="#caf5e9" />
              </linearGradient>
            </defs>
            {/* actual wheel segments */}
            {segments.map((optIdx, segIdx) => {
              const startAngle = segIdx * segmentAngle, endAngle = (segIdx + 1) * segmentAngle;
              const opt = OPTIONS[optIdx];
              // Tone per segment: alternate, small random shade for gloss/marbled feel
              const tone =
                segIdx % 3 === 0
                  ? shade(opt.color, -0.06)
                  : segIdx % 3 === 1
                  ? shade(opt.color, 0.032)
                  : opt.color;
              let label: string | null = null;
              if (segIdx % Math.floor(SEGMENTS_COUNT / 13) === 2) {
                label = `${opt.emoji} ${opt.label}`;
              }
              return (
                <g key={segIdx}>
                  {/* colored arc (main) */}
                  <path
                    d={describeArc(center, center, radius, startAngle, endAngle)}
                    fill={tone}
                    stroke={opt.accent}
                    strokeWidth={1.36}
                  />
                  {/* inner stroke for subtle 3D */}
                  <path
                    d={describeArc(center, center, innerR, startAngle, endAngle)}
                    fill="none"
                    stroke="#ffffffad"
                    strokeWidth={1.08}
                  />
                  {label && (
                    <text
                      x={
                        center +
                        (radius * 0.68) *
                          Math.cos(((startAngle + endAngle) / 2 - 90) * (Math.PI / 180))
                      }
                      y={
                        center +
                        (radius * 0.68) *
                          Math.sin(((startAngle + endAngle) / 2 - 90) * (Math.PI / 180))
                      }
                      fill="#222"
                      fontSize={Math.max(size * 0.062, 14)}
                      fontFamily={FONT_STACK}
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      fontWeight={540}
                      style={{
                        textShadow: "0 3px 14px #fff9, 0 2px 5px #f4f6fc",
                        opacity: 0.67
                      }}
                    >
                      {label}
                    </text>
                  )}
                </g>
              );
            })}
            {/* wheel gloss reflection */}
            {showGloss && (
              <path
                d={generateGlossPath()}
                fill="#fff"
                opacity="0.24"
                style={{
                  filter: "blur(1.5px)",
                  transform: "scaleY(0.97)",
                  transformOrigin: `${center}px ${center}px`
                }}
              />
            )}
          </svg>
        </div>
      </div>
      <button
        onClick={spin}
        className="spin-btn"
        style={{
          marginTop: "clamp(1.7vw, 1.7vmin, 16px)",
          background: "linear-gradient(90deg,#ffffff 13%, #355da4 86%)",
          color: "#263167",
          border: "none",
          borderRadius: "86px",
          padding: spinning
            ? "0.64em 2em 0.51em 2em"
            : "0.72em 2.25em 0.63em 2.23em",
          fontWeight: 700,
          fontFamily: FONT_STACK,
          fontSize: "clamp(1.22rem, 3vw, 2.2rem)",
          letterSpacing: "0.045em",
          boxShadow: "0 3px 21px 0 #e3f0ffcc, 0 2px 8px #f4adff10",
          cursor: spinning ? "not-allowed" : "pointer",
          outline: "none",
          minWidth: "140px",
          minHeight: "52px",
          opacity: spinning ? 0.45 : 1,
          filter: spinning
            ? "blur(1px) grayscale(60%)"
            : "drop-shadow(0 1px 3px #f7efff)",
          transition:
            "opacity 0.25s, background 1.2s cubic-bezier(.7,.1,.4,.8), filter 0.23s, padding 0.18s cubic-bezier(.85,1.85,.32,.81)"
        }}
        disabled={spinning}
        tabIndex={0}
      >
        {spinning ? "SPINNING…" : "SPIN"}
      </button>

      {result !== null && (
        <div
          style={{
            marginTop: "clamp(2vw, 19px, 34px)",
            fontSize: result === 3 // Willard confetti
              ? "clamp(2.43rem, 6vw, 4.4rem)"
              : "clamp(2.18rem, 6vw, 3.2rem)",
            fontFamily: FONT_STACK,
            color: result === 3 ? "#e21a56" : "#238028",
            textShadow:
              result === 3
                ? "0 0px 128px #fd6db955, 0 2px 12px #fff, 0 11px 21px #e679b066"
                : "0 0 139px #a9f7aa47, 0 1.5px 16px #f9c4ed34",
            fontWeight: 900,
            background:
              result === 3
                ? "radial-gradient(circle, #fffbe9 60%, #ffe9f7 130%)"
                : "radial-gradient(circle, #ffffec 68%, #f1ffe7 130%)",
            borderRadius: "56px",
            boxShadow:
              "0px 3px 13px 0 #e5d1f6, 0 6px 32px 0 rgba(34,40,124,0.08)",
            padding: "1.1em 1.6em",
            textAlign: "center",
            minWidth: "188px",
            maxWidth: "94vw",
            wordBreak: "break-word",
            animation: "resultSpring 1.15s cubic-bezier(.62,1.2,.34,1.0)"
          }}
          tabIndex={-1}
        >
          <span aria-label={OPTIONS[result].label} role="img" style={{fontSize: "1.22em"}}>
            {OPTIONS[result].emoji}
          </span>
          {" "}
          {OPTIONS[result].label}
        </div>
      )}
      <button
        aria-label="Reset wheel"
        style={{
          marginTop: "16px",
          display: result === null ? "none" : undefined,
          fontFamily: FONT_STACK,
          background: "#f9f8ff",
          color: "#586886",
          border: "none",
          borderRadius: "19px",
          padding: "6px 23px",
          fontSize: "1.09rem",
          fontWeight: 590,
          letterSpacing: "0.02em",
          cursor: 'pointer',
          boxShadow: "0 1.7px 8px #d8e2ef55"
        }}
        onClick={() => {
          setSegments(getShuffledSegments());
          setResult(null);
          setRotation(0);
        }}
        tabIndex={-1}
      >
        Reset
      </button>
      <style>
        {`
        @keyframes resultSpring {
          0% { opacity: 0; transform: scale(1.3) translateY(-44px);}
          62% { opacity: 1; transform: scale(.91) translateY(8px);}
          84% { opacity: 1; transform: scale(1.06) translateY(0);}
          100% { opacity: 1; transform: scale(1) translateY(0);}
        }
        `}
      </style>
    </div>
  );
}
