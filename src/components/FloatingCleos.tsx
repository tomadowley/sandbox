import React, { useEffect, useState } from 'react';

const FloatingCleos: React.FC = () => {
  const [floatingDogs, setFloatingDogs] = useState<Array<{id: number, style: React.CSSProperties, type: string}>>([]);
  
  useEffect(() => {
    // Create more randomly positioned floating dachshunds
    const dogs = [];
    for (let i = 0; i < 20; i++) {
      dogs.push({
        id: i,
        style: {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDuration: `${15 + Math.random() * 20}s`,
          animationDelay: `${Math.random() * 5}s`,
          transform: `rotate(${Math.random() * 360}deg) scale(${0.5 + Math.random() * 0.5})`,
        },
        type: i % 10 === 0 ? 'animated' : 'emoji'
      });
    }
    setFloatingDogs(dogs);
  }, []);
  
  // Different dachshund emojis and ASCII art for variety
  const dachshundVariations = [
    '🌭',
    '🐕',
    '🐾',
    '🦴',
    '♥️',
    '✨',
    '🐶',
    '🏆',
    '👑',
    '💫'
  ];
  
  // Simple CSS-based dachshund animations
  const animatedDachshund = (key: number) => {
    return (
      <div className="animated-floating-dog" key={key}>
        <div className="dog-body"></div>
        <div className="dog-head"></div>
        <div className="dog-tail"></div>
        <div className="dog-legs">
          <div className="leg"></div>
          <div className="leg"></div>
          <div className="leg"></div>
          <div className="leg"></div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="floating-cleos-container">
      {floatingDogs.map(dog => (
        <div
          key={dog.id}
          className="floating-dachshund"
          style={dog.style}
        >
          {dog.type === 'emoji' 
            ? dachshundVariations[dog.id % dachshundVariations.length]
            : animatedDachshund(dog.id)}
        </div>
      ))}
    </div>
  );
};

export default FloatingCleos;