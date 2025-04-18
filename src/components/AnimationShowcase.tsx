import React from 'react';
import AnimatedDachshund from './AnimatedDachshund';

const AnimationShowcase: React.FC = () => {
  const animations = [
    { style: 'default', title: 'Classic Cleo', description: 'The true essence of our overlord.' },
    { style: 'neon', title: 'Neon Cleo', description: 'As she appears in the cybernetic realm.' },
    { style: 'pixel', title: 'Pixel Cleo', title2: '8-bit Deity', description: 'The retro manifestation of divine dachshund energy.' },
    { style: 'watercolor', title: 'Watercolor Cleo', description: 'The fluidity of her form cannot be contained by mere lines.' },
    { style: 'cartoon', title: 'Cartoon Cleo', description: 'Her Saturday morning manifestation.' }
  ];
  
  return (
    <div className="animation-showcase">
      <div className="animation-grid">
        {animations.map((animation, index) => (
          <div key={index} className="animation-card">
            <div className="animation-container">
              <AnimatedDachshund style={animation.style} size={250} />
            </div>
            <div className="animation-info">
              <h3>{animation.title}</h3>
              {animation.title2 && <h4>{animation.title2}</h4>}
              <p>{animation.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="animation-special">
        <div className="parallax-dachshund">
          <AnimatedDachshund size={400} />
          <div className="parallax-overlay">
            <h2>The Transcendent Form</h2>
            <p>Witness Cleo as she moves between dimensions, existing in all realities simultaneously.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimationShowcase;