import { useState, useEffect } from 'react';

const backgroundImages = [
  '/bg1.jpg',
  '/bg2.jpg',
  '/bg3.jpg',
];

export const useRotatingBackground = (intervalMs: number = 30000) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        (prevIndex + 1) % backgroundImages.length
      );
    }, intervalMs);

    return () => clearInterval(interval);
  }, [intervalMs]);

  return {
    currentBackground: backgroundImages[currentIndex],
    allBackgrounds: backgroundImages,
    currentIndex
  };
};