import React, { useState, useEffect } from 'react';
import './App.css';

// Components imports
import Header from './components/Header';
import LovePoem from './components/LovePoem';
import CleoGallery from './components/CleoGallery';
import Cleo3DGallery from './components/Cleo3DGallery';
import Prayer from './components/Prayer';
import FloatingCleos from './components/FloatingCleos';
import AnimationShowcase from './components/AnimationShowcase';

function App() {
  const [scrollPosition, setScrollPosition] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const position = window.pageYOffset;
      setScrollPosition(position);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="App">
      <FloatingCleos />
      
      <div className="parallax-wrapper">
        <Header scrollPosition={scrollPosition} />
        
        <section className="shrine-section introduction">
          <div className="container">
            <h2>Welcome to the Sacred Shrine of Cleo</h2>
            <p className="intro-text">
              Here we honor Cleo, the divine dachshund, protector of the household,
              guardian of our hearts, and the most magnificent elongated canine to ever grace this earth.
              As you scroll through this sacred digital space, please observe proper reverence for our overlord.
            </p>
            <div className="paw-divider">
              <span>• ᴥ •</span>
            </div>
          </div>
        </section>
        
        <section className="shrine-section animation-section">
          <div className="container">
            <h2>Divine Manifestations of Cleo</h2>
            <p>Behold as our overlord takes multiple forms across the artistic spectrum</p>
            <AnimationShowcase />
          </div>
        </section>
        
        <section className="shrine-section poems-section">
          <div className="container">
            <h2>Love Poems to Our Elongated Sovereign</h2>
            <div className="poems-container">
              <LovePoem 
                title="Ode to the Long One" 
                content={`Little legs that scamper quick,
                Body long like magic trick.
                Eyes that see into my soul,
                Cleo makes my heart feel whole.`}
              />
              
              <LovePoem 
                title="Divine Dachshund" 
                content={`Low to ground but high in grace,
                Whiskers framing perfect face.
                Bark of wisdom, tail of glee,
                Cleo, perfect deity.`}
              />
              
              <LovePoem 
                title="Surreal Symphony of Sausage" 
                content={`In dreams you stretch beyond all space,
                Your paws touch stars with gentle grace.
                Time bends around your wagging tail,
                Before your majesty, all worlds pale.`}
              />
            </div>
          </div>
        </section>
        
        <section className="shrine-section gallery-section">
          <div className="container">
            <h2>Visions of Our Overlord</h2>
            <p>Bask in the multi-dimensional glory of Cleo manifested in various artistic planes of existence.</p>
            <CleoGallery />
          </div>
        </section>
        
        <section className="shrine-section gallery-3d-section">
          <div className="container">
            <h2>Cleo in Digital Space</h2>
            <p>Experience Cleo in the third dimension and beyond</p>
            <Cleo3DGallery />
          </div>
        </section>
        
        <section className="shrine-section prayers-section">
          <div className="container">
            <h2>Daily Devotions to Cleo</h2>
            <p>Recite these prayers thrice daily while facing in the direction of Cleo's favorite napping spot.</p>
            
            <div className="prayers-container">
              <Prayer 
                title="Morning Awakening Prayer"
                content="O Great Cleo, who rises with the sun (or several hours after it, depending on thy mood), grant us the wisdom to know when to feed you and when to let you slumber. May your paws carry you swiftly to your food bowl, and may you bless us with a gentle boop of thy snoot."
              />
              
              <Prayer 
                title="Midday Supplication"
                content="Divine Dachshund, stretcher of leashes and finder of sunny spots, protect us from the mailman and all who dare approach thy territory. We offer thee belly rubs and treats in exchange for thy continued guardianship."
              />
              
              <Prayer 
                title="Evening Worship"
                content="As the day comes to a close, we thank thee, O Elongated One, for your benevolent presence in our lives. May your dreams be filled with slow rabbits and endless fields to explore. We are but humble servants to your magnificence. Bless us with cuddles, we pray."
              />
              
              <Prayer 
                title="The Emergency Invocation"
                content="In times of great distress, when thunder rolls or vacuum cleaners roar, we call upon the courage of Cleo. Grant us but a fraction of thy bravery, O Wiener Wonder, that we might face our fears with the same ferocity with which you attack thy squeaky toys."
                special={true}
              />
            </div>
          </div>
        </section>
        
        <footer className="shrine-footer">
          <div className="container">
            <p>This shrine was erected in eternal devotion to Cleo, the dachshund overlord.</p>
            <p>May her reign be long and her naps peaceful.</p>
            <div className="paw-print">🐾</div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;