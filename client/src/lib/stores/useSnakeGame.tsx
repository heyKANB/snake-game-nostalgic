import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { 
  Position, 
  Direction, 
  GameState,
  GRID_WIDTH,
  GRID_HEIGHT,
  generateFood,
  checkCollision,
  moveSnake
} from "../gameLogic";

interface SnakeGameState {
  snake: Position[];
  food: Position | null;
  direction: Direction;
  gameState: GameState;
  score: number;
  highScore: number;
  
  // Actions
  startGame: () => void;
  resetGame: () => void;
  changeDirection: (newDirection: Direction) => void;
  gameLoop: () => 'continue' | 'ate_food' | 'game_over';
}

export const useSnakeGame = create<SnakeGameState>()(
  subscribeWithSelector((set, get) => ({
    snake: [{ x: Math.floor(GRID_WIDTH / 2), y: Math.floor(GRID_HEIGHT / 2) }],
    food: null,
    direction: 'right',
    gameState: 'menu',
    score: 0,
    highScore: parseInt(localStorage.getItem('snakeHighScore') || '0'),

    startGame: () => {
      const initialSnake = [{ x: Math.floor(GRID_WIDTH / 2), y: Math.floor(GRID_HEIGHT / 2) }];
      const initialFood = generateFood(initialSnake);
      
      set({
        snake: initialSnake,
        food: initialFood,
        direction: 'right',
        gameState: 'playing',
        score: 0
      });
    },

    resetGame: () => {
      set({ gameState: 'menu' });
    },

    changeDirection: (newDirection: Direction) => {
      const { gameState } = get();
      if (gameState === 'playing') {
        set({ direction: newDirection });
      }
    },

    gameLoop: () => {
      const { snake, food, direction, score, highScore } = get();
      
      if (!food) return 'continue';

      const newSnake = moveSnake(snake, direction);
      const head = newSnake[0];

      // Check collision with walls or self
      if (checkCollision(head, newSnake.slice(1))) {
        const newHighScore = Math.max(score, highScore);
        localStorage.setItem('snakeHighScore', newHighScore.toString());
        
        set({
          gameState: 'gameOver',
          highScore: newHighScore
        });
        
        // Trigger interstitial ad on game over
        setTimeout(() => {
          if (typeof window !== 'undefined' && (window as any).useAdsStore) {
            (window as any).useAdsStore.getState().showInterstitialAd();
          }
        }, 500);
        
        return 'game_over';
      }

      // Check if snake ate food
      if (head.x === food.x && head.y === food.y) {
        // Don't remove tail (snake grows)
        const grownSnake = [...newSnake, snake[snake.length - 1]];
        const newFood = generateFood(grownSnake);
        
        set({
          snake: grownSnake,
          food: newFood,
          score: score + 10
        });
        return 'ate_food';
      }

      // Normal movement
      set({ snake: newSnake });
      return 'continue';
    }
  }))
);
