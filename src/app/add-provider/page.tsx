'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const providerSchema = z.object({
  name: z.string().min(2, 'Provider name must be at least 2 characters.'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number.'),
  serviceAreas: z.string().min(3, 'Please enter at least one service area.'),
  speciality: z.string().min(3, 'Please enter at least one speciality.'),
  description: z.string().min(20, 'Description must be at least 20 characters long.'),
});

type ProviderFormValues = z.infer<typeof providerSchema>;

export default function AddProviderPage() {
  const { toast } = useToast();
  const form = useForm<ProviderFormValues>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      name: '',
      phoneNumber: '',
      serviceAreas: '',
      speciality: '',
      description: '',
    },
  });

  const onSubmit = (data: ProviderFormValues) => {
    console.log('Provider data submitted:', data);
    // In a real app, you would send this data to your backend.
    toast({
      title: 'Submission Received!',
      description: "Thanks for adding your business. We'll review it shortly.",
    });
    form.reset();
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Join CaterEase</CardTitle>
          <p className="text-muted-foreground">
            Fill out the form below to list your catering service on our platform.
          </p>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Catering Service Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Gourmet Delights" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 555-0101" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serviceAreas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Areas</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Metropolis, Gotham City" {...field} />
                    </FormControl>
                    <FormDescription>
                      Please list the areas you serve, separated by commas.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="speciality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialties</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., French Cuisine, Vegan, BBQ" {...field} />
                    </FormControl>
                    <FormDescription>
                      List your culinary specialties, separated by commas.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us about your catering service..."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Provide a brief overview of your services and what makes you unique.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg">Submit for Review</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
