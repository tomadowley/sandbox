import React, { useEffect, useRef, useState } from "react";
import "./App.css";

const BOARD_WIDTH = 400;
const BOARD_HEIGHT = 600;
const PLAYER_WIDTH = 60;
const PLAYER_HEIGHT = 30;
const SETH_WIDTH = 50;
const SETH_HEIGHT = 30;
const PLAYER_SPEED = 24;
const SETH_SPEED = 4;

// Helper Components to visually represent Nyree and Seth
const Nyree = () => (
  <div
    style={{
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
      background: "#d074f7",
      borderRadius: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 20,
      fontWeight: "bold",
      color: "white",
      boxShadow: "0 2px 8px #9636a6",
      userSelect: "none",
    }}
    title="Nyree"
  >
    🏃‍♀️ Nyree
  </div>
);

const Seth = () => (
  <div
    style={{
      width: SETH_WIDTH,
      height: SETH_HEIGHT,
      background: "#ffa842",
      borderRadius: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 20,
      fontWeight: "bold",
      color: "#372300",
      boxShadow: "0 2px 8px #bc7000",
      userSelect: "none",
    }}
    title="Seth"
  >
    🕺 Seth
  </div>
);

// Main Game Component
function App() {
  const [playerX, setPlayerX] = useState(BOARD_WIDTH / 2 - PLAYER_WIDTH / 2);
  const [sethY, setSethY] = useState(0);
  const [sethX, setSethX] = useState(() =>
    Math.floor(Math.random() * (BOARD_WIDTH - SETH_WIDTH))
  );
  const [gameState, setGameState] = useState<"playing" | "won" | "lost">(
    "playing"
  );
  const boardRef = useRef<HTMLDivElement>(null);

  // Keyboard movement
  useEffect(() => {
    if (gameState !== "playing") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        setPlayerX((prev) =>
          Math.max(0, prev - PLAYER_SPEED)
        );
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        setPlayerX((prev) =>
          Math.min(BOARD_WIDTH - PLAYER_WIDTH, prev + PLAYER_SPEED)
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  // Seth falling animation & collision detection
  useEffect(() => {
    if (gameState !== "playing") return;

    const interval = setInterval(() => {
      setSethY((prev) => {
        const next = prev + SETH_SPEED;

        // Check collision if next step is past or at the player's row
        if (next + SETH_HEIGHT >= BOARD_HEIGHT - PLAYER_HEIGHT) {
          const sethLeft = sethX;
          const sethRight = sethX + SETH_WIDTH;
          const playerLeft = playerX;
          const playerRight = playerX + PLAYER_WIDTH;

          const overlap =
            Math.max(sethLeft, playerLeft) < Math.min(sethRight, playerRight);

          if (overlap) {
            setGameState("won");
          } else {
            setGameState("lost");
          }
        }

        return next;
      });
    }, 18);

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [sethX, playerX, gameState]);

  // Prevent arrows from scrolling the page
  useEffect(() => {
    const preventScroll = (e: KeyboardEvent) => {
      if (
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === " " ||
        e.key === "a" ||
        e.key === "d"
      ) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", preventScroll, { passive: false });
    return () =>
      window.removeEventListener("keydown", preventScroll);
  }, []);

  // Restart handler
  const handleRestart = () => {
    setPlayerX(BOARD_WIDTH / 2 - PLAYER_WIDTH / 2);
    setSethX(Math.floor(Math.random() * (BOARD_WIDTH - SETH_WIDTH)));
    setSethY(0);
    setGameState("playing");
  };

  // The "strip club" at the bottom
  const StripClub = () => (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
        height: 32,
        background:
          "linear-gradient(to top, #9c0e48 80%, #2d1629 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        color: "#fff3fa",
        fontSize: 18,
        letterSpacing: 2,
        opacity: 0.92,
        zIndex: 0,
        borderRadius: "0 0 13px 13px",
      }}
    >
      🍸 STRIP CLUB 🍸
    </div>
  );

  return (
    <div className="App">
      <header className="App-header" style={{ padding: 0, minHeight: "100vh" }}>
        <h1 style={{ margin: "10px 0 6px", fontSize: 42 }}>Catch the Seth</h1>
        <div style={{ fontSize: 16, marginBottom: 12 }}>
          Play as <b>Nyree</b> and <b>catch Seth</b> before he reaches the <span style={{ color: "#d6287c", fontWeight: 600 }}>strip club</span>!
        </div>
        <ul style={{ fontSize: 14, margin: 5, marginBottom: 10, paddingInlineStart: 18, color: "#f9cdde" }}>
          <li>Move Nyree (bottom): <b>←</b>, <b>→</b> or <b>A</b>/<b>D</b></li>
          <li>Catch Seth before he gets to the bottom!</li>
        </ul>
        <div
          ref={boardRef}
          style={{
            position: "relative",
            width: BOARD_WIDTH,
            height: BOARD_HEIGHT,
            border: "3px solid #fff",
            background: "#22222a radial-gradient(circle at 70% 20%, #5e185f30 0%, #000 100%)",
            borderRadius: 16,
            overflow: "hidden",
            margin: "0 auto",
            boxShadow: "0 6px 48px #a51a6d44",
            marginBottom: 19,
            marginTop: 10,
          }}
        >
          {/* Seth */}
          <div
            style={{
              position: "absolute",
              left: sethX,
              top: sethY,
              transition: gameState !== "playing" ? "top 0.25s" : undefined,
              zIndex: 2,
            }}
          >
            <Seth />
          </div>
          {/* Nyree (player) */}
          <div
            style={{
              position: "absolute",
              left: playerX,
              top: BOARD_HEIGHT - PLAYER_HEIGHT - 6,
              zIndex: 2,
              transition: gameState !== "playing" ? "left 0.25s, background 0.25s" : undefined,
            }}
          >
            <Nyree />
          </div>
          {/* The strip club */}
          <StripClub />
          {/* Win/Lose Display */}
          {gameState !== "playing" && (
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                background: "rgba(33,12,33,0.74)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 10,
                color: "#fff7fb",
                fontSize: 34,
                fontWeight: 900,
                letterSpacing: 2,
                borderRadius: 16,
                textShadow: "1px 2px 7px #930033a8, 0 2px 3px #fff8",
              }}
            >
              {gameState === "won" ? (
                <>
                  🎉 You caught Seth! <br />
                  <span style={{ fontSize: 18, fontWeight: 400, letterSpacing: 0 }}>
                    Nyree wins!
                  </span>
                </>
              ) : (
                <>
                  😱 Seth escaped to the strip club!
                  <br />
                  <span style={{ fontSize: 18, fontWeight: 400, letterSpacing: 0 }}>
                    Try again?
                  </span>
                </>
              )}
              <button
                style={{
                  marginTop: 20,
                  background: "#de258d",
                  color: "white",
                  border: "none",
                  borderRadius: 8,
                  padding: "9px 26px",
                  fontSize: 20,
                  cursor: "pointer",
                  fontWeight: 700,
                  boxShadow: "0 2px 12px #c2365bcc",
                }}
                onClick={handleRestart}
              >
                Restart
              </button>
            </div>
          )}
        </div>
        <div style={{ color: "#eac4f7b0", fontSize: 13, marginTop: 9 }}>
          Genie Game Demo –&nbsp;
          <span style={{ color: "#ffe3fa", fontStyle: 'italic' }}>Catch the Seth</span>
        </div>
      </header>
    </div>
  );
}

export default App;
