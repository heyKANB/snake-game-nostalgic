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

  // Calculate responsive canvas size
  const canvasSize = isMobile ? {
    width: Math.min(320, (typeof window !== 'undefined' ? window.innerWidth : 400) - 40),
    height: Math.min(320, (typeof window !== 'undefined' ? window.innerWidth : 400) - 40)
  } : {
    width: CANVAS_WIDTH,
    height: CANVAS_HEIGHT
  };

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
      
      // Christmas theme - twinkling lights effect
      if (theme.foodStyle === 'christmas-tree') {
        const time = Date.now() / 1000;
        const twinkleOffset = (index * 0.5 + time) % (Math.PI * 2);
        const brightness = Math.sin(twinkleOffset) * 0.3 + 0.7; // 0.4 to 1.0
        
        // Alternate colors for twinkling lights
        const colors = ['#ff0000', '#00ff00', '#0080ff', '#ffff00', '#ff8000', '#ff0080'];
        const colorIndex = (index + Math.floor(time * 2)) % colors.length;
        const baseColor = colors[colorIndex];
        
        const rgb = hexToRgb(baseColor);
        if (rgb) {
          ctx.fillStyle = `rgb(${Math.floor(rgb.r * brightness)}, ${Math.floor(rgb.g * brightness)}, ${Math.floor(rgb.b * brightness)})`;
        } else {
          ctx.fillStyle = theme.colors.snake;
        }
        
        // Draw as circles for Christmas lights
        ctx.beginPath();
        ctx.arc(x + GRID_SIZE/2, y + GRID_SIZE/2, (size/2) * brightness, 0, 2 * Math.PI);
        ctx.fill();
        
        // Add strong glow for twinkling effect
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = 15 * brightness;
        ctx.beginPath();
        ctx.arc(x + GRID_SIZE/2, y + GRID_SIZE/2, (size/2) * brightness, 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0;
        
      } else {
        // Regular snake rendering for other themes
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
      }
    });

    // Draw food with theme support
    if (food) {
      const x = food.x * GRID_SIZE;
      const y = food.y * GRID_SIZE;
      const padding = theme.effects.rounded ? 3 : 2;
      const size = GRID_SIZE - (padding * 2);
      
      ctx.fillStyle = theme.colors.food;
      
      // Handle different food styles
      if (theme.foodStyle === 'christmas-tree') {
        // Christmas tree
        const centerX = x + GRID_SIZE/2;
        const centerY = y + GRID_SIZE/2;
        const treeSize = size * 0.8;
        
        // Draw tree layers (3 triangular sections)
        ctx.fillStyle = theme.colors.food;
        
        // Top layer (smallest)
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - treeSize/2);
        ctx.lineTo(centerX - treeSize/4, centerY - treeSize/6);
        ctx.lineTo(centerX + treeSize/4, centerY - treeSize/6);
        ctx.closePath();
        ctx.fill();
        
        // Middle layer
        ctx.beginPath();
        ctx.moveTo(centerX, centerY - treeSize/4);
        ctx.lineTo(centerX - treeSize/3, centerY + treeSize/8);
        ctx.lineTo(centerX + treeSize/3, centerY + treeSize/8);
        ctx.closePath();
        ctx.fill();
        
        // Bottom layer (largest)
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(centerX - treeSize/2, centerY + treeSize/2);
        ctx.lineTo(centerX + treeSize/2, centerY + treeSize/2);
        ctx.closePath();
        ctx.fill();
        
        // Draw trunk
        ctx.fillStyle = '#8B4513'; // Brown trunk
        ctx.fillRect(centerX - 2, centerY + treeSize/3, 4, treeSize/4);
        
        // Add twinkling star on top
        const time = Date.now() / 1000;
        const starBrightness = Math.sin(time * 3) * 0.3 + 0.7;
        ctx.fillStyle = `rgba(255, 255, 0, ${starBrightness})`;
        ctx.beginPath();
        ctx.arc(centerX, centerY - treeSize/2 - 2, 2, 0, 2 * Math.PI);
        ctx.fill();
        
      } else if (theme.foodStyle === 'pumpkin') {
        // Halloween pumpkin
        const centerX = x + GRID_SIZE/2;
        const centerY = y + GRID_SIZE/2;
        const radius = size/2;
        
        // Draw pumpkin body
        ctx.fillStyle = theme.colors.food;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.fill();
        
        // Draw pumpkin lines
        ctx.strokeStyle = '#FF4500'; // Darker orange for lines
        ctx.lineWidth = 1;
        ctx.beginPath();
        // Vertical lines
        ctx.moveTo(centerX - radius/2, centerY - radius);
        ctx.lineTo(centerX - radius/2, centerY + radius);
        ctx.moveTo(centerX, centerY - radius);
        ctx.lineTo(centerX, centerY + radius);
        ctx.moveTo(centerX + radius/2, centerY - radius);
        ctx.lineTo(centerX + radius/2, centerY + radius);
        ctx.stroke();
        
        // Draw stem
        ctx.fillStyle = '#32D74B'; // Green stem
        ctx.fillRect(centerX - 2, centerY - radius - 3, 4, 4);
        
      } else if (theme.effects.rounded || theme.foodStyle === 'circle') {
        // Modern circular food
        ctx.beginPath();
        ctx.arc(x + GRID_SIZE/2, y + GRID_SIZE/2, size/2, 0, 2 * Math.PI);
        ctx.fill();
      } else {
        // Classic square food
        ctx.fillRect(x + padding, y + padding, size, size);
      }
      
      // Add glow effect for themes that support it
      if (theme.effects.glow && theme.foodStyle !== 'christmas-tree') {
        ctx.shadowColor = theme.colors.food;
        ctx.shadowBlur = 8;
        if (theme.foodStyle === 'pumpkin') {
          ctx.beginPath();
          ctx.arc(x + GRID_SIZE/2, y + GRID_SIZE/2, size/2, 0, 2 * Math.PI);
          ctx.fill();
        } else if (theme.effects.rounded || theme.foodStyle === 'circle') {
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
