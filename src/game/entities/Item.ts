import { Entity, Position, Size } from '../types';
interface ItemArgs {
  x: number;
  y: number;
  width: number;
  height: number;
  type: 'food' | 'scratches' | 'snuggles' | 'comfort' | 'toy';
}
export default class Item implements Entity {
  private x: number;
  private y: number;
  private width: number;
  private height: number;
  private type: ItemArgs['type'];
  constructor(args: ItemArgs) {
    this.x = args.x;
    this.y = args.y;
    this.width = args.width;
    this.height = args.height;
    this.type = args.type;
  }
  public getType() {
    return this.type;
  }
  public getPosition(): Position {
    return { x: this.x, y: this.y };
  }
  public getSize(): Size {
    return { width: this.width, height: this.height };
  }
  public update(_deltaTime: number) {}
  public render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    switch (this.type) {
      case 'food':
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#B8860B';
        ctx.stroke();
        break;
      case 'scratches':
        ctx.fillStyle = '#C71585';
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-this.width / 3, 0);
        ctx.lineTo(this.width / 3, 0);
        ctx.stroke();
        break;
      case 'snuggles':
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.strokeStyle = '#1E90FF';
        ctx.beginPath();
        ctx.ellipse(0, 0, this.width / 4, this.height / 4, 0, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case 'comfort':
        ctx.fillStyle = '#98FB98';
        ctx.beginPath();
        ctx.arc(0, 0, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#228B22';
        ctx.stroke();
        break;
      case 'toy':
        ctx.fillStyle = '#FF6347';
        ctx.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.strokeStyle = '#222';
        ctx.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
        ctx.fillStyle = '#fff';
        ctx.font = `${this.width / 2}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🦊', 0, 0);
        break;
    }
    ctx.restore();
  }
}