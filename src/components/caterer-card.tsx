import Link from 'next/link';
import Image from 'next/image';
import type { Caterer } from '@/lib/data';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { StarRating } from '@/components/star-rating';
import { MapPin, Phone } from 'lucide-react';
import { Badge } from './ui/badge';

interface CatererCardProps {
  caterer: Caterer;
}

export function CatererCard({ caterer }: CatererCardProps) {
  return (
    <Link href={`/caterers/${caterer.id}`} className="group" prefetch={false}>
      <Card className="h-full flex flex-col transition-all duration-300 ease-in-out group-hover:shadow-lg group-hover:-translate-y-1">
        <CardHeader className="flex flex-row items-center gap-4">
          <Image
            src={caterer.logo.imageUrl}
            alt={`${caterer.name} logo`}
            data-ai-hint={caterer.logo.imageHint}
            width={60}
            height={60}
            className="rounded-full border"
          />
          <div className="flex-1">
            <CardTitle className="font-headline text-2xl">{caterer.name}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
               <StarRating rating={caterer.rating} />
               <span className="text-xs text-muted-foreground">({caterer.reviewsCount} reviews)</span>
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground line-clamp-3">
            {caterer.description}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{caterer.serviceArea}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4 text-primary" />
            <span>{caterer.phone}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
