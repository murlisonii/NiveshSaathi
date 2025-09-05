import { ChatInterface } from "@/components/chatbot/chat-interface";
import type { Metadata } from 'next';
import { Bot } from 'lucide-react';

export const metadata: Metadata = {
  title: 'AI Chatbot - Nivesh Saathi',
  description: 'Get instant answers to your investment questions in your local language.',
};

export default function ChatbotPage() {
  return (
    <div className="h-[calc(100vh-theme(spacing.16))] flex flex-col">
       <header className="p-4 border-b text-center bg-background z-10">
        <div className="container mx-auto flex items-center justify-center gap-3">
            <Bot className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-bold text-primary">Investor AI Assistant</h1>
        </div>
        <p className="text-sm text-muted-foreground">Ask me anything about investing!</p>
       </header>
       <div className="flex-1 overflow-y-auto">
        <ChatInterface />
       </div>
    </div>
  );
}
