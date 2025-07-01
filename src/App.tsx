import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import "./App.css";
import ConfettiWrapper from "./components/ConfettiWrapper";
import JokeCard, { Joke } from "./components/JokeCard";
import axios from "axios";

// Gradient theme sets for cycling
const gradientThemes = [
  {
    name: "Candy Pop",
    background:
      "linear-gradient(120deg, #ff6ec7, #00c9ff, #f9d423, #00ffb3, #f35588)",
  },
  {
    name: "Electric Lemonade",
    background:
      "linear-gradient(120deg, #ffeb3b, #ff6ec7, #00e1ff, #43e97b, #38f9d7)",
  },
  {
    name: "Sunset Party",
    background:
      "linear-gradient(120deg, #f35588, #ff6ec7, #f9d423, #fdc830, #f37335)",
  },
];

function App() {
  const [confettiActive, setConfettiActive] = useState(false);
  const [joke, setJoke] = useState<Joke | null>(null);
  const [jokeLoading, setJokeLoading] = useState(false);
  const [themeIdx, setThemeIdx] = useState(0);

  const handleCelebrate = () => {
    setConfettiActive(true);
    setTimeout(() => setConfettiActive(false), 3000);
  };

  const handleSurprise = async () => {
    setJokeLoading(true);
    setJoke(null);
    try {
      const response = await axios.get<Joke>(
        "https://official-joke-api.appspot.com/random_joke"
      );
      setJoke(response.data);
    } catch {
      setJoke({
        id: -1,
        type: "error",
        setup: "Oops! Couldn't fetch a joke.",
        punchline: "Try again later.",
      });
    } finally {
      setJokeLoading(false);
    }
  };

  const handleThemeToggle = () => {
    setThemeIdx((idx) => (idx + 1) % gradientThemes.length);
  };

  return (
    <>
      <div
        className="funsite-bg"
        style={{ background: gradientThemes[themeIdx].background }}
        aria-hidden
      />
      <main className="main-content-container">
        <button
          className="theme-toggle-btn"
          onClick={handleThemeToggle}
          aria-label="Toggle gradient theme"
          title={`Switch to ${gradientThemes[(themeIdx + 1) % gradientThemes.length].name} theme`}
        >
          {gradientThemes[themeIdx].name}
        </button>

        {/* Hero Section */}
        <motion.h1
          initial={{ y: -80, opacity: 0, scale: 0.6 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 90, damping: 15 }}
        >
          Welcome to FunSite!
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25, duration: 0.7 }}
        >
          A little playground built with React
        </motion.h2>
        <motion.button
          className="fun-btn"
          whileHover={{ scale: 1.1, rotate: 2 }}
          whileTap={{ scale: 0.95, rotate: -2 }}
          onClick={handleCelebrate}
        >
          🎉 Celebrate!
        </motion.button>
        <ConfettiWrapper active={confettiActive} />

        {/* Joke Section */}
        <section className="joke-section">
          <motion.button
            className="joke-btn"
            whileHover={{ scale: 1.07, rotate: -2 }}
            whileTap={{ scale: 0.96, rotate: 2 }}
            onClick={handleSurprise}
            disabled={jokeLoading}
          >
            {jokeLoading ? "Loading joke..." : "Surprise me with a joke!"}
          </motion.button>
          <AnimatePresence>
            {joke && (
              <JokeCard joke={joke} key={joke.id} />
            )}
          </AnimatePresence>
        </section>
      </main>
    </>
  );
}

export default App;