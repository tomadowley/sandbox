import React, { useEffect, useRef, useState } from "react";

// This loader only imports and renders ThreeDemo on the client (browser)
const ThreeDemoLoader: React.FC = () => {
  const [ThreeDemo, setThreeDemo] = useState<null | React.FC>(null);

  useEffect(() => {
    let mounted = true;
    import("./ThreeDemo").then((mod) => {
      if (mounted) setThreeDemo(() => mod.default);
    });
    return () => {
      mounted = false;
    };
  }, []);

  return ThreeDemo ? <ThreeDemo /> : null;
};

export default ThreeDemoLoader;