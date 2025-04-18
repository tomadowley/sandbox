import React from 'react';

interface HeaderProps {
  scrollPosition: number;
}

const Header: React.FC<HeaderProps> = ({ scrollPosition }) => {
  const parallaxOffset = scrollPosition * 0.5;
  const titleScale = Math.max(1 - scrollPosition * 0.001, 0.5);
  
  return (
    <header className="shrine-header">
      <div 
        className="header-background"
        style={{ transform: `translateY(${parallaxOffset}px)` }}
      ></div>
      
      <h1 
        className="shrine-title"
        style={{ 
          transform: `scale(${titleScale})`,
          opacity: Math.max(1 - scrollPosition * 0.002, 0.2)
        }}
      >
        Cleo
      </h1>
      
      <p 
        className="shrine-subtitle"
        style={{ opacity: Math.max(1 - scrollPosition * 0.003, 0) }}
      >
        The Divine Dachshund, Protector of Homes, Ruler of Hearts
      </p>
      
      <div className="shrine-halo" style={{ opacity: Math.max(1 - scrollPosition * 0.003, 0) }}>
        ✨
      </div>
      
      <div className="scroll-indicator">↓</div>
    </header>
  );
};

export default Header;