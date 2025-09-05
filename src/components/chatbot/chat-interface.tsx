
"use client";

import { useState, useRef, useEffect, useTransition } from 'react';
import { aiChatbotForInvestorQueries } from '@/ai/flows/ai-chatbot-for-investor-queries';
import { textToSpeech } from '@/ai/flows/text-to-speech';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, User, Bot, Loader2, Mic, MicOff, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AIChatbotForInvestorQueriesOutput } from '@/ai/flows/ai-chatbot-for-investor-queries';
import { useToast } from '@/hooks/use-toast';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

// Add SpeechRecognition to the window object
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const recognitionRef = useRef<any | null>(null);
  const { toast } = useToast();

  const handleSend = async (query: string) => {
    if (query.trim() === '') return;

    const userMessage: Message = { sender: 'user', text: query };
    setMessages(prev => [...prev, userMessage]);
    
    startTransition(async () => {
      // Get text response
      try {
        const result: AIChatbotForInvestorQueriesOutput = await aiChatbotForInvestorQueries({ query });
        
        if (result && result.response) {
          const botMessage: Message = { sender: 'bot', text: result.response };
          setMessages(prev => [...prev, botMessage]);

          // Get audio response
          try {
            const ttsResult = await textToSpeech({ text: result.response });
            if (ttsResult && ttsResult.audioDataUri) {
              if (audioRef.current) {
                audioRef.current.src = ttsResult.audioDataUri;
                audioRef.current.play().catch(e => console.error("Audio playback failed:", e));
              }
            }
          } catch (e) {
              console.error("Could not generate audio for the response:", e);
          }
        }
      } catch (e) {
        setMessages(prev => [...prev, {sender: 'bot', text: "Sorry, I encountered an error. Please try again."}]);
      }
    });
  };
  
  const handleStopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const handleMicClick = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast({
        title: "Feature Not Supported",
        description: "Your browser does not support Speech Recognition.",
        variant: "destructive",
      });
      return;
    }

    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US'; // Or detect user's language

    recognitionRef.current.onstart = () => {
      setIsListening(true);
    };

    recognitionRef.current.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      if (event.error === 'not-allowed') {
        toast({
          title: "Microphone Access Denied",
          description: "Please allow microphone access in your browser settings.",
          variant: "destructive",
        });
      }
      setIsListening(false);
    };

    recognitionRef.current.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result) => result.transcript)
        .join('');
      
      setInput(transcript);

      if (event.results[0].isFinal) {
        if(transcript.trim()) {
           handleSend(transcript);
        }
        setInput('');
      }
    };

    recognitionRef.current.start();
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages, isPending]);
  
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleSend(input);
      setInput('');
    }
  }

  return (
    <div className="flex flex-col h-full">
      <audio 
        ref={audioRef} 
        className="hidden"
        onPlay={() => setIsSpeaking(true)}
        onEnded={() => setIsSpeaking(false)}
        onPause={() => setIsSpeaking(false)}
       />
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="container mx-auto max-w-3xl space-y-6">
          {messages.map((msg, index) => (
            <div key={index} className={cn("flex items-start gap-4", msg.sender === 'user' ? 'justify-end' : '')}>
              {msg.sender === 'bot' && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback><Bot /></AvatarFallback>
                </Avatar>
              )}
              <div className={cn("max-w-[75%] p-3 rounded-lg", msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
               {msg.sender === 'user' && (
                <Avatar className="w-8 h-8">
                  <AvatarFallback><User /></AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isPending && (
             <div className="flex items-start gap-4">
                 <Avatar className="w-8 h-8">
                  <AvatarFallback><Bot /></AvatarFallback>
                </Avatar>
                <div className="bg-muted p-3 rounded-lg flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <div className="p-4 bg-background border-t">
        <div className="container mx-auto max-w-3xl">
          <form onSubmit={handleFormSubmit} className="flex items-center gap-2">
            {!isSpeaking ? (
                <Button type="button" variant="outline" size="icon" onClick={handleMicClick} disabled={isPending}>
                    {isListening ? <MicOff className="w-4 h-4 text-red-500" /> : <Mic className="w-4 h-4" />}
                    <span className="sr-only">Use Microphone</span>
                </Button>
            ) : (
                <Button type="button" variant="destructive" size="icon" onClick={handleStopAudio}>
                    <Square className="w-4 h-4" />
                    <span className="sr-only">Stop Speaking</span>
                </Button>
            )}
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isListening ? "Listening..." : "Ask a question in your local language..."}
              disabled={isPending || isSpeaking}
            />
            <Button type="submit" disabled={isPending || input.trim() === '' || isSpeaking} size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
