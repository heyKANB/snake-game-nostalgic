import { Button } from "./ui/button";
import { useIsMobile } from "../hooks/use-is-mobile";
import { useThemeStore } from "../lib/stores/useTheme";

interface GameUIProps {
  gameState: 'menu' | 'playing' | 'gameOver';
  score: number;
  highScore: number;
  onStart: () => void;
  onRestart: () => void;
}

const GameUI = ({ gameState, score, highScore, onStart, onRestart }: GameUIProps) => {
  const isMobile = useIsMobile();
  const { getThemeConfig } = useThemeStore();
  const theme = getThemeConfig();
  
  if (gameState === 'menu') {
    return (
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center bg-opacity-80"
        style={{ 
          backgroundColor: theme.colors.background + 'CC',
          color: theme.colors.text 
        }}
      >
        <div className="text-center space-y-6 px-4">
          <h1 
            className={`font-mono font-bold tracking-wider mb-8 ${isMobile ? 'text-4xl' : 'text-6xl'}`}
            style={{ 
              color: theme.colors.text,
              textShadow: theme.effects.glow ? `0 0 20px ${theme.colors.text}` : 'none'
            }}
          >
            SNAKE
          </h1>
          <div className={`font-mono space-y-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
            <p>{isMobile ? 'Use touch controls to move' : 'Use ARROW KEYS or WASD to move'}</p>
            <p style={{ color: theme.colors.food }}>Eat the food to grow</p>
            <p>Don't hit the walls or yourself!</p>
          </div>
          <div className={`font-mono ${isMobile ? 'text-base' : 'text-lg'}`}>
            <p>High Score: {highScore}</p>
          </div>
          {!isMobile && (
            <Button 
              onClick={onStart}
              className="font-mono text-xl px-8 py-3 transition-all duration-200"
              style={{
                backgroundColor: theme.colors.snake,
                color: theme.colors.background,
                border: `2px solid ${theme.colors.border}`,
                borderRadius: theme.effects.rounded ? '8px' : '0px'
              }}
            >
              PRESS SPACE TO START
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (gameState === 'gameOver') {
    return (
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center bg-opacity-90"
        style={{ 
          backgroundColor: theme.colors.background + 'E6',
          color: theme.colors.text 
        }}
      >
        <div className="text-center space-y-6 px-4">
          <h1 
            className={`font-mono font-bold mb-4 ${isMobile ? 'text-3xl' : 'text-5xl'}`}
            style={{ 
              color: theme.colors.food,
              textShadow: theme.effects.glow ? `0 0 20px ${theme.colors.food}` : 'none'
            }}
          >
            GAME OVER
          </h1>
          <div className={`font-mono space-y-2 ${isMobile ? 'text-xl' : 'text-2xl'}`}>
            <p>Final Score: <span style={{ color: theme.colors.accent }}>{score}</span></p>
            <p>High Score: <span style={{ color: theme.colors.accent }}>{highScore}</span></p>
          </div>
          {!isMobile && (
            <Button 
              onClick={onRestart}
              className="font-mono text-xl px-8 py-3 transition-all duration-200"
              style={{
                backgroundColor: theme.colors.snake,
                color: theme.colors.background,
                border: `2px solid ${theme.colors.border}`,
                borderRadius: theme.effects.rounded ? '8px' : '0px'
              }}
            >
              PRESS SPACE TO RESTART
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Playing state - no overlay needed since score is outside canvas
  return null;
};

export default GameUI;
