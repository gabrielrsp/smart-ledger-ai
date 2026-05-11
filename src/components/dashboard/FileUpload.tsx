'use client';

import React from 'react';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/lib/validations/transaction';

export function FileUpload ({ onDataExtracted }: { onDataExtracted: (data: Transaction[]) => void }) {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true, // Tenta converter números e boletos automaticamente
      complete: (results) => {
        // Usamos any aqui no mapeamento para facilitar a busca pelas chaves variadas do CSV
        const parsedData = results.data.map((row: any) => {
          // 1. Normalização da Descrição (Prioridade máxima para a IA não se perder)
          const description =
            row.description ||
            row.descrição ||
            row.descricao ||
            row.Description ||
            row.Descrição ||
            row.memo ||
            'No description provided';

          // 2. Normalização do Valor (Trata strings, números e formatos BR)
          let cleanAmount = 0;
          const rawAmount = row.amount || row.valor || row.Amount || row.Valor || 0;

          if (typeof rawAmount === 'string') {
            // Se vier como "1.250,50", transforma em "1250.50"
            const sanitized = rawAmount.replace(/\./g, '').replace(',', '.');
            cleanAmount = parseFloat(sanitized);
          } else {
            cleanAmount = Number(rawAmount);
          }

          // 3. Normalização da Data
          const date = row.date || row.data || row.Date || row.Data || '';

          return {
            date: String(date),
            description: String(description),
            amount: isNaN(cleanAmount) ? 0 : cleanAmount,
          };
        });

        console.log("Extracted and normalized data:", parsedData);
        onDataExtracted(parsedData);
      },
    });
  };

  return (
    <div className="w-full max-w-xl flex flex-col items-center gap-4 p-8 border-2 border-dashed rounded-xl bg-muted/50 hover:bg-muted/80 transition-colors">
      <p className="text-sm text-muted-foreground text-center">
        Drag and drop your bank CSV here, or click to browse <br />
        <span className="text-xs italic">(Works with major international and local banking statements)</span>
      </p>

      <input
        type="file"
        accept=".csv"
        className="hidden"
        id="csv-upload"
        onChange={handleFileUpload}
      />

      <label htmlFor="csv-upload" className="cursor-pointer">
        <Button asChild>
          <span>Select File</span>
        </Button>
      </label>
    </div>
  );
}