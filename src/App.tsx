import React, { useEffect, useRef, useState } from "react";
import "./App.css";

// Responsive values for the game area
const BOARD_ASPECT = 2 / 3; // width/height ratio (400/600)
const BOARD_BASE_WIDTH = 400;
const BOARD_BASE_HEIGHT = 600;
const PLAYER_BASE_WIDTH = 60;
const PLAYER_BASE_HEIGHT = 30;
const SETH_BASE_WIDTH = 50;
const SETH_BASE_HEIGHT = 30;
const PLAYER_SPEED_RATIO = 0.06; // % of board width per tap
const SETH_SPEED_RATIO = 0.011; // % of board height per frame

// Helper Components to visually represent Nyree and Seth
const Nyree = ({ playerWidth, playerHeight }: { playerWidth: number, playerHeight: number }) => (
  <div
    style={{
      width: playerWidth,
      height: playerHeight,
      background: "#d074f7",
      borderRadius: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: Math.max(18, playerHeight * 0.7),
      fontWeight: "bold",
      color: "white",
      boxShadow: "0 2px 8px #9636a6",
      userSelect: "none",
      touchAction: "none"
    }}
    title="Nyree"
  >
    🏃‍♀️ Nyree
  </div>
);

const Seth = ({ width, height }: { width: number, height: number }) => (
  <div
    style={{
      width,
      height,
      background: "#ffa842",
      borderRadius: 8,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: Math.max(18, height * 0.7),
      fontWeight: "bold",
      color: "#372300",
      boxShadow: "0 2px 8px #bc7000",
      userSelect: "none",
      touchAction: "none"
    }}
    title="Seth"
  >
    🕺 Seth
  </div>
);

type GameState = "playing" | "won" | "lost";

// Main Game Component
function App() {
  // Responsive board dimensions
  const boardContainerRef = useRef<HTMLDivElement>(null);
  const [boardDims, setBoardDims] = useState({
    width: BOARD_BASE_WIDTH,
    height: BOARD_BASE_HEIGHT,
  });

  // Calculate element sizes from boardDims
  const playerWidth = boardDims.width * (PLAYER_BASE_WIDTH / BOARD_BASE_WIDTH);
  const playerHeight = boardDims.height * (PLAYER_BASE_HEIGHT / BOARD_BASE_HEIGHT);
  const sethWidth = boardDims.width * (SETH_BASE_WIDTH / BOARD_BASE_WIDTH);
  const sethHeight = boardDims.height * (SETH_BASE_HEIGHT / BOARD_BASE_HEIGHT);
  const playerY = boardDims.height - playerHeight - 6;

  // Controls (move Nyree horizontally), use percent for positions
  const [playerX, setPlayerX] = useState(boardDims.width / 2 - playerWidth / 2);
  const [sethY, setSethY] = useState(0);
  const [sethX, setSethX] = useState(() =>
    Math.floor(Math.random() * (boardDims.width - sethWidth))
  );
  const [gameState, setGameState] = useState<GameState>(
    "playing"
  );
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile/touch device
  useEffect(() => {
    const mobile = "ontouchstart" in window || navigator.maxTouchPoints > 1;
    setIsMobile(mobile);
  }, []);

  // Update sizes on window resize
  useEffect(() => {
    const updateDims = () => {
      const maxWidth = Math.min(window.innerWidth - 24, 430); // some margin
      let width = maxWidth;
      let height = Math.floor(width / BOARD_ASPECT);
      if (height > window.innerHeight - 140) {
        height = window.innerHeight - 140;
        width = Math.floor(height * BOARD_ASPECT);
      }
      width = Math.max(width, 220);
      height = Math.max(height, 330);
      setBoardDims({ width, height });
    };
    updateDims();
    window.addEventListener("resize", updateDims);
    return () => window.removeEventListener("resize", updateDims);
  }, []);

  // Reset board and player when resized
  useEffect(() => {
    setPlayerX(boardDims.width / 2 - playerWidth / 2);
    setSethX(Math.floor(Math.random() * (boardDims.width - sethWidth)));
    setSethY(0);
    // eslint-disable-next-line
  }, [boardDims.width, boardDims.height]);

  // Keyboard movement
  useEffect(() => {
    if (gameState !== "playing") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        setPlayerX((prev) =>
          Math.max(0, prev - boardDims.width * PLAYER_SPEED_RATIO)
        );
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        setPlayerX((prev) =>
          Math.min(boardDims.width - playerWidth, prev + boardDims.width * PLAYER_SPEED_RATIO)
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState, boardDims.width, playerWidth]);

  // Seth "AI" avoidance: make him try to dodge/counter Nyree each frame
  useEffect(() => {
    if (gameState !== "playing") return;

    const interval = setInterval(() => {
      setSethY((prevY) => {
        let nextY = prevY + boardDims.height * SETH_SPEED_RATIO;

        // Seth's center X and Nyree's center X
        const sethCenter = sethX + sethWidth / 2;
        const nyreeCenter = playerX + playerWidth / 2;
        const safeGap = playerWidth * 0.55; // how close seth can be to Nyree's center before he tries to move

        // Seth tries to "steer" away from player except for some randomness
        setSethX((prevX) => {
          let newX = prevX;
          // If Seth's bottom is close to the "catch" zone, don't bother moving, just drop
          if (nextY + sethHeight < playerY - playerHeight / 2) {
            // Random movement a bit if no danger
            if (Math.abs(sethCenter - nyreeCenter) < safeGap * 2 && Math.random() < 0.18) {
              const wiggle = (Math.random() - 0.5) * sethWidth;
              newX = Math.max(0, Math.min(boardDims.width - sethWidth, prevX + wiggle));
              return newX;
            }
            if (sethCenter > nyreeCenter - safeGap && sethCenter < nyreeCenter + safeGap) {
              // Seth is on a collision course, so try to escape horizontally
              const goLeft = sethCenter > boardDims.width / 2 ? true : false;
              const bias = Math.random() < 0.3; // sometimes Seth switches up
              if ((goLeft && !bias) || (!goLeft && bias)) {
                newX -= sethWidth * (0.7 + 0.6 * Math.random());
              } else {
                newX += sethWidth * (0.7 + 0.6 * Math.random());
              }
            } else if (nyreeCenter < sethCenter && prevX > 0) {
              // Player is to the left, drift (slowly) right
              newX += sethWidth * (0.14 + 0.18 * Math.random());
            } else if (nyreeCenter > sethCenter && prevX < boardDims.width - sethWidth) {
              // Player right, drift left
              newX -= sethWidth * (0.14 + 0.18 * Math.random());
            }
            // Clamp Seth in bounds
            newX = Math.max(0, Math.min(boardDims.width - sethWidth, newX));
          }
          return newX;
        });

        // Check collision if next step is past or at the player's row
        if (nextY + sethHeight >= playerY) {
          const sethLeft = sethX;
          const sethRight = sethX + sethWidth;
          const playerLeft = playerX;
          const playerRight = playerX + playerWidth;

          const overlap =
            Math.max(sethLeft, playerLeft) < Math.min(sethRight, playerRight);

          if (overlap) {
            setGameState("won");
          } else {
            setGameState("lost");
          }
        }

        return nextY;
      });
    }, 18);

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [sethX, playerX, gameState, sethHeight, playerY, boardDims.height, playerWidth, sethWidth, boardDims.width]);

  // Prevent scroll on arrow press
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

  // On-screen controls for mobile
  const moveLeft = () => {
    setPlayerX((prev) => Math.max(0, prev - boardDims.width * PLAYER_SPEED_RATIO));
  };
  const moveRight = () => {
    setPlayerX((prev) => Math.min(boardDims.width - playerWidth, prev + boardDims.width * PLAYER_SPEED_RATIO));
  };

  // Touch drag movement (bonus)
  const dragging = useRef(false);
  const lastX = useRef(0);
  const handleTouchStart = (e: React.TouchEvent) => {
    if (gameState !== "playing") return;
    dragging.current = true;
    lastX.current = e.touches[0].clientX;
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    if (gameState !== "playing" || !dragging.current) return;
    const delta = e.touches[0].clientX - lastX.current;
    setPlayerX((prev) => {
      let newX = prev + delta;
      newX = Math.max(0, Math.min(boardDims.width - playerWidth, newX));
      return newX;
    });
    lastX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = () => {
    dragging.current = false;
  };

  // Restart handler
  const handleRestart = () => {
    setPlayerX(boardDims.width / 2 - playerWidth / 2);
    setSethX(Math.floor(Math.random() * (boardDims.width - sethWidth)));
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
        height: Math.max(28, boardDims.height * 0.06),
        background:
          "linear-gradient(to top, #9c0e48 80%, #2d1629 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "bold",
        color: "#fff3fa",
        fontSize: Math.max(15, boardDims.height * 0.034),
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
        <h1 className="game-title" style={{ margin: isMobile ? "8px 0 4px" : "12px 0 6px", fontSize: isMobile ? 26 : 42 }}>Catch the Seth</h1>
        <div style={{ fontSize: isMobile ? 14 : 16, marginBottom: 9 }}>
          Play as <b>Nyree</b> and <b>catch Seth</b> before he reaches the <span style={{ color: "#d6287c", fontWeight: 600 }}>strip club</span>!
        </div>
        <ul style={{ fontSize: isMobile ? 12.5 : 14, margin: 5, marginBottom: 10, paddingInlineStart: 18, color: "#f9cdde" }}>
          <li>
            Move Nyree (bottom): <b>←</b>, <b>→</b> or <b>A</b>/<b>D</b>
            {isMobile && <span>, or tap on-screen controls</span>}
          </li>
          <li>Catch Seth before he gets to the bottom!</li>
          {isMobile && <li>Tip: You can also drag Nyree left/right!</li>}
        </ul>
        <div
          ref={boardContainerRef}
          style={{
            width: boardDims.width,
            height: boardDims.height,
            margin: "0 auto",
            position: 'relative'
          }}
        >
          <div
            className="game-board"
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              border: "3px solid #fff",
              background: "#22222a radial-gradient(circle at 70% 20%, #5e185f30 0%, #000 100%)",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0 6px 48px #a51a6d44",
              marginBottom: isMobile ? 12 : 19,
              marginTop: isMobile ? 7 : 10,
              touchAction: "none"
            }}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
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
              <Seth width={sethWidth} height={sethHeight} />
            </div>
            {/* Nyree (player) */}
            <div
              style={{
                position: "absolute",
                left: playerX,
                top: playerY,
                zIndex: 2,
                transition: gameState !== "playing" ? "left 0.25s, background 0.25s" : undefined,
                touchAction: "none"
              }}
            >
              <Nyree playerWidth={playerWidth} playerHeight={playerHeight} />
            </div>
            {/* The strip club */}
            <StripClub />

            {/* On-screen controls for mobile */}
            {isMobile && gameState === "playing" && (
              <div
                style={{
                  position: "absolute",
                  bottom: Math.max(30, boardDims.height * 0.07),
                  left: 0,
                  width: "100%",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  zIndex: 5,
                  pointerEvents: "none",
                }}
              >
                <button
                  className="control-btn"
                  style={{
                    flex: 1,
                    maxWidth: "47%",
                    background: "rgba(180,60,180,0.8)",
                    color: "white",
                    border: "none",
                    borderRadius: 20,
                    margin: "0 7px 0 6px",
                    padding: "17px 0",
                    fontSize: 26,
                    fontWeight: 900,
                    boxShadow: "0 2px 12px #c2365bcc",
                    touchAction: "none",
                    pointerEvents: "auto",
                  }}
                  tabIndex={-1}
                  aria-label="Move Left"
                  onTouchStart={moveLeft}
                  onMouseDown={moveLeft}
                  onTouchEnd={e => e.preventDefault()}
                >
                  ←
                </button>
                <button
                  className="control-btn"
                  style={{
                    flex: 1,
                    maxWidth: "47%",
                    background: "rgba(180,60,180,0.8)",
                    color: "white",
                    border: "none",
                    borderRadius: 20,
                    margin: "0 6px 0 7px",
                    padding: "17px 0",
                    fontSize: 26,
                    fontWeight: 900,
                    boxShadow: "0 2px 12px #c2365bcc",
                    touchAction: "none",
                    pointerEvents: "auto",
                  }}
                  tabIndex={-1}
                  aria-label="Move Right"
                  onTouchStart={moveRight}
                  onMouseDown={moveRight}
                  onTouchEnd={e => e.preventDefault()}
                >
                  →
                </button>
              </div>
            )}
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
                  fontSize: isMobile ? 22 : 34,
                  fontWeight: 900,
                  letterSpacing: 2,
                  borderRadius: 16,
                  textShadow: "1px 2px 7px #930033a8, 0 2px 3px #fff8",
                  padding: isMobile ? 12 : 0,
                }}
              >
                {gameState === "won" ? (
                  <>
                    🎉 You caught Seth! <br />
                    <span style={{ fontSize: isMobile ? 14 : 18, fontWeight: 400, letterSpacing: 0 }}>
                      Nyree wins!
                    </span>
                  </>
                ) : (
                  <>
                    😱 Seth escaped to the strip club!
                    <br />
                    <span style={{ fontSize: isMobile ? 14 : 18, fontWeight: 400, letterSpacing: 0 }}>
                      Try again?
                    </span>
                  </>
                )}
                <button
                  style={{
                    marginTop: isMobile ? 14 : 20,
                    background: "#de258d",
                    color: "white",
                    border: "none",
                    borderRadius: 8,
                    padding: isMobile ? "8px 16px" : "9px 26px",
                    fontSize: isMobile ? 16 : 20,
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
        </div>
        <div style={{ color: "#eac4f7b0", fontSize: isMobile ? 11.5 : 13, marginTop: 9 }}>
          Genie Game Demo –&nbsp;
          <span style={{ color: "#ffe3fa", fontStyle: 'italic' }}>Catch the Seth</span>
        </div>
      </header>
    </div>
  );
}

export default App;
