import React from "react";
import Confetti from "react-confetti";

interface ConfettiWrapperProps {
  active: boolean;
}

const ConfettiWrapper: React.FC<ConfettiWrapperProps> = ({ active }) => {
  const [dimensions, setDimensions] = React.useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Resize confetti on window resize
  React.useEffect(() => {
    function handleResize() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!active) return null;
  return (
    <Confetti
      width={dimensions.width}
      height={dimensions.height}
      recycle={false}
      numberOfPieces={350}
      gravity={0.5}
      colors={["#ff6ec7", "#00c9ff", "#f9d423", "#00ffb3", "#f35588", "#fff4fa"]}
      style={{ zIndex: 99 }}
    />
  );
};

export default ConfettiWrapper;