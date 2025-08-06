// Configuration for API endpoints
export const getApiBaseUrl = (): string => {
  // Check if running in Capacitor (native mobile app)
  if (typeof window !== 'undefined' && (window as any).Capacitor) {
    console.log('Running in Capacitor (native iOS app) - using production API URL');
    // For native iOS/Android apps, always use the production server
    // Updated to use the correct production Replit deployment URL
    return 'https://retro-snake-huntergames.replit.app';
  }
  
  // In development (localhost/replit), use relative URLs to hit the local server
  if (typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || 
       window.location.hostname === '127.0.0.1' ||
       window.location.hostname.includes('replit.dev'))) {
    console.log('Running in development - using relative API URLs');
    return '';
  }
  
  // For production web apps, use relative URLs (same origin)
  if (typeof window !== 'undefined' && window.location.hostname.includes('replit.app')) {
    console.log('Running in production web - using relative API URLs');
    return '';
  }
  
  // Fallback for native mobile apps
  console.log('Fallback - using production API URL for native app');
  return 'https://retro-snake-huntergames.replit.app';
};

export const API_ENDPOINTS = {
  SUBMIT_SCORE: '/api/leaderboard',
  ALL_TIME_LEADERBOARD: '/api/leaderboard/all-time',
  WEEKLY_LEADERBOARD: '/api/leaderboard/weekly',
  DAILY_LEADERBOARD: '/api/leaderboard/daily',
} as const;