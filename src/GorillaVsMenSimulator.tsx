import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Basic stats for fighters, based on rough real-world averages.
 */
const GORILLA_STATS = {
  power: 700, // Stronger
  stamina: 400, // More stamina
  technique: 70, // Slightly better technique
  hp: 1600,      // More HP
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
  recentAttack?: boolean; // true for a few frames after attacking or being attacked
  armSwingAngle?: number; // for animation frame
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
  const updated = fighters.map(f => ({ ...f, recentAttack: false, armSwingAngle: 0 }));
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
      man.position.add(direction.multiplyScalar(1.0)); // approach speed (slower for more drama)
      man.armSwingAngle = 0;
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
          gorilla.recentAttack = true;
        }
        man.stamina -= 8 + Math.random() * 5;
        if (man.stamina < 0) man.stamina = 0;
        man.recentAttack = true;
        man.armSwingAngle = Math.PI / 1.5;
      }
    }
  });

  // Gorilla attacks: can hit up to 6 men in melee range per step
  if (gorilla.stamina > 0 && gorilla.alive) {
    const inRange = livingMen.filter(
      man => man.position.distanceTo(gorilla.position) < 2.6
    );
    // Attack up to 6 for more spectacle
    for (let i = 0; i < Math.min(6, inRange.length); ++i) {
      const man = inRange[i];
      // Hit chance is high
      if (Math.random() < 0.92) {
        const dmg =
          GORILLA_STATS.power *
          (0.8 + Math.random() * 0.6) *
          (gorilla.stamina / GORILLA_STATS.stamina);
        man.hp -= dmg;
        if (man.hp <= 0) {
          man.alive = false;
        }
        man.recentAttack = true;
      }
      gorilla.stamina -= 6 + Math.random() * 5;
      if (gorilla.stamina < 0) gorilla.stamina = 0;
      gorilla.recentAttack = true;
      gorilla.armSwingAngle = Math.PI / 1.4;
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

    // Add a gentle sky gradient background
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, '#b8e2ff');
    grad.addColorStop(1, '#e9f8fe');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 256);
    const skyTex = new THREE.Texture(canvas);
    skyTex.needsUpdate = true;
    scene.background = skyTex;

    // Camera: constant orbit mode!
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    // All multi-camera logic removed; position set in animate().
  // <-- This closing bracket was likely missing to properly end the Three.js setup effect

    // Lights (brighter, more dramatic)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.1);
    dirLight.position.set(10, 23, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    // Floor (darker, subtle pattern)
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x6b8e5e, metalness: 0.16, roughness: 0.68 });
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(16, 50),
      floorMat
    );
    floor.receiveShadow = true;
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // Add a subtle ring boundary to the arena
    const ringGeom = new THREE.RingGeometry(15.3, 16, 60);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, opacity: 0.18, transparent: true });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.01;
    scene.add(ring);

    // Add "shadow" under fighters for depth
    const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.18 });
    function addShadow(group: THREE.Group, y = 0.02, r = 0.4) {
      const shadow = new THREE.Mesh(
        new THREE.CircleGeometry(r, 20),
        shadowMat
      );
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = y;
      group.add(shadow);
    }

    // Renderers
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.innerHTML = "";
    mountRef.current.appendChild(renderer.domElement);

    // Over-the-top animation state
    let shockwaveMesh: THREE.Mesh | null = null;
    let shockwaveAge = 0;
    let flashIntensity = 0;

    // Refs to objects for updates (can be Mesh or Group)
    const meshes: THREE.Object3D[] = [];

    function createMeshes() {
      // Remove previous
      meshes.forEach(m => scene.remove(m));
      meshes.length = 0;

      fighters.forEach(f => {
        if (!f.alive) return;

        let group = new THREE.Group();
        // Health bar
        const maxHp = f.isGorilla ? GORILLA_STATS.hp : MAN_STATS.hp;
        const hpRatio = Math.max(0, Math.min(1, f.hp / maxHp));
        const barColor = new THREE.Color().lerpColors(
          new THREE.Color(0xff0000),
          new THREE.Color(0x00ff00),
          hpRatio
        );
        const barGeometry = new THREE.BoxGeometry(f.isGorilla ? 2.4 : 0.7, 0.13, 0.13);
        const barMaterial = new THREE.MeshBasicMaterial({ color: barColor });
        const barMesh = new THREE.Mesh(barGeometry, barMaterial);
        barMesh.position.set(0, f.isGorilla ? 3.7 : 1.25, 0);
        barMesh.scale.x = hpRatio;
        group.add(barMesh);

        // Add a soft shadow under each fighter
        addShadow(group, 0.02, f.isGorilla ? 1.05 : 0.38);

        if (f.isGorilla) {
          // Gorilla: bulkier, more imposing, darker, "heroic" posture
          // Body
          const body = new THREE.Mesh(
            new THREE.SphereGeometry(1.5, 30, 30),
            new THREE.MeshStandardMaterial({ color: GORILLA_STATS.color, roughness: 0.38, metalness: 0.17 })
          );
          body.position.set(0, 1.7, 0);
          group.add(body);
          // Chest
          const chest = new THREE.Mesh(
            new THREE.SphereGeometry(0.8, 18, 18),
            new THREE.MeshStandardMaterial({ color: 0x2c2c2c, roughness: 0.32, metalness: 0.09 })
          );
          chest.position.set(0, 2.4, 0.17);
          chest.scale.x = 1.18;
          group.add(chest);
          // Head
          const head = new THREE.Mesh(
            new THREE.SphereGeometry(0.9, 20, 20),
            new THREE.MeshStandardMaterial({ color: 0x0d0d0d, roughness: 0.28, metalness: 0.15 })
          );
          head.position.set(0, 3.07, 0.17);
          group.add(head);
          // "Face" spot
          const face = new THREE.Mesh(
            new THREE.SphereGeometry(0.36, 10, 10),
            new THREE.MeshStandardMaterial({ color: 0x56515b, roughness: 0.14, metalness: 0.25 })
          );
          face.position.set(0, 3.18, 0.6);
          group.add(face);
          // Arms (upper/lower)
          for (let side of [-1, 1]) {
            const upperArm = new THREE.Mesh(
              new THREE.CylinderGeometry(0.32, 0.38, 1.7, 13),
              new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.24, metalness: 0.13 })
            );
            upperArm.position.set(1.05 * side, 2.2, -0.08);
            // Animate arm swing on attack
            upperArm.rotation.z = (Math.PI / 7) * side + (f.armSwingAngle || 0) * side;
            upperArm.rotation.x = Math.PI / 12;
            group.add(upperArm);

            const lowerArm = new THREE.Mesh(
              new THREE.CylinderGeometry(0.24, 0.31, 1.45, 13),
              new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.24, metalness: 0.13 })
            );
            lowerArm.position.set(1.72 * side, 1.36, 0.03);
            lowerArm.rotation.z = (Math.PI / 10) * side + (f.armSwingAngle || 0) * side * 0.8;
            lowerArm.rotation.x = Math.PI / 14;
            group.add(lowerArm);

            // Fist
            const fist = new THREE.Mesh(
              new THREE.SphereGeometry(0.32, 11, 11),
              new THREE.MeshStandardMaterial({ color: 0x1a1417, roughness: 0.18, metalness: 0.22 })
            );
            fist.position.set(2.22 * side, 0.79, 0.03);
            group.add(fist);
          }
          // Legs
          for (let side of [-1, 1]) {
            const upperLeg = new THREE.Mesh(
              new THREE.CylinderGeometry(0.41, 0.30, 1.35, 14),
              new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.22, metalness: 0.11 })
            );
            upperLeg.position.set(0.53 * side, 0.65, 0.089);
            upperLeg.rotation.z = Math.PI / 17 * side;
            group.add(upperLeg);
            // Feet
            const foot = new THREE.Mesh(
              new THREE.SphereGeometry(0.22, 9, 9),
              new THREE.MeshStandardMaterial({ color: 0x191919, roughness: 0.22, metalness: 0.09 })
            );
            foot.position.set(0.53 * side, 0.02, 0.28);
            group.add(foot);
          }
          // If recently attacked, flash
          if (f.recentAttack) {
            body.material = new THREE.MeshStandardMaterial({ color: 0x991111, emissive: 0x330000 });
            head.material = new THREE.MeshStandardMaterial({ color: 0x991111, emissive: 0x330000 });
            chest.material = new THREE.MeshStandardMaterial({ color: 0x991111, emissive: 0x330000 });
          }
        } else {
          // Man: stick figure with pants/shirt color, various head colors
          // Pants
          const pants = new THREE.Mesh(
            new THREE.CylinderGeometry(0.18, 0.18, 0.36, 8),
            new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.25 })
          );
          pants.position.set(0, 0.67, 0);
          group.add(pants);
          // Body (shirt)
          const body = new THREE.Mesh(
            new THREE.CylinderGeometry(0.18, 0.18, 0.38, 8),
            new THREE.MeshStandardMaterial({ color: 0x7ecbe7, roughness: 0.33 })
          );
          body.position.set(0, 0.92, 0);
          group.add(body);
          // Head
          const headColors = [0xf5e3c3, 0xeac086, 0xb68e61, 0x9b6a3f, 0x7a4d27];
          const headColor = headColors[f.id % headColors.length];
          const head = new THREE.Mesh(
            new THREE.SphereGeometry(0.23, 10, 10),
            new THREE.MeshStandardMaterial({ color: headColor, roughness: 0.21 })
          );
          head.position.set(0, 1.28, 0);
          group.add(head);
          // Arms
          for (let side of [-1, 1]) {
            const arm = new THREE.Mesh(
              new THREE.CylinderGeometry(0.08, 0.07, 0.6, 7),
              new THREE.MeshStandardMaterial({ color: 0xddc8b0, roughness: 0.19 })
            );
            arm.position.set(0.23 * side, 1.07, 0);
            // Animate arm swing on attack
            arm.rotation.z = (Math.PI / 3) * side + (f.armSwingAngle || 0) * side;
            group.add(arm);
          }
          // Legs
          for (let side of [-1, 1]) {
            const leg = new THREE.Mesh(
              new THREE.CylinderGeometry(0.09, 0.08, 0.34, 7),
              new THREE.MeshStandardMaterial({ color: 0x2c3e50, roughness: 0.25 })
            );
            leg.position.set(0.12 * side, 0.5, 0);
            leg.rotation.z = Math.PI / 18 * side;
            group.add(leg);
          }
          // If recently attacked, flash
          if (f.recentAttack) {
            body.material = new THREE.MeshStandardMaterial({ color: 0x991111 });
            head.material = new THREE.MeshStandardMaterial({ color: 0x991111 });
          }
        }
        group.position.copy(f.position);
        scene.add(group);
        meshes.push(group);
      });
    }

    createMeshes();

    let animId: number;
    function animate() {
      // Camera orbits smoothly around the arena at all times
      const t = Date.now() * 0.00022; // slightly faster orbit for more action
      const radius = 25;
      const yBase = 11.5, yVar = 3.2;
      const height = yBase + Math.cos(Date.now() * 0.00010) * yVar;
      camera.position.set(
        Math.cos(t) * radius,
        height,
        Math.sin(t) * radius
      );
      camera.lookAt(0, 1.3, 0);
      ...f,
          // Diminish arm swing after each step
          armSwingAngle: f.armSwingAngle ? f.armSwingAngle * 0.6 : 0,
          recentAttack: f.recentAttack ? true : false,
        }));
      });

      // Camera is always orbiting -- all pose/switch logic is gone!

      if (!stopped) {
        animationRef.current = window.setTimeout(runStep, 350); // slower for more drama
      }
    }
    // Only attach the shockwave handler for dramatic effects
    (window as any).addShockwave = () => {
      if (!shockwaveMesh) {
        const shockGeom = new THREE.RingGeometry(2.2, 2.7, 35);
        const shockMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25 });
        shockwaveMesh = new THREE.Mesh(shockGeom, shockMat);
        shockwaveMesh.position.y = 0.04;
        scene.add(shockwaveMesh);
        shockwaveAge = 0;
        flashIntensity = 1;
      }
    };

    animationRef.current = window.setTimeout(runStep, 350);

    return () => {
      if (animationRef.current) clearTimeout(animationRef.current);
      (window as any).addShockwave = undefined;
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
        <span style={{ color: "#222" }}>● Gorilla (large dark figure)</span>
        <br />
        <span style={{ color: "#7c7c7c" }}>● Men (simple stick figures, blue shirts)</span>
        <br />
        <b>Simulation:</b> Now with over-the-top action: Fighters swing, fly, shockwaves and flashes explode on big hits, and the camera swoops for max drama!
      </div>
    </div>
  );
}