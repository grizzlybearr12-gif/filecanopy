import type { Caterer, Review } from '@/lib/data';

type Preferences = {
  cuisine: string;
  budget: string; // "economy", "standard", "premium"
  eventType: string;
};

// This is a mock AI function that simulates a recommendation engine.
export async function recommendCaterer(
  preferences: Preferences,
  caterers: Caterer[]
): Promise<Caterer | null> {
  // In a real scenario, this would be a call to a GenAI model.
  // For this mock, we'll use some simple logic.
  
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

  const cuisineLower = preferences.cuisine.toLowerCase();

  let suitableCaterers = caterers.filter(caterer => {
    // Check for cuisine keywords in description, menus, or reviews
    const inDescription = caterer.description.toLowerCase().includes(cuisineLower);
    const inMenus = caterer.menus.some(menu => 
      menu.category.toLowerCase().includes(cuisineLower) || 
      menu.items.some(item => item.name.toLowerCase().includes(cuisineLower))
    );
    const inReviews = caterer.reviews.some((review: Review) => 
      review.comment.toLowerCase().includes(cuisineLower)
    );
    
    return inDescription || inMenus || inReviews;
  });

  if (suitableCaterers.length === 0) {
    // If no specific cuisine match, fall back to all caterers
    suitableCaterers = [...caterers];
  }

  // Sort by rating as the primary factor
  suitableCaterers.sort((a, b) => b.rating - a.rating);

  return suitableCaterers[0] || null;
}
