import { useEffect, useCallback, useState } from "react";
import GameCanvas from "./GameCanvas";
import GameUI from "./GameUI";
import TouchControls from "./TouchControls";
import ThemeSelector from "./ThemeSelector";
import Leaderboard from "./Leaderboard";
import NameInputModal from "./NameInputModal";
import { BannerAd } from "./AdComponents";
import ScoreDisplay from "./ScoreDisplay";
import { useSnakeGame } from "../lib/stores/useSnakeGame";
import { useAudio } from "../lib/stores/useAudio";
import { useAdsStore } from "../lib/stores/useAds";
import { useThemeStore } from "../lib/stores/useTheme";
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
  const { showInterstitialAd, incrementGameOverCount } = useAdsStore();
  const { getThemeConfig, currentTheme } = useThemeStore();
  const isMobile = useIsMobile();
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [submittedScore, setSubmittedScore] = useState<number | null>(null);
  const theme = getThemeConfig();

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
        incrementGameOverCount();
        // Delay ads until after leaderboard interaction is complete
      }
    }, 150); // Game speed

    return () => clearInterval(interval);
  }, [gameState, gameLoop, playSuccess, playHit]);

  // Check for high score achievement and show name input
  useEffect(() => {
    if (gameState === 'gameOver' && submittedScore !== score) {
      // Get the previous high score from localStorage for comparison
      const previousHighScore = parseInt(localStorage.getItem('snakeHighScore') || '0');
      if (score > previousHighScore) {
        // Show name input only for new personal high scores
        setShowNameInput(true);
      }
    }
  }, [gameState, score, submittedScore]);

  const handleNameSubmit = (name: string) => {
    setSubmittedScore(score);
    setShowNameInput(false);
    // Show ad after leaderboard interaction is complete
    setTimeout(() => {
      showInterstitialAd();
    }, 500);
  };

  const handleNameSkip = () => {
    setSubmittedScore(score);
    setShowNameInput(false);
    // Show ad after leaderboard interaction is complete
    setTimeout(() => {
      showInterstitialAd();
    }, 500);
  };

  return (
    <div 
      className="flex flex-col items-center justify-start min-h-screen p-4 pt-8"
      style={{ 
        backgroundColor: theme.colors.background,
        color: theme.colors.text 
      }}
    >
      {/* Menu Buttons - positioned below status bar */}
      {gameState === 'menu' && (
        <div className="absolute top-16 right-4 flex gap-2 z-10">
          <button
            onClick={() => setShowLeaderboard(true)}
            className="p-2 rounded-lg border-2 transition-all duration-200"
            style={{
              backgroundColor: theme.colors.ui,
              borderColor: theme.colors.border,
              color: theme.colors.text
            }}
          >
            🏆 Leaderboard
          </button>
          <button
            onClick={() => setShowThemeSelector(!showThemeSelector)}
            className="p-2 rounded-lg border-2 transition-all duration-200"
            style={{
              backgroundColor: theme.colors.ui,
              borderColor: theme.colors.border,
              color: theme.colors.text
            }}
          >
            🎨 Theme
          </button>
        </div>
      )}

      {/* Theme Selector Modal */}
      {showThemeSelector && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setShowThemeSelector(false)}
        >
          <div 
            className="p-6 rounded-lg border-2 max-h-[80vh] overflow-y-auto"
            style={{
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.border
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <ThemeSelector />
            <button
              onClick={() => setShowThemeSelector(false)}
              className="mt-4 w-full p-2 rounded-lg border-2 transition-all duration-200"
              style={{
                backgroundColor: theme.colors.snake,
                borderColor: theme.colors.border,
                color: theme.colors.background
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      
      <div className="w-full max-w-lg mx-auto mb-20">
        {/* Score Display - Outside game canvas */}
        <ScoreDisplay 
          score={score}
          highScore={highScore}
          gameState={gameState}
        />
        
        {/* Game Canvas and UI */}
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
      </div>
      
      <TouchControls
        gameState={gameState}
        direction={direction}
        onDirectionChange={changeDirection}
        onStart={startGame}
        onRestart={resetGame}
        onShowLeaderboard={() => setShowLeaderboard(true)}
      />
      
      {/* Modals */}
      {showLeaderboard && (
        <Leaderboard onClose={() => setShowLeaderboard(false)} />
      )}
      
      {showNameInput && (
        <NameInputModal
          score={score}
          theme={currentTheme || "retro"}
          onSubmit={handleNameSubmit}
          onSkip={handleNameSkip}
        />
      )}
      
      {/* Banner Ad at bottom */}
      <BannerAd />
    </div>
  );
};

export default Game;
