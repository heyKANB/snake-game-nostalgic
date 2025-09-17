import { create } from 'zustand';
import { AppTracking } from '../appTracking';

interface AdsState {
  isAdLoaded: boolean;
  showInterstitial: boolean;
  adsEnabled: boolean;
  adSenseAppId: string;
  gameOverCount: number;
  trackingPermissionGranted: boolean | null; // null = not asked yet, true/false = permission result
  setAdLoaded: (loaded: boolean) => void;
  setShowInterstitial: (show: boolean) => void;
  setAdsEnabled: (enabled: boolean) => void;
  setAdSenseAppId: (appId: string) => void;
  setTrackingPermission: (granted: boolean | null) => void;
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
  trackingPermissionGranted: null, // null = not asked yet

  setAdLoaded: (loaded) => set({ isAdLoaded: loaded }),
  setShowInterstitial: (show) => set({ showInterstitial: show }),
  setAdsEnabled: (enabled) => set({ adsEnabled: enabled }),
  setAdSenseAppId: (appId) => set({ adSenseAppId: appId }),
  setTrackingPermission: (granted) => set({ trackingPermissionGranted: granted }),

  requestTrackingPermission: async () => {
    try {
      console.log('🚀 Requesting App Tracking Transparency permission...');
      const granted = await AppTracking.checkAndRequestPermission();
      console.log('🚀 ATT final result:', granted ? 'GRANTED' : 'DENIED');
      set({ trackingPermissionGranted: granted });
      return granted;
    } catch (error) {
      console.log('❌ Tracking permission error:', error);
      set({ trackingPermissionGranted: false });
      return false;
    }
  },

  incrementGameOverCount: () => set((state) => ({ gameOverCount: state.gameOverCount + 1 })),

  showInterstitialAd: async () => {
    const { adsEnabled, gameOverCount, trackingPermissionGranted } = get();
    if (!adsEnabled) return;

    // Check if tracking permission has been handled - wait for permission dialog to complete
    if (trackingPermissionGranted === null) {
      console.log('ATT permission not yet requested, skipping ads until permission is determined');
      return;
    }

    // Show ads regardless of tracking permission status
    // If tracking denied, ads will be non-personalized; if granted, ads may be personalized
    const adType = trackingPermissionGranted ? 'personalized' : 'non-personalized';
    console.log(`Showing ${adType} interstitial ad (tracking permission: ${trackingPermissionGranted ? 'granted' : 'denied'})`);

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
    const { adsEnabled, trackingPermissionGranted } = get();
    if (!adsEnabled) return;

    // Check if tracking permission has been handled - wait for permission dialog to complete
    if (trackingPermissionGranted === null) {
      console.log('ATT permission not yet requested, skipping banner ads until permission is determined');
      return;
    }

    // Load ads regardless of tracking permission status
    // If tracking denied, ads will be non-personalized; if granted, ads may be personalized  
    const adType = trackingPermissionGranted ? 'personalized' : 'non-personalized';
    console.log(`Loading ${adType} banner ad (tracking permission: ${trackingPermissionGranted ? 'granted' : 'denied'})`);

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