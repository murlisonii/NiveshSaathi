"use client";

import { useState } from 'react';
import { useFlowState } from "@genkit-ai/next/files/react";
import { translateAndSummarize } from '@/ai/flows/translate-and-summarize-financial-texts';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function SummarizerForm() {
  const [text, setText] = useState('');
  const [language, setLanguage] = useState('Hindi');
  const [run, {loading, result, error}] = useFlowState(translateAndSummarize);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text) return;
    await run({ text, language });
  };

  const languages = ["Hindi", "Tamil", "Bengali", "Marathi", "Telugu", "Gujarati"];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Card className="bg-white/50 dark:bg-black/50 border-transparent shadow-md">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="text-input" className="text-lg font-medium">Text to Translate & Summarize</Label>
              <Textarea
                id="text-input"
                placeholder="Paste jargon-heavy financial text here... (e.g., from a SEBI circular)"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={10}
                className="text-base"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="space-y-2 flex-grow">
                <Label htmlFor="language-select">Target Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger id="language-select" className="w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map(lang => (
                      <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="self-end w-full sm:w-auto" disabled={loading || !text}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      
      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      )}

      {result && (
        <div className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Translation ({language})</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{result.translatedText}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Summary ({language})</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground whitespace-pre-wrap">{result.summary}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
