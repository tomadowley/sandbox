import React, { useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stats } from "@react-three/drei";
import { Physics, useBox, usePlane } from "@react-three/cannon";
import * as THREE from "three";
import * as dat from "dat.gui";
import StatsJS from "stats.js";

// 1. Ground plane component for physics
import { Mesh } from "three";

function Plane(props: any) {
  const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], ...props }));
  return (
    <mesh ref={ref as React.Ref<Mesh>} receiveShadow>
      <planeGeometry args={[10, 10]} />
      <meshStandardMaterial color="#888" />
    </mesh>
  );
}

// 2. Box component with physics and dat.GUI integration
function PhysicsBox(props: any) {
  const [ref, api] = useBox(() => ({ mass: props.mass, position: props.position }));

  // dat.GUI integration for live controls
  useEffect(() => {
    const gui = new dat.GUI();
    const params = {
      posX: props.position[0],
      posY: props.position[1],
      posZ: props.position[2],
      color: "#ff005b",
      reset: () => api.position.set(...props.position),
    };

    gui.add(params, "posX", -5, 5).onChange((v: number) => api.position.set(v, params.posY, params.posZ));
    gui.add(params, "posY", 0, 10).onChange((v: number) => api.position.set(params.posX, v, params.posZ));
    gui.add(params, "posZ", -5, 5).onChange((v: number) => api.position.set(params.posX, params.posY, v));
    gui.addColor(params, "color");
    gui.add(params, "reset");
    return () => gui.destroy();
  }, [api, props.position]);

  return (
    <mesh ref={ref as React.Ref<Mesh>} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#ff005b" />
    </mesh>
  );
}

// 3. Custom component for displaying stats.js overlay (outside Canvas)
function StatsOverlay() {
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stats = new StatsJS();
    stats.showPanel(0); // 0: fps
    if (statsRef.current) {
      statsRef.current.appendChild(stats.dom);
    }
    let id: number;
    const animate = () => {
      stats.begin();
      stats.end();
      id = requestAnimationFrame(animate);
    };
    animate();
    return () => {
      cancelAnimationFrame(id);
      stats.dom.remove();
    };
  }, []);

  return <div ref={statsRef} style={{ position: "absolute", top: 0, left: 0, zIndex: 1000 }} />;
}

const Engine3D: React.FC = () => {
  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <StatsOverlay />
      <Canvas shadows camera={{ position: [4, 4, 4], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.3}
          penumbra={1}
          intensity={2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <Physics>
          <Plane />
          <PhysicsBox mass={1} position={[0, 5, 0]} />
        </Physics>
        <OrbitControls />
        <Stats />
      </Canvas>
    </div>
  );
};

export default Engine3D;