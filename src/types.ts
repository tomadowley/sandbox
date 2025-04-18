export interface Position {
  x: number;
  y: number;
  z?: number;
}

export interface Size {
  width: number;
  height: number;
  depth?: number;
}

export interface Entity {
  getPosition(): Position;
  getSize(): Size;
  update?(deltaTime: number, ...args: any[]): void;
  render(ctx: CanvasRenderingContext2D | any): void;
}

export interface GameCallbacks {
  onScoreChange: (score: number) => void;
  onStatsChange: (stats: any) => void;
  onGameOver: (finalScore: number) => void;
  onVictory: (finalScore: number) => void;
  onMessage: (message: string) => void;
}