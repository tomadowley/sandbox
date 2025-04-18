import React from 'react';

interface InstructionsProps {
  onClose: () => void;
}

const Instructions: React.FC<InstructionsProps> = ({ onClose }) => {
  return (
    <div className="instructions-modal">
      <div className="instructions-content">
        <h2>How to Play Risk Platformer</h2>
        
        <h3>Game Objective</h3>
        <p>Conquer all territories on the map to win the game.</p>
        
        <h3>Game Flow</h3>
        <p>Each player takes turns going through three phases:</p>
        
        <div className="phase-instructions">
          <h4>1. Movement Phase</h4>
          <ul>
            <li>Use <strong>WASD</strong> or <strong>Arrow Keys</strong> to move your character</li>
            <li>Jump with <strong>W</strong>, <strong>Up Arrow</strong>, or <strong>Space</strong></li>
            <li>You can capture territories by jumping on them (30% chance on contact)</li>
            <li>Click <strong>"End Movement"</strong> when you're done moving</li>
          </ul>
          
          <h4>2. Attack Phase</h4>
          <ul>
            <li>First, click one of your territories (colored territories)</li>
            <li>Then, click an adjacent enemy territory to attack</li>
            <li>Click the <strong>"Attack"</strong> button to execute the attack</li>
            <li>You have a 60% chance of successful conquest</li>
            <li>Click <strong>"Skip Attack"</strong> if you don't want to attack</li>
          </ul>
          
          <h4>3. Fortify Phase</h4>
          <ul>
            <li>Click <strong>"End Turn"</strong> to complete your turn</li>
            <li>The next player will then begin their turn</li>
          </ul>
        </div>
        
        <h3>Winning the Game</h3>
        <p>The first player to control all territories on the map wins!</p>
        
        <button className="button close-button" onClick={onClose}>
          Start Playing
        </button>
      </div>
    </div>
  );
};

export default Instructions;