// Configuration for API endpoints
export const getApiBaseUrl = (): string => {
  // In development (localhost), use relative URLs to hit the local server
  if (typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || 
       window.location.hostname === '127.0.0.1' ||
       window.location.hostname.includes('replit'))) {
    return '';
  }
  
  // For production mobile apps, use the deployed Replit server
  // Based on your Replit username: ct5bbry8gg and project: snake-game-nostalgic
  return 'https://snake-game-nostalgic.ct5bbry8gg.replit.app';
};

export const API_ENDPOINTS = {
  SUBMIT_SCORE: '/api/leaderboard',
  ALL_TIME_LEADERBOARD: '/api/leaderboard/all-time',
  WEEKLY_LEADERBOARD: '/api/leaderboard/weekly',
  DAILY_LEADERBOARD: '/api/leaderboard/daily',
} as const;