import React, { useRef, useState } from "react";
import "./App.css";

/* Lunch options and settings */
const OPTIONS = [
  { label: "Nando's", weight: 55, color: "#FFD700", emoji: "🍗" },
  { label: "Pizza Express", weight: 35, color: "#1E90FF", emoji: "🍕" },
  { label: "Subway", weight: 9, color: "#ADFF2F", emoji: "🥪" },
  { label: "Willard", weight: 1, color: "#F08080", emoji: "❓" }
];
const SEGMENTS_COUNT = 100;

/* Generate a shuffled segments array according to weights */
function getShuffledSegments() {
  // Fill array with weighted occurrences of each option index
  let pool: number[] = [];
  OPTIONS.forEach((opt, idx) => {
    pool = pool.concat(Array(opt.weight).fill(idx));
  });
  // Fill up to total segments (so they sum to SEGMENTS_COUNT)
  for (let i = pool.length; i < SEGMENTS_COUNT; ++i) {
    // Spread extras as "Nando's" (the most common)
    pool.push(0);
  }
  // Shuffle
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool; // array of option indexes
}

/* Find all indexes of the winning option in the segments array */
function indexesOfWinningSegments(segments: number[], winnerIdx: number) {
  return segments.map((seg, i) => (seg === winnerIdx ? i : -1)).filter(i => i >= 0);
}

/* Generate SVG arc path for a segment, in polar coordinates */
function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const rad = (deg: number) => (Math.PI / 180) * deg;
  const x1 = cx + r * Math.cos(rad(startAngle - 90));
  const y1 = cy + r * Math.sin(rad(startAngle - 90));
  const x2 = cx + r * Math.cos(rad(endAngle - 90));
  const y2 = cy + r * Math.sin(rad(endAngle - 90));
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
  return [
    `M ${cx} ${cy}`,
    `L ${x1} ${y1}`,
    `A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
    "Z"
  ].join(" ");
}

/* Responsive: wheel should fit screen on any device */
function getWheelSize() {
  // clamp between 320px and 98vw/vh - at most 98% of smaller window dimension
  const min = 320;
  const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
  const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
  const size = Math.max(min, Math.floor(Math.min(vw, vh) * 0.98));
  return size;
}

/* Ticker sound (tick as wheel passes a segment) using Web Audio API */
function playTick() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "square";
    osc.frequency.value = 1400;
    gain.gain.value = 0.075;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.04);
    osc.onended = () => {
      ctx.close();
    };
  } catch (e) {
    // Ignore, browser may block
  }
}

export default function App() {
  // segments: array of option indexes [0..3] (shuffled, weighted)
  const [segments, setSegments] = useState(() => getShuffledSegments());
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<number | null>(null); // index into OPTIONS
  const [rotation, setRotation] = useState(0); // deg
  const [wheelSize, setWheelSize] = useState(getWheelSize());
  const [pointerAnim, setPointerAnim] = useState(false);
  const wheelRef = useRef<HTMLDivElement>(null);

  // Resize response
  React.useEffect(() => {
    function handleResize() {
      setWheelSize(getWheelSize());
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Prevent scrolling altogether
  React.useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    }
  }, []);

  // Handle Spin
  async function spin() {
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    setPointerAnim(true);

    // Weighted random winner
    let wrand = Math.random() * 100;
    let winIdx = -1, acc = 0;
    for (let i = 0; i < OPTIONS.length; ++i) {
      acc += OPTIONS[i].weight;
      if (wrand < acc) { winIdx = i; break; }
    }
    if (winIdx === -1) winIdx = 0;
    // All possible winning segment indices
    const winningSegments = indexesOfWinningSegments(segments, winIdx);
    // Randomly choose one of the winner's segment as the target
    const segIdx = winningSegments[Math.floor(Math.random() * winningSegments.length)];

    // Spin: high suspense! 18-21 random full spins (so landing spot is unpredictable)
    const nFullSpins = Math.floor(Math.random() * 4) + 18; // 18-21
    // Target angle - so winning segment lands at pointer (top: 0deg)
    const segmentAngle = 360 / SEGMENTS_COUNT;
    const segTargetAngle = segIdx * segmentAngle;
    // The final angle to rotate TO: add full spins, and land so pointer is at seg
    const targetAngle = nFullSpins * 360 + (360 - segTargetAngle) % 360;
    // Calculate time: base suspenseful time, slightly random (fast, but lasts 3.5-4.3s)
    const duration = 3500 + Math.random() * 800;

    // Ticker: sound as wheel passes each segment boundary during spin
    let ticks = 0, lastTickAngle = rotation % 360, tickSoundId = 0;

    function tickSoundLoop(currentRotation: number, startAngle: number, endAngle: number, tickCount: number) {
      // Calculate the number of past segments boundary since last tick
      const angleDelta = (currentRotation - startAngle + 360*10) % 360;
      let intendedTick = Math.floor(angleDelta / segmentAngle);
      // On first call, play first tick
      if (tickCount === 0 || intendedTick > tickCount) {
        playTick();
        return tickCount + 1;
      }
      return tickCount;
    }

    // Animate: use requestAnimationFrame for smoothness
    return new Promise<void>((resolve) => {
      const startTime = performance.now();
      const from = rotation % 360;
      let animId = 0;

      function animate(now: number) {
        const elapsed = now - startTime;
        const t = Math.min(1, elapsed / duration);

        // Spin-easing (ramp up & down for suspense)
        // Use cubic/elastic interpolation for drama
        // OutCubic: f(t) = 1 - pow(1-t, 2.8)
        // Add a little deceleration "swing" for fun:
        const ease = 1 - Math.pow(1 - t, 2.8);
        // Add slight shaking if almost stopped
        let eased;
        if (t > 0.97) {
          const bump = Math.sin((t - 0.97) * 40 * Math.PI) * (1 - t) * 5;
          eased = ease + bump;
        } else {
          eased = ease;
        }

        // Interpolate
        const currentRotation = from + (targetAngle - from) * eased;

        setRotation(currentRotation);

        // Ticker sound trigger
        let ticksNeeded = Math.floor((currentRotation % 360) / segmentAngle);
        if (ticksNeeded !== ticks) {
          ticks = ticksNeeded;
          playTick();
        }

        if (t < 1) {
          animId = requestAnimationFrame(animate);
        } else {
          setTimeout(() => {
            setPointerAnim(false);
            setSpinning(false);
            setResult(winIdx);
            resolve();
          }, 150);
        }
      }
      animId = requestAnimationFrame(animate);
    });
  }

  // Space/Enter accessibility
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      spin();
    }
  }

  // Render the shuffled segments
  const size = wheelSize;
  const center = size / 2;
  const radius = size / 2 - size * 0.027;
  const segmentAngle = 360 / SEGMENTS_COUNT;
  let curAngle = 0;

  return (
    <div
      className="App"
      style={{
        fontFamily: "system-ui, Inter, Arial, Helvetica, sans-serif",
        background: "linear-gradient(120deg, #e8f4fc 46%, #fffff9 100%)",
        minHeight: "100svh",
        minWidth: "100vw",
        padding: 0,
        margin: 0,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden"
      }}
    >
      <header style={{
        fontWeight: 600,
        fontFamily: "system-ui, Inter, Arial, Helvetica, sans-serif",
        letterSpacing: 0.1,
        fontSize: "clamp(1.2rem, 4vw, 2.5rem)",
        color: "#1d232b",
        marginBottom: "clamp(2px, 2vw, 18px)",
        marginTop: "clamp(6px, 3vw, 34px)",
        textShadow: "0 2px 8px #eee"
      }}>
        John's Lunch Predictor
      </header>
      <div style={{
        fontSize: "clamp(15px, 2.6vw, 1.23rem)",
        color: "#5E5E5E",
        marginBottom: "clamp(0.3vw, 10px, 18px)",
        fontFamily: "system-ui, Inter, Arial, Helvetica, sans-serif",
        fontWeight: 400
      }}>
        Spin the wheel. One spin, one answer.<br />
        <span style={{ fontSize: "clamp(12px, 2vw, 15px)", color: "#a8a89e" }}>No appeals.</span>
      </div>

      <div
        style={{
          position: "relative",
          width: size,
          height: size,
          flexShrink: 0,
          flexGrow: 0,
          maxWidth: "98vw",
          maxHeight: "calc(98svh - 180px)",
          minHeight: "300px",
          margin: 0,
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        {/* pointer */}
        <div style={{
          position: "absolute",
          left: "50%",
          top: "-18px",
          transform: "translateX(-50%)",
          zIndex: 3,
          transition: pointerAnim ? "filter 0.1s" : undefined,
          filter: pointerAnim ? "drop-shadow(0 0 6px #f12)" : undefined
        }}>
          <div style={{
            width: 0,
            height: 0,
            borderLeft: `${Math.max(size * 0.035, 13)}px solid transparent`,
            borderRight: `${Math.max(size * 0.035, 13)}px solid transparent`,
            borderBottom: `${Math.max(size * 0.065, 23)}px solid #2e3344`,
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
            boxShadow: "0 3px 15px 3px rgba(90,80,120,0.13)",
            background: "#fff",
            overflow: "visible",
            userSelect: "none",
            transition: spinning
              ? undefined
              : "transform .36s cubic-bezier(0.3,1.2,0.7,1.1)",
            transform: `rotate(${rotation}deg) scale(1.00)`,
            cursor: spinning ? "not-allowed" : "pointer",
          }}
        >
          <svg
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            style={{ display: "block" }}
          >
            {segments.map((optIdx, segIdx) => {
              const startAngle = segIdx * segmentAngle;
              const endAngle = (segIdx + 1) * segmentAngle;
              const opt = OPTIONS[optIdx];
              // Label every 7th segment (spread out, don't overlap)
              let label: string | null = null;
              if (segIdx % Math.floor(SEGMENTS_COUNT / 12) === 3) {
                label = `${opt.emoji} ${opt.label}`;
              }
              return (
                <g key={segIdx}>
                  <path
                    d={describeArc(center, center, radius, startAngle, endAngle)}
                    fill={opt.color}
                    stroke="#fff"
                    strokeWidth={1.5}
                  />
                  {label && (
                    <text
                      x={center +
                        (radius * 0.7) *
                        Math.cos(((startAngle + endAngle) / 2 - 90) * (Math.PI / 180))}
                      y={center +
                        (radius * 0.7) *
                        Math.sin(((startAngle + endAngle) / 2 - 90) * (Math.PI / 180))}
                      fill="#26292e"
                      fontSize={Math.max(size * 0.062, 15)}
                      fontFamily="system-ui, Inter, Arial, Helvetica, sans-serif"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                      fontWeight={500}
                    >
                      {label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      <button
        onClick={spin}
        className="spin-btn"
        style={{
          marginTop: "clamp(1.6vw, 13px, 28px)",
          background: "linear-gradient(90deg, #ebebeb 5%, #22242d 95%)",
          color: "#fff",
          border: 0,
          borderRadius: "80px",
          padding: "0.75em 2.2em",
          fontWeight: 600,
          fontFamily: "system-ui, Inter, Arial, Helvetica, sans-serif",
          fontSize: "clamp(1.22rem, 3vw, 2.2rem)",
          letterSpacing: "0.05em",
          boxShadow: "0 2px 15px 0 rgba(42, 42, 42, 0.08)",
          cursor: spinning ? "not-allowed" : "pointer",
          outline: "none",
          minWidth: "120px",
          minHeight: "50px"
        }}
        disabled={spinning}
        tabIndex={0}
      >
        {spinning ? "SPINNING…" : "SPIN"}
      </button>

      {result !== null && (
        <div
          style={{
            marginTop: "clamp(2vw, 20px, 36px)",
            fontSize: "clamp(2.11rem, 5.5vw, 3.3rem)",
            fontFamily: "system-ui, Inter, Arial, Helvetica, sans-serif",
            color: "#2d2d31",
            fontWeight: 800,
            letterSpacing: 0.02,
            background: result === 3 // Willard = index 3
              ? "radial-gradient(circle, #fff 65%, #ffb1b1 120%)"
              : "radial-gradient(circle, #fff 66%, #d8ffb4 130%)",
            borderRadius: "32px",
            boxShadow:
              "0px 1px 12px 0 rgba(140,100,100,0.07), 0 6px 32px 0 rgba(34,40,124,0.02)",
            padding: "11px 44px",
            textAlign: "center",
            minWidth: "180px",
            maxWidth: "92vw",
            wordBreak: "break-word",
            // Animate result pop
            animation: "predictAnim .91s cubic-bezier(0.31,1.2,0.66,1.0)"
          }}
          tabIndex={-1}
        >
          <span aria-label={OPTIONS[result].label} role="img">{OPTIONS[result].emoji}</span> {OPTIONS[result].label}
        </div>
      )}
      <button
        style={{
          marginTop: "16px",
          display: result === null ? "none" : undefined,
          fontFamily: "system-ui, Inter, Arial, Helvetica, sans-serif",
          background: "#f0f0f0",
          color: "#444",
          border: "none",
          borderRadius: "19px",
          padding: "6px 20px",
          fontSize: "1rem",
          cursor: 'pointer'
        }}
        onClick={() => {
          setSegments(getShuffledSegments());
          setResult(null);
          setRotation(0);
        }}
        tabIndex={-1}
        aria-label="Reset wheel"
      >
        Reset
      </button>

      {/* Animate result pop */}
      <style>
        {`
        @keyframes predictAnim {
          0% { opacity: 0; transform: scale(1.17) translateY(-28px);}
          70% { opacity: 1; transform: scale(0.95) translateY(2px);}
          90% { opacity: 1; transform: scale(1.05) translateY(0);}
          100% { opacity: 1; transform: scale(1) translateY(0);}
        }
        `}
      </style>
    </div>
  );
}
