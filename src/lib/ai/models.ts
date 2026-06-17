import { createGoogleGenerativeAI } from '@ai-sdk/google';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
});

// Updating to the stable 2026 version that showed up in your curl
export const financeModel = google('gemini-2.5-flash');