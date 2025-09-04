import React from 'react';
import { useThemeStore, themes, GameTheme } from '../lib/stores/useTheme';
import { useSnakeGame } from '../lib/stores/useSnakeGame';

const ThemeSelector: React.FC = () => {
  const { currentTheme, setTheme, getThemeConfig, isThemeUnlocked } = useThemeStore();
  const { highScore } = useSnakeGame();
  const config = getThemeConfig();
  
  // Debug logging to help identify the issue
  console.log('Available themes:', Object.keys(themes));
  console.log('Current high score:', highScore);

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4">
      <h3 
        className="text-lg font-bold text-center mb-4"
        style={{ color: config.colors.text }}
      >
        Game Theme
      </h3>
      
      <div className="grid grid-cols-1 gap-3">
        {Object.entries(themes).map(([themeKey, themeConfig]) => {
          const isSelected = currentTheme === themeKey;
          const isUnlocked = isThemeUnlocked(themeKey as GameTheme, highScore);
          
          return (
            <button
              key={themeKey}
              onClick={() => isUnlocked && setTheme(themeKey as GameTheme)}
              disabled={!isUnlocked}
              className={`
                relative p-4 border-2 transition-all duration-200 text-left
                ${themeConfig.effects.rounded ? 'rounded-lg' : 'rounded-none'}
                ${isSelected ? 'border-opacity-100' : 'border-opacity-50 hover:border-opacity-75'}
                ${!isUnlocked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
              `}
              style={{
                backgroundColor: themeConfig.colors.ui,
                borderColor: themeConfig.colors.border,
                background: themeConfig.effects.gradient 
                  ? `linear-gradient(135deg, ${themeConfig.colors.ui}, ${themeConfig.colors.background})`
                  : themeConfig.colors.ui
              }}
            >
              {/* Theme preview */}
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div 
                    className={`w-12 h-12 border-2 ${themeConfig.effects.rounded ? 'rounded-lg' : ''}`}
                    style={{ 
                      backgroundColor: themeConfig.colors.background,
                      borderColor: themeConfig.colors.border
                    }}
                  >
                    <div className="p-1 h-full flex items-center justify-center">
                      {/* Mini snake preview */}
                      <div className="flex space-x-0.5">
                        <div 
                          className={`w-2 h-2 ${themeConfig.effects.rounded ? 'rounded-sm' : ''}`}
                          style={{ 
                            backgroundColor: themeConfig.colors.snake,
                            boxShadow: themeConfig.effects.glow ? `0 0 4px ${themeConfig.colors.snake}` : 'none'
                          }}
                        />
                        <div 
                          className={`w-2 h-2 ${themeConfig.effects.rounded ? 'rounded-sm' : ''}`}
                          style={{ 
                            backgroundColor: themeConfig.colors.snake,
                            boxShadow: themeConfig.effects.glow ? `0 0 4px ${themeConfig.colors.snake}` : 'none'
                          }}
                        />
                      </div>
                      {/* Mini food preview */}
                      {themeConfig.foodStyle === 'pumpkin' ? (
                        <div className="w-2 h-2 ml-1 relative">
                          🎃
                        </div>
                      ) : (
                        <div 
                          className={`w-2 h-2 ml-1 ${themeConfig.effects.rounded || themeConfig.foodStyle === 'circle' ? 'rounded-full' : ''}`}
                          style={{ 
                            backgroundColor: themeConfig.colors.food,
                            boxShadow: themeConfig.effects.glow ? `0 0 4px ${themeConfig.colors.food}` : 'none'
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div 
                      className="font-semibold"
                      style={{ color: themeConfig.colors.text }}
                    >
                      {themeConfig.name}
                      {!isUnlocked && <span className="ml-2">🔒</span>}
                    </div>
                    {isSelected && <span className="text-sm">✓</span>}
                  </div>
                  <div 
                    className="text-sm opacity-75"
                    style={{ color: themeConfig.colors.text }}
                  >
                    {themeConfig.description}
                  </div>
                  {!isUnlocked && themeConfig.unlockRequirement && (
                    <div 
                      className="text-xs mt-1 font-medium"
                      style={{ color: themeConfig.colors.accent }}
                    >
                      Need {themeConfig.unlockRequirement} points (Current: {highScore})
                    </div>
                  )}
                  
                  {/* Feature indicators */}
                  <div className="flex space-x-2 mt-2">
                    {themeConfig.effects.glow && (
                      <span 
                        className="text-xs px-2 py-1 rounded"
                        style={{ 
                          backgroundColor: themeConfig.colors.accent + '20',
                          color: themeConfig.colors.accent 
                        }}
                      >
                        Glow
                      </span>
                    )}
                    {themeConfig.effects.gradient && (
                      <span 
                        className="text-xs px-2 py-1 rounded"
                        style={{ 
                          backgroundColor: themeConfig.colors.accent + '20',
                          color: themeConfig.colors.accent 
                        }}
                      >
                        Gradient
                      </span>
                    )}
                    {themeConfig.effects.rounded && (
                      <span 
                        className="text-xs px-2 py-1 rounded"
                        style={{ 
                          backgroundColor: themeConfig.colors.accent + '20',
                          color: themeConfig.colors.accent 
                        }}
                      >
                        Rounded
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Selection indicator */}
                {isSelected && (
                  <div 
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: themeConfig.colors.accent }}
                  >
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: themeConfig.colors.background }}
                    />
                  </div>
                )}
              </div>
              
              {/* Scanlines effect for retro theme preview */}
              {themeConfig.effects.scanlines && (
                <div 
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.03) 2px, rgba(0,255,0,0.03) 4px)'
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeSelector;