import React from 'react';

// Simple test component without Zustand
const SimpleApp: React.FC = () => {
  return (
    <div className="w-full h-full bg-black text-green-500 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl mb-4">🐍 Snake Game</h1>
        <p className="text-xl">Loading test...</p>
      </div>
    </div>
  );
};

export default SimpleApp;