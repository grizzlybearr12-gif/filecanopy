import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Toaster } from "@/components/ui/toaster"
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'CaterEase',
  description: 'Find the best catering services for your events.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const bgImage = PlaceHolderImages.find(img => img.id === 'background-food');
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased', 'min-h-screen bg-background')}>
        <FirebaseClientProvider>
          {bgImage && (
            <Image
              src={bgImage.imageUrl}
              alt={bgImage.description}
              data-ai-hint={bgImage.imageHint}
              fill
              className="object-cover fixed inset-0 z-0"
              priority
              quality={100}
            />
          )}
          <div className="fixed inset-0 z-10 bg-black/50"></div>
          <div className="relative z-20 flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster />
        </FirebaseClientProvider>
      </body>
    </html>
  );
}
