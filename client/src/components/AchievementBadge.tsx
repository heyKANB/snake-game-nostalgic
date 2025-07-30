import React from 'react';
import { Achievement } from '../lib/stores/useAchievements';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'small' | 'medium' | 'large';
  onClick?: () => void;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ 
  achievement, 
  size = 'medium',
  onClick 
}) => {
  const sizeClasses = {
    small: 'w-12 h-12 text-xs',
    medium: 'w-16 h-16 text-sm',
    large: 'w-24 h-24 text-base'
  };

  const iconSizes = {
    small: 'text-lg',
    medium: 'text-2xl', 
    large: 'text-4xl'
  };

  return (
    <div
      className={`
        relative ${sizeClasses[size]} rounded-full flex flex-col items-center justify-center
        ${achievement.unlocked ? 'cursor-pointer hover:scale-105' : 'opacity-40'}
        transition-all duration-200 shadow-lg
        ${onClick ? 'cursor-pointer' : ''}
      `}
      style={{
        background: achievement.unlocked ? achievement.badge.gradient : '#374151',
        color: achievement.unlocked ? achievement.badge.textColor : '#9ca3af'
      }}
      onClick={onClick}
      title={achievement.unlocked ? achievement.name : '???'}
    >
      {/* Achievement Icon */}
      <div className={iconSizes[size]}>
        {achievement.unlocked ? achievement.icon : '🔒'}
      </div>
      
      {/* Achievement Name */}
      {size === 'large' && (
        <div className="text-xs font-bold text-center px-1 mt-1">
          {achievement.unlocked ? achievement.name : '???'}
        </div>
      )}
      
      {/* Unlock indicator */}
      {achievement.unlocked && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs">✓</span>
        </div>
      )}
    </div>
  );
};

export default AchievementBadge;