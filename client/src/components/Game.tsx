import { useEffect, useCallback, useState } from "react";
import GameCanvas from "./GameCanvas";
import GameUI from "./GameUI";
import TouchControls from "./TouchControls";
import ThemeSelector from "./ThemeSelector";
import { BannerAd } from "./AdComponents";
import ScoreDisplay from "./ScoreDisplay";
import AchievementPanel from "./AchievementPanel";
import { useSnakeGame } from "../lib/stores/useSnakeGame";
import { useAudio } from "../lib/stores/useAudio";
import { useAdsStore } from "../lib/stores/useAds";
import { useThemeStore } from "../lib/stores/useTheme";
import { useAchievements, Achievement } from "../lib/stores/useAchievements";
import AchievementNotification from "./AchievementNotification";
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
  const { getThemeConfig, getUnlockedThemes } = useThemeStore();
  const { checkAchievements, incrementGamesPlayed } = useAchievements();
  const isMobile = useIsMobile();
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [achievementQueue, setAchievementQueue] = useState<Achievement[]>([]);
  const [currentNotification, setCurrentNotification] = useState<Achievement | null>(null);
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

  // Achievement notification queue handler
  useEffect(() => {
    if (achievementQueue.length > 0 && !currentNotification) {
      setCurrentNotification(achievementQueue[0]);
      setAchievementQueue(prev => prev.slice(1));
    }
  }, [achievementQueue, currentNotification]);

  // Check achievements when score changes
  useEffect(() => {
    if (gameState === 'playing' || gameState === 'gameOver') {
      const unlockedThemes = getUnlockedThemes();
      const newAchievements = checkAchievements(score, highScore, unlockedThemes);
      if (newAchievements.length > 0) {
        setAchievementQueue(prev => [...prev, ...newAchievements]);
      }
    }
  }, [score, highScore, gameState, checkAchievements, getUnlockedThemes]);

  // Increment games played when starting a new game
  useEffect(() => {
    if (gameState === 'playing') {
      incrementGamesPlayed();
    }
  }, [gameState, incrementGamesPlayed]);

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
  }, [gameState, gameLoop, playSuccess, playHit, showInterstitialAd]);

  return (
    <div 
      className="flex flex-col items-center justify-start min-h-screen p-4 pt-8"
      style={{ 
        backgroundColor: theme.colors.background,
        color: theme.colors.text 
      }}
    >
      {/* Top Menu Buttons */}
      {gameState === 'menu' && (
        <div className="absolute top-4 right-4 flex gap-2">
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
          <button
            onClick={() => setShowAchievements(!showAchievements)}
            className="p-2 rounded-lg border-2 transition-all duration-200"
            style={{
              backgroundColor: theme.colors.ui,
              borderColor: theme.colors.border,
              color: theme.colors.text
            }}
          >
            🏆 Achievements
          </button>
        </div>
      )}

      {/* Theme Selector Modal */}
      {showThemeSelector && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
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

      {/* Achievements Panel Modal */}
      {showAchievements && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAchievements(false)}
        >
          <div 
            className="max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <AchievementPanel />
            <button
              onClick={() => setShowAchievements(false)}
              className="mt-4 w-full p-3 rounded-lg border-2 transition-all duration-200 font-bold"
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
      />
      
      {/* Banner Ad at bottom */}
      <BannerAd />

      {/* Achievement Notification */}
      {currentNotification && (
        <AchievementNotification
          achievement={currentNotification}
          onClose={() => setCurrentNotification(null)}
        />
      )}
    </div>
  );
};

export default Game;
