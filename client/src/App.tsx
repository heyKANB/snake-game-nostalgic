import { useEffect } from "react";
import Game from "./components/Game";
import { useAudio } from "./lib/stores/useAudio";
import "@fontsource/inter";

function App() {
  const { setHitSound, setSuccessSound } = useAudio();

  // Initialize audio on app start
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

    initAudio();
  }, [setHitSound, setSuccessSound]);

  return (
    <div className="w-full h-full bg-black flex items-center justify-center">
      <Game />
    </div>
  );
}

export default App;
