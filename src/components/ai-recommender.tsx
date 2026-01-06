"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getAIRecommendation } from '@/app/actions';
import type { Caterer } from '@/lib/data';
import { CatererCard } from './caterer-card';
import { Skeleton } from './ui/skeleton';

const formSchema = z.object({
  cuisine: z.string().min(2, { message: 'Cuisine must be at least 2 characters.' }),
  budget: z.enum(['economy', 'standard', 'premium']),
  eventType: z.string().min(3, { message: 'Event type must be at least 3 characters.' }),
});

export function AIRecommender() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Caterer | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cuisine: '',
      budget: 'standard',
      eventType: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    setError(null);
    try {
      const recommendation = await getAIRecommendation(values);
      if (recommendation) {
        setResult(recommendation);
      } else {
        setError('Could not find a suitable recommendation. Please try different criteria.');
      }
    } catch (err) {
      setError('An error occurred while getting recommendations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Reset state when closing
      form.reset();
      setIsLoading(false);
      setResult(null);
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 hover:text-accent-foreground">
          <Wand2 className="mr-2 h-5 w-5" />
          Get AI Recommendation
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">AI-Powered Recommendation</DialogTitle>
          <DialogDescription>
            Tell us about your event, and our AI will suggest the perfect caterer.
          </DialogDescription>
        </DialogHeader>
        
        {!result && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="cuisine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cuisine Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Italian, Mexican, BBQ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your budget range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="economy">Economy</SelectItem>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eventType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Event Type</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Wedding, Corporate, Birthday" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Thinking...' : 'Find Caterer'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}

        {isLoading && (
          <div className="space-y-4 pt-4">
            <Skeleton className="h-[125px] w-full rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-4/5" />
              <Skeleton className="h-4 w-3/5" />
            </div>
          </div>
        )}

        {result && !isLoading && (
          <div className="pt-4">
            <h3 className="text-lg font-semibold mb-4 text-center">Our Top Recommendation!</h3>
            <CatererCard caterer={result} />
          </div>
        )}

        {error && !isLoading && (
          <p className="text-destructive text-center pt-4">{error}</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
