import { create } from 'zustand';
import { AppTracking } from '../appTracking';

interface AdsState {
  isAdLoaded: boolean;
  showInterstitial: boolean;
  adsEnabled: boolean;
  adSenseAppId: string;
  gameOverCount: number;
  trackingPermissionGranted: boolean;
  setAdLoaded: (loaded: boolean) => void;
  setShowInterstitial: (show: boolean) => void;
  setAdsEnabled: (enabled: boolean) => void;
  setAdSenseAppId: (appId: string) => void;
  setTrackingPermission: (granted: boolean) => void;
  requestTrackingPermission: () => Promise<boolean>;
  showInterstitialAd: () => void;
  loadBannerAd: () => void;
  incrementGameOverCount: () => void;
}

export const useAdsStore = create<AdsState>((set, get) => ({
  isAdLoaded: false,
  showInterstitial: false,
  adsEnabled: true,
  adSenseAppId: '',
  gameOverCount: 0,
  trackingPermissionGranted: false,

  setAdLoaded: (loaded) => set({ isAdLoaded: loaded }),
  setShowInterstitial: (show) => set({ showInterstitial: show }),
  setAdsEnabled: (enabled) => set({ adsEnabled: enabled }),
  setAdSenseAppId: (appId) => set({ adSenseAppId: appId }),
  setTrackingPermission: (granted) => set({ trackingPermissionGranted: granted }),

  requestTrackingPermission: async () => {
    try {
      const granted = await AppTracking.checkAndRequestPermission();
      set({ trackingPermissionGranted: granted });
      return granted;
    } catch (error) {
      console.log('Tracking permission error:', error);
      set({ trackingPermissionGranted: false });
      return false;
    }
  },

  incrementGameOverCount: () => set((state) => ({ gameOverCount: state.gameOverCount + 1 })),

  showInterstitialAd: async () => {
    const { adsEnabled, gameOverCount, trackingPermissionGranted, requestTrackingPermission } = get();
    if (!adsEnabled) return;

    // Request tracking permission if not already granted
    if (!trackingPermissionGranted) {
      const granted = await requestTrackingPermission();
      if (!granted) {
        console.log('Tracking permission denied, not showing personalized ads');
        return;
      }
    }

    // Only show ads on every other game over (even counts: 2, 4, 6, etc)
    if (gameOverCount % 2 !== 0) return;

    // Show interstitial ad on game over
    if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
      try {
        set({ showInterstitial: true });
        // Hide after 3 seconds
        setTimeout(() => {
          set({ showInterstitial: false });
        }, 3000);
      } catch (error) {
        console.log('Ad display error:', error);
      }
    }
  },

  loadBannerAd: async () => {
    const { adsEnabled, trackingPermissionGranted, requestTrackingPermission } = get();
    if (!adsEnabled) return;

    // Request tracking permission if not already granted
    if (!trackingPermissionGranted) {
      const granted = await requestTrackingPermission();
      if (!granted) {
        console.log('Tracking permission denied, not showing personalized ads');
        return;
      }
    }

    // Initialize banner ads with better error handling
    if (typeof window !== 'undefined') {
      try {
        // Check if AdSense script is available
        if ((window as any).adsbygoogle) {
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
          set({ isAdLoaded: true });
        } else {
          console.log('AdSense not loaded yet, will try again');
          // Retry after a delay if AdSense script isn't ready
          setTimeout(() => {
            if ((window as any).adsbygoogle) {
              ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
              set({ isAdLoaded: true });
            }
          }, 1000);
        }
      } catch (error) {
        console.log('Banner ad load error:', error);
        // Disable ads if there are persistent errors
        set({ adsEnabled: false });
      }
    }
  },
}));