import React, { useEffect, useState } from 'react';
import { Achievement } from '../lib/stores/useAchievements';
import { useThemeStore } from '../lib/stores/useTheme';
import AchievementBadge from './AchievementBadge';

interface AchievementNotificationProps {
  achievement: Achievement;
  onClose: () => void;
  duration?: number;
}

const AchievementNotification: React.FC<AchievementNotificationProps> = ({ 
  achievement, 
  onClose, 
  duration = 4000 
}) => {
  const { getThemeConfig } = useThemeStore();
  const theme = getThemeConfig();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation
    setTimeout(() => setIsVisible(true), 100);
    
    // Auto close
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div 
      className={`
        fixed top-4 right-4 z-50 transform transition-all duration-300 ease-out max-w-xs
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}
    >
      <div 
        className="flex items-center gap-3 p-4 rounded-lg border-2 shadow-lg max-w-sm"
        style={{
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.accent,
          color: theme.colors.text,
          boxShadow: `0 0 20px ${theme.colors.accent}40`
        }}
      >
        {/* Achievement Badge */}
        <div className="flex-shrink-0">
          <AchievementBadge achievement={achievement} size="medium" />
        </div>
        
        {/* Achievement Info */}
        <div className="flex-1 min-w-0">
          <div 
            className="text-sm font-bold mb-1"
            style={{ color: theme.colors.accent }}
          >
            🎉 Achievement Unlocked!
          </div>
          <div 
            className="font-semibold text-sm"
            style={{ color: theme.colors.text }}
          >
            {achievement.name}
          </div>
          <div 
            className="text-xs opacity-75 truncate"
            style={{ color: theme.colors.text }}
          >
            {achievement.description}
          </div>
        </div>
        
        {/* Close Button */}
        <button 
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="flex-shrink-0 text-lg leading-none opacity-60 hover:opacity-100 transition-opacity"
          style={{ color: theme.colors.text }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default AchievementNotification;