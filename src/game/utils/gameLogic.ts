import { GameState, GameObject, Position } from '../types/gameTypes';

// Constants for game logic
const NANA_SPEED = 0.25;
const DRUNKENNESS_DECREASE_RATE = 2; // % per second
const MIN_SPAWN_TIME = 500; // milliseconds
const MAX_SPAWN_TIME = 1500; // milliseconds
const SCREEN_WIDTH = 800;
const SCREEN_HEIGHT = 500;

export function updateGameState(gameState: GameState, deltaTime: number): GameState {
  // Create a new state to avoid direct mutations
  const newState = { ...gameState };
  
  // Update Nana's position based on input direction
  updateNanaPosition(newState, deltaTime);
  
  // Update drunkenness (constantly decreasing)
  newState.drunkenness -= (DRUNKENNESS_DECREASE_RATE * deltaTime) / 1000;
  newState.drunkenness = Math.max(0, Math.min(100, newState.drunkenness));
  
  // Update game objects
  updateGameObjects(newState, deltaTime);
  
  // Check for collisions
  checkCollisions(newState);
  
  // Spawn new game objects
  newState.spawnTimer -= deltaTime;
  if (newState.spawnTimer <= 0) {
    spawnGameObject(newState);
    // Reset spawn timer with some randomness
    newState.spawnTimer = Math.random() * (MAX_SPAWN_TIME - MIN_SPAWN_TIME) + MIN_SPAWN_TIME;
  }
  
  // Update level based on score
  newState.level = Math.floor(newState.score / 10) + 1;
  
  return newState;
}

function updateNanaPosition(gameState: GameState, deltaTime: number): void {
  const { nana } = gameState;
  
  // Reset velocity
  nana.velocity = { x: 0, y: 0 };
  
  // Set velocity based on direction
  const speed = NANA_SPEED * deltaTime;
  
  switch (nana.direction) {
    case 'up':
      nana.velocity.y = -speed;
      break;
    case 'down':
      nana.velocity.y = speed;
      break;
    case 'left':
      nana.velocity.x = -speed;
      break;
    case 'right':
      nana.velocity.x = speed;
      break;
  }
  
  // Update position
  nana.position.x += nana.velocity.x;
  nana.position.y += nana.velocity.y;
  
  // Keep Nana within the screen boundaries
  nana.position.x = Math.max(nana.size.width / 2, Math.min(SCREEN_WIDTH - nana.size.width / 2, nana.position.x));
  nana.position.y = Math.max(nana.size.height / 2, Math.min(SCREEN_HEIGHT - nana.size.height / 2, nana.position.y));

  // Update animation
  nana.animationTimer += deltaTime;
  if (nana.animationTimer >= 200) { // Change frame every 200ms
    nana.frameIndex = (nana.frameIndex + 1) % nana.frameCount;
    nana.animationTimer = 0;
  }
}

function updateGameObjects(gameState: GameState, deltaTime: number): void {
  const { gameObjects } = gameState;
  
  // Move game objects and remove those that go off-screen
  for (let i = gameObjects.length - 1; i >= 0; i--) {
    const obj = gameObjects[i];
    
    // Move object down
    obj.position.y += obj.speed * deltaTime / 1000;
    
    // Remove if off-screen
    if (obj.position.y > SCREEN_HEIGHT + obj.size.height) {
      gameObjects.splice(i, 1);
    }
  }
}

function checkCollisions(gameState: GameState): void {
  const { nana, gameObjects } = gameState;
  
  // Check collision with each game object
  for (let i = gameObjects.length - 1; i >= 0; i--) {
    const obj = gameObjects[i];
    
    // Simple circle collision detection
    const dx = nana.position.x - obj.position.x;
    const dy = nana.position.y - obj.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // If collision detected
    if (distance < (nana.size.width + obj.size.width) / 2) {
      // Apply effect (increase/decrease drunkenness)
      gameState.drunkenness += obj.effect;
      gameState.drunkenness = Math.max(0, Math.min(100, gameState.drunkenness));
      
      // Add score for collecting drinks (positive effect objects)
      if (obj.effect > 0) {
        gameState.score += Math.round(obj.effect);
      }
      
      // Remove the object
      gameObjects.splice(i, 1);
    }
  }
}

function spawnGameObject(gameState: GameState): void {
  const types = [
    { type: 'beer', effect: 15, probability: 0.4, speed: 100 },
    { type: 'wine', effect: 20, probability: 0.2, speed: 150 },
    { type: 'water', effect: -10, probability: 0.3, speed: 120 },
    { type: 'coffee', effect: -20, probability: 0.1, speed: 170 }
  ];
  
  // Adjust probabilities based on level (make it harder as level increases)
  const adjustedTypes = types.map(item => {
    if (item.effect > 0) {
      // Decrease probability of drinks as level increases
      return { ...item, probability: item.probability * (1 - 0.05 * (gameState.level - 1)) };
    } else {
      // Increase probability of sobering items as level increases
      return { ...item, probability: item.probability * (1 + 0.05 * (gameState.level - 1)) };
    }
  });
  
  // Normalize probabilities
  const totalProbability = adjustedTypes.reduce((sum, item) => sum + item.probability, 0);
  const normalizedTypes = adjustedTypes.map(item => ({
    ...item,
    probability: item.probability / totalProbability
  }));
  
  // Select a type based on probability
  let random = Math.random();
  let selectedType = normalizedTypes[0];
  
  for (const typeInfo of normalizedTypes) {
    if (random < typeInfo.probability) {
      selectedType = typeInfo;
      break;
    }
    random -= typeInfo.probability;
  }
  
  // Create a new game object
  const newObject: GameObject = {
    position: {
      x: Math.random() * (SCREEN_WIDTH - 40) + 20,
      y: -30
    },
    size: {
      width: 40,
      height: 40
    },
    type: selectedType.type,
    effect: selectedType.effect,
    speed: selectedType.speed * (1 + 0.1 * (gameState.level - 1)) // Speed increases with level
  };
  
  // Add to game objects
  gameState.gameObjects.push(newObject);
}