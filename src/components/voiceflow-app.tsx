"use client";

import { useState, useEffect, useCallback } from 'react';
import { type Note } from '@/lib/types';
import { Button } from '@/components/ui/button';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FilePlus2, Trash2, Mic, Loader2, Download } from 'lucide-react';
import DictationEditor from './dictation-editor';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function VoiceFlowApp() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    try {
      const savedNotes = localStorage.getItem('voiceflow-notes');
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(parsedNotes);
        if (parsedNotes.length > 0) {
          setActiveNoteId(parsedNotes[0].id);
        }
      } else {
        createNewNote();
      }
    } catch (error) {
      console.error("Failed to load notes from localStorage", error);
    }
  }, []);

  useEffect(() => {
    if(isClient) {
      try {
        localStorage.setItem('voiceflow-notes', JSON.stringify(notes));
      } catch (error) {
        console.error("Failed to save notes to localStorage", error);
      }
    }
  }, [notes, isClient]);

  const createNewNote = () => {
    const newNote: Note = {
      id: `note_${Date.now()}`,
      title: 'New Note',
      content: '',
      createdAt: new Date().toISOString(),
    };
    setNotes((prev) => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
  };

  const deleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== noteId));
    if (activeNoteId === noteId) {
      const remainingNotes = notes.filter((note) => note.id !== noteId);
      setActiveNoteId(remainingNotes.length > 0 ? remainingNotes[0].id : null);
    }
  };

  const updateNoteContent = useCallback((noteId: string, content: string) => {
    setNotes((prev) =>
      prev.map((note) => {
        if (note.id === noteId) {
          const title = content.substring(0, 30).split('\n')[0] || 'New Note';
          return { ...note, content, title };
        }
        return note;
      })
    );
  }, []);
  
  const downloadNote = () => {
    if (!activeNote) return;

    const blob = new Blob([activeNote.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const safeTitle = activeNote.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `${safeTitle}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const activeNote = notes.find((note) => note.id === activeNoteId);

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background transition-colors duration-300">
        <Sidebar>
          <SidebarHeader className="border-b p-3">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" aria-label="Home">
                        <Mic className="h-5 w-5" />
                    </Button>
                    <h1 className="text-lg font-semibold">Dictation App</h1>
                </div>
                <Button variant="ghost" size="icon" onClick={createNewNote} aria-label="New Note">
                    <FilePlus2 />
                </Button>
            </div>
          </SidebarHeader>
          <SidebarContent className="p-0">
            <ScrollArea className="h-full">
              <SidebarMenu className="p-2">
                {notes.map((note) => (
                  <SidebarMenuItem key={note.id}>
                    <div className="group relative w-full">
                      <SidebarMenuButton
                        onClick={() => setActiveNoteId(note.id)}
                        isActive={activeNoteId === note.id}
                        className="h-auto flex-col items-start justify-start py-2 px-3 text-left transition-colors duration-200"
                      >
                        <span className="font-medium truncate w-full">{note.title}</span>
                        <span className="text-xs text-muted-foreground w-full truncate pt-1">
                          {note.content || 'No content yet...'}
                        </span>
                      </SidebarMenuButton>
                      <div className="absolute top-1/2 right-2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                         <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                                <Trash2 size={16} />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete your note.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteNote(note.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                      </div>
                    </div>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </ScrollArea>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className="p-0 m-0 rounded-none shadow-none md:m-0 md:rounded-none">
          <header className="flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 lg:px-6">
            <SidebarTrigger className="md:hidden"/>
            <div className="flex-1">
              {activeNote && (
                  <p className="text-sm text-muted-foreground animate-fade-in">
                    Last saved: {new Date(activeNote.createdAt).toLocaleString()}
                  </p>
              )}
            </div>
             {activeNote && (
                <Button variant="outline" size="sm" onClick={downloadNote} aria-label="Download note">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                </Button>
            )}
          </header>
          {isClient ? (
            activeNote ? (
              <DictationEditor
                key={activeNote.id}
                text={activeNote.content}
                onTextChange={(content) => updateNoteContent(activeNote.id, content)}
                activeNoteId={activeNote.id}
              />
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-center p-8 animate-fade-in">
                    <div className="p-4 bg-primary/10 rounded-full mb-4">
                      <Mic className="w-12 h-12 text-primary"/>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">No note selected</h2>
                    <p className="text-muted-foreground mb-6 max-w-md">Create a new note from the sidebar to start your dictation journey. Your words will be captured here.</p>
                    <Button onClick={createNewNote} className="transition-transform duration-200 hover:scale-105">
                        <FilePlus2 className="mr-2 h-4 w-4" />
                        Create Your First Note
                    </Button>
                </div>
            )
          ) : (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          )}
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
