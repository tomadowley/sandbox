import React from "react";

type BakerCharacterProps = {
  status: "idle" | "working" | "celebrate" | "fail";
  animate?: boolean;
  className?: string;
};

// Minimal comic SVG baker with chef hat, animated by status
export default function BakerCharacter({ status, animate, className }: BakerCharacterProps) {
  let faceMood: "neutral" | "smile" | "sad" = "neutral";
  if (status === "celebrate") faceMood = "smile";
  if (status === "fail") faceMood = "sad";

  return (
    <svg
      width="76"
      height="102"
      viewBox="0 0 76 102"
      fill="none"
      className={className}
      style={{
        filter: "drop-shadow(0 3px 9px #b98c5762)",
        transition: "0.3s",
        animation:
          status === "working"
            ? "bakerStir 0.32s infinite alternate"
            : status === "celebrate"
            ? "bakerJump 0.4s 5 alternate"
            : status === "fail"
            ? "bakerSad 0.4s 4 alternate"
            : undefined,
        transform: status === "celebrate" ? "scale(1.13)" : undefined,
        marginLeft: 8,
      }}
    >
      {/* Body */}
      <ellipse cx="36" cy="88" rx="21" ry="13" fill="#e1cdb8" />
      {/* Head */}
      <ellipse cx="36" cy="55" rx="25" ry="30" fill="#fae2ba" stroke="#9d7c58" strokeWidth="2.3" />
      {/* Chef's hat */}
      <ellipse cx="36" cy="27" rx="14" ry="9" fill="#fcfcfe" />
      <ellipse cx="22" cy="21" rx="4.2" ry="3.5" fill="#fcfcfe" />
      <ellipse cx="50" cy="21" rx="4.2" ry="3.5" fill="#fcfcfe" />
      {/* Shoulders */}
      <ellipse cx="19" cy="82" rx="7" ry="10" fill="#e1cdb8" />
      <ellipse cx="53" cy="82" rx="7" ry="10" fill="#e1cdb8" />
      {/* Eyes */}
      <ellipse cx="32" cy="53" rx="2" ry="3.1" fill="#343" />
      <ellipse cx="41" cy="54" rx="2" ry="3.1" fill="#343" />
      {/* Mouths */}
      {faceMood === "neutral" && <ellipse cx="36.5" cy="65" rx="4" ry="1.3" fill="#986f44" />}
      {faceMood === "smile" && <path d="M33 65 Q36.5 71 42 65" stroke="#986f44" strokeWidth="2" fill="none" />}
      {faceMood === "sad" && <path d="M33 67 Q36.5 62 42 67" stroke="#991f18" strokeWidth="2" fill="none" />}
      {/* Apron */}
      <rect x="25" y="73" width="23" height="16" rx="8" fill="#fff6ec" stroke="#f4dfbd" strokeWidth="1" />
      {/* Spoon (for working) */}
      {status === "working" && (
        <g>
          <rect x="62" y="95" width="3" height="18" rx="1.2" fill="#ca8925" transform="rotate(-38 62 95)" />
          <ellipse cx="65" cy="112" rx="5.7" ry="4.3" fill="#a5752e" transform="rotate(-38 65 112)" />
        </g>
      )}
      {/* Stars for Celebrate */}
      {status === "celebrate" && (
        <>
          <polygon points="24,35 28,49 19,43 31,43 22,49" fill="#ffe468">
            <animate attributeName="opacity" values="0;1;0" dur="0.7s" repeatCount="3" />
          </polygon>
          <polygon points="50,36 50,45 59,42 47,43 55,49" fill="#ffe468">
            <animate attributeName="opacity" values="0.2;1;0.2" dur="0.9s" repeatCount="3" />
          </polygon>
        </>
      )}
      <text x="36" y="99" textAnchor="middle" fontSize="13" fill="#bc8d3e" fontWeight="bold">Baker</text>
      <style>
        {`
        @keyframes bakerStir {
          0% { transform: translateY(0); }
          100% { transform: translateY(-2px) rotate(-2deg) scale(1.01); }
        }
        @keyframes bakerJump {
          0% { transform: translateY(0) scale(1); }
          40% { transform: translateY(-9px) scale(1.13); }
          100% { transform: translateY(0) scale(1); }
        }
        @keyframes bakerSad {
          0% { transform: translateY(0) scale(1); }
          60% { transform: translateY(7px) scale(0.95,1.04);}
          100% { transform: translateY(0) scale(1); }
        }
        `}
      </style>
    </svg>
  );
}