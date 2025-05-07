import React, { useRef, useState, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";

// Simple 3D box for men, larger box for gorilla (replace with models if desired)
function Fighter({ position, color, health, isDead, isGorilla }: any) {
  const ref = useRef<any>();
  useFrame(() => {
    if (ref.current && isDead) {
      ref.current.rotation.z += 0.06; // Simple death animation
    }
  });
  return (
    <group position={position}>
      <mesh ref={ref}>
        <boxGeometry args={isGorilla ? [1, 2, 1] : [0.5, 1, 0.5]} />
        <meshStandardMaterial color={color} />
      </mesh>
      {health > 0 && (
        <Html center position={[0, isGorilla ? 1.5 : 0.7, 0]}>
          <div
            style={{
              width: isGorilla ? 60 : 40,
              height: 6,
              border: "1px solid #000",
              background: "#fff",
              borderRadius: 3,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${Math.max(0, health)}%`,
                background: health > 50 ? "limegreen" : health > 25 ? "orange" : "red",
                transition: "width 0.2s",
              }}
            />
          </div>
        </Html>
      )}
    </group>
  );
}

function randomCirclePos(radius: number) {
  const theta = Math.random() * Math.PI * 2;
  return [
    Math.cos(theta) * radius,
    0,
    Math.sin(theta) * radius,
  ] as [number, number, number];
}

const GORILLA_MAX_HEALTH = 300;
const MAN_MAX_HEALTH = 35;

interface FighterState {
  id: number;
  position: [number, number, number];
  health: number;
  isDead: boolean;
}

export default function GorillaSimulator() {
  const [gorilla, setGorilla] = useState<FighterState>({
    id: 0,
    position: [0, 0.5, 0],
    health: GORILLA_MAX_HEALTH,
    isDead: false,
  });
  const [men, setMen] = useState<FighterState[]>(
    Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      position: randomCirclePos(6 + Math.random() * 1.5),
      health: MAN_MAX_HEALTH,
      isDead: false,
    }))
  );
  const [running, setRunning] = useState(true);
  const [deaths, setDeaths] = useState({ gorilla: 0, men: 0 });

  // "Fight" simulation loop: random men attack gorilla, gorilla attacks nearest alive man
  useFrame(() => {
    if (!running) return;
    // Gorilla attacks nearest man
    const aliveMen = men.filter((m) => !m.isDead);
    if (aliveMen.length === 0 || gorilla.isDead) {
      setRunning(false);
      return;
    }
    const nearest = aliveMen.reduce((closest, m) => {
      const d =
        Math.pow(m.position[0] - gorilla.position[0], 2) +
        Math.pow(m.position[2] - gorilla.position[2], 2);
      const cd =
        Math.pow(closest.position[0] - gorilla.position[0], 2) +
        Math.pow(closest.position[2] - gorilla.position[2], 2);
      return d < cd ? m : closest;
    }, aliveMen[0]);

    // Gorilla attacks
    if (Math.random() < 0.15) {
      setMen((old) =>
        old.map((m) =>
          m.id === nearest.id && !m.isDead
            ? {
                ...m,
                health: m.health - (20 + Math.random() * 15),
                isDead: m.health - 20 <= 0,
              }
            : m
        )
      );
    }

    // Random men attack gorilla
    aliveMen.forEach((m) => {
      if (Math.random() < 0.004) {
        setGorilla((g) => ({
          ...g,
          health: g.health - (2 + Math.random() * 3),
          isDead: g.health - 2 <= 0,
        }));
      }
    });

    // Update death counts
    setMen((old) => {
      const deathsNow = old.filter((m) => !m.isDead && m.health <= 0).length;
      if (deathsNow > 0) {
        setDeaths((d) => ({ ...d, men: d.men + deathsNow }));
      }
      return old.map((m) =>
        m.isDead || m.health > 0
          ? m
          : { ...m, isDead: true, health: 0 }
      );
    });
    setGorilla((g) => {
      if (g.isDead || g.health > 0) return g;
      setDeaths((d) => ({ ...d, gorilla: 1 }));
      return { ...g, isDead: true, health: 0 };
    });
  });

  const restart = useCallback(() => {
    setGorilla({
      id: 0,
      position: [0, 0.5, 0],
      health: GORILLA_MAX_HEALTH,
      isDead: false,
    });
    setMen(
      Array.from({ length: 100 }, (_, i) => ({
        id: i + 1,
        position: randomCirclePos(6 + Math.random() * 1.5),
        health: MAN_MAX_HEALTH,
        isDead: false,
      }))
    );
    setDeaths({ gorilla: 0, men: 0 });
    setRunning(true);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#222" }}>
      <Canvas camera={{ position: [0, 15, 18], fov: 38 }}>
        <ambientLight intensity={0.7} />
        <pointLight position={[0, 10, 10]} intensity={1.2} />
        <directionalLight position={[0, 7, -10]} intensity={0.6} />
        {/* Gorilla */}
        <Fighter
          key="gorilla"
          position={gorilla.position}
          color="#444"
          health={(gorilla.health / GORILLA_MAX_HEALTH) * 100}
          isDead={gorilla.isDead}
          isGorilla
        />
        {/* Men */}
        {men.map((m) => (
          <Fighter
            key={m.id}
            position={m.position}
            color={m.isDead ? "#333" : "#aaa"}
            health={(m.health / MAN_MAX_HEALTH) * 100}
            isDead={m.isDead}
            isGorilla={false}
          />
        ))}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
          <circleGeometry args={[9, 64]} />
          <meshStandardMaterial color="#3b683b" />
        </mesh>
        <OrbitControls />
      </Canvas>
      {/* Overlay UI */}
      <div style={{
        position: "absolute",
        top: 15, left: 0, right: 0,
        textAlign: "center", color: "#fff", fontFamily: "sans-serif",
        zIndex: 10,
      }}>
        <h2>1 Gorilla vs 100 Men Simulator</h2>
        <div>
          <span>Gorilla Health: {Math.max(0, Math.round(gorilla.health))}</span>
          {" | "}
          <span>Dead Men: {deaths.men} / 100</span>
        </div>
        {!running && (
          <div style={{ marginTop: 18, fontSize: 22, color: "#ffb347" }}>
            {gorilla.isDead
              ? "The Gorilla has fallen!"
              : deaths.men === 100
              ? "The Gorilla wins!"
              : "Simulation Ended"}
          </div>
        )}
        <button
          onClick={restart}
          style={{
            marginTop: 16,
            fontSize: 18,
            padding: "7px 28px",
            background: "#444",
            color: "#fff",
            border: "2px solid #fff",
            borderRadius: 6,
            cursor: "pointer",
          }}
        >
          Restart
        </button>
      </div>
    </div>
  );
}