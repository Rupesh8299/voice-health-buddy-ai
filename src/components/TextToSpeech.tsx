import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

interface TextToSpeechProps {
  text: string;
  autoPlay?: boolean;
  onSpeakingChange?: (isSpeaking: boolean) => void;
}

export const TextToSpeech: React.FC<TextToSpeechProps> = ({
  text,
  autoPlay = false,
  onSpeakingChange
}) => {
  const [isSpeaking, setIsSpeaking] = React.useState(false);
  const [isSupported, setIsSupported] = React.useState(true);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speakingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    if (text && autoPlay) {
      speak();
    }

    return () => {
      if (utteranceRef.current) {
        speechSynthesis.cancel();
      }
    };
  }, [text, autoPlay]);

  const speak = () => {
    if (!text || !isSupported) return;

    // Cancel any ongoing speech and clear timers
    speechSynthesis.cancel();
    if (speakingTimeoutRef.current) {
      clearTimeout(speakingTimeoutRef.current);
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    // Enhanced speech settings for better quality
    utterance.rate = 0.85; // Slightly slower for better comprehension
    utterance.pitch = 1;
    utterance.volume = 0.9;

    utterance.onstart = () => {
      setIsSpeaking(true);
      onSpeakingChange?.(true);
      console.log('TTS: Started speaking');
    };

    utterance.onend = () => {
      // Add a small delay to ensure complete audio finish
      speakingTimeoutRef.current = setTimeout(() => {
        setIsSpeaking(false);
        onSpeakingChange?.(false);
        console.log('TTS: Finished speaking');
      }, 200);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      onSpeakingChange?.(false);
      console.log('TTS: Error occurred');
    };

    // Add a small delay before speaking to ensure proper coordination
    setTimeout(() => {
      speechSynthesis.speak(utterance);
    }, 100);
  };

  const stop = () => {
    speechSynthesis.cancel();
    if (speakingTimeoutRef.current) {
      clearTimeout(speakingTimeoutRef.current);
    }
    setIsSpeaking(false);
    onSpeakingChange?.(false);
    console.log('TTS: Manually stopped');
  };

  if (!isSupported) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={isSpeaking ? stop : speak}
      disabled={!text}
      className="h-6 w-6 flex-shrink-0"
    >
      {isSpeaking ? (
        <VolumeX className="h-3 w-3" />
      ) : (
        <Volume2 className="h-3 w-3" />
      )}
    </Button>
  );
};