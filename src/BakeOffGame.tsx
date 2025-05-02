import React, { useState } from "react";

// Types
type Challenge = {
  name: string;
  description: string;
  steps: Step[];
};

type Step = {
  station: StationType;
  action: string;
  correct: string;
  hint?: string;
};

type StationType = "Mixing" | "Proofing" | "Baking" | "Decorating";

type GameStatus = "playing" | "success" | "fail" | "handshake";

// Challenge Data
const challenges: Challenge[] = [
  {
    name: "Classic Victoria Sponge",
    description: "Bake a perfect Victoria sponge cake!",
    steps: [
      {
        station: "Mixing",
        action: "Choose the correct key ingredient for sponge.",
        correct: "Butter",
        hint: "The fat that makes classic sponges rich.",
      },
      {
        station: "Baking",
        action: "Select the best oven temperature.",
        correct: "180°C",
        hint: "Paul says: The most common baking temp.",
      },
      {
        station: "Decorating",
        action: "Pick the perfect finishing touch.",
        correct: "Strawberry Jam & Cream",
        hint: "Traditional jam and dairy in the middle.",
      },
    ],
  },
  {
    name: "Signature Chocolate Cake",
    description: "Wow Paul with a decadent chocolate cake.",
    steps: [
      {
        station: "Mixing",
        action: "Pick your chocolate.",
        correct: "Dark Chocolate",
        hint: "Paul loves intense flavors.",
      },
      {
        station: "Baking",
        action: "What's the bake time?",
        correct: "45 minutes",
        hint: "Long enough to cook, short enough to stay moist.",
      },
      {
        station: "Decorating",
        action: "Add an elegant flourish.",
        correct: "Chocolate Ganache",
        hint: "Rich topping, smooth finish.",
      },
    ],
  },
  {
    name: "Showstopper Bread Sculpture",
    description: "Prove your bread skills with an elaborate bread showstopper!",
    steps: [
      {
        station: "Mixing",
        action: "What's the crucial raising agent?",
        correct: "Yeast",
        hint: "Classic for fluffy bread.",
      },
      {
        station: "Proofing",
        action: "Pick proofing time.",
        correct: "1 hour",
        hint: "Too little and it's dense. Too long, it collapses.",
      },
      {
        station: "Baking",
        action: "How do you get a crisp crust?",
        correct: "Add steam to oven",
        hint: "Bakery secret: humidity matters!",
      },
    ],
  },
];

// Station options
const stationChoices: Record<StationType, string[]> = {
  Mixing: ["Butter", "Margarine", "Oil", "Dark Chocolate", "Cocoa Powder", "Yeast", "Flour"],
  Proofing: ["30 minutes", "1 hour", "2 hours"],
  Baking: ["160°C", "180°C", "200°C", "45 minutes", "20 minutes", "Add steam to oven", "Bake with fan"],
  Decorating: ["Strawberry Jam & Cream", "Chocolate Ganache", "Royal Icing", "Sprinkles", "Fresh Fruit"],
};

const randomShakeAudio = [
  "👏 Nice job! Paul looks impressed...",
  "👏 Tremendous technique. Could this be...?",
  "👏 Superb! Mary nods in approval.",
];

const handshakeMessage = `
🤝 PAUL'S HANDSHAKE! 🤝
The highest honor in the tent. Congratulations, star baker!
`;

export default function BakeOffGame() {
  const [currentChallengeIdx, setCurrentChallengeIdx] = useState(0);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [selections, setSelections] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>("playing");
  const [hintShown, setHintShown] = useState(false);

  const challenge = challenges[currentChallengeIdx];
  const step = challenge.steps[currentStepIdx];

  // Handler: Choose option
  function handleChoice(choice: string) {
    const newSelections = [...selections, choice];
    setSelections(newSelections);
    if (choice === step.correct) {
      if (currentStepIdx + 1 < challenge.steps.length) {
        setCurrentStepIdx(currentStepIdx + 1);
        setHintShown(false);
      } else {
        // Challenge complete
        if (currentChallengeIdx === challenges.length - 1 && newSelections.every((sel, i) => sel === challenge.steps[i].correct)) {
          setGameStatus("handshake");
        } else {
          setGameStatus("success");
        }
      }
    } else {
      setGameStatus("fail");
    }
  }

  // Handler: Next challenge
  function nextChallenge() {
    setCurrentChallengeIdx((idx) => (idx + 1) % challenges.length);
    setCurrentStepIdx(0);
    setSelections([]);
    setGameStatus("playing");
    setHintShown(false);
  }

  // Handler: Retry
  function retryChallenge() {
    setCurrentStepIdx(0);
    setSelections([]);
    setGameStatus("playing");
    setHintShown(false);
  }

  // Handler: Show hint
  function showHint() {
    setHintShown(true);
  }

  // UI
  return (
    <div id="bakeoff-main" style={{ fontFamily: "Quicksand,Verdana,sans-serif", background: "#fff7ed", padding: 32, borderRadius: 12, boxShadow: "0 8px 32px #0002" }}>
      <h1 style={{ color: "#a2572c" }}>🥖 The Great Bake Off Simulator 🍰</h1>
      <section style={{ margin: "16px 0 32px" }}>
        <strong>Goal:</strong> Impress Paul with your bakes and earn a Handshake!
      </section>
      <article
        style={{
          background: "#ffe4c4",
          border: "2px solid #a2572c",
          padding: 24,
          borderRadius: 8,
          maxWidth: 550,
          margin: "0 auto",
        }}
      >
        <h2>Challenge: {challenge.name}</h2>
        <p>{challenge.description}</p>

        {gameStatus === "playing" ? (
          <>
            <h3>
              <span style={{ background: "#de8621", color: "white", padding: "1px 8px", borderRadius: 4 }}>
                {currentStepIdx + 1}/{challenge.steps.length}
              </span>{" "}
              {step.station} Station
            </h3>
            <p>
              <em>{step.action}</em>
            </p>
            <div style={{ margin: "12px 0" }}>
              {stationChoices[step.station].map((opt) => (
                <button
                  key={opt}
                  style={{
                    margin: 6,
                    padding: "10px 18px",
                    background: "#fffaf2",
                    color: "#a2572c",
                    border: "2px solid #dfa161",
                    borderRadius: 6,
                    fontWeight: "bold",
                    cursor: "pointer",
                  }}
                  onClick={() => handleChoice(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
            {hintShown ? (
              <div style={{ color: "#be5d07", marginTop: 10 }}>
                ℹ️ <strong>Hint:</strong> {step.hint}
              </div>
            ) : (
              step.hint && (
                <button
                  style={{ marginTop: 16, color: "#fff", background: "#be5d07", border: "none", borderRadius: 3, padding: "4px 18px", cursor: "pointer" }}
                  onClick={showHint}
                >
                  Need a hint?
                </button>
              )
            )}
          </>
        ) : gameStatus === "fail" ? (
          <>
            <h3 style={{ color: "#91280e" }}>Oh no! That's not right.</h3>
            <p>Paul gives you his signature disappointed stare. Try again?</p>
            <button
              style={{ marginRight: 10, padding: "7px 20px", background: "#fff7ea", border: "2px solid #dfa161", borderRadius: 5, fontWeight: "bold" }}
              onClick={retryChallenge}
            >
              Retry
            </button>
          </>
        ) : gameStatus === "success" ? (
          <>
            <h2 style={{ color: "#378c6c" }}>Success!</h2>
            <p>{randomShakeAudio[Math.floor(Math.random() * randomShakeAudio.length)]}</p>
            <button
              style={{ marginRight: 8, padding: "7px 20px", background: "#ede6fa", border: "2px solid #a2572c", borderRadius: 5, fontWeight: "bold" }}
              onClick={nextChallenge}
            >
              Next Challenge
            </button>
            <p style={{ marginTop: 12 }}>Can you complete all and win Paul's handshake?</p>
          </>
        ) : (
          // Handshake!
          <>
            <h2 style={{ color: "#e0b207", fontSize: 28 }}>🤝 Handshake from Paul! 🤝</h2>
            <pre style={{ color: "#222", background: "#faf5cf", padding: 18, borderRadius: 8, fontSize: 16 }}>{handshakeMessage}</pre>
            <button
              style={{ marginTop: 12, padding: "8px 26px", background: "#faf5cf", border: "2px solid #a2572c", borderRadius: 7, fontWeight: "bold" }}
              onClick={nextChallenge}
            >
              Play Again
            </button>
          </>
        )}
      </article>
      <footer style={{ marginTop: 36, fontSize: "smaller", color: "#93643a" }}>
        Tip: Try every station, and pay attention to Paul's clues!
      </footer>
    </div>
  );
}