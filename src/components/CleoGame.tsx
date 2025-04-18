import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Position, Size } from '../types';

interface GameState {
  score: number;
  highScore: number;
  level: number;
  lives: number;
  gameOver: boolean;
  gameStarted: boolean;
  paused: boolean;
}

const CleoGame: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    highScore: 0,
    level: 1,
    lives: 3,
    gameOver: false,
    gameStarted: false,
    paused: false
  });
  const [countdown, setCountdown] = useState(3);
  const [message, setMessage] = useState("Help Cleo collect poppadoms and avoid Evil Joe!");

  // Game refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const clockRef = useRef<THREE.Clock | null>(null);
  const frameIdRef = useRef<number>(0);
  const controlsRef = useRef<OrbitControls | null>(null);
  
  // Game objects
  const cleoRef = useRef<THREE.Group | null>(null);
  const joeRef = useRef<THREE.Group | null>(null);
  const poppadomsRef = useRef<THREE.Mesh[]>([]);
  const obstaclesRef = useRef<THREE.Mesh[]>([]);
  const platformsRef = useRef<THREE.Mesh[]>([]);
  
  // Game mechanics
  const velocityRef = useRef({ x: 0, y: 0, z: 0 });
  const keysRef = useRef<{ [key: string]: boolean }>({});
  const joeTargetRef = useRef<THREE.Vector3>(new THREE.Vector3());
  const difficultyRef = useRef(1);
  const joeAttackCooldownRef = useRef(0);
  const worldSizeRef = useRef({ width: 50, depth: 50, height: 20 });
  const gameStateRef = useRef(gameState);
  
  // Initialize Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;
    
    // Create scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // Sky blue
    sceneRef.current = scene;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      1000
    );
    camera.position.set(0, 20, 30);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;
    
    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 10;
    controls.maxDistance = 60;
    controls.maxPolarAngle = Math.PI / 2 - 0.1;
    controls.enabled = false; // Disable until game starts
    controlsRef.current = controls;
    
    // Create lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(20, 30, 20);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.left = -50;
    directionalLight.shadow.camera.right = 50;
    directionalLight.shadow.camera.top = 50;
    directionalLight.shadow.camera.bottom = -50;
    scene.add(directionalLight);
    
    // Create floor
    const floorGeometry = new THREE.PlaneGeometry(
      worldSizeRef.current.width * 2, 
      worldSizeRef.current.depth * 2
    );
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x8ba349, // Grass green
      side: THREE.DoubleSide,
      roughness: 0.8
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.5;
    floor.receiveShadow = true;
    scene.add(floor);
    
    // Create game boundaries
    createBoundaries();
    
    // Initialize clock
    clockRef.current = new THREE.Clock();
    
    // Create Cleo character
    createCleo();
    
    // Create Evil Joe
    createJoe();
    
    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return;
      
      cameraRef.current.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Keyboard event handlers
    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.key] = true;
      
      // Start game with Enter
      if (e.key === 'Enter' && !gameStateRef.current.gameStarted && !gameStateRef.current.gameOver) {
        startGame();
      }
      
      // Restart with Enter when game is over
      if (e.key === 'Enter' && gameStateRef.current.gameOver) {
        restartGame();
      }
      
      // Pause/unpause with P
      if (e.key === 'p' && gameStateRef.current.gameStarted && !gameStateRef.current.gameOver) {
        togglePause();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.key] = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Clean up
    return () => {
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      
      cancelAnimationFrame(frameIdRef.current);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  // Update gameStateRef when gameState changes
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);
  
  // Create game boundaries
  const createBoundaries = () => {
    if (!sceneRef.current) return;
    
    const { width, depth, height } = worldSizeRef.current;
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: 0x4a4a4a,
      transparent: true,
      opacity: 0.5
    });
    
    // Create invisible walls
    const wallGeometryX = new THREE.BoxGeometry(1, height, depth * 2);
    const wallGeometryZ = new THREE.BoxGeometry(width * 2, height, 1);
    
    const wallLeft = new THREE.Mesh(wallGeometryX, wallMaterial);
    wallLeft.position.set(-width, height / 2 - 0.5, 0);
    wallLeft.visible = false;
    sceneRef.current.add(wallLeft);
    
    const wallRight = new THREE.Mesh(wallGeometryX, wallMaterial);
    wallRight.position.set(width, height / 2 - 0.5, 0);
    wallRight.visible = false;
    sceneRef.current.add(wallRight);
    
    const wallFront = new THREE.Mesh(wallGeometryZ, wallMaterial);
    wallFront.position.set(0, height / 2 - 0.5, -depth);
    wallFront.visible = false;
    sceneRef.current.add(wallFront);
    
    const wallBack = new THREE.Mesh(wallGeometryZ, wallMaterial);
    wallBack.position.set(0, height / 2 - 0.5, depth);
    wallBack.visible = false;
    sceneRef.current.add(wallBack);
  };
  
  // Create Cleo character
  const createCleo = () => {
    if (!sceneRef.current) return;
    
    const cleoGroup = new THREE.Group();
    
    // Cleo's body (elongated)
    const bodyGeometry = new THREE.CapsuleGeometry(1, 3, 4, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Brown
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.rotation.z = Math.PI / 2; // Make it horizontal
    body.castShadow = true;
    cleoGroup.add(body);
    
    // Cleo's head
    const headGeometry = new THREE.SphereGeometry(1, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Brown
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(2, 0, 0);
    head.castShadow = true;
    cleoGroup.add(head);
    
    // Cleo's eyes
    const eyeGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const eyeMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 }); // Black
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(2.5, 0.3, 0.5);
    cleoGroup.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(2.5, 0.3, -0.5);
    cleoGroup.add(rightEye);
    
    // Cleo's nose
    const noseGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const noseMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 }); // Black
    const nose = new THREE.Mesh(noseGeometry, noseMaterial);
    nose.position.set(2.8, 0, 0);
    cleoGroup.add(nose);
    
    // Cleo's legs
    const legGeometry = new THREE.CylinderGeometry(0.2, 0.2, 1, 8);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Brown
    
    for (let i = 0; i < 4; i++) {
      const leg = new THREE.Mesh(legGeometry, legMaterial);
      leg.position.set(i % 2 ? -1 : 1, -1, i < 2 ? 0.8 : -0.8);
      leg.castShadow = true;
      cleoGroup.add(leg);
    }
    
    // Cleo's tail
    const tailGeometry = new THREE.CapsuleGeometry(0.2, 1, 4, 8);
    const tailMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Brown
    const tail = new THREE.Mesh(tailGeometry, tailMaterial);
    tail.position.set(-2.5, 0, 0);
    tail.rotation.z = Math.PI / 4; // Angle up slightly
    tail.castShadow = true;
    cleoGroup.add(tail);
    
    // Position and add to scene
    cleoGroup.position.set(0, 1, 0);
    sceneRef.current.add(cleoGroup);
    cleoRef.current = cleoGroup;
  };
  
  // Create Evil Joe character
  const createJoe = () => {
    if (!sceneRef.current) return;
    
    const joeGroup = new THREE.Group();
    
    // Joe's body
    const bodyGeometry = new THREE.CapsuleGeometry(1, 3, 4, 8);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 }); // Dark gray
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.castShadow = true;
    joeGroup.add(body);
    
    // Joe's head
    const headGeometry = new THREE.SphereGeometry(1, 16, 16);
    const headMaterial = new THREE.MeshStandardMaterial({ color: 0xFFD8B1 }); // Skin tone
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.position.set(0, 2.5, 0);
    head.castShadow = true;
    joeGroup.add(head);
    
    // Joe's evil eyes (red)
    const eyeGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const eyeMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xFF0000,
      emissive: 0xFF0000,
      emissiveIntensity: 0.5
    }); // Red, glowing
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(0.4, 2.7, 0.5);
    joeGroup.add(leftEye);
    
    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.4, 2.7, -0.5);
    joeGroup.add(rightEye);
    
    // Joe's evil mouth (grimace)
    const mouthGeometry = new THREE.BoxGeometry(0.5, 0.1, 0.8);
    const mouthMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 }); // Black
    const mouth = new THREE.Mesh(mouthGeometry, mouthMaterial);
    mouth.position.set(0.5, 2.2, 0);
    joeGroup.add(mouth);
    
    // Joe's arms
    const armGeometry = new THREE.CapsuleGeometry(0.3, 2, 4, 8);
    const armMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 }); // Dark gray
    
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(0, 1, 1.2);
    leftArm.rotation.z = -Math.PI / 4; // Angled down
    joeGroup.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(0, 1, -1.2);
    rightArm.rotation.z = -Math.PI / 4; // Angled down
    joeGroup.add(rightArm);
    
    // Joe's legs
    const legGeometry = new THREE.CapsuleGeometry(0.4, 2, 4, 8);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 }); // Dark gray
    
    const leftLeg = new THREE.Mesh(legGeometry, legMaterial);
    leftLeg.position.set(0, -2, 0.5);
    joeGroup.add(leftLeg);
    
    const rightLeg = new THREE.Mesh(legGeometry, legMaterial);
    rightLeg.position.set(0, -2, -0.5);
    joeGroup.add(rightLeg);
    
    // Position and add to scene
    joeGroup.position.set(-15, 2, -15);
    joeGroup.scale.set(1.2, 1.2, 1.2); // Make Joe bigger and scarier
    sceneRef.current.add(joeGroup);
    joeRef.current = joeGroup;
  };
  
  // Create a poppadom
  const createPoppadom = () => {
    if (!sceneRef.current) return;
    
    const { width, depth } = worldSizeRef.current;
    
    // Create a poppadom (flat disc)
    const geometry = new THREE.CylinderGeometry(1, 1, 0.1, 16);
    const material = new THREE.MeshStandardMaterial({
      color: 0xD2B48C, // Tan/khaki color
      roughness: 0.7,
      metalness: 0.3
    });
    
    const poppadom = new THREE.Mesh(geometry, material);
    
    // Random position within world boundaries
    const x = Math.random() * width * 1.8 - width * 0.9;
    const z = Math.random() * depth * 1.8 - depth * 0.9;
    const y = 1 + Math.random() * 5; // Floating above ground
    
    poppadom.position.set(x, y, z);
    poppadom.rotation.x = Math.PI / 2; // Make it flat
    poppadom.castShadow = true;
    poppadom.receiveShadow = true;
    
    // Add animation properties
    const animationData = {
      rotationSpeed: Math.random() * 0.05,
      hoverSpeed: 0.5 + Math.random() * 0.5,
      hoverHeight: 0.5 + Math.random() * 0.5,
      originalY: y
    };
    
    // @ts-ignore - Adding custom properties to the mesh
    poppadom.userData.animation = animationData;
    
    sceneRef.current.add(poppadom);
    poppadomsRef.current.push(poppadom);
  };
  
  // Create an obstacle
  const createObstacle = () => {
    if (!sceneRef.current) return;
    
    const { width, depth } = worldSizeRef.current;
    
    // Determine obstacle type (variety of obstacles)
    const obstacleType = Math.floor(Math.random() * 3);
    let geometry, material, obstacle;
    
    switch (obstacleType) {
      case 0: // Spiky obstacle
        geometry = new THREE.DodecahedronGeometry(1.5, 0);
        material = new THREE.MeshStandardMaterial({
          color: 0xFF4500, // Red-orange
          roughness: 0.6,
          metalness: 0.4
        });
        break;
      case 1: // Fire hydrant
        geometry = new THREE.CylinderGeometry(0.8, 1, 2, 8);
        material = new THREE.MeshStandardMaterial({
          color: 0xFF0000, // Red
          roughness: 0.6,
          metalness: 0.4
        });
        break;
      case 2: // Trash can
        geometry = new THREE.CylinderGeometry(1, 1, 2.5, 10);
        material = new THREE.MeshStandardMaterial({
          color: 0x555555, // Gray
          roughness: 0.7,
          metalness: 0.3
        });
        break;
      default:
        geometry = new THREE.BoxGeometry(1.5, 2, 1.5);
        material = new THREE.MeshStandardMaterial({
          color: 0xFF0000, // Red
          roughness: 0.7,
          metalness: 0.3
        });
    }
    
    obstacle = new THREE.Mesh(geometry, material);
    
    // Random position within world boundaries
    const x = Math.random() * width * 1.8 - width * 0.9;
    const z = Math.random() * depth * 1.8 - depth * 0.9;
    
    obstacle.position.set(x, 1, z);
    obstacle.castShadow = true;
    obstacle.receiveShadow = true;
    
    // Add obstacle data
    const moveData = {
      moveType: Math.floor(Math.random() * 3),
      speed: 0.05 + Math.random() * 0.05 * difficultyRef.current,
      range: 5 + Math.random() * 5,
      originalX: x,
      originalZ: z,
      angle: 0
    };
    
    // @ts-ignore - Adding custom properties to the mesh
    obstacle.userData.movement = moveData;
    
    sceneRef.current.add(obstacle);
    obstaclesRef.current.push(obstacle);
  };
  
  // Create a platform
  const createPlatform = (x: number, y: number, z: number, width: number, depth: number) => {
    if (!sceneRef.current) return;
    
    const geometry = new THREE.BoxGeometry(width, 1, depth);
    const material = new THREE.MeshStandardMaterial({
      color: 0x8B4513, // Brown
      roughness: 0.8
    });
    
    const platform = new THREE.Mesh(geometry, material);
    platform.position.set(x, y, z);
    platform.castShadow = true;
    platform.receiveShadow = true;
    
    sceneRef.current.add(platform);
    platformsRef.current.push(platform);
    
    return platform;
  };
  
  // Generate the level with platforms
  const generateLevel = (level: number) => {
    if (!sceneRef.current) return;
    
    // Clear existing platforms
    platformsRef.current.forEach(platform => {
      sceneRef.current?.remove(platform);
    });
    platformsRef.current = [];
    
    // Clear existing poppadoms
    poppadomsRef.current.forEach(poppadom => {
      sceneRef.current?.remove(poppadom);
    });
    poppadomsRef.current = [];
    
    // Clear existing obstacles
    obstaclesRef.current.forEach(obstacle => {
      sceneRef.current?.remove(obstacle);
    });
    obstaclesRef.current = [];
    
    const { width, depth } = worldSizeRef.current;
    
    // Generate platforms based on level
    const numPlatforms = 5 + level * 2;
    
    // Main platform in the center
    createPlatform(0, 0, 0, 10, 10);
    
    // Random platforms around
    for (let i = 0; i < numPlatforms; i++) {
      const x = Math.random() * width * 1.5 - width * 0.75;
      const z = Math.random() * depth * 1.5 - depth * 0.75;
      const y = 1 + Math.random() * (level * 2); // Higher platforms in higher levels
      const platformWidth = 3 + Math.random() * 5;
      const platformDepth = 3 + Math.random() * 5;
      
      createPlatform(x, y, z, platformWidth, platformDepth);
    }
    
    // Generate initial poppadoms
    const numPoppadoms = 10 + level * 2;
    for (let i = 0; i < numPoppadoms; i++) {
      createPoppadom();
    }
    
    // Generate initial obstacles
    const numObstacles = 3 + level * 2;
    for (let i = 0; i < numObstacles; i++) {
      createObstacle();
    }
    
    difficultyRef.current = 1 + level * 0.5;
  };
  
  // Game physics and movement
  const updatePhysics = (delta: number) => {
    const keys = keysRef.current;
    
    // Cleo movement
    if (cleoRef.current) {
      // Gravity
      velocityRef.current.y -= 9.8 * delta;
      
      // Movement speeds
      const moveSpeed = 10 * delta;
      const jumpForce = 8;
      const maxSpeed = 10;
      
      // Apply movement based on key presses
      if (keys['w'] || keys['ArrowUp']) {
        velocityRef.current.z -= moveSpeed;
      }
      if (keys['s'] || keys['ArrowDown']) {
        velocityRef.current.z += moveSpeed;
      }
      if (keys['a'] || keys['ArrowLeft']) {
        velocityRef.current.x -= moveSpeed;
        // Rotate Cleo to face the direction
        cleoRef.current.rotation.y = Math.PI / 2;
      }
      if (keys['d'] || keys['ArrowRight']) {
        velocityRef.current.x += moveSpeed;
        // Rotate Cleo to face the direction
        cleoRef.current.rotation.y = -Math.PI / 2;
      }
      if ((keys[' '] || keys['Shift']) && isCleoGrounded()) {
        velocityRef.current.y = jumpForce;
      }
      
      // Apply velocity with limits
      velocityRef.current.x = THREE.MathUtils.clamp(velocityRef.current.x, -maxSpeed, maxSpeed);
      velocityRef.current.z = THREE.MathUtils.clamp(velocityRef.current.z, -maxSpeed, maxSpeed);
      
      // Apply friction
      velocityRef.current.x *= 0.9;
      velocityRef.current.z *= 0.9;
      
      // Update position
      cleoRef.current.position.x += velocityRef.current.x * delta;
      cleoRef.current.position.y += velocityRef.current.y * delta;
      cleoRef.current.position.z += velocityRef.current.z * delta;
      
      // Check if Cleo is on a platform
      const onPlatform = checkPlatformCollision();
      
      // World boundaries
      const { width, depth, height } = worldSizeRef.current;
      cleoRef.current.position.x = THREE.MathUtils.clamp(
        cleoRef.current.position.x, 
        -width, 
        width
      );
      cleoRef.current.position.z = THREE.MathUtils.clamp(
        cleoRef.current.position.z, 
        -depth, 
        depth
      );
      
      // Floor collision
      if (cleoRef.current.position.y < 1) {
        cleoRef.current.position.y = 1;
        velocityRef.current.y = 0;
      }
      
      // Ceiling collision
      if (cleoRef.current.position.y > height) {
        cleoRef.current.position.y = height;
        velocityRef.current.y = 0;
      }
      
      // Update camera to follow Cleo
      if (cameraRef.current && controlsRef.current && controlsRef.current.enabled) {
        const smoothness = 0.05;
        const targetPosition = new THREE.Vector3(
          cleoRef.current.position.x,
          cleoRef.current.position.y + 10,
          cleoRef.current.position.z + 20
        );
        cameraRef.current.position.lerp(targetPosition, smoothness);
        cameraRef.current.lookAt(
          cleoRef.current.position.x,
          cleoRef.current.position.y,
          cleoRef.current.position.z
        );
      }
      
      // Animate Cleo's legs and tail
      cleoRef.current.children.forEach((child, index) => {
        if (index >= 3 && index <= 6) { // Legs
          const legIndex = index - 3;
          const phase = legIndex % 2 ? 0 : Math.PI;
          child.position.y = -1 + Math.sin(Date.now() * 0.01 + phase) * 0.2;
        }
        if (index === 7) { // Tail
          child.rotation.z = Math.PI / 4 + Math.sin(Date.now() * 0.005) * 0.2;
        }
      });
    }
    
    // Joe AI movement (evil and threatening)
    if (joeRef.current && cleoRef.current) {
      // Track and follow Cleo with evil intent
      const cleoPosition = cleoRef.current.position.clone();
      const joePosition = joeRef.current.position.clone();
      
      // Calculate direction to Cleo
      const direction = new THREE.Vector3().subVectors(cleoPosition, joePosition).normalize();
      
      // Joe's speed increases with level and when closer to Cleo
      const distanceToCleo = joePosition.distanceTo(cleoPosition);
      const joeSpeed = (0.8 + difficultyRef.current * 0.3) * delta;
      
      // Joe moves faster when closer to Cleo (threatening chase)
      const speedFactor = THREE.MathUtils.clamp(1 + (20 - distanceToCleo) * 0.1, 1, 2);
      
      // Update Joe's position
      joeRef.current.position.x += direction.x * joeSpeed * speedFactor;
      joeRef.current.position.z += direction.z * joeSpeed * speedFactor;
      
      // Keep Joe on the ground or platforms
      joeRef.current.position.y = 2; // Default height
      
      // Rotate Joe to face Cleo
      joeRef.current.lookAt(cleoPosition.x, joePosition.y, cleoPosition.z);
      
      // Evil animations for Joe
      // Pulsating red eyes
      const eyeIntensity = 0.5 + Math.sin(Date.now() * 0.005) * 0.3;
      joeRef.current.children.forEach((child, index) => {
        if (index === 3 || index === 4) { // Eyes
          const material = (child as THREE.Mesh).material as THREE.MeshStandardMaterial;
          material.emissiveIntensity = eyeIntensity;
        }
      });
      
      // Menacing arm movements
      if (joeRef.current.children[5] && joeRef.current.children[6]) { // Arms
        joeRef.current.children[5].rotation.z = -Math.PI / 4 + Math.sin(Date.now() * 0.003) * 0.3;
        joeRef.current.children[6].rotation.z = -Math.PI / 4 + Math.sin(Date.now() * 0.003 + Math.PI) * 0.3;
      }
      
      // Joe's attack cooldown
      joeAttackCooldownRef.current -= delta;
      
      // Joe's special attack when close to Cleo
      if (distanceToCleo < 10 && joeAttackCooldownRef.current <= 0) {
        // Teleport attack - Joe suddenly appears closer to Cleo
        if (Math.random() < 0.2 * difficultyRef.current) {
          const teleportOffset = new THREE.Vector3(
            Math.random() * 6 - 3,
            0,
            Math.random() * 6 - 3
          );
          const teleportTarget = cleoPosition.clone().add(teleportOffset);
          
          // Create a flash effect
          const flashGeometry = new THREE.SphereGeometry(2, 16, 16);
          const flashMaterial = new THREE.MeshBasicMaterial({
            color: 0xFF0000,
            transparent: true,
            opacity: 0.7
          });
          const flash = new THREE.Mesh(flashGeometry, flashMaterial);
          flash.position.copy(joeRef.current.position);
          sceneRef.current?.add(flash);
          
          // Set Joe's new position
          joeRef.current.position.copy(teleportTarget);
          joeRef.current.position.y = 2; // Keep at proper height
          
          // Remove flash after a short duration
          setTimeout(() => {
            sceneRef.current?.remove(flash);
          }, 300);
          
          // Create an evil laugh sound effect (commented out for now)
          // playSound('evil-laugh');
          
          setMessage("Evil Joe used teleport attack! Watch out!");
        }
        
        // Reset cooldown
        joeAttackCooldownRef.current = 5;
      }
      
      // Check collision with Cleo
      if (distanceToCleo < 3) {
        handleJoeCollision();
      }
    }
    
    // Animate poppadoms
    poppadomsRef.current.forEach((poppadom) => {
      // @ts-ignore - Accessing custom properties
      const animation = poppadom.userData.animation;
      
      // Rotation animation
      poppadom.rotation.z += animation.rotationSpeed;
      
      // Hover animation
      poppadom.position.y = animation.originalY + 
        Math.sin(Date.now() * 0.001 * animation.hoverSpeed) * animation.hoverHeight;
      
      // Check collision with Cleo
      if (cleoRef.current) {
        const cleoPosition = cleoRef.current.position.clone();
        const poppadomPosition = poppadom.position.clone();
        const distance = cleoPosition.distanceTo(poppadomPosition);
        
        if (distance < 2.5) {
          // Collect poppadom
          collectPoppadom(poppadom);
        }
      }
    });
    
    // Animate obstacles
    obstaclesRef.current.forEach((obstacle) => {
      // @ts-ignore - Accessing custom properties
      const movement = obstacle.userData.movement;
      
      // Different movement patterns
      switch (movement.moveType) {
        case 0: // Side to side
          obstacle.position.x = movement.originalX + 
            Math.sin(Date.now() * 0.001 * movement.speed) * movement.range;
          break;
        case 1: // Forward and back
          obstacle.position.z = movement.originalZ + 
            Math.sin(Date.now() * 0.001 * movement.speed) * movement.range;
          break;
        case 2: // Circular
          movement.angle += movement.speed * delta;
          obstacle.position.x = movement.originalX + Math.cos(movement.angle) * movement.range;
          obstacle.position.z = movement.originalZ + Math.sin(movement.angle) * movement.range;
          break;
      }
      
      // Obstacle rotation animation
      obstacle.rotation.y += 0.01 * movement.speed;
      
      // Check collision with Cleo
      if (cleoRef.current) {
        const cleoPosition = cleoRef.current.position.clone();
        const obstaclePosition = obstacle.position.clone();
        const distance = cleoPosition.distanceTo(obstaclePosition);
        
        if (distance < 2.5) {
          // Collision with obstacle
          handleObstacleCollision();
        }
      }
    });
  };
  
  // Check if Cleo is on the ground or a platform
  const isCleoGrounded = () => {
    if (!cleoRef.current) return false;
    
    // Check if on the ground
    if (cleoRef.current.position.y <= 1.1) return true;
    
    // Check if on a platform
    return checkPlatformCollision();
  };
  
  // Check for platform collisions
  const checkPlatformCollision = () => {
    if (!cleoRef.current) return false;
    
    const cleoPosition = cleoRef.current.position.clone();
    const cleoBottom = cleoPosition.y - 1;
    
    for (const platform of platformsRef.current) {
      const platformPosition = platform.position.clone();
      const platformTop = platformPosition.y + 0.5;
      const platformWidth = (platform.geometry as THREE.BoxGeometry).parameters.width;
      const platformDepth = (platform.geometry as THREE.BoxGeometry).parameters.depth;
      
      // Check if Cleo is above the platform
      if (Math.abs(cleoBottom - platformTop) < 0.2 &&
          Math.abs(cleoPosition.x - platformPosition.x) < platformWidth / 2 &&
          Math.abs(cleoPosition.z - platformPosition.z) < platformDepth / 2) {
        
        // Adjust Cleo's height to stand on the platform
        cleoRef.current.position.y = platformTop + 1;
        velocityRef.current.y = 0;
        return true;
      }
    }
    
    return false;
  };
  
  // Collect a poppadom
  const collectPoppadom = (poppadom: THREE.Mesh) => {
    if (!sceneRef.current) return;
    
    // Remove poppadom from scene
    sceneRef.current.remove(poppadom);
    
    // Remove from array
    poppadomsRef.current = poppadomsRef.current.filter(p => p !== poppadom);
    
    // Update score
    setGameState(prev => {
      const newScore = prev.score + 10;
      
      // Check if reached score threshold for next level
      if (newScore >= prev.level * 100) {
        // Level up
        levelUp();
        return {
          ...prev,
          score: newScore,
          level: prev.level + 1
        };
      }
      
      return {
        ...prev,
        score: newScore
      };
    });
    
    // Create a new poppadom (to keep the game populated)
    setTimeout(() => {
      if (gameStateRef.current.gameStarted && !gameStateRef.current.gameOver) {
        createPoppadom();
      }
    }, 2000);
  };
  
  // Handle collision with obstacle
  const handleObstacleCollision = () => {
    if (!cleoRef.current) return;
    
    // Bounce Cleo back
    velocityRef.current.x *= -1.5;
    velocityRef.current.z *= -1.5;
    velocityRef.current.y = 5; // Bounce up
    
    // Display message
    setMessage("Ouch! Cleo hit an obstacle!");
    
    // Lose a life
    setGameState(prev => {
      const newLives = prev.lives - 1;
      
      if (newLives <= 0) {
        endGame();
        return {
          ...prev,
          lives: 0,
          gameOver: true
        };
      }
      
      return {
        ...prev,
        lives: newLives
      };
    });
  };
  
  // Handle collision with Joe
  const handleJoeCollision = () => {
    if (!cleoRef.current || !joeRef.current) return;
    
    // Joe roars and jumps at Cleo
    joeRef.current.scale.set(1.3, 1.3, 1.3); // Expand slightly for attack animation
    setTimeout(() => {
      if (joeRef.current) joeRef.current.scale.set(1.2, 1.2, 1.2);
    }, 200);
    
    // Bounce Cleo away from Joe
    const direction = new THREE.Vector3().subVectors(
      cleoRef.current.position,
      joeRef.current.position
    ).normalize();
    
    velocityRef.current.x = direction.x * 15;
    velocityRef.current.z = direction.z * 15;
    velocityRef.current.y = 8; // Bounce up
    
    // Display message
    setMessage("Evil Joe attacked Cleo! Run!");
    
    // Lose a life
    setGameState(prev => {
      const newLives = prev.lives - 1;
      
      if (newLives <= 0) {
        endGame();
        return {
          ...prev,
          lives: 0,
          gameOver: true
        };
      }
      
      return {
        ...prev,
        lives: newLives
      };
    });
  };
  
  // Level up function
  const levelUp = () => {
    difficultyRef.current += 0.5;
    generateLevel(gameStateRef.current.level + 1);
    setMessage(`Level ${gameStateRef.current.level + 1}! Things are getting harder!`);
  };
  
  // Animation loop
  const animate = () => {
    const { gameStarted, gameOver, paused } = gameStateRef.current;
    
    if (!gameStarted || gameOver || paused) {
      frameIdRef.current = requestAnimationFrame(animate);
      
      // Still render the scene even when paused
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
      
      return;
    }
    
    const delta = clockRef.current ? clockRef.current.getDelta() : 0.016;
    
    // Update physics and game logic
    updatePhysics(delta);
    
    // Update controls
    if (controlsRef.current) {
      controlsRef.current.update();
    }
    
    // Render scene
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
    
    frameIdRef.current = requestAnimationFrame(animate);
  };
  
  // Start game
  const startGame = () => {
    if (clockRef.current) {
      clockRef.current.start();
    }
    
    // Enable orbit controls
    if (controlsRef.current) {
      controlsRef.current.enabled = true;
    }
    
    // Set up the level
    generateLevel(1);
    
    // Start countdown
    setGameState(prev => ({ ...prev, gameStarted: true }));
    
    // Start countdown
    let count = 3;
    const countdownInterval = setInterval(() => {
      count--;
      setCountdown(count);
      
      if (count <= 0) {
        clearInterval(countdownInterval);
        // Start animation loop
        frameIdRef.current = requestAnimationFrame(animate);
      }
    }, 1000);
  };
  
  // Restart game
  const restartGame = () => {
    // Reset game state
    setGameState({
      score: 0,
      highScore: gameState.highScore,
      level: 1,
      lives: 3,
      gameOver: false,
      gameStarted: true,
      paused: false
    });
    
    // Reset positions
    if (cleoRef.current) {
      cleoRef.current.position.set(0, 1, 0);
    }
    
    if (joeRef.current) {
      joeRef.current.position.set(-15, 2, -15);
    }
    
    // Reset velocity
    velocityRef.current = { x: 0, y: 0, z: 0 };
    
    // Reset difficulty
    difficultyRef.current = 1;
    
    // Reset level
    generateLevel(1);
    
    // Start countdown again
    setCountdown(3);
    
    let count = 3;
    const countdownInterval = setInterval(() => {
      count--;
      setCountdown(count);
      
      if (count <= 0) {
        clearInterval(countdownInterval);
        // Start animation loop
        frameIdRef.current = requestAnimationFrame(animate);
      }
    }, 1000);
  };
  
  // Toggle pause
  const togglePause = () => {
    setGameState(prev => ({ ...prev, paused: !prev.paused }));
    setMessage(gameState.paused ? "Game resumed" : "Game paused");
  };
  
  // End game
  const endGame = () => {
    setGameState(prev => {
      // Update high score if needed
      const newHighScore = prev.score > prev.highScore ? prev.score : prev.highScore;
      
      return {
        ...prev,
        highScore: newHighScore,
        gameOver: true
      };
    });
    
    setMessage("Game Over! Evil Joe was too powerful!");
  };
  
  return (
    <div className="cleo-game-3d-container">
      {/* Game UI overlay */}
      <div className="game-ui">
        <div className="game-score">
          <span>Score: {gameState.score}</span>
          <span>High Score: {gameState.highScore}</span>
        </div>
        
        <div className="game-level">
          Level: {gameState.level}
        </div>
        
        <div className="game-lives">
          {Array.from({ length: gameState.lives }).map((_, i) => (
            <span key={i} className="life-icon">❤️</span>
          ))}
        </div>
        
        <div className="game-message">
          {message}
        </div>
      </div>
      
      {/* Game canvas */}
      <div ref={mountRef} className="game-canvas-container" />
      
      {/* Starting screen */}
      {!gameState.gameStarted && !gameState.gameOver && (
        <div className="game-overlay">
          <h2>Cleo's 3D Poppadom Adventure</h2>
          <p>Help Cleo collect her favorite poppadoms while avoiding obstacles and Evil Joe!</p>
          <p>Use WASD to move, SPACE to jump, and P to pause.</p>
          <p>Evil Joe is faster and more dangerous than ever!</p>
          <button onClick={() => startGame()}>Start Game</button>
        </div>
      )}
      
      {/* Countdown overlay */}
      {gameState.gameStarted && countdown > 0 && (
        <div className="countdown-overlay">
          <div className="countdown">{countdown}</div>
        </div>
      )}
      
      {/* Pause screen */}
      {gameState.paused && (
        <div className="pause-overlay">
          <h2>Game Paused</h2>
          <p>Press P to resume</p>
        </div>
      )}
      
      {/* Game over screen */}
      {gameState.gameOver && (
        <div className="game-over-overlay">
          <h2>Game Over!</h2>
          <p>Evil Joe was victorious this time...</p>
          <p>Final Score: {gameState.score}</p>
          <p>High Score: {gameState.highScore}</p>
          <button onClick={() => restartGame()}>Try Again</button>
        </div>
      )}
    </div>
  );
};

export default CleoGame;