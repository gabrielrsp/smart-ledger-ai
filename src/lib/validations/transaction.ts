import { z } from 'zod';

export const TransactionSchema = z.object({
  date: z.string(),
  description: z.string(),
  amount: z.number(),
  category: z.string().optional(),
});

export type Transaction = z.infer<typeof TransactionSchema>;