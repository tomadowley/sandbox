import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Basic stats for fighters, based on rough real-world averages.
 */
const GORILLA_STATS = {
  power: 500, // Arbitrary units, gorilla is ~5x stronger than a strong human
  stamina: 300,
  technique: 60, // Gorillas have brute force but less fighting technique
  hp: 1000,
  color: 0x222222,
};

const MAN_STATS = {
  power: 100, // Average strong adult male
  stamina: 100,
  technique: 80, // Some fighting ability but not trained
  hp: 100,
  color: 0xddddcc,
};

const NUM_MEN = 100;

type Fighter = {
  id: number;
  isGorilla: boolean;
  position: THREE.Vector3;
  hp: number;
  stamina: number;
  alive: boolean;
};

enum SimulationState {
  NotStarted,
  Running,
  Ended,
}

function getRandomPositionWithinRadius(radius: number, y = 0) {
  // For men: spawn in a circle around the gorilla
  const theta = Math.random() * 2 * Math.PI;
  const r = Math.random() * radius;
  return new THREE.Vector3(
    Math.cos(theta) * r,
    y,
    Math.sin(theta) * r
  );
}

function createInitialFighters(): Fighter[] {
  // Gorilla at center
  const fighters: Fighter[] = [
    {
      id: 0,
      isGorilla: true,
      position: new THREE.Vector3(0, 0, 0),
      hp: GORILLA_STATS.hp,
      stamina: GORILLA_STATS.stamina,
      alive: true,
    },
  ];
  // 100 men in a ring
  for (let i = 1; i <= NUM_MEN; ++i) {
    fighters.push({
      id: i,
      isGorilla: false,
      position: getRandomPositionWithinRadius(12, 0), // 12 units radius
      hp: MAN_STATS.hp,
      stamina: MAN_STATS.stamina,
      alive: true,
    });
  }
  return fighters;
}

/**
 * Simulate one step of the fight.
 * - Each living man attempts to attack the gorilla if in range.
 * - Gorilla attacks up to N men in range.
 * - Power, stamina, and technique affect hit/miss and damage.
 */
function simulateFightStep(fighters: Fighter[]): Fighter[] {
  const updated = fighters.map(f => ({ ...f }));
  const gorilla = updated[0];
  if (!gorilla.alive) return updated;

  // Find all living men
  const livingMen = updated.slice(1).filter(f => f.alive);

  // Each man moves closer if not in range, otherwise attacks
  livingMen.forEach(man => {
    if (!man.alive) return;
    const dist = man.position.distanceTo(gorilla.position);
    if (dist > 2.2) {
      // Move closer
      const direction = gorilla.position.clone().sub(man.position).normalize();
      man.position.add(direction.multiplyScalar(1.2)); // approach speed
    } else {
      // Attack gorilla
      if (man.stamina > 0 && Math.random() < man.stamina / 150) {
        // Chance to hit increases with stamina, technique
        const hitChance =
          0.2 + (MAN_STATS.technique / 100) * 0.5 + Math.random() * 0.3;
        if (Math.random() < hitChance) {
          // Successful hit
          const dmg =
            MAN_STATS.power * (0.7 + Math.random() * 0.6) * (man.stamina / 100);
          gorilla.hp -= dmg;
        }
        man.stamina -= 8 + Math.random() * 5;
        if (man.stamina < 0) man.stamina = 0;
      }
    }
  });

  // Gorilla attacks: can hit up to 5 men in melee range per step
  if (gorilla.stamina > 0 && gorilla.alive) {
    const inRange = livingMen.filter(
      man => man.position.distanceTo(gorilla.position) < 2.6
    );
    // Attack up to 5
    for (let i = 0; i < Math.min(5, inRange.length); ++i) {
      const man = inRange[i];
      // Hit chance is high
      if (Math.random() < 0.85) {
        const dmg =
          GORILLA_STATS.power *
          (0.8 + Math.random() * 0.6) *
          (gorilla.stamina / GORILLA_STATS.stamina);
        man.hp -= dmg;
        if (man.hp <= 0) {
          man.alive = false;
        }
      }
      gorilla.stamina -= 5 + Math.random() * 5;
      if (gorilla.stamina < 0) gorilla.stamina = 0;
    }
  }

  // Remove dead
  if (gorilla.hp <= 0) {
    gorilla.alive = false;
    gorilla.hp = 0;
  }

  updated.forEach(f => {
    if (!f.isGorilla && f.hp <= 0) {
      f.alive = false;
      f.hp = 0;
    }
  });

  return updated;
}

export default function GorillaVsMenSimulator() {
  const mountRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);

  const [simulationState, setSimulationState] = useState(SimulationState.NotStarted);
  const [fighters, setFighters] = useState<Fighter[]>(createInitialFighters());
  const [winner, setWinner] = useState<string | null>(null);

  // Three.js scene setup
  useEffect(() => {
    if (!mountRef.current) return;

    const width = 640;
    const height = 480;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);

    // Camera
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 18, 28);
    camera.lookAt(0, 0, 0);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.7);
    dirLight.position.set(0, 20, 10);
    scene.add(dirLight);

    // Floor
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(16, 40),
      new THREE.MeshLambertMaterial({ color: 0x77aa77 })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // Renderers
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.innerHTML = "";
    mountRef.current.appendChild(renderer.domElement);

    // Refs to meshes for updates
    const meshes: THREE.Mesh[] = [];

    function createMeshes() {
      // Remove previous
      meshes.forEach(m => scene.remove(m));
      meshes.length = 0;

      fighters.forEach(f => {
        if (!f.alive) return;
        let mesh: THREE.Mesh;
        if (f.isGorilla) {
          mesh = new THREE.Mesh(
            new THREE.SphereGeometry(1.5, 18, 18),
            new THREE.MeshLambertMaterial({
              color: GORILLA_STATS.color,
              emissive: 0x111111,
            })
          );
        } else {
          mesh = new THREE.Mesh(
            new THREE.SphereGeometry(0.5, 14, 14),
            new THREE.MeshLambertMaterial({ color: MAN_STATS.color })
          );
        }
        mesh.position.copy(f.position);
        scene.add(mesh);
        meshes.push(mesh);
      });
    }

    createMeshes();

    let animId: number;
    function animate() {
      // Update mesh positions
      meshes.forEach((mesh, idx) => {
        const f = fighters.filter(f => f.alive)[idx];
        if (f) {
          mesh.position.copy(f.position);
        }
      });
      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      cancelAnimationFrame(animId);
      renderer.dispose();
      meshes.forEach(m => m.geometry.dispose());
      mountRef.current && (mountRef.current.innerHTML = "");
    };
    // Re-create scene when fighters change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fighters]);

  // Simulation loop
  useEffect(() => {
    if (simulationState !== SimulationState.Running) return;
    let stopped = false;

    function runStep() {
      setFighters(prevFighters => {
        const next = simulateFightStep(prevFighters);

        const gorillaAlive = next[0].alive;
        const menAlive = next.slice(1).some(f => f.alive);

        if (!gorillaAlive && !winner) {
          setWinner("The 100 men have defeated the gorilla!");
          setSimulationState(SimulationState.Ended);
          stopped = true;
        } else if (!menAlive && !winner) {
          setWinner("The gorilla has defeated all 100 men!");
          setSimulationState(SimulationState.Ended);
          stopped = true;
        }
        return next;
      });

      if (!stopped) {
        animationRef.current = window.setTimeout(runStep, 120); // slow motion for visibility
      }
    }
    animationRef.current = window.setTimeout(runStep, 120);

    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulationState]);

  // Start/restart handler
  function handleStart() {
    setFighters(createInitialFighters());
    setWinner(null);
    setSimulationState(SimulationState.Running);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h2>100 Men vs 1 Gorilla Simulator</h2>
      <div ref={mountRef} style={{ margin: 12, border: "2px solid #888", borderRadius: 10, background: "#eee" }} />
      <button onClick={handleStart} style={{ fontSize: "1.1rem", padding: "8px 24px" }}>
        {simulationState === SimulationState.Running ? "Restart Simulation" : "Start Simulation"}
      </button>
      <div style={{ marginTop: 12, minHeight: 32 }}>
        {simulationState === SimulationState.Ended && winner && (
          <b style={{ color: "#333" }}>{winner}</b>
        )}
      </div>
      <div style={{ marginTop: 16, width: 420, textAlign: "left", fontSize: "0.93rem" }}>
        <b>Legend:</b>
        <br />
        <span style={{ color: "#222" }}>● Gorilla (large dark sphere)</span>
        <br />
        <span style={{ color: "#7c7c7c" }}>● Men (small light spheres)</span>
        <br />
        <b>Simulation:</b> Power, stamina, and technique determine hit, damage, and outcome. The gorilla is vastly stronger but outnumbered.
      </div>
    </div>
  );
}