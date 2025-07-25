import { Button } from "./ui/button";
import { useIsMobile } from "../hooks/use-is-mobile";

interface GameUIProps {
  gameState: 'menu' | 'playing' | 'gameOver';
  score: number;
  highScore: number;
  onStart: () => void;
  onRestart: () => void;
}

const GameUI = ({ gameState, score, highScore, onStart, onRestart }: GameUIProps) => {
  const isMobile = useIsMobile();
  
  if (gameState === 'menu') {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 text-green-400">
        <div className="text-center space-y-6 px-4">
          <h1 className={`font-mono font-bold tracking-wider mb-8 ${isMobile ? 'text-4xl' : 'text-6xl'}`}>
            SNAKE
          </h1>
          <div className={`font-mono space-y-2 ${isMobile ? 'text-lg' : 'text-xl'}`}>
            <p>{isMobile ? 'Use touch controls to move' : 'Use ARROW KEYS or WASD to move'}</p>
            <p>Eat the red food to grow</p>
            <p>Don't hit the walls or yourself!</p>
          </div>
          <div className={`font-mono ${isMobile ? 'text-base' : 'text-lg'}`}>
            <p>High Score: {highScore}</p>
          </div>
          {!isMobile && (
            <Button 
              onClick={onStart}
              className="bg-green-600 hover:bg-green-700 text-white font-mono text-xl px-8 py-3"
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
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-90 text-green-400">
        <div className="text-center space-y-6 px-4">
          <h1 className={`font-mono font-bold text-red-500 mb-4 ${isMobile ? 'text-3xl' : 'text-5xl'}`}>
            GAME OVER
          </h1>
          <div className={`font-mono space-y-2 ${isMobile ? 'text-xl' : 'text-2xl'}`}>
            <p>Final Score: {score}</p>
            <p>High Score: {highScore}</p>
          </div>
          {!isMobile && (
            <Button 
              onClick={onRestart}
              className="bg-green-600 hover:bg-green-700 text-white font-mono text-xl px-8 py-3"
            >
              PRESS SPACE TO RESTART
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Playing state - show score in corner
  return (
    <div className="absolute top-4 left-4 text-green-400 font-mono text-xl">
      <div>Score: {score}</div>
      <div>High: {highScore}</div>
    </div>
  );
};

export default GameUI;
