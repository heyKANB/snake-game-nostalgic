import React, { useEffect } from "react";
import Game from "./components/Game";
import { useAudio } from "./lib/stores/useAudio";
import { useAdsStore } from "./lib/stores/useAds";
import { useExtraLives } from "./lib/stores/useExtraLives";
import { InterstitialAd } from "./components/AdComponents";
import { AppTracking } from "./lib/appTracking";
import "@fontsource/inter";

function App() {
  const { setHitSound, setSuccessSound } = useAudio();
  const { setAdSenseAppId, requestTrackingPermission } = useAdsStore();
  const { initializeStore } = useExtraLives();

  // Initialize app - ATT permission will be requested automatically by native iOS
  useEffect(() => {
    const initApp = async () => {
      try {
        // Load audio first (no tracking involved)
        const hitAudio = new Audio('/sounds/hit.mp3');
        hitAudio.volume = 0.3;
        setHitSound(hitAudio);

        const successAudio = new Audio('/sounds/success.mp3');
        successAudio.volume = 0.5;
        setSuccessSound(successAudio);
        
        // CRITICAL: Wait for ATT permission to be determined before any ad initialization
        console.log("Waiting for App Tracking Transparency permission...");
        await requestTrackingPermission();
        
        // Only initialize AdSense AFTER ATT permission is determined
        console.log("ATT permission determined, initializing AdSense...");
        setAdSenseAppId('ca-app-pub-8626828126160251~4239118513');
        
        // Initialize extra lives store
        console.log("Initializing extra lives store...");
        await initializeStore();
      } catch (error) {
        console.log("App initialization failed:", error);
      }
    };

    initApp();
  }, [setHitSound, setSuccessSound, setAdSenseAppId, requestTrackingPermission, initializeStore]);

  return (
    <div className="w-full min-h-screen bg-black">
      <Game />
      <InterstitialAd />
    </div>
  );
}

export default App;
