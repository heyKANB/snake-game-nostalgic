import { useEffect, useRef } from "react";
import { useSnakeGame } from "../lib/stores/useSnakeGame";
import { useThemeStore } from "../lib/stores/useTheme";
import { GRID_SIZE, CANVAS_WIDTH, CANVAS_HEIGHT } from "../lib/gameLogic";
import { useIsMobile } from "../hooks/use-is-mobile";

const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { snake, food, gameState } = useSnakeGame();
  const { getThemeConfig } = useThemeStore();
  const isMobile = useIsMobile();
  const theme = getThemeConfig();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas with theme background
    if (theme.effects.gradient) {
      const gradient = ctx.createLinearGradient(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      gradient.addColorStop(0, theme.colors.background);
      gradient.addColorStop(1, theme.colors.ui);
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = theme.colors.background;
    }
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw grid (subtle)
    ctx.strokeStyle = theme.colors.background === '#000000' ? '#111111' : theme.colors.border + '20';
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

    // Draw snake with theme support
    snake.forEach((segment, index) => {
      const x = segment.x * GRID_SIZE;
      const y = segment.y * GRID_SIZE;
      const padding = theme.effects.rounded ? 2 : 1;
      const size = GRID_SIZE - (padding * 2);
      
      if (index === 0) {
        // Snake head - use theme color
        ctx.fillStyle = theme.colors.snake;
      } else {
        // Snake body - slightly darker
        const rgb = hexToRgb(theme.colors.snake);
        if (rgb) {
          ctx.fillStyle = `rgb(${Math.floor(rgb.r * 0.8)}, ${Math.floor(rgb.g * 0.8)}, ${Math.floor(rgb.b * 0.8)})`;
        } else {
          ctx.fillStyle = theme.colors.snake;
        }
      }
      
      if (theme.effects.rounded) {
        // Modern rounded style
        drawRoundedRect(ctx, x + padding, y + padding, size, size, 4);
      } else {
        // Classic square style
        ctx.fillRect(x + padding, y + padding, size, size);
      }
      
      // Add glow effect for retro theme
      if (theme.effects.glow && index === 0) {
        ctx.shadowColor = theme.colors.snake;
        ctx.shadowBlur = 10;
        if (theme.effects.rounded) {
          drawRoundedRect(ctx, x + padding, y + padding, size, size, 4);
        } else {
          ctx.fillRect(x + padding, y + padding, size, size);
        }
        ctx.shadowBlur = 0;
      }
    });

    // Draw food with theme support
    if (food) {
      const x = food.x * GRID_SIZE;
      const y = food.y * GRID_SIZE;
      const padding = theme.effects.rounded ? 3 : 2;
      const size = GRID_SIZE - (padding * 2);
      
      ctx.fillStyle = theme.colors.food;
      
      if (theme.effects.rounded) {
        // Modern circular food
        ctx.beginPath();
        ctx.arc(x + GRID_SIZE/2, y + GRID_SIZE/2, size/2, 0, 2 * Math.PI);
        ctx.fill();
      } else {
        // Classic square food
        ctx.fillRect(x + padding, y + padding, size, size);
      }
      
      // Add glow effect for retro theme
      if (theme.effects.glow) {
        ctx.shadowColor = theme.colors.food;
        ctx.shadowBlur = 8;
        if (theme.effects.rounded) {
          ctx.beginPath();
          ctx.arc(x + GRID_SIZE/2, y + GRID_SIZE/2, size/2, 0, 2 * Math.PI);
          ctx.fill();
        } else {
          ctx.fillRect(x + padding, y + padding, size, size);
        }
        ctx.shadowBlur = 0;
      }
    }

  }, [snake, food, gameState, theme]);

  // Helper function to draw rounded rectangles
  const drawRoundedRect = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  };

  // Helper function to convert hex to RGB
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className={`border-2 ${isMobile ? 'max-w-full max-h-[60vh]' : ''}`}
      style={{
        imageRendering: 'pixelated',
        width: isMobile ? '100%' : 'auto',
        height: isMobile ? 'auto' : 'auto',
        borderColor: theme.colors.border,
        backgroundColor: theme.colors.background,
        filter: theme.effects.scanlines ? 
          'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.03) 2px, rgba(0,255,0,0.03) 4px)' : 
          'none'
      }}
    />
  );
};

export default GameCanvas;
