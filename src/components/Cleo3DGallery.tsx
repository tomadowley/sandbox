import React, { useRef, useEffect } from 'react';

const Cleo3DGallery: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // 3D models for the scene
  const models = [
    {
      name: "Cleo in Neon Space",
      description: "Our overlord traversing the digital void, leaving a trail of neon light."
    },
    {
      name: "Royal Dachshund Throne",
      description: "A majestic visualization of Cleo on her interdimensional throne."
    },
    {
      name: "Cleo's Dream Sequence",
      description: "A surreal journey through Cleo's dreamscape, filled with treats and squirrels frozen in time."
    },
    {
      name: "Quantum Dachshund",
      description: "Cleo exists in multiple states simultaneously, a demonstration of her quantum nature."
    }
  ];
  
  // Mock 3D rendering - in reality we would use Three.js or another 3D library
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;
    
    let frameId: number;
    let time = 0;
    
    const render = () => {
      if (!canvas || !context) return;
      
      // Set canvas dimensions to match container
      if (containerRef.current) {
        canvas.width = containerRef.current.offsetWidth;
        canvas.height = containerRef.current.offsetHeight;
      }
      
      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Background gradient
      const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#8a2be2');
      gradient.addColorStop(1, '#ff69b4');
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw some animated 3D-looking shapes to represent our dachshund
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      // Body
      context.beginPath();
      context.ellipse(
        centerX, 
        centerY, 
        100 + Math.sin(time * 0.5) * 10, 
        40 + Math.sin(time * 0.3) * 5, 
        0, 
        0, 
        2 * Math.PI
      );
      context.fillStyle = '#8B4513';
      context.fill();
      context.strokeStyle = '#4A2511';
      context.lineWidth = 3;
      context.stroke();
      
      // Head
      context.beginPath();
      context.ellipse(
        centerX - 90, 
        centerY, 
        35 + Math.sin(time * 0.4) * 3, 
        30 + Math.sin(time * 0.2) * 2, 
        0, 
        0, 
        2 * Math.PI
      );
      context.fillStyle = '#8B4513';
      context.fill();
      context.strokeStyle = '#4A2511';
      context.lineWidth = 3;
      context.stroke();
      
      // Tail
      context.beginPath();
      context.ellipse(
        centerX + 110, 
        centerY, 
        20 + Math.sin(time * 0.6) * 5, 
        15 + Math.sin(time * 0.7) * 3, 
        0, 
        0, 
        2 * Math.PI
      );
      context.fillStyle = '#8B4513';
      context.fill();
      context.strokeStyle = '#4A2511';
      context.lineWidth = 3;
      context.stroke();
      
      // Legs
      const legPositions = [
        { x: centerX - 50, y: centerY + 40 },
        { x: centerX + 50, y: centerY + 40 },
        { x: centerX - 30, y: centerY + 40 },
        { x: centerX + 70, y: centerY + 40 }
      ];
      
      legPositions.forEach((pos, i) => {
        context.beginPath();
        context.roundRect(
          pos.x - 10, 
          pos.y, 
          20, 
          30 + Math.sin(time * 0.5 + i) * 5, 
          5
        );
        context.fillStyle = '#8B4513';
        context.fill();
        context.strokeStyle = '#4A2511';
        context.lineWidth = 2;
        context.stroke();
      });
      
      // Eyes
      context.beginPath();
      context.arc(centerX - 100, centerY - 5, 5, 0, 2 * Math.PI);
      context.fillStyle = 'black';
      context.fill();
      
      // Add some holographic effects
      for (let i = 0; i < 20; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 5 + 1;
        
        context.beginPath();
        context.arc(x, y, size, 0, 2 * Math.PI);
        context.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.5})`;
        context.fill();
      }
      
      // Add a "3D" grid
      context.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      context.lineWidth = 1;
      
      for (let i = 0; i < canvas.width; i += 30) {
        context.beginPath();
        context.moveTo(i, 0);
        context.lineTo(i, canvas.height);
        context.stroke();
      }
      
      for (let i = 0; i < canvas.height; i += 30) {
        context.beginPath();
        context.moveTo(0, i);
        context.lineTo(canvas.width, i);
        context.stroke();
      }
      
      // Add floating text like a HUD
      context.font = '14px monospace';
      context.fillStyle = 'rgba(255, 255, 255, 0.8)';
      context.fillText(`CLEO POWER: ${Math.floor(90 + Math.sin(time) * 10)}%`, 20, 30);
      context.fillText(`TREATS DETECTED: ${Math.floor(Math.random() * 10)}`, 20, 50);
      context.fillText(`REALITY DISTORTION: ACTIVE`, 20, 70);
      
      // Update time for animation
      time += 0.05;
      
      // Continue animation loop
      frameId = requestAnimationFrame(render);
    };
    
    render();
    
    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);
  
  return (
    <div className="gallery-3d-section">
      <div className="gallery-3d-container" ref={containerRef}>
        <canvas ref={canvasRef} className="gallery-3d-canvas"></canvas>
        
        <div className="gallery-3d-controls">
          <button className="control-btn">Rotate</button>
          <button className="control-btn">Zoom</button>
          <button className="control-btn">Reset</button>
        </div>
      </div>
      
      <div className="gallery-3d-models">
        {models.map((model, index) => (
          <div key={index} className="model-card">
            <h4>{model.name}</h4>
            <p>{model.description}</p>
            <button className="view-model-btn">View in 3D Space</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cleo3DGallery;