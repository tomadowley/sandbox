export interface Position {
  x: number;
  y: number;
}

export interface PlayerData {
  id: number;
  name: string;
  color: string;
  position: Position;
  velocity: Position;
  isJumping: boolean;
  jumpPower: number;
}

export interface TerritoryData {
  id: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  ownerId: number | null;
  adjacent: number[];
}

export interface GameState {
  currentPlayerIndex: number;
  phase: 'MOVEMENT' | 'ATTACK' | 'FORTIFY';
  selectedTerritory: number | null;
  targetTerritory: number | null;
  territories: TerritoryData[];
  players: PlayerData[];
  gameOver: boolean;
  winner: number | null;
}