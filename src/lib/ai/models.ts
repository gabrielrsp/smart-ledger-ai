import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

// Atualizando para a versão estável de 2026 que apareceu no seu curl
export const financeModel = google('gemini-2.5-flash');