import React from 'react';

interface LovePoemProps {
  title: string;
  content: string;
}

const LovePoem: React.FC<LovePoemProps> = ({ title, content }) => {
  return (
    <div className="poem-card">
      <h3 className="poem-title">{title}</h3>
      <p className="poem-content">{content}</p>
    </div>
  );
};

export default LovePoem;