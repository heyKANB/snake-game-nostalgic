import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

function App() {
  return (
    <div className="w-full h-full bg-black flex items-center justify-center text-green-400 font-mono">
      <div className="text-center">
        <h1 className="text-4xl mb-8">Snake Game</h1>
        <div className="text-xl mb-4">Loading...</div>
        <button className="bg-green-600 hover:bg-green-700 text-black px-6 py-3 rounded font-bold">
          Test Button
        </button>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);
