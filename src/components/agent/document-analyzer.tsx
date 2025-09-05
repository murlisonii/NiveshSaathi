
'use client';

import { useState, useTransition } from 'react';
import { analyzeDocument, AnalyzeDocumentOutput } from '@/ai/flows/analyze-document';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Loader2, Search, FileText, Image, Upload } from 'lucide-react';

export function DocumentAnalyzer() {
    const [documentContent, setDocumentContent] = useState('');
    const [imageDataUri, setImageDataUri] = useState('');
    const [fileName, setFileName] = useState('');
    const [userQuestion, setUserQuestion] = useState('');
    const [result, setResult] = useState<AnalyzeDocumentOutput | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            setImageDataUri('');
            setFileName('');
            return;
        }

        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setImageDataUri(e.target?.result as string);
                setFileName(file.name);
            };
            reader.readAsDataURL(file);
        } else {
            setError("Currently, only image files are supported. PDF support is coming soon.");
            setImageDataUri('');
            setFileName('');
        }
    };

    const handleAnalysis = () => {
        if (!documentContent && !imageDataUri) {
            setError("Please provide document content or upload an image.");
            return;
        }
         if (!userQuestion) {
            setError("Please provide a question.");
            return;
        }
        setError(null);
        setResult(null);

        startTransition(async () => {
            try {
                const analysisResult = await analyzeDocument({ documentContent, userQuestion, imageDataUri });
                setResult(analysisResult);
            } catch (e: any) {
                setError("Failed to analyze the document. Please try again.");
            }
        });
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Document Q&amp;A</CardTitle>
                <CardDescription>
                    Paste content from a financial report, upload a chart/graph, and ask a specific question about it.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="document-content">
                       <FileText className="inline-block mr-2 h-4 w-4" />
                       Document Content (Optional)
                    </Label>
                    <Textarea
                        id="document-content"
                        placeholder="Paste the text from your PDF or research document here..."
                        value={documentContent}
                        onChange={(e) => setDocumentContent(e.target.value)}
                        rows={8}
                        disabled={isPending}
                    />
                </div>
                
                 <div className="space-y-2">
                    <Label htmlFor="file-upload">
                       <Image className="inline-block mr-2 h-4 w-4" />
                       Upload Image/Chart (Optional)
                    </Label>
                    <div className="flex items-center gap-2">
                        <Button asChild variant="outline">
                             <label htmlFor="file-upload" className="cursor-pointer">
                                <Upload className="mr-2 h-4 w-4" />
                                Choose File
                             </label>
                        </Button>
                        <Input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            accept="image/*" 
                            disabled={isPending}
                        />
                        {fileName && <span className="text-sm text-muted-foreground">{fileName}</span>}
                    </div>
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
                    <Button onClick={handleAnalysis} disabled={isPending || (!documentContent && !imageDataUri) || !userQuestion}>
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
