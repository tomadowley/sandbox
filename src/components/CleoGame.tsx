import React, { useState, useEffect, useRef } from 'react';

interface Position {
  x: number;
  y: number;
}

interface GameObject extends Position {
  width: number;
  height: number;
}

const CleoGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [countdownValue, setCountdownValue] = useState(3);
  
  // Game state refs (to avoid closure issues in animation loop)
  const cleoPosRef = useRef<Position>({ x: 50, y: 200 });
  const velocityRef = useRef<Position>({ x: 0, y: 0 });
  const poppadomsRef = useRef<GameObject[]>([]);
  const obstaclesRef = useRef<GameObject[]>([]);
  const scoreRef = useRef(0);
  const animationFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const gameAreaRef = useRef({ width: 800, height: 400 });
  
  // Load and store images
  const [images, setImages] = useState<{
    cleo?: HTMLImageElement;
    poppadom?: HTMLImageElement;
    obstacle?: HTMLImageElement;
    background?: HTMLImageElement;
  }>({});
  
  // Game configuration
  const GRAVITY = 0.5;
  const JUMP_FORCE = -12;
  const CLEO_WIDTH = 80;
  const CLEO_HEIGHT = 40;
  const POPPADOM_SIZE = 40;
  const OBSTACLE_WIDTH = 30;
  const OBSTACLE_HEIGHT = 60;
  const OBSTACLE_SPEED = 5;
  
  // Key state
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  
  // Initialize game
  useEffect(() => {
    // Load images
    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = src;
      });
    };
    
    const loadGameImages = async () => {
      const loadedImages = {
        cleo: await loadImage('https://placehold.co/80x40/brown/white?text=Cleo'),
        poppadom: await loadImage('https://placehold.co/40x40/tan/brown?text=🍪'),
        obstacle: await loadImage('https://placehold.co/30x60/red/white?text=⚠️'),
        background: await loadImage('https://placehold.co/800x400/skyblue/white?text=CleoWorld')
      };
      
      setImages(loadedImages);
    };
    
    loadGameImages();
    
    // Setup key listeners
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true;
      
      // Space or arrow up to jump
      if ((e.key === ' ' || e.key === 'ArrowUp') && gameStarted && !gameOver) {
        jump();
      }
      
      // Enter to restart
      if (e.key === 'Enter' && gameOver) {
        resetGame();
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameStarted, gameOver]);
  
  // Set up canvas and start countdown when game starts
  useEffect(() => {
    if (gameStarted && !gameOver) {
      // Set initial positions
      cleoPosRef.current = { x: 50, y: 200 };
      velocityRef.current = { x: 0, y: 0 };
      
      // Start countdown
      const countdownInterval = setInterval(() => {
        setCountdownValue(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            startGameLoop();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(countdownInterval);
    }
  }, [gameStarted, gameOver]);
  
  // Adjust canvas size based on window
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const updateCanvasSize = () => {
      const container = canvas.parentElement;
      if (container) {
        const width = Math.min(800, container.clientWidth);
        const height = width / 2; // 2:1 ratio
        
        canvas.width = width;
        canvas.height = height;
        gameAreaRef.current = { width, height };
      }
    };
    
    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, []);
  
  // Game mechanics
  const jump = () => {
    if (cleoPosRef.current.y >= gameAreaRef.current.height - CLEO_HEIGHT) {
      velocityRef.current.y = JUMP_FORCE;
    }
  };
  
  const addPoppadom = () => {
    const { width, height } = gameAreaRef.current;
    poppadomsRef.current.push({
      x: width + POPPADOM_SIZE,
      y: Math.random() * (height - 100),
      width: POPPADOM_SIZE,
      height: POPPADOM_SIZE
    });
  };
  
  const addObstacle = () => {
    const { width, height } = gameAreaRef.current;
    obstaclesRef.current.push({
      x: width + OBSTACLE_WIDTH,
      y: height - OBSTACLE_HEIGHT,
      width: OBSTACLE_WIDTH,
      height: OBSTACLE_HEIGHT
    });
  };
  
  const checkCollisions = () => {
    const cleoPos = cleoPosRef.current;
    const cleoRect = {
      left: cleoPos.x,
      right: cleoPos.x + CLEO_WIDTH,
      top: cleoPos.y,
      bottom: cleoPos.y + CLEO_HEIGHT
    };
    
    // Check poppadom collisions
    poppadomsRef.current = poppadomsRef.current.filter(poppadom => {
      const poppadomRect = {
        left: poppadom.x,
        right: poppadom.x + POPPADOM_SIZE,
        top: poppadom.y,
        bottom: poppadom.y + POPPADOM_SIZE
      };
      
      if (
        cleoRect.right > poppadomRect.left &&
        cleoRect.left < poppadomRect.right &&
        cleoRect.bottom > poppadomRect.top &&
        cleoRect.top < poppadomRect.bottom
      ) {
        // Collision! Collect poppadom
        scoreRef.current += 10;
        setScore(scoreRef.current);
        return false;
      }
      return true;
    });
    
    // Check obstacle collisions
    for (const obstacle of obstaclesRef.current) {
      const obstacleRect = {
        left: obstacle.x,
        right: obstacle.x + OBSTACLE_WIDTH,
        top: obstacle.y,
        bottom: obstacle.y + OBSTACLE_HEIGHT
      };
      
      if (
        cleoRect.right > obstacleRect.left &&
        cleoRect.left < obstacleRect.right &&
        cleoRect.bottom > obstacleRect.top &&
        cleoRect.top < obstacleRect.bottom
      ) {
        // Collision! Game over
        endGame();
        return;
      }
    }
  };
  
  const startGameLoop = () => {
    lastTimeRef.current = performance.now();
    gameLoop();
  };
  
  const gameLoop = (timestamp = performance.now()) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const deltaTime = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;
    
    // Update game state
    updateGameState(deltaTime / 16); // normalize to ~60fps
    
    // Draw game
    drawGame(ctx);
    
    // Continue game loop
    animationFrameRef.current = requestAnimationFrame(gameLoop);
  };
  
  const updateGameState = (deltaTime: number) => {
    const { width, height } = gameAreaRef.current;
    
    // Update Cleo position with gravity
    velocityRef.current.y += GRAVITY * deltaTime;
    cleoPosRef.current.y += velocityRef.current.y * deltaTime;
    
    // Handle keyboard input for horizontal movement
    if (keysPressed.current.ArrowLeft) {
      cleoPosRef.current.x -= 5 * deltaTime;
    }
    if (keysPressed.current.ArrowRight) {
      cleoPosRef.current.x += 5 * deltaTime;
    }
    
    // Keep Cleo within bounds
    if (cleoPosRef.current.x < 0) cleoPosRef.current.x = 0;
    if (cleoPosRef.current.x > width - CLEO_WIDTH) cleoPosRef.current.x = width - CLEO_WIDTH;
    if (cleoPosRef.current.y > height - CLEO_HEIGHT) {
      cleoPosRef.current.y = height - CLEO_HEIGHT;
      velocityRef.current.y = 0;
    }
    
    // Move poppadoms and obstacles
    poppadomsRef.current.forEach(poppadom => {
      poppadom.x -= 3 * deltaTime;
    });
    
    obstaclesRef.current.forEach(obstacle => {
      obstacle.x -= OBSTACLE_SPEED * deltaTime;
    });
    
    // Remove off-screen objects
    poppadomsRef.current = poppadomsRef.current.filter(p => p.x > -POPPADOM_SIZE);
    obstaclesRef.current = obstaclesRef.current.filter(o => o.x > -OBSTACLE_WIDTH);
    
    // Randomly add new poppadoms and obstacles
    if (Math.random() < 0.02 * deltaTime) {
      addPoppadom();
    }
    
    if (Math.random() < 0.01 * deltaTime) {
      addObstacle();
    }
    
    // Check for collisions
    checkCollisions();
  };
  
  const drawGame = (ctx: CanvasRenderingContext2D) => {
    const { width, height } = gameAreaRef.current;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background
    if (images.background) {
      ctx.drawImage(images.background, 0, 0, width, height);
    } else {
      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, width, height);
    }
    
    // Draw ground
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(0, height - 20, width, 20);
    
    // Draw poppadoms
    poppadomsRef.current.forEach(poppadom => {
      if (images.poppadom) {
        ctx.drawImage(
          images.poppadom,
          poppadom.x,
          poppadom.y,
          POPPADOM_SIZE,
          POPPADOM_SIZE
        );
      } else {
        ctx.fillStyle = '#D2B48C';
        ctx.beginPath();
        ctx.arc(
          poppadom.x + POPPADOM_SIZE / 2,
          poppadom.y + POPPADOM_SIZE / 2,
          POPPADOM_SIZE / 2,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
    });
    
    // Draw obstacles
    obstaclesRef.current.forEach(obstacle => {
      if (images.obstacle) {
        ctx.drawImage(
          images.obstacle,
          obstacle.x,
          obstacle.y,
          OBSTACLE_WIDTH,
          OBSTACLE_HEIGHT
        );
      } else {
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(obstacle.x, obstacle.y, OBSTACLE_WIDTH, OBSTACLE_HEIGHT);
      }
    });
    
    // Draw Cleo
    if (images.cleo) {
      ctx.drawImage(
        images.cleo,
        cleoPosRef.current.x,
        cleoPosRef.current.y,
        CLEO_WIDTH,
        CLEO_HEIGHT
      );
    } else {
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(
        cleoPosRef.current.x,
        cleoPosRef.current.y,
        CLEO_WIDTH,
        CLEO_HEIGHT
      );
    }
    
    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Poppadoms: ${scoreRef.current}`, 20, 40);
  };
  
  const endGame = () => {
    cancelAnimationFrame(animationFrameRef.current);
    setGameOver(true);
    
    // Update high score
    if (scoreRef.current > highScore) {
      setHighScore(scoreRef.current);
    }
  };
  
  const resetGame = () => {
    scoreRef.current = 0;
    setScore(0);
    poppadomsRef.current = [];
    obstaclesRef.current = [];
    setGameOver(false);
    setGameStarted(true);
    setCountdownValue(3);
  };
  
  return (
    <div className="cleo-game-container">
      <div className="game-area">
        <canvas 
          ref={canvasRef} 
          className="game-canvas"
          width={800}
          height={400}
        />
        
        {!gameStarted && !gameOver && (
          <div className="game-overlay">
            <h2>Cleo's Poppadom Chase</h2>
            <p>Help Cleo collect her favorite treat - poppadoms!</p>
            <p>Use arrow keys to move and spacebar to jump.</p>
            <button onClick={() => setGameStarted(true)}>Start Game</button>
          </div>
        )}
        
        {gameStarted && countdownValue > 0 && (
          <div className="countdown-overlay">
            <div className="countdown">{countdownValue}</div>
          </div>
        )}
        
        {gameOver && (
          <div className="game-over-overlay">
            <h2>Game Over!</h2>
            <p>Cleo collected {score} poppadoms</p>
            <p>High Score: {highScore}</p>
            <button onClick={resetGame}>Play Again</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CleoGame;