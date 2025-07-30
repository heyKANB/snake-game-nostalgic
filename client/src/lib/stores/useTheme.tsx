import { create } from 'zustand';

export type GameTheme = 'retro' | 'modern' | 'halloween';

interface ThemeConfig {
  name: string;
  description: string;
  unlockRequirement?: number; // High score required to unlock
  isPremium?: boolean; // Requires purchase
  colors: {
    background: string;
    snake: string;
    food: string;
    text: string;
    ui: string;
    border: string;
    accent: string;
  };
  effects: {
    glow: boolean;
    scanlines: boolean;
    rounded: boolean;
    gradient: boolean;
  };
  foodStyle?: 'square' | 'circle' | 'pumpkin'; // Custom food shapes
}

export const themes: Record<GameTheme, ThemeConfig> = {
  retro: {
    name: 'Retro Classic',
    description: 'Original green-on-black nostalgic experience',
    colors: {
      background: '#000000',
      snake: '#00ff00',
      food: '#ff0000',
      text: '#00ff00',
      ui: '#003300',
      border: '#00ff00',
      accent: '#ffff00'
    },
    effects: {
      glow: true,
      scanlines: true,
      rounded: false,
      gradient: false
    },
    foodStyle: 'square'
  },
  modern: {
    name: 'Modern UI',
    description: 'Clean contemporary design with vibrant colors - unlock at 100 points!',
    unlockRequirement: 100,
    colors: {
      background: '#1a1a2e',
      snake: '#00d9ff',
      food: '#ff6b6b',
      text: '#ffffff',
      ui: '#16213e',
      border: '#00d9ff',
      accent: '#ffd93d'
    },
    effects: {
      glow: false,
      scanlines: false,
      rounded: true,
      gradient: true
    },
    foodStyle: 'circle'
  },
  halloween: {
    name: 'Halloween Spooky',
    description: 'Spooky purple snake eating pumpkins - unlock at 200 points!',
    unlockRequirement: 200,
    colors: {
      background: '#000000',
      snake: '#8B2CF5', // Deep purple
      food: '#FF6B35', // Pumpkin orange
      text: '#A855F7', // Purple text
      ui: '#1A0B2E', // Dark purple UI
      border: '#32D74B', // Spooky green border
      accent: '#FF8C00' // Orange accent
    },
    effects: {
      glow: true,
      scanlines: false,
      rounded: true,
      gradient: true
    },
    foodStyle: 'pumpkin'
  }
};

interface ThemeState {
  currentTheme: GameTheme;
  setTheme: (theme: GameTheme) => void;
  getThemeConfig: () => ThemeConfig;
  isThemeUnlocked: (theme: GameTheme, highScore: number, isPurchased?: boolean) => boolean;
  getAvailableThemes: (highScore: number, purchasedThemes?: GameTheme[]) => GameTheme[];
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  currentTheme: (localStorage.getItem('snakeGameTheme') as GameTheme) || 'retro',

  setTheme: (theme: GameTheme) => {
    localStorage.setItem('snakeGameTheme', theme);
    set({ currentTheme: theme });
  },

  getThemeConfig: () => {
    const { currentTheme } = get();
    return themes[currentTheme];
  },

  isThemeUnlocked: (theme: GameTheme, highScore: number, isPurchased = false) => {
    const themeConfig = themes[theme];
    
    // Always allow retro theme (base theme)
    if (theme === 'retro') {
      return true;
    }
    
    // Check if premium theme is purchased
    if (themeConfig.isPremium && !isPurchased) {
      return false;
    }
    
    // Check high score requirement
    if (themeConfig.unlockRequirement && highScore < themeConfig.unlockRequirement) {
      return false;
    }
    
    return true;
  },

  getAvailableThemes: (highScore: number, purchasedThemes = []) => {
    return Object.keys(themes).filter(theme => 
      get().isThemeUnlocked(theme as GameTheme, highScore, purchasedThemes.includes(theme as GameTheme))
    ) as GameTheme[];
  }
}));