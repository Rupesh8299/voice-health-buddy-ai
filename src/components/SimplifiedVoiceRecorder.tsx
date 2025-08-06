import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// TypeScript declarations for Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SimplifiedVoiceRecorderProps {
  onTranscriptChange: (transcript: string, isFinal: boolean) => void;
  onConversationModeChange: (isActive: boolean) => void;
  disabled?: boolean;
  isSpeaking?: boolean; // External TTS state
}

export const SimplifiedVoiceRecorder: React.FC<SimplifiedVoiceRecorderProps> = ({
  onTranscriptChange,
  onConversationModeChange,
  disabled = false,
  isSpeaking = false
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isConversationMode, setIsConversationMode] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [transcriptBuffer, setTranscriptBuffer] = useState('');
  
  const recognitionRef = useRef<any>(null);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pausedByTTSRef = useRef(false);

  console.log('🎤 Voice Recorder State:', { isListening, isConversationMode, isSpeaking, disabled });

  // Simple TTS coordination - pause listening when AI is speaking
  useEffect(() => {
    if (isSpeaking && isListening) {
      console.log('🔇 Pausing voice recognition - TTS speaking');
      pausedByTTSRef.current = true;
      stopListening();
    } else if (!isSpeaking && pausedByTTSRef.current && isConversationMode) {
      console.log('🎤 Resuming voice recognition - TTS finished');
      pausedByTTSRef.current = false;
      // Add a delay to ensure TTS audio has fully stopped
      setTimeout(() => {
        if (isConversationMode && !disabled) {
          startListening();
        }
      }, 500);
    }
  }, [isSpeaking]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening || disabled || isSpeaking) {
      console.log('🚫 Cannot start listening:', { hasRecognition: !!recognitionRef.current, isListening, disabled, isSpeaking });
      return;
    }

    try {
      console.log('🎤 Starting speech recognition...');
      recognitionRef.current.start();
      setIsListening(true);
      setTranscriptBuffer('');
    } catch (error) {
      console.error('❌ Error starting speech recognition:', error);
      setIsListening(false);
    }
  }, [isListening, disabled, isSpeaking]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      console.log('🛑 Stopping speech recognition...');
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, [isListening]);

  const scheduleRestart = useCallback(() => {
    if (isConversationMode && !disabled && !isSpeaking) {
      console.log('🔄 Scheduling recognition restart...');
      restartTimeoutRef.current = setTimeout(() => {
        if (isConversationMode && !disabled && !isSpeaking) {
          startListening();
        }
      }, 1000);
    }
  }, [isConversationMode, disabled, isSpeaking, startListening]);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        // Configure recognition
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        recognitionRef.current.maxAlternatives = 1;

        recognitionRef.current.onstart = () => {
          console.log('✅ Speech recognition started');
          setIsListening(true);
        };

        recognitionRef.current.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            const confidence = event.results[i][0].confidence || 0;
            
            if (event.results[i].isFinal) {
              // Only accept final results with reasonable confidence
              if (confidence > 0.6 || confidence === 0) { // confidence 0 means not provided
                finalTranscript += transcript;
                console.log('📝 Final transcript:', transcript, 'confidence:', confidence);
              }
            } else {
              interimTranscript += transcript;
            }
          }
          
          if (finalTranscript) {
            const cleanTranscript = finalTranscript.trim();
            setTranscriptBuffer(cleanTranscript);
            onTranscriptChange(cleanTranscript, true);
          } else if (interimTranscript && interimTranscript.trim().length > 1) {
            const cleanTranscript = interimTranscript.trim();
            setTranscriptBuffer(cleanTranscript);
            onTranscriptChange(cleanTranscript, false);
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error('❌ Speech recognition error:', event.error);
          setIsListening(false);
          
          // Handle different error types
          if (event.error === 'not-allowed') {
            console.error('🚫 Microphone permission denied');
            return;
          }
          
          if (event.error === 'network') {
            console.error('🌐 Network error in speech recognition');
            return;
          }
          
          // For other errors, restart if in conversation mode
          if (isConversationMode && event.error !== 'aborted') {
            console.log('🔄 Restarting after error...');
            scheduleRestart();
          }
        };

        recognitionRef.current.onend = () => {
          console.log('🔚 Speech recognition ended');
          setIsListening(false);
          
          // Auto-restart in conversation mode (but not if paused by TTS)
          if (isConversationMode && !pausedByTTSRef.current) {
            scheduleRestart();
          }
        };
      }
    } else {
      console.error('❌ Speech recognition not supported');
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
    };
  }, [onTranscriptChange, isConversationMode, scheduleRestart]);

  const toggleConversationMode = () => {
    const newMode = !isConversationMode;
    console.log('🔄 Toggling conversation mode:', newMode);
    
    setIsConversationMode(newMode);
    onConversationModeChange(newMode);
    
    // Clear any pending restarts
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
    
    if (newMode && !isSpeaking) {
      // Start conversation mode
      startListening();
    } else {
      // Stop conversation mode
      stopListening();
    }
  };

  const toggleSingleListen = () => {
    console.log('🎤 Toggling single listen mode');
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
      return isListening ? "Listening in conversation..." : "Conversation mode (paused)";
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
            isConversationMode && isListening && "animate-pulse-soft"
          )}
        >
          {isSpeaking ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Volume2 className="h-5 w-5" />
          )}
          {isConversationMode && isListening && !isSpeaking && (
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
            {isSpeaking ? "Waiting for AI to finish..." : "Real-time conversation enabled"}
          </p>
        )}
        {transcriptBuffer && (
          <p className="text-xs text-primary mt-2 max-w-xs truncate">
            "{transcriptBuffer}"
          </p>
        )}
      </div>
    </div>
  );
};