import { create } from 'zustand';

export type GameTheme = 'retro' | 'modern';

interface ThemeConfig {
  name: string;
  description: string;
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
    }
  },
  modern: {
    name: 'Modern UI',
    description: 'Clean contemporary design with vibrant colors',
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
    }
  }
};

interface ThemeState {
  currentTheme: GameTheme;
  setTheme: (theme: GameTheme) => void;
  getThemeConfig: () => ThemeConfig;
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
  }
}));