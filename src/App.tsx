import React from "react";
import "./App.css";
import FaceCanvas from "./components/FaceCanvas";
import { getRandomName } from "./utils/nameGenerator";

function getRandomSeed(): number {
  // Use a large random int for seed
  return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
}

function App() {
  const [seed, setSeed] = React.useState<number>(() => getRandomSeed());
  const [name, setName] = React.useState<string>(() => getRandomName(() => Math.abs(Math.sin(seed)) % 1));

  const generate = React.useCallback(() => {
    const newSeed = getRandomSeed();
    setSeed(newSeed);
    // Use a deterministic RNG for name, so name matches face
    setName(getRandomName(() => Math.abs(Math.sin(newSeed)) % 1));
  }, []);

  // Generate on mount
  React.useEffect(() => {
    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="FaceGeneratorApp">
      <div className="FaceCard">
        <FaceCanvas seed={seed} />
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
