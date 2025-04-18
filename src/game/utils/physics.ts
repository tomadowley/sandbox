import { PlayerData, TerritoryData, Position } from '../types';

const GRAVITY = 0.8;
const MOVEMENT_SPEED = 5;
const COLLISION_THRESHOLD = 20;

// Platform collision detection
const platforms = [
  { x: 100, y: 400, width: 300, height: 20 },
  { x: 500, y: 500, width: 300, height: 20 },
  { x: 200, y: 600, width: 400, height: 20 },
  { x: 700, y: 650, width: 200, height: 20 },
  { x: 0, y: 700, width: 1024, height: 20 },
  { x: 0, y: 748, width: 1024, height: 20 } // Game floor
];

export const updatePlayerPosition = (
  player: PlayerData,
  keysPressed: Set<string>,
  territories: TerritoryData[]
): PlayerData => {
  let newPlayer = { ...player };
  
  // Handle horizontal movement
  if (keysPressed.has('ArrowLeft') || keysPressed.has('a')) {
    newPlayer.velocity.x = -MOVEMENT_SPEED;
  } else if (keysPressed.has('ArrowRight') || keysPressed.has('d')) {
    newPlayer.velocity.x = MOVEMENT_SPEED;
  } else {
    newPlayer.velocity.x = 0;
  }
  
  // Handle jumping
  if ((keysPressed.has('ArrowUp') || keysPressed.has('w') || keysPressed.has(' ')) && !newPlayer.isJumping) {
    newPlayer.velocity.y = -newPlayer.jumpPower;
    newPlayer.isJumping = true;
  }
  
  // Apply gravity
  newPlayer.velocity.y += GRAVITY;
  
  // Update position
  newPlayer.position.x += newPlayer.velocity.x;
  newPlayer.position.y += newPlayer.velocity.y;
  
  // Check platform collisions
  let onPlatform = false;
  for (const platform of platforms) {
    if (
      newPlayer.position.x + 30 > platform.x &&
      newPlayer.position.x < platform.x + platform.width &&
      newPlayer.position.y + 40 > platform.y &&
      newPlayer.position.y + 40 < platform.y + platform.height / 2 &&
      newPlayer.velocity.y > 0
    ) {
      newPlayer.position.y = platform.y - 40;
      newPlayer.velocity.y = 0;
      newPlayer.isJumping = false;
      onPlatform = true;
      break;
    }
  }
  
  if (!onPlatform) {
    newPlayer.isJumping = true;
  }
  
  // Keep player within game bounds
  if (newPlayer.position.x < 0) newPlayer.position.x = 0;
  if (newPlayer.position.x > 1024 - 30) newPlayer.position.x = 1024 - 30;
  if (newPlayer.position.y < 0) newPlayer.position.y = 0;
  if (newPlayer.position.y > 768 - 40) {
    newPlayer.position.y = 768 - 40;
    newPlayer.velocity.y = 0;
    newPlayer.isJumping = false;
  }
  
  return newPlayer;
};

export const handleCollisions = (
  player: PlayerData,
  territories: TerritoryData[],
  currentPlayerId: number
): TerritoryData[] => {
  let updatedTerritories = [...territories];
  
  // Check for player-territory collisions
  for (let i = 0; i < territories.length; i++) {
    const territory = territories[i];
    
    // Simple collision check
    if (
      player.position.x + 30 > territory.x &&
      player.position.x < territory.x + territory.width &&
      player.position.y + 40 > territory.y &&
      player.position.y < territory.y + territory.height
    ) {
      // The current player has entered the territory
      // If the territory is not already owned by the current player,
      // there's a chance to capture it
      if (territory.ownerId !== currentPlayerId) {
        // 30% chance to capture an enemy territory when colliding
        if (Math.random() < 0.3) {
          updatedTerritories[i] = {
            ...territory,
            ownerId: currentPlayerId
          };
        }
      }
    }
  }
  
  return updatedTerritories;
};

export const isAdjacentTerritory = (
  territoryId1: number,
  territoryId2: number,
  territories: TerritoryData[]
): boolean => {
  const territory1 = territories.find(t => t.id === territoryId1);
  
  if (!territory1) return false;
  
  return territory1.adjacent.includes(territoryId2);
};