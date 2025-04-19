import { GameState, GameObject, Nana } from '../types/gameTypes';

// Color palette
const COLORS = {
  BACKGROUND: '#f8f8f8',
  NANA_BODY: '#8a2be2',
  NANA_FACE: '#ffd700',
  BEER: '#ffd700',
  WINE: '#800020',
  WATER: '#87cefa',
  COFFEE: '#654321',
};

export function drawGame(ctx: CanvasRenderingContext2D, gameState: GameState): void {
  const { nana, gameObjects } = gameState;
  
  // Clear the canvas
  ctx.fillStyle = COLORS.BACKGROUND;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  // Draw game objects (drinks and obstacles)
  drawGameObjects(ctx, gameObjects);
  
  // Draw Nana
  drawNana(ctx, nana);
}

function drawNana(ctx: CanvasRenderingContext2D, nana: Nana): void {
  const { position, size } = nana;
  
  // Save the current state
  ctx.save();
  
  // Draw Nana's body (stylized)
  ctx.fillStyle = COLORS.NANA_BODY;
  
  // Body
  ctx.beginPath();
  ctx.ellipse(
    position.x, 
    position.y, 
    size.width / 2, 
    size.height / 2, 
    0, 0, Math.PI * 2
  );
  ctx.fill();
  
  // Head
  ctx.fillStyle = COLORS.NANA_FACE;
  ctx.beginPath();
  ctx.arc(
    position.x,
    position.y - size.height / 4,
    size.width / 3,
    0,
    Math.PI * 2
  );
  ctx.fill();
  
  // Eyes
  ctx.fillStyle = 'black';
  
  // Left eye - squiggly to show drunkenness
  const leftEyeX = position.x - size.width/6;
  const rightEyeX = position.x + size.width/6;
  const eyeY = position.y - size.height/4;
  
  ctx.beginPath();
  ctx.arc(leftEyeX, eyeY, 5, 0, Math.PI * 2);
  ctx.fill();
  
  // Right eye - squiggly to show drunkenness
  ctx.beginPath();
  ctx.arc(rightEyeX, eyeY, 5, 0, Math.PI * 2);
  ctx.fill();
  
  // Drunk smile with squiggly line
  ctx.beginPath();
  ctx.moveTo(position.x - size.width/5, position.y - size.height/6);
  
  // Create a wavy smile
  ctx.bezierCurveTo(
    position.x - size.width/10, position.y - size.height/10 + 5,
    position.x + size.width/10, position.y - size.height/10 + 5,
    position.x + size.width/5, position.y - size.height/6
  );
  
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Draw some movement lines to indicate drunkenness
  ctx.strokeStyle = 'rgba(138, 43, 226, 0.5)';
  ctx.beginPath();
  for (let i = 0; i < 3; i++) {
    const offsetX = Math.sin(Date.now() / 200 + i) * 10;
    const offsetY = Math.cos(Date.now() / 200 + i) * 5;
    ctx.moveTo(position.x + size.width/2 + offsetX, position.y + offsetY);
    ctx.lineTo(position.x + size.width/2 + 15 + offsetX, position.y + 10 + offsetY);
  }
  ctx.stroke();
  
  // Restore the previous state
  ctx.restore();
}

function drawGameObjects(ctx: CanvasRenderingContext2D, gameObjects: GameObject[]): void {
  gameObjects.forEach(obj => {
    const { position, size, type } = obj;
    
    ctx.save();
    
    // Set color based on object type
    switch(type) {
      case 'beer':
        drawBeer(ctx, position, size);
        break;
      case 'wine':
        drawWine(ctx, position, size);
        break;
      case 'water':
        drawWater(ctx, position, size);
        break;
      case 'coffee':
        drawCoffee(ctx, position, size);
        break;
      default:
        // Default fallback
        ctx.fillStyle = 'gray';
        ctx.fillRect(position.x - size.width/2, position.y - size.height/2, size.width, size.height);
    }
    
    ctx.restore();
  });
}

function drawBeer(ctx: CanvasRenderingContext2D, position: {x: number, y: number}, size: {width: number, height: number}): void {
  // Beer mug
  ctx.fillStyle = '#f5f5dc'; // Mug color
  ctx.fillRect(position.x - size.width/2, position.y - size.height/2, size.width, size.height);
  
  // Beer liquid
  ctx.fillStyle = COLORS.BEER;
  ctx.fillRect(
    position.x - size.width/2 + 2, 
    position.y - size.height/2 + size.height/4, 
    size.width - 4, 
    size.height - size.height/3
  );
  
  // Mug handle
  ctx.beginPath();
  ctx.arc(
    position.x + size.width/2, 
    position.y, 
    size.width/3, 
    -Math.PI/2, 
    Math.PI/2
  );
  ctx.strokeStyle = '#f5f5dc';
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // Foam
  ctx.fillStyle = 'white';
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.arc(
      position.x - size.width/4 + i * size.width/4, 
      position.y - size.height/2 + size.height/4, 
      size.width/8, 
      0, 
      Math.PI * 2
    );
    ctx.fill();
  }
}

function drawWine(ctx: CanvasRenderingContext2D, position: {x: number, y: number}, size: {width: number, height: number}): void {
  // Wine glass
  ctx.beginPath();
  // Glass stem
  ctx.moveTo(position.x, position.y + size.height/2);
  ctx.lineTo(position.x, position.y - size.height/6);
  
  // Glass bowl
  ctx.bezierCurveTo(
    position.x - size.width/2, position.y - size.height/3,
    position.x - size.width/2, position.y - size.height/2,
    position.x, position.y - size.height/2
  );
  ctx.bezierCurveTo(
    position.x + size.width/2, position.y - size.height/2,
    position.x + size.width/2, position.y - size.height/3,
    position.x, position.y - size.height/6
  );
  
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Wine
  ctx.beginPath();
  ctx.moveTo(position.x, position.y - size.height/6);
  ctx.bezierCurveTo(
    position.x - size.width/2 + 5, position.y - size.height/3 + 5,
    position.x - size.width/2 + 5, position.y - size.height/2 + 10,
    position.x, position.y - size.height/2 + 10
  );
  ctx.bezierCurveTo(
    position.x + size.width/2 - 5, position.y - size.height/2 + 10,
    position.x + size.width/2 - 5, position.y - size.height/3 + 5,
    position.x, position.y - size.height/6
  );
  
  ctx.fillStyle = COLORS.WINE;
  ctx.fill();
  
  // Glass base
  ctx.beginPath();
  ctx.ellipse(
    position.x, 
    position.y + size.height/2, 
    size.width/4, 
    size.height/10, 
    0, 0, Math.PI * 2
  );
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.stroke();
}

function drawWater(ctx: CanvasRenderingContext2D, position: {x: number, y: number}, size: {width: number, height: number}): void {
  // Water glass
  ctx.beginPath();
  ctx.moveTo(position.x - size.width/2, position.y + size.height/2);
  ctx.lineTo(position.x - size.width/3, position.y - size.height/2);
  ctx.lineTo(position.x + size.width/3, position.y - size.height/2);
  ctx.lineTo(position.x + size.width/2, position.y + size.height/2);
  ctx.closePath();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Water
  ctx.beginPath();
  ctx.moveTo(position.x - size.width/3 + 2, position.y - size.height/3);
  ctx.lineTo(position.x + size.width/3 - 2, position.y - size.height/3);
  ctx.lineTo(position.x + size.width/2 - 2, position.y + size.height/2 - 2);
  ctx.lineTo(position.x - size.width/2 + 2, position.y + size.height/2 - 2);
  ctx.closePath();
  ctx.fillStyle = COLORS.WATER;
  ctx.fill();
  
  // Ice cubes
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillRect(
    position.x - size.width/6, 
    position.y - size.height/4, 
    size.width/6, 
    size.width/6
  );
  ctx.fillRect(
    position.x + size.width/12, 
    position.y - size.height/6, 
    size.width/6, 
    size.width/6
  );
}

function drawCoffee(ctx: CanvasRenderingContext2D, position: {x: number, y: number}, size: {width: number, height: number}): void {
  // Coffee cup
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.ellipse(
    position.x, 
    position.y, 
    size.width/2, 
    size.height/3, 
    0, 0, Math.PI * 2
  );
  ctx.fill();
  
  // Coffee inside
  ctx.fillStyle = COLORS.COFFEE;
  ctx.beginPath();
  ctx.ellipse(
    position.x, 
    position.y, 
    size.width/2 - 3, 
    size.height/3 - 3, 
    0, 0, Math.PI * 2
  );
  ctx.fill();
  
  // Handle
  ctx.beginPath();
  ctx.arc(
    position.x + size.width/2, 
    position.y, 
    size.width/4, 
    -Math.PI/2, 
    Math.PI/2
  );
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // Steam
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 3; i++) {
    ctx.beginPath();
    ctx.moveTo(position.x - size.width/6 + i * size.width/6, position.y - size.height/3);
    
    // Wavy steam line
    const steamHeight = size.height/2;
    const waveOffset = Math.sin(Date.now() / 500 + i) * 5;
    
    ctx.bezierCurveTo(
      position.x - size.width/6 + i * size.width/6 - 5, position.y - size.height/3 - steamHeight/3,
      position.x - size.width/6 + i * size.width/6 + 5 + waveOffset, position.y - size.height/3 - steamHeight*2/3,
      position.x - size.width/6 + i * size.width/6, position.y - size.height/3 - steamHeight
    );
    
    ctx.stroke();
  }
}