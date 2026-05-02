import { createGoogleGenerativeAI } from '@ai-sdk/google';

export const googleAI = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});


export const financeModel = googleAI('gemini-1.5-flash');