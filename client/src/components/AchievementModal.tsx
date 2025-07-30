import React from 'react';
import { Achievement, useAchievements } from '../lib/stores/useAchievements';
import { useThemeStore } from '../lib/stores/useTheme';
import AchievementBadge from './AchievementBadge';

interface AchievementModalProps {
  achievement: Achievement;
  onClose: () => void;
}

const AchievementModal: React.FC<AchievementModalProps> = ({ achievement, onClose }) => {
  const { generateShareText, generateShareUrl } = useAchievements();
  const { getThemeConfig } = useThemeStore();
  const theme = getThemeConfig();

  const handleShare = (platform: 'twitter' | 'copy') => {
    if (platform === 'twitter') {
      const url = generateShareUrl(achievement);
      window.open(url, '_blank', 'width=600,height=400');
    } else if (platform === 'copy') {
      const text = generateShareText(achievement);
      navigator.clipboard.writeText(text).then(() => {
        // Could add a toast notification here
        alert('Achievement text copied to clipboard!');
      });
    }
  };

  const handleDownloadBadge = () => {
    // Create a canvas to generate badge image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 400;

    // Draw gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    const gradientMatch = achievement.badge.gradient.match(/linear-gradient\([\d\w,\s#().-]+\)/);
    if (gradientMatch) {
      // Parse gradient colors (simplified)
      gradient.addColorStop(0, achievement.badge.color);
      gradient.addColorStop(1, achievement.badge.color);
    }
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw badge content
    ctx.textAlign = 'center';
    ctx.fillStyle = achievement.badge.textColor;
    
    // Achievement icon
    ctx.font = '120px Arial';
    ctx.fillText(achievement.icon, canvas.width / 2, 160);
    
    // Achievement name
    ctx.font = 'bold 36px Arial';
    ctx.fillText(achievement.name, canvas.width / 2, 220);
    
    // Achievement description
    ctx.font = '24px Arial';
    const words = achievement.description.split(' ');
    let line = '';
    let y = 260;
    
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > 350 && n > 0) {
        ctx.fillText(line, canvas.width / 2, y);
        line = words[n] + ' ';
        y += 30;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, canvas.width / 2, y);

    // Date unlocked
    if (achievement.unlockedAt) {
      ctx.font = '18px Arial';
      ctx.fillText(
        `Unlocked: ${achievement.unlockedAt.toLocaleDateString()}`, 
        canvas.width / 2, 
        350
      );
    }

    // Download the image
    const link = document.createElement('a');
    link.download = `snake-achievement-${achievement.id}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-900 rounded-lg border-2 p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.border,
          color: theme.colors.text
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h2 
            className="text-xl font-bold"
            style={{ color: theme.colors.text }}
          >
            Achievement Details
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl leading-none"
            style={{ color: theme.colors.text + '80' }}
          >
            ×
          </button>
        </div>

        {/* Achievement Display */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <AchievementBadge achievement={achievement} size="large" />
          </div>
          
          <h3 
            className="text-lg font-bold mb-2"
            style={{ color: theme.colors.accent }}
          >
            {achievement.unlocked ? achievement.name : 'Locked Achievement'}
          </h3>
          
          <p 
            className="text-sm mb-3"
            style={{ color: theme.colors.text }}
          >
            {achievement.unlocked ? achievement.description : 'Complete the requirement to unlock this achievement.'}
          </p>

          {achievement.unlockedAt && (
            <p 
              className="text-xs"
              style={{ color: theme.colors.text + '80' }}
            >
              Unlocked on {achievement.unlockedAt.toLocaleDateString()} at {achievement.unlockedAt.toLocaleTimeString()}
            </p>
          )}
        </div>

        {/* Sharing Options - Only show if unlocked */}
        {achievement.unlocked && (
          <div className="space-y-3">
            <h4 
              className="font-semibold text-center"
              style={{ color: theme.colors.text }}
            >
              Share Your Achievement
            </h4>
            
            <div className="grid grid-cols-1 gap-3">
              {/* Twitter Share */}
              <button
                onClick={() => handleShare('twitter')}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: '#1DA1F2',
                  color: '#ffffff'
                }}
              >
                <span>🐦</span>
                Share on Twitter
              </button>

              {/* Copy Text */}
              <button
                onClick={() => handleShare('copy')}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: theme.colors.ui,
                  color: theme.colors.text,
                  border: `1px solid ${theme.colors.border}`
                }}
              >
                <span>📋</span>
                Copy Text
              </button>

              {/* Download Badge */}
              <button
                onClick={handleDownloadBadge}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all duration-200 hover:scale-105"
                style={{
                  backgroundColor: theme.colors.snake,
                  color: theme.colors.background
                }}
              >
                <span>⬇️</span>
                Download Badge
              </button>
            </div>
          </div>
        )}

        {/* Requirement Info for locked achievements */}
        {!achievement.unlocked && (
          <div 
            className="mt-4 p-3 rounded-lg border"
            style={{
              backgroundColor: theme.colors.ui,
              borderColor: theme.colors.border
            }}
          >
            <h4 className="font-semibold mb-2">Unlock Requirement:</h4>
            <p className="text-sm">
              {achievement.requirement.type === 'score' && `Reach ${achievement.requirement.value} points`}
              {achievement.requirement.type === 'theme_unlock' && `Unlock the ${achievement.requirement.value} theme`}
              {achievement.requirement.type === 'games_played' && `Play ${achievement.requirement.value} games`}
              {achievement.requirement.type === 'special' && achievement.description}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AchievementModal;