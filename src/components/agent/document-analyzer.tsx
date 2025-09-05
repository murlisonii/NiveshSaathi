
'use client';

import { useState, useTransition } from 'react';
import { analyzeDocument, AnalyzeDocumentOutput } from '@/ai/flows/analyze-document';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2, Search, FileText } from 'lucide-react';

export function DocumentAnalyzer() {
    const [documentContent, setDocumentContent] = useState('');
    const [userQuestion, setUserQuestion] = useState('');
    const [result, setResult] = useState<AnalyzeDocumentOutput | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleAnalysis = () => {
        if (!documentContent || !userQuestion) {
            setError("Please provide both document content and a question.");
            return;
        }
        setError(null);
        setResult(null);

        startTransition(async () => {
            try {
                const analysisResult = await analyzeDocument({ documentContent, userQuestion });
                setResult(analysisResult);
            } catch (e: any) {
                setError("Failed to analyze the document. Please try again.");
            }
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Document Q&A</CardTitle>
                <CardDescription>
                    Paste content from a financial report or article and ask a specific question about it.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="document-content">
                       <FileText className="inline-block mr-2 h-4 w-4" />
                       Document Content
                    </Label>
                    <Textarea
                        id="document-content"
                        placeholder="Paste the text from your PDF or research document here..."
                        value={documentContent}
                        onChange={(e) => setDocumentContent(e.target.value)}
                        rows={12}
                        disabled={isPending}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="user-question">
                        <Search className="inline-block mr-2 h-4 w-4" />
                        Your Question
                    </Label>
                    <Input
                        id="user-question"
                        placeholder="e.g., 'What was the net profit in the last quarter?'"
                        value={userQuestion}
                        onChange={(e) => setUserQuestion(e.target.value)}
                        disabled={isPending}
                    />
                </div>
                
                <div className="text-center">
                    <Button onClick={handleAnalysis} disabled={isPending || !documentContent || !userQuestion}>
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Search className="mr-2 h-4 w-4" />}
                        {isPending ? 'Analyzing...' : 'Analyze Document'}
                    </Button>
                </div>

                {error && <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>}

                {result && (
                    <Alert>
                        <FileText className="h-4 w-4" />
                        <AlertTitle>Analysis Result</AlertTitle>
                        <AlertDescription className="whitespace-pre-wrap">
                            {result.answer}
                        </AlertDescription>
                    </Alert>
                )}
            </CardContent>
        </Card>
    )
}
