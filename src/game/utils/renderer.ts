import { GameState, GameObject, Nana } from '../types/gameTypes';

// Color palette with improved contrast
const COLORS = {
  BACKGROUND: '#f8f8f8',
  NANA_BODY: '#8a2be2',
  NANA_FACE: '#ffd700',
  BEER: '#ffa500',       // Brighter orange for beer
  WINE: '#b30000',       // Brighter red for wine
  WATER: '#0080ff',      // More vibrant blue for water
  COFFEE: '#3d2314',     // Darker brown for coffee
  OUTLINE: '#000000',    // Black outline for better visibility
};

export function drawGame(ctx: CanvasRenderingContext2D, gameState: GameState): void {
  const { nana, gameObjects } = gameState;
  
  // Clear the canvas
  ctx.fillStyle = COLORS.BACKGROUND;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  // Draw game objects (drinks and obstacles)
  drawGameObjects(ctx, gameObjects);
  
  // Draw Nana
  drawNana(ctx, nana, gameState.drunkenness);
}

function drawNana(ctx: CanvasRenderingContext2D, nana: Nana, drunkenness: number): void {
  const { position, size } = nana;
  
  // Save the current state
  ctx.save();
  
  // Check if Nana is completely drunk (100%)
  if (drunkenness >= 100) {
    // Draw Nana fallen on her face
    drawFallenNana(ctx, position, size);
  } else {
    // Draw normal Nana
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
  }
  
  // Restore the previous state
  ctx.restore();
}

// New function to draw Nana fallen on her face
function drawFallenNana(ctx: CanvasRenderingContext2D, position: {x: number, y: number}, size: {width: number, height: number}): void {
  // Draw Nana's body sideways/fallen
  ctx.fillStyle = COLORS.NANA_BODY;
  
  // Body - elongated horizontally to show lying down
  ctx.beginPath();
  ctx.ellipse(
    position.x, 
    position.y + size.height / 4, // Move down slightly
    size.width / 1.5,             // Wider
    size.height / 3,              // Shorter
    0, 0, Math.PI * 2
  );
  ctx.fill();
  
  // Head - slightly to the side
  ctx.fillStyle = COLORS.NANA_FACE;
  ctx.beginPath();
  ctx.arc(
    position.x - size.width / 4,  // Offset to the left
    position.y + size.height / 4, // Same level as body
    size.width / 3,
    0,
    Math.PI * 2
  );
  ctx.fill();
  
  // Face down details - X eyes
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  
  // Left X eye
  const eyeX = position.x - size.width/4;
  const eyeY = position.y + size.height/4;
  const eyeSize = 6;
  
  // Left eye X
  ctx.beginPath();
  ctx.moveTo(eyeX - eyeSize, eyeY - eyeSize);
  ctx.lineTo(eyeX + eyeSize, eyeY + eyeSize);
  ctx.moveTo(eyeX + eyeSize, eyeY - eyeSize);
  ctx.lineTo(eyeX - eyeSize, eyeY + eyeSize);
  ctx.stroke();
  
  // Dizzy spiral above head
  ctx.beginPath();
  const spiralX = position.x - size.width/6;
  const spiralY = position.y;
  const spiralRadius = size.width/8;
  
  for (let i = 0; i < 2 * Math.PI; i += 0.2) {
    const radius = (i / (2 * Math.PI)) * spiralRadius;
    const x = spiralX + Math.cos(i) * radius;
    const y = spiralY + Math.sin(i) * radius;
    
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  }
  ctx.stroke();
  
  // ZZZ to show passed out
  ctx.font = '16px Arial';
  ctx.fillStyle = 'black';
  ctx.fillText('Z', position.x + size.width/4, position.y - size.height/8);
  ctx.fillText('Z Z', position.x + size.width/3, position.y - size.height/4);
  ctx.fillText('Z Z Z', position.x + size.width/2, position.y - size.height/3);
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
  // Beer mug - add outline for better visibility
  ctx.strokeStyle = COLORS.OUTLINE;
  ctx.lineWidth = 2;
  ctx.strokeRect(position.x - size.width/2, position.y - size.height/2, size.width, size.height);
  
  ctx.fillStyle = '#f5f5dc'; // Mug color
  ctx.fillRect(position.x - size.width/2, position.y - size.height/2, size.width, size.height);
  
  // Beer liquid with brighter color
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
  
  // Outline the handle
  ctx.strokeStyle = COLORS.OUTLINE;
  ctx.lineWidth = 1;
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
  
  // Add glow effect
  ctx.shadowColor = COLORS.BEER;
  ctx.shadowBlur = 10;
}

function drawWine(ctx: CanvasRenderingContext2D, position: {x: number, y: number}, size: {width: number, height: number}): void {
  // Wine glass with outline
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
  
  // Draw outline for better visibility
  ctx.strokeStyle = COLORS.OUTLINE;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Add white glass effect
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Wine with brighter color
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
  ctx.strokeStyle = COLORS.OUTLINE;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Add subtle glow effect
  ctx.shadowColor = COLORS.WINE;
  ctx.shadowBlur = 10;
}

function drawWater(ctx: CanvasRenderingContext2D, position: {x: number, y: number}, size: {width: number, height: number}): void {
  // Water glass with outline
  ctx.beginPath();
  ctx.moveTo(position.x - size.width/2, position.y + size.height/2);
  ctx.lineTo(position.x - size.width/3, position.y - size.height/2);
  ctx.lineTo(position.x + size.width/3, position.y - size.height/2);
  ctx.lineTo(position.x + size.width/2, position.y + size.height/2);
  ctx.closePath();
  
  // Draw outline for better visibility
  ctx.strokeStyle = COLORS.OUTLINE;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Add glass effect
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Water with more vibrant color
  ctx.beginPath();
  ctx.moveTo(position.x - size.width/3 + 2, position.y - size.height/3);
  ctx.lineTo(position.x + size.width/3 - 2, position.y - size.height/3);
  ctx.lineTo(position.x + size.width/2 - 2, position.y + size.height/2 - 2);
  ctx.lineTo(position.x - size.width/2 + 2, position.y + size.height/2 - 2);
  ctx.closePath();
  ctx.fillStyle = COLORS.WATER;
  ctx.fill();
  
  // Add wavy pattern to make it clearly water
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.beginPath();
  const waveY = position.y - size.height/6;
  ctx.moveTo(position.x - size.width/3 + 5, waveY);
  
  // Draw wavy line across the water
  for (let i = 0; i <= 6; i++) {
    const x = position.x - size.width/3 + 5 + i * (size.width/3*2 - 10) / 6;
    const yOffset = i % 2 === 0 ? -3 : 3;
    ctx.lineTo(x, waveY + yOffset);
  }
  ctx.stroke();
  
  // Ice cubes
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  
  // First ice cube
  ctx.fillRect(
    position.x - size.width/6, 
    position.y - size.height/4, 
    size.width/6, 
    size.width/6
  );
  ctx.strokeRect(
    position.x - size.width/6, 
    position.y - size.height/4, 
    size.width/6, 
    size.width/6
  );
  
  // Second ice cube
  ctx.fillRect(
    position.x + size.width/12, 
    position.y - size.height/6, 
    size.width/6, 
    size.width/6
  );
  ctx.strokeRect(
    position.x + size.width/12, 
    position.y - size.height/6, 
    size.width/6, 
    size.width/6
  );
}

function drawCoffee(ctx: CanvasRenderingContext2D, position: {x: number, y: number}, size: {width: number, height: number}): void {
  // Coffee cup with outline
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
  
  // Draw outline for better visibility
  ctx.strokeStyle = COLORS.OUTLINE;
  ctx.lineWidth = 2;
  ctx.stroke();
  
  // Coffee inside with darker color for better contrast
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
  
  // Outline the handle
  ctx.strokeStyle = COLORS.OUTLINE;
  ctx.lineWidth = 1;
  ctx.stroke();
  
  // Add a coffee bean design on the cup for better identification
  ctx.fillStyle = '#6f4e37';
  ctx.beginPath();
  ctx.ellipse(
    position.x, 
    position.y - 5, 
    size.width/10, 
    size.height/8, 
    Math.PI/4, 0, Math.PI * 2
  );
  ctx.fill();
  
  ctx.beginPath();
  ctx.ellipse(
    position.x + 2, 
    position.y + 5, 
    size.width/10, 
    size.height/8, 
    -Math.PI/4, 0, Math.PI * 2
  );
  ctx.fill();
  
  // Steam (more visible)
  ctx.strokeStyle = 'white';
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