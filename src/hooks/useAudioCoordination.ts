import { useRef, useCallback, useEffect } from 'react';

interface AudioCoordinationHook {
  isSpeakerActive: boolean;
  pauseListening: () => void;
  resumeListening: () => void;
  setSpeakerActive: (active: boolean) => void;
  canListen: boolean;
}

export const useAudioCoordination = (): AudioCoordinationHook => {
  const isSpeakerActiveRef = useRef(false);
  const pausedListeningRef = useRef(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);

  // Initialize audio context for monitoring
  useEffect(() => {
    const initAudioContext = async () => {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Get microphone access for monitoring
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: { 
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true 
          } 
        });
        micStreamRef.current = stream;

        const source = audioContextRef.current.createMediaStreamSource(stream);
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        source.connect(analyserRef.current);
      } catch (error) {
        console.warn('Audio coordination setup failed:', error);
      }
    };

    initAudioContext();

    return () => {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Monitor speaker output to detect when AI is speaking
  useEffect(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    let animationFrame: number;

    const monitorAudio = () => {
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);
        
        // Calculate average volume
        const avgVolume = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        
        // If speaker is active and we detect audio, it might be feedback
        if (isSpeakerActiveRef.current && avgVolume > 30) {
          // Detected potential feedback during TTS playback
          console.log('Audio coordination: Potential feedback detected, monitoring...');
        }
      }
      
      animationFrame = requestAnimationFrame(monitorAudio);
    };

    monitorAudio();

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  const setSpeakerActive = useCallback((active: boolean) => {
    isSpeakerActiveRef.current = active;
    
    if (active) {
      // Add a small delay to prevent immediate echo pickup
      setTimeout(() => {
        console.log('Audio coordination: Speaker active, monitoring for echo');
      }, 100);
    } else {
      console.log('Audio coordination: Speaker inactive');
    }
  }, []);

  const pauseListening = useCallback(() => {
    pausedListeningRef.current = true;
    console.log('Audio coordination: Listening paused');
  }, []);

  const resumeListening = useCallback(() => {
    // Add delay before resuming to avoid picking up tail end of TTS
    setTimeout(() => {
      pausedListeningRef.current = false;
      console.log('Audio coordination: Listening resumed');
    }, 500);
  }, []);

  const canListen = !isSpeakerActiveRef.current && !pausedListeningRef.current;

  return {
    isSpeakerActive: isSpeakerActiveRef.current,
    pauseListening,
    resumeListening,
    setSpeakerActive,
    canListen
  };
};