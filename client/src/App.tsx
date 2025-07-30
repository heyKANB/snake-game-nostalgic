import React, { useEffect } from "react";
import Game from "./components/Game";
import { useAudio } from "./lib/stores/useAudio";
import { useAdsStore } from "./lib/stores/useAds";
import { InterstitialAd } from "./components/AdComponents";
import "@fontsource/inter";

function App() {
  const { setHitSound, setSuccessSound } = useAudio();
  const { setAdSenseAppId } = useAdsStore();

  // Initialize audio and ads on app start
  useEffect(() => {
    const initAudio = async () => {
      try {
        // Load hit sound
        const hitAudio = new Audio('/sounds/hit.mp3');
        hitAudio.volume = 0.3;
        setHitSound(hitAudio);

        // Load success sound
        const successAudio = new Audio('/sounds/success.mp3');
        successAudio.volume = 0.5;
        setSuccessSound(successAudio);
      } catch (error) {
        console.log("Audio loading failed:", error);
      }
    };

    // Initialize AdSense with your App ID
    setAdSenseAppId('ca-app-pub-8626828126160251~4239118513');

    initAudio();
  }, [setHitSound, setSuccessSound, setAdSenseAppId]);

  return (
    <div className="w-full h-full bg-black flex items-center justify-center">
      <Game />
      <InterstitialAd />
    </div>
  );
}

export default App;
