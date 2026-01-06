import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  className?: string;
}

export function StarRating({ rating, maxRating = 5, className }: StarRatingProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {[...Array(maxRating)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            'h-5 w-5',
            i < rating
              ? 'text-primary fill-primary'
              : 'text-muted-foreground/50'
          )}
          aria-hidden="true"
        />
      ))}
      <span className="sr-only">Rating: {rating} out of {maxRating}</span>
    </div>
  );
}
