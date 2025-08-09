import React, { useEffect } from "react";
import Game from "./components/Game";
import { useAudio } from "./lib/stores/useAudio";
import { useAdsStore } from "./lib/stores/useAds";
import { InterstitialAd } from "./components/AdComponents";
import { AppTracking } from "./lib/appTracking";
import "@fontsource/inter";

function App() {
  const { setHitSound, setSuccessSound } = useAudio();
  const { setAdSenseAppId, requestTrackingPermission } = useAdsStore();

  // Initialize audio and request tracking permission on app start
  useEffect(() => {
    const initApp = async () => {
      try {
        // CRITICAL: Request App Tracking Transparency permission FIRST
        // This must happen before any ads or tracking code is initialized
        console.log("Requesting App Tracking Transparency permission...");
        await requestTrackingPermission();
        
        // Load hit sound
        const hitAudio = new Audio('/sounds/hit.mp3');
        hitAudio.volume = 0.3;
        setHitSound(hitAudio);

        // Load success sound
        const successAudio = new Audio('/sounds/success.mp3');
        successAudio.volume = 0.5;
        setSuccessSound(successAudio);
        
        // Initialize AdSense with your App ID (after ATT permission)
        setAdSenseAppId('ca-app-pub-8626828126160251~4239118513');
      } catch (error) {
        console.log("App initialization failed:", error);
      }
    };

    initApp();
  }, [setHitSound, setSuccessSound, setAdSenseAppId, requestTrackingPermission]);

  return (
    <div className="w-full min-h-screen bg-black">
      <Game />
      <InterstitialAd />
    </div>
  );
}

export default App;
