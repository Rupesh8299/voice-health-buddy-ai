import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// TypeScript declarations for Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface ContinuousVoiceRecorderProps {
  onTranscriptChange: (transcript: string, isFinal: boolean) => void;
  onConversationModeChange: (isActive: boolean) => void;
  disabled?: boolean;
  autoListen?: boolean;
}

export const ContinuousVoiceRecorder: React.FC<ContinuousVoiceRecorderProps> = ({
  onTranscriptChange,
  onConversationModeChange,
  disabled = false,
  autoListen = false
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isConversationMode, setIsConversationMode] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());
  
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const restartTimerRef = useRef<NodeJS.Timeout | null>(null);

  const SILENCE_THRESHOLD = 3000; // 3 seconds of silence
  const RESTART_DELAY = 1000; // 1 second delay before restart

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;

    try {
      recognitionRef.current.start();
      setIsListening(true);
      setLastActivity(Date.now());
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, [isListening]);

  const restartListening = useCallback(() => {
    if (isConversationMode && !disabled) {
      restartTimerRef.current = setTimeout(() => {
        startListening();
      }, RESTART_DELAY);
    }
  }, [isConversationMode, disabled, startListening]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.maxAlternatives = 1;

        recognitionRef.current.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }

          setLastActivity(Date.now());
          
          if (finalTranscript) {
            onTranscriptChange(finalTranscript.trim(), true);
          } else if (interimTranscript) {
            onTranscriptChange(interimTranscript.trim(), false);
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          
          if (isConversationMode && event.error !== 'aborted') {
            restartListening();
          }
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          
          if (isConversationMode) {
            restartListening();
          }
        };
      }
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (restartTimerRef.current) {
        clearTimeout(restartTimerRef.current);
      }
    };
  }, [onTranscriptChange, isConversationMode, restartListening]);

  // Monitor silence in conversation mode
  useEffect(() => {
    if (isConversationMode && isListening) {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      
      silenceTimerRef.current = setTimeout(() => {
        const timeSinceLastActivity = Date.now() - lastActivity;
        if (timeSinceLastActivity >= SILENCE_THRESHOLD) {
          // User has been silent, pause listening briefly
          stopListening();
        }
      }, SILENCE_THRESHOLD);
    }

    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, [isConversationMode, isListening, lastActivity, stopListening]);

  const toggleConversationMode = () => {
    const newMode = !isConversationMode;
    setIsConversationMode(newMode);
    onConversationModeChange(newMode);
    
    if (newMode) {
      startListening();
    } else {
      stopListening();
      if (restartTimerRef.current) {
        clearTimeout(restartTimerRef.current);
      }
    }
  };

  const toggleSingleListen = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  if (!isSupported) {
    return (
      <div className="text-center p-4">
        <p className="text-muted-foreground text-sm">
          Speech recognition is not supported in your browser.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex items-center gap-3">
        {/* Conversation Mode Toggle */}
        <Button
          variant={isConversationMode ? "default" : "outline"}
          size="voice"
          onClick={toggleConversationMode}
          disabled={disabled}
          className={cn(
            "relative",
            isConversationMode && "animate-pulse-soft"
          )}
        >
          <Volume2 className="h-5 w-5" />
          {isConversationMode && (
            <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping" />
          )}
        </Button>

        {/* Single Listen Button */}
        <Button
          variant="voice"
          size="voice"
          onClick={toggleSingleListen}
          disabled={disabled || isConversationMode}
          className={cn(
            "relative",
            isListening && !isConversationMode && "animate-pulse-soft"
          )}
        >
          {isListening && !isConversationMode ? (
            <MicOff className="h-6 w-6" />
          ) : (
            <Mic className="h-6 w-6" />
          )}
          
          {isListening && !isConversationMode && (
            <div className="absolute inset-0 rounded-full border-2 border-accent animate-ping" />
          )}
        </Button>
      </div>
      
      <div className="text-center">
        <p className="text-sm font-medium">
          {isConversationMode ? (
            isListening ? "Conversation Active" : "Conversation Mode"
          ) : isListening ? (
            "Listening..."
          ) : (
            "Click to speak"
          )}
        </p>
        {isConversationMode && (
          <p className="text-xs text-muted-foreground mt-1">
            Real-time conversation mode enabled
          </p>
        )}
      </div>
    </div>
  );
};