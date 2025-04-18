import Cleo from './entities/Cleo';
import Joe from './entities/Joe';
import Item from './entities/Item';
import { Position, Entity, GameCallbacks } from './types';

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private cleo: Cleo;
  private joe: Joe;
  private items: Item[] = [];
  private backgrounds: string[] = [
    'living room', 
    'garden', 
    'beach'
  ];
  private currentLevel = 1;
  private score = 0;
  private gameLoop: number | null = null;
  private lastFrameTime = 0;
  private isPaused = false;
  private callbacks: GameCallbacks;
  private keysPressed: Set<string> = new Set();
  private toysCollected = 0;
  private gameOver = false;

  constructor(canvas: HTMLCanvasElement, callbacks: GameCallbacks) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Could not get canvas context');
    this.ctx = context;
    
    this.callbacks = callbacks;
    
    // Initialize game entities
    this.cleo = new Cleo({
      x: canvas.width / 2,
      y: canvas.height / 2,
      width: 50,
      height: 25
    });
    
    this.joe = new Joe({
      x: 100,
      y: 100,
      width: 40,
      height: 60
    });
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Initialize items for level 1
    this.generateItems();
  }

  private setupEventListeners() {
    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      this.keysPressed.add(e.key);
      
      // Prevent default action for arrow keys and WASD to avoid scrolling
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key)) {
        e.preventDefault();
      }
    });
    
    window.addEventListener('keyup', (e) => {
      this.keysPressed.delete(e.key);
    });
    
    // Focus the canvas on click to enable keyboard controls
    this.canvas.addEventListener('click', () => {
      this.canvas.focus();
    });
  }

  private handleInput() {
    const speed = 4;
    
    if (this.keysPressed.has('ArrowUp') || this.keysPressed.has('w')) {
      this.cleo.moveY(-speed);
    }
    if (this.keysPressed.has('ArrowDown') || this.keysPressed.has('s')) {
      this.cleo.moveY(speed);
    }
    if (this.keysPressed.has('ArrowLeft') || this.keysPressed.has('a')) {
      this.cleo.moveX(-speed);
      this.cleo.setFacingLeft(true);
    }
    if (this.keysPressed.has('ArrowRight') || this.keysPressed.has('d')) {
      this.cleo.moveX(speed);
      this.cleo.setFacingLeft(false);
    }
    
    // Keep Cleo within canvas bounds
    if (this.cleo.getPosition().x < 0) this.cleo.setX(0);
    if (this.cleo.getPosition().x + this.cleo.getSize().width > this.canvas.width) {
      this.cleo.setX(this.canvas.width - this.cleo.getSize().width);
    }
    if (this.cleo.getPosition().y < 0) this.cleo.setY(0);
    if (this.cleo.getPosition().y + this.cleo.getSize().height > this.canvas.height) {
      this.cleo.setY(this.canvas.height - this.cleo.getSize().height);
    }
  }

  private update(deltaTime: number) {
    if (this.isPaused || this.gameOver) return;
    
    // Handle player input
    this.handleInput();
    
    // Update Cleo stats - they decrease over time
    const statDecay = 0.05 * (this.currentLevel * 0.5);
    this.cleo.updateStats({
      food: -statDecay,
      scratches: -statDecay,
      snuggles: -statDecay,
      comfort: -statDecay
    });
    
    // Check if any stat has reached zero
    const stats = this.cleo.getStats();
    if (stats.food <= 0 || stats.scratches <= 0 || stats.snuggles <= 0 || stats.comfort <= 0) {
      this.endGame(false);
      return;
    }
    
    // Update all entities
    this.cleo.update(deltaTime);
    this.joe.update(deltaTime, this.cleo.getPosition());
    
    // Check collisions with items
    this.checkItemCollisions();
    
    // Check collision with Joe
    if (this.checkCollision(this.cleo, this.joe)) {
      this.handleJoeCollision();
    }
    
    // Update stats display
    this.callbacks.onStatsChange({
      food: Math.floor(stats.food),
      scratches: Math.floor(stats.scratches),
      snuggles: Math.floor(stats.snuggles),
      comfort: Math.floor(stats.comfort),
      toyRussell: this.toysCollected,
      level: this.currentLevel
    });
  }

  private render() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw background
    this.drawBackground();
    
    // Draw items
    for (const item of this.items) {
      item.render(this.ctx);
    }
    
    // Draw entities
    this.cleo.render(this.ctx);
    this.joe.render(this.ctx);
    
    // Draw level indicator
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(10, 10, 180, 30);
    this.ctx.fillStyle = 'white';
    this.ctx.font = '16px Arial';
    this.ctx.fillText(`Level: ${this.currentLevel} - ${this.backgrounds[this.currentLevel - 1]}`, 20, 30);
    
    // If paused, draw pause overlay
    if (this.isPaused) {
      this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = 'white';
      this.ctx.font = '30px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.textAlign = 'start';
    }
  }

  private drawBackground() {
    // Draw a different background based on current level
    switch (this.currentLevel) {
      case 1: // Living room
        this.ctx.fillStyle = '#F5E1C0';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw carpet
        this.ctx.fillStyle = '#D77A61';
        this.ctx.fillRect(100, 100, this.canvas.width - 200, this.canvas.height - 200);
        
        // Draw furniture
        this.ctx.fillStyle = '#8C5E58';
        this.ctx.fillRect(50, 150, 150, 100); // Sofa
        this.ctx.fillRect(600, 150, 100, 100); // Chair
        this.ctx.fillRect(350, 400, 150, 80); // Table
        break;
        
      case 2: // Garden
        this.ctx.fillStyle = '#87CEEB'; // Sky
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#7EC850'; // Grass
        this.ctx.fillRect(0, 350, this.canvas.width, this.canvas.height - 350);
        
        // Draw some trees and flowers
        this.ctx.fillStyle = '#8B4513'; // Tree trunks
        this.ctx.fillRect(100, 250, 30, 150);
        this.ctx.fillRect(650, 200, 40, 200);
        
        this.ctx.fillStyle = '#228B22'; // Tree tops
        this.ctx.beginPath();
        this.ctx.arc(115, 200, 70, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(670, 150, 90, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Flowers
        for (let i = 0; i < 10; i++) {
          const x = 200 + i * 50;
          this.ctx.fillStyle = ['#FF69B4', '#FFD700', '#FF6347'][i % 3];
          this.ctx.beginPath();
          this.ctx.arc(x, 450, 10, 0, Math.PI * 2);
          this.ctx.fill();
        }
        break;
        
      case 3: // Beach
        this.ctx.fillStyle = '#87CEEB'; // Sky
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#1E90FF'; // Ocean
        this.ctx.fillRect(0, 0, this.canvas.width, 350);
        
        this.ctx.fillStyle = '#F5DEB3'; // Sand
        this.ctx.fillRect(0, 350, this.canvas.width, this.canvas.height - 350);
        
        // Draw waves
        this.ctx.strokeStyle = 'white';
        this.ctx.lineWidth = 3;
        for (let i = 0; i < 5; i++) {
          const y = 250 + i * 20;
          this.ctx.beginPath();
          this.ctx.moveTo(0, y);
          
          for (let x = 0; x < this.canvas.width; x += 40) {
            this.ctx.quadraticCurveTo(
              x + 20, y - 10,
              x + 40, y
            );
          }
          this.ctx.stroke();
        }
        
        // Draw sun
        this.ctx.fillStyle = '#FFD700';
        this.ctx.beginPath();
        this.ctx.arc(700, 80, 50, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Beach umbrella
        this.ctx.fillStyle = '#8B4513'; // Pole
        this.ctx.fillRect(200, 350, 10, 150);
        this.ctx.fillStyle = '#FF6347'; // Umbrella
        this.ctx.beginPath();
        this.ctx.arc(205, 350, 70, 0, Math.PI);
        this.ctx.fill();
        break;
    }
  }

  private generateItems() {
    this.items = [];
    
    // Generate food items
    for (let i = 0; i < 3; i++) {
      this.items.push(new Item({
        x: Math.random() * (this.canvas.width - 30),
        y: Math.random() * (this.canvas.height - 30),
        width: 30,
        height: 30,
        type: 'food'
      }));
    }
    
    // Generate scratches items
    for (let i = 0; i < 3; i++) {
      this.items.push(new Item({
        x: Math.random() * (this.canvas.width - 30),
        y: Math.random() * (this.canvas.height - 30),
        width: 30,
        height: 30,
        type: 'scratches'
      }));
    }
    
    // Generate snuggles items
    for (let i = 0; i < 3; i++) {
      this.items.push(new Item({
        x: Math.random() * (this.canvas.width - 30),
        y: Math.random() * (this.canvas.height - 30),
        width: 30,
        height: 30,
        type: 'snuggles'
      }));
    }
    
    // Generate comfort items
    for (let i = 0; i < 3; i++) {
      this.items.push(new Item({
        x: Math.random() * (this.canvas.width - 30),
        y: Math.random() * (this.canvas.height - 30),
        width: 30,
        height: 30,
        type: 'comfort'
      }));
    }
    
    // Generate Russell toys (only a few per level)
    for (let i = 0; i < 5; i++) {
      this.items.push(new Item({
        x: Math.random() * (this.canvas.width - 40),
        y: Math.random() * (this.canvas.height - 40),
        width: 40,
        height: 40,
        type: 'toy'
      }));
    }
  }

  private checkItemCollisions() {
    for (let i = this.items.length - 1; i >= 0; i--) {
      const item = this.items[i];
      if (this.checkCollision(this.cleo, item)) {
        // Apply item effect
        switch (item.getType()) {
          case 'food':
            this.cleo.updateStats({ food: 20 });
            this.score += 10;
            this.callbacks.onMessage('Yum! Cleo enjoys a delicious treat!');
            break;
          case 'scratches':
            this.cleo.updateStats({ scratches: 20 });
            this.score += 10;
            this.callbacks.onMessage('Ah, the perfect spot! Cleo loves the scratches!');
            break;
          case 'snuggles':
            this.cleo.updateStats({ snuggles: 20 });
            this.score += 10;
            this.callbacks.onMessage('Cleo feels loved with the warm snuggles!');
            break;
          case 'comfort':
            this.cleo.updateStats({ comfort: 20 });
            this.score += 10;
            this.callbacks.onMessage('So cozy! Cleo is feeling comfortable!');
            break;
          case 'toy':
            this.toysCollected++;
            this.score += 50;
            this.callbacks.onMessage('Cleo found Russell! Her favorite toy!');
            
            // Check if all toys are collected
            if (this.toysCollected >= 5) {
              this.advanceLevel();
            }
            break;
        }
        
        // Remove collected item
        this.items.splice(i, 1);
        
        // Spawn a new item of the same type (except for toys)
        if (item.getType() !== 'toy') {
          this.items.push(new Item({
            x: Math.random() * (this.canvas.width - 30),
            y: Math.random() * (this.canvas.height - 30),
            width: 30,
            height: 30,
            type: item.getType()
          }));
        }
        
        // Update score
        this.callbacks.onScoreChange(this.score);
      }
    }
  }

  private handleJoeCollision() {
    // Joe decreases Cleo's stats
    this.cleo.updateStats({
      food: -10,
      scratches: -10,
      snuggles: -10,
      comfort: -10
    });
    
    // Decrease score
    this.score = Math.max(0, this.score - 20);
    this.callbacks.onScoreChange(this.score);
    
    // Move Joe away
    const randomX = Math.random() < 0.5 ? 50 : this.canvas.width - 50;
    const randomY = Math.random() < 0.5 ? 50 : this.canvas.height - 50;
    this.joe.setPosition({ x: randomX, y: randomY });
    
    // Show message
    this.callbacks.onMessage('Oh no! Joe caught Cleo and decreased her stats!');
  }

  private advanceLevel() {
    this.currentLevel++;
    this.toysCollected = 0;
    
    if (this.currentLevel > 3) {
      // Player has completed all levels
      this.endGame(true);
      return;
    }
    
    // Reset positions
    this.cleo.setPosition({
      x: this.canvas.width / 2,
      y: this.canvas.height / 2
    });
    
    this.joe.setPosition({
      x: 100,
      y: 100
    });
    
    // Increase Joe's speed with each level
    this.joe.setSpeed(1 + this.currentLevel * 0.5);
    
    // Generate new items for the level
    this.generateItems();
    
    // Show level message
    this.callbacks.onMessage(`Level ${this.currentLevel}: ${this.backgrounds[this.currentLevel - 1]}! Collect all Russell toys!`);
  }

  private checkCollision(entity1: Entity, entity2: Entity): boolean {
    const pos1 = entity1.getPosition();
    const size1 = entity1.getSize();
    const pos2 = entity2.getPosition();
    const size2 = entity2.getSize();
    
    return (
      pos1.x < pos2.x + size2.width &&
      pos1.x + size1.width > pos2.x &&
      pos1.y < pos2.y + size2.height &&
      pos1.y + size1.height > pos2.y
    );
  }

  private gameStep(timestamp: number) {
    if (!this.lastFrameTime) {
      this.lastFrameTime = timestamp;
    }
    
    const deltaTime = timestamp - this.lastFrameTime;
    this.lastFrameTime = timestamp;
    
    this.update(deltaTime);
    this.render();
    
    if (!this.gameOver) {
      this.gameLoop = requestAnimationFrame(this.gameStep.bind(this));
    }
  }

  private endGame(victory: boolean) {
    this.gameOver = true;
    
    if (victory) {
      this.callbacks.onVictory(this.score);
    } else {
      this.callbacks.onGameOver(this.score);
    }
    
    if (this.gameLoop) {
      cancelAnimationFrame(this.gameLoop);
      this.gameLoop = null;
    }
  }

  public start() {
    if (this.gameLoop) return;
    
    this.isPaused = false;
    this.gameOver = false;
    this.lastFrameTime = 0;
    this.gameLoop = requestAnimationFrame(this.gameStep.bind(this));
    
    this.callbacks.onMessage('Game started! Help Cleo collect her needs and toys!');
  }

  public pause() {
    this.isPaused = true;
    this.callbacks.onMessage('Game paused');
  }

  public resume() {
    this.isPaused = false;
    this.callbacks.onMessage('Game resumed');
  }

  public restart() {
    // Reset game state
    this.currentLevel = 1;
    this.score = 0;
    this.toysCollected = 0;
    this.gameOver = false;
    
    // Reset positions
    this.cleo.setPosition({
      x: this.canvas.width / 2,
      y: this.canvas.height / 2
    });
    
    this.joe.setPosition({
      x: 100,
      y: 100
    });
    
    // Reset Joe's speed
    this.joe.setSpeed(1.5);
    
    // Reset Cleo's stats
    this.cleo.resetStats();
    
    // Generate new items
    this.generateItems();
    
    // Start game loop if not already running
    if (!this.gameLoop) {
      this.isPaused = false;
      this.lastFrameTime = 0;
      this.gameLoop = requestAnimationFrame(this.gameStep.bind(this));
    }
    
    this.callbacks.onMessage('Game restarted! Help Cleo collect her needs and toys!');
  }

  public cleanup() {
    if (this.gameLoop) {
      cancelAnimationFrame(this.gameLoop);
      this.gameLoop = null;
    }
    
    // Remove event listeners
    window.removeEventListener('keydown', (e) => this.keysPressed.add(e.key));
    window.removeEventListener('keyup', (e) => this.keysPressed.delete(e.key));
  }
}
