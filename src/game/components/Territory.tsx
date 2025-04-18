import React from 'react';
import { TerritoryData } from '../types';

interface TerritoryProps {
  territory: TerritoryData;
  isSelected: boolean;
  isTargeted: boolean;
  onClick: () => void;
  playerColor: string;
}

const Territory: React.FC<TerritoryProps> = ({ 
  territory, 
  isSelected, 
  isTargeted, 
  onClick, 
  playerColor 
}) => {
  const borderColor = isSelected 
    ? 'white' 
    : isTargeted 
      ? 'red' 
      : 'rgba(255, 255, 255, 0.3)';
  
  const backgroundColor = territory.ownerId !== null 
    ? `${playerColor}40` // 40 is hex for 25% opacity 
    : 'rgba(255, 255, 255, 0.1)';

  return (
    <div 
      className="territory" 
      style={{
        left: territory.x,
        top: territory.y,
        width: territory.width,
        height: territory.height,
        backgroundColor,
        borderColor,
        borderWidth: isSelected || isTargeted ? '2px' : '1px',
        zIndex: 1,
      }}
      onClick={onClick}
    >
      <div style={{ 
        padding: '5px', 
        color: 'white',
        textShadow: '1px 1px 2px black',
        fontSize: '12px',
        fontWeight: 'bold'
      }}>
        {territory.name}
      </div>
    </div>
  );
};

export default Territory;