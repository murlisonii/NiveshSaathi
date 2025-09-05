
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot } from 'lucide-react';
import { PortfolioAnalysis } from './portfolio-analysis';
import { DocumentAnalyzer } from './document-analyzer';

export function AgentDashboard() {

  return (
    <div className="space-y-8">
       <header className="flex flex-col items-center text-center space-y-4">
        <div className="p-3 rounded-full bg-primary/10">
            <Bot className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-bold text-primary">Your Personalized AI Agent</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
            Get tailored insights and suggestions based on your virtual portfolio and risk profile.
        </p>
      </header>
      
      <Tabs defaultValue="portfolio-analysis" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="portfolio-analysis">Portfolio Analysis</TabsTrigger>
          <TabsTrigger value="document-qa">Document Q&A</TabsTrigger>
          <TabsTrigger value="chat" disabled>General Chat (Coming Soon)</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio-analysis">
          <PortfolioAnalysis />
        </TabsContent>

        <TabsContent value="document-qa">
           <DocumentAnalyzer />
        </TabsContent>
        
        <TabsContent value="chat">
           <p className="text-center text-muted-foreground p-8">A fully conversational agent is coming soon!</p>
        </TabsContent>
      </Tabs>
    </div>
  );
}
