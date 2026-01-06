"use client";

import { useState } from 'react';
import type { Review } from '@/lib/data';
import { Card, CardContent } from '@/components/ui/card';
import { StarRating } from './star-rating';
import { format } from 'date-fns';
import { submitReview } from '@/app/actions';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useEffect, useRef } from 'react';

interface ReviewSectionProps {
  catererId: string;
  initialReviews: Review[];
}

const reviewSchema = z.object({
  rating: z.coerce.number().min(1, "Rating is required"),
  comment: z.string().min(10, "Comment must be at least 10 characters long."),
  author: z.string().min(2, "Name must be at least 2 characters long."),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

function ReviewForm({ catererId, onReviewSubmit }: { catererId: string; onReviewSubmit: (review: Review) => void }) {
  const { toast } = useToast();
  const formRef = useRef<HTMLFormElement>(null);
  
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0, comment: '', author: '' },
  });

  const [isPending, setPending] = useState(false);

  const handleSubmit = async (data: ReviewFormValues) => {
    setPending(true);
    const formData = new FormData();
    formData.append('catererId', catererId);
    formData.append('rating', String(data.rating));
    formData.append('comment', data.comment);
    formData.append('author', data.author);
    
    const result = await submitReview(formData);
    setPending(false);

    if (result.success && result.review) {
      toast({ title: 'Success!', description: 'Your review has been submitted.' });
      onReviewSubmit(result.review as Review);
      form.reset();
    } else {
      toast({ variant: 'destructive', title: 'Error', description: result.error });
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Leave a Review</h3>
        <Form {...form}>
          <form ref={formRef} onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <input type="hidden" name="catererId" value={catererId} />

            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Rating</FormLabel>
                  <FormControl>
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => field.onChange(star)}
                          className="text-2xl focus:outline-none"
                          aria-label={`Rate ${star} stars`}
                        >
                          <StarRating rating={field.value} maxRating={1} className={star <= field.value ? 'text-primary' : 'text-gray-300'}/>
                        </button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Review</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Share your experience..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending}>
              {isPending ? 'Submitting...' : 'Submit Review'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}


export function ReviewSection({ catererId, initialReviews }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);

  const handleReviewSubmit = (newReview: Review) => {
    setReviews([newReview, ...reviews]);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold">{review.author}</h4>
                  <p className="text-sm text-muted-foreground">
                    {format(new Date(review.date), 'MMMM d, yyyy')}
                  </p>
                </div>
                <StarRating rating={review.rating} />
              </div>
              <p className="mt-4 text-muted-foreground">{review.comment}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <ReviewForm catererId={catererId} onReviewSubmit={handleReviewSubmit} />
    </div>
  );
}
