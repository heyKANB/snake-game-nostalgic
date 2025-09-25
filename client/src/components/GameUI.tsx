import { Button } from "./ui/button";
import { useIsMobile } from "../hooks/use-is-mobile";
import { useThemeStore } from "../lib/stores/useTheme";
import { useExtraLives } from "../lib/stores/useExtraLives";

interface GameUIProps {
  gameState: 'menu' | 'playing' | 'gameOver';
  score: number;
  highScore: number;
  onStart: () => void;
  onRestart: () => void;
  onUseExtraLife?: () => void;
}

const GameUI = ({ gameState, score, highScore, onStart, onRestart, onUseExtraLife }: GameUIProps) => {
  const isMobile = useIsMobile();
  const { getThemeConfig } = useThemeStore();
  const theme = getThemeConfig();
  const { extraLives, isPurchasing, productPrice, purchaseExtraLives, canMakePayments } = useExtraLives();
  
  if (gameState === 'menu') {
    return (
      <div 
        className="absolute inset-0 flex flex-col items-center justify-center bg-opacity-80"
        style={{ 
          backgroundColor: theme.colors.background + 'CC',
          color: theme.colors.text 
        }}
      >
        <div className={`text-center px-6 ${isMobile ? 'space-y-5' : 'space-y-8'}`}>
          <h1 
            className={`font-mono font-bold tracking-wider ${isMobile ? 'text-5xl mb-6' : 'text-7xl mb-8'}`}
            style={{ 
              color: theme.colors.text,
              textShadow: theme.effects.glow ? `0 0 20px ${theme.colors.text}` : 'none'
            }}
          >
            SNAKE
          </h1>
          <div className={`font-mono ${isMobile ? 'space-y-3 text-base' : 'space-y-4 text-lg'}`}>
            <p>{isMobile ? 'Use touch controls to move' : 'Use ARROW KEYS or WASD to move'}</p>
            <p style={{ color: theme.colors.food }}>Eat the food to grow</p>
            <p>Don't hit the walls or yourself!</p>
          </div>
          <div className={`font-mono ${isMobile ? 'text-lg' : 'text-xl'} font-bold`}>
            <p>High Score: <span style={{ color: theme.colors.food }}>{highScore}</span></p>
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
        <div className={`text-center px-6 ${isMobile ? 'space-y-4' : 'space-y-6'}`}>
          <h1 
            className={`font-mono font-bold ${isMobile ? 'text-4xl mb-3' : 'text-6xl mb-4'}`}
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
            {extraLives > 0 && (
              <p>Extra Lives: <span style={{ color: theme.colors.accent }}>{extraLives}</span></p>
            )}
          </div>

          {/* Continue Game Option */}
          <div className={`font-mono space-y-3 ${isMobile ? 'text-base' : 'text-lg'}`}>
            {(extraLives > 0 || canMakePayments) && (
              <Button 
                onClick={async () => {
                  if (extraLives > 0 && onUseExtraLife) {
                    // Use existing extra life to continue
                    onUseExtraLife();
                  } else if (canMakePayments) {
                    // Purchase extra lives and continue
                    const success = await purchaseExtraLives();
                    if (success && onUseExtraLife) {
                      // Wait a moment for the purchase to be processed, then continue
                      setTimeout(() => {
                        onUseExtraLife();
                      }, 500);
                    }
                  }
                }}
                disabled={isPurchasing}
                className="font-mono px-8 py-3 transition-all duration-200"
                style={{
                  backgroundColor: isPurchasing ? theme.colors.border : theme.colors.accent,
                  color: theme.colors.background,
                  border: `2px solid ${theme.colors.border}`,
                  borderRadius: theme.effects.rounded ? '8px' : '0px',
                  opacity: isPurchasing ? 0.5 : 1
                }}
              >
                {isPurchasing ? 'PURCHASING...' : 
                 extraLives > 0 ? `❤️ CONTINUE GAME (${extraLives} lives)` : 
                 `❤️ CONTINUE GAME ${productPrice}`}
              </Button>
            )}
          </div>

          <div className="pt-4">
            {!isMobile ? (
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
            ) : (
              <Button 
                onClick={onRestart}
                className="font-mono text-lg px-6 py-2 transition-all duration-200"
                style={{
                  backgroundColor: theme.colors.snake,
                  color: theme.colors.background,
                  border: `2px solid ${theme.colors.border}`,
                  borderRadius: theme.effects.rounded ? '8px' : '0px'
                }}
              >
                RESTART GAME
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Playing state - no overlay needed since score is outside canvas
  return null;
};

export default GameUI;
