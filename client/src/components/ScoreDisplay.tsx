import React from 'react';
import { useThemeStore } from '../lib/stores/useTheme';
import { useIsMobile } from '../hooks/use-is-mobile';

interface ScoreDisplayProps {
  score: number;
  highScore: number;
  gameState: 'menu' | 'playing' | 'gameOver';
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, highScore, gameState }) => {
  const { getThemeConfig } = useThemeStore();
  const isMobile = useIsMobile();
  const theme = getThemeConfig();

  if (gameState === 'menu') return null;

  return (
    <div 
      className={`flex justify-between items-center rounded-lg border-2 ${isMobile ? 'px-3 py-2 mb-2' : 'px-4 py-3 mb-3'}`}
      style={{
        backgroundColor: theme.colors.ui,
        borderColor: theme.colors.border,
        color: theme.colors.text,
        minWidth: isMobile ? '280px' : '320px'
      }}
    >
      <div className={`font-mono font-bold ${isMobile ? 'text-base' : 'text-lg'}`}>
        Score: <span style={{ color: theme.colors.accent }}>{score}</span>
      </div>
      <div className={`font-mono font-bold ${isMobile ? 'text-base' : 'text-lg'}`}>
        Best: <span style={{ color: theme.colors.food }}>{highScore}</span>
      </div>
    </div>
  );
};

export default ScoreDisplay;