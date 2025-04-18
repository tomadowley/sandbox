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
    // Chase AI
    const dx = cleoPos.x - this.x;
    const dy = cleoPos.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    this.x += (dx / dist) * this.speed;
    this.y += (dy / dist) * this.speed;
  }
  public render(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
    // BODY (big, dark)
    ctx.fillStyle = "#222";
    ctx.strokeStyle = "#311d0b";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.rect(-this.width / 2, -this.height / 2, this.width, this.height * 0.9);
    ctx.fill();
    ctx.stroke();
    // HEAD
    ctx.save();
    ctx.translate(0, -this.height * 0.4);
    ctx.beginPath();
    ctx.ellipse(0, 0, this.width * 0.35, this.height * 0.28, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#ffcc99";
    ctx.fill();
    ctx.stroke();
    // JAW (prominent, for evilness)
    ctx.save();
    ctx.translate(0, this.height * 0.13);
    ctx.rotate(0.08);
    ctx.beginPath();
    ctx.ellipse(0, 0, this.width * 0.22, this.height * 0.10, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#c69e6d";
    ctx.fill();
    ctx.stroke();
    ctx.restore();
    // EYES (evil red, angled)
    ctx.save();
    // Left
    ctx.beginPath();
    ctx.ellipse(-this.width * 0.10, -this.height * 0.05, this.width * 0.09, this.width * 0.08, -0.25, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = "#a00";
    ctx.setLineDash([3,2]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(-this.width * 0.10, -this.height * 0.05, this.width*0.033, 0, Math.PI*2);
    ctx.fillStyle = "#c00";
    ctx.fill();
    ctx.restore();
    // Right
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(this.width * 0.09, -this.height * 0.04, this.width * 0.08, this.width * 0.065, 0.21, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = "#a00";
    ctx.setLineDash([3,2]);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.beginPath();
    ctx.arc(this.width * 0.09, -this.height * 0.04, this.width*0.028, 0, Math.PI*2);
    ctx.fillStyle = "#c00";
    ctx.fill();
    ctx.restore();
    // EYEBROWS (villainous)
    ctx.strokeStyle = "#420";
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-this.width*0.14, -this.height*0.13);
    ctx.lineTo(-this.width*0.01, -this.height*0.1);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(this.width*0.01, -this.height*0.095);
    ctx.lineTo(this.width*0.14, -this.height*0.12);
    ctx.stroke();
    // MOUTH (sneer, fangs)
    ctx.save();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#a00";
    ctx.beginPath();
    ctx.moveTo(-this.width*0.08, this.height * 0.07);
    ctx.quadraticCurveTo(0, this.height*0.1, this.width*0.09, this.height*0.08);
    ctx.stroke();
    // Fangs
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.moveTo(-this.width*0.022, this.height*0.099);
    ctx.lineTo(-this.width*0.017, this.height*0.12);
    ctx.lineTo(-this.width*0.007, this.height*0.095);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(this.width*0.027, this.height*0.102);
    ctx.lineTo(this.width*0.035, this.height*0.118);
    ctx.lineTo(this.width*0.013, this.height*0.094);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    // Facial highlight
    ctx.globalAlpha = 0.12;
    ctx.beginPath();
    ctx.ellipse(0, -this.height*0.08, this.width*0.15, this.height*0.07, 0, 0, Math.PI*2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.restore(); // end head save
    // ARMS
    for (let i = 0; i < 2; i++) {
      ctx.save();
      ctx.rotate(i === 0 ? -0.22 : 0.17);
      ctx.translate(i===0 ? -this.width*0.4 : this.width*0.4, this.height*0.30);
      ctx.fillStyle = "#222";
      ctx.beginPath();
      ctx.ellipse(0, 0, this.width*0.12, this.height*0.21, 0, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
    // Legs
    for (let i = 0; i < 2; i++) {
      ctx.save();
      ctx.translate(i ? this.width*0.25 : -this.width*0.25, this.height*0.35);
      ctx.fillStyle = "#181818";
      ctx.beginPath();
      ctx.ellipse(0, 0, this.width*0.10, this.height*0.16, 0, 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }
}