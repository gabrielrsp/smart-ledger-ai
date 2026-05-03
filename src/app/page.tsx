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
    <main className="container mx-auto py-10 px-4 min-h-screen">
      <div className="flex flex-col items-center gap-8 text-center">
        <div className="space-y-2">
          <h1 className="text-5xl font-black tracking-tighter text-zinc-900">Finance AI</h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Sua inteligência financeira personalizada. Suba seu extrato e deixe o Gemini trabalhar.
          </p>
        </div>

        <FileUpload onDataExtracted={handleDataExtracted} />

        {isLoading && (
          <div className="flex items-center gap-2 text-zinc-500 animate-pulse">
            <span className="h-2 w-2 bg-zinc-500 rounded-full animate-bounce" />
            <p className="font-medium">Analisando suas finanças...</p>
          </div>
        )}

        {analysis && (
          <div className="w-full max-w-4xl mt-10 p-8 border rounded-3xl bg-white shadow-2xl text-left border-zinc-100 transition-all">
            <div className="flex items-center gap-3 mb-8 border-b pb-6">
              <div className="h-10 w-2 bg-zinc-900 rounded-full" />
              <h2 className="text-3xl font-bold text-zinc-900">Relatório Detalhado</h2>
            </div>

            {/* Ajustes para a tabela e tipografia */}
            <div className="prose prose-zinc max-w-none 
              prose-headings:text-zinc-900 prose-headings:font-bold
              prose-p:text-zinc-600 prose-p:leading-relaxed
              prose-strong:text-zinc-900
              prose-table:border prose-table:border-zinc-200 prose-table:rounded-lg
              prose-th:bg-zinc-50 prose-th:p-4 prose-th:text-zinc-900 prose-th:font-bold
              prose-td:p-4 prose-td:border-t prose-td:border-zinc-100">
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