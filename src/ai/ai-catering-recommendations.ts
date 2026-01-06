'use server';

/**
 * @fileOverview AI-powered catering recommendations flow.
 *
 * This file defines a Genkit flow that provides personalized catering
 * provider recommendations based on user preferences (cuisine, budget, event type)
 * and incorporates existing reviews to suggest the most suitable options.
 *
 * - `getCateringRecommendations` - A function that takes user preferences and returns
 *   a list of recommended catering providers.
 * - `CateringRecommendationInput` - The input type for the `getCateringRecommendations` function.
 * - `CateringRecommendationOutput` - The return type for the `getCateringRecommendations` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CateringRecommendationInputSchema = z.object({
  cuisine: z.string().describe('The preferred cuisine type (e.g., Italian, Mexican, Indian).'),
  budget: z.string().describe('The budget for the catering service (e.g., Low, Medium, High).'),
  eventType: z.string().describe('The type of event (e.g., Wedding, Corporate, Party).'),
  reviews: z.array(z.string()).optional().describe('Existing reviews for catering providers.'),
});
export type CateringRecommendationInput = z.infer<typeof CateringRecommendationInputSchema>;

const CateringRecommendationOutputSchema = z.object({
  recommendations: z.array(
    z.object({
      providerName: z.string().describe('The name of the catering provider.'),
      phoneNumber: z.string().describe('The phone number of the catering provider.'),
      logoUrl: z.string().describe('URL of the catering provider logo.'),
      serviceAreas: z.string().describe('The service areas that catering provider serves in.'),
      rating: z.number().describe('The average rating of the catering provider.'),
      reviewsSummary: z.string().describe('A summary of the reviews for the catering provider.'),
    })
  ).describe('A list of recommended catering providers.'),
});
export type CateringRecommendationOutput = z.infer<typeof CateringRecommendationOutputSchema>;

export async function getCateringRecommendations(
  input: CateringRecommendationInput
): Promise<CateringRecommendationOutput> {
  return cateringRecommendationFlow(input);
}

const cateringRecommendationPrompt = ai.definePrompt({
  name: 'cateringRecommendationPrompt',
  input: {schema: CateringRecommendationInputSchema},
  output: {schema: CateringRecommendationOutputSchema},
  prompt: `You are an AI assistant that recommends catering providers based on user preferences and reviews.

  Consider the following user preferences:
  - Cuisine: {{{cuisine}}}
  - Budget: {{{budget}}}
  - Event Type: {{{eventType}}}

  {% if reviews %}
  Also, incorporate the following existing reviews:
  {{#each reviews}}
  - {{{this}}}
  {{/each}}
  {% else %}
  There are no reviews available.
  {% endif %}

  Recommend catering providers, providing provider name, phone number, logo URL, service areas, rating, and a summary of their reviews.
  Ensure that the recommendations align with the user's preferences and reflect the sentiment of the reviews.
  Use a format like this:
  {
    "recommendations": [
      {
        "providerName": "Provider Name 1",
        "phoneNumber": "+1-555-123-4567",
        "logoUrl": "https://example.com/logo1.png",
        "serviceAreas": "Los Angeles, CA",
        "rating": 4.5,
        "reviewsSummary": "Excellent food and service, highly recommended.",
      },
      {
        "providerName": "Provider Name 2",
        "phoneNumber": "+1-555-987-6543",
        "logoUrl": "https://example.com/logo2.png",
        "serviceAreas": "New York, NY",
        "rating": 3.8,
        "reviewsSummary": "Good food, but service can be slow at times.",
      },
    ]
  }
  `,
});

const cateringRecommendationFlow = ai.defineFlow(
  {
    name: 'cateringRecommendationFlow',
    inputSchema: CateringRecommendationInputSchema,
    outputSchema: CateringRecommendationOutputSchema,
  },
  async input => {
    const {output} = await cateringRecommendationPrompt(input);
    return output!;
  }
);
