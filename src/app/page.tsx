'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/dashboard/FileUpload';
import { Transaction } from '@/lib/validations/transaction';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Dashboard () {
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleDataExtracted = async (data: Transaction[]) => {
    setIsLoading(true);
    setAnalysis('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactions: data }),
      });

      if (!response.ok) throw new Error('Erro na análise');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          setAnalysis((prev) => prev + chunk);
        }
      }
    } catch (error) {
      console.error('Falha ao analisar:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container mx-auto py-10 px-4">
      <div className="flex flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">Finance AI</h1>
        <p className="text-muted-foreground max-w-md">
          Sua inteligência financeira personalizada. Suba seu extrato e deixe o Gemini trabalhar.
        </p>

        <FileUpload onDataExtracted={handleDataExtracted} />

        {isLoading && <p className="animate-pulse">Analisando suas finanças...</p>}

        {analysis && (
          <div className="w-full max-w-3xl mt-10 p-6 border rounded-xl bg-card text-card-foreground shadow-sm text-left">
            <h2 className="text-2xl font-semibold mb-4">Análise da IA</h2>
            <div className="prose prose-zinc dark:prose-invert max-w-none prose-table:border prose-th:bg-muted prose-th:p-2 prose-td:p-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {analysis}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}