import { useEffect, useRef, useState } from 'react';
import Sidebar from '../../components/Sidebar';

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const GRID_SIZE = 40;
const CELL_SIZE = 15;
const SNAKE_RADIUS = CELL_SIZE / 2;
const INITIAL_SNAKE = [{ x: 20, y: 20 }];
const INITIAL_DIRECTION: Direction = 'RIGHT';
const GAME_SPEED = 50;

export default function Snake() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Position>({ x: 25, y: 25 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [highScore, setHighScore] = useState(() => {
    const saved = localStorage.getItem('snakeHighScore');
    return saved ? parseInt(saved) : 0;
  });

  // Game loop
  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake(prevSnake => {
        const head = { ...prevSnake[0] };

        switch (direction) {
          case 'UP':
            head.y -= 1;
            break;
          case 'DOWN':
            head.y += 1;
            break;
          case 'LEFT':
            head.x -= 1;
            break;
          case 'RIGHT':
            head.x += 1;
            break;
        }

        // Check for collisions
        if (
          head.x < 0 || head.x >= GRID_SIZE ||
          head.y < 0 || head.y >= GRID_SIZE ||
          prevSnake.some(segment => segment.x === head.x && segment.y === head.y)
        ) {
          setGameOver(true);
          if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('snakeHighScore', score.toString());
          }
          return prevSnake;
        }

        const newSnake = [head, ...prevSnake];

        // Check if snake ate food
        if (head.x === food.x && head.y === food.y) {
          setScore(prev => prev + 1);
          generateFood(newSnake);
        } else {
          newSnake.pop();
        }

        return newSnake;
      });
    };

    const gameLoop = setInterval(moveSnake, GAME_SPEED);
    return () => clearInterval(gameLoop);
  }, [direction, gameOver, food, isPaused, score, highScore]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Prevent arrow keys from scrolling the page
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        setIsPaused(prev => !prev);
        return;
      }

      if (gameOver || isPaused) return;

      switch (e.key) {
        case 'ArrowUp':
          if (direction !== 'DOWN') setDirection('UP');
          break;
        case 'ArrowDown':
          if (direction !== 'UP') setDirection('DOWN');
          break;
        case 'ArrowLeft':
          if (direction !== 'RIGHT') setDirection('LEFT');
          break;
        case 'ArrowRight':
          if (direction !== 'LEFT') setDirection('RIGHT');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameOver, isPaused]);

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, GRID_SIZE * CELL_SIZE, GRID_SIZE * CELL_SIZE);

    // Draw snake with rounded segments and gradient
    snake.forEach(({ x, y }, index) => {
      ctx.beginPath();
      const centerX = (x + 0.5) * CELL_SIZE;
      const centerY = (y + 0.5) * CELL_SIZE;
      
      // Create gradient for each segment
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, SNAKE_RADIUS
      );
      gradient.addColorStop(0, '#6ee7b7'); // Lighter center
      gradient.addColorStop(1, '#4ade80'); // Darker edge
      
      ctx.fillStyle = gradient;
      ctx.arc(centerX, centerY, SNAKE_RADIUS * 0.9, 0, Math.PI * 2);
      ctx.fill();

      // Add highlight effect
      ctx.beginPath();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.arc(
        centerX - SNAKE_RADIUS * 0.3,
        centerY - SNAKE_RADIUS * 0.3,
        SNAKE_RADIUS * 0.4,
        0,
        Math.PI * 2
      );
      ctx.fill();
    });

    // Draw food with glow effect
    ctx.beginPath();
    const foodCenterX = (food.x + 0.5) * CELL_SIZE;
    const foodCenterY = (food.y + 0.5) * CELL_SIZE;

    // Add glow
    ctx.shadowColor = '#f87171';
    ctx.shadowBlur = 15;
    
    // Create gradient for food
    const foodGradient = ctx.createRadialGradient(
      foodCenterX, foodCenterY, 0,
      foodCenterX, foodCenterY, SNAKE_RADIUS
    );
    foodGradient.addColorStop(0, '#fca5a5');
    foodGradient.addColorStop(1, '#f87171');
    
    ctx.fillStyle = foodGradient;
    ctx.arc(foodCenterX, foodCenterY, SNAKE_RADIUS * 0.8, 0, Math.PI * 2);
    ctx.fill();

    // Reset shadow
    ctx.shadowBlur = 0;
  }, [snake, food]);

  const generateFood = (currentSnake: Position[]) => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    setFood(newFood);
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
    generateFood(INITIAL_SNAKE);
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <header className="navbar">
          <h1 className="navbar-title">Snake Game</h1>
          <div style={{ flex: 1 }} />
          <div className="navbar-links">
            <div className="stat-label">High Score: {highScore}</div>
          </div>
        </header>

        <main className="content" style={{ 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 'var(--space-4)',
          paddingTop: 'var(--space-4)',
          height: 'calc(100vh - 64px)', // Account for header height
          overflow: 'hidden'
        }}>
          <div style={{
            display: 'flex',
            gap: 'var(--space-4)',
            width: '100%',
            height: '100%',
            maxWidth: '1200px',
            alignItems: 'flex-start',
            padding: 'var(--space-4)'
          }}>
            <div className="card" style={{
              padding: 'var(--space-4)',
              textAlign: 'left',
              width: '250px',
              height: 'fit-content'
            }}>
              <h3 style={{ marginBottom: 'var(--space-4)' }}>How to Play</h3>
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 'var(--space-3)'
              }}>
                <div>
                  <strong>Controls</strong>
                  <p>↑ Up arrow</p>
                  <p>↓ Down arrow</p>
                  <p>← Left arrow</p>
                  <p>→ Right arrow</p>
                  <p>Space to pause/resume</p>
                </div>
                <div>
                  <strong>Objective</strong>
                  <p>Collect the red orbs to grow and score points</p>
                  <p>Avoid hitting the walls or yourself!</p>
                </div>
              </div>
            </div>

            <div className="card" style={{
              padding: 'var(--space-4)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 'var(--space-4)',
              flex: 1,
              position: 'relative',
              height: '100%',
              maxHeight: 'calc(100vh - 96px)' // Account for header and padding
            }}>
              <div style={{ 
                fontSize: 'var(--font-size-lg)',
                marginBottom: 'var(--space-2)'
              }}>
                Score: {score}
              </div>

              <div style={{
                width: '100%',
                height: 'calc(100% - 40px)', // Account for score display
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}>
                <canvas
                  ref={canvasRef}
                  width={GRID_SIZE * CELL_SIZE}
                  height={GRID_SIZE * CELL_SIZE}
                  style={{
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 'var(--radius-md)',
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                />
              </div>

              {(gameOver || isPaused) && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  padding: 'var(--space-4)',
                  borderRadius: 'var(--radius-md)',
                  backdropFilter: 'blur(8px)'
                }}>
                  <h2>{gameOver ? 'Game Over!' : 'Paused'}</h2>
                  {gameOver && <p>Final Score: {score}</p>}
                  <button
                    className="btn btn-primary"
                    onClick={gameOver ? resetGame : () => setIsPaused(false)}
                    style={{ marginTop: 'var(--space-2)' }}
                  >
                    {gameOver ? 'Play Again' : 'Resume'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 