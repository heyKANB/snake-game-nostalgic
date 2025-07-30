import React from 'react';
import { useThemeStore } from '../lib/stores/useTheme';

interface ScoreDisplayProps {
  score: number;
  highScore: number;
  gameState: 'menu' | 'playing' | 'gameOver';
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, highScore, gameState }) => {
  const { getThemeConfig } = useThemeStore();
  const theme = getThemeConfig();

  if (gameState === 'menu') return null;

  return (
    <div 
      className="flex justify-between items-center p-3 mb-2 rounded-lg border-2"
      style={{
        backgroundColor: theme.colors.ui,
        borderColor: theme.colors.border,
        color: theme.colors.text
      }}
    >
      <div className="font-mono font-bold text-lg">
        Score: <span style={{ color: theme.colors.accent }}>{score}</span>
      </div>
      <div className="font-mono font-bold text-lg">
        Best: <span style={{ color: theme.colors.food }}>{highScore}</span>
      </div>
    </div>
  );
};

export default ScoreDisplay;