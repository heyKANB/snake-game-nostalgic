export const GRID_SIZE = 20;
export const GRID_WIDTH = 25;
export const GRID_HEIGHT = 20;
export const CANVAS_WIDTH = GRID_WIDTH * GRID_SIZE;
export const CANVAS_HEIGHT = GRID_HEIGHT * GRID_SIZE;

export interface Position {
  x: number;
  y: number;
}

export type Direction = 'up' | 'down' | 'left' | 'right';
export type GameState = 'menu' | 'playing' | 'gameOver';

export const moveSnake = (snake: Position[], direction: Direction): Position[] => {
  const head = { ...snake[0] };

  switch (direction) {
    case 'up':
      head.y -= 1;
      break;
    case 'down':
      head.y += 1;
      break;
    case 'left':
      head.x -= 1;
      break;
    case 'right':
      head.x += 1;
      break;
  }

  return [head, ...snake.slice(0, -1)];
};

export const checkCollision = (head: Position, body: Position[]): boolean => {
  // Check wall collision
  if (head.x < 0 || head.x >= GRID_WIDTH || head.y < 0 || head.y >= GRID_HEIGHT) {
    return true;
  }

  // Check self collision
  return body.some(segment => segment.x === head.x && segment.y === head.y);
};

export const generateFood = (snake: Position[]): Position => {
  let food: Position;
  
  do {
    food = {
      x: Math.floor(Math.random() * GRID_WIDTH),
      y: Math.floor(Math.random() * GRID_HEIGHT)
    };
  } while (snake.some(segment => segment.x === food.x && segment.y === food.y));

  return food;
};
