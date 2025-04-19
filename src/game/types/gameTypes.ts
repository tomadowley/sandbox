export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface Nana {
  position: Position;
  size: Size;
  velocity: Position;
  direction: string | null;
  frameIndex: number;
  frameCount: number;
  animationTimer: number;
}

export interface GameObject {
  position: Position;
  size: Size;
  type: string;
  effect: number;
  speed: number;
}

export interface GameState {
  nana: Nana;
  gameObjects: GameObject[];
  drunkenness: number;
  score: number;
  spawnTimer: number;
  level: number;
}

export const initialGameState: GameState = {
  nana: {
    position: { x: 400, y: 250 },
    size: { width: 50, height: 70 },
    velocity: { x: 0, y: 0 },
    direction: null,
    frameIndex: 0,
    frameCount: 4,
    animationTimer: 0
  },
  gameObjects: [],
  drunkenness: 100,
  score: 0,
  spawnTimer: 0,
  level: 1
};