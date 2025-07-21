import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Square } from 'lucide-react';
import { cn } from '@/lib/utils';

// TypeScript declarations for Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface VoiceRecorderProps {
  onTranscriptChange: (transcript: string) => void;
  onRecordingStateChange: (isRecording: boolean) => void;
  disabled?: boolean;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
  onTranscriptChange,
  onRecordingStateChange,
  disabled = false
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          onTranscriptChange(transcript);
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
          onRecordingStateChange(false);
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
          onRecordingStateChange(false);
        };
      }
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onTranscriptChange, onRecordingStateChange]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
      setIsRecording(true);
      onRecordingStateChange(true);
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
      <Button
        variant="voice"
        size="voice"
        onClick={toggleRecording}
        disabled={disabled}
        className={cn(
          "relative",
          isRecording && "animate-pulse-soft"
        )}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
      >
        {isRecording ? (
          <Square className="h-6 w-6" />
        ) : (
          <Mic className="h-6 w-6" />
        )}
        
        {isRecording && (
          <div className="absolute inset-0 rounded-full border-2 border-accent animate-ping" />
        )}
      </Button>
      
      <p className="text-sm text-muted-foreground">
        {isRecording ? "Listening..." : "Click to speak"}
      </p>
    </div>
  );
};