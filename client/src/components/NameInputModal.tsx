import React, { useState, useEffect, useRef } from 'react';
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
  const inputRef = useRef<HTMLInputElement>(null);

  // Force focus on mount for mobile
  useEffect(() => {
    if (isMobile && inputRef.current) {
      const timer = setTimeout(() => {
        console.log('Mobile focus attempt via useEffect');
        inputRef.current?.focus();
        inputRef.current?.click();
        
        // Add native event listeners for better mobile support
        const input = inputRef.current;
        if (input) {
          const handleNativeInput = (e: Event) => {
            const target = e.target as HTMLInputElement;
            const newValue = target.value.slice(0, 20);
            console.log('Native input event:', newValue);
            setPlayerName(newValue);
          };
          
          input.addEventListener('input', handleNativeInput);
          input.addEventListener('textInput', handleNativeInput);
          
          return () => {
            input.removeEventListener('input', handleNativeInput);
            input.removeEventListener('textInput', handleNativeInput);
          };
        }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  // Debug input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.slice(0, 20);
    console.log('Input changed:', newValue, 'Event type:', e.type);
    setPlayerName(newValue);
  };

  // Handle keyboard input directly for mobile compatibility
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log('Key down:', e.key, e.code);
    
    // For mobile compatibility, manually handle character input
    if (e.key.length === 1 && playerName.length < 20) {
      const newValue = playerName + e.key;
      console.log('Manual character input:', newValue);
      setPlayerName(newValue);
      e.preventDefault();
    } else if (e.key === 'Backspace' && playerName.length > 0) {
      const newValue = playerName.slice(0, -1);
      console.log('Manual backspace:', newValue);
      setPlayerName(newValue);
      e.preventDefault();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log('Key press:', e.key, e.code);
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log('Key up:', e.key, e.code);
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
      style={{ 
        zIndex: 9999,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
    >
      <div 
        className={`border-2 rounded-lg p-6 max-w-md w-full ${isMobile ? 'mx-4' : ''}`}
        style={{
          backgroundColor: themeConfig.colors.background,
          borderColor: themeConfig.colors.border,
          color: themeConfig.colors.text,
          position: 'relative',
          zIndex: 10000
        }}
        onClick={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
        onTouchEnd={(e) => e.stopPropagation()}
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
            <label 
              className="font-mono text-sm block mb-2" 
              style={{ color: themeConfig.colors.text }}
              onClick={() => {
                const input = document.querySelector('[data-testid="player-name-input"]') as HTMLInputElement;
                if (input) {
                  input.focus();
                  input.click();
                }
              }}
            >
              Your Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={handleInputChange}
              onInput={handleInputChange}
              onKeyDown={handleKeyDown}
              onKeyPress={handleKeyPress}
              onKeyUp={handleKeyUp}
              onFocus={() => console.log('Input focused')}
              onBlur={() => console.log('Input blurred')}
              placeholder="Enter your name"
              className="w-full px-3 py-2 font-mono border-2 rounded-lg focus:outline-none focus:ring-2"
              style={{
                backgroundColor: themeConfig.colors.ui,
                borderColor: themeConfig.colors.border,
                color: themeConfig.colors.text,
                borderRadius: themeConfig.effects.rounded ? '8px' : '4px',
                fontSize: '16px',
                lineHeight: '1.5',
                WebkitAppearance: 'none',
                appearance: 'none',
                border: 'none',
                outline: 'none',
                boxShadow: 'none',
                WebkitUserSelect: 'text',
                userSelect: 'text',
                WebkitTouchCallout: 'default',
                WebkitTapHighlightColor: 'rgba(0,0,0,0)',
                touchAction: 'manipulation'
              }}
              maxLength={20}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="words"
              spellCheck="false"
              inputMode="text"
              enterKeyHint="done"
              tabIndex={1}
              data-testid="player-name-input"
              ref={inputRef}
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