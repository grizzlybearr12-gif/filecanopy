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
import { useAuth, useFirestore, useStorage } from '@/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useState } from 'react';

const providerSchema = z.object({
  name: z.string().min(2, 'Provider name must be at least 2 characters.'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number.'),
  serviceAreas: z.string().min(3, 'Please enter at least one service area.'),
  speciality: z.string().min(3, 'Please enter at least one speciality.'),
  description: z.string().min(20, 'Description must be at least 20 characters long.'),
  logo: z.any().refine(files => files?.length === 1, 'Logo is required.'),
});

type ProviderFormValues = z.infer<typeof providerSchema>;

export default function AddProviderPage() {
  const { toast } = useToast();
  const storage = useStorage();
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const onSubmit = async (data: ProviderFormValues) => {
    setIsSubmitting(true);
    try {
      const logoFile = data.logo[0];
      const storageRef = ref(storage, `provider-logos/${Date.now()}-${logoFile.name}`);
      const uploadResult = await uploadBytes(storageRef, logoFile);
      const downloadURL = await getDownloadURL(uploadResult.ref);

      const providerData = {
        ...data,
        logoUrl: downloadURL,
      };
      delete providerData.logo; // remove file object before logging

      console.log('Provider data submitted:', providerData);
      // In a real app, you would save this `providerData` to Firestore.
      toast({
        title: 'Submission Received!',
        description: "Thanks for adding your business. We'll review it shortly.",
      });
      form.reset();
    } catch (error) {
      console.error("Error uploading file: ", error);
      toast({
        variant: 'destructive',
        title: 'Upload Failed',
        description: 'There was an error uploading your logo. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
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
               <FormField
                control={form.control}
                name="logo"
                render={({ field: { value, onChange, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Logo</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/png, image/jpeg, image/gif"
                        onChange={(event) => {
                          onChange(event.target.files);
                        }}
                        {...fieldProps}
                      />
                    </FormControl>
                    <FormDescription>
                      Upload your company logo (PNG, JPG, or GIF).
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit for Review'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
