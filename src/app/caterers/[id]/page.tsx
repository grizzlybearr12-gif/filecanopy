import { caterers } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Phone, MapPin, GalleryHorizontalEnd, UtensilsCrossed, MessageSquare } from 'lucide-react';
import { StarRating } from '@/components/star-rating';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Separator } from '@/components/ui/separator';
import { ReviewSection } from '@/components/review-section';
import { Badge } from '@/components/ui/badge';

interface CatererPageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  return caterers.map((caterer) => ({
    id: caterer.id,
  }));
}

export default function CatererPage({ params }: CatererPageProps) {
  const caterer = caterers.find((c) => c.id === params.id);

  if (!caterer) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="md:col-span-1 space-y-6">
          <div className="p-6 bg-card text-card-foreground rounded-lg shadow-sm border">
            <div className="flex flex-col items-center text-center">
              <Image
                src={caterer.logo.imageUrl}
                alt={`${caterer.name} logo`}
                data-ai-hint={caterer.logo.imageHint}
                width={120}
                height={120}
                className="rounded-full border-4 border-primary mb-4"
              />
              <h1 className="text-3xl font-headline font-bold">{caterer.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <StarRating rating={caterer.rating} />
                <span className="text-sm text-muted-foreground">({caterer.reviewsCount} reviews)</span>
              </div>
            </div>
            <Separator className="my-6" />
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{caterer.phone}</span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-muted-foreground">{caterer.serviceArea}</span>
              </div>
            </div>
          </div>
          <p className="p-6 bg-card text-card-foreground rounded-lg shadow-sm border text-muted-foreground">{caterer.description}</p>
        </div>

        {/* Right Column */}
        <div className="md:col-span-2 space-y-8">
          {/* Gallery */}
          <section>
            <h2 className="text-2xl font-headline font-semibold flex items-center gap-3 mb-4">
              <GalleryHorizontalEnd className="h-6 w-6 text-primary" />
              Gallery
            </h2>
            <Carousel className="w-full">
              <CarouselContent>
                {caterer.gallery.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-video relative overflow-hidden rounded-lg">
                      <Image
                        src={image.imageUrl}
                        alt={`Gallery image ${index + 1} for ${caterer.name}`}
                        data-ai-hint={image.imageHint}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </section>

          {/* Menus */}
          <section>
            <h2 className="text-2xl font-headline font-semibold flex items-center gap-3 mb-4">
              <UtensilsCrossed className="h-6 w-6 text-primary" />
              Menus
            </h2>
            <Accordion type="single" collapsible className="w-full rounded-lg border">
              {caterer.menus.map((menu, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="px-6">{menu.category}</AccordionTrigger>
                  <AccordionContent className="px-6">
                    <ul className="space-y-4">
                      {menu.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          {/* Reviews */}
          <section>
            <h2 className="text-2xl font-headline font-semibold flex items-center gap-3 mb-4">
              <MessageSquare className="h-6 w-6 text-primary" />
              Reviews & Ratings
            </h2>
            <ReviewSection catererId={caterer.id} initialReviews={caterer.reviews} />
          </section>
        </div>
      </div>
    </div>
  );
}
