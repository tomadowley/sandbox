import React from "react";
import SethioGame from "./SethioGame";
import "./App.css";

function App() {
  return (
    <div className="App">
      <h1>Sethio Platformer</h1>
      <p>
        Avoid paying strippers (red), kick Nyree's mum's cats (orange), and collect hot chocolate powder (brown)!
      </p>
      <SethioGame />
    </div>
  );
}

export default App;
