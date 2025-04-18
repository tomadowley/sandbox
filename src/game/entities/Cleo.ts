import { Position, Size, Entity } from '../types';
interface CleoStats {
  food: number;
  scratches: number;
  snuggles: number;
  comfort: number;
}
interface CleoArgs {
  x: number;
  y: number;
  width: number;
  height: number;
}
export default class Cleo implements Entity {
  private x: number;
  private y: number;
  private width: number;
  private height: number;
  private facingLeft: boolean = false;
  private stats: CleoStats = {
    food: 100,
    scratches: 100,
    snuggles: 100,
    comfort: 100
  };
  private statsMax: CleoStats = {
    food: 100,
    scratches: 100,
    snuggles: 100,
    comfort: 100
  };
  constructor(args: CleoArgs) {
    this.x = args.x;
    this.y = args.y;
    this.width = args.width;
    this.height = args.height;
  }
  public moveX(dx: number) {
    this.x += dx;
  }
  public moveY(dy: number) {
    this.y += dy;
  }
  public setX(x: number) {
    this.x = x;
  }
  public setY(y: number) {
    this.y = y;
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
  public setFacingLeft(left: boolean) {
    this.facingLeft = left;
  }
  public getStats() {
    return { ...this.stats };
  }
  public updateStats(change: Partial<CleoStats>) {
    for (const key of Object.keys(change) as (keyof CleoStats)[]) {
      this.stats[key] = Math.max(
        0,
        Math.min(this.statsMax[key], this.stats[key] + (change[key] || 0))
      );
    }
  }
  public resetStats() {
    this.stats = { ...this.statsMax };
  }
  // Optionally receive deltaTime in ms
  public update(_deltaTime: number) {
    // Could animate or trigger effects here if needed
  }
  public render(ctx: CanvasRenderingContext2D) {
    // Draw simplified cartoon Cleo as a sausage dog!
    // Save context state
    ctx.save();
    // Move to Cleo's position
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    if (this.facingLeft) {
      ctx.scale(-1, 1);
    }
    // Draw body
    ctx.fillStyle = '#8B4513';
    ctx.strokeStyle = '#4A2511';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, 0, this.width/2, this.height/2, 0, 0, Math.PI*2);
    ctx.fill();
    ctx.stroke();
    // Draw head
    ctx.beginPath();
    ctx.ellipse(this.width/2 - this.height/3, 0, this.height/2, this.height/2, 0, 0, Math.PI*2);
    ctx.fillStyle = '#a0522d';
    ctx.fill();
    ctx.stroke();
    // Ear
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(this.width/2 - this.height/3, this.height/3, this.height/5, this.height/3, 0, 0, Math.PI*2);
    ctx.fillStyle = '#5b2e06';
    ctx.fill();
    ctx.restore();
    // Eye
    ctx.beginPath();
    ctx.arc(this.width/2, -this.height/8, this.height/8, 0, Math.PI*2);
    ctx.fillStyle = '#111';
    ctx.fill();
    // Legs (just 2 for cute effect)
    ctx.strokeStyle = '#4A2511';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(-this.width/4, this.height/2 - 4);
    ctx.lineTo(-this.width/4, this.height/2 + 8);
    ctx.moveTo(this.width/6, this.height/2 - 4);
    ctx.lineTo(this.width/6, this.height/2 + 8);
    ctx.stroke();
    // Tail (wags upward)
    ctx.beginPath();
    ctx.moveTo(-this.width/2, 0);
    ctx.quadraticCurveTo(-this.width/2 - 10, -10, -this.width/2, -15);
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#4A2511';
    ctx.stroke();
    ctx.restore();
  }
}