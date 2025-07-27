import { useEffect, useCallback } from "react";
import GameCanvas from "./GameCanvas";
import GameUI from "./GameUI";
import TouchControls from "./TouchControls";
import { BannerAd } from "./AdComponents";
import { useSnakeGame } from "../lib/stores/useSnakeGame";
import { useAudio } from "../lib/stores/useAudio";
import { useAdsStore } from "../lib/stores/useAds";
import { useIsMobile } from "../hooks/use-is-mobile";

const Game = () => {
  const { 
    gameState, 
    direction, 
    score, 
    highScore,
    startGame, 
    resetGame, 
    changeDirection,
    gameLoop 
  } = useSnakeGame();
  
  const { playHit, playSuccess } = useAudio();
  const { showInterstitialAd } = useAdsStore();
  const isMobile = useIsMobile();

  // Handle keyboard input
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    event.preventDefault();
    
    if (gameState === 'menu' || gameState === 'gameOver') {
      if (event.code === 'Space' || event.code === 'Enter') {
        if (gameState === 'menu') {
          startGame();
        } else {
          resetGame();
        }
        return;
      }
    }

    if (gameState !== 'playing') return;

    // Handle direction changes
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        if (direction !== 'down') changeDirection('up');
        break;
      case 'ArrowDown':
      case 'KeyS':
        if (direction !== 'up') changeDirection('down');
        break;
      case 'ArrowLeft':
      case 'KeyA':
        if (direction !== 'right') changeDirection('left');
        break;
      case 'ArrowRight':
      case 'KeyD':
        if (direction !== 'left') changeDirection('right');
        break;
    }
  }, [gameState, direction, startGame, resetGame, changeDirection]);

  // Set up keyboard listeners
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      const result = gameLoop();
      
      if (result === 'ate_food') {
        playSuccess();
      } else if (result === 'game_over') {
        playHit();
        // Show ad after game over
        setTimeout(() => {
          showInterstitialAd();
        }, 1000);
      }
    }, 150); // Game speed

    return () => clearInterval(interval);
  }, [gameState, gameLoop, playSuccess, playHit]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-green-400 p-4">
      <div className="relative">
        <GameCanvas />
        <GameUI 
          gameState={gameState}
          score={score}
          highScore={highScore}
          onStart={startGame}
          onRestart={resetGame}
        />
      </div>
      
      <TouchControls
        gameState={gameState}
        direction={direction}
        onDirectionChange={changeDirection}
        onStart={startGame}
        onRestart={resetGame}
      />
      
      {/* Banner Ad at bottom */}
      <BannerAd />
    </div>
  );
};

export default Game;
