import React from 'react';
import { PlayerData } from '../types';

interface PlayerProps {
  player: PlayerData;
  isCurrentPlayer: boolean;
}

const Player: React.FC<PlayerProps> = ({ player, isCurrentPlayer }) => {
  return (
    <div 
      className="player" 
      style={{
        left: player.position.x,
        top: player.position.y,
        backgroundColor: player.color,
        border: isCurrentPlayer ? '2px solid white' : 'none',
        boxShadow: isCurrentPlayer ? '0 0 10px white' : 'none',
        zIndex: isCurrentPlayer ? 10 : 5,
      }}
    >
      <div style={{ 
        fontSize: '10px', 
        textAlign: 'center', 
        marginTop: '-20px', 
        color: 'white',
        textShadow: '1px 1px 1px black',
        fontWeight: 'bold'
      }}>
        {player.name}
      </div>
    </div>
  );
};

export default Player;