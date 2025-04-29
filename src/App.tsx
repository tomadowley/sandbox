import React, { useRef, useState } from 'react';
import './App.css';

// Define the lunch options with weights, color and emoji for fun
const choices = [
  { label: "Nando's",      weight: 55, color: '#FFD700', emoji: '🍗' },
  { label: 'Pizza Express',weight: 35, color: '#1E90FF', emoji: '🍕' },
  { label: 'Subway',       weight: 9,  color: '#ADFF2F', emoji: '🥪' },
  { label: 'Willard',      weight: 1,  color: '#F08080', emoji: '❓' },
];

// Compute total and cumulative weights for weighted random selection and drawing
const totalWeight = choices.reduce((sum, c) => sum + c.weight, 0);

// Helper: Pick a choice according to its weight
function weightedRandomPick() {
  const r = Math.random() * totalWeight;
  let cum = 0;
  for (const c of choices) {
    cum += c.weight;
    if (r < cum) return c;
  }
  // fallback
  return choices[choices.length - 1];
}

// Helper: Compute start and end angles in degrees for each segment
function getSegments() {
  let angle = 0;
  return choices.map((c) => {
    const startAngle = angle;
    const angleSize = (c.weight / totalWeight) * 360;
    angle += angleSize;
    return {
      ...c,
      startAngle,
      angleSize,
      endAngle: angle,
    };
  });
}

// Helper: SVG arc path for given start & end angle (degrees)
function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const rad = (deg: number) => (Math.PI / 180) * deg;
  const x1 = cx + r * Math.cos(rad(startAngle - 90));
  const y1 = cy + r * Math.sin(rad(startAngle - 90));
  const x2 = cx + r * Math.cos(rad(endAngle - 90));
  const y2 = cy + r * Math.sin(rad(endAngle - 90));
  const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;
  return [
    `M ${cx} ${cy}`,
    `L ${x1} ${y1}`,
    `A ${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
    'Z'
  ].join(' ');
}

const WHEEL_SIZE = 340; // px

function App() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<null | typeof choices[0]>(null);
  const [rotation, setRotation] = useState(0); // in degrees, for CSS
  const wheelRef = useRef<HTMLDivElement>(null);

  // Handle the "Spin" action
  function spin() {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    // Pick weighted winner:
    const winner = weightedRandomPick();
    // Find its segment range
    const segments = getSegments();
    const winnerIdx = choices.findIndex(c => c.label === winner.label);
    const seg = segments[winnerIdx];

    // Compute target angle (center of segment), then offset so that
    // The pointer (at top) lands on winner
    const segCenter = seg.startAngle + seg.angleSize / 2;
    // Wheel rotates so pointer (top-0deg) points to center segment
    // Add multiple full rotations for effect
    const extraSpins = 5;
    const target = 360 * extraSpins + (360 - segCenter);

    // Animate wheel: smooth rotation
    setRotation(target);

    // Reveal result just after animation (animation duration 2.5s)
    setTimeout(() => {
      setSpinning(false);
      setResult(winner);
    }, 2500);
  }

  // For accessibility or mobile tap
  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      spin();
    }
  }

  // Segments for drawing
  const segments = getSegments();

  return (
    <div className="App" style={{
      minHeight: '100vh', display: 'flex',
      flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      background:
        'linear-gradient(125deg, #e1ffea 40%, #f7dada 100%)'
    }}>
      <h2 style={{ fontFamily: 'Comic Sans MS, Comic Sans, cursive', fontWeight: 'bold', color: '#222' }}>
        🍽️ John's Magical Lunch Predictor!
      </h2>
      <div style={{
        marginTop: 10, marginBottom: 18,
        fontSize: 20,
        color: '#222',
        fontFamily: 'Comic Sans MS, Comic Sans, cursive'
      }}>
        Spin the wheel to reveal John's fate...
      </div>

      <div style={{ position: 'relative', width: WHEEL_SIZE, height: WHEEL_SIZE }}>
        {/* The pointer at the top */}
        <div
          style={{
            position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: '-12px',
            zIndex: 2
          }}
        >
          <div style={{
            width: 0, height: 0, borderLeft: '14px solid transparent',
            borderRight: '14px solid transparent', borderBottom: '28px solid #d82252'
          }} />
        </div>
        {/* The spinning wheel itself */}
        <div
          style={{
            width: WHEEL_SIZE, height: WHEEL_SIZE, borderRadius: '50%',
            boxShadow: '0 2px 16px rgba(0,0,0,0.09)',
            background: '#fff',
            transition: spinning ? 'transform 2.4s cubic-bezier(0.29,1.45,0.36,1)' : undefined,
            transform: `rotate(${rotation}deg)`,
            cursor: spinning ? 'not-allowed' : 'pointer',
          }}
          ref={wheelRef}
          onClick={spin}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          aria-label="Spin Lunch Wheel"
        >
          {/* Inline SVG for the wheel */}
          <svg width={WHEEL_SIZE} height={WHEEL_SIZE} viewBox={`0 0 ${WHEEL_SIZE} ${WHEEL_SIZE}`}>
            {segments.map((seg, i) => (
              <path
                key={seg.label}
                d={describeArc(WHEEL_SIZE/2, WHEEL_SIZE/2, WHEEL_SIZE/2 - 8, seg.startAngle, seg.endAngle)}
                fill={seg.color}
                stroke="#fff"
                strokeWidth={2}
              />
            ))}
            {/* Draw segment labels and emojis */}
            {segments.map((seg, i) => {
              // Segment center angle, for placing label
              const angle = seg.startAngle + seg.angleSize/2;
              const rad = (Math.PI/180) * (angle-90);
              const r = WHEEL_SIZE/2 - 60;
              const x = WHEEL_SIZE/2 + r * Math.cos(rad);
              const y = WHEEL_SIZE/2 + r * Math.sin(rad);
              return (
                <g key={seg.label + '-label'}>
                  <text
                    x={x}
                    y={y}
                    fill="#222"
                    fontSize={19}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontFamily="Comic Sans MS, Comic Sans, cursive"
                    fontWeight="bold"
                    style={{ userSelect: 'none' }}
                  >
                    {seg.emoji}
                    {' '}
                    {seg.label}
                  </text>
                </g>
              )
            })}
          </svg>
        </div>
      </div>
      <button
        onClick={spin}
        className="spin-btn"
        style={{
          marginTop: 22,
          background: 'linear-gradient(90deg, #ffab4d 30%, #fe62a5 80%)',
          color: '#222',
          border: 0,
          borderRadius: 32,
          padding: '0.75em 2.2em',
          fontWeight: 700,
          fontFamily: 'Comic Sans MS, Comic Sans, cursive',
          fontSize: 23,
          letterSpacing: '1px',
          boxShadow: '0 2px 12px rgba(255, 120, 244, 0.08)',
          cursor: spinning ? 'not-allowed' : 'pointer',
          outline: 'none',
          transition: 'background 0.15s'
        }}
        disabled={spinning}
      >
        {spinning ? 'Spinning...' : 'SPIN'}
      </button>

      {result && (
        <div
          style={{
            marginTop: 26,
            fontSize: 35,
            fontFamily: 'Comic Sans MS, Comic Sans, cursive',
            color: result.label === "Willard" ? "#c42d2d" : "#168512",
            fontWeight: 900,
            textShadow: '0 2px 12px rgba(254, 98, 165, 0.11), 0 8px 32px rgba(34,40,124,0.03)',
            transition: 'opacity 0.7s',
            padding: '6px 30px',
            borderRadius: 25,
            background: result.label === "Willard"
              ? 'radial-gradient(circle, #fff 80%, #ebb0b0 120%)'
              : 'radial-gradient(circle, #fff 80%, #b8ffcc 120%)',
            animation: 'wiggle 1s',
          }}
        >
          {result.emoji} {result.label}!
        </div>
      )}

      <style>
        {`
        @keyframes wiggle {
          0% { transform: scale(0.88) rotate(-4deg);}
          20% { transform: scale(1.16) rotate(4deg);}
          40% { transform: scale(1) rotate(-2deg);}
          90% {transform: scale(1) rotate(1deg);}
          100% {transform: scale(1) rotate(0);}
        }
        `}
      </style>
    </div>
  );
}

export default App;
