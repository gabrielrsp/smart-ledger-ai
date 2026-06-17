'use client';

import React, { useState } from 'react';
import Papa from 'papaparse';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/lib/validations/transaction';

export function FileUpload ({ onDataExtracted }: { onDataExtracted: (data: Transaction[]) => void }) {
  const [isDragging, setIsDragging] = useState(false);

  // Centralized function to process the file (reused for click and drop)
  const processFile = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        const parsedData = results.data.map((row: any) => {
          const description =
            row.description || row.descrição || row.descricao || row.Description || row.memo || 'No description provided';

          let cleanAmount = 0;
          const rawAmount = row.amount || row.valor || row.Amount || row.Valor || 0;

          if (typeof rawAmount === 'string') {
            const sanitized = rawAmount.replace(/\./g, '').replace(',', '.');
            cleanAmount = parseFloat(sanitized);
          } else {
            cleanAmount = Number(rawAmount);
          }

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

  // Handler for manual selection via button
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  // Handlers for Drag and Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "text/csv") {
      processFile(file);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`w-full max-w-xl flex flex-col items-center gap-4 p-8 border-2 border-dashed rounded-xl transition-all duration-200 ${isDragging
          ? 'border-zinc-900 bg-zinc-100 scale-[1.02]'
          : 'border-muted-foreground/20 bg-muted/50 hover:bg-muted/80'
        }`}
    >
      <p className="text-sm text-muted-foreground text-center pointer-events-none">
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
          <span className="pointer-events-none">Select File</span>
        </Button>
      </label>
    </div>
  );
}