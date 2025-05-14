import React, { useState, useEffect, useRef } from 'react';
import './App.css';

// Placeholder for Niall's face: use emoji for now
const NiallFace = () => (
  <span className="niall-face" role="img" aria-label="Niall">
    😡
  </span>
);

const GAME_TIME = 30; // seconds
const START_POPUP_TIME = 1200; // ms, how long Niall stays up at start
const MIN_POPUP_TIME = 400; // ms, minimum speed at max difficulty

function getRandomPosition() {
  // Return random position in percent (left, top), avoiding edges
  const left = 10 + Math.random() * 70;
  const top = 15 + Math.random() * 60;
  return { left: `${left}%`, top: `${top}%` };
}

function App() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_TIME);
  const [gameActive, setGameActive] = useState(false);
  const [niallPos, setNiallPos] = useState(getRandomPosition());
  const [showNiall, setShowNiall] = useState(false);
  const [popupTime, setPopupTime] = useState(START_POPUP_TIME);
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const niallTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Game timer
  useEffect(() => {
    if (!gameActive) return;
    if (timeLeft <= 0) {
      setGameActive(false);
      setShowNiall(false);
      setMessage(`Time's up! Final score: ${score}`);
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => timerRef.current && clearTimeout(timerRef.current);
  }, [gameActive, timeLeft, score]);

  // Niall popping up
  useEffect(() => {
    if (!gameActive) return;
    let cancelled = false;
    function popupNiall() {
      if (!gameActive || cancelled) return;
      setNiallPos(getRandomPosition());
      setShowNiall(true);

      niallTimerRef.current = setTimeout(() => {
        setShowNiall(false);
        // Next popup: speed up as game progresses
        if (gameActive && timeLeft > 0) {
          const progress = 1 - timeLeft / GAME_TIME;
          const nextPopupTime =
            START_POPUP_TIME - (START_POPUP_TIME - MIN_POPUP_TIME) * progress;
          setPopupTime(nextPopupTime);
          setTimeout(popupNiall, 300 + Math.random() * 500);
        }
      }, popupTime);
    }
    popupNiall();
    return () => {
      cancelled = true;
      if (niallTimerRef.current) clearTimeout(niallTimerRef.current);
    };
    // eslint-disable-next-line
  }, [gameActive, popupTime, timeLeft]);

  function startGame() {
    setScore(0);
    setTimeLeft(GAME_TIME);
    setGameActive(true);
    setPopupTime(START_POPUP_TIME);
    setMessage(null);
    setShowNiall(false);
  }

  function tapNiall() {
    if (!showNiall || !gameActive) return;
    setScore(s => s + 1);
    setShowNiall(false); // Hide Niall immediately
    setNiallPos(getRandomPosition());
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
        {showNiall && gameActive && (
          <div
            className="niall"
            style={{ left: niallPos.left, top: niallPos.top }}
            onClick={tapNiall}
            tabIndex={0}
            aria-label="Tap Niall"
            role="button"
          >
            <NiallFace />
            <div className="niall-label">Niall</div>
          </div>
        )}
        {!showNiall && gameActive && (
          <div className="game-tip">Get ready...</div>
        )}
      </div>
      <footer className="game-footer">
        <small>
          Tap Niall as fast as you can! The angrier you are, the higher your score.
        </small>
      </footer>
    </div>
  );
}

export default App;
