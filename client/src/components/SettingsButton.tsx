import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { useSnakeGame } from '../lib/stores/useSnakeGame';
import { useThemeStore } from '../lib/stores/useTheme';
import { useAdsStore } from '../lib/stores/useAds';

const SettingsButton: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { resetUserData } = useSnakeGame();
  const { setTheme } = useThemeStore();
  const { setTrackingPermission, requestTrackingPermission } = useAdsStore();

  const resetUser = () => {
    // Reset high score and game state
    resetUserData();
    
    // Reset theme to default
    setTheme('retro');
    localStorage.removeItem('selectedTheme');
    
    // Reset tracking permission to trigger new ATT request
    setTrackingPermission(null);
    localStorage.removeItem('trackingPermissionGranted');
    
    console.log('User data reset - high score, themes, and tracking preferences cleared');
    
    // Close menu
    setShowMenu(false);
    
    // Trigger new ATT permission request on next app interaction
    setTimeout(() => {
      requestTrackingPermission();
    }, 500);
  };

  return (
    <div className="absolute top-16 left-4 z-50">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors duration-200 border border-gray-600"
        aria-label="Settings"
      >
        <Settings className="w-5 h-5 text-white" />
      </button>
      
      {showMenu && (
        <div className="absolute top-12 left-0 bg-gray-900 border border-gray-600 rounded-lg shadow-lg min-w-48 z-50">
          <div className="p-2">
            <button
              onClick={resetUser}
              className="w-full text-left px-3 py-2 text-white hover:bg-gray-700 rounded transition-colors duration-200"
            >
              Reset User
            </button>
          </div>
        </div>
      )}
      
      {/* Click overlay to close menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
};

export default SettingsButton;