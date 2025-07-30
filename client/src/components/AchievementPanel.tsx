import React, { useState } from 'react';
import { useAchievements, Achievement } from '../lib/stores/useAchievements';
import { useThemeStore } from '../lib/stores/useTheme';
import AchievementBadge from './AchievementBadge';
import AchievementModal from './AchievementModal';

const AchievementPanel: React.FC = () => {
  const { achievements, getAchievementProgress } = useAchievements();
  const { getThemeConfig } = useThemeStore();
  const theme = getThemeConfig();
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  
  const progress = getAchievementProgress();
  
  // Group achievements by category
  const groupedAchievements = achievements.reduce((groups, achievement) => {
    const category = achievement.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(achievement);
    return groups;
  }, {} as Record<string, Achievement[]>);

  const categoryNames = {
    score: 'Score Milestones',
    theme: 'Style Master',
    gameplay: 'Dedication',
    special: 'Special Feats'
  };

  const categoryIcons = {
    score: '🎯',
    theme: '🎨',
    gameplay: '🎮',
    special: '⭐'
  };

  return (
    <>
      <div 
        className="w-full max-w-4xl mx-auto p-6 rounded-lg border-2"
        style={{
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.border,
          color: theme.colors.text
        }}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h2 
            className="text-2xl font-bold mb-2"
            style={{ color: theme.colors.text }}
          >
            🏆 Achievements
          </h2>
          <div 
            className="text-lg"
            style={{ color: theme.colors.accent }}
          >
            {progress.unlocked} / {progress.total} Unlocked ({progress.percentage}%)
          </div>
          
          {/* Progress Bar */}
          <div 
            className="w-full bg-gray-700 rounded-full h-3 mt-3"
            style={{ backgroundColor: theme.colors.ui }}
          >
            <div 
              className="h-3 rounded-full transition-all duration-500"
              style={{ 
                width: `${progress.percentage}%`,
                backgroundColor: theme.colors.accent
              }}
            />
          </div>
        </div>

        {/* Achievement Categories */}
        <div className="space-y-6">
          {Object.entries(groupedAchievements).map(([category, categoryAchievements]) => {
            const unlockedInCategory = categoryAchievements.filter(a => a.unlocked).length;
            
            return (
              <div key={category} className="space-y-3">
                {/* Category Header */}
                <div className="flex items-center justify-between">
                  <h3 
                    className="text-lg font-semibold flex items-center gap-2"
                    style={{ color: theme.colors.text }}
                  >
                    <span>{categoryIcons[category as keyof typeof categoryIcons]}</span>
                    {categoryNames[category as keyof typeof categoryNames]}
                  </h3>
                  <span 
                    className="text-sm"
                    style={{ color: theme.colors.accent }}
                  >
                    {unlockedInCategory}/{categoryAchievements.length}
                  </span>
                </div>
                
                {/* Achievement Badges */}
                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                  {categoryAchievements.map(achievement => (
                    <div key={achievement.id} className="flex flex-col items-center space-y-2">
                      <AchievementBadge 
                        achievement={achievement}
                        size="medium"
                        onClick={() => setSelectedAchievement(achievement)}
                      />
                      <div 
                        className="text-xs text-center leading-tight max-w-16"
                        style={{ color: achievement.unlocked ? theme.colors.text : theme.colors.text + '60' }}
                      >
                        {achievement.unlocked ? achievement.name : '???'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Recently Unlocked */}
        <div className="mt-8 pt-6 border-t" style={{ borderColor: theme.colors.border }}>
          <h3 
            className="text-lg font-semibold mb-3"
            style={{ color: theme.colors.text }}
          >
            🆕 Recently Unlocked
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {achievements
              .filter(a => a.unlocked && a.unlockedAt)
              .sort((a, b) => (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0))
              .slice(0, 6)
              .map(achievement => (
                <div key={achievement.id} className="flex-shrink-0">
                  <AchievementBadge 
                    achievement={achievement}
                    size="small"
                    onClick={() => setSelectedAchievement(achievement)}
                  />
                </div>
              ))}
            {achievements.filter(a => a.unlocked).length === 0 && (
              <div 
                className="text-sm italic"
                style={{ color: theme.colors.text + '80' }}
              >
                No achievements unlocked yet. Start playing to earn your first badge!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Achievement Modal */}
      {selectedAchievement && (
        <AchievementModal 
          achievement={selectedAchievement}
          onClose={() => setSelectedAchievement(null)}
        />
      )}
    </>
  );
};

export default AchievementPanel;