import { create } from 'zustand';

interface AdsState {
  isAdLoaded: boolean;
  showInterstitial: boolean;
  adsEnabled: boolean;
  adSenseAppId: string;
  gameOverCount: number;
  setAdLoaded: (loaded: boolean) => void;
  setShowInterstitial: (show: boolean) => void;
  setAdsEnabled: (enabled: boolean) => void;
  setAdSenseAppId: (appId: string) => void;
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

  setAdLoaded: (loaded) => set({ isAdLoaded: loaded }),
  setShowInterstitial: (show) => set({ showInterstitial: show }),
  setAdsEnabled: (enabled) => set({ adsEnabled: enabled }),
  setAdSenseAppId: (appId) => set({ adSenseAppId: appId }),

  incrementGameOverCount: () => set((state) => ({ gameOverCount: state.gameOverCount + 1 })),

  showInterstitialAd: () => {
    const { adsEnabled, gameOverCount } = get();
    if (!adsEnabled) return;

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

  loadBannerAd: () => {
    const { adsEnabled } = get();
    if (!adsEnabled) return;

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