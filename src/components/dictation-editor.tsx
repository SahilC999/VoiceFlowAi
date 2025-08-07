"use client";

import { useState, type FC, useEffect } from 'react';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Mic, MicOff, Copy } from 'lucide-react';

interface DictationEditorProps {
  text: string;
  onTextChange: (newText: string) => void;
  activeNoteId: string | null;
}

const DictationEditor: FC<DictationEditorProps> = ({ text, onTextChange, activeNoteId }) => {
  const { toast } = useToast();
  
  const handleTranscriptChange = (transcript: string) => {
    onTextChange(transcript);
  };

  const { isListening, startListening, stopListening, hasSupport } = useSpeechRecognition(
    handleTranscriptChange,
    text
  );

  useEffect(() => {
    if (activeNoteId === null) {
      onTextChange('');
    }
  }, [activeNoteId, onTextChange]);

  const handleCopy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: "The note content has been copied.",
      });
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast({
        variant: 'destructive',
        title: "Copy failed",
        description: "Could not copy the text to your clipboard.",
      });
    }
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-6 bg-background animate-fade-in">
      <Card className="flex-1 flex flex-col w-full h-full shadow-lg border rounded-xl overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold tracking-tight">Dictation Pad</h2>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="outline" onClick={handleCopy} aria-label="Copy note content">
              <Copy />
            </Button>
            {hasSupport && (
              <Button
                size="icon"
                onClick={isListening ? stopListening : startListening}
                className={`transition-all duration-300 transform hover:scale-110 ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'}`}
                aria-label={isListening ? "Stop dictation" : "Start dictation"}
              >
                {isListening ? <MicOff /> : <Mic />}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0 flex-1 relative">
          <Textarea
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder="Start speaking or type here..."
            className="w-full h-full text-base resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 rounded-none p-6"
            aria-label="Dictation content"
          />
          {isListening && (
            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-background/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm shadow-md animate-pulse">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              Listening...
            </div>
          )}
        </CardContent>
      </Card>
      {!hasSupport && (
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Speech recognition is not supported by your browser.
        </div>
      )}
    </div>
  );
};

export default DictationEditor;
