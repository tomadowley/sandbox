import React, { useState } from "react";
import { quizQuestions, Question } from "./quizData";

const clamp = (val: number, min: number, max: number) => Math.max(min, Math.min(val, max));

const deg = (rad: number) => (rad * 180) / Math.PI;

const getComplianceAngle = (score: number, total: number) => {
  const ratio = clamp(score / total, 0, 1);
  return deg(Math.acos(ratio));
};

const Quiz: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [showScore, setShowScore] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [showSnark, setShowSnark] = useState<boolean>(false);
  const [snark, setSnark] = useState<string>("");

  const handleAnswerOptionClick = (isCorrect: boolean, snark: string) => {
    if (isCorrect) setScore((prev) => prev + 1);
    setSnark(snark);
    setShowSnark(true);

    setTimeout(() => {
      setShowSnark(false);
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < quizQuestions.length) {
        setCurrentQuestion(nextQuestion);
      } else {
        setShowScore(true);
      }
    }, 1500);
  };

  return (
    <div className="App">
      <div className="App-header" style={{ minHeight: "100vh", justifyContent: "center" }}>
        {showScore ? (
          <div>
            <h2>
              You scored {score} out of {quizQuestions.length}
            </h2>
            <p>
              Cosine HR compliance angle:{" "}
              <b>
                {getComplianceAngle(score, quizQuestions.length).toFixed(1)}
                °
              </b>
            </p>
            <div style={{ marginTop: 16, fontStyle: "italic", color: "#aaa" }}>
              (Lower angle = more compliant. 90° means you’re at right angles with HR.)
            </div>
          </div>
        ) : (
          <div>
            <div className="question-section" style={{ marginBottom: 24 }}>
              <div className="question-count">
                <span>
                  Question {currentQuestion + 1}/{quizQuestions.length}
                </span>
              </div>
              <div className="question-text" style={{ marginTop: 12 }}>
                {quizQuestions[currentQuestion].questionText}
              </div>
            </div>
            <div className="answer-section" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {quizQuestions[currentQuestion].answerOptions.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    !showSnark &&
                    handleAnswerOptionClick(option.isCorrect, quizQuestions[currentQuestion].johnSnark)
                  }
                  className="App-link"
                  style={{
                    background: "#333",
                    color: "#fff",
                    border: "none",
                    borderRadius: 5,
                    padding: "12px 20px",
                    cursor: showSnark ? "not-allowed" : "pointer",
                    opacity: showSnark ? 0.6 : 1,
                    fontSize: 18,
                  }}
                  disabled={showSnark}
                >
                  {option.answerText}
                </button>
              ))}
            </div>
            {showSnark && (
              <div
                style={{
                  marginTop: 28,
                  fontStyle: "italic",
                  fontSize: 18,
                  color: "#F5B041",
                  minHeight: 24,
                  transition: "opacity 0.3s",
                }}
                aria-live="polite"
              >
                {snark}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;