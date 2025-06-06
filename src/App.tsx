import React from "react";
import "./App.css";
import FaceCanvas from "./components/FaceCanvas";
import { getRandomName } from "./utils/nameGenerator";

// Deterministic PRNG (mulberry32)
function seededRNG(seed: number) {
  let t = seed;
  return function () {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), t | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function getRandomSeed(): number {
  // Use a large random int for seed
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}

function getSeedNumber(seed: number | string): number {
  if (typeof seed === "number") return seed;
  return Array.from(seed)
    .map((ch, i) => ch.charCodeAt(0) * (i + 17))
    .reduce((a, b) => a + b, 0);
}

function App() {
  const [seed, setSeed] = React.useState<number>(() => getRandomSeed());

  // Use deterministic PRNG for reproducibility
  const numericSeed = getSeedNumber(seed);
  const rng = seededRNG(numericSeed);

  // Decide dog vs human once per seed
  const isDog = (() => {
    // Use a separate rng so the face and name don't accidentally correlate with dog/human
    const dogRng = seededRNG(numericSeed + 42);
    return dogRng() < 0.1;
  })();

  const name = getRandomName(rng);

  const generate = React.useCallback(() => {
    setSeed(getRandomSeed());
  }, []);

  return (
    <div className="FaceGeneratorApp">
      <div className="FaceCard">
        <FaceCanvas seed={seed} isDog={isDog} />
        <div className="FaceName">{name}</div>
        <button
          className="GenerateButton"
          onClick={generate}
        >
          Generate Random Face
        </button>
      </div>
    </div>
  );
}

export default App;
