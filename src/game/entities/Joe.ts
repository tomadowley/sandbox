import { Entity, Position, Size } from '../../types';

class Joe implements Entity {
  private position: Position;
  private size: Size;
  private speed: number = 1.5;
  private direction: { x: number; y: number } = { x: 0, y: 0 };
  private animationFrame: number = 0;
  private animationCounter: number = 0;
  private chaseTimeout: number = 0;

  constructor(config: { x: number; y: number; width: number; height: number }) {
    this.position = { x: config.x, y: config.y };
    this.size = { width: config.width, height: config.height };
  }

  public getPosition(): Position {
    return { ...this.position };
  }

  public getSize(): Size {
    return { ...this.size };
  }

  public setPosition(position: Position): void {
    this.position = { ...position };
  }

  public setSpeed(speed: number): void {
    this.speed = speed;
  }

  public update(deltaTime: number, targetPosition: Position): void {
    // Update animation
    this.animationCounter += deltaTime;
    if (this.animationCounter > 200) {
      this.animationCounter = 0;
      this.animationFrame = (this.animationFrame + 1) % 4;
    }
    
    // Update chase timeout
    this.chaseTimeout -= deltaTime;
    
    if (this.chaseTimeout <= 0) {
      // Calculate direction to target
      const dx = targetPosition.x - this.position.x;
      const dy = targetPosition.y - this.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Normalize direction
      if (distance > 0) {
        this.direction.x = dx / distance;
        this.direction.y = dy / distance;
      }
      
      // Add some randomness to Joe's movement
      if (Math.random() < 0.05) {
        this.direction.x += (Math.random() - 0.5) * 0.5;
        this.direction.y += (Math.random() - 0.5) * 0.5;
        
        // Normalize again
        const newDistance = Math.sqrt(
          this.direction.x * this.direction.x + 
          this.direction.y * this.direction.y
        );
        
        if (newDistance > 0) {
          this.direction.x /= newDistance;
          this.direction.y /= newDistance;
        }
      }
      
      // Move Joe
      this.position.x += this.direction.x * this.speed;
      this.position.y += this.direction.y * this.speed;
      
      // Keep Joe within canvas bounds
      this.position.x = Math.max(0, Math.min(800 - this.size.width, this.position.x));
      this.position.y = Math.max(0, Math.min(600 - this.size.height, this.position.y));
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    
    // Draw Joe (human antagonist)
    ctx.fillStyle = '#4A4A4A'; // Dark gray for Joe
    
    // Body
    ctx.fillRect(
      this.position.x,
      this.position.y,
      this.size.width,
      this.size.height
    );
    
    // Head
    ctx.fillStyle = '#FFD700'; // Blonde hair
    ctx.fillRect(
      this.position.x,
      this.position.y - 20,
      this.size.width,
      20
    );
    
    ctx.fillStyle = '#FFD8B1'; // Skin tone
    ctx.fillRect(
      this.position.x + 5,
      this.position.y - 15,
      this.size.width - 10,
      15
    );
    
    // Eyes
    ctx.fillStyle = 'black';
    ctx.fillRect(
      this.position.x + 10,
      this.position.y - 10,
      5,
      5
    );
    ctx.fillRect(
      this.position.x + this.size.width - 15,
      this.position.y - 10,
      5,
      5
    );
    
    // Arms (animated)
    const armOffset = Math.sin(this.animationFrame * Math.PI / 2) * 5;
    
    ctx.fillStyle = '#4A4A4A';
    ctx.fillRect(
      this.position.x - 10,
      this.position.y + 10 + armOffset,
      10,
      this.size.height / 2
    );
    ctx.fillRect(
      this.position.x + this.size.width,
      this.position.y + 10 - armOffset,
      10,
      this.size.height / 2
    );
    
    // Label
    ctx.fillStyle = 'white';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(
      'JOE',
      this.position.x + this.size.width / 2,
      this.position.y + this.size.height + 15
    );
    
    ctx.restore();
  }
}

export default Joe;
