import { Entity, Position, Size } from '../types';
interface JoeArgs {
  x: number;
  y: number;
  width: number;
  height: number;
}
export default class Joe implements Entity {
  private x: number;
  private y: number;
  private width: number;
  private height: number;
  private speed: number = 1.5;
  constructor(args: JoeArgs) {
    this.x = args.x;
    this.y = args.y;
    this.width = args.width;
    this.height = args.height;
  }
  public setSpeed(speed: number) {
    this.speed = speed;
  }
  public setPosition(pos: { x: number; y: number }) {
    this.x = pos.x;
    this.y = pos.y;
  }
  public getPosition(): Position {
    return { x: this.x, y: this.y };
  }
  public getSize(): Size {
    return { width: this.width, height: this.height };
  }
  public update(_deltaTime: number, cleoPos: Position) {
    // Simple chase AI
    const dx = cleoPos.x - this.x;
    const dy = cleoPos.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    this.x += (dx / dist) * this.speed;
    this.y += (dy / dist) * this.speed;
  }
  public render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    // Body
    ctx.fillStyle = '#3a2d1a';
    ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    // "Evil" face
    ctx.fillStyle = '#f44';
    ctx.beginPath();
    ctx.arc(0, -this.height / 3, this.width / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = `${this.width / 3}px Arial`;
    ctx.textAlign = 'center';
    ctx.fillText('😈', 0, this.height / 8);
    ctx.restore();
  }
}