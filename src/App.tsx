import React, { useEffect, useRef } from 'react';
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
  
  useEffect(() => {
    let player: Player;
    let bullets: Bullet[] = [];
    let enemies: Enemy[] = [];
    let lastEnemySpawn = 0;
    let isGameOver = false;
    let gameStarted = false;
    let p5Instance: any = null;
    
    const sketch = (p: p5) => {
      p.setup = () => {
        p.createCanvas(800, 600).parent(sketchRef.current!);
        player = new Player(p);
        
        // Initialize p5.collide2D functions
        p.collideRectRect = (x1: number, y1: number, w1: number, h1: number, 
                             x2: number, y2: number, w2: number, h2: number) => {
          return x1 < x2 + w2 && 
                 x1 + w1 > x2 && 
                 y1 < y2 + h2 && 
                 y1 + h1 > y2;
        };
      };
      
      p.draw = () => {
        p.background(100, 150, 255);
        
        if (!gameStarted) {
          p.fill(255);
          p.textSize(32);
          p.textAlign(p.CENTER);
          p.text("Revolution: The Fidel Castro Story", p.width/2, p.height/3);
          p.textSize(24);
          p.text("Press ENTER to start the revolution", p.width/2, p.height/2);
          p.text("WASD to move, SPACE to shoot", p.width/2, p.height/2 + 40);
          
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
          p.text("Press ENTER to restart", p.width/2, p.height/2 + 80);
          
          if (p.keyIsDown(p.ENTER)) {
            player = new Player(p);
            bullets = [];
            enemies = [];
            isGameOver = false;
          }
          return;
        }
        
        // Player movement
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
        p.textAlign(p.LEFT);
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
        p.endShape(p.CLOSE);
      };
      
      p.keyPressed = () => {
        if (gameStarted && !isGameOver && p.keyCode === 32) { // Space
          bullets.push(player.shoot());
        }
      };
    };
    
    p5Instance = new p5(sketch);
    
    return () => {
      // Proper cleanup for p5 instance
      if (p5Instance) {
        // Access the internal _onunload method which properly cleans up resources
        // This is a safer approach than using remove()
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
  
  return <div ref={sketchRef} className="game-container"></div>;
}

function App() {
  return (
    <div className="App">
      <Game />
    </div>
  );
}

export default App;
