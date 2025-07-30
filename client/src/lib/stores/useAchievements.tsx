import { create } from 'zustand';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  category: 'score' | 'theme' | 'gameplay' | 'special';
  requirement: {
    type: 'score' | 'theme_unlock' | 'games_played' | 'consecutive_wins' | 'special';
    value: number | string;
  };
  badge: {
    color: string;
    gradient: string;
    textColor: string;
  };
}

export const achievements: Achievement[] = [
  // Score Achievements
  {
    id: 'first_score',
    name: 'First Bite',
    description: 'Score your first 10 points',
    icon: '🍎',
    unlocked: false,
    category: 'score',
    requirement: { type: 'score', value: 10 },
    badge: { color: '#22c55e', gradient: 'linear-gradient(135deg, #22c55e, #16a34a)', textColor: '#ffffff' }
  },
  {
    id: 'century',
    name: 'Century Club',
    description: 'Reach 100 points in a single game',
    icon: '💯',
    unlocked: false,
    category: 'score',
    requirement: { type: 'score', value: 100 },
    badge: { color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', textColor: '#ffffff' }
  },
  {
    id: 'double_century',
    name: 'Double Century',
    description: 'Reach 200 points and unlock Halloween theme',
    icon: '🎃',
    unlocked: false,
    category: 'score',
    requirement: { type: 'score', value: 200 },
    badge: { color: '#f97316', gradient: 'linear-gradient(135deg, #f97316, #ea580c)', textColor: '#ffffff' }
  },
  {
    id: 'high_roller',
    name: 'High Roller',
    description: 'Reach 500 points in a single game',
    icon: '🔥',
    unlocked: false,
    category: 'score',
    requirement: { type: 'score', value: 500 },
    badge: { color: '#dc2626', gradient: 'linear-gradient(135deg, #dc2626, #b91c1c)', textColor: '#ffffff' }
  },
  // Theme Achievements
  {
    id: 'style_conscious',
    name: 'Style Conscious',
    description: 'Unlock the Modern UI theme',
    icon: '💎',
    unlocked: false,
    category: 'theme',
    requirement: { type: 'theme_unlock', value: 'modern' },
    badge: { color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', textColor: '#ffffff' }
  },
  {
    id: 'spooky_season',
    name: 'Spooky Season',
    description: 'Unlock the Halloween theme',
    icon: '👻',
    unlocked: false,
    category: 'theme',
    requirement: { type: 'theme_unlock', value: 'halloween' },
    badge: { color: '#a855f7', gradient: 'linear-gradient(135deg, #a855f7, #9333ea)', textColor: '#ffffff' }
  },
  // Gameplay Achievements
  {
    id: 'persistent',
    name: 'Persistent Player',
    description: 'Play 10 games',
    icon: '🎮',
    unlocked: false,
    category: 'gameplay',
    requirement: { type: 'games_played', value: 10 },
    badge: { color: '#06b6d4', gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)', textColor: '#ffffff' }
  },
  {
    id: 'dedicated',
    name: 'Dedicated Gamer',
    description: 'Play 50 games',
    icon: '🏆',
    unlocked: false,
    category: 'gameplay',
    requirement: { type: 'games_played', value: 50 },
    badge: { color: '#eab308', gradient: 'linear-gradient(135deg, #eab308, #ca8a04)', textColor: '#000000' }
  },
  // Special Achievements
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Score exactly 100 points',
    icon: '✨',
    unlocked: false,
    category: 'special',
    requirement: { type: 'special', value: 'exact_100' },
    badge: { color: '#ec4899', gradient: 'linear-gradient(135deg, #ec4899, #db2777)', textColor: '#ffffff' }
  }
];

interface AchievementState {
  achievements: Achievement[];
  gamesPlayed: number;
  lastUnlockedAchievement: Achievement | null;
  
  // Actions
  checkAchievements: (score: number, highScore: number, themesUnlocked: string[]) => Achievement[];
  unlockAchievement: (achievementId: string) => void;
  incrementGamesPlayed: () => void;
  getUnlockedAchievements: () => Achievement[];
  getAchievementProgress: () => { unlocked: number; total: number; percentage: number };
  generateShareText: (achievement: Achievement) => string;
  generateShareUrl: (achievement: Achievement) => string;
}

const getStorageValue = (key: string, defaultValue: string) => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    return localStorage.getItem(key) || defaultValue;
  } catch {
    return defaultValue;
  }
};

export const useAchievements = create<AchievementState>((set, get) => ({
  achievements: achievements.map(achievement => ({
    ...achievement,
    unlocked: JSON.parse(getStorageValue(`achievement_${achievement.id}`, 'false')),
    unlockedAt: getStorageValue(`achievement_${achievement.id}_date`, '') 
      ? new Date(getStorageValue(`achievement_${achievement.id}_date`, '')) 
      : undefined
  })),
  gamesPlayed: parseInt(getStorageValue('snakeGamesPlayed', '0')),
  lastUnlockedAchievement: null,

  checkAchievements: (score: number, highScore: number, themesUnlocked: string[]) => {
    const { achievements, gamesPlayed } = get();
    const newlyUnlocked: Achievement[] = [];

    achievements.forEach(achievement => {
      if (achievement.unlocked) return;

      let shouldUnlock = false;

      switch (achievement.requirement.type) {
        case 'score':
          shouldUnlock = score >= (achievement.requirement.value as number);
          break;
        case 'theme_unlock':
          shouldUnlock = themesUnlocked.includes(achievement.requirement.value as string);
          break;
        case 'games_played':
          shouldUnlock = gamesPlayed >= (achievement.requirement.value as number);
          break;
        case 'special':
          if (achievement.requirement.value === 'exact_100') {
            shouldUnlock = score === 100;
          }
          break;
      }

      if (shouldUnlock) {
        get().unlockAchievement(achievement.id);
        newlyUnlocked.push({ ...achievement, unlocked: true, unlockedAt: new Date() });
      }
    });

    return newlyUnlocked;
  },

  unlockAchievement: (achievementId: string) => {
    set(state => {
      const updatedAchievements = state.achievements.map(achievement => {
        if (achievement.id === achievementId && !achievement.unlocked) {
          const unlockedAchievement = {
            ...achievement,
            unlocked: true,
            unlockedAt: new Date()
          };
          
          // Persist to localStorage
          try {
            localStorage.setItem(`achievement_${achievementId}`, 'true');
            localStorage.setItem(`achievement_${achievementId}_date`, new Date().toISOString());
          } catch {
            // Ignore localStorage errors
          }
          
          return unlockedAchievement;
        }
        return achievement;
      });

      const unlockedAchievement = updatedAchievements.find(a => a.id === achievementId);
      
      return {
        achievements: updatedAchievements,
        lastUnlockedAchievement: unlockedAchievement || null
      };
    });
  },

  incrementGamesPlayed: () => {
    set(state => {
      const newCount = state.gamesPlayed + 1;
      try {
        localStorage.setItem('snakeGamesPlayed', newCount.toString());
      } catch {
        // Ignore localStorage errors
      }
      return { gamesPlayed: newCount };
    });
  },

  getUnlockedAchievements: () => {
    return get().achievements.filter(achievement => achievement.unlocked);
  },

  getAchievementProgress: () => {
    const { achievements } = get();
    const unlocked = achievements.filter(a => a.unlocked).length;
    const total = achievements.length;
    const percentage = Math.round((unlocked / total) * 100);
    
    return { unlocked, total, percentage };
  },

  generateShareText: (achievement: Achievement) => {
    return `🎉 I just unlocked "${achievement.name}" in Snake Game! ${achievement.icon}\n\n${achievement.description}\n\nPlay now: ${window.location.origin}`;
  },

  generateShareUrl: (achievement: Achievement) => {
    const text = encodeURIComponent(get().generateShareText(achievement));
    return `https://twitter.com/intent/tweet?text=${text}`;
  }
}));