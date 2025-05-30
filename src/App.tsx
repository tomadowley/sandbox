import React from "react";
import { Routes, Route } from "react-router-dom";
import { GameProvider } from "./context/GameContext";

import PlayerSetup from "./pages/PlayerSetup";
import WordReveal from "./pages/WordReveal";
import Discussion from "./pages/Discussion";
import Voting from "./pages/Voting";
import Results from "./pages/Results";

function App() {
  return (
    <GameProvider>
      <Routes>
        <Route path="/" element={<PlayerSetup />} />
        <Route path="/reveal" element={<WordReveal />} />
        <Route path="/discussion" element={<Discussion />} />
        <Route path="/voting" element={<Voting />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </GameProvider>
  );
}

export default App;