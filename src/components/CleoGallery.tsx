import React, { useState, useEffect } from 'react';

// The gallery uses placeholder dachshund images
const CleoGallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [animate, setAnimate] = useState<boolean>(false);
  
  // Various artistic representations of "Cleo"
  const images = [
    {
      url: "https://images.unsplash.com/photo-1612195583950-b8fd34c87093?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      style: "Classic Portrait",
      description: "Cleo in her regal pose, surveying her domain."
    },
    {
      url: "https://images.unsplash.com/photo-1520087619250-584c0cbd35e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      style: "Action Shot",
      description: "The overlord in motion, swift and purposeful."
    },
    {
      url: "https://images.unsplash.com/photo-1514984879728-be0aff75a6e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      style: "Surrealist Dream",
      description: "Cleo transcending dimensions, as she often does in our dreams."
    },
    {
      url: "https://images.unsplash.com/photo-1561037404-61cd46aa615b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      style: "Pop Art",
      description: "The divine one, rendered in vibrant hues worthy of her spirit."
    },
    {
      url: "https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      style: "Contemplative Moment",
      description: "Cleo pondering the mysteries of the universe and treats."
    },
    {
      url: "https://images.unsplash.com/photo-1584130568415-009dde4cce4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      style: "Royal Portrait",
      description: "Her majesty in full regalia, accepting the homage of her subjects."
    },
    // Additional images
    {
      url: "https://images.unsplash.com/photo-1635774855317-edf3ee4463db?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      style: "Celestial Guardian",
      description: "Cleo as she appears in the astral plane, protecting our dreams."
    },
    {
      url: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      style: "Watercolor Wonder",
      description: "The fluidity of Cleo's form captured in delicate washes of pigment."
    },
    {
      url: "https://images.unsplash.com/photo-1548658146-f142deadf8f7?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      style: "Noir Detective",
      description: "Cleo in her mysterious phase, solving the Case of the Missing Treats."
    },
    {
      url: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      style: "Glitch Art",
      description: "Cleo's essence breaking through the digital realm, pixels cannot contain her."
    },
    {
      url: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      style: "Renaissance Masterpiece",
      description: "If Michelangelo had met Cleo, this would have been on the Sistine Chapel."
    },
    {
      url: "https://images.unsplash.com/photo-1600804340584-c7db2eacf0bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      style: "Cubist Interpretation",
      description: "Cleo from all angles simultaneously, as she exists in multiple dimensions."
    }
  ];
  
  // For animated styles - CSS animations applied via classes
  const animationStyles = [
    "floating-style",
    "glowing-style",
    "rainbow-style",
    "pixelated-style",
    "vintage-style",
    "psychedelic-style",
    "neon-style",
    "glitch-style",
    "bubble-style",
    "comic-style",
    "vaporwave-style",
    "film-grain-style"
  ];
  
  useEffect(() => {
    // Set animation to true after a small delay to trigger entrance animations
    const timer = setTimeout(() => {
      setAnimate(true);
    }, 300);
    
    return () => clearTimeout(timer);
  }, []);
  
  const openLightbox = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };
  
  const closeLightbox = () => {
    setSelectedImage(null);
  };
  
  return (
    <>
      <div className="gallery-container">
        {images.map((image, index) => (
          <div 
            key={index} 
            className={`gallery-item ${animationStyles[index % animationStyles.length]} ${animate ? 'animate' : ''}`}
            onClick={() => openLightbox(image.url)}
            style={{ 
              animationDelay: `${index * 0.1}s`,
              transform: `scale(0.95) rotate(${index % 2 === 0 ? 2 : -2}deg)`
            }}
          >
            <img src={image.url} alt={`Cleo in ${image.style}`} />
            <div className="overlay">
              <h4>{image.style}</h4>
              <p>{image.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      {selectedImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <span className="close-lightbox">&times;</span>
          <img src={selectedImage} className="lightbox-content" alt="Expanded view of Cleo" />
        </div>
      )}
    </>
  );
};

export default CleoGallery;