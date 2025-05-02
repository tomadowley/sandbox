import React, { useState } from "react";
import PaulCharacter from "./PaulCharacter";
import BakerCharacter from "./BakerCharacter";

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

  // Mobile-friendly style helpers
const isMobile = typeof window !== "undefined" && window.innerWidth < 700;
// UI
  return (
    <div
      id="bakeoff-main"
      style={{
        fontFamily: "Quicksand,Verdana,sans-serif",
        background: "#fff7ed",
        padding: isMobile ? 6 : 32,
        borderRadius: 12,
        boxShadow: "0 8px 32px #0002",
        minHeight: "100vh",
        width: "100vw",
        overflowX: "hidden",
      }}
    >
      <h1
        style={{
          color: "#a2572c",
          fontSize: isMobile ? 21 : 32,
          marginBottom: isMobile ? 3 : 16,
          textAlign: "center",
          letterSpacing: "1.5px",
        }}
      >
        🥖 The Great Bake Off Simulator 🍰
      </h1>
      <section
        style={{
          margin: isMobile ? "7px 0 12px" : "16px 0 32px",
          fontSize: isMobile ? 13.5 : 17,
          textAlign: "center",
          lineHeight: isMobile ? 1.2 : 1.4,
        }}
      >
        <strong>Goal:</strong> Impress Paul with your bakes and earn a Handshake!
      </section>
      {/* Characters Row */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "flex-end",
          marginBottom: isMobile ? 7 : 22,
          gap: isMobile ? 12 : 40,
          minHeight: isMobile ? 90 : 110,
        }}
      >
        <PaulCharacter
          mood={
            gameStatus === "handshake"
              ? "handshake"
              : gameStatus === "success"
              ? "excited"
              : "grumpy"
          }
          animate={gameStatus === "fail" || gameStatus === "handshake" || gameStatus === "playing"}
        />
        <BakerCharacter
          status={
            gameStatus === "fail"
              ? "fail"
              : gameStatus === "success"
              ? "celebrate"
              : gameStatus === "playing"
              ? currentStepIdx > 0 || selections.length > 0
                ? "working"
                : "idle"
              : "idle"
          }
          animate={gameStatus === "success" || gameStatus === "fail" || gameStatus === "playing"}
        />
      </div>
      <article
        style={{
          background: "#ffe4c4",
          border: "2px solid #a2572c",
          padding: isMobile ? 10 : 24,
          borderRadius: 8,
          maxWidth: isMobile ? 410 : 550,
          margin: "0 auto",
          minHeight: isMobile ? 230 : 240,
          boxSizing: "border-box",
        }}
      >
        <h2
          style={{
            fontSize: isMobile ? 18 : 23,
            textAlign: isMobile ? "center" : "left",
            marginBottom: isMobile ? 4 : 14,
          }}
        >
          Challenge: {challenge.name}
        </h2>
        <p style={{ fontSize: isMobile ? 13.7 : 17 }}>{challenge.description}</p>

        {gameStatus === "playing" ? (
          <>
            <h3 style={{
              fontSize: isMobile ? 15.5 : 19,
              marginBottom: isMobile ? 4 : 8,
              textAlign: isMobile ? "center" : "left",
            }}>
              <span style={{ background: "#de8621", color: "white", padding: isMobile ? "1px 5px" : "1px 8px", borderRadius: 4 }}>
                {currentStepIdx + 1}/{challenge.steps.length}
              </span>{" "}
              {step.station} Station
            </h3>
            <p style={{ fontSize: isMobile ? 12.5 : 16, textAlign: isMobile ? "center" : "left" }}>
              <em>{step.action}</em>
            </p>
            <div style={{ margin: isMobile ? "8px 0" : "12px 0", display: "flex", flexWrap: "wrap", gap: isMobile ? 5 : 8, justifyContent: "center" }}>
              {stationChoices[step.station].map((opt) => (
                <button
                  key={opt}
                  style={{
                    margin: isMobile ? 3 : 6,
                    padding: isMobile ? "8px 10px" : "10px 18px",
                    background: "#fffaf2",
                    color: "#a2572c",
                    border: "2px solid #dfa161",
                    borderRadius: 6,
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontSize: isMobile ? 13.2 : 16,
                    minWidth: isMobile ? 95 : 128,
                  }}
                  onClick={() => handleChoice(opt)}
                >
                  {opt}
                </button>
              ))}
            </div>
            {hintShown ? (
              <div style={{ color: "#be5d07", marginTop: 10, fontSize: isMobile ? 12.8 : 15 }}>
                ℹ️ <strong>Hint:</strong> {step.hint}
              </div>
            ) : (
              step.hint && (
                <button
                  style={{
                    marginTop: isMobile ? 9 : 16,
                    color: "#fff",
                    background: "#be5d07",
                    border: "none",
                    borderRadius: 3,
                    padding: isMobile ? "3px 12px" : "4px 18px",
                    cursor: "pointer",
                    fontSize: isMobile ? 12.7 : 15,
                  }}
                  onClick={showHint}
                >
                  Need a hint?
                </button>
              )
            )}
          </>
        ) : gameStatus === "fail" ? (
          <>
            <h3 style={{ color: "#91280e", textAlign: isMobile ? "center" : "left", fontSize: isMobile ? 16 : 19 }}>
              Oh no! That's not right.
            </h3>
            <p style={{ textAlign: isMobile ? "center" : "left", fontSize: isMobile ? 12.4 : 16 }}>
              Paul gives you his signature disappointed stare. Try again?
            </p>
            <button
              style={{
                display: "block",
                margin: isMobile ? "8px auto" : "4px 0",
                marginRight: isMobile ? 0 : 10,
                padding: isMobile ? "6px 17px" : "7px 20px",
                background: "#fff7ea",
                border: "2px solid #dfa161",
                borderRadius: 5,
                fontWeight: "bold",
                fontSize: isMobile ? 12.5 : 16,
              }}
              onClick={retryChallenge}
            >
              Retry
            </button>
          </>
        ) : gameStatus === "success" ? (
          <>
            <h2 style={{ color: "#378c6c", textAlign: isMobile ? "center" : "left", fontSize: isMobile ? 18 : 21 }}>
              Success!
            </h2>
            <p style={{ textAlign: isMobile ? "center" : "left", fontSize: isMobile ? 12.8 : 15.5 }}>
              {randomShakeAudio[Math.floor(Math.random() * randomShakeAudio.length)]}
            </p>
            <button
              style={{
                marginTop: isMobile ? 9 : 0,
                padding: isMobile ? "6px 19px" : "7px 20px",
                background: "#ede6fa",
                border: "2px solid #a2572c",
                borderRadius: 5,
                fontWeight: "bold",
                fontSize: isMobile ? 12.9 : 15,
                display: "block",
                marginLeft: isMobile ? "auto" : undefined,
                marginRight: isMobile ? "auto" : (8 as number | undefined),
              }}
              onClick={nextChallenge}
            >
              Next Challenge
            </button>
            <p style={{ marginTop: isMobile ? 5 : 12, fontSize: isMobile ? 12.6 : 15, textAlign: isMobile ? "center" : "left" }}>
              Can you complete all and win Paul's handshake?
            </p>
          </>
        ) : (
          // Handshake!
          <>
            <h2 style={{
              color: "#e0b207",
              fontSize: isMobile ? 20 : 28,
              textAlign: "center",
              margin: isMobile ? "2px 0" : "7px 0",
            }}>
              🤝 Handshake from Paul! 🤝
            </h2>
            <pre style={{
              color: "#222",
              background: "#faf5cf",
              padding: isMobile ? 7 : 18,
              borderRadius: 8,
              fontSize: isMobile ? 13.5 : 16,
              lineHeight: isMobile ? 1.13 : 1.3,
              textAlign: "center",
            }}>
              {handshakeMessage}
            </pre>
            <button
              style={{
                marginTop: isMobile ? 8 : 12,
                padding: isMobile ? "7px 16px" : "8px 26px",
                background: "#faf5cf",
                border: "2px solid #a2572c",
                borderRadius: 7,
                fontWeight: "bold",
                fontSize: isMobile ? 13.5 : 16,
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
              onClick={nextChallenge}
            >
              Play Again
            </button>
          </>
        )}
      </article>
      <footer
        style={{
          marginTop: isMobile ? 23 : 36,
          fontSize: isMobile ? 11.8 : "smaller",
          color: "#93643a",
          textAlign: "center",
          paddingBottom: isMobile ? 38 : 0,
        }}
      >
        Tip: Try every station, and pay attention to Paul's clues!
      </footer>
    </div>
  );
}