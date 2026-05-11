'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/dashboard/FileUpload';
import { Transaction } from '@/lib/validations/transaction';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Dashboard () {
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleDataExtracted = async (data: Transaction[]) => {
    setTransactions(data);
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
      console.error('Fail on analysis:', error);
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
            Personalized financial insights at your fingertips. Upload your bank statement and let Gemini take over.
          </p>
        </div>

        {/* 2. Área de Upload */}
        <FileUpload onDataExtracted={handleDataExtracted} />

        {/* 3. Cards de Resumo */}
        {transactions.length > 0 && (
          <div className="mt-8 w-full flex justify-center px-4">
            <SummaryCards data={transactions} />
          </div>
        )}

        {/* 4. Feedback de Carregamento da IA (Skeleton + Texto) */}
        {isLoading && !analysis && (
          <div className="w-full max-w-4xl mt-10 flex flex-col items-center gap-6">

            {/* O aviso por escrito que você gosta */}
            <div className="flex items-center gap-2 text-zinc-500 animate-pulse">
              <span className="h-2 w-2 bg-zinc-500 rounded-full animate-bounce" />
              <p className="font-medium">Processing your financial data...</p>
            </div>

            {/* O Skeleton logo abaixo */}
            <div className="w-full p-8 border rounded-3xl bg-white shadow-sm space-y-6 text-left">
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="h-10 w-2 rounded-full bg-zinc-200" />
                <Skeleton className="h-8 w-64 bg-zinc-200" />
              </div>

              <div className="space-y-3">
                <Skeleton className="h-4 w-full bg-zinc-100" />
                <Skeleton className="h-4 w-[92%] bg-zinc-100" />
                <Skeleton className="h-4 w-[85%] bg-zinc-100" />
              </div>

              <div className="pt-8 border-t border-zinc-50">
                <div className="grid grid-cols-2 gap-4">
                  <Skeleton className="h-20 w-full bg-zinc-50 rounded-xl" />
                  <Skeleton className="h-20 w-full bg-zinc-50 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. Relatório Detalhado (Markdown) */}
        {analysis && (
          <div className="w-full max-w-4xl mt-10 p-8 border rounded-3xl bg-white shadow-2xl text-left border-zinc-100 transition-all animate-in fade-in duration-700">
            <div className="flex items-center gap-3 mb-8 border-b pb-6">
              <div className="h-10 w-2 bg-zinc-900 rounded-full" />
              <h2 className="text-3xl font-bold text-zinc-900">Financial Analysis Report</h2>
            </div>

            <div className="prose prose-zinc max-w-none 
          prose-table:border prose-table:border-zinc-200 prose-table:rounded-lg
          prose-th:bg-zinc-50 prose-th:p-4 prose-th:text-zinc-900
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