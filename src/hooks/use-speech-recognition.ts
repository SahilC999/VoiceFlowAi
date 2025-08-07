"use client";

import { useState, useEffect, useRef, useCallback } from 'react';

type SpeechRecognitionHook = {
  isListening: boolean;
  startListening: () => void;
  stopListening: () => void;
  hasSupport: boolean;
};

const SpeechRecognition =
  typeof window !== 'undefined'
    ? window.SpeechRecognition || (window as any).webkitSpeechRecognition
    : null;

export const useSpeechRecognition = (
  onTranscriptChange: (currentTranscript: string) => void,
  initialText: string = ''
): SpeechRecognitionHook => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const textBeforeListen = useRef<string>('');
  const finalTranscriptRef = useRef<string>('');

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      textBeforeListen.current = initialText; // Capture text right before starting
      finalTranscriptRef.current = ''; // Reset final transcript for the new session
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error("Could not start speech recognition:", e)
      }
    }
  }, [isListening, initialText]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  useEffect(() => {
    if (!SpeechRecognition) {
      console.warn("Speech Recognition API is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let interimTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscriptRef.current += transcript.trim() + ' ';
        } else {
          interimTranscript += transcript;
        }
      }
      
      const separator = textBeforeListen.current.endsWith(' ') || textBeforeListen.current === '' ? '' : ' ';
      onTranscriptChange(textBeforeListen.current + separator + finalTranscriptRef.current + interimTranscript);
    };
    
    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    
    return () => {
        if(recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };
  }, [onTranscriptChange]);

  return { isListening, startListening, stopListening, hasSupport: !!SpeechRecognition };
};
