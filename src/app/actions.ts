"use server";

import { recommendCaterer } from "@/ai/flows/recommend";
import { caterers, type Caterer } from "@/lib/data";
import { z } from "zod";

const reviewSchema = z.object({
  catererId: z.string(),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(10, "Comment must be at least 10 characters long."),
  author: z.string().min(2, "Name must be at least 2 characters long."),
});

export async function submitReview(formData: FormData) {
  const validatedFields = reviewSchema.safeParse({
    catererId: formData.get('catererId'),
    rating: formData.get('rating'),
    comment: formData.get('comment'),
    author: formData.get('author'),
  });

  if (!validatedFields.success) {
    return {
      error: "Invalid data. Please check your submission.",
    };
  }

  // In a real app, you'd save this to a database.
  // For now, we'll just simulate a success response.
  console.log("New Review Submitted:", validatedFields.data);

  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate DB call

  return {
    success: true,
    review: {
      ...validatedFields.data,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
    }
  };
}

const aiPrefsSchema = z.object({
  cuisine: z.string(),
  budget: z.string(),
  eventType: z.string(),
});

export async function getAIRecommendation(preferences: z.infer<typeof aiPrefsSchema>): Promise<Caterer | null> {
  const validatedPrefs = aiPrefsSchema.safeParse(preferences);

  if (!validatedPrefs.success) {
    console.error("Invalid AI preferences:", validatedPrefs.error);
    return null;
  }

  // The AI flow needs the list of caterers to make a recommendation
  const recommendation = await recommendCaterer(validatedPrefs.data, caterers);
  return recommendation;
}
