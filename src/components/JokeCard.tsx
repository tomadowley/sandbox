import React from "react";
import { motion } from "framer-motion";

export interface Joke {
  id: number;
  type: string;
  setup: string;
  punchline: string;
}

interface JokeCardProps {
  joke: Joke;
}

const JokeCard: React.FC<JokeCardProps> = ({ joke }) => (
  <motion.div
    className="joke-card"
    initial={{ scale: 0.8, opacity: 0, y: 30 }}
    animate={{ scale: 1, opacity: 1, y: 0 }}
    exit={{ scale: 0.8, opacity: 0, y: -30 }}
    transition={{ duration: 0.5, type: "spring", bounce: 0.25 }}
  >
    <div style={{ marginBottom: ".75em" }}>
      <span role="img" aria-label="joke" style={{ fontSize: "1.9rem" }}>
        🤪
      </span>
    </div>
    <div style={{ fontWeight: 600, marginBottom: "0.5em" }}>{joke.setup}</div>
    <div style={{ color: "#00c9ff", fontWeight: 700, fontSize: "1.15em" }}>
      {joke.punchline}
    </div>
  </motion.div>
);

export default JokeCard;