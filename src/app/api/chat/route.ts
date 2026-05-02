import { financeModel } from '@/lib/ai/models';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: financeModel,
    system: 'Você é um consultor financeiro especializado em fintech. Seu objetivo é analisar transações bancárias e fornecer insights claros sobre economia e investimentos.',
    messages,
  });


  return result.toTextStreamResponse();
}