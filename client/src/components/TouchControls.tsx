import { useCallback } from "react";
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

  const handleDirectionPress = useCallback((newDirection: Direction) => {
    console.log('Direction pressed:', newDirection, 'Current state:', gameState, 'Current direction:', direction);
    
    if (gameState !== 'playing') return;
    
    // Prevent opposite direction changes
    const opposites: Record<Direction, Direction> = {
      up: 'down',
      down: 'up',
      left: 'right',
      right: 'left'
    };
    
    if (direction !== opposites[newDirection]) {
      console.log('Changing direction to:', newDirection);
      onDirectionChange(newDirection);
    } else {
      console.log('Blocked opposite direction change from', direction, 'to', newDirection);
    }
  }, [gameState, direction, onDirectionChange]);

  const handleActionPress = useCallback(() => {
    if (gameState === 'menu') {
      onStart();
    } else if (gameState === 'gameOver') {
      onRestart();
    }
  }, [gameState, onStart, onRestart]);
  
  if (!isMobile) return null;

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
          <div className="grid grid-cols-3 gap-3 w-44 h-44">
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
                e.stopPropagation();
                handleDirectionPress('up');
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
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
                e.stopPropagation();
                console.log('Left button touched');
                handleDirectionPress('left');
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Left button clicked');
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
                e.stopPropagation();
                console.log('Right button touched');
                handleDirectionPress('right');
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Right button clicked');
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
                e.stopPropagation();
                handleDirectionPress('down');
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
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
              e.stopPropagation();
              handleActionPress();
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
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