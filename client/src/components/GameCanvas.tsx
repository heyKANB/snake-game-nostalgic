import { useEffect, useRef } from "react";
import { useSnakeGame } from "../lib/stores/useSnakeGame";
import { GRID_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT } from "../lib/gameLogic";

const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { snake, food, gameState } = useSnakeGame();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid (subtle)
    ctx.strokeStyle = '#111111';
    ctx.lineWidth = 1;
    for (let x = 0; x <= CANVAS_WIDTH; x += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, CANVAS_HEIGHT);
      ctx.stroke();
    }
    for (let y = 0; y <= CANVAS_HEIGHT; y += GRID_SIZE) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(CANVAS_WIDTH, y);
      ctx.stroke();
    }

    if (gameState === 'menu') return;

    // Draw snake
    snake.forEach((segment, index) => {
      if (index === 0) {
        // Snake head - brighter green
        ctx.fillStyle = '#00ff00';
      } else {
        // Snake body - darker green
        ctx.fillStyle = '#00aa00';
      }
      
      ctx.fillRect(
        segment.x * GRID_SIZE + 1,
        segment.y * GRID_SIZE + 1,
        GRID_SIZE - 2,
        GRID_SIZE - 2
      );
    });

    // Draw food
    if (food) {
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(
        food.x * GRID_SIZE + 2,
        food.y * GRID_SIZE + 2,
        GRID_SIZE - 4,
        GRID_SIZE - 4
      );
    }

  }, [snake, food, gameState]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="border-2 border-green-400 bg-black"
      style={{
        imageRendering: 'pixelated'
      }}
    />
  );
};

export default GameCanvas;
