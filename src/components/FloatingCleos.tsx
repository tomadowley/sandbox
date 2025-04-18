import React, { useEffect, useState } from 'react';

const FloatingCleos: React.FC = () => {
  const [floatingDogs, setFloatingDogs] = useState<Array<{id: number, style: React.CSSProperties}>>([]);
  
  useEffect(() => {
    // Create 10 randomly positioned floating dachshunds
    const dogs = [];
    for (let i = 0; i < 10; i++) {
      dogs.push({
        id: i,
        style: {
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDuration: `${15 + Math.random() * 20}s`,
          animationDelay: `${Math.random() * 5}s`,
          transform: `rotate(${Math.random() * 360}deg) scale(${0.5 + Math.random() * 0.5})`,
        }
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
  ];
  
  return (
    <div className="floating-cleos-container">
      {floatingDogs.map(dog => (
        <div
          key={dog.id}
          className="floating-dachshund"
          style={dog.style}
        >
          {dachshundVariations[dog.id % dachshundVariations.length]}
        </div>
      ))}
    </div>
  );
};

export default FloatingCleos;