import React from 'react';

interface PrayerProps {
  title: string;
  content: string;
  special?: boolean;
}

const Prayer: React.FC<PrayerProps> = ({ title, content, special = false }) => {
  return (
    <div className={`prayer-card ${special ? 'special' : ''}`}>
      <h3 className="prayer-title">{title}</h3>
      <p className="prayer-content">{content}</p>
    </div>
  );
};

export default Prayer;