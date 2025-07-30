import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

interface AdsState {
  isAdLoaded: boolean;
  showInterstitial: boolean;
  adsEnabled: boolean;
  adSenseAppId: string;
  setAdLoaded: (loaded: boolean) => void;
  setShowInterstitial: (show: boolean) => void;
  setAdsEnabled: (enabled: boolean) => void;
  setAdSenseAppId: (appId: string) => void;
  showInterstitialAd: () => void;
  loadBannerAd: () => void;
}

export const useAdsStore = create<AdsState>()(
  subscribeWithSelector((set, get) => ({
  isAdLoaded: false,
  showInterstitial: false,
  adsEnabled: true,
  adSenseAppId: '',

  setAdLoaded: (loaded) => set({ isAdLoaded: loaded }),
  setShowInterstitial: (show) => set({ showInterstitial: show }),
  setAdsEnabled: (enabled) => set({ adsEnabled: enabled }),
  setAdSenseAppId: (appId) => set({ adSenseAppId: appId }),

  showInterstitialAd: () => {
    const { adsEnabled } = get();
    if (!adsEnabled) return;

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

    // Initialize banner ads
    if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        set({ isAdLoaded: true });
      } catch (error) {
        console.log('Banner ad load error:', error);
      }
    }
  },
})));