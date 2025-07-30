import React, { useState } from 'react';
import { Button } from './ui/button';
import { useThemeStore } from '../lib/stores/useTheme';
import { useIsMobile } from '../hooks/use-is-mobile';

interface NameInputModalProps {
  score: number;
  theme: string;
  onSubmit: (name: string) => void;
  onSkip: () => void;
}

const NameInputModal: React.FC<NameInputModalProps> = ({ score, theme, onSubmit, onSkip }) => {
  const [playerName, setPlayerName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { getThemeConfig } = useThemeStore();
  const isMobile = useIsMobile();
  const themeConfig = getThemeConfig();

  // Debug input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.slice(0, 20);
    console.log('Input changed:', newValue);
    setPlayerName(newValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await fetch('/api/leaderboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerName: playerName.trim(),
          score,
          theme
        }),
      });
      onSubmit(playerName.trim());
    } catch (error) {
      console.error('Failed to submit score:', error);
      // Still call onSubmit to close modal and continue
      onSubmit(playerName.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
      style={{ zIndex: 9999 }} // Ensure highest z-index
    >
      <div 
        className={`border-2 rounded-lg p-6 max-w-md w-full ${isMobile ? 'mx-4' : ''}`}
        style={{
          backgroundColor: themeConfig.colors.background,
          borderColor: themeConfig.colors.border,
          color: themeConfig.colors.text
        }}
        onClick={(e) => e.stopPropagation()} // Prevent event bubbling
      >
        <div className="text-center mb-6">
          <h2 className={`font-mono font-bold mb-2 ${isMobile ? 'text-xl' : 'text-2xl'}`} style={{ color: themeConfig.colors.accent }}>
            🏆 New High Score!
          </h2>
          <div className={`font-mono ${isMobile ? 'text-lg' : 'text-xl'}`} style={{ color: themeConfig.colors.food }}>
            {score.toLocaleString()} points
          </div>
          <div className="font-mono text-sm mt-2 opacity-70">
            Submit your score to the global leaderboard
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-mono text-sm block mb-2" style={{ color: themeConfig.colors.text }}>
              Your Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={handleInputChange}
              onInput={handleInputChange}
              placeholder="Enter your name"
              className="w-full px-3 py-2 font-mono border-2 rounded-lg focus:outline-none focus:ring-2 touch-manipulation"
              style={{
                backgroundColor: themeConfig.colors.ui,
                borderColor: themeConfig.colors.border,
                color: themeConfig.colors.text,
                borderRadius: themeConfig.effects.rounded ? '8px' : '4px',
                fontSize: isMobile ? '16px' : '14px' // Prevent zoom on iOS
              }}
              maxLength={20}
              autoFocus={!isMobile} // Don't autofocus on mobile to prevent keyboard issues
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="words"
              spellCheck="false"
              inputMode="text"
              enterKeyHint="done"
              data-testid="player-name-input"
            />
            <div className="font-mono text-xs mt-1 opacity-60">
              {playerName.length}/20 characters
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              onClick={onSkip}
              className="flex-1 font-mono py-2 transition-all duration-200"
              style={{
                backgroundColor: themeConfig.colors.ui,
                color: themeConfig.colors.text,
                border: `2px solid ${themeConfig.colors.border}`,
                borderRadius: themeConfig.effects.rounded ? '8px' : '4px'
              }}
            >
              Skip
            </Button>
            <Button
              type="submit"
              disabled={!playerName.trim() || isSubmitting}
              className="flex-1 font-mono py-2 transition-all duration-200 disabled:opacity-50"
              style={{
                backgroundColor: themeConfig.colors.accent,
                color: themeConfig.colors.background,
                border: `2px solid ${themeConfig.colors.accent}`,
                borderRadius: themeConfig.effects.rounded ? '8px' : '4px'
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Score'}
            </Button>
          </div>
        </form>

        <div className="text-center mt-4">
          <div className="font-mono text-xs opacity-50">
            Your score will be visible on the global leaderboard
          </div>
        </div>
      </div>
    </div>
  );
};

export default NameInputModal;