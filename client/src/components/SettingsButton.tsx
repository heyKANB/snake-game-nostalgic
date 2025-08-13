import React, { useState, useEffect } from 'react';
import { Settings, ExternalLink } from 'lucide-react';
import { useSnakeGame } from '../lib/stores/useSnakeGame';
import { useThemeStore } from '../lib/stores/useTheme';
import { useAdsStore } from '../lib/stores/useAds';

const SettingsButton: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [attStatus, setAttStatus] = useState<string>('unknown');
  const { resetUserData } = useSnakeGame();
  const { setTheme } = useThemeStore();
  const { setTrackingPermission, requestTrackingPermission } = useAdsStore();

  // Check ATT status when component mounts or menu opens
  useEffect(() => {
    if (showMenu) {
      checkATTStatus();
    }
  }, [showMenu]);

  const checkATTStatus = async () => {
    try {
      if ((window as any).AppTrackingTransparency) {
        const status = await (window as any).AppTrackingTransparency.getTrackingAuthorizationStatus();
        setAttStatus(status);
      } else {
        // Web browser - check localStorage
        const permission = localStorage.getItem('trackingPermissionGranted');
        if (permission === 'true') {
          setAttStatus('authorized');
        } else if (permission === 'false') {
          setAttStatus('denied');
        } else {
          setAttStatus('not_determined');
        }
      }
    } catch (error) {
      console.log('Could not check ATT status:', error);
      setAttStatus('unknown');
    }
  };

  const getATTStatusText = () => {
    switch (attStatus) {
      case 'authorized':
        return 'Tracking: Allowed';
      case 'denied':
        return 'Tracking: Denied';
      case 'not_determined':
        return 'Tracking: Not Set';
      case 'restricted':
        return 'Tracking: Restricted';
      default:
        return 'Tracking: Unknown';
    }
  };

  const openTrackingSettings = () => {
    if ((window as any).AppTrackingTransparency && (window as any).AppTrackingTransparency.openPrivacySettings) {
      // Native iOS app - open to tracking settings
      (window as any).AppTrackingTransparency.openPrivacySettings();
    } else {
      // Web browser - show instructions
      alert('To change tracking preferences:\n\n1. Open iOS Settings\n2. Go to Privacy & Security\n3. Tap Tracking\n4. Find "Snake Game" and toggle permission');
    }
    setShowMenu(false);
  };

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
        <div className="absolute top-12 left-0 bg-gray-900 border border-gray-600 rounded-lg shadow-lg min-w-56 z-50">
          <div className="p-2 space-y-1">
            {/* ATT Status and Settings */}
            <div className="px-3 py-2 text-gray-300 text-sm border-b border-gray-700">
              <div className="font-medium mb-2">Privacy Settings</div>
              <div className="text-xs text-gray-400 mb-2">{getATTStatusText()}</div>
              <button
                onClick={openTrackingSettings}
                className="flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                <ExternalLink className="w-3 h-3" />
                Change in Settings
              </button>
            </div>
            
            {/* Reset User */}
            <button
              onClick={resetUser}
              className="w-full text-left px-3 py-2 text-white hover:bg-gray-700 rounded transition-colors duration-200"
            >
              Reset User Data
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