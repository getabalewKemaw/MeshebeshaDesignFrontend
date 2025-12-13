import { useState, useEffect } from 'react';

interface UseTypingAnimationOptions {
  text: string;
  speed?: number; // milliseconds per character
  delay?: number; // delay before starting animation
  onComplete?: () => void;
}

export function useTypingAnimation({
  text,
  speed = 50,
  delay = 0,
  onComplete,
}: UseTypingAnimationOptions) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    setDisplayedText('');
    setIsTyping(true);
    
    if (!text) return;

    let typingInterval: NodeJS.Timeout | null = null;
    
    const startTimeout = setTimeout(() => {
      let currentIndex = 0;
      
      typingInterval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          if (typingInterval) clearInterval(typingInterval);
          setIsTyping(false);
          onComplete?.();
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      if (typingInterval) clearInterval(typingInterval);
    };
  }, [text, speed, delay, onComplete]);

  return { displayedText, isTyping };
}

