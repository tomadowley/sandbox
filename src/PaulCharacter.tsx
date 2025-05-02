import React from "react";

type PaulCharacterProps = {
  mood: "grumpy" | "excited" | "handshake";
  animate?: boolean;
  className?: string;
};

// Simple SVG Paul with grumpy/cheerful faces and some animation
export default function PaulCharacter({ mood, animate, className }: PaulCharacterProps) {
  return (
    <svg
      width="90"
      height="110"
      viewBox="0 0 90 110"
      fill="none"
      className={className}
      style={{
        filter: "drop-shadow(2px 6px 6px #8886)",
        transition: "0.3s",
        transform: mood === "handshake" && animate ? "scale(1.18) rotate(-4deg)" : "none",
        animation: animate && mood === "grumpy" ? "paulGrump 0.55s infinite alternate" : undefined,
        marginRight: 8,
      }}
    >
      {/* Body */}
      <ellipse cx="45" cy="95" rx="18" ry="14" fill="#8f611d" />
      {/* Arms (static unless handshake) */}
      {mood !== "handshake" ? (
        <>
          <rect x="7" y="80" width="13" height="10" rx="6" fill="#b69b74" />
          <rect x="70" y="80" width="13" height="10" rx="6" fill="#b69b74" />
        </>
      ) : (
        <>
          {/* Handshake pose: left hand up */}
          <rect x="13" y="70" width="15" height="14" rx="6" fill="#b69b74" style={{ transform: "rotate(-18deg)", transformOrigin: "19px 77px" }} />
          <rect x="70" y="80" width="13" height="10" rx="6" fill="#b69b74" />
        </>
      )}
      {/* Head */}
      <ellipse cx="45" cy="52" rx="28" ry="36" fill="#ecd6b2" stroke="#624115" strokeWidth="3.2" />
      {/* Eyebrows */}
      <rect x="25" y="40" width="13" height="3" rx="1.8" fill="#404040"
        style={{
          transform: mood === "grumpy" ? "rotate(-15deg)" : "",
          transformOrigin: "34px 44px",
        }}
      />
      <rect x="52" y="41" width="13" height="3" rx="1.8" fill="#404040"
        style={{
          transform: mood === "grumpy" ? "rotate(15deg)" : "",
          transformOrigin: "60px 44px",
        }}
      />
      {/* Eyes */}
      <ellipse cx="35" cy="54" rx="3.2" ry="5.2" fill="#333" />
      <ellipse cx="56" cy="57" rx="3.2" ry="5.2" fill="#333" />
      {/* Mouths */}
      {mood === "grumpy" && (
        <path d="M35 73 Q45 65 55 73" stroke="#6d3e1a" strokeWidth="3" fill="none" />
      )}
      {mood === "excited" && (
        <ellipse cx="45" cy="71" rx="7" ry="5" fill="#ffb48f" stroke="#924e13" strokeWidth="2" />
      )}
      {mood === "handshake" && (
        <path d="M36 69 Q45 85 55 70" stroke="#7f3d0d" strokeWidth="3" fill="none" />
      )}
      {/* Mustache */}
      <ellipse cx="45" cy="63" rx="12" ry="2.7" fill="#6b3b12" />
      <ellipse cx="38" cy="63" rx="5.5" ry="1.6" fill="#53341b" />
      <ellipse cx="53" cy="63" rx="5.5" ry="1.6" fill="#53341b" />
      {/* Label */}
      <text x="45" y="108" textAnchor="middle" fontSize="13" fill="#8f611d" fontWeight="bold">Paul</text>
      <style>
        {`
        @keyframes paulGrump {
          0% { transform: translateY(0) scale(1); }
          90% { transform: translateY(-1px) scale(1.019,0.98);}
          100% { transform: translateY(2.5px) scale(0.98,1.018);}
        }
        `}
      </style>
    </svg>
  );
}