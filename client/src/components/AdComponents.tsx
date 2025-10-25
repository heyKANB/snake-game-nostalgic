import React, { useEffect, useRef } from 'react';
import { useAdsStore } from '../lib/stores/useAds';

// Banner Ad Component for bottom of game screen
export const BannerAd: React.FC = () => {
  const { adsEnabled, trackingPermissionGranted } = useAdsStore();
  const adLoadedRef = useRef(false);

  useEffect(() => {
    // Load ads when tracking permission has been determined and ads are enabled
    // Only load once per component lifecycle
    if (adsEnabled && trackingPermissionGranted !== null && !adLoadedRef.current) {
      // Small delay to ensure DOM element is ready
      const timer = setTimeout(() => {
        try {
          const adElement = document.querySelector('.adsbygoogle.banner-ad');
          // Check if ad hasn't already been loaded (AdSense adds data-adsbygoogle-status when processed)
          if (adElement && !adElement.getAttribute('data-adsbygoogle-status')) {
            // Set non-personalized ads if tracking denied
            (window as any).adsbygoogle = (window as any).adsbygoogle || [];
            (window as any).adsbygoogle.requestNonPersonalizedAds = trackingPermissionGranted ? 0 : 1;
            
            // Push ad request
            ((window as any).adsbygoogle).push({});
            adLoadedRef.current = true;
            console.log('Banner ad requested');
          } else {
            console.log('Banner ad already loaded or element not found');
          }
        } catch (error) {
          console.log('Banner ad error:', error);
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [adsEnabled, trackingPermissionGranted]);

  if (!adsEnabled) return null;

  return (
    <div className="w-full flex justify-center py-2 bg-black/50">
      <ins
        className="adsbygoogle banner-ad"
        style={{ display: 'block', width: '320px', height: '50px' }}
        data-ad-client="ca-app-pub-8626828126160251"
        data-ad-slot="5048803159"
        data-ad-format="banner"
        data-full-width-responsive="true"
      />
    </div>
  );
};

// Interstitial Ad Component (shows on game over)
export const InterstitialAd: React.FC = () => {
  const { showInterstitial, setShowInterstitial, adsEnabled, trackingPermissionGranted } = useAdsStore();
  const adLoadedRef = useRef(false);

  // Reset loaded flag when interstitial is hidden
  useEffect(() => {
    if (!showInterstitial) {
      adLoadedRef.current = false;
    }
  }, [showInterstitial]);

  // Load ad content when interstitial is shown - after DOM is ready
  useEffect(() => {
    if (showInterstitial && adsEnabled && trackingPermissionGranted !== null && !adLoadedRef.current) {
      // Small delay to ensure DOM element is ready
      const timer = setTimeout(() => {
        try {
          const adElement = document.querySelector('.adsbygoogle.interstitial-ad');
          // Check if ad hasn't already been loaded
          if (adElement && !adElement.getAttribute('data-adsbygoogle-status')) {
            // Set non-personalized ads if tracking denied
            (window as any).adsbygoogle = (window as any).adsbygoogle || [];
            (window as any).adsbygoogle.requestNonPersonalizedAds = trackingPermissionGranted ? 0 : 1;
            
            // Push ad request
            ((window as any).adsbygoogle).push({});
            adLoadedRef.current = true;
            console.log('Interstitial ad requested');
          } else {
            console.log('Interstitial ad already loaded or element not found');
          }
        } catch (error) {
          console.log('Interstitial ad error:', error);
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [showInterstitial, adsEnabled, trackingPermissionGranted]);

  if (!adsEnabled || !showInterstitial) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-green-500 rounded-lg p-6 max-w-sm mx-4 text-center">
        <div className="text-green-400 mb-4">Advertisement</div>
        <div className="mb-4">
          <ins
            className="adsbygoogle interstitial-ad"
            style={{ display: 'block', width: '300px', height: '250px' }}
            data-ad-client="ca-app-pub-8626828126160251"
            data-ad-slot="6485506895"
            data-ad-format="rectangle"
          />
        </div>
        <button
          onClick={() => setShowInterstitial(false)}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
        >
          Continue Game
        </button>
      </div>
    </div>
  );
};

// Ad Settings Component for menu
export const AdSettings: React.FC = () => {
  const { adsEnabled, setAdsEnabled } = useAdsStore();

  return (
    <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
      <span className="text-green-400">Show Ads</span>
      <button
        onClick={() => setAdsEnabled(!adsEnabled)}
        className={`w-12 h-6 rounded-full transition-colors ${
          adsEnabled ? 'bg-green-600' : 'bg-gray-600'
        }`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full transition-transform ${
            adsEnabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );
};