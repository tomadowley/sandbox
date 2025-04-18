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
  private speed: number = 9; // Faster Cleo
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
    this.x += dx * (this.speed / 4);
  }
  public moveY(dy: number) {
    this.y += dy * (this.speed / 4);
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
    // Detailed cartoon Cleo!
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    if (this.facingLeft) ctx.scale(-1, 1);
    // BODY
    ctx.fillStyle = "#8B4513";
    ctx.strokeStyle = "#55330a";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.ellipse(0, 0, this.width * 0.52, this.height * 0.36, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // CHEST highlight
    ctx.beginPath();
    ctx.ellipse(-this.width * 0.21, this.height * 0.04, this.width * 0.17, this.height * 0.13, Math.PI/6, 0, Math.PI * 2);
    ctx.fillStyle = "#b07a46";
    ctx.globalAlpha = 0.7;
    ctx.fill();
    ctx.globalAlpha = 1;
    // HEAD (slightly separate from body)
    ctx.save();
    ctx.translate(this.width * 0.43, 0);
    ctx.rotate(-0.06);
    ctx.fillStyle = "#a0522d";
    ctx.beginPath();
    ctx.ellipse(0, 0, this.height * 0.44, this.height * 0.34, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    // EARS
    ctx.save();
    ctx.rotate(-0.3);
    ctx.beginPath();
    ctx.ellipse(-this.height * 0.33, -this.height * 0.14, this.height * 0.21, this.height * 0.26, 0, 0, Math.PI*2);
    ctx.fillStyle = "#4c2306";
    ctx.globalAlpha = 0.95;
    ctx.fill();
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.restore();
    ctx.save();
    ctx.rotate(0.18);
    ctx.beginPath();
    ctx.ellipse(-this.height * 0.26, this.height * 0.22, this.height * 0.17, this.height * 0.14, 0, 0, Math.PI*2);
    ctx.fillStyle = "#4c2306";
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    // EYES - expressive, big and friendly
    ctx.save();
    // left
    ctx.beginPath();
    ctx.ellipse(this.height * 0.11, -this.height * 0.10, this.height * 0.09, this.height * 0.12, 0.15, 0, Math.PI*2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = "#222";
    ctx.stroke();
    // right
    ctx.beginPath();
    ctx.ellipse(this.height * 0.22, -this.height * 0.05, this.height * 0.08, this.height * 0.11, -0.08, 0, Math.PI*2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.stroke();
    // Pupils
    ctx.beginPath();
    ctx.arc(this.height * 0.12, -this.height * 0.09, this.height*0.04,0,Math.PI*2);
    ctx.fillStyle = "#1d1b19";
    ctx.fill();
    ctx.beginPath();
    ctx.arc(this.height * 0.23, -this.height * 0.06, this.height*0.035,0,Math.PI*2);
    ctx.fill();
    // Highlight
    ctx.beginPath();
    ctx.arc(this.height * 0.14, -this.height * 0.11, this.height*0.012, 0, Math.PI*2);
    ctx.fillStyle = "#fff";
    ctx.globalAlpha = 0.6;
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore();
    // MOUTH (smiling or puppy pant)
    ctx.save();
    ctx.lineWidth = 2.3;
    ctx.strokeStyle = "#822e14";
    ctx.beginPath();
    ctx.arc(this.height * 0.19, this.height * 0.08, this.height*0.069, Math.PI*0.22, Math.PI*0.78, false);
    ctx.stroke();
    // tongue
    ctx.beginPath();
    ctx.arc(this.height * 0.19, this.height * 0.13, this.height*0.025, 0, Math.PI, false);
    ctx.fillStyle = "#e47676";
    ctx.fill();
    ctx.restore();
    // Brows for a "sweet" look
    ctx.save();
    ctx.strokeStyle = "#443117";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(this.height*0.11, -this.height*0.18, this.height*0.06, 0.8, 2.6, false);
    ctx.stroke();
    ctx.restore();
    ctx.restore(); // head
    // LEGS (defined paws and two rear, two front)
    for (let i = 0; i < 4; i++) {
      ctx.save();
      let lx = (i < 2 ? -0.22 : 0.11) * this.width; // rear/front
      let ly = (i % 2 ? 0.26 : 0.16) * this.height;
      ctx.translate(lx, ly);
      ctx.rotate(-0.11 + i*0.09); // slight angle
      ctx.fillStyle = "#623411";
      ctx.beginPath();
      ctx.ellipse(0, 0, this.height*0.075, this.height*0.17, 0, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
      // paw definition
      ctx.save();
      ctx.translate(lx, ly + this.height*0.07);
      ctx.strokeStyle = "#2a1706";
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(-this.height*0.03, 0);
      ctx.lineTo(this.height*0.03, 0);
      ctx.stroke();
      ctx.restore();
    }
    // TAIL (with wag)
    ctx.save();
    let wag = Math.sin(Date.now() / 90) * 10;
    ctx.lineWidth = 3.4;
    ctx.strokeStyle = "#4A2511";
    ctx.beginPath();
    ctx.moveTo(-this.width*0.5, -this.height*0.02);
    ctx.quadraticCurveTo(-this.width*0.65, 0 - wag, -this.width*0.6, -this.height*0.22 - wag);
    ctx.stroke();
    ctx.restore();
    ctx.restore();
  }
}