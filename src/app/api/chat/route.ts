import { streamText } from 'ai';
import { financeModel } from '@/lib/ai/models';

export async function POST(req: Request) {
  try {
    const { transactions } = await req.json();

    if (!transactions || transactions.length === 0) {
      return new Response('No transactions found', { status: 400 });
    }

    const prompt = `You are a Senior Financial Analyst. 
    Analyze the following array of transactions containing 'date', 'description', and 'amount'.
    Note: All 'amount' values are in US Dollars ($).

    Transactions:
    ${JSON.stringify(transactions)}

    Generate a detailed report in English using Markdown formatting:
    1. A brief executive summary of total income vs. expenses.
    2. Categorized analysis (automatically categorize based on descriptions). Use Markdown tables for clarity.
    3. Provide 3 specific, actionable financial tips based on the user's spending behavior.
    
    Maintain a professional and helpful tone. Ensure the output is concise and easy to read.`;

    const result = await streamText({
      model: financeModel, 
      prompt: prompt
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('API Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}