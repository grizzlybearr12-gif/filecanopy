'use server';

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import type { Caterer } from '@/lib/data';

const PreferencesSchema = z.object({
  cuisine: z.string().describe('The desired cuisine type, e.g., "Italian", "BBQ"'),
  budget: z.string().describe('The budget level, e.g., "economy", "standard", "premium"'),
  eventType: z.string().describe('The type of event, e.g., "wedding", "corporate party"'),
});

// We only need a subset of caterer data for the AI to make a decision.
// This keeps the prompt concise and focused.
const CatererInfoSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  rating: z.number(),
  // Simplifying menus and reviews to just text for the AI to parse.
  menus: z.string(),
  reviews: z.string(),
});

const RecommendCatererInputSchema = z.object({
  preferences: PreferencesSchema,
  caterers: z.array(CatererInfoSchema),
});

// The AI will return only the ID of the recommended caterer.
const RecommendCatererOutputSchema = z.string().describe('The ID of the recommended caterer.');

const recommendationPrompt = ai.definePrompt({
  name: 'recommendationPrompt',
  input: { schema: RecommendCatererInputSchema },
  output: { schema: RecommendCatererOutputSchema },
  prompt: `You are an expert catering consultant. Your task is to recommend the single best caterer from the provided list based on the user's preferences.

Analyze the user's preferences for cuisine, budget, and event type. Then, review the list of available caterers, paying close attention to their descriptions, menus, and existing reviews to find the perfect match.

User Preferences:
- Cuisine: {{{preferences.cuisine}}}
- Budget: {{{preferences.budget}}}
- Event Type: {{{preferences.eventType}}}

Available Caterers:
{{#each caterers}}
- Caterer ID: {{{id}}}
  - Name: {{{name}}}
  - Description: {{{description}}}
  - Rating: {{{rating}}}
  - Menus: {{{menus}}}
  - Reviews: {{{reviews}}}
{{/each}}

Based on your analysis, return only the string ID of the single most suitable caterer. For example: "gourmet-delights"`,
});

const recommendCatererFlow = ai.defineFlow(
  {
    name: 'recommendCatererFlow',
    inputSchema: z.object({
      preferences: PreferencesSchema,
      caterers: z.custom<Caterer[]>(), // Accept the full Caterer type
    }),
    outputSchema: RecommendCatererOutputSchema,
  },
  async ({ preferences, caterers }) => {
    // Transform the full caterer data into the simplified format for the AI prompt.
    const catererInfoForAI = caterers.map(caterer => ({
      id: caterer.id,
      name: caterer.name,
      description: caterer.description,
      rating: caterer.rating,
      menus: caterer.menus.map(m => `${m.category}: ${m.items.map(i => i.name).join(', ')}`).join('; '),
      reviews: caterer.reviews.map(r => r.comment).join('; '),
    }));

    const { output } = await recommendationPrompt({
      preferences,
      caterers: catererInfoForAI,
    });
    return output!;
  }
);

// This is the exported function that will be called by the server action.
export async function recommendCaterer(input: {
  preferences: z.infer<typeof PreferencesSchema>;
  caterers: Caterer[];
}): Promise<string | null> {
  return await recommendCatererFlow(input);
}
