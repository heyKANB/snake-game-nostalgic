import { useIsMobile } from "../hooks/use-is-mobile";
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
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-black bg-opacity-80">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {/* D-Pad Style Controls */}
        <div className="relative">
          <div className="grid grid-cols-3 gap-1 w-32 h-32">
            {/* Empty top-left */}
            <div></div>
            
            {/* Up */}
            <button
              className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold text-2xl rounded-lg touch-manipulation flex items-center justify-center transition-all duration-150 active:scale-95 shadow-lg"
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
              className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold text-2xl rounded-lg touch-manipulation flex items-center justify-center transition-all duration-150 active:scale-95 shadow-lg"
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
            <div className="bg-gray-800 rounded-lg opacity-30"></div>
            
            {/* Right */}
            <button
              className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold text-2xl rounded-lg touch-manipulation flex items-center justify-center transition-all duration-150 active:scale-95 shadow-lg"
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
              className="bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold text-2xl rounded-lg touch-manipulation flex items-center justify-center transition-all duration-150 active:scale-95 shadow-lg"
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
            className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-mono font-bold px-6 py-4 rounded-lg touch-manipulation transition-all duration-150 active:scale-95 shadow-lg text-base"
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