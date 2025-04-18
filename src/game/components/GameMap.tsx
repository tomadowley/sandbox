import React from 'react';

interface GameMapProps {
  children: React.ReactNode;
}

const GameMap: React.FC<GameMapProps> = ({ children }) => {
  return (
    <div className="game-map">
      {/* Background platforms */}
      <div className="platform" style={{ left: 100, top: 400, width: 300, height: 20 }}></div>
      <div className="platform" style={{ left: 500, top: 500, width: 300, height: 20 }}></div>
      <div className="platform" style={{ left: 200, top: 600, width: 400, height: 20 }}></div>
      <div className="platform" style={{ left: 700, top: 650, width: 200, height: 20 }}></div>
      <div className="platform" style={{ left: 0, top: 700, width: 1024, height: 20 }}></div>
      
      {/* Game floor */}
      <div className="platform" style={{ left: 0, top: 748, width: 1024, height: 20 }}></div>
      
      {children}
    </div>
  );
};

export default GameMap;