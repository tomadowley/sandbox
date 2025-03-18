import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import p5 from 'p5';

class Player {
  p: p5;
  pos: { x: number; y: number };
  health: number;
  size: number;
  score: number;
  
  constructor(p: p5) {
    this.p = p;
    this.pos = { x: 400, y: 400 };
    this.health = 100;
    this.size = 40;
    this.score = 0;
  }
  
  draw() {
    this.p.fill(0, 100, 0);
    this.p.rect(this.pos.x, this.pos.y, this.size, this.size);
    this.p.fill(150, 75, 0);
    this.p.ellipse(this.pos.x + this.size / 2, this.pos.y - 10, this.size - 10, this.size - 10);
  }
  
  move(direction: string) {
    const speed = 5;
    switch(direction) {
      case 'up':
        this.pos.y = Math.max(this.pos.y - speed, 0);
        break;
      case 'down':
        this.pos.y = Math.min(this.pos.y + speed, this.p.height - this.size);
        break;
      case 'left':
        this.pos.x = Math.max(this.pos.x - speed, 0);
        break;
      case 'right':
        this.pos.x = Math.min(this.pos.x + speed, this.p.width - this.size);
        break;
    }
  }
  
  shoot(): Bullet {
    return new Bullet(this.p, this.pos.x + this.size / 2, this.pos.y, 0, -10);
  }
}

class Enemy {
  p: p5;
  pos: { x: number; y: number };
  vel: { x: number; y: number };
  size: number;
  type: string;
  
  constructor(p: p5) {
    this.p = p;
    this.pos = { 
      x: p.random(0, p.width), 
      y: 0 
    };
    this.vel = { 
      x: p.random(-2, 2), 
      y: p.random(1, 3) 
    };
    this.size = 30;
    this.type = p.random(['soldier', 'officer']);
  }
  
  draw() {
    if (this.type === 'soldier') {
      this.p.fill(200, 0, 0);
    } else {
      this.p.fill(100, 0, 100);
    }
    this.p.rect(this.pos.x, this.pos.y, this.size, this.size);
  }
  
  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    
    // Bounce off walls
    if (this.pos.x <= 0 || this.pos.x >= this.p.width - this.size) {
      this.vel.x *= -1;
    }
    
    return this.pos.y > this.p.height;
  }
  
  isHit(bullet: Bullet): boolean {
    return this.p.collideRectRect(
      this.pos.x, this.pos.y, this.size, this.size,
      bullet.pos.x, bullet.pos.y, bullet.size, bullet.size
    );
  }
}

class Bullet {
  p: p5;
  pos: { x: number; y: number };
  vel: { x: number; y: number };
  size: number;
  
  constructor(p: p5, x: number, y: number, vx: number, vy: number) {
    this.p = p;
    this.pos = { x, y };
    this.vel = { x: vx, y: vy };
    this.size = 10;
  }
  
  draw() {
    this.p.fill(255, 255, 0);
    this.p.ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }
  
  update() {
    this.pos.x += this.vel.x;
    this.pos.y += this.vel.y;
    
    return this.pos.y < 0 || this.pos.y > this.p.height;
  }
}

function Game() {
  const sketchRef = useRef<HTMLDivElement>(null);
  const [touchControls, setTouchControls] = useState({
    showControls: false,
    isMobile: false
  });
  
  // Store movement direction for touch controls
  const touchDirectionRef = useRef<string | null>(null);
  const touchShootingRef = useRef<boolean>(false);
  
  useEffect(() => {
    // Check if we're on a mobile device
    const checkMobile = () => {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      setTouchControls(prev => ({
        ...prev,
        showControls: isMobile,
        isMobile
      }));
      return isMobile;
    };
    
    const isMobile = checkMobile();
    
    let player: Player;
    let bullets: Bullet[] = [];
    let enemies: Enemy[] = [];
    let lastEnemySpawn = 0;
    let isGameOver = false;
    let gameStarted = false;
    let p5Instance: any = null;
    
    // Interval ID for continuous shooting while touching shoot button
    let shootingIntervalId: NodeJS.Timeout | null = null;
    
    const sketch = (p: p5) => {
      p.setup = () => {
        // Create responsive canvas that fits container
        const canvas = p.createCanvas(800, 600);
        canvas.parent(sketchRef.current!);
        
        // Make canvas responsive
        if (isMobile) {
          const containerWidth = sketchRef.current?.clientWidth || 800;
          const containerHeight = (containerWidth / 800) * 600;
          p.resizeCanvas(containerWidth, containerHeight);
        }
        
        player = new Player(p);
        
        // Initialize p5.collide2D functions
        p.collideRectRect = (x1: number, y1: number, w1: number, h1: number, 
                             x2: number, y2: number, w2: number, h2: number) => {
          return x1 < x2 + w2 && 
                 x1 + w1 > x2 && 
                 y1 < y2 + h2 && 
                 y1 + h1 > y2;
        };
        
        // Handle window resize
        window.addEventListener('resize', () => {
          if (isMobile && sketchRef.current) {
            const containerWidth = sketchRef.current.clientWidth;
            const containerHeight = (containerWidth / 800) * 600;
            p.resizeCanvas(containerWidth, containerHeight);
          }
        });
      };
      
      p.draw = () => {
        p.background(100, 150, 255);
        
        // Check for touch direction and move player
        if (gameStarted && !isGameOver && touchDirectionRef.current) {
          player.move(touchDirectionRef.current);
        }
        
        // Check for touch shooting
        if (gameStarted && !isGameOver && touchShootingRef.current) {
          // Logic for handling shooting at a reasonable rate
          if (p.frameCount % 10 === 0) { // shoot every 10 frames
            bullets.push(player.shoot());
          }
        }
        
        if (!gameStarted) {
          p.fill(255);
          p.textSize(32);
          p.textAlign(p.CENTER);
          p.text("Revolution: The Fidel Castro Story", p.width/2, p.height/3);
          p.textSize(24);
          
          if (isMobile) {
            p.text("Tap anywhere to start the revolution", p.width/2, p.height/2);
            p.text("Use buttons to move and shoot", p.width/2, p.height/2 + 40);
          } else {
            p.text("Press ENTER to start the revolution", p.width/2, p.height/2);
            p.text("WASD to move, SPACE to shoot", p.width/2, p.height/2 + 40);
          }
          
          if (p.keyIsDown(p.ENTER)) {
            gameStarted = true;
          }
          return;
        }
        
        if (isGameOver) {
          p.fill(255);
          p.textSize(32);
          p.textAlign(p.CENTER);
          p.text("GAME OVER", p.width/2, p.height/2);
          p.textSize(24);
          p.text(`Final Score: ${player.score}`, p.width/2, p.height/2 + 40);
          
          if (isMobile) {
            p.text("Tap anywhere to restart", p.width/2, p.height/2 + 80);
          } else {
            p.text("Press ENTER to restart", p.width/2, p.height/2 + 80);
          }
          
          if (p.keyIsDown(p.ENTER)) {
            player = new Player(p);
            bullets = [];
            enemies = [];
            isGameOver = false;
          }
          return;
        }
        
        // Player keyboard movement (for desktop)
        if (p.keyIsDown(87)) player.move('up');    // W
        if (p.keyIsDown(83)) player.move('down');  // S
        if (p.keyIsDown(65)) player.move('left');  // A
        if (p.keyIsDown(68)) player.move('right'); // D
        
        // Spawn enemies
        if (p.millis() - lastEnemySpawn > 1000) {
          enemies.push(new Enemy(p));
          lastEnemySpawn = p.millis();
        }
        
        // Update and draw bullets
        for (let i = bullets.length - 1; i >= 0; i--) {
          bullets[i].draw();
          if (bullets[i].update()) {
            bullets.splice(i, 1);
          }
        }
        
        // Update and draw enemies
        for (let i = enemies.length - 1; i >= 0; i--) {
          enemies[i].draw();
          if (enemies[i].update()) {
            enemies.splice(i, 1);
            player.health -= 10;
            
            if (player.health <= 0) {
              isGameOver = true;
            }
          }
          
          // Check for bullet collisions
          for (let j = bullets.length - 1; j >= 0; j--) {
            if (enemies[i] && enemies[i].isHit(bullets[j])) {
              player.score += enemies[i].type === 'officer' ? 20 : 10;
              enemies.splice(i, 1);
              bullets.splice(j, 1);
              break;
            }
          }
        }
        
        // Draw player
        player.draw();
        
        // Display score and health
        p.fill(255);
        p.textSize(24);
        p.textAlign('left');
        p.text(`Score: ${player.score}`, 20, 30);
        p.text(`Health: ${player.health}`, 20, 60);
        
        // Draw mountains in background for Sierra Maestra
        p.fill(0, 100, 0);
        p.beginShape();
        p.vertex(0, p.height);
        p.vertex(0, p.height - 100);
        p.vertex(200, p.height - 200);
        p.vertex(400, p.height - 150);
        p.vertex(600, p.height - 250);
        p.vertex(p.width, p.height - 100);
        p.vertex(p.width, p.height);
        p.endShape('close');
      };
      
      p.keyPressed = () => {
        if (gameStarted && !isGameOver && p.keyCode === 32) { // Space
          bullets.push(player.shoot());
        }
      };
      
      // Touch handling for the canvas
      p.touchStarted = (event: TouchEvent) => {
        // Prevent default to avoid unwanted behaviors
        if (event.cancelable) {
          event.preventDefault();
        }
        
        // Start game or restart after game over
        if (!gameStarted || isGameOver) {
          if (!gameStarted) {
            gameStarted = true;
          } else if (isGameOver) {
            player = new Player(p);
            bullets = [];
            enemies = [];
            isGameOver = false;
          }
          return false;
        }
        
        // If game is active, shooting is handled in virtual controls
        return false;
      };
    };
    
    p5Instance = new p5(sketch);
    
    // Set up touch event handlers for virtual controls
    const handleTouchStart = (direction: string) => {
      touchDirectionRef.current = direction;
    };
    
    const handleTouchEnd = () => {
      touchDirectionRef.current = null;
    };
    
    const handleShootStart = () => {
      touchShootingRef.current = true;
      
      // For immediate first shot
      if (gameStarted && !isGameOver && player) {
        bullets.push(player.shoot());
      }
      
      // Setup interval for continuous shooting
      if (!shootingIntervalId) {
        shootingIntervalId = setInterval(() => {
          if (gameStarted && !isGameOver && player && touchShootingRef.current) {
            bullets.push(player.shoot());
          }
        }, 500); // shoot every 500ms
      }
    };
    
    const handleShootEnd = () => {
      touchShootingRef.current = false;
      
      // Clear shooting interval
      if (shootingIntervalId) {
        clearInterval(shootingIntervalId);
        shootingIntervalId = null;
      }
    };
    
    // Add event listeners for touch controls
    if (isMobile) {
      const upButton = document.getElementById('up-btn');
      const downButton = document.getElementById('down-btn');
      const leftButton = document.getElementById('left-btn');
      const rightButton = document.getElementById('right-btn');
      const shootButton = document.getElementById('shoot-btn');
      
      if (upButton) {
        upButton.addEventListener('touchstart', () => handleTouchStart('up'), { passive: false });
        upButton.addEventListener('touchend', handleTouchEnd, { passive: false });
      }
      
      if (downButton) {
        downButton.addEventListener('touchstart', () => handleTouchStart('down'), { passive: false });
        downButton.addEventListener('touchend', handleTouchEnd, { passive: false });
      }
      
      if (leftButton) {
        leftButton.addEventListener('touchstart', () => handleTouchStart('left'), { passive: false });
        leftButton.addEventListener('touchend', handleTouchEnd, { passive: false });
      }
      
      if (rightButton) {
        rightButton.addEventListener('touchstart', () => handleTouchStart('right'), { passive: false });
        rightButton.addEventListener('touchend', handleTouchEnd, { passive: false });
      }
      
      if (shootButton) {
        shootButton.addEventListener('touchstart', handleShootStart, { passive: false });
        shootButton.addEventListener('touchend', handleShootEnd, { passive: false });
      }
    }
    
    return () => {
      // Clean up touch event handlers
      if (isMobile) {
        const upButton = document.getElementById('up-btn');
        const downButton = document.getElementById('down-btn');
        const leftButton = document.getElementById('left-btn');
        const rightButton = document.getElementById('right-btn');
        const shootButton = document.getElementById('shoot-btn');
        
        if (upButton) {
          upButton.removeEventListener('touchstart', () => handleTouchStart('up'));
          upButton.removeEventListener('touchend', handleTouchEnd);
        }
        
        if (downButton) {
          downButton.removeEventListener('touchstart', () => handleTouchStart('down'));
          downButton.removeEventListener('touchend', handleTouchEnd);
        }
        
        if (leftButton) {
          leftButton.removeEventListener('touchstart', () => handleTouchStart('left'));
          leftButton.removeEventListener('touchend', handleTouchEnd);
        }
        
        if (rightButton) {
          rightButton.removeEventListener('touchstart', () => handleTouchStart('right'));
          rightButton.removeEventListener('touchend', handleTouchEnd);
        }
        
        if (shootButton) {
          shootButton.removeEventListener('touchstart', handleShootStart);
          shootButton.removeEventListener('touchend', handleShootEnd);
        }
      }
      
      // Clear shooting interval if it exists
      if (shootingIntervalId) {
        clearInterval(shootingIntervalId);
      }
      
      // Proper cleanup for p5 instance
      if (p5Instance) {
        // Access the internal _onunload method which properly cleans up resources
        if (typeof p5Instance._onunload === 'function') {
          p5Instance._onunload();
        }
        
        // Clean up any additional resources
        const canvas = document.querySelector('canvas');
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
        
        // Remove any global event listeners that p5 might have added
        window.removeEventListener('keydown', p5Instance._events?.keydown);
        window.removeEventListener('keyup', p5Instance._events?.keyup);
        window.removeEventListener('resize', p5Instance._events?.resize);
        
        // Set to null to allow garbage collection
        p5Instance = null;
      }
    };
  }, []);
  
  return (
    <div className="game-wrapper">
      <div ref={sketchRef} className="game-container"></div>
      
      {/* Mobile touch controls */}
      {touchControls.showControls && (
        <div className="touch-controls">
          <div className="direction-controls">
            <button id="up-btn" className="control-btn up-btn">▲</button>
            <div className="horizontal-controls">
              <button id="left-btn" className="control-btn left-btn">◄</button>
              <button id="right-btn" className="control-btn right-btn">►</button>
            </div>
            <button id="down-btn" className="control-btn down-btn">▼</button>
          </div>
          <div className="action-controls">
            <button id="shoot-btn" className="control-btn shoot-btn">SHOOT</button>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Game />
    </div>
  );
}

export default App;
