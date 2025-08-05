import { useIsMobile } from "../hooks/use-is-mobile";
import { useThemeStore } from "../lib/stores/useTheme";
import { Direction } from "../lib/gameLogic";

interface TouchControlsProps {
  gameState: 'menu' | 'playing' | 'gameOver';
  direction: Direction;
  onDirectionChange: (direction: Direction) => void;
  onStart: () => void;
  onRestart: () => void;
  onShowLeaderboard?: () => void;
}

const TouchControls = ({ 
  gameState, 
  direction, 
  onDirectionChange, 
  onStart, 
  onRestart,
  onShowLeaderboard
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
      className="fixed left-0 right-0 bg-opacity-90"
      style={{ 
        backgroundColor: theme.colors.background + 'E6',
        bottom: '90px', // 70px for banner ad (50px + 20px padding) + 20px additional clearance
        paddingTop: '1rem',
        paddingLeft: '1rem',
        paddingRight: '1rem',
        paddingBottom: '1rem'
      }}
    >
      <div className="flex items-center justify-center max-w-sm mx-auto">
        {/* D-Pad Style Controls - Better spacing and proportions */}
        <div className="relative">
          <div className="grid grid-cols-3 gap-3 w-44 h-44">
            {/* Empty top-left */}
            <div></div>
            
            {/* Up */}
            <button
              className="font-bold text-2xl touch-manipulation flex items-center justify-center transition-all duration-150 active:scale-95 shadow-lg h-14 w-14"
              style={{
                backgroundColor: theme.colors.snake,
                color: theme.colors.background,
                borderRadius: theme.effects.rounded ? '12px' : '6px',
                WebkitTapHighlightColor: 'transparent',
                userSelect: 'none'
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Up touch start');
                handleDirectionPress('up');
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Up mouse down');
                handleDirectionPress('up');
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
              className="font-bold text-2xl touch-manipulation flex items-center justify-center transition-all duration-150 active:scale-95 shadow-lg h-14 w-14"
              style={{
                backgroundColor: theme.colors.snake,
                color: theme.colors.background,
                borderRadius: theme.effects.rounded ? '12px' : '6px',
                WebkitTapHighlightColor: 'transparent',
                userSelect: 'none'
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Left touch start');
                handleDirectionPress('left');
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Left mouse down');
                handleDirectionPress('left');
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
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
              className="font-bold text-2xl touch-manipulation flex items-center justify-center transition-all duration-150 active:scale-95 shadow-lg h-14 w-14"
              style={{
                backgroundColor: theme.colors.snake,
                color: theme.colors.background,
                borderRadius: theme.effects.rounded ? '12px' : '6px',
                WebkitTapHighlightColor: 'transparent',
                userSelect: 'none'
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Right touch start');
                handleDirectionPress('right');
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Right mouse down');
                handleDirectionPress('right');
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDirectionPress('right');
              }}
            >
              →
            </button>
            
            {/* Empty bottom-left */}
            <div></div>
            
            {/* Down */}
            <button
              className="font-bold text-2xl touch-manipulation flex items-center justify-center transition-all duration-150 active:scale-95 shadow-lg h-14 w-14"
              style={{
                backgroundColor: theme.colors.snake,
                color: theme.colors.background,
                borderRadius: theme.effects.rounded ? '12px' : '6px',
                WebkitTapHighlightColor: 'transparent',
                userSelect: 'none'
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Down touch start');
                handleDirectionPress('down');
              }}
              onTouchEnd={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('Down mouse down');
                handleDirectionPress('down');
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

        {/* Menu Buttons */}
        <div className="flex gap-2 ml-4">
          {/* Leaderboard Button (Menu only) */}
          {gameState === 'menu' && onShowLeaderboard && (
            <button
              className="font-mono font-bold px-3 py-4 touch-manipulation transition-all duration-150 active:scale-95 shadow-lg text-sm"
              style={{
                backgroundColor: theme.colors.ui,
                color: theme.colors.text,
                borderRadius: theme.effects.rounded ? '8px' : '4px'
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                onShowLeaderboard();
              }}
              onMouseDown={(e) => {
                e.preventDefault();
                onShowLeaderboard();
              }}
            >
              🏆
            </button>
          )}
          
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
    </div>
  );
};

export default TouchControls;