import { useIsMobile } from "../hooks/use-is-mobile";
import { useThemeStore } from "../lib/stores/useTheme";
import { Direction } from "../lib/gameLogic";

interface TouchControlsProps {
  gameState: 'menu' | 'playing' | 'gameOver';
  direction: Direction;
  onDirectionChange: (direction: Direction) => void;
  onStart: () => void;
  onRestart: () => void;
}

const TouchControls = ({ 
  gameState, 
  direction, 
  onDirectionChange, 
  onStart, 
  onRestart 
}: TouchControlsProps) => {
  const isMobile = useIsMobile();
  const { getThemeConfig } = useThemeStore();
  const theme = getThemeConfig();
  
  if (!isMobile) return null;

  const handleDirectionPress = (newDirection: Direction) => {
    if (gameState !== 'playing') return;
    
    // Prevent opposite direction changes
    const opposites: Record<Direction, Direction> = {
      up: 'down',
      down: 'up',
      left: 'right',
      right: 'left'
    };
    
    if (direction !== opposites[newDirection]) {
      onDirectionChange(newDirection);
    }
  };

  const handleActionPress = () => {
    if (gameState === 'menu') {
      onStart();
    } else if (gameState === 'gameOver') {
      onRestart();
    }
  };

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 p-4 bg-opacity-80"
      style={{ 
        backgroundColor: theme.colors.background + 'CC',
        paddingBottom: 'env(safe-area-inset-bottom, 1rem)'
      }}
    >
      <div className="flex items-center justify-center max-w-md mx-auto">
        {/* D-Pad Style Controls - Centered and Bigger */}
        <div className="relative">
          <div className="grid grid-cols-3 gap-2 w-40 h-40">
            {/* Empty top-left */}
            <div></div>
            
            {/* Up */}
            <button
              className="font-bold text-3xl touch-manipulation flex items-center justify-center transition-all duration-150 active:scale-95 shadow-lg h-12 w-12"
              style={{
                backgroundColor: theme.colors.snake,
                color: theme.colors.background,
                borderRadius: theme.effects.rounded ? '8px' : '4px'
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                handleDirectionPress('up');
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                handleDirectionPress('up');
              }}
            >
              ↑
            </button>
            
            {/* Empty top-right */}
            <div></div>
            
            {/* Left */}
            <button
              className="font-bold text-3xl touch-manipulation flex items-center justify-center transition-all duration-150 active:scale-95 shadow-lg h-12 w-12"
              style={{
                backgroundColor: theme.colors.snake,
                color: theme.colors.background,
                borderRadius: theme.effects.rounded ? '8px' : '4px'
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                handleDirectionPress('left');
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                handleDirectionPress('left');
              }}
            >
              ←
            </button>
            
            {/* Center (empty) */}
            <div 
              className="opacity-30"
              style={{
                backgroundColor: theme.colors.ui,
                borderRadius: theme.effects.rounded ? '8px' : '4px'
              }}
            ></div>
            
            {/* Right */}
            <button
              className="font-bold text-3xl touch-manipulation flex items-center justify-center transition-all duration-150 active:scale-95 shadow-lg h-12 w-12"
              style={{
                backgroundColor: theme.colors.snake,
                color: theme.colors.background,
                borderRadius: theme.effects.rounded ? '8px' : '4px'
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                handleDirectionPress('right');
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                handleDirectionPress('right');
              }}
            >
              →
            </button>
            
            {/* Empty bottom-left */}
            <div></div>
            
            {/* Down */}
            <button
              className="font-bold text-3xl touch-manipulation flex items-center justify-center transition-all duration-150 active:scale-95 shadow-lg h-12 w-12"
              style={{
                backgroundColor: theme.colors.snake,
                color: theme.colors.background,
                borderRadius: theme.effects.rounded ? '8px' : '4px'
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                handleDirectionPress('down');
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                handleDirectionPress('down');
              }}
            >
              ↓
            </button>
            
            {/* Empty bottom-right */}
            <div></div>
          </div>
        </div>

        {/* Action Button */}
        {(gameState === 'menu' || gameState === 'gameOver') && (
          <button
            className="font-mono font-bold px-6 py-4 touch-manipulation transition-all duration-150 active:scale-95 shadow-lg text-base"
            style={{
              backgroundColor: theme.colors.food,
              color: theme.colors.background,
              borderRadius: theme.effects.rounded ? '8px' : '4px'
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              handleActionPress();
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              handleActionPress();
            }}
          >
            {gameState === 'menu' ? 'START' : 'RESTART'}
          </button>
        )}
      </div>
    </div>
  );
};

export default TouchControls;