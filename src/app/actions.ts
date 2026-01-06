'use server';

import { recommendCaterer } from '@/ai/flows/recommend';
import { caterers, type Caterer } from '@/lib/data';
import { z } from 'zod';

const reviewSchema = z.object({
  catererId: z.string(),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().min(10, 'Comment must be at least 10 characters long.'),
  author: z.string().min(2, 'Name must be at least 2 characters long.'),
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
      error: 'Invalid data. Please check your submission.',
    };
  }

  // In a real app, you'd save this to a database.
  // For now, we'll just simulate a success response.
  console.log('New Review Submitted:', validatedFields.data);

  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate DB call

  return {
    success: true,
    review: {
      ...validatedFields.data,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
    },
  };
}

const aiPrefsSchema = z.object({
  cuisine: z.string(),
  budget: z.string(),
  eventType: z.string(),
});

export async function getAIRecommendation(
  preferences: z.infer<typeof aiPrefsSchema>
): Promise<Caterer | null> {
  const validatedPrefs = aiPrefsSchema.safeParse(preferences);

  if (!validatedPrefs.success) {
    console.error('Invalid AI preferences:', validatedPrefs.error);
    return null;
  }

  // The AI flow needs the list of caterers and preferences to make a recommendation
  const recommendationId = await recommendCaterer({
    preferences: validatedPrefs.data,
    caterers,
  });

  if (!recommendationId) {
    return null;
  }

  // Find the full caterer object from the ID returned by the AI
  return caterers.find(c => c.id === recommendationId) || null;
}

export async function getCityFromCoordinates(latitude: number, longitude: number): Promise<{ city?: string; error?: string }> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error('Google Maps API key is not set.');
    return { error: 'Server configuration error.' };
  }

  const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK') {
      console.error('Geocoding API Error:', data.status, data.error_message);
      return { error: `Geocoding failed: ${data.status}` };
    }
    
    // Find the 'locality' component, which usually corresponds to the city
    for (const result of data.results) {
      for (const component of result.address_components) {
        if (component.types.includes('locality')) {
          return { city: component.long_name };
        }
      }
    }
    // Fallback if locality is not found
    for (const result of data.results) {
      for (const component of result.address_components) {
        if (component.types.includes('administrative_area_level_2')) {
          return { city: component.long_name };
        }
      }
    }

    return { error: 'Could not determine city from coordinates.' };
  } catch (error) {
    console.error('Error fetching from Geocoding API:', error);
    return { error: 'Failed to connect to location service.' };
  }
}
