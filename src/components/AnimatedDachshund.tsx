import React, { useRef, useEffect } from 'react';

interface AnimatedDachshundProps {
  style?: string;
  size?: number;
}

// Define a proper interface for style configs
interface StyleConfig {
  bodyColor: string;
  outlineColor: string;
  background: string;
  speed: number;
  pixelate?: boolean;
  blur?: boolean;
  thickOutline?: boolean;
}

const AnimatedDachshund: React.FC<AnimatedDachshundProps> = ({ 
  style = 'default', 
  size = 300 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Animation styles
  const styles: Record<string, StyleConfig> = {
    default: {
      bodyColor: '#8B4513',
      outlineColor: '#4A2511',
      background: 'transparent',
      speed: 1
    },
    neon: {
      bodyColor: '#FF00FF',
      outlineColor: '#00FFFF',
      background: '#000',
      speed: 1.5
    },
    pixel: {
      bodyColor: '#A52A2A',
      outlineColor: '#800000',
      background: 'transparent',
      speed: 0.8,
      pixelate: true
    },
    watercolor: {
      bodyColor: '#D2691E',
      outlineColor: '#8B4513',
      background: '#FFF5E6',
      speed: 0.7,
      blur: true
    },
    cartoon: {
      bodyColor: '#CD853F',
      outlineColor: '#000000',
      background: 'transparent',
      speed: 1.2,
      thickOutline: true
    }
  };
  
  // Get style config
  const styleConfig = styles[style as keyof typeof styles] || styles.default;
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size
    canvas.width = size;
    canvas.height = size;
    
    let frameId: number;
    let frame = 0;
    
    const drawDachshund = (time: number) => {
      if (!ctx) return;
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw background if needed
      if (styleConfig.background !== 'transparent') {
        ctx.fillStyle = styleConfig.background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      // Calculate center and scale
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scale = size / 300; // Scale based on size prop
      
      // Animation parameters
      const walkCycle = Math.sin(time * 0.1 * styleConfig.speed);
      const tailWag = Math.sin(time * 0.2 * styleConfig.speed);
      const bodyBounce = Math.abs(Math.sin(time * 0.1 * styleConfig.speed)) * 5;
      
      // Set line style - Using optional chaining to safely access thickOutline
      ctx.lineWidth = styleConfig.thickOutline ? 5 * scale : 3 * scale;
      ctx.strokeStyle = styleConfig.outlineColor;
      
      // Draw body
      ctx.save();
      ctx.translate(centerX, centerY + bodyBounce * scale);
      
      // Body
      ctx.beginPath();
      ctx.ellipse(0, 0, 80 * scale, 30 * scale, 0, 0, Math.PI * 2);
      ctx.fillStyle = styleConfig.bodyColor;
      ctx.fill();
      ctx.stroke();
      
      // Head
      ctx.beginPath();
      ctx.ellipse(-100 * scale, 0, 35 * scale, 25 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Snout
      ctx.beginPath();
      ctx.ellipse(-125 * scale, 0, 15 * scale, 10 * scale, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Eyes
      ctx.beginPath();
      ctx.arc(-110 * scale, -10 * scale, 3 * scale, 0, Math.PI * 2);
      ctx.fillStyle = 'black';
      ctx.fill();
      
      // Ears
      ctx.beginPath();
      ctx.ellipse(-110 * scale, -20 * scale, 15 * scale, 8 * scale, -0.3, 0, Math.PI * 2);
      ctx.fillStyle = styleConfig.bodyColor;
      ctx.fill();
      ctx.stroke();
      
      ctx.beginPath();
      ctx.ellipse(-90 * scale, -20 * scale, 15 * scale, 8 * scale, 0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Tail
      ctx.save();
      ctx.translate(90 * scale, 0);
      ctx.rotate(tailWag * 0.3);
      ctx.beginPath();
      ctx.ellipse(10 * scale, 0, 25 * scale, 8 * scale, 0, 0, Math.PI * 2);
      ctx.fillStyle = styleConfig.bodyColor;
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      
      // Legs
      const legPositions = [
        { x: -60 * scale, y: 30 * scale, phase: 0 },
        { x: 60 * scale, y: 30 * scale, phase: Math.PI },
        { x: -20 * scale, y: 30 * scale, phase: Math.PI },
        { x: 20 * scale, y: 30 * scale, phase: 0 }
      ];
      
      legPositions.forEach(leg => {
        const legHeight = 25 * scale;
        const legOffset = Math.sin(time * 0.1 * styleConfig.speed + leg.phase) * 5 * scale;
        
        ctx.beginPath();
        ctx.roundRect(
          leg.x - 5 * scale,
          leg.y + legOffset,
          10 * scale,
          legHeight,
          5 * scale
        );
        ctx.fillStyle = styleConfig.bodyColor;
        ctx.fill();
        ctx.stroke();
      });
      
      ctx.restore();
      
      // Apply special effects
      if (styleConfig.pixelate) {
        // Simulate pixel art effect
        const pixelSize = 4 * scale;
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        
        if (tempCtx) {
          // Draw current canvas to temp canvas
          tempCtx.drawImage(canvas, 0, 0);
          
          // Clear original canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          
          // Draw pixelated version
          for (let x = 0; x < canvas.width; x += pixelSize) {
            for (let y = 0; y < canvas.height; y += pixelSize) {
              const pixel = tempCtx.getImageData(x, y, 1, 1).data;
              if (pixel[3] > 0) { // If not transparent
                ctx.fillStyle = `rgba(${pixel[0]}, ${pixel[1]}, ${pixel[2]}, ${pixel[3]/255})`;
                ctx.fillRect(x, y, pixelSize, pixelSize);
              }
            }
          }
        }
      }
      
      if (styleConfig.blur) {
        // Add a watercolor effect with subtle blur
        ctx.filter = 'blur(2px)';
        ctx.drawImage(canvas, 0, 0);
        ctx.filter = 'none';
      }
      
      // Add style-specific effects
      if (style === 'neon') {
        ctx.shadowBlur = 15;
        ctx.shadowColor = styleConfig.outlineColor;
        ctx.beginPath();
        ctx.ellipse(centerX, centerY + bodyBounce * scale, 80 * scale, 30 * scale, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    };
    
    const animate = () => {
      drawDachshund(frame);
      frame++;
      frameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [size, style, styleConfig]);
  
  return (
    <canvas 
      ref={canvasRef} 
      className={`animated-dachshund ${style}-style`}
      width={size} 
      height={size}
    />
  );
};

export default AnimatedDachshund;