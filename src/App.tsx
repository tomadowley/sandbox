import React, { useRef, useState } from "react";
import "./App.css";
// 3D engine
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";

// Core squash court geometry
const COURT = {
  width: 8,      // meters
  height: 5,     // meters
  depth: 10,     // meters
  wall: 0.12,    // wall thickness
};

function SquashCourt() {
  const { width, height, depth, wall } = COURT;
  // Floor
  return (
    <group>
      {/* Floor */}
      <mesh receiveShadow position={[0, -height / 2, 0]}>
        <boxGeometry args={[width, wall, depth]} />
        <meshStandardMaterial color="#e0b97d" />
      </mesh>
      {/* Ceiling */}
      <mesh receiveShadow position={[0, height / 2, 0]}>
        <boxGeometry args={[width, wall, depth]} />
        <meshStandardMaterial color="#e7e7e7" />
      </mesh>
      {/* Front Wall*/}
      <mesh receiveShadow position={[0, 0, -depth / 2]}>
        <boxGeometry args={[width, height, wall]} />
        <meshStandardMaterial color="#dae9fb" />
      </mesh>
      {/* Back Wall */}
      <mesh receiveShadow position={[0, 0, depth / 2]}>
        <boxGeometry args={[width, height, wall]} />
        <meshStandardMaterial color="#dae9fb" />
      </mesh>
      {/* Left Wall */}
      <mesh receiveShadow position={[-width / 2, 0, 0]}>
        <boxGeometry args={[wall, height, depth]} />
        <meshStandardMaterial color="#9cabc8" />
      </mesh>
      {/* Right Wall */}
      <mesh receiveShadow position={[width / 2, 0, 0]}>
        <boxGeometry args={[wall, height, depth]} />
        <meshStandardMaterial color="#9cabc8" />
      </mesh>
      {/* Court floor marking */}
      <mesh position={[0, -height / 2 + 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width * 0.95, depth * 0.95]} />
        <meshStandardMaterial color="#d77b36" transparent opacity={0.27} />
      </mesh>
    </group>
  );
}

// Ball component in 3D with basic physics for local simulation
function Ball({ ballRef, pos, velocity }: {
  ballRef: React.MutableRefObject<THREE.Mesh | null>,
  pos: [number, number, number],
  velocity: [number, number, number]
}) {
  // The mesh itself is stored in ballRef if multiplayer wants control
  return (
    <mesh ref={ballRef} position={pos} castShadow>
      <sphereGeometry args={[0.18, 32, 32]} />
      <meshStandardMaterial color="#222" />
    </mesh>
  );
}

// Simple racket: just a 3D block
function Racket({ pos, color = "#223a91" }: { pos: [number, number, number], color?: string }) {
  return (
    <mesh position={pos} castShadow>
      <boxGeometry args={[0.7, 0.12, 0.4]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

// Main 3D squash game
function ThreeSquash({ isHost, playerName, peerName }: { isHost: boolean, playerName: string, peerName: string }) {
  // Ball position and velocity state
  const [ballPos, setBallPos] = useState<[number, number, number]>([0, 0, 0]);
  const [ballVel, setBallVel] = useState<[number, number, number]>([0.28, 0.19, -0.53]);
  const ballRef = useRef<THREE.Mesh>(null);

  // Racket positions (Z: near wall for host, far for peer)
  const [myRacket, setMyRacket] = useState<[number, number, number]>([0, -COURT.height / 2 + 0.22, COURT.depth / 2 - 0.4]);
  const [peerRacket, setPeerRacket] = useState<[number, number, number]>([0, -COURT.height / 2 + 0.22, -COURT.depth / 2 + 0.4]);

  // Basic ball movement & collision (local only; should be authoritative on host & sync in a real game)
  useFrame(() => {
    // Only move if host or single player (You'd sync via network in real MP)
    if (!isHost) return;
    let [x, y, z] = ballPos;
    let [vx, vy, vz] = ballVel;
    // Move
    x += vx;
    y += vy;
    z += vz;
    // Walls
    if (Math.abs(x) + 0.18 >= COURT.width / 2) vx = -vx;
    if (y + 0.18 >= COURT.height / 2 || y - 0.18 <= -COURT.height / 2) vy = -vy;
    if (z - 0.18 <= -COURT.depth / 2 || z + 0.18 >= COURT.depth / 2) vz = -vz;
    setBallPos([x, y, z]);
    setBallVel([vx, vy, vz]);
    // TODO: Racket collision (you'd want to check for AABB/sphere vs racket here & bounce)
  });

  // Controls: Mouse/touch y axis for local player racket
  const { size, viewport } = useThree();
  const handlePointerMove = (e: any) => {
    // Normalized device coords [-1,1], project onto court width
    const x = ((e.clientX / size.width) * 2 - 1) * (COURT.width / 2) * 0.8;
    setMyRacket((r) => [x, r[1], r[2]]);
    // TODO: Send new racket pos to peer via socket/p2p
  };

  return (
    <Canvas
      shadows
      camera={{ position: [0, COURT.height / 2.8, COURT.depth * 1.06], fov: 56 }}
      style={{ width: "100vw", height: "80vw", maxWidth: 700, maxHeight: 920, background: "#111" }}
      onPointerMove={handlePointerMove}
    >
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[6, 12, 20]}
        intensity={1.4}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024} />
      <PerspectiveCamera makeDefault position={[0, 1.8, COURT.depth * 1.04]} fov={52}/>
      <OrbitControls maxDistance={20} minDistance={7} minPolarAngle={0.36} maxPolarAngle={1.22}/>
      <SquashCourt />
      <Ball ballRef={ballRef} pos={ballPos} velocity={ballVel} />
      <Racket pos={myRacket} color="#2255dd" />
      <Racket pos={peerRacket} color="#ee4444" />
    </Canvas>
  );
}

// Main App Component
function App() {
  // Multiplayer role selection
  const [role, setRole] = useState<null | "host" | "join">(null);
  const [playerName, setPlayerName] = useState("");
  const [peerName, setPeerName] = useState("Peer");

  // TODO: This demo fakes "2P", but in reality you would:
  // - Connect to a server using WebSocket or similar (e.g. socket.io)
  // - Create game rooms, match peers, broadcast ball/racket state, assign server authority

  return (
    <div className="App">
      <h1>3D Squash Multiplayer (Prototype)</h1>
      {!role ? (
        <div className="game-menu">
          <input
            placeholder="Enter your name"
            style={{ margin: "0 0 16px 0", fontSize: "1.1rem", padding: "8px" }}
            value={playerName}
            onChange={e => setPlayerName(e.target.value)}
          />
          <button onClick={() => setRole("host")} style={{ marginRight: 10 }}>Host Game</button>
          <button onClick={() => setRole("join")}>Join Game</button>
          <p style={{ marginTop: 14, fontSize: "0.96em", color: "#abd" }}>Multiplayer requires both players to open this game in another browser.<br />Networking code placeholder only!</p>
        </div>
      ) : (
        <ThreeSquash
          isHost={role === "host"}
          playerName={playerName}
          peerName={peerName}
        />
      )}
      <div className="game-instructions" style={{ maxWidth: 680 }}>
        <h3>How to Play Multiplayer 3D Squash Demo</h3>
        <p>1. Choose "Host Game" or "Join Game" (peer networking placeholder)</p>
        <p>2. Drag your mouse/finger to move your racket across the width</p>
        <p>3. The court, ball, and two rackets are 3D and physically simulated<br />
        4. In a real multiplayer version, positions and the ball would be synchronized in real time</p>
        <p><strong>Note:</strong> This demo lacks backend networking.<br />
          For real-time multiplayer, add a Node.js/socket.io backend and hook up WebSocket events.</p>
      </div>
    </div>
  );
}

export default App;