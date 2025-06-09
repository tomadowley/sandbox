import React, { useRef, useState } from 'react';
import logo from './logo.svg';
import './App.css';

// Royalty-free disco track (from pixabay, for example)
const DISCO_TRACK =
  "https://cdn.pixabay.com/audio/2023/03/16/audio_12c1b9b2c4.mp3";

function App() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [muted, setMuted] = useState(false);

  const toggleMute = () => {
    setMuted((m) => {
      if (audioRef.current) {
        audioRef.current.muted = !m;
      }
      return !m;
    });
  };

  // Auto-play on load
  React.useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.2;
      // Try to autoplay (will work if user has interacted)
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay might be blocked
        });
      }
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p className="rave-text">
          Welcome to the Disco Rave!
        </p>
        <div className="rave-music-control">
          <audio
            ref={audioRef}
            src={DISCO_TRACK}
            loop
            autoPlay
            muted={muted}
            controls={false}
            aria-label="Disco rave soundtrack"
          />
          <button onClick={toggleMute} style={{
            background: muted ? "#ff00cc" : "#00ff99",
            color: "#fff",
            fontWeight: "bold",
            border: "none",
            borderRadius: "2em",
            padding: "0.6em 2em",
            marginRight: "1em",
            cursor: "pointer",
            boxShadow: "0 0 10px #ff00cc, 0 0 30px #00ff99"
          }}>
            {muted ? "Unmute" : "Mute"} Music
          </button>
          <span style={{
            fontSize: "1.1em",
            color: "#fffb00",
            textShadow: "0 0 10px #ff00cc"
          }}>
            {muted ? "🔇" : "🎶"}
          </span>
        </div>
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
