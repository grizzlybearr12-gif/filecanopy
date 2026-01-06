'use client';

import { useState } from 'react';
import { caterers } from '@/lib/data';
import { CatererCard } from '@/components/caterer-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { AIRecommender } from '@/components/ai-recommender';
import { useToast } from '@/hooks/use-toast';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  const filteredCaterers = caterers.filter(
    caterer =>
      (caterer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        caterer.serviceArea.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-4">
          Find Your Perfect Caterer
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
          Discover, compare, and book the best catering services for any event.
          Let us help you make your occasion unforgettable.
        </p>
      </section>

      <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-8">
        <div className="relative w-full max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name or service area..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            aria-label="Search caterers"
          />
        </div>
        <AIRecommender />
      </div>

      {filteredCaterers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCaterers.map((caterer) => (
            <CatererCard key={caterer.id} caterer={caterer} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-lg text-muted-foreground">No caterers found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
