import { streamText } from 'ai';
import { financeModel } from '@/lib/ai/models';

export async function POST(req: Request) {
  try {
    const { transactions } = await req.json();

    if (!transactions) {
      return new Response('Nenhuma transação encontrada', { status: 400 });
    }

    const prompt = `Você é um analista financeiro senior. 
    Analise o seguinte array de transações que contém as colunas 'date', 'description' e 'amount'.
    Importante: Considere que os valores em 'amount' já estão em Reais (R$).

    Transações:
    ${JSON.stringify(transactions)}

    Gere um relatório formatado em Markdown com:
    1. Resumo de entradas e saídas.
    2. Análise por categoria (use a descrição para categorizar).
    3. 3 dicas específicas baseadas no comportamento de gastos.`;

    const result = await streamText({
      model: financeModel, 
      prompt: prompt
    });


    return result.toTextStreamResponse();
  } catch (error) {
    return new Response('Erro no servidor', { status: 500 });
  }
}