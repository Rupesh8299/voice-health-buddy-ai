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

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utteranceRef.current = utterance;

    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    utterance.onstart = () => {
      setIsSpeaking(true);
      onSpeakingChange?.(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      onSpeakingChange?.(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      onSpeakingChange?.(false);
    };

    speechSynthesis.speak(utterance);
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    onSpeakingChange?.(false);
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