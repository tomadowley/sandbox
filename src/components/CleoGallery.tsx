import React, { useState } from 'react';

// The gallery uses placeholder dachshund images
const CleoGallery: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
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
    }
  ];
  
  // For animated styles - CSS animations applied via classes
  const animationStyles = [
    "floating-style",
    "glowing-style",
    "rainbow-style",
    "pixelated-style",
    "vintage-style",
    "psychedelic-style"
  ];
  
  const openLightbox = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };
  
  const closeLightbox = () => {
    setSelectedImage(null);
  };
  
  return (
    <div className="gallery-container">
      {images.map((image, index) => (
        <div 
          key={index} 
          className={`gallery-item ${animationStyles[index % animationStyles.length]}`}
          onClick={() => openLightbox(image.url)}
        >
          <img src={image.url} alt={`Cleo in ${image.style}`} />
          <div className="overlay">
            <h4>{image.style}</h4>
            <p>{image.description}</p>
          </div>
        </div>
      ))}
      
      {selectedImage && (
        <div className="lightbox" onClick={closeLightbox}>
          <span className="close-lightbox">&times;</span>
          <img src={selectedImage} className="lightbox-content" alt="Expanded view of Cleo" />
        </div>
      )}
    </div>
  );
};

export default CleoGallery;