import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Emojis for Niall & Ali
const NiallFace = () => (
  <span className="niall-face" role="img" aria-label="Niall">
    😡
  </span>
);
const AliFace = () => (
  <span className="ali-face" role="img" aria-label="Ali">
    😃
  </span>
);

const GAME_TIME = 10; // seconds
const START_POPUP_TIME = 1000; // ms, how long character stays up at start
const MIN_POPUP_TIME = 350; // ms, minimum speed at max difficulty
const ALI_CHANCE = 0.23; // 23% chance Ali appears instead of Niall

function getRandomPosition() {
  // Return random position in percent (left, top), avoiding edges
  const left = 8 + Math.random() * 74;
  const top = 16 + Math.random() * 52;
  return { left: `${left}%`, top: `${top}%` };
}

type CharacterType = "niall" | "ali";

function App() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [gameActive, setGameActive] = useState(false);
  const [characterPos, setCharacterPos] = useState(getRandomPosition());
  const [showCharacter, setShowCharacter] = useState(false);
  const [popupTime, setPopupTime] = useState(START_POPUP_TIME);
  const [currentCharacter, setCurrentCharacter] = useState<CharacterType>("niall");
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const charTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Game timer
  useEffect(() => {
    if (!gameActive) return;
    if (timeLeft <= 0) {
      setGameActive(false);
      setShowCharacter(false);
      setMessage(`Time's up! Final score: ${score}`);
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [gameActive, timeLeft, score]);

  // Character popping up
  useEffect(() => {
    if (!gameActive) return;

    let cancelled = false;

    function popupCharacter(nextInstant = false) {
      if (!gameActive || cancelled) return;
      setCharacterPos(getRandomPosition());

      // Randomly choose Niall or Ali
      setCurrentCharacter(Math.random() < ALI_CHANCE ? "ali" : "niall");
      setShowCharacter(true);

      charTimerRef.current = setTimeout(() => {
        setShowCharacter(false);
        // Next popup: speed up as game progresses
        if (gameActive && timeLeft > 0) {
          const progress = 1 - timeLeft / GAME_TIME;
          const nextPopupTime =
            START_POPUP_TIME - (START_POPUP_TIME - MIN_POPUP_TIME) * progress;
          setPopupTime(nextPopupTime);

          // Instantly show next character after hide (no "get ready" wait)
          setTimeout(() => popupCharacter(true), 0);
        }
      }, popupTime);
    }
    popupCharacter();
    return () => {
      cancelled = true;
      if (charTimerRef.current) clearTimeout(charTimerRef.current);
    };
    // eslint-disable-next-line
  }, [gameActive, popupTime, timeLeft]);

  function startGame() {
    setScore(0);
    setTimeLeft(GAME_TIME);
    setGameActive(true);
    setPopupTime(START_POPUP_TIME);
    setMessage(null);
    setShowCharacter(false);
  }

  function tapCharacter() {
    if (!showCharacter || !gameActive) return;
    if (currentCharacter === "niall") {
      setScore(s => s + 1);
    } else if (currentCharacter === "ali") {
      setScore(s => (s > 0 ? s - 1 : 0));
    }
    setShowCharacter(false); // Hide character immediately
    setCharacterPos(getRandomPosition());
    // Instantly show next character after a tap (no "get ready" wait)
    setTimeout(() => {
      if (gameActive && timeLeft > 0) {
        // Randomly choose again, avoid double penalty/bonus for fast tapping
        setCurrentCharacter(Math.random() < ALI_CHANCE ? "ali" : "niall");
        setCharacterPos(getRandomPosition());
        setShowCharacter(true);
      }
    }, 0);
  }

  return (
    <div className="App">
      <header className="game-header">
        <h1>We're Angry at Niall!</h1>
        <div className="score-timer">
          <span>Score: <strong>{score}</strong></span>
          <span>Time: <strong>{timeLeft}</strong>s</span>
        </div>
        {!gameActive ? (
          <button className="start-btn" onClick={startGame}>
            {message ? 'Play Again' : 'Start'}
          </button>
        ) : null}
        {message && <div className="game-message">{message}</div>}
      </header>
      <div className="game-area">
        {showCharacter && gameActive && (
          <div
            className={`character ${currentCharacter}`}
            style={{ left: characterPos.left, top: characterPos.top }}
            onClick={tapCharacter}
            tabIndex={0}
            aria-label={currentCharacter === "niall" ? "Tap Niall" : "Don't tap Ali"}
            role="button"
          >
            {currentCharacter === "niall" ? <NiallFace /> : <AliFace />}
            <div className="character-label">
              {currentCharacter === "niall" ? "Niall" : "Ali"}
            </div>
          </div>
        )}
      </div>
      <footer className="game-footer">
        <small>
          Tap Niall for points.<br />
          Beware: Tapping happy Ali loses a point!
        </small>
      </footer>
    </div>
  );
}

export default App;
