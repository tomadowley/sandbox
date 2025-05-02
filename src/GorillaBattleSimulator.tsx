import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

type FighterType = 'human' | 'gorilla';

interface Fighter {
  id: number;
  type: FighterType;
  position: [number, number, number];
  health: number;
  stamina: number;
  alive: boolean;
}

// --- Constants for simulation stats ---
const HUMAN_STATS = {
  power: 8,      // out of 100
  stamina: 40,   // out of 100
  technique: 25, // out of 100
  health: 40,    // hit points
  attackRange: 1.2,
  speed: 1.3,
};

const GORILLA_STATS = {
  power: 95,     // out of 100
  stamina: 90,   // out of 100
  technique: 70, // out of 100
  health: 400,   // hit points
  attackRange: 2.0,
  speed: 2.2,
};

const NUM_HUMANS = 100;

// --- Helper to initialize fighters ---
function initFighters(): Fighter[] {
  const humans: Fighter[] = [];
  const angleStep = (2 * Math.PI) / NUM_HUMANS;
  const radius = 12;
  for (let i = 0; i < NUM_HUMANS; i++) {
    // Place humans in a large circle around (0,0,0)
    const angle = i * angleStep;
    humans.push({
      id: i,
      type: 'human',
      position: [
        Math.cos(angle) * radius + (Math.random() - 0.5) * 0.8,
        0,
        Math.sin(angle) * radius + (Math.random() - 0.5) * 0.8,
      ],
      health: HUMAN_STATS.health,
      stamina: HUMAN_STATS.stamina,
      alive: true,
    });
  }
  // Place gorilla in center
  const gorilla: Fighter = {
    id: 1000,
    type: 'gorilla',
    position: [0, 0, 0],
    health: GORILLA_STATS.health,
    stamina: GORILLA_STATS.stamina,
    alive: true,
  };
  return [gorilla, ...humans];
}

// --- Combat logic ---
function distance(a: [number, number, number], b: [number, number, number]) {
  return Math.sqrt(
    (a[0] - b[0]) ** 2 +
    (a[1] - b[1]) ** 2 +
    (a[2] - b[2]) ** 2
  );
}

function computeAttack(attacker: Fighter, defender: Fighter) {
  // Damage is a function of power, technique, and remaining stamina.
  let power, technique;
  if (attacker.type === 'gorilla') {
    power = GORILLA_STATS.power;
    technique = GORILLA_STATS.technique;
  } else {
    power = HUMAN_STATS.power;
    technique = HUMAN_STATS.technique;
  }
  // Stamina penalty: if below 20, attacks are weaker
  const staminaFactor = attacker.stamina > 20 ? 1 : 0.5;
  const baseDamage = power * 0.25 + technique * 0.1;
  // Damage is randomized a little
  const finalDamage = baseDamage * staminaFactor * (0.9 + Math.random() * 0.2);
  return Math.round(finalDamage);
}

// --- 3D Models ---
function HumanModel({ position, alive }: { position: [number, number, number]; alive: boolean }) {
  return (
    <mesh position={position}>
      <cylinderGeometry args={[0.4, 0.4, 1.6, 14]} />
      <meshStandardMaterial color={alive ? "#8ac" : "#444"} />
      {/* Head */}
      <mesh position={[0, 1, 0]}>
        <sphereGeometry args={[0.32, 10, 10]} />
        <meshStandardMaterial color={alive ? "#fed" : "#444"} />
      </mesh>
    </mesh>
  );
}

function GorillaModel({ position, alive }: { position: [number, number, number]; alive: boolean }) {
  return (
    <group position={position}>
      {/* Body */}
      <mesh position={[0, 0.9, 0]}>
        <sphereGeometry args={[1, 16, 14]} />
        <meshStandardMaterial color={alive ? "#222" : "#444"} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[0.65, 10, 10]} />
        <meshStandardMaterial color={alive ? "#333" : "#444"} />
      </mesh>
      {/* Arms */}
      <mesh position={[-1.1, 0.7, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 1.7, 8]} />
        <meshStandardMaterial color={alive ? "#222" : "#444"} />
      </mesh>
      <mesh position={[1.1, 0.7, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 1.7, 8]} />
        <meshStandardMaterial color={alive ? "#222" : "#444"} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.5, -0.7, 0]}>
        <cylinderGeometry args={[0.29, 0.29, 1.0, 8]} />
        <meshStandardMaterial color={alive ? "#222" : "#444"} />
      </mesh>
      <mesh position={[0.5, -0.7, 0]}>
        <cylinderGeometry args={[0.29, 0.29, 1.0, 8]} />
        <meshStandardMaterial color={alive ? "#222" : "#444"} />
      </mesh>
    </group>
  );
}

// --- Simulation Component ---
function BattleScene({ fighters }: { fighters: Fighter[] }) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[0, 10, 5]} intensity={1.1} />
      {/* Ground */}
      <mesh receiveShadow position={[0, -1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#568c43" />
      </mesh>
      {/* Fighters */}
      {fighters.map(f =>
        f.type === 'human' ?
          <HumanModel key={f.id} position={f.position} alive={f.alive} /> :
          <GorillaModel key={f.id} position={f.position} alive={f.alive} />
      )}
    </>
  );
}

// --- Main Simulator Logic ---
const SIM_SPEED = 40; // ms per simulation step

function GorillaBattleSimulator() {
  const [fighters, setFighters] = useState<Fighter[]>(() => initFighters());
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const simRef = useRef<NodeJS.Timeout | null>(null);

  // Start or restart simulation
  const startSim = () => {
    if (simRef.current) clearInterval(simRef.current);
    setFighters(initFighters());
    setResult(null);
    setRunning(true);
  };

  // Main simulation tick
  React.useEffect(() => {
    if (!running) {
      if (simRef.current) {
        clearInterval(simRef.current);
        simRef.current = null;
      }
      return;
    }

    function tick() {
      setFighters(prevFighters => {
        // Clone fighters for mutation
        const next = prevFighters.map(f => ({ ...f }));

        // 1. Find gorilla and all alive humans
        const gorilla = next.find(f => f.type === 'gorilla')!;
        const humans = next.filter(f => f.type === 'human' && f.alive);

        // If fight is over, stop sim
        if (!gorilla.alive || humans.length === 0) {
          setRunning(false);
          setResult(!gorilla.alive ? "Humans win! 🥳" : "Gorilla wins! 🦍");
          return next;
        }

        // 2. Gorilla acts: attacks nearest N humans within range (N=2-4, simulates multi-hit capability)
        if (gorilla.stamina > 0 && gorilla.alive) {
          let attackCount = Math.max(2, Math.floor(Math.random() * 3) + 2); // 2-4 attacks
          const targets = humans
            .map(h => ({ h, d: distance(gorilla.position, h.position) }))
            .filter(({ d }) => d < GORILLA_STATS.attackRange + 0.25)
            .sort((a, b) => a.d - b.d)
            .slice(0, attackCount)
            .map(obj => obj.h);

          targets.forEach(target => {
            if (target.alive) {
              const dmg = computeAttack(gorilla, target);
              target.health -= dmg;
              if (target.health <= 0) target.alive = false;
              gorilla.stamina -= 1 + Math.random(); // stamina drains per attack
            }
          });
        } else {
          // Gorilla rests to recover stamina
          gorilla.stamina = Math.min(GORILLA_STATS.stamina, gorilla.stamina + 2.5);
        }

        // 3. Humans act: up to 6 closest alive humans attack gorilla if in range (simulate group rushes)
        const attackers = humans
          .map(h => ({ h, d: distance(gorilla.position, h.position) }))
          .filter(({ d }) => d < HUMAN_STATS.attackRange + 0.15)
          .sort((a, b) => a.d - b.d)
          .slice(0, 6)
          .map(obj => obj.h);

        attackers.forEach(human => {
          if (gorilla.alive && human.stamina > 0 && human.alive) {
            const dmg = computeAttack(human, gorilla);
            gorilla.health -= dmg;
            if (gorilla.health <= 0) gorilla.alive = false;
            human.stamina -= 1 + Math.random() * 0.7; // stamina drains per attack
          }
        });

        // 4. Movement: alive humans not in range try to approach the gorilla
        humans.forEach(human => {
          if (
            human.alive &&
            distance(human.position, gorilla.position) > HUMAN_STATS.attackRange
          ) {
            const dir = [
              gorilla.position[0] - human.position[0],
              0,
              gorilla.position[2] - human.position[2],
            ];
            const len = Math.sqrt(dir[0] ** 2 + dir[2] ** 2);
            if (len > 0) {
              dir[0] /= len;
              dir[2] /= len;
              // Move by speed, but don't overshoot
              const moveDist = Math.min(HUMAN_STATS.speed * 0.13, len - HUMAN_STATS.attackRange + 0.1);
              human.position[0] += dir[0] * moveDist;
              human.position[2] += dir[2] * moveDist;
            }
            // Small stamina drain for running
            human.stamina = Math.max(0, human.stamina - 0.19);
          }
        });

        // 5. Gorilla may reposition (move randomly if stamina permits)
        if (gorilla.alive && gorilla.stamina > 10 && Math.random() < 0.18) {
          // Random sidestep
          gorilla.position[0] += (Math.random() - 0.5) * 1.2;
          gorilla.position[2] += (Math.random() - 0.5) * 1.2;
          gorilla.stamina -= 0.9;
        }

        // 6. Passive stamina regen for all alive
        next.forEach(f => {
          if (f.alive) {
            if (f.type === 'human') {
              f.stamina = Math.min(HUMAN_STATS.stamina, f.stamina + 0.2);
            } else {
              f.stamina = Math.min(GORILLA_STATS.stamina, f.stamina + 0.5);
            }
          }
        });

        return next;
      });
    }

    simRef.current = setInterval(tick, SIM_SPEED);

    return () => {
      if (simRef.current) clearInterval(simRef.current);
    };
  }, [running]);

  // Clean up interval on unmount
  React.useEffect(() => {
    return () => {
      if (simRef.current) clearInterval(simRef.current);
    };
  }, []);

  // UI
  const humansAlive = fighters.filter(f => f.type === 'human' && f.alive).length;
  const gorilla = fighters.find(f => f.type === 'gorilla')!;
  const gorillaAlive = gorilla.alive;

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#223" }}>
      <div style={{
        position: "absolute", top: 16, left: 16, zIndex: 10,
        background: "#fff8", borderRadius: 12, padding: 16,
        fontSize: "1.1rem",
      }}>
        <h2>100 Men vs 1 Gorilla Simulator</h2>
        <button onClick={startSim} style={{
          fontSize: "1.2rem", fontWeight: "bold", padding: "8px 16px",
          borderRadius: "8px", border: "none", background: "#4c8", color: "#fff",
          marginBottom: 8, cursor: "pointer"
        }}>
          {running ? "Restart Simulation" : "Start Simulation"}
        </button>
        <div>
          <strong>Gorilla:</strong> {gorillaAlive ? "🦍 Alive" : "💀 Dead"}<br />
          <strong>Health:</strong> {Math.max(0, Math.round(gorilla.health))} / {GORILLA_STATS.health}<br />
          <strong>Stamina:</strong> {Math.max(0, Math.round(gorilla.stamina))} / {GORILLA_STATS.stamina}
        </div>
        <div style={{ marginTop: 8 }}>
          <strong>Humans alive:</strong> {humansAlive} / {NUM_HUMANS}
        </div>
        {result && <div style={{ marginTop: 16, fontSize: "1.3rem", color: "#155" }}><strong>{result}</strong></div>}
        <div style={{ marginTop: 12, fontSize: "0.95em" }}>
          <b>Fight is simulated as accurately as possible given stats for power, stamina, and techniques.</b>
        </div>
      </div>
      <Canvas
        camera={{ position: [0, 18, 32], fov: 55 }}
        style={{ height: "100vh", width: "100vw", background: "#223" }}
        shadows
      >
        <OrbitControls maxPolarAngle={Math.PI / 2.1} minDistance={15} maxDistance={44} />
        <BattleScene fighters={fighters} />
      </Canvas>
    </div>
  );
}

export default GorillaBattleSimulator;