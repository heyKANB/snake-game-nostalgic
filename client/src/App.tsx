import { useState } from "react";

function App() {
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'gameOver'>('menu');

  return (
    <div className="w-full h-full bg-black flex items-center justify-center text-green-400 font-mono">
      <div className="text-center">
        <h1 className="text-4xl mb-8">Snake Game</h1>
        <div className="text-xl mb-4">State: {gameState}</div>
        <button 
          className="bg-green-600 hover:bg-green-700 text-black px-6 py-3 rounded font-bold"
          onClick={() => {
            setGameState(gameState === 'menu' ? 'playing' : 'menu');
          }}
        >
          {gameState === 'menu' ? 'Start Game' : 'Back to Menu'}
        </button>
      </div>
    </div>
  );
}

export default App;
