"use client";

import { useState, useRef, useEffect, useTransition } from 'react';
import { aiChatbotForInvestorQueries } from '@/ai/flows/ai-chatbot-for-investor-queries';
import { textToSpeech } from '@/ai/flows/text-to-speech';

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, User, Bot, Loader2, Volume2, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AIChatbotForInvestorQueriesOutput } from '@/ai/flows/ai-chatbot-for-investor-queries';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    const currentInput = input;
    setInput('');

    startTransition(async () => {
      // Get text response
      const result: AIChatbotForInvestorQueriesOutput = await aiChatbotForInvestorQueries({ query: currentInput });
      
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
    });
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  }, [messages, isPending]);

  return (
    <div className="flex flex-col h-full">
      <audio ref={audioRef} className="hidden" />
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
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" disabled>
                <Mic className="w-4 h-4" />
                <span className="sr-only">Use Microphone (coming soon)</span>
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isPending && handleSend()}
              placeholder="Ask a question in your local language..."
              disabled={isPending}
            />
            <Button onClick={handleSend} disabled={isPending || input.trim() === ''} size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
