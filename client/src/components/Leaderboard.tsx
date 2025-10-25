import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { useThemeStore } from '../lib/stores/useTheme';
import { useIsMobile } from '../hooks/use-is-mobile';

interface LeaderboardEntry {
  id: number;
  playerName: string;
  score: number;
  theme: string;
  createdAt: string;
}

type LeaderboardType = 'daily' | 'weekly' | 'all-time';

interface LeaderboardProps {
  onClose: () => void;
  refreshTrigger?: number; // Optional prop to trigger refresh
}

const Leaderboard: React.FC<LeaderboardProps> = ({ onClose, refreshTrigger }) => {
  const [selectedType, setSelectedType] = useState<LeaderboardType>('all-time');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const { getThemeConfig } = useThemeStore();
  const isMobile = useIsMobile();
  const theme = getThemeConfig();

  const fetchLeaderboard = async (type: LeaderboardType) => {
    setLoading(true);
    try {
      const { getApiBaseUrl, API_ENDPOINTS } = await import('../lib/config');
      const apiBaseUrl = getApiBaseUrl();
      const fetchUrl = `${apiBaseUrl}${API_ENDPOINTS[`${type.toUpperCase().replace('-', '_')}_LEADERBOARD` as keyof typeof API_ENDPOINTS]}`;
      
      console.log(`Fetching ${type} leaderboard from:`, fetchUrl);
      console.log('Environment info:', {
        hostname: window.location.hostname,
        userAgent: navigator.userAgent,
        isCapacitor: !!(window as any).Capacitor
      });
      
      const response = await fetch(fetchUrl);
      if (response.ok) {
        const data = await response.json();
        console.log(`${type} leaderboard data received:`, data.length, 'entries');
        setLeaderboardData(data);
      } else {
        console.error(`Failed to fetch ${type} leaderboard, status:`, response.status);
        setLeaderboardData([]);
      }
    } catch (error) {
      console.error(`Error fetching ${type} leaderboard:`, error);
      console.error('Fetch error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        url: window.location.href,
        userAgent: navigator.userAgent
      });
      setLeaderboardData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard(selectedType);
  }, [selectedType]);

  // Refresh leaderboard when component mounts/opens or refreshTrigger changes
  useEffect(() => {
    fetchLeaderboard(selectedType);
  }, []); // Empty dependency array means this runs once on mount

  // Refresh when refreshTrigger prop changes (after score submission)
  useEffect(() => {
    if (refreshTrigger !== undefined) {
      console.log('Leaderboard refresh triggered by score submission, refreshing all types...');
      fetchLeaderboard(selectedType);
    }
  }, [refreshTrigger, selectedType]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getThemeIcon = (themeName: string) => {
    switch (themeName) {
      case 'retro': return '🟢';
      case 'modern': return '🔵';
      case 'halloween': return '🎃';
      case 'christmas': return '🎄';
      case 'football': return '🏈';
      default: return '⭐';
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className={`border-2 rounded-lg max-h-[90vh] overflow-y-auto ${isMobile ? 'w-full max-w-sm' : 'w-full max-w-2xl'}`}
        style={{
          backgroundColor: theme.colors.background,
          borderColor: theme.colors.border,
          color: theme.colors.text
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b-2" style={{ borderColor: theme.colors.border }}>
          <div className="flex justify-between items-center mb-4">
            <h2 className={`font-mono font-bold ${isMobile ? 'text-xl' : 'text-2xl'}`} style={{ color: theme.colors.accent }}>
              🏆 Global Leaderboard
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  console.log(`Manually refreshing ${selectedType} leaderboard...`);
                  setLeaderboardData([]); // Clear current data to show loading state
                  fetchLeaderboard(selectedType);
                }}
                className="font-mono text-sm px-2 py-1 rounded transition-all duration-200 hover:opacity-80"
                style={{
                  backgroundColor: theme.colors.accent,
                  borderColor: theme.colors.border,
                  color: theme.colors.background
                }}
                title="Refresh leaderboard"
              >
                🔄
              </button>
              <button
                onClick={onClose}
                className="font-mono font-bold px-3 py-1 rounded transition-all duration-200"
                style={{
                  backgroundColor: theme.colors.ui,
                  borderColor: theme.colors.border,
                  color: theme.colors.text
                }}
              >
                ✕
              </button>
            </div>
          </div>

          {/* Type Selection */}
          <div className="flex gap-2">
            {(['daily', 'weekly', 'all-time'] as LeaderboardType[]).map((type) => (
              <Button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`font-mono text-sm px-3 py-2 transition-all duration-200 ${isMobile ? 'text-xs' : 'text-sm'}`}
                style={{
                  backgroundColor: selectedType === type ? theme.colors.accent : theme.colors.ui,
                  color: selectedType === type ? theme.colors.background : theme.colors.text,
                  border: `1px solid ${theme.colors.border}`,
                  borderRadius: theme.effects.rounded ? '6px' : '0px'
                }}
              >
                {type === 'all-time' ? 'All Time' : type.charAt(0).toUpperCase() + type.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Leaderboard Content */}
        <div className="p-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="font-mono text-lg" style={{ color: theme.colors.text }}>
                Loading...
              </div>
            </div>
          ) : leaderboardData.length === 0 ? (
            <div className="text-center py-8">
              <div className="font-mono text-lg" style={{ color: theme.colors.text }}>
                No scores yet!
              </div>
              <div className="font-mono text-sm mt-2" style={{ color: theme.colors.ui }}>
                Be the first to set a high score
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {leaderboardData.map((entry, index) => (
                <div 
                  key={entry.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${isMobile ? 'text-sm' : 'text-base'}`}
                  style={{
                    backgroundColor: index < 3 ? theme.colors.ui + '80' : theme.colors.ui + '40',
                    borderColor: theme.colors.border + '60'
                  }}
                >
                  {/* Rank */}
                  <div className="font-mono font-bold text-xl w-8 text-center">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                  </div>

                  {/* Player Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-mono font-bold truncate" style={{ color: theme.colors.text }}>
                      {entry.playerName}
                    </div>
                    {!isMobile && (
                      <div className="font-mono text-xs opacity-70">
                        {formatDate(entry.createdAt)}
                      </div>
                    )}
                  </div>

                  {/* Theme */}
                  <div className="font-mono text-lg">
                    {getThemeIcon(entry.theme)}
                  </div>

                  {/* Score */}
                  <div className="font-mono font-bold text-right min-w-0">
                    <div className="text-lg" style={{ color: theme.colors.accent }}>
                      {entry.score.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t-2 text-center" style={{ borderColor: theme.colors.border }}>
          <div className="font-mono text-xs opacity-70">
            Play Snake and compete with players worldwide!
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;