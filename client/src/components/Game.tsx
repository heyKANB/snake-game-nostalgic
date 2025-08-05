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
  const [previousHighScore, setPreviousHighScore] = useState<number>(0);
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

  // Initialize previous high score on component mount
  useEffect(() => {
    const currentHighScore = parseInt(localStorage.getItem('snakeHighScore') || '0');
    setPreviousHighScore(currentHighScore);
    console.log('Initialized previous high score:', currentHighScore);
  }, []);

  // Update previous high score when starting a new game
  useEffect(() => {
    if (gameState === 'playing') {
      // Capture the high score at the moment the game starts
      const gameStartHighScore = parseInt(localStorage.getItem('snakeHighScore') || '0');
      setPreviousHighScore(gameStartHighScore);
      console.log('Game started - previous high score set to:', gameStartHighScore);
    }
  }, [gameState]);

  // Show name input for any game over with score > 0 (for leaderboard submission)
  useEffect(() => {
    if (gameState === 'gameOver' && submittedScore !== score) {
      console.log('Score submission check:', { score, previousHighScore, highScore, submittedScore, gameState });
      
      if (score > 0) {
        console.log('Score > 0, showing name input for leaderboard submission');
        setShowNameInput(true);
      } else {
        console.log('Score is 0, skipping name input');
      }
    }
  }, [gameState, score, previousHighScore, submittedScore]);

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
      className="flex flex-col min-h-screen relative"
      style={{ 
        backgroundColor: theme.colors.background,
        color: theme.colors.text 
      }}
    >
      {/* Menu Buttons - positioned below status bar with better spacing */}
      {gameState === 'menu' && (
        <div className="absolute top-4 right-4 flex gap-3 z-10" style={{ marginTop: isMobile ? '60px' : '20px' }}>
          <button
            onClick={() => setShowLeaderboard(true)}
            className="px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm font-medium"
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
            className="px-3 py-2 rounded-lg border-2 transition-all duration-200 text-sm font-medium"
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
      
      {/* Main Game Area - Centered and Properly Spaced */}
      <div 
        className="flex-1 flex flex-col items-center justify-center px-4 py-8"
        style={isMobile ? { 
          paddingBottom: '200px' // Extra space for touch controls (176px) + ad banner (70px) + padding
        } : {}}
      >
        <div className="w-full max-w-md mx-auto space-y-6">
          {/* Score Display - Better spacing from top */}
          <div className="flex justify-center">
            <ScoreDisplay 
              score={score}
              highScore={highScore}
              gameState={gameState}
            />
          </div>
          
          {/* Game Canvas and UI - Centered with breathing room */}
          <div className="relative mx-auto" style={{ width: 'fit-content' }}>
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
