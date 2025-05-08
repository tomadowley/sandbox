import React, { useRef, useState, useMemo, useCallback } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Html, Stats, Sky } from "@react-three/drei";
import "./App.css";

// Parameters
const NUM_GORILLAS = 100;
const MAN_HP = 400;
const GORILLA_HP = 16;
const ATTACK_DAMAGE_MAN = [2, 3, 5, 8];
const ATTACK_DAMAGE_GORILLA = [1, 2, 3, 4, 5, 6];
const ANIMATION_SPEED = 0.08; // general animation speed
const FIGHT_RADIUS = 20;
const GORILLA_BODY_COLOR = "#333";
const MAN_BODY_COLOR = "#f3c07a";

type Fighter = {
  id: number;
  type: "gorilla" | "man";
  hp: number;
  maxHp: number;
  alive: boolean;
  pos: [number, number, number];
  anim: {
    t: number; // animation phase (0-1)
    move: "idle" | "attack" | "hit" | "celebrate";
    direction: [number, number, number]; // for attacks
  };
};

function getRandomPosOnCircle(radius: number, idx: number, total: number) {
  // Space gorillas in a circle
  const angle = (idx / total) * Math.PI * 2;
  return [Math.cos(angle) * radius, 0, Math.sin(angle) * radius] as [number, number, number];
}

function randomAttackDamage(type: "gorilla" | "man") {
  if (type === "gorilla")
    return GORILLA_HP === 1
      ? 1
      : ATTACK_DAMAGE_GORILLA[Math.floor(Math.random() * ATTACK_DAMAGE_GORILLA.length)];
  else
    return ATTACK_DAMAGE_MAN[Math.floor(Math.random() * ATTACK_DAMAGE_MAN.length)];
}

function randomFightingMove(type: "gorilla" | "man") {
  // Just a stub for now, could map to animation choices
  if (type === "gorilla") {
    const moves = ["punch", "smash", "double fist", "bite"];
    return moves[Math.floor(Math.random() * moves.length)];
  } else {
    const moves = ["kick", "punch", "dodge", "headbutt", "roll"];
    return moves[Math.floor(Math.random() * moves.length)];
  }
}

function Gorilla({
  fighter,
  targetPos,
  highlight,
}: {
  fighter: Fighter;
  targetPos: [number, number, number];
  highlight: boolean;
}) {
  // Simple animated gorilla: body, head, arms, legs
  const ref = useRef<any>();
  useFrame(() => {
    if (!ref.current) return;
    // Animate (attack = lunge, hit = flinch)
    if (fighter.anim.move === "attack") {
      // Lunge toward the man
      ref.current.position.lerp(
        [
          (fighter.pos[0] + targetPos[0]) / 2,
          0,
          (fighter.pos[2] + targetPos[2]) / 2,
        ],
        fighter.anim.t
      );
    } else if (fighter.anim.move === "hit") {
      // Quick back
      ref.current.position.lerp(
        [
          fighter.pos[0] + fighter.anim.direction[0] * 1.5,
          0,
          fighter.pos[2] + fighter.anim.direction[2] * 1.5,
        ],
        fighter.anim.t
      );
    } else {
      // Idle position
      ref.current.position.set(...fighter.pos);
    }
  });
  return (
    <group ref={ref}>
      {/* Body */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.8, 1, 2.6, 14]} />
        <meshStandardMaterial color={highlight ? "gold" : GORILLA_BODY_COLOR} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      {/* Arms */}
      <mesh position={[-1, 0.7, 0]}>
        <cylinderGeometry args={[0.27, 0.27, 2, 12]} />
        <meshStandardMaterial color={GORILLA_BODY_COLOR} />
      </mesh>
      <mesh position={[1, 0.7, 0]}>
        <cylinderGeometry args={[0.27, 0.27, 2, 12]} />
        <meshStandardMaterial color={GORILLA_BODY_COLOR} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.4, -1.4, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 1.1, 12]} />
        <meshStandardMaterial color={GORILLA_BODY_COLOR} />
      </mesh>
      <mesh position={[0.4, -1.4, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 1.1, 12]} />
        <meshStandardMaterial color={GORILLA_BODY_COLOR} />
      </mesh>
    </group>
  );
}

function Man({
  fighter,
  highlight,
}: {
  fighter: Fighter;
  highlight: boolean;
}) {
  const ref = useRef<any>();
  useFrame(() => {
    if (!ref.current) return;
    if (fighter.anim.move === "attack") {
      // Lunge forward
      ref.current.position.lerp(
        [
          0,
          0,
          0.5 + Math.sin(fighter.anim.t * Math.PI) * 2.8,
        ],
        fighter.anim.t
      );
    } else if (fighter.anim.move === "hit") {
      // Flinch back
      ref.current.position.lerp([0, 0, -1.5], fighter.anim.t);
    } else {
      ref.current.position.set(0, 0, 0);
    }
  });
  // Simple man: body, head, arms, legs
  return (
    <group ref={ref}>
      {/* Body */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.55, 2.2, 16]} />
        <meshStandardMaterial color={highlight ? "red" : MAN_BODY_COLOR} />
      </mesh>
      {/* Head */}
      <mesh position={[0, 1.2, 0]}>
        <sphereGeometry args={[0.48, 14, 14]} />
        <meshStandardMaterial color="#ffdeac" />
      </mesh>
      {/* Arms */}
      <mesh position={[-0.63, 0.6, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 1.2, 10]} />
        <meshStandardMaterial color={MAN_BODY_COLOR} />
      </mesh>
      <mesh position={[0.63, 0.6, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 1.2, 10]} />
        <meshStandardMaterial color={MAN_BODY_COLOR} />
      </mesh>
      {/* Legs */}
      <mesh position={[-0.2, -1.1, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 1.2, 10]} />
        <meshStandardMaterial color={MAN_BODY_COLOR} />
      </mesh>
      <mesh position={[0.2, -1.1, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 1.2, 10]} />
        <meshStandardMaterial color={MAN_BODY_COLOR} />
      </mesh>
    </group>
  );
}

function getDirection(from: [number, number, number], to: [number, number, number]) {
  const dx = to[0] - from[0];
  const dz = to[2] - from[2];
  const len = Math.sqrt(dx * dx + dz * dz);
  if (len === 0) return [0, 0, 0];
  return [dx / len, 0, dz / len];
}

function useFightSimulation(restartTrigger: number) {
  // All state for man and gorillas
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [manDead, setManDead] = useState(false);
  const [gorillasDead, setGorillasDead] = useState(0);
  const [round, setRound] = useState(0);
  const [attackerIdx, setAttackerIdx] = useState(0);
  const [fightLog, setFightLog] = useState<string[]>([]);
  const [fighting, setFighting] = useState(true);

  // Initialize fighters
  React.useEffect(() => {
    // 1 man at center
    const man: Fighter = {
      id: 0,
      type: "man",
      hp: MAN_HP,
      maxHp: MAN_HP,
      alive: true,
      pos: [0, 0, 0],
      anim: { t: 0, move: "idle", direction: [0, 0, 0] },
    };
    // 100 gorillas in a circle
    const gorillas: Fighter[] = [];
    for (let i = 0; i < NUM_GORILLAS; ++i) {
      gorillas.push({
        id: i + 1,
        type: "gorilla",
        hp: GORILLA_HP,
        maxHp: GORILLA_HP,
        alive: true,
        pos: getRandomPosOnCircle(FIGHT_RADIUS, i, NUM_GORILLAS),
        anim: { t: 0, move: "idle", direction: [0, 0, 0] },
      });
    }
    setFighters([man, ...gorillas]);
    setManDead(false);
    setGorillasDead(0);
    setRound(0);
    setAttackerIdx(0);
    setFightLog([]);
    setFighting(true);
  }, [restartTrigger]);

  // Fight loop
  React.useEffect(() => {
    if (!fighting) return;
    if (manDead || gorillasDead === NUM_GORILLAS) {
      setFighting(false);
      return;
    }

    // Next attack after a delay for animation
    const attackTimeout = setTimeout(() => {
      setFighters((prev) => {
        // Find next attacker (alive)
        let idx = attackerIdx;
        let attacker = prev[idx];
        let defender: Fighter;
        if (attacker.type === "man") {
          // Attack a random alive gorilla
          const gorillaChoices = prev.filter((f) => f.type === "gorilla" && f.alive);
          if (gorillaChoices.length === 0) return prev;
          defender = gorillaChoices[Math.floor(Math.random() * gorillaChoices.length)];
        } else {
          // Gorilla attacks man
          defender = prev[0];
        }
        // Only alive can attack
        if (!attacker.alive || !defender.alive) {
          // Skip to next
          setAttackerIdx((idx + 1) % prev.length);
          setRound((r) => r + 1);
          return prev;
        }

        // Animate attacker
        const attackerMove = randomFightingMove(attacker.type);
        const defenderMove = randomFightingMove(defender.type);
        const attackDir = getDirection(attacker.pos, defender.pos);

        // Animate attack
        attacker.anim = { t: 0, move: "attack", direction: attackDir };
        defender.anim = { t: 0, move: "hit", direction: [-attackDir[0], 0, -attackDir[2]] };

        // Compute damage
        const dmg = randomAttackDamage(attacker.type);

        // Update HP and log
        const updated = prev.map((f) => {
          if (f.id === defender.id) {
            const newHp = Math.max(0, f.hp - dmg);
            return {
              ...f,
              hp: newHp,
              alive: newHp > 0,
              anim: { ...f.anim, move: "hit", t: 0, direction: f.anim.direction },
            };
          }
          if (f.id === attacker.id) {
            return {
              ...f,
              anim: { ...f.anim, move: "attack", t: 0, direction: attackDir },
            };
          }
          return f;
        });

        // Log text
        setFightLog((log) => [
          `${attacker.type === "man" ? "The man" : `Gorilla ${attacker.id}`} uses ${attackerMove} on ${
            defender.type === "man" ? "the man" : `gorilla ${defender.id}`
          } with ${dmg} damage!`,
          ...log,
        ].slice(0, 6));

        // Death check
        if (defender.type === "man" && defender.hp - dmg <= 0) {
          setManDead(true);
        }
        if (defender.type === "gorilla" && defender.hp - dmg <= 0) {
          setGorillasDead((g) => g + 1);
        }

        // Next attacker
        setAttackerIdx((idx + 1) % prev.length);
        setRound((r) => r + 1);

        return updated;
      });
    }, 650); // time for animation
    return () => clearTimeout(attackTimeout);
    // eslint-disable-next-line
  }, [attackerIdx, fighting]);

  // Animate phases
  useFrame(() => {
    setFighters((prev) =>
      prev.map((f) => {
        let t = f.anim.t;
        if (f.anim.move === "idle") return f;
        t += ANIMATION_SPEED;
        if (t >= 1) {
          return { ...f, anim: { ...f.anim, t: 0, move: "idle" } };
        } else {
          return { ...f, anim: { ...f.anim, t } };
        }
      })
    );
  });

  return {
    fighters,
    manDead,
    gorillasDead,
    fighting,
    round,
    fightLog,
  };
}

function HealthBar({ value, max, width = 80, color = "green" }: { value: number, max: number, width?: number, color?: string }) {
  const pct = Math.max(0, value / max);
  return (
    <div style={{
      width,
      height: 8,
      background: "#222",
      border: "1px solid #555",
      borderRadius: 4,
      margin: "2px 0"
    }}>
      <div style={{
        width: Math.round(pct * width),
        height: 8,
        background: color,
        borderRadius: 4,
        transition: "width 0.2s"
      }} />
    </div>
  );
}

function OverlayUI({ man, gorillas, manDead, gorillasDead, fighting, round, onRestart, fightLog }: any) {
  return (
    <div className="overlay-ui">
      <h2>100 Gorillas vs 1 Man</h2>
      <div>
        <b>The Man</b><br />
        <HealthBar value={man.hp} max={man.maxHp} color="red" width={110} />
        <span>HP: {man.hp}/{man.maxHp}</span>
      </div>
      <div style={{marginTop: 8}}>
        <b>Gorillas (alive): {gorillas.filter((g: Fighter) => g.alive).length} / {gorillas.length}</b><br />
        <span>Dead Gorillas: {gorillasDead}</span>
      </div>
      <div style={{marginTop: 8}}>
        <b>Round: {round}</b>
      </div>
      <button onClick={onRestart} style={{marginTop: 12, fontSize:18}}>Restart Simulation</button>
      <div style={{marginTop: 16, background: "#222b", padding: 6, borderRadius: 4, minHeight: 40}}>
        <b>Latest Fights:</b>
        <ul style={{margin: 0, padding: 0, listStyle: 'none', fontSize: 13}}>
          {fightLog.map((line: string, idx: number) => (
            <li key={idx}>• {line}</li>
          ))}
        </ul>
      </div>
      {(manDead || gorillasDead === gorillas.length) && (
        <div style={{marginTop: 18, color: manDead ? "crimson" : "lime", fontWeight: "bold", fontSize: 22}}>
          {manDead ? "THE MAN HAS FALLEN! GORILLAS WIN!" : "ALL GORILLAS DEFEATED! THE MAN WINS!"}
        </div>
      )}
    </div>
  );
}

function FightSim3D() {
  const [restartKey, setRestartKey] = useState(0);
  const { fighters, manDead, gorillasDead, fighting, round, fightLog } = useFightSimulation(restartKey);

  const man = fighters[0];
  const gorillas = fighters.slice(1);

  const handleRestart = useCallback(() => {
    setRestartKey((k) => k + 1);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#181d1f" }}>
      <Canvas shadows camera={{ position: [0, 30, 50], fov: 60 }}>
        <ambientLight intensity={0.9} />
        <directionalLight
          position={[30, 40, 20]}
          intensity={0.7}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <Sky sunPosition={[50, 30, 25]} turbidity={0.7} />
        <group>
          {/* Gorillas */}
          {gorillas.map((g, i) =>
            g.alive ? (
              <Gorilla
                key={g.id}
                fighter={g}
                targetPos={man.pos}
                highlight={false}
              />
            ) : null
          )}
          {/* Man */}
          {man.alive && (
            <Man
              fighter={man}
              highlight={false} />
          )}
        </group>
        {/* Ground */}
        <mesh receiveShadow position={[0, -1.6, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[90, 90]} />
          <meshStandardMaterial color="#526b37" />
        </mesh>
        <OrbitControls target={[0, 0, 0]} maxPolarAngle={Math.PI / 2.05} />
        <Stats />
        <Html position={[-35, 15, 0]} transform distanceFactor={22} zIndexRange={[2, 2]}>
          <OverlayUI
            man={man}
            gorillas={gorillas}
            manDead={manDead}
            gorillasDead={gorillasDead}
            fighting={fighting}
            round={round}
            onRestart={handleRestart}
            fightLog={fightLog}
          />
        </Html>
      </Canvas>
    </div>
  );
}

function App() {
  return <FightSim3D />;
}

export default App;
