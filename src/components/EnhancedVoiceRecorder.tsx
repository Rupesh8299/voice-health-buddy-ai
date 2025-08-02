import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAudioCoordination } from '@/hooks/useAudioCoordination';

// TypeScript declarations for Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface EnhancedVoiceRecorderProps {
  onTranscriptChange: (transcript: string, isFinal: boolean) => void;
  onConversationModeChange: (isActive: boolean) => void;
  disabled?: boolean;
  isSpeaking?: boolean; // External speaking state from TTS
}

export const EnhancedVoiceRecorder: React.FC<EnhancedVoiceRecorderProps> = ({
  onTranscriptChange,
  onConversationModeChange,
  disabled = false,
  isSpeaking = false
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isConversationMode, setIsConversationMode] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [transcriptBuffer, setTranscriptBuffer] = useState('');
  const [confidenceScore, setConfidenceScore] = useState(0);
  
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const restartTimerRef = useRef<NodeJS.Timeout | null>(null);
  const confidenceThreshold = 0.7;
  
  const audioCoordination = useAudioCoordination();

  // Enhanced thresholds for better performance
  const SILENCE_THRESHOLD = 2500; // Reduced to 2.5 seconds
  const RESTART_DELAY = 800; // Reduced restart delay
  const TTS_PAUSE_DURATION = 1000; // Pause listening during TTS

  // Coordinate with TTS speaking state
  useEffect(() => {
    audioCoordination.setSpeakerActive(isSpeaking);
    
    if (isSpeaking && isListening && isConversationMode) {
      // Pause listening when TTS is speaking
      stopListening();
      
      // Resume listening after TTS finishes
      const resumeTimer = setTimeout(() => {
        if (isConversationMode && !disabled) {
          startListening();
        }
      }, TTS_PAUSE_DURATION);
      
      return () => clearTimeout(resumeTimer);
    }
  }, [isSpeaking, isListening, isConversationMode, disabled]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening || !audioCoordination.canListen) return;

    try {
      recognitionRef.current.start();
      setIsListening(true);
      setLastActivity(Date.now());
      setTranscriptBuffer('');
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    }
  }, [isListening, audioCoordination.canListen]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, [isListening]);

  const restartListening = useCallback(() => {
    if (isConversationMode && !disabled && !isSpeaking) {
      restartTimerRef.current = setTimeout(() => {
        startListening();
      }, RESTART_DELAY);
    }
  }, [isConversationMode, disabled, isSpeaking, startListening]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.maxAlternatives = 3; // Get multiple alternatives

        recognitionRef.current.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';
          let maxConfidence = 0;
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            const transcript = result[0].transcript;
            const confidence = result[0].confidence || 0;
            
            if (result.isFinal) {
              // Only use final results with sufficient confidence
              if (confidence > confidenceThreshold) {
                finalTranscript += transcript;
                maxConfidence = Math.max(maxConfidence, confidence);
              }
            } else {
              // Use interim results to show real-time feedback
              interimTranscript += transcript;
            }
          }

          setLastActivity(Date.now());
          setConfidenceScore(maxConfidence);
          
          if (finalTranscript) {
            setTranscriptBuffer(finalTranscript.trim());
            onTranscriptChange(finalTranscript.trim(), true);
          } else if (interimTranscript && interimTranscript.length > 2) {
            // Only show interim if it's substantial
            setTranscriptBuffer(interimTranscript.trim());
            onTranscriptChange(interimTranscript.trim(), false);
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsListening(false);
          
          // Only restart if it's not an intentional abort and we're in conversation mode
          if (isConversationMode && event.error !== 'aborted' && event.error !== 'not-allowed') {
            // Add delay before restarting on error
            setTimeout(() => {
              restartListening();
            }, 1500);
          }
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
          
          if (isConversationMode && !isSpeaking) {
            restartListening();
          }
        };

        recognitionRef.current.onstart = () => {
          console.log('Speech recognition started');
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
  }, [onTranscriptChange, isConversationMode, restartListening, isSpeaking]);

  // Enhanced silence detection
  useEffect(() => {
    if (isConversationMode && isListening && !isSpeaking) {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      
      silenceTimerRef.current = setTimeout(() => {
        const timeSinceLastActivity = Date.now() - lastActivity;
        if (timeSinceLastActivity >= SILENCE_THRESHOLD) {
          console.log('Silence detected, pausing recognition');
          stopListening();
        }
      }, SILENCE_THRESHOLD);
    }

    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, [isConversationMode, isListening, lastActivity, stopListening, isSpeaking]);

  const toggleConversationMode = () => {
    const newMode = !isConversationMode;
    setIsConversationMode(newMode);
    onConversationModeChange(newMode);
    
    if (newMode && !isSpeaking) {
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
    } else if (!isSpeaking) {
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

  const getListeningStatus = () => {
    if (isSpeaking) return "AI is speaking...";
    if (isConversationMode) {
      return isListening ? "Listening..." : "Conversation Mode";
    }
    return isListening ? "Listening..." : "Click to speak";
  };

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
          {isSpeaking ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
          {isConversationMode && !isSpeaking && (
            <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping" />
          )}
        </Button>

        {/* Single Listen Button */}
        <Button
          variant="voice"
          size="voice"
          onClick={toggleSingleListen}
          disabled={disabled || isConversationMode || isSpeaking}
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
          {getListeningStatus()}
        </p>
        {isConversationMode && (
          <p className="text-xs text-muted-foreground mt-1">
            {isSpeaking ? "AI response in progress" : "Real-time conversation mode enabled"}
          </p>
        )}
        {transcriptBuffer && (
          <p className="text-xs text-primary mt-2 max-w-xs truncate">
            "{transcriptBuffer}"
          </p>
        )}
        {confidenceScore > 0 && (
          <div className="mt-1">
            <div className="w-full bg-background rounded-full h-1">
              <div 
                className="bg-primary h-1 rounded-full transition-all duration-300" 
                style={{ width: `${confidenceScore * 100}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Confidence: {Math.round(confidenceScore * 100)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};